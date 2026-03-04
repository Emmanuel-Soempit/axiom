package http

import (
	"go-backend-template/ent"
	"go-backend-template/internal/api/project/delivery/http/handler"
	"go-backend-template/internal/api/project/repository"
	"go-backend-template/internal/api/project/usecase"
	"go-backend-template/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterProjectRoutes(router fiber.Router, client *ent.Client) {
	// Initialize dependencies
	repo := repository.NewEntProjectRepo(client)
	uc := usecase.NewProjectUsecase(repo)
	h := handler.NewProjectHandler(uc)

	projectGroup := router.Group("/projects", middleware.CheckJwtToken)
	projectGroup.Post("/", h.CreateProject)
	projectGroup.Get("/", h.GetProjects)
	projectGroup.Get("/:id", h.GetProjectByID)
	projectGroup.Put("/:id", h.UpdateProject)
	projectGroup.Delete("/:id", h.DeleteProject)
}
