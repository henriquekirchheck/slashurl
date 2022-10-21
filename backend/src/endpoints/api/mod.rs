use actix_web::{web, Scope};

mod urls;

pub fn register_api_endpoints() -> Scope {
    web::scope("/api")
        .service(urls::get_all_urls)
        .service(urls::insert_new_url)
        .service(urls::get_from_short_url)
        .service(urls::delete_short_url)
}