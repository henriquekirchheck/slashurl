use actix_web::{get, post, web, Responder, Result, delete};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct ShortURL {
    short_url: String,
    full_url: String,
    count: u32,
}

#[derive(Deserialize)]
pub struct CreateShortURL {
    full_url: String,
}

#[get("/urls")]
pub async fn get_all_urls() -> Result<impl Responder> {
    let urls = vec![
        ShortURL {
            short_url: "Hello".to_owned(),
            full_url: "World".to_owned(),
            count: 0,
        },
        ShortURL {
            short_url: "Hello".to_owned(),
            full_url: "World".to_owned(),
            count: 6,
        },
    ];

    Ok(web::Json(urls))
}

#[post("/urls")]
pub async fn insert_new_url(body: web::Json<CreateShortURL>) -> Result<impl Responder> {
    let full_url = body.full_url.to_owned();
    let response = ShortURL {
        short_url: "Hello".to_owned(),
        full_url,
        count: 0,
    };

    Ok(web::Json(response))
}

#[get("/urls/{short_url}")]
pub async fn get_from_short_url(path: web::Path<String>) -> Result<impl Responder> {
    let short_url = path.into_inner();
    let response = ShortURL {
        short_url,
        full_url: "World".to_owned(),
        count: 999,
    };

    Ok(web::Json(response))
}

#[delete("/urls/{short_url}")]
pub async fn delete_short_url(path: web::Path<String>) -> Result<impl Responder> {
    let short_url = path.into_inner();
    let response = ShortURL {
        short_url,
        full_url: "World".to_owned(),
        count: 999,
    };

    Ok(web::Json(response))
}
