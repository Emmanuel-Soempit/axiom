package main

import (
	"context"
	"log"
	"os"

	"go-backend-template/ent"
	"go-backend-template/ent/actionmodel"
	_ "go-backend-template/ent/runtime"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	// Load environment variables (assuming run from backend root)
	if err := godotenv.Load(".env"); err != nil {
		log.Println("No .env file found in current directory, trying ../../.env")
		if err := godotenv.Load("../../.env"); err != nil {
			log.Println("No .env file found, falling back to OS env")
		}
	}

	// Connect to database
	client, err := ent.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("failed opening connection to postgres: %v", err)
	}
	defer client.Close()

	ctx := context.Background()

	// Run migration to ensure schemas are up to date
	if err := client.Schema.Create(ctx); err != nil {
		log.Fatalf("failed creating schema resources: %v", err)
	}

	seeds := []struct {
		ProjectID       string
		Name            string
		Description     string
		Parameters      map[string]interface{}
		Rules           map[string]interface{}
		RequiredFeature string
	}{
		{
			ProjectID:   "system-core",
			Name:        "create_task",
			Description: "Creates a new task in the management system",
			Parameters: map[string]interface{}{
				"title":       "string",
				"description": "string",
				"priority":    "string",
			},
			Rules: map[string]interface{}{
				"required": []string{"title", "priority"},
				"enum": map[string]interface{}{
					"priority": []string{"high", "medium", "low"},
				},
			},
		},
		{
			ProjectID:   "system-core",
			Name:        "update_invoice",
			Description: "Updates an existing invoice status or details",
			Parameters: map[string]interface{}{
				"invoice_id": "integer",
				"status":     "string",
				"notes":      "string",
			},
			Rules: map[string]interface{}{
				"required": []string{"invoice_id", "status"},
				"enum": map[string]interface{}{
					"status": []string{"paid", "unpaid", "void", "refunded"},
				},
			},
		},
	}

	for _, s := range seeds {
		// Idempotent seeding logic: Check if action already exists for the project
		exists, err := client.ActionModel.
			Query().
			Where(
				actionmodel.ProjectID(s.ProjectID),
				actionmodel.Name(s.Name),
			).
			Exist(ctx)
		if err != nil {
			log.Printf("failed checking existence of %s: %v", s.Name, err)
			continue
		}

		if !exists {
			_, err := client.ActionModel.
				Create().
				SetProjectID(s.ProjectID).
				SetName(s.Name).
				SetDescription(s.Description).
				SetParameters(s.Parameters).
				SetRules(s.Rules).
				SetNillableRequiredFeature(&s.RequiredFeature).
				Save(ctx)
			if err != nil {
				log.Printf("failed seeding action %s: %v", s.Name, err)
			} else {
				log.Printf("successfully seeded action: %s", s.Name)
			}
		} else {
			log.Printf("action %s already exists for project %s, skipping", s.Name, s.ProjectID)
		}
	}

	log.Println("Seeding complete!")
}
