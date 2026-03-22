package handler

import (
	"go-backend-template/internal/api/auth/dtos"
	"go-backend-template/internal/api/auth/usecase"
	"log"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	authUc usecase.AuthUsecase
}

func NewAuthHandler(authUsecase usecase.AuthUsecase) AuthHandler {
	return &Handler{
		authUc: authUsecase,
	}
}

func (h *Handler) LoginHandler(ctx *fiber.Ctx) error {

	data := new(dtos.LoginUserPayload)

	if err := ctx.BodyParser(data); err != nil {
		log.Println("Error parsing body")
		return err
	}

	log.Println(data.Email)

	dataToSend, err := h.authUc.Login(ctx.Context(), data.Email, data.Password)
	if err != nil {
		log.Println("Error logging in")
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Login Succesful",
		"data":    dataToSend,
	})
}

func (h *Handler) RegisterHandler(ctx *fiber.Ctx) error {
	data := new(dtos.RegisterUserPayload)

	if err := ctx.BodyParser(data); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	u, err := h.authUc.Register(ctx.Context(), *data)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User created succesfully",
		"data":    u,
	})

}

func (h *Handler) SwitchProjectHandler(ctx *fiber.Ctx) error {
	payload := new(dtos.SwitchProjectPayload)
	if err := ctx.BodyParser(payload); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	// Extract user ID from context locals (set by JWT middleware)
	userMap, ok := ctx.Locals("user").(map[string]interface{})
	if !ok {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// Safely check if the user is already in the target project
	projectMap, hasProject := ctx.Locals("project").(map[string]interface{})
	if hasProject && projectMap != nil {
		if currentProjectID, ok := projectMap["id"].(string); ok && currentProjectID == payload.ProjectID {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "You are already in this project",
			})
		}
	}

	userID := int(userMap["id"].(float64))

	data, err := h.authUc.SwitchProject(ctx.Context(), userID, payload.ProjectID)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Project switched successfully",
		"data":    data,
	})
}
