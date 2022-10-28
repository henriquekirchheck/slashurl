#![allow(clippy::all)]
mod endpoints;

use actix::SyncArbiter;
use actix_web::{get, web::Data, App, HttpResponse, HttpServer, Responder};
use slashurl_backend::db::utils::{get_pool, DbAddr, DbActor, run_migrations};

const IPV4: &str = "0.0.0.0";

struct AppState {
    db: DbAddr,
}

#[get("/hello")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello World!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = std::env::var("PORT")
        .unwrap_or("8080".to_owned())
        .parse::<u16>()
        .expect("env variable `PORT` should only be a number");
    let host = (IPV4, port);

    let database_url =
        std::env::var("DATABASE_URL").expect("env variable `DATABASE_URL` is not set");

    run_migrations(&database_url);

    let pool = get_pool(&database_url);
    let database_addr: DbAddr = SyncArbiter::start(4, move || DbActor(pool.clone()));


    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(AppState {
                db: database_addr.clone()
            }))
            .service(hello)
            .service(endpoints::api::register_api_endpoints())
    })
    .bind(host)?
    .run()
    .await
}
