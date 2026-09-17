package handler

import (
	"strconv"
	"strings"

	"github.com/Emmanuel-Soempit/axiom/internal/core/registry/dtos"
	"github.com/Emmanuel-Soempit/axiom/internal/core/registry/usecase"
	"github.com/Emmanuel-Soempit/axiom/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type registryHandler struct {
	usecase usecase.RegistryUsecase
}

func NewRegistryHandler(uc usecase.RegistryUsecase) RegistryHandler {
	return &registryHandler{
		usecase: uc,
	}
}

func (h *registryHandler) getProjectID(ctx *fiber.Ctx) string {
	projectMap, ok := ctx.Locals("project").(map[string]interface{})
	if !ok {
		return ""
	}
	id, _ := projectMap["id"].(string)
	return id
}

func (h *registryHandler) CreateAction(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	var payload dtos.CreateActionRequest
	if err := c.BodyParser(&payload); err != nil {
		return utils.Failed(c, "Invalid request body", err.Error())
	}

	res, err := h.usecase.CreateAction(c.Context(), projectID, payload)
	if err != nil {
		errMsg := err.Error()
		if strings.Contains(errMsg, "invalid") || strings.Contains(errMsg, "not found") {
			return utils.Failed(c, errMsg, nil)
		}
		return utils.InternalError(c, "Failed to create action", errMsg)
	}

	return utils.Created(c, "Action created successfully", res)
}

func (h *registryHandler) GetAction(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid ID format", err.Error())
	}

	res, err := h.usecase.GetAction(c.Context(), projectID, id)
	if err != nil {
		return utils.NotFound(c, "Action not found")
	}

	return utils.Success(c, "Action retrieved successfully", res)
}

func (h *registryHandler) ListActions(c *fiber.Ctx) error {
	res, err := h.usecase.ListActions(c.Context())
	if err != nil {
		return utils.InternalError(c, "Failed to list actions", err.Error())
	}

	return utils.Success(c, "Actions retrieved successfully", res)
}

func (h *registryHandler) ListActionsByProject(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "projectID is required", nil)
	}

	res, err := h.usecase.ListActionsByProject(c.Context(), projectID)
	if err != nil {
		return utils.InternalError(c, "Failed to list actions for project", err.Error())
	}

	return utils.Success(c, "Actions for project retrieved successfully", res)
}

func (h *registryHandler) UpdateAction(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid ID format", err.Error())
	}

	var payload dtos.UpdateActionRequest
	if err := c.BodyParser(&payload); err != nil {
		return utils.Failed(c, "Invalid request body", err.Error())
	}

	res, err := h.usecase.UpdateAction(c.Context(), projectID, id, payload)
	if err != nil {
		return utils.InternalError(c, "Failed to update action", err.Error())
	}

	return utils.Success(c, "Action updated successfully", res)
}

func (h *registryHandler) DeleteAction(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid ID format", err.Error())
	}

	if err := h.usecase.DeleteAction(c.Context(), projectID, id); err != nil {
		return utils.InternalError(c, "Failed to delete action", err.Error())
	}

	return utils.Success(c, "Action deleted successfully", nil)
}

func (h *registryHandler) GetActionsByFeature(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	featureID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid feature ID format", err.Error())
	}

	res, err := h.usecase.GetActionsByFeatureID(c.Context(), projectID, featureID)
	if err != nil {
		return utils.InternalError(c, "Failed to list actions for feature", err.Error())
	}

	return utils.Success(c, "Actions for feature retrieved successfully", res)
}

func (h *registryHandler) CreateFeature(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	var payload dtos.CreateFeatureRequest
	if err := c.BodyParser(&payload); err != nil {
		return utils.Failed(c, "Invalid request body", err.Error())
	}

	res, err := h.usecase.CreateFeature(c.Context(), projectID, payload)
	if err != nil {
		return utils.InternalError(c, "Failed to create feature", err.Error())
	}

	return utils.Created(c, "Feature created successfully", res)
}

func (h *registryHandler) GetFeature(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid ID format", err.Error())
	}

	res, err := h.usecase.GetFeature(c.Context(), projectID, id)
	if err != nil {
		return utils.NotFound(c, "Feature not found")
	}

	return utils.Success(c, "Feature retrieved successfully", res)
}

