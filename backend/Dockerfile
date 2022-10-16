# syntax=docker/dockerfile:1

FROM rust:1.64 AS dev
RUN cargo install cargo-watch

FROM rust:1.64 AS base
WORKDIR /source

FROM base AS release-deps
COPY Cargo.toml .
COPY Cargo.lock .
RUN mkdir src && touch src/lib.rs
RUN cargo build --release
RUN rm -rf src/*

FROM release-deps AS build
COPY src src
RUN cargo install --path .

FROM debian:bullseye-slim
RUN apt update && rm -rf /var/lib/apt/lists/*
COPY --from=build /usr/local/cargo/bin/slashurl-backend /usr/local/bin/slashurl-backend

CMD ["slashurl-backend"]