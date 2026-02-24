package dtos

type EngineProcessRequest struct {
	ProjectID string `json:"project_id" validate:"required"`
	Prompt    string `json:"prompt" validate:"required"`
}

type EngineProcessResponse struct {
	Action string                 `json:"action"`
	Params map[string]interface{} `json:"params"`
}
