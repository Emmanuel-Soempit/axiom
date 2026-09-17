package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Mixin of the User.
func (User) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("first_name").
			MaxLen(100),
		field.String("last_name").
			MaxLen(100),
		field.String("email").
			Unique(),
		field.Bool("email_verified").
			Default(false),
		field.String("password").
			Optional(),
		field.Enum("sign_up_method").
			Values("invite", "register").
			Default("register"),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("role", Role.Type).
			Ref("users").
			Unique(),
		edge.To("invitations", UserInvitation.Type),
		edge.To("audit_records", AuditRecord.Type),
		edge.To("password_secret", UserPasswordSecret.Type).
			Unique(),
		edge.To("projects", Project.Type),
		edge.To("created_api_keys", ApiKey.Type),
		edge.To("meta", UserMeta.Type).
			Unique(),
	}
}
