package handler

import (
	"go-backend-template/internal/core/engine"
	"go-backend-template/internal/core/engine/dtos"
	"go-backend-template/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type engineHandler struct {
	engine engine.Engine
}

func NewEngineHandler(engine engine.Engine) EngineHandler {
	return &engineHandler{
		engine: engine,
	}
}

func (h *engineHandler) ProcessIntent(c *fiber.Ctx) error {
	var payload dtos.EngineProcessRequest
	if err := c.BodyParser(&payload); err != nil {
		return utils.Failed(c, "Invalid request body", err.Error())
	}

	// In a real app, we might get ProjectID from context/auth
	resp, err := h.engine.Process(c.Context(), payload.Prompt, payload.ProjectID)
	if err != nil {
		return utils.InternalError(c, "Failed to process intent", err.Error())
	}

	return utils.Success(c, "Intent processed successfully", dtos.EngineProcessResponse{
		Action: resp.Action,
		Params: resp.Params,
	})
}
