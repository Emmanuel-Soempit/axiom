package handler

import (
	"go-backend-template/internal/api/project/dtos"
	"go-backend-template/internal/api/project/usecase"
	"go-backend-template/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type projectHandler struct {
	uc usecase.ProjectUsecase
}

func NewProjectHandler(uc usecase.ProjectUsecase) ProjectHandler {
	return &projectHandler{uc: uc}
}

func (h *projectHandler) getUserID(ctx *fiber.Ctx) int {
	userClaims := ctx.Locals("user").(jwt.MapClaims)
	userMap := userClaims["user"].(map[string]interface{})
	return int(userMap["id"].(float64))
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
	id := ctx.Params("id")

	p, err := h.uc.GetProjectByID(ctx.Context(), userID, id)
	if err != nil {
		return utils.NotFound(ctx, "Project not found")
	}

	return utils.Success(ctx, "Project fetched successfully", p)
}

func (h *projectHandler) UpdateProject(ctx *fiber.Ctx) error {
	userID := h.getUserID(ctx)
	id := ctx.Params("id")
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
	id := ctx.Params("id")

	if err := h.uc.DeleteProject(ctx.Context(), userID, id); err != nil {
		return utils.InternalError(ctx, "Failed to delete project", err.Error())
	}

	return utils.Success(ctx, "Project deleted successfully", nil)
}
