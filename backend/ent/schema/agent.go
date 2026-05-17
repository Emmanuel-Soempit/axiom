package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Agent holds the schema definition for the Agent entity.
type Agent struct {
	ent.Schema
}

// Mixin of the Agent.
func (Agent) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Fields of the Agent.
func (Agent) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").NotEmpty(),
		field.Text("slug").Unique(),
		field.String("description").Optional(),
		field.Text("system_prompt").Optional(),
		field.String("project_id"),
		field.Bool("active").Default(true),
	}
}

// Edges of the Agent.
func (Agent) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("project", Project.Type).
			Ref("agents").
			Unique().
			Field("project_id").
			Required(),
		edge.To("audit_records", AuditRecord.Type),
		edge.To("feature", Feature.Type),
	}
}
