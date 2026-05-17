package handler

import (
	"github.com/Emmanuel-Soempit/axiom/internal/core/engine"
	"github.com/Emmanuel-Soempit/axiom/internal/core/engine/dtos"
	"github.com/Emmanuel-Soempit/axiom/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
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

	// ProjectID + UserID come from the API key auth middleware
	projectID, _ := c.Locals("project_id").(string)
	userID, _ := c.Locals("user_id").(int)
	agentSlug := c.Params("slug")

	result, err := h.engine.Process(c.Context(), payload.SessionID, projectID, userID, agentSlug, payload.Prompt)
	if err != nil {
		return utils.InternalError(c, "Failed to process intent", err.Error())
	}

	return utils.Success(c, "Intent processed successfully", dtos.EngineProcessResponse{
		SessionID: result.SessionID,
		Messages:  result.Messages,
	})
}

func (h *engineHandler) GetSessionHistory(c *fiber.Ctx) error {
	sessionID, err := uuid.Parse(c.Params("sessionId"))
	if err != nil {
		return utils.Failed(c, "Invalid session id", err.Error())
	}

	messages, err := h.engine.History(c.Context(), sessionID)
	if err != nil {
		return utils.InternalError(c, "Failed to fetch history", err.Error())
	}

	return utils.Success(c, "Session history fetched", dtos.SessionHistoryResponse{
		SessionID: sessionID,
		Messages:  messages,
	})
}
