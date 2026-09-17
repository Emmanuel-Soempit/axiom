package repository

import (
	"context"
	"time"

	"github.com/Emmanuel-Soempit/axiom/ent"
	"github.com/Emmanuel-Soempit/axiom/ent/apikey"
	"github.com/Emmanuel-Soempit/axiom/ent/project"
	"github.com/Emmanuel-Soempit/axiom/internal/api/credentials/dtos"

	"github.com/google/uuid"
)

type credentialsRepo struct {
	client *ent.Client
}

func NewCredentialsRepo(client *ent.Client) CredentialsRepo {
	return &credentialsRepo{client: client}
}

func (r *credentialsRepo) Create(ctx context.Context, userID int, prefix string, hash string, projectID string, payload dtos.CreateApiKeyPayload) (*ent.ApiKey, error) {
	builder := r.client.ApiKey.Create().
		SetName(payload.Name).
		SetProjectID(projectID).
		SetKeyPrefix(prefix).
		SetKeyHash(hash).
		SetCreatedBy(userID)

	if payload.ExpiresAt != nil {
		t, err := time.Parse(time.RFC3339, *payload.ExpiresAt)
		if err == nil {
			builder.SetExpiresAt(t)
		}
	}

	return builder.Save(ctx)
}

func (r *credentialsRepo) FindAllByProjectID(ctx context.Context, projectID string) ([]*ent.ApiKey, error) {
	return r.client.ApiKey.Query().
		Where(apikey.ProjectIDEQ(projectID)).
		All(ctx)
}

func (r *credentialsRepo) FindByID(ctx context.Context, id uuid.UUID) (*ent.ApiKey, error) {
	return r.client.ApiKey.Get(ctx, id)
}

func (r *credentialsRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status string) (*ent.ApiKey, error) {
	return r.client.ApiKey.UpdateOneID(id).
		SetStatus(apikey.Status(status)).
		Save(ctx)
}

func (r *credentialsRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return r.client.ApiKey.DeleteOneID(id).Exec(ctx)
}

func (r *credentialsRepo) FindProjectByID(ctx context.Context, id string) (*ent.Project, error) {
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
