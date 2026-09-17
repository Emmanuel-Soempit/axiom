package usecase

import (
	"context"
	"fmt"
	"regexp"
	"strings"

	"github.com/Emmanuel-Soempit/axiom/ent"
	"github.com/Emmanuel-Soempit/axiom/ent/actionmodel"
	"github.com/Emmanuel-Soempit/axiom/ent/agent"
	"github.com/Emmanuel-Soempit/axiom/ent/auditrecord"
	"github.com/Emmanuel-Soempit/axiom/ent/feature"
	"github.com/Emmanuel-Soempit/axiom/internal/core/registry"
	"github.com/Emmanuel-Soempit/axiom/internal/core/registry/dtos"
)

type registryUsecase struct {
	client   *ent.Client
	registry registry.Registry
}

func NewRegistryUsecase(client *ent.Client, reg registry.Registry) RegistryUsecase {
	return &registryUsecase{
		client:   client,
		registry: reg,
	}
}

func generateSlug(name string) string {
	slug := strings.ToLower(name)
	slug = regexp.MustCompile(`[^a-z0-9\s-]`).ReplaceAllString(slug, "")
	slug = regexp.MustCompile(`[\s-]+`).ReplaceAllString(slug, "_")
	slug = strings.Trim(slug, "_")
	return slug
}

func isValidSnakeCase(s string) bool {
	matched, _ := regexp.MatchString(`^[a-z][a-z0-9_]*$`, s)
	return matched
}

func validateParameterKeys(params map[string]*dtos.ParameterSchema) error {
	for key := range params {
		if !isValidSnakeCase(key) {
			return fmt.Errorf("invalid parameter key '%s': must be snake_case", key)
		}
		if params[key].Properties != nil {
			if err := validateParameterKeys(params[key].Properties); err != nil {
				return err
			}
		}
	}
	return nil
}

func (u *registryUsecase) CreateAction(ctx context.Context, projectID string, payload dtos.CreateActionRequest) (*dtos.ActionResponse, error) {
	if !isValidSnakeCase(payload.Name) {

		return nil, fmt.Errorf("invalid action name '%s': must be snake_case", payload.Name)
	}
	if err := validateParameterKeys(payload.Parameters); err != nil {
		return nil, err
	}

	_, err := u.client.Feature.Query().
		Where(feature.ID(payload.FeatureID), feature.ProjectID(projectID)).
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("feature not found for project")
	}

	newAction, err := u.client.ActionModel.
		Create().
		SetProjectID(projectID).
		SetFeatureID(payload.FeatureID).
		SetName(payload.Name).
		SetDescription(payload.Description).
		SetParameters(payload.Parameters).
		SetRequiredFeature(payload.RequiredFeature).
		SetVersion(payload.Version).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create action: %w", err)
	}

	u.registry.SyncAction(newAction, false)

	return u.mapToResponse(newAction), nil
}

func (u *registryUsecase) GetAction(ctx context.Context, projectID string, id int) (*dtos.ActionResponse, error) {
	action, err := u.client.ActionModel.Query().
		Where(actionmodel.ID(id), actionmodel.ProjectID(projectID)).
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get action: %w", err)
	}
	return u.mapToResponse(action), nil
}

func (u *registryUsecase) ListActions(ctx context.Context) ([]dtos.ActionResponse, error) {
	actions := u.registry.ListActions()
	res := make([]dtos.ActionResponse, len(actions))
	for i, a := range actions {
		res[i] = *u.mapToResponse(a)
	}
	return res, nil
}

func (u *registryUsecase) ListActionsByProject(ctx context.Context, projectID string) ([]dtos.ActionResponse, error) {
	actions, err := u.client.ActionModel.
		Query().
		Where(actionmodel.ProjectID(projectID)).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list actions for project %s: %w", projectID, err)
	}

	res := make([]dtos.ActionResponse, len(actions))
	for i, a := range actions {
		res[i] = *u.mapToResponse(a)
	}
	return res, nil
}

