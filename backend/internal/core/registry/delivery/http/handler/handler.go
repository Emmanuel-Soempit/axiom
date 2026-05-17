package handler

import (
	"github.com/gofiber/fiber/v2"
)

type RegistryHandler interface {
	CreateAction(c *fiber.Ctx) error
	GetAction(c *fiber.Ctx) error
	ListActions(c *fiber.Ctx) error
	ListActionsByProject(c *fiber.Ctx) error
	UpdateAction(c *fiber.Ctx) error
	DeleteAction(c *fiber.Ctx) error
	GetActionsByFeature(c *fiber.Ctx) error

	CreateFeature(c *fiber.Ctx) error
	GetFeature(c *fiber.Ctx) error
	ListFeaturesByProject(c *fiber.Ctx) error
	UpdateFeature(c *fiber.Ctx) error
	DeleteFeature(c *fiber.Ctx) error

	CreateAgent(c *fiber.Ctx) error
	GetAgent(c *fiber.Ctx) error
	ListAgentsByProject(c *fiber.Ctx) error
	UpdateAgent(c *fiber.Ctx) error
	DeleteAgent(c *fiber.Ctx) error
	ToggleAgentActive(c *fiber.Ctx) error
	ListAuditsByAgent(c *fiber.Ctx) error
	ListFeaturesByAgent(c *fiber.Ctx) error
}
