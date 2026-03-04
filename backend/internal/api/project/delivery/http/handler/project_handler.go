package handler

import (
	"github.com/gofiber/fiber/v2"
)

type ProjectHandler interface {
	CreateProject(*fiber.Ctx) error
	GetProjects(*fiber.Ctx) error
	GetProjectByID(*fiber.Ctx) error
	UpdateProject(*fiber.Ctx) error
	DeleteProject(*fiber.Ctx) error
}
