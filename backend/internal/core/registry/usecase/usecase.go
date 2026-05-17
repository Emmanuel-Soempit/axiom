package usecase

import (
	"context"

	"github.com/Emmanuel-Soempit/axiom/internal/core/registry/dtos"
)

type RegistryUsecase interface {
	CreateAction(ctx context.Context, projectID string, payload dtos.CreateActionRequest) (*dtos.ActionResponse, error)
	GetAction(ctx context.Context, projectID string, id int) (*dtos.ActionResponse, error)
	ListActions(ctx context.Context) ([]dtos.ActionResponse, error)
	ListActionsByProject(ctx context.Context, projectID string) ([]dtos.ActionResponse, error)
	UpdateAction(ctx context.Context, projectID string, id int, payload dtos.UpdateActionRequest) (*dtos.ActionResponse, error)
	DeleteAction(ctx context.Context, projectID string, id int) error
	GetActionsByFeatureID(ctx context.Context, projectID string, featureID int) ([]dtos.ActionResponse, error)

	CreateFeature(ctx context.Context, projectID string, payload dtos.CreateFeatureRequest) (*dtos.FeatureResponse, error)
	GetFeature(ctx context.Context, projectID string, id int) (*dtos.FeatureResponse, error)
	ListFeaturesByProject(ctx context.Context, projectID string) ([]dtos.FeatureResponse, error)
	UpdateFeature(ctx context.Context, projectID string, id int, payload dtos.UpdateFeatureRequest) (*dtos.FeatureResponse, error)
	DeleteFeature(ctx context.Context, projectID string, id int) error

	CreateAgent(ctx context.Context, projectID string, payload dtos.CreateAgentRequest) (*dtos.AgentResponse, error)
	GetAgent(ctx context.Context, projectID string, id int) (*dtos.AgentResponse, error)
	ListAgentsByProject(ctx context.Context, projectID string) ([]dtos.AgentResponse, error)
	UpdateAgent(ctx context.Context, projectID string, id int, payload dtos.UpdateAgentRequest) (*dtos.AgentResponse, error)
	DeleteAgent(ctx context.Context, projectID string, id int) error
	ToggleAgentActive(ctx context.Context, projectID string, id int, active bool) (*dtos.AgentResponse, error)

	ListAuditsByAgent(ctx context.Context, projectID string, agentID, page, limit int) (*dtos.PaginatedResponse[dtos.AuditResponse], error)
	ListFeaturesByAgent(ctx context.Context, projectID string, agentID, page, limit int) (*dtos.PaginatedResponse[dtos.FeatureResponse], error)
}
