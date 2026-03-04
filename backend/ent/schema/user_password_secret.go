package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// UserPasswordSecret holds the schema definition for the UserPasswordSecret entity.
type UserPasswordSecret struct {
	ent.Schema
}

// Mixin of the UserPasswordSecret.
func (UserPasswordSecret) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Fields of the UserPasswordSecret.
func (UserPasswordSecret) Fields() []ent.Field {
	return []ent.Field{
		field.String("secret"),
	}
}

// Edges of the UserPasswordSecret.
func (UserPasswordSecret) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("password_secret").
			Unique().
			Required(),
	}
}
