package dtos

type CreateActionRequest struct {
	Name            string                 `json:"name" validate:"required"`
	Description     string                 `json:"description" validate:"required"`
	ProjectID       string                 `json:"project_id" validate:"required"`
	Parameters      map[string]interface{} `json:"parameters"`
	Rules           map[string]interface{} `json:"rules"`
	RequiredFeature string                 `json:"required_feature"`
	Version         int                    `json:"version"`
}

type UpdateActionRequest struct {
	Description     *string                `json:"description"`
	Parameters      map[string]interface{} `json:"parameters"`
	Rules           map[string]interface{} `json:"rules"`
	RequiredFeature *string                `json:"required_feature"`
	Version         *int                   `json:"version"`
}

type ActionResponse struct {
	ID              int                    `json:"id"`
	Name            string                 `json:"name"`
	Description     string                 `json:"description"`
	Parameters      map[string]interface{} `json:"parameters"`
	Rules           map[string]interface{} `json:"rules"`
	RequiredFeature string                 `json:"required_feature"`
	Version         int                    `json:"version"`
}
