package llm

import "context"

// Provider defines the interface for LLM services.
type Provider interface {
	Chat(ctx context.Context, prompt string) (string, error)
}

// Response represents a structured LLM response.
type Response struct {
	RawOutput string
	Action    string
	Params    map[string]interface{}
}
