package http

import (
	"go-backend-template/internal/core/audit"
	"go-backend-template/internal/core/engine"
	"go-backend-template/internal/core/engine/delivery/http/handler"
	"go-backend-template/internal/core/llm"
	"go-backend-template/internal/core/registry"
	"go-backend-template/internal/core/validation"

	"github.com/gofiber/fiber/v2"
)

func RegisterEngineRoutes(router fiber.Router, registry registry.Registry, auditor audit.Auditor) {
	// Initialize Engine dependencies
	llmProvider := llm.NewGroqProvider()
	validator := validation.NewValidator()
	eng := engine.NewEngine(registry, llmProvider, auditor, validator)

	h := handler.NewEngineHandler(eng)

	engineGroup := router.Group("/engine")
	engineGroup.Post("/process", h.ProcessIntent)
}
