package dtos

type CreateProjectPayload struct {
	Name string `json:"name" validate:"required"`
}

type UpdateProjectPayload struct {
	Name string `json:"name"`
}

type ProjectResponse struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	PublicID  string `json:"public_id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}
