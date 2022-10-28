#![allow(clippy::all)]

use diesel_migrations::{EmbeddedMigrations, embed_migrations};

pub mod db;
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();
