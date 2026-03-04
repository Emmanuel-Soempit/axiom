package main

import (
	"context"
	"log"
	"os"

	"go-backend-template/ent"
	"go-backend-template/ent/role"
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

	roles := []role.Name{
		role.NameClient,
		role.NameAdmin,
	}

	for _, name := range roles {
		exists, err := client.Role.
			Query().
			Where(role.NameEQ(name)).
			Exist(ctx)
		if err != nil {
			log.Printf("failed checking existence of role %s: %v", name, err)
			continue
		}

		if !exists {
			_, err := client.Role.
				Create().
				SetName(name).
				SetDescription(string(name) + " role").
				Save(ctx)
			if err != nil {
				log.Printf("failed seeding role %s: %v", name, err)
			} else {
				log.Printf("successfully seeded role: %s", name)
			}
		} else {
			log.Printf("role %s already exists, skipping", name)
		}
	}

	log.Println("Seeding complete!")
}
