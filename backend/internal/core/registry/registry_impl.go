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

// CRUD operations

// CRUD operations handled by usecase now, Registry focuses on cache

func (r *actionRegistry) SyncAction(action *ent.ActionModel, deleted bool) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if deleted {
		delete(r.actions, action.Name)
	} else {
		r.actions[action.Name] = action
	}
}
