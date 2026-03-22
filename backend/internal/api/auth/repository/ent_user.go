package repository

import (
	"context"
	"go-backend-template/ent"
	"go-backend-template/ent/role"
	"go-backend-template/ent/user"
	"go-backend-template/ent/usermeta"
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
		WithMeta(func(q *ent.UserMetaQuery) {
			q.WithProject()
		}).
		Only(ctx)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return u, nil
}

func (r *entUserRepo) FindByID(ctx context.Context, id int) (*ent.User, error) {
	u, err := r.client.User.Query().
		Where(user.IDEQ(id)).
		WithRole().
		WithMeta(func(q *ent.UserMetaQuery) {
			q.WithProject()
		}).
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

	metaObj, err := r.client.UserMeta.Create().SetUser(u).Save(ctx)
	if err != nil {
		log.Printf("failed querying role %s: %v", payload.Role, err)
		return nil, err
	}

	u.Edges.Role = roleObj
	u.Edges.Meta = metaObj

	return u, nil
}
func (r *entUserRepo) UpdateUserActiveProject(ctx context.Context, userID int, projectID string) error {
	meta, err := r.client.UserMeta.Query().
		Where(usermeta.UserIDEQ(userID)).
		Only(ctx)

	if err != nil {
		if ent.IsNotFound(err) {
			_, err = r.client.UserMeta.Create().
				SetUserID(userID).
				SetLastActiveProject(projectID).
				Save(ctx)
			return err
		}
		return err
	}

	_, err = meta.Update().
		SetLastActiveProject(projectID).
		Save(ctx)
	return err
}
