package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type UserMeta struct {
	ent.Schema
}

func (UserMeta) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

func (UserMeta) Fields() []ent.Field {
	return []ent.Field{
		field.Time("last_logged_in").
			Optional().
			Nillable(),
		field.Int("user_id").
			Unique(),
		field.String("last_active_project").
			Optional().
			Nillable(),
	}
}

func (UserMeta) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).Ref("meta").Unique().Field("user_id").Required(),
		edge.From("project", Project.Type).Ref("user_metas").Field("last_active_project").Unique(),
	}
}
