package usecase

import (
	"context"

	"github.com/Emmanuel-Soempit/axiom/internal/api/auth/dtos"
)

type AuthUsecase interface {
	// Add your auth-related methods here
	Login(ctx context.Context, email string, password string) (*dtos.LoginResponse, error)
	Register(ctx context.Context, user dtos.RegisterUserPayload) (*dtos.UserDTO, error)
	SwitchProject(ctx context.Context, userID int, projectID string) (*dtos.LoginResponse, error)
}
