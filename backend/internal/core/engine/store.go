package engine

import (
	"context"
	"sync"

	"go-backend-template/internal/core/llm"

	"github.com/google/uuid"
)

// MessageStore persists conversation history keyed by session.
//
// An Ent-backed implementation should replace the in-memory default once
// `go generate ./ent` has been run for the new Message schema.
type MessageStore interface {
	Append(ctx context.Context, sessionID uuid.UUID, msg llm.Message) error
	List(ctx context.Context, sessionID uuid.UUID) ([]llm.Message, error)
}

// inMemoryStore is a process-local MessageStore. Suitable for dev/tests;
// NOT safe for multi-replica production (use the Ent-backed store instead).
type inMemoryStore struct {
	mu   sync.RWMutex
	data map[uuid.UUID][]llm.Message
}

func NewInMemoryMessageStore() MessageStore {
	return &inMemoryStore{data: make(map[uuid.UUID][]llm.Message)}
}

func (s *inMemoryStore) Append(_ context.Context, sessionID uuid.UUID, msg llm.Message) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data[sessionID] = append(s.data[sessionID], msg)
	return nil
}

func (s *inMemoryStore) List(_ context.Context, sessionID uuid.UUID) ([]llm.Message, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	msgs := s.data[sessionID]
	out := make([]llm.Message, len(msgs))
	copy(out, msgs)
	return out, nil
}
