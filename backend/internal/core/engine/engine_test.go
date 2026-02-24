package engine

import (
	"context"
	"testing"

	"go-backend-template/ent/enttest"
	"go-backend-template/internal/core/audit"
	"go-backend-template/internal/core/llm"
	"go-backend-template/internal/core/registry"
	"go-backend-template/internal/core/validation"

	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

func TestEngine_Process(t *testing.T) {
	ctx := context.Background()
	client := enttest.Open(t, "sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
	defer client.Close()

	// 1. Setup Data
	projectID := "test-project"
	_, err := client.ActionModel.Create().
		SetProjectID(projectID).
		SetName("create_task").
		SetDescription("Creates a new task").
		SetParameters(map[string]interface{}{"title": "string"}).
		SetRules(map[string]interface{}{}).
		Save(ctx)
	assert.NoError(t, err)

	// 2. Setup Components
	reg := registry.NewRegistry(client)
	mockResp := `{"action": "create_task", "params": {"title": "Buy milk"}}`
	llmProv := llm.NewMockProvider(mockResp)
	auditor := audit.NewAuditor(client)
	validator := validation.NewValidator()

	eng := NewEngine(reg, llmProv, auditor, validator)

	// 3. Process
	resp, err := eng.Process(ctx, "I want to buy milk", projectID)

	// 4. Verify
	assert.NoError(t, err)
	assert.Equal(t, "create_task", resp.Action)
	assert.Equal(t, "Buy milk", resp.Params["title"])

	// Verify Audit
	audits, err := client.AuditRecord.Query().All(ctx)
	assert.NoError(t, err)
	assert.Len(t, audits, 1)
	assert.Equal(t, "I want to buy milk", audits[0].Prompt)
	assert.True(t, audits[0].Validated)
}
