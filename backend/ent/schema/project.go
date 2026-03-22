package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Project holds the schema definition for the Project entity.
type Project struct {
	ent.Schema
}

// Mixin of the Project.
func (Project) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Fields of the Project.
func (Project) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").
			Unique().
			Immutable(),
		field.String("name"),
		field.String("public_id").
			Unique().
			Immutable(),
	}
}

// Edges of the Project.
func (Project) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("actions", ActionModel.Type),
		edge.To("api_keys", ApiKey.Type),
		edge.From("user", User.Type).
			Ref("projects").
			Unique(),
		edge.To("user_metas", UserMeta.Type),
	}
}
