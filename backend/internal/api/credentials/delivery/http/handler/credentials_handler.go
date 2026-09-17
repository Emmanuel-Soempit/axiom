package handler

import "github.com/gofiber/fiber/v2"

type CredentialsHandler interface {
	CreateKey(c *fiber.Ctx) error
	GetProjectKeys(c *fiber.Ctx) error
	RevokeKey(c *fiber.Ctx) error
	DeleteKey(c *fiber.Ctx) error
}
