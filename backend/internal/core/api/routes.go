package api

import (
	"go-backend-template/ent"
	"go-backend-template/internal/core/audit"
	engineRoutes "go-backend-template/internal/core/engine/delivery/http"
	"go-backend-template/internal/core/registry"
	registryRoutes "go-backend-template/internal/core/registry/delivery/http"
	"go-backend-template/internal/core/registry/usecase"
	"go-backend-template/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func InitializeCoreRoutes(app *fiber.App, client *ent.Client) {
	// Initialize core shared dependencies
	reg := registry.NewRegistry(client)
	aud := audit.NewAuditor(client)

	apiKeyAuth := middleware.NewApiKeyAuth(client)
	// Initialize usecases
	regUsecase := usecase.NewRegistryUsecase(client, reg)

	// In a real production app, you might want to call LoadActions here
	// for specific projects or implement a lazy loading mechanism.
	routeGroup := app.Group("/api/v1/core")

	// Register sub-module routes
	engineRoutes.RegisterEngineRoutes(routeGroup, client, reg, aud, apiKeyAuth)
	registryRoutes.RegisterRegistryRoutes(routeGroup, regUsecase)
}
