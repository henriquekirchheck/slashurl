# syntax=docker/dockerfile:1

FROM rust:1.64 AS builder

WORKDIR /app
COPY . .
RUN cargo install --path .

FROM debian:bullseye-slim
RUN apt update && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/slashurl-backend /usr/local/bin/slashurl-backend

CMD ["slashurl-backend"]