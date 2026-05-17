package usecase

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/Emmanuel-Soempit/axiom/ent"
	"github.com/Emmanuel-Soempit/axiom/internal/api/credentials/dtos"
	"github.com/Emmanuel-Soempit/axiom/internal/api/credentials/repository"
	"github.com/Emmanuel-Soempit/axiom/internal/utils"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type credentialsUsecase struct {
	repo repository.CredentialsRepo
}

func NewCredentialsUsecase(repo repository.CredentialsRepo) CredentialsUsecase {
	return &credentialsUsecase{repo: repo}
}

func (u *credentialsUsecase) CreateKey(ctx context.Context, userID int, projectID string, payload dtos.CreateApiKeyPayload) (*dtos.CreateApiKeyResponse, error) {

	// 1. Generate prefix and secret
	project, err := u.repo.FindProjectByID(ctx, projectID)
	if err != nil {
		return nil, err
	}
	if project == nil {
		return nil, errors.New("Project not found")
	}

	secret := utils.GenerateRandomString(32)
	fullKey := fmt.Sprintf("eac_live_%s.%s", project.PublicID, secret)

	// 2. Hash the secret
	hash, err := bcrypt.GenerateFromPassword([]byte(secret), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// 3. Save to database
	p, err := u.repo.Create(ctx, userID, project.PublicID, string(hash), projectID, payload)
	if err != nil {
		return nil, err
	}

	return &dtos.CreateApiKeyResponse{
		ApiKeyResponse: *u.mapToResponse(p),
		FullKey:        fullKey,
	}, nil
}

func (u *credentialsUsecase) GetProjectKeys(ctx context.Context, projectID string) ([]dtos.ApiKeyResponse, error) {
	keys, err := u.repo.FindAllByProjectID(ctx, projectID)
	if err != nil {
		return nil, err
	}

	res := make([]dtos.ApiKeyResponse, len(keys))
	for i, k := range keys {
		res[i] = *u.mapToResponse(k)
	}
	return res, nil
}

func (u *credentialsUsecase) RevokeKey(ctx context.Context, id string) (*dtos.ApiKeyResponse, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return nil, err
	}

	p, err := u.repo.UpdateStatus(ctx, uid, "revoked")
	if err != nil {
		return nil, err
	}

	return u.mapToResponse(p), nil
}

func (u *credentialsUsecase) DeleteKey(ctx context.Context, id string) error {
	uid, err := uuid.Parse(id)
	if err != nil {
		return err
	}

	return u.repo.Delete(ctx, uid)
}

func (u *credentialsUsecase) mapToResponse(k *ent.ApiKey) *dtos.ApiKeyResponse {
	res := &dtos.ApiKeyResponse{
		ID:        k.ID.String(),
		Name:      k.Name,
		KeyPrefix: k.KeyPrefix,
		ProjectID: k.ProjectID,
		Status:    string(k.Status),
		CreatedAt: k.CreatedAt.Format(time.RFC3339),
	}

	if k.Edges.Project != nil {
		res.ProjectID = k.Edges.Project.ID
	}

	if k.LastUsedAt != nil {
		t := k.LastUsedAt.Format(time.RFC3339)
		res.LastUsedAt = &t
	}
	if k.ExpiresAt != nil {
		t := k.ExpiresAt.Format(time.RFC3339)
		res.ExpiresAt = &t
	}

	return res
}
