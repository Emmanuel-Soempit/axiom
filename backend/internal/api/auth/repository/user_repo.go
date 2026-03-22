package repository

import (
	"context"
	"go-backend-template/ent"
	"go-backend-template/internal/api/auth/dtos"
)

type UserRepo interface {
	FindByEmail(ctx context.Context, email string) (*ent.User, error)
	FindByID(ctx context.Context, id int) (*ent.User, error)
	CreateNewUser(ctx context.Context, user dtos.RegisterUserPayload) (*ent.User, error)
	UpdateUserActiveProject(ctx context.Context, userID int, projectID string) error
}
