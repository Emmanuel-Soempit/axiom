package http

import (
	"github.com/Emmanuel-Soempit/axiom/internal/core/registry/delivery/http/handler"
	"github.com/Emmanuel-Soempit/axiom/internal/core/registry/usecase"
	"github.com/Emmanuel-Soempit/axiom/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterRegistryRoutes(router fiber.Router, uc usecase.RegistryUsecase) {
	h := handler.NewRegistryHandler(uc)

	router.Use(middleware.CheckJwtToken)
	registryGroup := router.Group("/registry")
	registryGroup.Post("/actions", h.CreateAction)
	registryGroup.Get("/actions", h.ListActionsByProject)
	registryGroup.Get("/actions/:id", h.GetAction)
	registryGroup.Put("/actions/:id", h.UpdateAction)
	registryGroup.Delete("/actions/:id", h.DeleteAction)

	registryGroup.Post("/features", h.CreateFeature)
	registryGroup.Get("/features", h.ListFeaturesByProject)
	registryGroup.Get("/features/:id", h.GetFeature)
	registryGroup.Get("/features/:id/actions", h.GetActionsByFeature)
	registryGroup.Put("/features/:id", h.UpdateFeature)
	registryGroup.Delete("/features/:id", h.DeleteFeature)

	registryGroup.Post("/agents", h.CreateAgent)
	registryGroup.Get("/agents", h.ListAgentsByProject)
	registryGroup.Get("/agents/:id", h.GetAgent)
	registryGroup.Put("/agents/:id", h.UpdateAgent)
	registryGroup.Put("/agents/:id/active", h.ToggleAgentActive)
	registryGroup.Delete("/agents/:id", h.DeleteAgent)
	registryGroup.Get("/agents/:id/audits", h.ListAuditsByAgent)
	registryGroup.Get("/agents/:id/features", h.ListFeaturesByAgent)

}
