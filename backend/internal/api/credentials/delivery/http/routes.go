package http

import (
	"github.com/Emmanuel-Soempit/axiom/ent"
	"github.com/Emmanuel-Soempit/axiom/internal/api/credentials/delivery/http/handler"
	"github.com/Emmanuel-Soempit/axiom/internal/api/credentials/repository"
	"github.com/Emmanuel-Soempit/axiom/internal/api/credentials/usecase"
	"github.com/Emmanuel-Soempit/axiom/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterCredentialsRoutes(router fiber.Router, client *ent.Client) {
	// Initialize dependencies
	repo := repository.NewCredentialsRepo(client)
	uc := usecase.NewCredentialsUsecase(repo)
	h := handler.NewCredentialsHandler(uc)

	credentialsGroup := router.Group("/credentials", middleware.CheckJwtToken)

	// Project-specific keys
	credentialsGroup.Get("/keys", h.GetProjectKeys)
	credentialsGroup.Post("/keys", h.CreateKey)
	credentialsGroup.Patch("/keys/:id/revoke", h.RevokeKey)
	credentialsGroup.Delete("/keys/:id", h.DeleteKey)
}
