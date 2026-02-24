package audit

import (
	"context"
	"encoding/json"
	"fmt"
	"go-backend-template/ent"
)

// Auditor handles recording of structured logs.
type Auditor interface {
	Record(ctx context.Context, record *AuditRecordDto) error
}

type AuditRecordDto struct {
	ProjectID      string
	UserID         string
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
	query := s.client.AuditRecord.
		Create().
		SetProjectID(record.ProjectID).
		SetUserID(record.UserID).
		SetPrompt(record.Prompt).
		SetValidated(record.Validated)

	if record.ProposedAction != nil {
		if m, ok := record.ProposedAction.(map[string]interface{}); ok {
			query.SetProposedAction(m)
		}
	}

	if record.FinalResponse != nil {
		// Convert to map for Ent JSON field if it's not already
		if m, ok := record.FinalResponse.(map[string]interface{}); ok {
			query.SetFinalResponse(m)
		} else {
			// Fallback: try to marshal/unmarshal to map
			data, _ := json.Marshal(record.FinalResponse)
			var m map[string]interface{}
			if err := json.Unmarshal(data, &m); err == nil {
				query.SetFinalResponse(m)
			}
		}
	}

	_, err := query.Save(ctx)
	if err != nil {
		return fmt.Errorf("failed to save audit record: %w", err)
	}
	return nil
}
