# syntax=docker/dockerfile:1

FROM rust:1.65-bullseye AS base
RUN apt upgrade && apt install libpq-dev
WORKDIR /source

FROM base AS build
COPY . .
RUN cargo install --path .

FROM debian:bullseye-slim
RUN apt update && apt install libpq5 -y && rm -rf /var/lib/apt/lists/*
COPY --from=build /usr/local/cargo/bin/slashurl-backend /usr/local/bin/slashurl-backend

CMD ["slashurl-backend"]