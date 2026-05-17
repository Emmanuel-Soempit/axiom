package dtos

import (
	"github.com/Emmanuel-Soempit/axiom/internal/core/llm"

	"github.com/google/uuid"
)

type EngineProcessRequest struct {
	ProjectID string    `json:"project_id" validate:"required"`
	SessionID uuid.UUID `json:"session_id,omitempty"`
	Prompt    string    `json:"prompt" validate:"required"`
}

type EngineProcessResponse struct {
	SessionID uuid.UUID     `json:"session_id"`
	Messages  []llm.Message `json:"messages"`
}

type SessionHistoryResponse struct {
	SessionID uuid.UUID     `json:"session_id"`
	Messages  []llm.Message `json:"messages"`
}
