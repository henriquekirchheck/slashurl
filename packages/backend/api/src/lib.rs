use actix_web::{
    get,
    web::{self, Json},
    App, HttpServer, Responder,
};
use migration::{sea_orm::DatabaseConnection, MigratorTrait};
use slashurl_core::sea_orm::{ConnectOptions, Database};
use std::env;

mod api;
mod redirect;

#[get("/hello")]
async fn hello_world() -> impl Responder {
    Json("Hello World!")
}

#[derive(Debug, Clone)]
pub struct AppState {
    db: DatabaseConnection,
}

#[actix_web::main]
async fn start() -> std::io::Result<()> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .with_test_writer()
        .init();

    let app_state = AppState {
        db: {
            let db_string = env::var("DATABASE_URL")
                .expect("`DATABASE_URL` environment variable was not provided");

            let mut opt = ConnectOptions::new(db_string);

            opt.max_connections(100)
                .min_connections(5)
                .sqlx_logging(true);

            Database::connect(opt)
                .await
                .expect("Failed to connect to database")
        },
    };

    migration::Migrator::up(&app_state.db, None)
        .await
        .expect("Failed to apply migrations");

    let url_info = {
        let host = env::var("HOST").unwrap_or("0.0.0.0".to_owned());
        let port = env::var("PORT")
            .unwrap_or("8080".to_owned())
            .parse::<u16>()
            .expect("`PORT` environment variable should be a number");

        let url = format!("http://{}:{}/", host, port);

        ((host, port), url)
    };

    let server = HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_state.clone()))
            .service(hello_world)
            .configure(api::config)
            .service(redirect::url_redirect)
    });

    println!("Running server on {}", url_info.1);
    server.bind(url_info.0)?.run().await
}

pub fn main() {
    let result = start();

    if let Some(err) = result.err() {
        println!("Error: {}", err)
    }
}
