package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type groqProvider struct {
	apiKey string
	apiURL string
	model  string
}

// NewGroqProvider creates a new instance of the Groq LLM provider using environment variables.
func NewGroqProvider() Provider {
	apiKey := os.Getenv("GROQ_API_KEY")
	apiURL := os.Getenv("GROQ_API_URL")
	model := os.Getenv("GROQ_MODEL")
	if model == "" {
		model = "llama-3.3-70b-versatile"
	}
	return &groqProvider{
		apiKey: apiKey,
		apiURL: apiURL,
		model:  model,
	}
}

func (p *groqProvider) Chat(ctx context.Context, messages []Message, tools []Tool) (*Response, error) {
	payload := map[string]interface{}{
		"model":    p.model,
		"messages": toGroqMessages(messages),
	}
	if len(tools) > 0 {
		payload["tools"] = tools
		payload["tool_choice"] = "auto"
	}

	requestBody, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", p.apiURL, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+p.apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("api error (status %d): %s", resp.StatusCode, string(body))
	}

	var result struct {
		Choices []struct {
			Message struct {
				Content   string `json:"content"`
				ToolCalls []struct {
					ID       string `json:"id"`
					Function struct {
						Name      string `json:"name"`
						Arguments string `json:"arguments"`
					} `json:"function"`
				} `json:"tool_calls"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	if len(result.Choices) == 0 {
		return nil, fmt.Errorf("no choices returned from api")
	}

	choice := result.Choices[0].Message
	out := &Response{Content: choice.Content}
	for _, tc := range choice.ToolCalls {
		var args map[string]interface{}
		if tc.Function.Arguments != "" {
			if err := json.Unmarshal([]byte(tc.Function.Arguments), &args); err != nil {
				return nil, fmt.Errorf("failed to parse tool arguments for %s: %w", tc.Function.Name, err)
			}
		}
		out.ToolCalls = append(out.ToolCalls, ToolCall{
			ID:        tc.ID,
			Name:      tc.Function.Name,
			Arguments: args,
		})
	}
	return out, nil
}

// toGroqMessages converts internal Message history into the wire format
// expected by the Groq/OpenAI chat completions API.
func toGroqMessages(messages []Message) []map[string]interface{} {
	out := make([]map[string]interface{}, 0, len(messages))
	for _, m := range messages {
		switch m.Role {
		case RoleActionResult:
			// Tool/action results are sent back with the original call_id
			// so the model can correlate them with its own tool_calls.
			content := m.Content
			if content == "" && m.Arguments != nil {
				if b, err := json.Marshal(m.Arguments); err == nil {
					content = string(b)
				}
			}
			out = append(out, map[string]interface{}{
				"role":         "tool",
				"tool_call_id": m.CallID,
				"content":      content,
			})
		case RoleAssistant:
			msg := map[string]interface{}{"role": "assistant"}
			if m.Content != "" {
				msg["content"] = m.Content
			}
			// If this assistant message represents a validated tool call,
			// re-emit it so the model has continuity across turns.
			if m.ActionName != "" {
				argBytes, _ := json.Marshal(m.Arguments)
				msg["tool_calls"] = []map[string]interface{}{
					{
						"id":   m.CallID,
						"type": "function",
						"function": map[string]interface{}{
							"name":      m.ActionName,
							"arguments": string(argBytes),
						},
					},
				}
			}
			out = append(out, msg)
		default: // system, user
			out = append(out, map[string]interface{}{
				"role":    string(m.Role),
				"content": m.Content,
			})
		}
	}
	return out
}
