use actix_web::{
    get,
    http::StatusCode,
    web::{self, Json},
    Responder, ResponseError,
};
use derive_more::{Display, Error};
use entity::url::Entity as url_entity;
use migration::sea_orm::EntityTrait;

#[derive(Debug, Display, Error)]
enum UrlError {
    #[display(fmt = "An internal DB error occurred. Please try again later.")]
    DatabaseError,
}

impl ResponseError for UrlError {
    fn status_code(&self) -> actix_web::http::StatusCode {
        match *self {
            UrlError::DatabaseError => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all_urls).service(get_url_by_id);
}

#[get("/url")]
async fn get_all_urls(app_data: web::Data<crate::AppState>) -> Result<impl Responder, UrlError> {
    let urls = url_entity::find()
        .all(&app_data.db)
        .await
        .map_err(|_| UrlError::DatabaseError)?;

    Ok(Json(urls))
}

#[get("/url/{short_url}")]
async fn get_url_by_id(
    app_data: web::Data<crate::AppState>,
    path: web::Path<String>,
) -> Result<impl Responder, UrlError> {
    let urls = url_entity::find_by_id(path.into_inner())
        .one(&app_data.db)
        .await
        .map_err(|_| UrlError::DatabaseError)?;

    Ok(Json(urls))
}