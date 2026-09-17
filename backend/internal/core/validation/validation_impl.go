package validation

import (
	"context"
	"fmt"

	"github.com/open-policy-agent/opa/rego"
)

// Define what the Go code expects back from Rego

type ValidationReport struct {
	Valid  bool     `json:"valid"`
	Errors []string `json:"errors"`
}

// validator handles the OPA lifecycle
type validator struct {
	query rego.PreparedEvalQuery
}

// New initializes and compiles the Rego file
func New(ctx context.Context, regoFilePath string) (Validator, error) {
	r := rego.New(
		rego.Query("data.axiom.action_engine.result"), // Path to the 'result' variable in your Rego
		rego.Load([]string{regoFilePath}, nil),
	)

	prepared, err := r.PrepareForEval(ctx)
	if err != nil {
		return nil, err
	}

	return &validator{query: prepared}, nil
}

// Validate takes the AI result and the Action Schema and returns a report
func (v *validator) Validate(ctx *context.Context, params map[string]any) (*ValidationReport, error) {
	results, err := v.query.Eval(*ctx, rego.EvalInput(params))
	if err != nil {
		return nil, err
	}

	if len(results) == 0 {
		return &ValidationReport{Valid: false, Errors: []string{"No results from OPA"}}, nil
	}

	// Extract the JSON-like map from OPA's internal format
	raw, ok := results[0].Expressions[0].Value.(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("unexpected OPA output format")
	}

	// Map to our Go struct
	report := &ValidationReport{
		Valid: raw["valid"].(bool),
	}

	if errs, ok := raw["errors"].(map[string]interface{}); ok {
		// fmt.Println("Errs output:", errs)
		for errMsg := range errs {
			// fmt.Println("Raw OPA output:", errMsg)
			report.Errors = append(report.Errors, errMsg)
		}
	}

	return report, nil
}
