package middleware

import (
	"log"
	"strings"

	"go-backend-template/ent"
	"go-backend-template/ent/apikey"
	"go-backend-template/ent/project"
	"go-backend-template/internal/utils"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type ApiKeyAuthMiddleware interface {
	ApiKeyAuth(c *fiber.Ctx) error
}

type ApiKeyAuth struct {
	client *ent.Client
}

func NewApiKeyAuth(client *ent.Client) ApiKeyAuthMiddleware {
	return &ApiKeyAuth{
		client: client,
	}
}

func (a *ApiKeyAuth) ApiKeyAuth(c *fiber.Ctx) error {
	apiKey := c.Get("Authorization")
	if apiKey == "" {
		return utils.Unauthorized(c, "Invalid API Key")
	}

	BearerToken := "Bearer "
	if !strings.HasPrefix(apiKey, BearerToken) {
		log.Printf("Invalid API Key format: %s", apiKey)
		return utils.Unauthorized(c, "Invalid API Key")
	}

	apiKey = apiKey[len(BearerToken):]

	// Extract the public ID section (e.g., fcbaa008 from eac_live_fcbaa008.xxxx)
	token := strings.TrimPrefix(apiKey, "eac_live_")
	parts := strings.SplitN(token, ".", 2)
	if len(parts) != 2 {
		return utils.Unauthorized(c, "Invalid API Key format")
	}
	publicID := parts[0]
	secret := parts[1]

	// Find the API Key in the database
	apiKeyRecords, err := a.client.ApiKey.Query().
		Where(apikey.KeyPrefix(publicID)).All(c.Context())

	if err != nil {
		log.Printf("API Key not found with prefix %s: %v", publicID, err)
		return utils.Unauthorized(c, "Invalid API Key")
	}
	// log.Printf("API Key found with prefix %s: %v", publicID, apiKeyRecord)

	// Verify the secret hash
	var apiKeyRecord *ent.ApiKey
	for _, key := range apiKeyRecords {
		if err := bcrypt.CompareHashAndPassword([]byte(key.KeyHash), []byte(secret)); err != nil {
			log.Printf("Invalid secret for API Key %s: %v", publicID, err)
			continue
		} else {
			apiKeyRecord = key
			break
		}
	}
	if apiKeyRecord == nil {
		return utils.Unauthorized(c, "Invalid API Key")
	}

	// Verify the project exists (optional redundancy, but good for context)
	exists, err := a.client.Project.Query().
		Where(project.PublicID(publicID)).
		Exist(c.Context())
	if err != nil || !exists {
		return utils.Unauthorized(c, "Associated project not found")
	}

	// Store project ID in context for downstream handlers
	c.Locals("project_id", apiKeyRecord.ProjectID)

	return c.Next()
}
