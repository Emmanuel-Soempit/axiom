package validation

import (
	"fmt"
	"go-backend-template/ent"
)

// Validator ensures LLM output follows the schema.
type Validator interface {
	Validate(action *ent.ActionModel, params map[string]interface{}) error
}

type schemaValidator struct{}

func NewValidator() Validator {
	return &schemaValidator{}
}

func (v *schemaValidator) Validate(action *ent.ActionModel, params map[string]interface{}) error {
	// In a real implementation, we would use a JSON schema validator library.
	// For now, we'll do a simple check.

	actionParams := action.Parameters
	for key, _ := range actionParams {
		if _, ok := params[key]; !ok {
			return fmt.Errorf("missing required parameter: %s", key)
		}
	}

	return nil
}
