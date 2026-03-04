package repository

import (
	"context"
	"go-backend-template/ent"
	"go-backend-template/ent/project"
	"go-backend-template/ent/user"
	"go-backend-template/internal/api/project/dtos"
	"log"

	"github.com/google/uuid"
)

type entProjectRepo struct {
	client *ent.Client
}

func NewEntProjectRepo(client *ent.Client) ProjectRepo {
	return &entProjectRepo{client: client}
}

func (r *entProjectRepo) Create(ctx context.Context, userID int, payload dtos.CreateProjectPayload) (*ent.Project, error) {
	publicID := generatePublicID(4)
	p, err := r.client.Project.
		Create().
		SetID(uuid.New().String()).
		SetPublicID(publicID).
		SetName(payload.Name).
		SetUserID(userID).
		Save(ctx)
	if err != nil {
		log.Printf("failed creating project: %v", err)
		return nil, err
	}
	return p, nil
}

func (r *entProjectRepo) FindAllByUserID(ctx context.Context, userID int) ([]*ent.Project, error) {
	projects, err := r.client.Project.
		Query().
		Where(project.HasUserWith(user.ID(userID))).
		All(ctx)
	if err != nil {
		return nil, err
	}
	return projects, nil
}

func (r *entProjectRepo) FindByID(ctx context.Context, id string) (*ent.Project, error) {
	p, err := r.client.Project.
		Query().
		Where(project.ID(id)).
		WithUser().
		Only(ctx)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (r *entProjectRepo) Update(ctx context.Context, id string, payload dtos.UpdateProjectPayload) (*ent.Project, error) {
	u := r.client.Project.UpdateOneID(id)
	if payload.Name != "" {
		u.SetName(payload.Name)
	}
	p, err := u.Save(ctx)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (r *entProjectRepo) Delete(ctx context.Context, id string) error {
	return r.client.Project.DeleteOneID(id).Exec(ctx)
}
