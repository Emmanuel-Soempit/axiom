package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"

	"github.com/Emmanuel-Soempit/axiom/internal/core/registry/dtos"
)

// ActionModel holds the schema definition for the ActionModel entity.
type ActionModel struct {
	ent.Schema
}

// Mixin of the ActionModel.
func (ActionModel) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Fields of the ActionModel.
func (ActionModel) Fields() []ent.Field {
	return []ent.Field{
		field.String("project_id"),
		field.Int("feature_id").Optional(),
		field.String("name"),
		field.String("description"),
		field.JSON("parameters", map[string]*dtos.ParameterSchema{}),

		field.String("required_feature").Optional(),
		field.Int("version").Default(1),
	}
}

// Edges of the ActionModel.
func (ActionModel) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("project", Project.Type).
			Ref("actions").
			Unique().
			Field("project_id").
			Required(),
		edge.From("feature", Feature.Type).
			Ref("actions").
			Unique().
			Field("feature_id"),
		edge.To("audit_records", AuditRecord.Type),
	}
}
