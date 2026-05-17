package engine

import (
	"context"
	"fmt"

	"github.com/Emmanuel-Soempit/axiom/ent"
	"github.com/Emmanuel-Soempit/axiom/ent/message"
	"github.com/Emmanuel-Soempit/axiom/internal/core/llm"

	"github.com/google/uuid"
)

// entMessageStore persists conversation history in Postgres via Ent.
type entMessageStore struct {
	client *ent.Client
}

// NewEntMessageStore returns an Ent-backed MessageStore.
func NewEntMessageStore(client *ent.Client) MessageStore {
	return &entMessageStore{client: client}
}

func (s *entMessageStore) Append(ctx context.Context, sessionID uuid.UUID, msg llm.Message) error {
	builder := s.client.Message.
		Create().
		SetSessionID(sessionID).
		SetRole(message.Role(msg.Role))

	if msg.Content != "" {
		builder.SetContent(msg.Content)
	}
	if msg.ActionName != "" {
		builder.SetActionName(msg.ActionName)
	}
	if msg.CallID != "" {
		builder.SetCallID(msg.CallID)
	}
	if msg.Arguments != nil {
		builder.SetArguments(msg.Arguments)
	}
	if msg.OPADecision != nil {
		builder.SetOpaDecision(msg.OPADecision)
	}

	if _, err := builder.Save(ctx); err != nil {
		return fmt.Errorf("failed to persist message: %w", err)
	}
	return nil
}

func (s *entMessageStore) List(ctx context.Context, sessionID uuid.UUID) ([]llm.Message, error) {
	rows, err := s.client.Message.
		Query().
		Where(message.SessionIDEQ(sessionID)).
		Order(ent.Asc(message.FieldCreatedAt)).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list messages: %w", err)
	}

	out := make([]llm.Message, 0, len(rows))
	for _, r := range rows {
		out = append(out, llm.Message{
			Role:        llm.Role(r.Role),
			Content:     r.Content,
			ActionName:  r.ActionName,
			CallID:      r.CallID,
			Arguments:   r.Arguments,
			OPADecision: r.OpaDecision,
		})
	}
	return out, nil
}
