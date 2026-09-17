package usecase

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/Emmanuel-Soempit/axiom/ent"
	"github.com/Emmanuel-Soempit/axiom/internal/api/auth/dtos"
	"github.com/Emmanuel-Soempit/axiom/internal/api/auth/repository"
	projectRepository "github.com/Emmanuel-Soempit/axiom/internal/api/project/repository"
	"github.com/Emmanuel-Soempit/axiom/internal/utils"
)

type authUseCase struct {
	userRepo    repository.UserRepo
	projectRepo projectRepository.ProjectRepo
}

func NewAuthUsecase(userRepo repository.UserRepo, projectRepo projectRepository.ProjectRepo) AuthUsecase {
	return &authUseCase{
		userRepo:    userRepo,
		projectRepo: projectRepo,
	}
}

// Implement authentication logic here
func (u *authUseCase) Login(ctx context.Context, email string, password string) (*dtos.LoginResponse, error) {
	// Find user by email
	user, err := u.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	var activeProject *ent.Project
	if user.Edges.Meta != nil && user.Edges.Meta.Edges.Project != nil {
		activeProject = user.Edges.Meta.Edges.Project
	}
	// Verify password (this should use proper password hashing)

	userDTO := dtos.UserDTO{
		ID:        user.ID,
		Firstname: user.FirstName,
		Lastname:  user.LastName,
		Email:     user.Email,
		Role:      string(user.Edges.Role.Name),
		Project:   activeProject,
	}

	if err := utils.VerifyPassword(user.Password, password); err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	token, err := utils.GenerateJwtToken(&userDTO)
	if err != nil {
		return nil, err
	}

	data := dtos.LoginResponse{
		User:  userDTO,
		Token: token,
	}
	return &data, nil
}

func (u *authUseCase) Register(ctx context.Context, user dtos.RegisterUserPayload) (*dtos.UserDTO, error) {
	// Implementation would go here

	hashed, err := utils.HashPassword(user.Password)
	if err != nil {
		return nil, errors.New("could not hash password")
	}

	user.Password = string(hashed)

	newUser, err := u.userRepo.CreateNewUser(ctx, user)
	if err != nil {
		return nil, err
	}
	userDTO := dtos.UserDTO{
		ID:        newUser.ID,
		Firstname: newUser.FirstName,
		Lastname:  newUser.LastName,
		Email:     newUser.Email,
		Role:      string(newUser.Edges.Role.Name),
	}
	log.Println("Register business logic - user registered successfully")
	return &userDTO, nil
}

func (u *authUseCase) SwitchProject(ctx context.Context, userID int, projectID string) (*dtos.LoginResponse, error) {
	// Find user to ensure they exist and get their details
	user, err := u.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Verify the project exists and the user has access to it
	project, err := u.projectRepo.FindByID(ctx, projectID)
	if err != nil {
		return nil, fmt.Errorf("project not found")
	}

	// Ensure the user owns the project (simple check for now)
	if project.Edges.User.ID != userID {
		return nil, fmt.Errorf("unauthorized access to project")
	}

	// Persist active project in UserMeta
	if err := u.userRepo.UpdateUserActiveProject(ctx, userID, projectID); err != nil {
		log.Printf("failed to update user active project: %v", err)
		// We don't return an error here as the switch was technically successful
	}

	userDTO := dtos.UserDTO{
		ID:        user.ID,
		Firstname: user.FirstName,
		Lastname:  user.LastName,
		Email:     user.Email,
		Role:      string(user.Edges.Role.Name),
		Project:   project,
	}

	token, err := utils.GenerateJwtToken(&userDTO)
	if err != nil {
		return nil, err
	}

	return &dtos.LoginResponse{
		User:  userDTO,
		Token: token,
	}, nil
}
