package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/Emmanuel-Soempit/axiom/ent"
	"github.com/Emmanuel-Soempit/axiom/internal/api/project/dtos"
	"github.com/Emmanuel-Soempit/axiom/internal/api/project/repository"
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

func (u *projectUsecase) GetAuditsByProject(ctx context.Context, projectID string) (*dtos.AuditOverviewResponse, error) {
	records, err := u.repo.FindAuditsByProjectID(ctx, projectID)
	if err != nil {
		return nil, err
	}

	audits := make([]dtos.AuditRecordResponse, len(records))
	for i, r := range records {
		audits[i] = dtos.AuditRecordResponse{
			ID:               r.ID,
			ProjectID:        r.ProjectID,
			Prompt:           r.Prompt,
			ProposedAction:   r.ProposedAction,
			Validated:        r.Validated,
			ValidationErrors: r.ValidationErrors,
			FinalResponse:    r.FinalResponse,
			CreatedAt:        r.CreatedAt.Format(time.RFC3339),
		}
	}

	totalCount := len(records)
	failedCount := countFailed(records)
	successfulCount := countSuccessful(records)

	summary := dtos.AuditSummary{
		Total:      dtos.AuditStat{Value: totalCount, Percentage: ratio(totalCount, totalCount)},
		Failed:     dtos.AuditStat{Value: failedCount, Percentage: ratio(failedCount, totalCount)},
		Successful: dtos.AuditStat{Value: successfulCount, Percentage: ratio(successfulCount, totalCount)},
	}

	return &dtos.AuditOverviewResponse{
		Audits:  audits,
		Summary: summary,
	}, nil
}

func (u *projectUsecase) GetDashboardByProject(ctx context.Context, projectID string) (*dtos.ProjectDashboardResponse, error) {
	totalActions, err := u.repo.CountActionsByProjectID(ctx, projectID)
	if err != nil {
		return nil, err
	}

	return &dtos.ProjectDashboardResponse{
		TotalActions: totalActions,
	}, nil
}

func ratio(value, total int) float64 {
	if total == 0 {
		return 0
	}

	return (float64(value) / float64(total)) * 100
}

func countFailed(records []*ent.AuditRecord) int {
	count := 0
	for _, r := range records {
		if !r.Validated {
			count++
		}
	}
	return count
}

func countSuccessful(records []*ent.AuditRecord) int {
	count := 0
	for _, r := range records {
		if r.Validated {
			count++
		}
	}
	return count
}
