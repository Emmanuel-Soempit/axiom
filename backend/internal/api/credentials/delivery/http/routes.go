package http

import (
	"go-backend-template/ent"
	"go-backend-template/internal/api/credentials/delivery/http/handler"
	"go-backend-template/internal/api/credentials/repository"
	"go-backend-template/internal/api/credentials/usecase"
	"go-backend-template/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterCredentialsRoutes(router fiber.Router, client *ent.Client) {
	// Initialize dependencies
	repo := repository.NewCredentialsRepo(client)
	uc := usecase.NewCredentialsUsecase(repo)
	h := handler.NewCredentialsHandler(uc)

	credentialsGroup := router.Group("/credentials", middleware.CheckJwtToken)

	// Project-specific keys
	credentialsGroup.Get("/projects/:projectId/keys", h.GetProjectKeys)
	credentialsGroup.Post("/keys", h.CreateKey)
	credentialsGroup.Patch("/keys/:id/revoke", h.RevokeKey)
	credentialsGroup.Delete("/keys/:id", h.DeleteKey)
}