func (u *registryUsecase) UpdateAction(ctx context.Context, projectID string, id int, payload dtos.UpdateActionRequest) (*dtos.ActionResponse, error) {
	action, err := u.client.ActionModel.Query().
		Where(actionmodel.ID(id), actionmodel.ProjectID(projectID)).
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to find action to update: %w", err)
	}

	// Action name is immutable — no name validation needed on update
	if payload.Parameters != nil {
		if err := validateParameterKeys(payload.Parameters); err != nil {
			return nil, err
		}
	}

	query := action.Update()

	if payload.Description != nil {
		query.SetDescription(*payload.Description)
	}
	if payload.Parameters != nil {
		query.SetParameters(payload.Parameters)
	}
	if payload.FeatureID != nil {
		query.SetFeatureID(*payload.FeatureID)
	}
	if payload.RequiredFeature != nil {
		query.SetRequiredFeature(*payload.RequiredFeature)
	}
	if payload.Version != nil {
		query.SetVersion(*payload.Version)
	}

	updated, err := query.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update action: %w", err)
	}

	u.registry.SyncAction(updated, false)

	return u.mapToResponse(updated), nil
}

func (u *registryUsecase) DeleteAction(ctx context.Context, projectID string, id int) error {
	action, err := u.client.ActionModel.Query().
		Where(actionmodel.ID(id), actionmodel.ProjectID(projectID)).
		Only(ctx)
	if err != nil {
		return fmt.Errorf("failed to find action to delete: %w", err)
	}

	_, err = u.client.ActionModel.Delete().
		Where(actionmodel.ID(id), actionmodel.ProjectID(projectID)).
		Exec(ctx)
	if err != nil {
		return fmt.Errorf("failed to delete action: %w", err)
	}

	u.registry.SyncAction(action, true)

	return nil
}

func (u *registryUsecase) GetActionsByFeatureID(ctx context.Context, projectID string, featureID int) ([]dtos.ActionResponse, error) {
	actions, err := u.client.ActionModel.
		Query().
		Where(actionmodel.ProjectID(projectID), actionmodel.FeatureID(featureID)).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list actions for feature %d: %w", featureID, err)
	}

	res := make([]dtos.ActionResponse, len(actions))
	for i, a := range actions {
		res[i] = *u.mapToResponse(a)
	}
	return res, nil
}

func (u *registryUsecase) mapToResponse(a *ent.ActionModel) *dtos.ActionResponse {
	return &dtos.ActionResponse{
		ID:              a.ID,
		Name:            a.Name,
		Description:     a.Description,
		FeatureID:       a.FeatureID,
		Parameters:      a.Parameters,
		RequiredFeature: a.RequiredFeature,
		Version:         a.Version,
	}
}

// Feature CRUD

func (u *registryUsecase) CreateFeature(ctx context.Context, projectID string, payload dtos.CreateFeatureRequest) (*dtos.FeatureResponse, error) {
	slug := generateSlug(payload.Name)
	f, err := u.client.Feature.
		Create().
		SetProjectID(projectID).
		SetName(payload.Name).
		SetDescription(payload.Description).
		SetSlug(slug).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create feature: %w", err)
	}
	return u.mapFeatureToResponse(f), nil
}

func (u *registryUsecase) GetFeature(ctx context.Context, projectID string, id int) (*dtos.FeatureResponse, error) {
	f, err := u.client.Feature.Query().
		Where(feature.ID(id), feature.ProjectID(projectID)).
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get feature: %w", err)
	}
	return u.mapFeatureToResponse(f), nil
}

func (u *registryUsecase) ListFeaturesByProject(ctx context.Context, projectID string) ([]dtos.FeatureResponse, error) {
	features, err := u.client.Feature.Query().
		Where(feature.ProjectID(projectID)).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list features: %w", err)
	}
	res := make([]dtos.FeatureResponse, len(features))
	for i, f := range features {
		res[i] = *u.mapFeatureToResponse(f)
	}
	return res, nil
}

