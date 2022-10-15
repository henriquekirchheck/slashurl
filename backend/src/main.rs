use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};

const IPV4: &str = "0.0.0.0";
const PORT: u16 = 7780;
const HOST: (&str, u16) = (IPV4, PORT);

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
    println!("🚀 Serving on {IPV4}:{PORT}");

    HttpServer::new(|| App::new().service(web::scope("/api").service(echo).service(hello)))
        .bind(HOST)?
        .run()
        .await
}
