package validation

import (
	"context"
)

// Validator ensures LLM output follows the schema.
type Validator interface {
	Validate(ctx *context.Context, params map[string]any) (*ValidationReport, error)
}
