package repository

import (
	"context"
	"go-backend-template/ent"
	"go-backend-template/internal/api/credentials/dtos"

	"github.com/google/uuid"
)

type CredentialsRepo interface {
	Create(ctx context.Context, userID int, prefix string, hash string, projectID string, payload dtos.CreateApiKeyPayload) (*ent.ApiKey, error)
	FindAllByProjectID(ctx context.Context, projectID string) ([]*ent.ApiKey, error)
	FindByID(ctx context.Context, id uuid.UUID) (*ent.ApiKey, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status string) (*ent.ApiKey, error)
	Delete(ctx context.Context, id uuid.UUID) error
	FindProjectByID(ctx context.Context, id string) (*ent.Project, error)
}
