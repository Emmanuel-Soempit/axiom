package llm

import (
	"context"
)

type mockProvider struct {
	response string
}

func NewMockProvider(response string) Provider {
	return &mockProvider{response: response}
}

func (m *mockProvider) Chat(ctx context.Context, prompt string) (string, error) {
	return m.response, nil
}
