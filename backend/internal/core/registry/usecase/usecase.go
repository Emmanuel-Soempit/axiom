package usecase

import (
	"context"
	"go-backend-template/internal/core/registry/dtos"
)

type RegistryUsecase interface {
	CreateAction(ctx context.Context, projectID string, payload dtos.CreateActionRequest) (*dtos.ActionResponse, error)
	GetAction(ctx context.Context, projectID string, id int) (*dtos.ActionResponse, error)
	ListActions(ctx context.Context) ([]dtos.ActionResponse, error)
	ListActionsByProject(ctx context.Context, projectID string) ([]dtos.ActionResponse, error)
	UpdateAction(ctx context.Context, projectID string, id int, payload dtos.UpdateActionRequest) (*dtos.ActionResponse, error)
	DeleteAction(ctx context.Context, projectID string, id int) error
}
