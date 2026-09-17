#!/bin/bash
# seal-secrets.sh — Encrypt secrets for a given environment using Sealed Secrets
#
# Prerequisites:
#   brew install kubeseal
#   kubectl must be configured and pointing to your cluster
#
# Usage:
#   ./scripts/seal-secrets.sh dev
#   ./scripts/seal-secrets.sh staging
#   ./scripts/seal-secrets.sh production

set -e

ENV=$1

if [ -z "$ENV" ]; then
  echo "Usage: ./scripts/seal-secrets.sh <dev|staging|production>"
  exit 1
fi

case "$ENV" in
  dev)
    NAMESPACE="axiom-dev"
    ;;
  staging)
    NAMESPACE="axiom-staging"
    ;;
  production)
    NAMESPACE="axiom-prod"
    ;;
  *)
    echo "Unknown environment: $ENV. Use dev, staging, or production."
    exit 1
    ;;
esac

OVERLAY_PATH="k8s/overlays/$ENV/secrets"
OUTPUT_FILE="$OVERLAY_PATH/sealed-secrets.yaml"

echo ""
echo "Sealing secrets for environment: $ENV (namespace: $NAMESPACE)"
echo ""

# Prompt for secret values
read -sp "DATABASE_URL: " DATABASE_URL; echo
read -sp "JWT_SECRET: " JWT_SECRET; echo
read -sp "GROQ_API_KEY: " GROQ_API_KEY; echo
read -sp "POSTGRES_PASSWORD: " POSTGRES_PASSWORD; echo

echo ""
echo "Fetching cluster public key and sealing..."

# Create a temp plaintext secret, pipe to kubeseal, write output
kubectl create secret generic axiom-secrets \
  --namespace="$NAMESPACE" \
  --from-literal=database_url="$DATABASE_URL" \
  --from-literal=jwt_secret="$JWT_SECRET" \
  --from-literal=groq_api_key="$GROQ_API_KEY" \
  --from-literal=postgres_password="$POSTGRES_PASSWORD" \
  --dry-run=client \
  -o yaml | kubeseal \
    --namespace "$NAMESPACE" \
    --format yaml \
  > "$OUTPUT_FILE"

echo ""
echo "Done. Sealed secrets written to: $OUTPUT_FILE"
echo "This file is safe to commit to git."
