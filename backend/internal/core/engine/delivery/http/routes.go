package http

import (
	"context"

	"github.com/Emmanuel-Soempit/axiom/ent"
	"github.com/Emmanuel-Soempit/axiom/internal/core/audit"
	"github.com/Emmanuel-Soempit/axiom/internal/core/engine"
	"github.com/Emmanuel-Soempit/axiom/internal/core/engine/delivery/http/handler"
	"github.com/Emmanuel-Soempit/axiom/internal/core/llm"
	"github.com/Emmanuel-Soempit/axiom/internal/core/registry"
	"github.com/Emmanuel-Soempit/axiom/internal/core/validation"
	"github.com/Emmanuel-Soempit/axiom/internal/middleware"

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
	eng := engine.NewEngine(client, registry, llmProvider, auditor, validator, messageStore)

	h := handler.NewEngineHandler(eng)

	engineGroup := router.Group("/engine")

	engineGroup.Use(middleware.CoreRateLimiter())

	engineGroup.Use(apiKeyAuth.ApiKeyAuth)
	engineGroup.Post("/process/:slug", h.ProcessIntent)
	engineGroup.Get("/sessions/:sessionId/history", h.GetSessionHistory)
}