func (u *registryUsecase) UpdateFeature(ctx context.Context, projectID string, id int, payload dtos.UpdateFeatureRequest) (*dtos.FeatureResponse, error) {
	f, err := u.client.Feature.Query().
		Where(feature.ID(id), feature.ProjectID(projectID)).
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to find feature to update: %w", err)
	}

	query := f.Update()
	if payload.Name != nil {
		query.SetName(*payload.Name)
		query.SetSlug(generateSlug(*payload.Name))
	}
	if payload.Description != nil {
		query.SetDescription(*payload.Description)
	}

	updated, err := query.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update feature: %w", err)
	}
	return u.mapFeatureToResponse(updated), nil
}

func (u *registryUsecase) DeleteFeature(ctx context.Context, projectID string, id int) error {
	_, err := u.client.Feature.Delete().
		Where(feature.ID(id), feature.ProjectID(projectID)).
		Exec(ctx)
	if err != nil {
		return fmt.Errorf("failed to delete feature: %w", err)
	}
	return nil
}

func (u *registryUsecase) mapFeatureToResponse(f *ent.Feature) *dtos.FeatureResponse {
	return &dtos.FeatureResponse{
		ID:          f.ID,
		ProjectID:   f.ProjectID,
		Name:        f.Name,
		Description: f.Description,
		Slug:        f.Slug,
	}
}

// Agent CRUD

func (u *registryUsecase) CreateAgent(ctx context.Context, projectID string, payload dtos.CreateAgentRequest) (*dtos.AgentResponse, error) {
	slug := generateSlug(payload.Name)

	builder := u.client.Agent.
		Create().
		SetProjectID(projectID).
		SetName(payload.Name).
		SetSlug(slug).
		SetNillableDescription(&payload.Description).
		SetNillableSystemPrompt(&payload.SystemPrompt)

	if len(payload.Features) > 0 {
		builder.AddFeatureIDs(payload.Features...)
	}

	newAgent, err := builder.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create agent: %w", err)
	}

	return u.mapAgentToResponse(newAgent), nil
}

func (u *registryUsecase) GetAgent(ctx context.Context, projectID string, id int) (*dtos.AgentResponse, error) {
	a, err := u.client.Agent.Query().
		Where(agent.ID(id), agent.ProjectIDEQ(projectID)).
		WithFeature().
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get agent: %w", err)
	}
	return u.mapAgentToResponse(a), nil
}

func (u *registryUsecase) ListAgentsByProject(ctx context.Context, projectID string) ([]dtos.AgentResponse, error) {
	agents, err := u.client.Agent.Query().
		Where(agent.ProjectIDEQ(projectID)).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list agents: %w", err)
	}
	res := make([]dtos.AgentResponse, len(agents))
	for i, a := range agents {
		res[i] = *u.mapAgentToResponse(a)
	}
	return res, nil
}

func (u *registryUsecase) UpdateAgent(ctx context.Context, projectID string, id int, payload dtos.UpdateAgentRequest) (*dtos.AgentResponse, error) {
	a, err := u.client.Agent.Query().
		Where(agent.ID(id), agent.ProjectIDEQ(projectID)).
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to find agent to update: %w", err)
	}

	query := a.Update()

	if payload.Name != nil {
		query.SetName(*payload.Name)
		query.SetSlug(generateSlug(*payload.Name))
	}
	if payload.Description != nil {
		query.SetDescription(*payload.Description)
	}
	if payload.SystemPrompt != nil {
		query.SetSystemPrompt(*payload.SystemPrompt)
	}
	if payload.Active != nil {
		query.SetActive(*payload.Active)
	}
	if len(payload.Features) > 0 {
		query.ClearFeature()
		query.AddFeatureIDs(payload.Features...)
	}

	updated, err := query.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update agent: %w", err)
	}

	return u.mapAgentToResponse(updated), nil
}

func (u *registryUsecase) DeleteAgent(ctx context.Context, projectID string, id int) error {
	_, err := u.client.Agent.Delete().
		Where(agent.ID(id), agent.ProjectIDEQ(projectID)).
		Exec(ctx)
	if err != nil {
		return fmt.Errorf("failed to delete agent: %w", err)
	}
	return nil
}

