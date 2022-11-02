use actix_web::web;

mod url;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/api").configure(url::config));
}
