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

type AuditRecordResponse struct {
	ID               int                    `json:"id"`
	ProjectID        string                 `json:"project_id"`
	Prompt           string                 `json:"prompt"`
	ProposedAction   map[string]interface{} `json:"proposed_action"`
	Validated        bool                   `json:"validated"`
	ValidationErrors []string               `json:"validation_errors"`
	FinalResponse    map[string]interface{} `json:"final_response"`
	CreatedAt        string                 `json:"created_at"`
}

type AuditStat struct {
	Value      int     `json:"value"`
	Percentage float64 `json:"percentage"`
}

type AuditSummary struct {
	Total      AuditStat `json:"total"`
	Failed     AuditStat `json:"failed"`
	Successful AuditStat `json:"successful"`
}

type AuditOverviewResponse struct {
	Audits  []AuditRecordResponse `json:"audits"`
	Summary AuditSummary          `json:"summary"`
}

type ProjectDashboardResponse struct {
	TotalActions int `json:"total_actions"`
}
