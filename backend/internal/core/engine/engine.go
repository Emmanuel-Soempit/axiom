package engine

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	"go-backend-template/ent"
	"go-backend-template/internal/core/audit"
	"go-backend-template/internal/core/llm"
	"go-backend-template/internal/core/registry"
	registrydtos "go-backend-template/internal/core/registry/dtos"
	"go-backend-template/internal/core/validation"

	"github.com/google/uuid"
)

const systemPrompt = `You are the Embedded Agent Controller — an intent mediation engine.
Translate user input into one or more structured actions (tools) from the available set.
Only invoke actions that exist in the provided tool list. If no action fits, respond in natural language.`

// ProcessResult is returned to callers of Process.
type ProcessResult struct {
	SessionID uuid.UUID     `json:"session_id"`
	Messages  []llm.Message `json:"messages"`
}

// Engine is the central orchestration logic.
type Engine interface {
	// Process handles a single user turn. If sessionID is uuid.Nil a new
	// session is created. The returned Messages slice contains the newly
	// produced messages for this turn (user + assistant/action_result).
	Process(ctx context.Context, sessionID uuid.UUID, projectID string, userID int, input string) (*ProcessResult, error)

	// History returns the full message history for a session, oldest first.
	History(ctx context.Context, sessionID uuid.UUID) ([]llm.Message, error)
}

type agentEngine struct {
	registry  registry.Registry
	llm       llm.Provider
	auditor   audit.Auditor
	validator validation.Validator
	store     MessageStore
}

func NewEngine(
	registry registry.Registry,
	llm llm.Provider,
	auditor audit.Auditor,
	validator validation.Validator,
	store MessageStore,
) Engine {
	if store == nil {
		store = NewInMemoryMessageStore()
	}
	return &agentEngine{
		registry:  registry,
		llm:       llm,
		auditor:   auditor,
		validator: validator,
		store:     store,
	}
}

// auditFailure writes a failure record and returns the original error wrapped.
func (e *agentEngine) auditFailure(ctx context.Context, projectID, userID, input string, reason string, err error) error {
	_ = e.auditor.Record(ctx, &audit.AuditRecordDto{
		ProjectID:      projectID,
		UserID:         userID,
		Prompt:         input,
		ProposedAction: "",
		Validated:      false,
		FinalResponse:  map[string]interface{}{"reason": reason, "error": err.Error()},
	})
	return err
}

func (e *agentEngine) Process(ctx context.Context, sessionID uuid.UUID, projectID string, userID int, input string) (*ProcessResult, error) {
	if sessionID == uuid.Nil {
		sessionID = uuid.New()
	}

	userIDStr := strconv.Itoa(userID)

	// 1. Load Actions for this project
	if err := e.registry.LoadActions(ctx, projectID); err != nil {
		return nil, e.auditFailure(ctx, projectID, userIDStr, input, "load_actions", fmt.Errorf("failed to load actions: %w", err))
	}

	// 2. Build the conversation: system prompt + prior history + new user turn
	history, err := e.store.List(ctx, sessionID)
	if err != nil {
		return nil, e.auditFailure(ctx, projectID, userIDStr, input, "load_history", fmt.Errorf("failed to load history: %w", err))
	}

	userMsg := llm.Message{Role: llm.RoleUser, Content: input}

	convo := make([]llm.Message, 0, len(history)+2)
	if len(history) == 0 {
		convo = append(convo, llm.Message{Role: llm.RoleSystem, Content: systemPrompt})
	}
	convo = append(convo, history...)
	convo = append(convo, userMsg)

	// 3. Advertise Actions as tools to the LLM
	tools := buildToolsFromActions(e.registry.ListActions())

	// 4. Call LLM
	resp, err := e.llm.Chat(ctx, convo, tools)
	if err != nil {
		return nil, e.auditFailure(ctx, projectID, userIDStr, input, "llm_chat", fmt.Errorf("llm error: %w", err))
	}

	// 4b. Fallback: if the model only emitted tool_calls with no content,
	// ask it for a brief natural-language explanation in a follow-up call.
	if resp.Content == "" && len(resp.ToolCalls) > 0 {
		var sb strings.Builder
		sb.WriteString("You proposed these actions:\n")
		for _, tc := range resp.ToolCalls {
			sb.WriteString(fmt.Sprintf("- %s: %v\n", tc.Name, tc.Arguments))
		}
		sb.WriteString("Provide a brief 1-sentence natural language explanation.")
		explainConvo := append(convo, llm.Message{Role: llm.RoleUser, Content: sb.String()})
		explainResp, err := e.llm.Chat(ctx, explainConvo, nil)
		if err == nil {
			resp.Content = explainResp.Content
		}
	}

	// 5. Persist the user message (only after LLM succeeds)
	if err := e.store.Append(ctx, sessionID, userMsg); err != nil {
		return nil, e.auditFailure(ctx, projectID, userIDStr, input, "persist_user_message", fmt.Errorf("failed to persist user message: %w", err))
	}

	produced := []llm.Message{userMsg}

	// 6. If no tool calls were proposed, store/return the plain reply
	if len(resp.ToolCalls) == 0 {
		assistantMsg := llm.Message{Role: llm.RoleAssistant, Content: resp.Content}
		if err := e.store.Append(ctx, sessionID, assistantMsg); err != nil {
			return nil, e.auditFailure(ctx, projectID, userIDStr, input, "persist_assistant_message", fmt.Errorf("failed to persist assistant message: %w", err))
		}
		produced = append(produced, assistantMsg)
		return &ProcessResult{SessionID: sessionID, Messages: produced}, nil
	}

	// 7. Validate every proposed tool call and persist the outcome
	for _, tc := range resp.ToolCalls {
		action, ok := e.registry.GetAction(tc.Name)
		if !ok {
			err := fmt.Errorf("action not found in registry: %s", tc.Name)
			return nil, e.auditFailure(ctx, projectID, userIDStr, input, "action_not_found", err)
		}

		validationResponse, err := e.validator.Validate(&ctx, map[string]any{
			"action": action,
			"params": tc.Arguments,
		})
		if err != nil {
			return nil, e.auditFailure(ctx, projectID, userIDStr, input, "validation_error", fmt.Errorf("validation error for %s: %w", tc.Name, err))
		}
		if !validationResponse.Valid {
			err := fmt.Errorf("validation failed for %s: %v", tc.Name, validationResponse.Errors)
			return nil, e.auditFailure(ctx, projectID, userIDStr, input, "validation_failed", err)
		}

		assistantMsg := llm.Message{
			Role:       llm.RoleAssistant,
			Content:    resp.Content, // may be empty when the model only emits tool_calls
			ActionName: tc.Name,
			CallID:     tc.ID,
			Arguments:  tc.Arguments,
			OPADecision: map[string]interface{}{
				"valid":  validationResponse.Valid,
				"errors": validationResponse.Errors,
			},
		}
		if err := e.store.Append(ctx, sessionID, assistantMsg); err != nil {
			return nil, e.auditFailure(ctx, projectID, userIDStr, input, "persist_tool_message", fmt.Errorf("failed to persist assistant message: %w", err))
		}
		produced = append(produced, assistantMsg)

		// Audit each validated action
		_ = e.auditor.Record(ctx, &audit.AuditRecordDto{
			ProjectID:      projectID,
			UserID:         userIDStr,
			Prompt:         input,
			ProposedAction: tc.Arguments,
			Validated:      true,
			FinalResponse:  map[string]interface{}{"action": tc.Name, "arguments": tc.Arguments},
		})
	}

	return &ProcessResult{SessionID: sessionID, Messages: produced}, nil
}

