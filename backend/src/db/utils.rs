use actix::{Actor, Addr, SyncContext};
use diesel::prelude::*;
use diesel::{
    r2d2::{ConnectionManager, Pool},
    PgConnection,
};

pub type DbAddr = Addr<DbActor>;

pub struct DbActor(pub Pool<ConnectionManager<PgConnection>>);

impl Actor for DbActor {
    type Context = SyncContext<Self>;
}

pub fn get_pool(database_url: &str) -> Pool<ConnectionManager<PgConnection>> {
    let manager = ConnectionManager::<PgConnection>::new(database_url);

    Pool::builder()
        .test_on_check_out(true)
        .build(manager)
        .expect("Error building a connection pool")
}

use crate::MIGRATIONS;
use diesel_migrations::MigrationHarness;

pub fn run_migrations(database_url: &str) {
    let mut connection = PgConnection::establish(database_url)
        .expect("Error connecting to database to perform migration");

    match connection.run_pending_migrations(MIGRATIONS) {
        Ok(_) => (),
        Err(_) => panic!("Error performing migrations on database"),
    };
}
