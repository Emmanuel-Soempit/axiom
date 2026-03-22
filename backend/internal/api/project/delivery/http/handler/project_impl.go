package handler

import (
	"go-backend-template/internal/api/project/dtos"
	"go-backend-template/internal/api/project/usecase"
	"go-backend-template/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type projectHandler struct {
	uc usecase.ProjectUsecase
}

func NewProjectHandler(uc usecase.ProjectUsecase) ProjectHandler {
	return &projectHandler{uc: uc}
}

func (h *projectHandler) getUserID(ctx *fiber.Ctx) int {
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

func (h *projectHandler) getProjectID(ctx *fiber.Ctx) string {
	projectMap, ok := ctx.Locals("project").(map[string]interface{})
	if !ok {
		return ""
	}
	id, _ := projectMap["id"].(string)
	return id
}

func (h *projectHandler) CreateProject(ctx *fiber.Ctx) error {
	userID := h.getUserID(ctx)
	payload := new(dtos.CreateProjectPayload)
	if err := ctx.BodyParser(payload); err != nil {
		return utils.Failed(ctx, "Invalid request payload", err.Error())
	}

	p, err := h.uc.CreateProject(ctx.Context(), userID, *payload)
	if err != nil {
		return utils.InternalError(ctx, "Failed to create project", err.Error())
	}

	return utils.Created(ctx, "Project created successfully", p)
}

func (h *projectHandler) GetProjects(ctx *fiber.Ctx) error {
	userID := h.getUserID(ctx)
	projects, err := h.uc.GetUserProjects(ctx.Context(), userID)
	if err != nil {
		return utils.InternalError(ctx, "Failed to fetch projects", err.Error())
	}

	return utils.Success(ctx, "Projects fetched successfully", projects)
}

func (h *projectHandler) GetProjectByID(ctx *fiber.Ctx) error {
	userID := h.getUserID(ctx)
	id := h.getProjectID(ctx)
	if id == "" {
		return utils.Failed(ctx, "No active project found in session", "")
	}

	p, err := h.uc.GetProjectByID(ctx.Context(), userID, id)
	if err != nil {
		return utils.NotFound(ctx, "Project not found")
	}

	return utils.Success(ctx, "Project fetched successfully", p)
}

func (h *projectHandler) UpdateProject(ctx *fiber.Ctx) error {
	userID := h.getUserID(ctx)
	id := h.getProjectID(ctx)
	if id == "" {
		return utils.Failed(ctx, "No active project found in session", "")
	}
	payload := new(dtos.UpdateProjectPayload)
	if err := ctx.BodyParser(payload); err != nil {
		return utils.Failed(ctx, "Invalid request payload", err.Error())
	}

	p, err := h.uc.UpdateProject(ctx.Context(), userID, id, *payload)
	if err != nil {
		return utils.InternalError(ctx, "Failed to update project", err.Error())
	}

	return utils.Success(ctx, "Project updated successfully", p)
}

func (h *projectHandler) DeleteProject(ctx *fiber.Ctx) error {
	userID := h.getUserID(ctx)
	id := h.getProjectID(ctx)
	if id == "" {
		return utils.Failed(ctx, "No active project found in session", "")
	}

	if err := h.uc.DeleteProject(ctx.Context(), userID, id); err != nil {
		return utils.InternalError(ctx, "Failed to delete project", err.Error())
	}

	return utils.Success(ctx, "Project deleted successfully", nil)
}

func (h *projectHandler) GetAuditsByProject(ctx *fiber.Ctx) error {
	id := h.getProjectID(ctx)
	if id == "" {
		return utils.Failed(ctx, "No active project found in session", "")
	}

	audits, err := h.uc.GetAuditsByProject(ctx.Context(), id)
	if err != nil {
		return utils.InternalError(ctx, "Failed to fetch audit records", err.Error())
	}

	return utils.Success(ctx, "Audit records fetched successfully", audits)
}
