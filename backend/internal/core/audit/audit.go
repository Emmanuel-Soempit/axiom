package audit

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/Emmanuel-Soempit/axiom/ent"
	"github.com/Emmanuel-Soempit/axiom/ent/auditrecord"
)

// Auditor handles recording of structured logs.
type Auditor interface {
	Record(ctx context.Context, record *AuditRecordDto) error
}

type AuditRecordDto struct {
	ProjectID      string
	UserID         string
	AgentID        int
	ErrorType      string
	Prompt         string
	ProposedAction interface{}
	Validated      bool
	FinalResponse  interface{}
}

type auditService struct {
	client *ent.Client
}

func NewAuditor(client *ent.Client) Auditor {
	return &auditService{client: client}
}

func (s *auditService) Record(ctx context.Context, record *AuditRecordDto) error {
	builder := s.client.AuditRecord.
		Create().
		SetProjectID(record.ProjectID).
		SetPrompt(record.Prompt).
		SetValidated(record.Validated)

	if record.UserID != "" {
		if id, err := strconv.Atoi(record.UserID); err == nil {
			builder.SetUserID(id)
		}
	}

	if record.AgentID > 0 {
		builder.SetAgentID(record.AgentID)
	}

	if record.ErrorType != "" {
		builder.SetErrorType(auditrecord.ErrorType(record.ErrorType))
	}

	if record.ProposedAction != nil {
		if m, ok := record.ProposedAction.(map[string]interface{}); ok {
			builder.SetProposedAction(m)
		}
	}

	if record.FinalResponse != nil {
		// Convert to map for Ent JSON field if it's not already
		if m, ok := record.FinalResponse.(map[string]interface{}); ok {
			builder.SetFinalResponse(m)
		} else {
			// Fallback: try to marshal/unmarshal to map
			data, _ := json.Marshal(record.FinalResponse)
			var m map[string]interface{}
			if err := json.Unmarshal(data, &m); err == nil {
				builder.SetFinalResponse(m)
			}
		}
	}

	_, err := builder.Save(ctx)
	if err != nil {
		return fmt.Errorf("failed to save audit record: %w", err)
	}
	return nil
}
