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
}
