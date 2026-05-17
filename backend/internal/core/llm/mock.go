package llm

import (
	"context"
)

type mockProvider struct {
	response *Response
}

// NewMockProvider returns a Provider that always returns the supplied
// response. Pass nil for an empty Response.
func NewMockProvider(response *Response) Provider {
	if response == nil {
		response = &Response{}
	}
	return &mockProvider{response: response}
}

func (m *mockProvider) Chat(ctx context.Context, messages []Message, tools []Tool) (*Response, error) {
	return m.response, nil
}
