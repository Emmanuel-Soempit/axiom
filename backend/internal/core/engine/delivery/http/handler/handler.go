package handler

import (
	"github.com/gofiber/fiber/v2"
)

type EngineHandler interface {
	ProcessIntent(c *fiber.Ctx) error
	GetSessionHistory(c *fiber.Ctx) error
}
