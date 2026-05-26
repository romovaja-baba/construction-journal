# ---- build stage ----
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install git (needed for go mod download with some modules)
RUN apk add --no-cache git

COPY go.mod ./
# go mod tidy generates go.sum automatically
RUN go mod download || true

COPY . .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o server ./cmd/api

# ---- runtime stage ----
FROM alpine:3.19

WORKDIR /app
COPY --from=builder /app/server .

EXPOSE 8080
CMD ["./server"]
