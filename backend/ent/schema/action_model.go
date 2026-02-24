package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// ActionModel holds the schema definition for the ActionModel entity.
type ActionModel struct {
	ent.Schema
}

// Mixins of the ActionModel.
func (ActionModel) Mixins() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Fields of the ActionModel.
func (ActionModel) Fields() []ent.Field {
	return []ent.Field{
		field.String("project_id"),
		field.String("name"),
		field.String("description"),
		field.JSON("parameters", map[string]interface{}{}),
		field.JSON("rules", map[string]interface{}{}),
		field.String("required_feature").Optional(),
		field.Int("version").Default(1),
	}
}

// Edges of the ActionModel.
func (ActionModel) Edges() []ent.Edge {
	return nil
}
