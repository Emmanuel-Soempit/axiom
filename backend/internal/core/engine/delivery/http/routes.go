package http

import (
	"context"
	"go-backend-template/ent"
	"go-backend-template/internal/core/audit"
	"go-backend-template/internal/core/engine"
	"go-backend-template/internal/core/engine/delivery/http/handler"
	"go-backend-template/internal/core/llm"
	"go-backend-template/internal/core/registry"
	"go-backend-template/internal/core/validation"
	"go-backend-template/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterEngineRoutes(router fiber.Router, client *ent.Client, registry registry.Registry, auditor audit.Auditor, apiKeyAuth middleware.ApiKeyAuthMiddleware) {
	// Initialize Engine dependencies
	llmProvider := llm.NewGroqProvider()
	validator, err := validation.New(context.Background(), "internal/core/validation/opa/action_engine.rego")
	if err != nil {
		panic(err)
	}
	messageStore := engine.NewEntMessageStore(client)
	eng := engine.NewEngine(registry, llmProvider, auditor, validator, messageStore)

	h := handler.NewEngineHandler(eng)

	engineGroup := router.Group("/engine")

	engineGroup.Use(middleware.CoreRateLimiter())

	engineGroup.Use(apiKeyAuth.ApiKeyAuth)
	engineGroup.Post("/process", h.ProcessIntent)
	engineGroup.Get("/sessions/:sessionId/history", h.GetSessionHistory)
}
