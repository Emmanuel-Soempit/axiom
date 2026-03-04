package http

import (
	"go-backend-template/internal/core/registry/delivery/http/handler"
	"go-backend-template/internal/core/registry/usecase"
	"go-backend-template/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterRegistryRoutes(router fiber.Router, uc usecase.RegistryUsecase) {
	h := handler.NewRegistryHandler(uc)

	router.Use(middleware.CheckJwtToken)
	registryGroup := router.Group("/registry")
	registryGroup.Post("/actions", h.CreateAction)
	registryGroup.Get("/actions", h.ListActions)
	registryGroup.Get("/actions/project/:projectId", h.ListActionsByProject)
	registryGroup.Get("/actions/:id", h.GetAction)
	registryGroup.Put("/actions/:id", h.UpdateAction)
	registryGroup.Delete("/actions/:id", h.DeleteAction)
}
