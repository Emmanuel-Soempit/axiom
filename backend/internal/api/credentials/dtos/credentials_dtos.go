package dtos

type CreateApiKeyPayload struct {
	Name      string  `json:"name" validate:"required"`
	ProjectID string  `json:"project_id" validate:"required"`
	ExpiresAt *string `json:"expires_at" validate:"required"` // RFC3339 string
}

type ApiKeyResponse struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	ProjectID  string  `json:"project_id"`
	KeyPrefix  string  `json:"key_prefix"`
	Status     string  `json:"status"`
	LastUsedAt *string `json:"last_used_at,omitempty"`
	ExpiresAt  *string `json:"expires_at,omitempty"`
	CreatedAt  string  `json:"created_at"`
}

type CreateApiKeyResponse struct {
	ApiKeyResponse
	FullKey string `json:"full_key"` // The only time prefix.secret is returned
}
