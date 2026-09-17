package llm

import "context"

// Role represents who produced a message in a conversation.
type Role string

const (
	RoleSystem       Role = "system"
	RoleUser         Role = "user"
	RoleAssistant    Role = "assistant"
	RoleActionResult Role = "action_result" // maps to "tool" in the OpenAI/Groq spec
)

// Message is one entry in a conversation history. It mirrors the Ent
// Message schema so it can be persisted directly.
type Message struct {
	Role        Role                   `json:"role"`
	Content     string                 `json:"content,omitempty"`
	ActionName  string                 `json:"action_name,omitempty"`
	CallID      string                 `json:"call_id,omitempty"`
	Arguments   map[string]interface{} `json:"arguments,omitempty"`
	OPADecision map[string]interface{} `json:"opa_decision,omitempty"`
}

// ToolCall is a single action the LLM proposes to invoke.
type ToolCall struct {
	ID        string                 `json:"id"`
	Name      string                 `json:"name"`
	Arguments map[string]interface{} `json:"arguments"`
}

// Tool is the schema we advertise to the LLM for a callable action.
// Shape follows the OpenAI / Groq tool-calling spec.
type Tool struct {
	Type     string       `json:"type"` // always "function"
	Function ToolFunction `json:"function"`
}

type ToolFunction struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description,omitempty"`
	Parameters  map[string]interface{} `json:"parameters"` // JSON Schema
}

// Response represents a structured LLM response.
type Response struct {
	Content   string     `json:"content,omitempty"`
	ToolCalls []ToolCall `json:"tool_calls,omitempty"`
}

// Provider defines the interface for LLM services.
type Provider interface {
	Chat(ctx context.Context, messages []Message, tools []Tool) (*Response, error)
}