func (h *registryHandler) ListFeaturesByProject(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "projectID is required", nil)
	}

	res, err := h.usecase.ListFeaturesByProject(c.Context(), projectID)
	if err != nil {
		return utils.InternalError(c, "Failed to list features for project", err.Error())
	}

	return utils.Success(c, "Features for project retrieved successfully", res)
}

func (h *registryHandler) UpdateFeature(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid ID format", err.Error())
	}

	var payload dtos.UpdateFeatureRequest
	if err := c.BodyParser(&payload); err != nil {
		return utils.Failed(c, "Invalid request body", err.Error())
	}

	res, err := h.usecase.UpdateFeature(c.Context(), projectID, id, payload)
	if err != nil {
		return utils.InternalError(c, "Failed to update feature", err.Error())
	}

	return utils.Success(c, "Feature updated successfully", res)
}

func (h *registryHandler) DeleteFeature(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid ID format", err.Error())
	}

	if err := h.usecase.DeleteFeature(c.Context(), projectID, id); err != nil {
		return utils.InternalError(c, "Failed to delete feature", err.Error())
	}

	return utils.Success(c, "Feature deleted successfully", nil)
}

func (h *registryHandler) CreateAgent(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	var payload dtos.CreateAgentRequest
	if err := c.BodyParser(&payload); err != nil {
		return utils.Failed(c, "Invalid request body", err.Error())
	}

	res, err := h.usecase.CreateAgent(c.Context(), projectID, payload)
	if err != nil {
		return utils.InternalError(c, "Failed to create agent", err.Error())
	}

	return utils.Created(c, "Agent created successfully", res)
}

func (h *registryHandler) GetAgent(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid ID format", err.Error())
	}

	res, err := h.usecase.GetAgent(c.Context(), projectID, id)
	if err != nil {
		return utils.NotFound(c, "Agent not found")
	}

	return utils.Success(c, "Agent retrieved successfully", res)
}

func (h *registryHandler) ListAgentsByProject(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "projectID is required", nil)
	}

	res, err := h.usecase.ListAgentsByProject(c.Context(), projectID)
	if err != nil {
		return utils.InternalError(c, "Failed to list agents for project", err.Error())
	}

	return utils.Success(c, "Agents for project retrieved successfully", res)
}

func (h *registryHandler) UpdateAgent(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid ID format", err.Error())
	}

	var payload dtos.UpdateAgentRequest
	if err := c.BodyParser(&payload); err != nil {
		return utils.Failed(c, "Invalid request body", err.Error())
	}

	res, err := h.usecase.UpdateAgent(c.Context(), projectID, id, payload)
	if err != nil {
		return utils.InternalError(c, "Failed to update agent", err.Error())
	}

	return utils.Success(c, "Agent updated successfully", res)
}

func (h *registryHandler) DeleteAgent(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid ID format", err.Error())
	}

	if err := h.usecase.DeleteAgent(c.Context(), projectID, id); err != nil {
		return utils.InternalError(c, "Failed to delete agent", err.Error())
	}

	return utils.Success(c, "Agent deleted successfully", nil)
}

func (h *registryHandler) ListAuditsByAgent(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	agentID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid agent ID format", err.Error())
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	res, err := h.usecase.ListAuditsByAgent(c.Context(), projectID, agentID, page, limit)
	if err != nil {
		return utils.InternalError(c, "Failed to list audits for agent", err.Error())
	}

	return utils.Success(c, "Audits retrieved successfully", res)
}

func (h *registryHandler) ListFeaturesByAgent(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	agentID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid agent ID format", err.Error())
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	res, err := h.usecase.ListFeaturesByAgent(c.Context(), projectID, agentID, page, limit)
	if err != nil {
		return utils.InternalError(c, "Failed to list features for agent", err.Error())
	}

	return utils.Success(c, "Features retrieved successfully", res)
}

func (h *registryHandler) ToggleAgentActive(c *fiber.Ctx) error {
	projectID := h.getProjectID(c)
	if projectID == "" {
		return utils.Failed(c, "No active project found in session", "")
	}

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return utils.Failed(c, "Invalid ID format", err.Error())
	}

	var body struct {
		Active bool `json:"active"`
	}
	if err := c.BodyParser(&body); err != nil {
		return utils.Failed(c, "Invalid request body", err.Error())
	}

	res, err := h.usecase.ToggleAgentActive(c.Context(), projectID, id, body.Active)
	if err != nil {
		return utils.InternalError(c, "Failed to toggle agent active state", err.Error())
	}

	return utils.Success(c, "Agent active state updated successfully", res)
}
