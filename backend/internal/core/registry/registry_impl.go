package registry

import (
	"context"
	"fmt"
	"go-backend-template/ent"
	"go-backend-template/ent/actionmodel"
	"sync"
)

type actionRegistry struct {
	client  *ent.Client
	actions map[string]*ent.ActionModel
	mu      sync.RWMutex
}

func NewRegistry(client *ent.Client) Registry {
	return &actionRegistry{
		client:  client,
		actions: make(map[string]*ent.ActionModel),
	}
}

func (r *actionRegistry) LoadActions(ctx context.Context, projectID string) error {
	actions, err := r.client.ActionModel.
		Query().
		Where(actionmodel.ProjectID(projectID)).
		All(ctx)
	if err != nil {
		return fmt.Errorf("failed to load actions: %w", err)
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	for _, action := range actions {
		r.actions[action.Name] = action
	}

	return nil
}

func (r *actionRegistry) GetAction(name string) (*ent.ActionModel, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	action, ok := r.actions[name]
	return action, ok
}

func (r *actionRegistry) ListActions() []*ent.ActionModel {
	r.mu.RLock()
	defer r.mu.RUnlock()

	list := make([]*ent.ActionModel, 0, len(r.actions))
	for _, action := range r.actions {
		list = append(list, action)
	}
	return list
}

func (r *actionRegistry) CreateAction(ctx context.Context, action *ent.ActionModel) (*ent.ActionModel, error) {
	newAction, err := r.client.ActionModel.
		Create().
		SetProjectID(action.ProjectID).
		SetName(action.Name).
		SetDescription(action.Description).
		SetParameters(action.Parameters).
		SetRules(action.Rules).
		SetNillableRequiredFeature(&action.RequiredFeature).
		SetVersion(action.Version).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create action: %w", err)
	}

	r.mu.Lock()
	r.actions[newAction.Name] = newAction
	r.mu.Unlock()

	return newAction, nil
}
