package handler

import (
	"go-backend-template/internal/api/credentials/dtos"
	"go-backend-template/internal/api/credentials/usecase"
	"go-backend-template/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type credentialsHandler struct {
	usecase usecase.CredentialsUsecase
}

func NewCredentialsHandler(usecase usecase.CredentialsUsecase) CredentialsHandler {
	return &credentialsHandler{usecase: usecase}
}
func (h *credentialsHandler) getProjectID(ctx *fiber.Ctx) string {
	projectMap, ok := ctx.Locals("project").(map[string]interface{})
	if !ok {
		return ""
	}
	id, _ := projectMap["id"].(string)
	return id
}

func (h *credentialsHandler) getUserID(ctx *fiber.Ctx) int {
	userMap, ok := ctx.Locals("user").(map[string]interface{})
	if !ok {
		return 0
	}
	id, ok := userMap["id"].(float64)
	if !ok {
		return 0
	}
	return int(id)
}

func (h *credentialsHandler) CreateKey(c *fiber.Ctx) error {
	var payload dtos.CreateApiKeyPayload
	if err := c.BodyParser(&payload); err != nil {
		return utils.Failed(c, "Invalid request payload", err.Error())
	}

	userID := h.getUserID(c)
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	res, err := h.usecase.CreateKey(c.Context(), userID, projectID, payload)
	if err != nil {
		return utils.InternalError(c, "Failed to create API key", err.Error())
	}

	return utils.Created(c, "API key created successfully", res)
}

func (h *credentialsHandler) GetProjectKeys(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}
	res, err := h.usecase.GetProjectKeys(c.Context(), projectID)
	if err != nil {
		return utils.InternalError(c, "Failed to fetch API keys", err.Error())
	}

	return utils.Success(c, "API keys fetched successfully", res)
}

func (h *credentialsHandler) RevokeKey(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.usecase.RevokeKey(c.Context(), id)
	if err != nil {
		return utils.InternalError(c, "Failed to revoke API key", err.Error())
	}

	return utils.Success(c, "API key revoked successfully", res)
}

func (h *credentialsHandler) DeleteKey(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := h.usecase.DeleteKey(c.Context(), id); err != nil {
		return utils.InternalError(c, "Failed to delete API key", err.Error())
	}

	return utils.Success(c, "API key deleted successfully", nil)
}
