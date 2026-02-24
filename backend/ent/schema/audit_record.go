package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// AuditRecord holds the schema definition for the AuditRecord entity.
type AuditRecord struct {
	ent.Schema
}

// Mixins of the AuditRecord.
func (AuditRecord) Mixins() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Fields of the AuditRecord.
func (AuditRecord) Fields() []ent.Field {
	return []ent.Field{
		field.String("project_id"),
		field.String("user_id"),
		field.Text("prompt"),
		field.JSON("proposed_action", map[string]interface{}{}).Optional(),
		field.Bool("validated").Default(false),
		field.JSON("final_response", map[string]interface{}{}).Optional(),
	}
}

// Edges of the AuditRecord.
func (AuditRecord) Edges() []ent.Edge {
	return nil
}