func (e *agentEngine) History(ctx context.Context, sessionID uuid.UUID) ([]llm.Message, error) {
	if sessionID == uuid.Nil {
		return nil, fmt.Errorf("session_id is required")
	}
	return e.store.List(ctx, sessionID)
}

// buildToolsFromActions converts registered ActionModels into OpenAI/Groq
// tool definitions so the LLM can invoke them natively.
func buildToolsFromActions(actions []*ent.ActionModel) []llm.Tool {
	tools := make([]llm.Tool, 0, len(actions))
	for _, a := range actions {
		tools = append(tools, llm.Tool{
			Type: "function",
			Function: llm.ToolFunction{
				Name:        a.Name,
				Description: a.Description,
				Parameters:  toJSONSchema(a.Parameters),
			},
		})
	}
	return tools
}

// toJSONSchema converts our internal ParameterSchema map into a JSON-Schema
// object suitable for OpenAI/Groq tool parameter definitions.
func toJSONSchema(params map[string]*registrydtos.ParameterSchema) map[string]interface{} {
	properties := map[string]interface{}{}
	required := []string{}

	for name, p := range params {
		properties[name] = parameterSchemaToJSON(p)
		if p.Required {
			required = append(required, name)
		}
	}

	schema := map[string]interface{}{
		"type":       "object",
		"properties": properties,
	}
	if len(required) > 0 {
		schema["required"] = required
	}
	return schema
}

func parameterSchemaToJSON(p *registrydtos.ParameterSchema) map[string]interface{} {
	out := map[string]interface{}{"type": string(p.Type)}
	if p.Description != "" {
		out["description"] = p.Description
	}
	if p.Default != nil {
		out["default"] = p.Default
	}
	if len(p.Properties) > 0 {
		nested := map[string]interface{}{}
		for k, v := range p.Properties {
			nested[k] = parameterSchemaToJSON(v)
		}
		out["properties"] = nested
	}
	if p.Items != nil {
		out["items"] = parameterSchemaToJSON(p.Items)
	}
	if p.Constraints != nil {
		if len(p.Constraints.Enum) > 0 {
			out["enum"] = p.Constraints.Enum
		}
		if p.Constraints.Min != nil {
			out["minimum"] = *p.Constraints.Min
		}
		if p.Constraints.Max != nil {
			out["maximum"] = *p.Constraints.Max
		}
		if p.Constraints.MinLength != nil {
			out["minLength"] = *p.Constraints.MinLength
		}
		if p.Constraints.MaxLength != nil {
			out["maxLength"] = *p.Constraints.MaxLength
		}
	}
	return out
}
