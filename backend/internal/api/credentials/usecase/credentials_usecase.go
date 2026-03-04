package usecase

import (
	"context"
	"go-backend-template/internal/api/credentials/dtos"
)

type CredentialsUsecase interface {
	CreateKey(ctx context.Context, userID int, payload dtos.CreateApiKeyPayload) (*dtos.CreateApiKeyResponse, error)
	GetProjectKeys(ctx context.Context, projectID string) ([]dtos.ApiKeyResponse, error)
	RevokeKey(ctx context.Context, id string) (*dtos.ApiKeyResponse, error)
	DeleteKey(ctx context.Context, id string) error
}
