package engine

import (
	"context"
	"encoding/json"
	"fmt"
	"go-backend-template/internal/core/audit"
	"go-backend-template/internal/core/llm"
	"go-backend-template/internal/core/registry"
	"go-backend-template/internal/core/validation"
)

// Engine is the central orchestration logic.
type Engine interface {
	Process(ctx context.Context, input string, projectID string) (*llm.Response, error)
}

type agentEngine struct {
	registry  registry.Registry
	llm       llm.Provider
	auditor   audit.Auditor
	validator validation.Validator
}

func NewEngine(registry registry.Registry, llm llm.Provider, auditor audit.Auditor, validator validation.Validator) Engine {
	return &agentEngine{
		registry:  registry,
		llm:       llm,
		auditor:   auditor,
		validator: validator,
	}
}

func (e *agentEngine) Process(ctx context.Context, input string, projectID string) (*llm.Response, error) {
	// 1. Load Actions
	if err := e.registry.LoadActions(ctx, projectID); err != nil {
		return nil, err
	}

	// 2. Build Structured Prompt
	prompt := e.buildPrompt(input)

	// 3. Call LLM
	output, err := e.llm.Chat(ctx, prompt)
	if err != nil {
		return nil, fmt.Errorf("llm error: %w", err)
	}

	// 4. Parse Output
	var resp llm.Response
	if err := json.Unmarshal([]byte(output), &resp); err != nil {
		return nil, fmt.Errorf("failed to parse llm output: %w", err)
	}

	// 5. Load Action from Registry for Validation
	action, ok := e.registry.GetAction(resp.Action)
	if !ok {
		return nil, fmt.Errorf("action not found in registry: %s", resp.Action)
	}

	// 6. Validate Output
	if err := e.validator.Validate(action, resp.Params); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	// 7. Audit (Async would be better, but synchronous for now)
	_ = e.auditor.Record(ctx, &audit.AuditRecordDto{
		ProjectID:      projectID,
		UserID:         "system", // Replace with real user ID
		Prompt:         input,
		ProposedAction: resp.Params,
		Validated:      true,
		FinalResponse:  resp,
	})

	return &resp, nil
}

func (e *agentEngine) buildPrompt(input string) string {
	actions := e.registry.ListActions()
	schemaJson, _ := json.Marshal(actions)

	return fmt.Sprintf(`You are an intent mediation engine. 
Translate the following user input into a structured action based on the provided schemas.

User Input: %s

Available Actions:
%s

Return ONLY a JSON object in the following format:
{"action": "action_name", "params": {"key": "value"}}`, input, string(schemaJson))
}
