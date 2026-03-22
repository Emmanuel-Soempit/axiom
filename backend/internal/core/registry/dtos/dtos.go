package dtos

type ParameterType string

const (
	TypeString  ParameterType = "string"
	TypeInt     ParameterType = "int"
	TypeFloat   ParameterType = "float"
	TypeBoolean ParameterType = "boolean"
	TypeObject  ParameterType = "object"
	TypeArray   ParameterType = "array"
)

type ParameterConstraints struct {
	Enum      []string `json:"enum,omitempty"`
	Min       *float64 `json:"min,omitempty"`
	Max       *float64 `json:"max,omitempty"`
	MinLength *int     `json:"min_length,omitempty"`
	MaxLength *int     `json:"max_length,omitempty"`
}

type ParameterSchema struct {
	Type        ParameterType               `json:"type"`
	Required    bool                        `json:"required"`
	Description string                      `json:"description,omitempty"`
	Default     interface{}                 `json:"default,omitempty"`
	Properties  map[string]*ParameterSchema `json:"properties,omitempty"`
	Items       *ParameterSchema            `json:"items,omitempty"`
	Constraints *ParameterConstraints       `json:"constraints,omitempty"`
}

type CreateActionRequest struct {
	Name            string                      `json:"name" validate:"required"`
	Description     string                      `json:"description" validate:"required"`
	Parameters      map[string]*ParameterSchema `json:"parameters"`
	RequiredFeature string                      `json:"required_feature"`
	Version         int                         `json:"version"`
}

type UpdateActionRequest struct {
	Description     *string                     `json:"description"`
	Parameters      map[string]*ParameterSchema `json:"parameters"`
	RequiredFeature *string                     `json:"required_feature"`
	Version         *int                        `json:"version"`
}

type ActionResponse struct {
	ID              int                         `json:"id"`
	Name            string                      `json:"name"`
	Description     string                      `json:"description"`
	Parameters      map[string]*ParameterSchema `json:"parameters"`
	RequiredFeature string                      `json:"required_feature"`
	Version         int                         `json:"version"`
}
