package usecase

import (
	"context"
	"go-backend-template/internal/api/project/dtos"
)

type ProjectUsecase interface {
	CreateProject(ctx context.Context, userID int, payload dtos.CreateProjectPayload) (*dtos.ProjectResponse, error)
	GetUserProjects(ctx context.Context, userID int) ([]dtos.ProjectResponse, error)
	GetProjectByID(ctx context.Context, userID int, id string) (*dtos.ProjectResponse, error)
	UpdateProject(ctx context.Context, userID int, id string, payload dtos.UpdateProjectPayload) (*dtos.ProjectResponse, error)
	DeleteProject(ctx context.Context, userID int, id string) error
	GetAuditsByProject(ctx context.Context, projectID string) (*dtos.AuditOverviewResponse, error)
	GetDashboardByProject(ctx context.Context, projectID string) (*dtos.ProjectDashboardResponse, error)
}
