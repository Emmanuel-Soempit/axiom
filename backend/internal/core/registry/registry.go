package registry

import (
	"context"

	"github.com/Emmanuel-Soempit/axiom/ent"
)

// Registry manages the collection of action models.
type Registry interface {
	LoadActions(ctx context.Context, projectID string) error
	LoadActionsByFeatureIDs(ctx context.Context, projectID string, featureIDs []int) error
	GetAction(name string) (*ent.ActionModel, bool)
	ListActions() []*ent.ActionModel
	SyncAction(action *ent.ActionModel, deleted bool)
}
