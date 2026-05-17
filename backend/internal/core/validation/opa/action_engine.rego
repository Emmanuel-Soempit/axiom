package axiom.action_engine

# Add this line to support the 'if' and 'contains' syntax properly
import future.keywords.if

default allow = false

# 1. Catch Missing Required Fields
deny[msg] if {
    # We bind param_name by iterating over the keys
    some param_name
    info := input.action.parameters[param_name]
    
    info.required == true
    not input.params[param_name]
    
    msg := sprintf("Missing required parameter: %s", [param_name])
}

# 2. Catch Type Mismatches (Integer check)
deny[msg] if {
    some param_name
    param_def := input.action.parameters[param_name]
    param_def.type == "int"
    
    val := input.params[param_name]
    not is_number(val)
    
    msg := sprintf("Parameter '%s' must be an integer, got %s", [param_name, type_name(val)])
}

# 3. Catch Type Mismatches (String check)
deny[msg] if {
    some param_name
    param_def := input.action.parameters[param_name]
    param_def.type == "string"
    
    val := input.params[param_name]
    not is_string(val)
    
    msg := sprintf("Parameter '%s' must be a string", [param_name])
}

# 4. Catch Unexpected Parameters (The "Hallucination" check)
deny[msg] if {
    some param_name
    val := input.params[param_name]
    not input.action.parameters[param_name]
    
    msg := sprintf("AI proposed unknown parameter: %s", [param_name])
}

# Final Decision Logic
allow := count(deny) == 0

result := {
    "valid": allow,
    "errors": deny
}