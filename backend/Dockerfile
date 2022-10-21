# syntax=docker/dockerfile:1

FROM rust:1.64-bullseye AS dev
ARG UID=1000
ARG GID=1000
ARG USER=rust
RUN apt update \
  && apt install sudo libpq-dev gnupg2 -y
RUN groupadd -g "${GID}" "${USER}" \
  && useradd -l -m -u "${UID}" -g "${GID}" -s /bin/bash "${USER}" \
  && echo "${USER} ALL=(ALL:ALL) NOPASSWD:ALL" >> /etc/sudoers
USER ${USER}
ENV RUSTUP_HOME=/home/${USER}/rustup
ENV CARGO_HOME=/home/${USER}/cargo
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
  && /home/${USER}/cargo/bin/cargo install cargo-watch diesel_cli

FROM rust:1.64-bullseye AS base
RUN apt upgrade && apt install libpq-dev
WORKDIR /source

FROM base AS release-deps
COPY Cargo.toml .
COPY Cargo.lock .
RUN mkdir src && touch src/lib.rs
RUN cargo build --release
RUN rm -rf src/*

FROM release-deps AS build
COPY . .
RUN cargo install --path .

FROM debian:bullseye-slim
RUN apt update && apt install libpq5 && rm -rf /var/lib/apt/lists/*
COPY --from=build /usr/local/cargo/bin/slashurl-backend /usr/local/bin/slashurl-backend

CMD ["slashurl-backend"]