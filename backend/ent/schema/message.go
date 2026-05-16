package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// Message holds the schema definition for the conversation history.
type Message struct {
	ent.Schema
}

// Mixin of the Message.
func (Message) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Fields of the Message.
func (Message) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("session_id", uuid.UUID{}),
		field.Enum("role").Values("system", "user", "assistant", "action_result"),
		field.Text("content").Optional(),

		// The name of the Action from ActionModel (when the message represents
		// a tool/action call).
		field.String("action_name").Optional(),

		// The unique ID provided by the LLM (e.g., Groq's call_abc123).
		field.String("call_id").Optional(),

		// The arguments the LLM provided, validated against ParameterSchema.
		field.JSON("arguments", map[string]interface{}{}).Optional(),

		// OPA / validation decision snapshot — the "EAC" special sauce.
		field.JSON("opa_decision", map[string]interface{}{}).Optional(),
	}
}

// Edges of the Message.
func (Message) Edges() []ent.Edge {
	return []ent.Edge{
		// Optional link to the ActionModel that was invoked, for traceability
		// across schema versions.
		edge.To("action", ActionModel.Type).Unique(),
	}
}
