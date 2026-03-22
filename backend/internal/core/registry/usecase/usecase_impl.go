package usecase

import (
	"context"
	"fmt"
	"go-backend-template/ent"
	"go-backend-template/ent/actionmodel"
	"go-backend-template/internal/core/registry"
	"go-backend-template/internal/core/registry/dtos"
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

func (u *registryUsecase) CreateAction(ctx context.Context, projectID string, payload dtos.CreateActionRequest) (*dtos.ActionResponse, error) {
	newAction, err := u.client.ActionModel.
		Create().
		SetProjectID(projectID).
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

	query := action.Update()

	if payload.Description != nil {
		query.SetDescription(*payload.Description)
	}
	if payload.Parameters != nil {
		query.SetParameters(payload.Parameters)
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

func (u *registryUsecase) mapToResponse(a *ent.ActionModel) *dtos.ActionResponse {
	return &dtos.ActionResponse{
		ID:              a.ID,
		Name:            a.Name,
		Description:     a.Description,
		Parameters:      a.Parameters,
		RequiredFeature: a.RequiredFeature,
		Version:         a.Version,
	}
}
