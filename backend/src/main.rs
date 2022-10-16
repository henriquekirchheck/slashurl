use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};

const IPV4: &str = "0.0.0.0";

#[get("/hello")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello World!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = std::env::var("PORT")
        .unwrap_or("8080".to_owned())
        .parse::<u16>()
        .expect("env variable `PORT` should only be a number");
    let host = (IPV4, port);

    println!("🚀 Serving on http://{IPV4}:{port}/");

    HttpServer::new(|| App::new().service(web::scope("/api").service(echo).service(hello)))
        .bind(host)?
        .run()
        .await
}
