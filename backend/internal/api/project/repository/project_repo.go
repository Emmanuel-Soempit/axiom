package repository

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"go-backend-template/ent"
	"go-backend-template/internal/api/project/dtos"
	"time"
)

type AuditCounts struct {
	Total      int
	Failed     int
	Successful int
}

type ProjectRepo interface {
	Create(ctx context.Context, userID int, payload dtos.CreateProjectPayload) (*ent.Project, error)
	FindAllByUserID(ctx context.Context, userID int) ([]*ent.Project, error)
	FindByID(ctx context.Context, id string) (*ent.Project, error)
	Update(ctx context.Context, id string, payload dtos.UpdateProjectPayload) (*ent.Project, error)
	Delete(ctx context.Context, id string) error
	FindAuditsByProjectID(ctx context.Context, projectID string) ([]*ent.AuditRecord, error)
	CountAuditsByProjectID(ctx context.Context, projectID string, since time.Time, until time.Time) (AuditCounts, error)
	CountActionsByProjectID(ctx context.Context, projectID string) (int, error)
}

func generatePublicID(nBytes int) string {
	b := make([]byte, nBytes)
	rand.Read(b)
	return hex.EncodeToString(b)
}
