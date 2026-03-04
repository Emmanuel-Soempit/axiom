package usecase

import (
	"context"
	"errors"
	"go-backend-template/internal/api/project/dtos"
	"go-backend-template/internal/api/project/repository"
	"time"
)

type projectUsecase struct {
	repo repository.ProjectRepo
}

func NewProjectUsecase(repo repository.ProjectRepo) ProjectUsecase {
	return &projectUsecase{repo: repo}
}

func (u *projectUsecase) CreateProject(ctx context.Context, userID int, payload dtos.CreateProjectPayload) (*dtos.ProjectResponse, error) {
	p, err := u.repo.Create(ctx, userID, payload)
	if err != nil {
		return nil, err
	}
	return &dtos.ProjectResponse{
		ID:        p.ID,
		Name:      p.Name,
		CreatedAt: p.CreatedAt.Format(time.RFC3339),
		UpdatedAt: p.UpdatedAt.Format(time.RFC3339),
	}, nil
}

func (u *projectUsecase) GetUserProjects(ctx context.Context, userID int) ([]dtos.ProjectResponse, error) {
	projects, err := u.repo.FindAllByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	res := make([]dtos.ProjectResponse, len(projects))
	for i, p := range projects {
		res[i] = dtos.ProjectResponse{
			ID:        p.ID,
			Name:      p.Name,
			PublicID:  p.PublicID,
			CreatedAt: p.CreatedAt.Format(time.RFC3339),
			UpdatedAt: p.UpdatedAt.Format(time.RFC3339),
		}
	}
	return res, nil
}

func (u *projectUsecase) GetProjectByID(ctx context.Context, userID int, id string) (*dtos.ProjectResponse, error) {
	p, err := u.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Verify ownership is usually done at repo level or here
	// Assuming FindByID with WithUser allows checking
	if p.Edges.User.ID != userID {
		return nil, errors.New("unauthorized access to project")
	}

	return &dtos.ProjectResponse{
		ID:        p.ID,
		Name:      p.Name,
		PublicID:  p.PublicID,
		CreatedAt: p.CreatedAt.Format(time.RFC3339),
		UpdatedAt: p.UpdatedAt.Format(time.RFC3339),
	}, nil
}

func (u *projectUsecase) UpdateProject(ctx context.Context, userID int, id string, payload dtos.UpdateProjectPayload) (*dtos.ProjectResponse, error) {
	// First check ownership
	p, err := u.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if p.Edges.User.ID != userID {
		return nil, errors.New("unauthorized access to project")
	}

	updated, err := u.repo.Update(ctx, id, payload)
	if err != nil {
		return nil, err
	}

	return &dtos.ProjectResponse{
		ID:        updated.ID,
		Name:      updated.Name,
		PublicID:  updated.PublicID,
		CreatedAt: updated.CreatedAt.Format(time.RFC3339),
		UpdatedAt: updated.UpdatedAt.Format(time.RFC3339),
	}, nil
}

func (u *projectUsecase) DeleteProject(ctx context.Context, userID int, id string) error {
	// First check ownership
	p, err := u.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if p.Edges.User.ID != userID {
		return errors.New("unauthorized access to project")
	}

	return u.repo.Delete(ctx, id)
}
