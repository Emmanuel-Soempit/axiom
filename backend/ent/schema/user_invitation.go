package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// UserInvitation holds the schema definition for the UserInvitation entity.
type UserInvitation struct {
	ent.Schema
}

// Mixin of the UserInvitation.
func (UserInvitation) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Fields of the UserInvitation.
func (UserInvitation) Fields() []ent.Field {
	return []ent.Field{
		field.String("invite_url"),
		field.Enum("status").
			Values("activated", "pending", "expired").
			Default("pending"),
	}
}

// Edges of the UserInvitation.
func (UserInvitation) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("invitations").
			Unique(),
	}
}
