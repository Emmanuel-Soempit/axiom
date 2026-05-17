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
		field.Int("agent_id").Optional(),
		field.Enum("error_type").
			Values(
				"agent_not_found",
				"load_actions",
				"load_history",
				"build_system_prompt",
				"llm_chat",
				"action_not_found",
				"validation_error",
				"validation_failed",
				"persist_user_message",
				"persist_assistant_message",
				"persist_tool_message",
			).
			Optional(),
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
		edge.From("agent", Agent.Type).
			Ref("audit_records").
			Field("agent_id").
			Unique(),
	}
}
