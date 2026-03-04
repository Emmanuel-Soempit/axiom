package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// ApiKey holds the schema definition for the ApiKey entity.
type ApiKey struct {
	ent.Schema
}

// Mixin of the ApiKey.
func (ApiKey) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Fields of the ApiKey.
func (ApiKey) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			Immutable(),
		field.String("name"),
		field.String("project_id"),
		field.String("key_prefix").
			Unique().
			Immutable(),
		field.String("key_hash").
			Sensitive(),
		field.Enum("status").
			Values("active", "revoked").
			Default("active"),
		field.Time("last_used_at").
			Optional().
			Nillable(),
		field.Time("expires_at").
			Optional().
			Nillable(),
		field.Int("created_by"),
	}
}

// Edges of the ApiKey.
func (ApiKey) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("project", Project.Type).
			Ref("api_keys").
			Unique().
			Field("project_id").
			Required(),
		edge.From("creator", User.Type).
			Ref("created_api_keys").
			Unique().
			Field("created_by").
			Required(),
	}
}