func (u *registryUsecase) ToggleAgentActive(ctx context.Context, projectID string, id int, active bool) (*dtos.AgentResponse, error) {
	a, err := u.client.Agent.Query().
		Where(agent.ID(id), agent.ProjectIDEQ(projectID)).
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to find agent: %w", err)
	}

	updated, err := a.Update().SetActive(active).Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to toggle agent active state: %w", err)
	}

	return u.mapAgentToResponse(updated), nil
}

func (u *registryUsecase) ListAuditsByAgent(ctx context.Context, projectID string, agentID, page, limit int) (*dtos.PaginatedResponse[dtos.AuditResponse], error) {
	offset := (page - 1) * limit

	total, err := u.client.AuditRecord.Query().
		Where(auditrecord.AgentIDEQ(agentID), auditrecord.ProjectIDEQ(projectID)).
		Count(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to count audit records: %w", err)
	}

	records, err := u.client.AuditRecord.Query().
		Where(auditrecord.AgentIDEQ(agentID), auditrecord.ProjectIDEQ(projectID)).
		Order(auditrecord.ByCreatedAt()).
		Limit(limit).
		Offset(offset).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list audit records: %w", err)
	}

	data := make([]dtos.AuditResponse, len(records))
	for i, r := range records {
		ar := dtos.AuditResponse{
			ID:               r.ID,
			ProjectID:        r.ProjectID,
			Prompt:           r.Prompt,
			Validated:        r.Validated,
			ProposedAction:   r.ProposedAction,
			ValidationErrors: r.ValidationErrors,
			FinalResponse:    r.FinalResponse,
			ErrorType:        string(r.ErrorType),
			CreatedAt:        r.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		}
		if r.UserID != 0 {
			ar.UserID = &r.UserID
		}
		if r.ActionID != 0 {
			ar.ActionID = &r.ActionID
		}
		if r.AgentID != 0 {
			ar.AgentID = &r.AgentID
		}
		data[i] = ar
	}

	return &dtos.PaginatedResponse[dtos.AuditResponse]{
		Data:    data,
		Total:   total,
		Page:    page,
		Limit:   limit,
		HasNext: offset+len(records) < total,
	}, nil
}

func (u *registryUsecase) ListFeaturesByAgent(ctx context.Context, projectID string, agentID, page, limit int) (*dtos.PaginatedResponse[dtos.FeatureResponse], error) {
	offset := (page - 1) * limit

	agentEnt, err := u.client.Agent.Query().
		Where(agent.ID(agentID), agent.ProjectIDEQ(projectID)).
		WithFeature(func(q *ent.FeatureQuery) {
			q.Limit(limit).Offset(offset)
		}).
		Only(ctx)
	if err != nil {
		return nil, fmt.Errorf("agent not found: %w", err)
	}

	agentTotal, err := u.client.Agent.Query().
		Where(agent.ID(agentID), agent.ProjectIDEQ(projectID)).
		QueryFeature().
		Count(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to count features: %w", err)
	}

	features := agentEnt.Edges.Feature
	data := make([]dtos.FeatureResponse, len(features))
	for i, f := range features {
		data[i] = *u.mapFeatureToResponse(f)
	}

	return &dtos.PaginatedResponse[dtos.FeatureResponse]{
		Data:    data,
		Total:   agentTotal,
		Page:    page,
		Limit:   limit,
		HasNext: offset+len(features) < agentTotal,
	}, nil
}

func (u *registryUsecase) mapAgentToResponse(a *ent.Agent) *dtos.AgentResponse {
	res := &dtos.AgentResponse{
		ID:           a.ID,
		ProjectID:    a.ProjectID,
		Name:         a.Name,
		Slug:         a.Slug,
		Description:  a.Description,
		SystemPrompt: a.SystemPrompt,
		Active:       a.Active,
	}
	if a.Edges.Feature != nil {
		res.Features = make([]int, len(a.Edges.Feature))
		for i, f := range a.Edges.Feature {
			res.Features[i] = f.ID
		}
	}
	return res
}
