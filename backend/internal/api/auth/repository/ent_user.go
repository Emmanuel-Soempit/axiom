package repository

import (
	"context"
	"go-backend-template/ent"
	"go-backend-template/ent/role"
	"go-backend-template/ent/user"
	"go-backend-template/internal/api/auth/dtos"
	"log"
)

type entUserRepo struct {
	client *ent.Client
}

func NewEntUserRepo(client *ent.Client) UserRepo {
	return &entUserRepo{client: client}
}

// User Repo Implementations
func (r *entUserRepo) FindByEmail(ctx context.Context, email string) (*ent.User, error) {
	u, err := r.client.User.Query().
		Where(user.Email(email)).
		WithRole().
		Only(ctx)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return u, nil
}

func (r *entUserRepo) CreateNewUser(ctx context.Context, payload dtos.RegisterUserPayload) (*ent.User, error) {
	// Query role by name
	roleObj, err := r.client.Role.Query().
		Where(role.NameEQ(role.Name(payload.Role))).
		Only(ctx)
	if err != nil {
		log.Printf("failed querying role %s: %v", payload.Role, err)
		return nil, err
	}

	u, err := r.client.User.
		Create().
		SetFirstName(payload.Firstname).
		SetLastName(payload.Lastname).
		SetPassword(payload.Password).
		SetEmail(payload.Email).
		SetRole(roleObj).
		Save(ctx)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	u.Edges.Role = roleObj

	return u, nil
}
