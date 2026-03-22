package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// AuditRecord holds the schema definition for the AuditRecord entity.
type AuditRecord struct {
	ent.Schema
}

// Mixin of the AuditRecord.
func (AuditRecord) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Fields of the AuditRecord.
func (AuditRecord) Fields() []ent.Field {
	return []ent.Field{
		field.Int("user_id").Optional(),
		field.Int("action_id").Optional(),
		field.String("project_id").Optional(),
		field.Text("prompt"),
		field.JSON("proposed_action", map[string]interface{}{}).Optional(),
		field.Bool("validated").Default(false),
		field.JSON("validation_errors", []string{}).Optional(),
		field.JSON("final_response", map[string]interface{}{}).Optional(),
	}
}

// Edges of the AuditRecord.
func (AuditRecord) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("audit_records").
			Unique().
			Field("user_id"),
		edge.From("action", ActionModel.Type).
			Ref("audit_records").
			Unique().
			Field("action_id"),
	}
}
