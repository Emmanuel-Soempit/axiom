package http

import (
	"github.com/Emmanuel-Soempit/axiom/ent"
	"github.com/Emmanuel-Soempit/axiom/internal/api/auth/delivery/http/handler"
	"github.com/Emmanuel-Soempit/axiom/internal/api/auth/repository"
	"github.com/Emmanuel-Soempit/axiom/internal/api/auth/usecase"
	repository_project "github.com/Emmanuel-Soempit/axiom/internal/api/project/repository"
	"github.com/Emmanuel-Soempit/axiom/internal/middleware"

	// "github.com/Emmanuel-Soempit/axiom/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterAuthRoutes(router fiber.Router, client *ent.Client) {
	authGroup := router.Group("/auth")

	// Example implementation of JWT middleware for all auth routes
	// authGroup.Use(middleware.CheckJwtToken)

	// Implementation of rate limiting for all auth routes
	authGroup.Use(middleware.AuthRateLimiter())

	// Intiaizes structs
	userRepo := repository.NewEntUserRepo(client)
	projectRepo := repository_project.NewEntProjectRepo(client)
	authUseCase := usecase.NewAuthUsecase(userRepo, projectRepo)
	authHandler := handler.NewAuthHandler(authUseCase)

	// Routes
	authGroup.Post("/login", authHandler.LoginHandler)
	authGroup.Post("/register", authHandler.RegisterHandler)

	authGroup.Use(middleware.CheckJwtToken)
	authGroup.Post("/switch-project", authHandler.SwitchProjectHandler)
}
