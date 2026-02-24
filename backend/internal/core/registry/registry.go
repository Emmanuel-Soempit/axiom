package registry

import (
	"context"
	"go-backend-template/ent"
)

// Registry manages the collection of action models.
type Registry interface {
	LoadActions(ctx context.Context, projectID string) error
	GetAction(name string) (*ent.ActionModel, bool)
	ListActions() []*ent.ActionModel
	CreateAction(ctx context.Context, action *ent.ActionModel) (*ent.ActionModel, error)
}
