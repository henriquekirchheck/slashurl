use actix_web::{get, App, HttpResponse, HttpServer, Responder};

const IPV4: &str = "0.0.0.0";

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

    println!("🚀 Serving on http://{IPV4}:{port}/");

    HttpServer::new(|| App::new().service(hello))
        .bind(host)?
        .run()
        .await
}
