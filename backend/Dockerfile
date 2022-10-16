# syntax=docker/dockerfile:1


FROM rust:1.64-bullseye AS dev
ARG UID=1000
ARG GID=1000
RUN apt update
RUN groupadd -g "${GID}" rust && useradd -l -m -u "${UID}" -g "${GID}" -s /bin/bash rust
RUN apt install gnupg2 -y
RUN apt install sudo -y && echo "rust ALL=(ALL:ALL) NOPASSWD:ALL"
USER rust
ENV RUSTUP_HOME=/home/rust/rustup
ENV CARGO_HOME=/home/rust/cargo
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

FROM rust:1.64-bullseye AS base
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