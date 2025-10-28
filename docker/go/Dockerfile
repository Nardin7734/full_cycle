FROM golang:1.21 AS builder

WORKDIR /app
COPY hello.go .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o hello hello.go

FROM scratch

COPY --from=builder /app/hello /hello

ENTRYPOINT ["/hello"]
