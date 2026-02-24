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

func (p *groqProvider) Chat(ctx context.Context, prompt string) (string, error) {
	requestBody, err := json.Marshal(map[string]interface{}{
		"model": p.model,
		"messages": []map[string]string{
			{
				"role":    "user",
				"content": prompt,
			},
		},
	})
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", p.apiURL, bytes.NewBuffer(requestBody))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+p.apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("api error (status %d): %s", resp.StatusCode, string(body))
	}

	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	if len(result.Choices) == 0 {
		return "", fmt.Errorf("no choices returned from api")
	}

	return result.Choices[0].Message.Content, nil
}
