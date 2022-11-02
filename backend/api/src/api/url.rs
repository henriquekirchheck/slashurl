use actix_web::{
    delete, get,
    http::StatusCode,
    post,
    web::{self, Json},
    Responder, ResponseError,
};
use derive_more::{Display, Error};
use entity::url;
use migration::sea_orm::{ActiveModelTrait, ActiveValue, EntityTrait, ModelTrait};
use nanoid::{alphabet::SAFE, nanoid};
use serde::Deserialize;

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
    cfg.service(get_all_urls)
        .service(get_url_by_id)
        .service(create_url)
        .service(delete_url_by_id);
}

#[get("/url")]
async fn get_all_urls(app_data: web::Data<crate::AppState>) -> Result<impl Responder, UrlError> {
    let urls = url::Entity::find()
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
    let url_model = url::Entity::find_by_id(path.into_inner())
        .one(&app_data.db)
        .await
        .map_err(|_| UrlError::DatabaseError)?;

    Ok(Json(url_model))
}

#[derive(Deserialize)]
struct UrlInfo {
    full_url: String,
}

#[post("/url")]
async fn create_url(
    app_data: web::Data<crate::AppState>,
    body: web::Json<UrlInfo>,
) -> Result<impl Responder, UrlError> {
    let url_model = url::ActiveModel {
        short_url: ActiveValue::Set(nanoid!(10, &SAFE)),
        full_url: ActiveValue::Set(body.full_url.to_owned()),
        ..Default::default()
    };

    let res = url_model
        .insert(&app_data.db)
        .await
        .map_err(|_| UrlError::DatabaseError)?;

    Ok(Json(res))
}

#[delete("/url/{short_url}")]
async fn delete_url_by_id(
    app_data: web::Data<crate::AppState>,
    path: web::Path<String>,
) -> Result<impl Responder, UrlError> {
    let url_model = url::Entity::find_by_id(path.into_inner())
        .one(&app_data.db)
        .await
        .map_err(|_| UrlError::DatabaseError)?;

    if let Some(url) = url_model.clone() {
        url.delete(&app_data.db)
            .await
            .map_err(|_| UrlError::DatabaseError)?;
    }

    Ok(Json(url_model))
}
