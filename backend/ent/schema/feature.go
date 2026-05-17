package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Feature holds the schema definition for the Feature entity.
type Feature struct {
	ent.Schema
}

// Mixin of the Feature.
func (Feature) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Fields of the Feature.
func (Feature) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.String("description"),
		field.String("slug").Optional(),
		field.String("project_id"),
	}
}

// Edges of the Feature.
func (Feature) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("project", Project.Type).
			Ref("features").
			Unique().
			Field("project_id").
			Required(),
		edge.To("agent", Agent.Type),
		edge.To("actions", ActionModel.Type),
	}
}
