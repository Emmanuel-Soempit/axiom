# Stage 1: Build
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Compile the binary
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./main.go
RUN CGO_ENABLED=0 GOOS=linux go build -o seeder ./cmd/seed/main.go

# Stage 2: Final
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

# Copy the binary and the .env
COPY --from=builder /app/main .
COPY --from=builder /app/seeder .
COPY --from=builder /app/.env .env

# COPY YOUR OPA FILES HERE (The whole folder at once is safer)
# This assumes your Go code looks for them at "internal/core/validation/opa/..."
COPY --from=builder /app/internal/core/validation/opa ./internal/core/validation/opa

EXPOSE 3333

# Auto-seed is fine for dev
CMD ["sh", "-c", "./seeder && ./main"]
