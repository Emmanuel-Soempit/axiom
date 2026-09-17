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
	FeatureID       int                         `json:"feature_id" validate:"required"`
	Parameters      map[string]*ParameterSchema `json:"parameters"`
	RequiredFeature string                      `json:"required_feature"`
	Version         int                         `json:"version"`
}

type UpdateActionRequest struct {
	Description     *string                     `json:"description"`
	FeatureID       *int                        `json:"feature_id"`
	Parameters      map[string]*ParameterSchema `json:"parameters"`
	RequiredFeature *string                     `json:"required_feature"`
	Version         *int                        `json:"version"`
}

type ActionResponse struct {
	ID              int                         `json:"id"`
	Name            string                      `json:"name"`
	Description     string                      `json:"description"`
	FeatureID       int                         `json:"feature_id"`
	Parameters      map[string]*ParameterSchema `json:"parameters"`
	RequiredFeature string                      `json:"required_feature"`
	Version         int                         `json:"version"`
}

// Feature DTOs

type CreateFeatureRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description" validate:"required"`
}

type UpdateFeatureRequest struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
}

type FeatureResponse struct {
	ID          int    `json:"id"`
	ProjectID   string `json:"project_id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Slug        string `json:"slug"`
}

// Agent DTOs

type CreateAgentRequest struct {
	Name         string `json:"name" validate:"required"`
	Description  string `json:"description"`
	SystemPrompt string `json:"system_prompt"`
	Features     []int  `json:"features"`
}

type UpdateAgentRequest struct {
	Name         *string `json:"name"`
	Description  *string `json:"description"`
	SystemPrompt *string `json:"system_prompt"`
	Features     []int   `json:"features"`
	Active       *bool   `json:"active"`
}

type AgentResponse struct {
	ID           int    `json:"id"`
	ProjectID    string `json:"project_id"`
	Name         string `json:"name"`
	Slug         string `json:"slug"`
	Description  string `json:"description"`
	SystemPrompt string `json:"system_prompt"`
	Active       bool   `json:"active"`
	Features     []int  `json:"features,omitempty"`
}

// Audit DTOs

type AuditResponse struct {
	ID               int                    `json:"id"`
	ProjectID        string                 `json:"project_id"`
	AgentID          *int                   `json:"agent_id,omitempty"`
	UserID           *int                   `json:"user_id,omitempty"`
	ActionID         *int                   `json:"action_id,omitempty"`
	Prompt           string                 `json:"prompt"`
	ProposedAction   map[string]interface{} `json:"proposed_action,omitempty"`
	Validated        bool                   `json:"validated"`
	ValidationErrors []string               `json:"validation_errors,omitempty"`
	FinalResponse    map[string]interface{} `json:"final_response,omitempty"`
	ErrorType        string                 `json:"error_type,omitempty"`
	CreatedAt        string                 `json:"created_at"`
}

type PaginatedResponse[T any] struct {
	Data    []T  `json:"data"`
	Total   int  `json:"total"`
	Page    int  `json:"page"`
	Limit   int  `json:"limit"`
	HasNext bool `json:"has_next"`
}
