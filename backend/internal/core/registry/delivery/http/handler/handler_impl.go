package handler

import (
	"go-backend-template/internal/core/registry/dtos"
	"go-backend-template/internal/core/registry/usecase"
	"go-backend-template/internal/utils"
	"strconv"

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
		return utils.InternalError(c, "Failed to create action", err.Error())
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
