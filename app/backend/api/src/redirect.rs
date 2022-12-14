use actix_web::{
    get,
    http::{header, StatusCode},
    web, HttpResponse, Responder, ResponseError,
};
use derive_more::{Display, Error};
use entity::url;
use migration::{
    sea_orm::{ColumnTrait, EntityTrait, QueryFilter, QuerySelect},
    Expr,
};

#[derive(Debug, Display, Error)]
pub enum RedirectError {
    #[display(fmt = "An internal DB error occurred. Please try again later.")]
    DatabaseError,

    #[display(fmt = "This url does not exist")]
    RedirectError,
}

impl ResponseError for RedirectError {
    fn status_code(&self) -> actix_web::http::StatusCode {
        match *self {
            RedirectError::DatabaseError => StatusCode::INTERNAL_SERVER_ERROR,
            RedirectError::RedirectError => StatusCode::NOT_FOUND,
        }
    }
}

#[get("/{short_url}")]
pub async fn url_redirect(
    app_data: web::Data<crate::AppState>,
    path: web::Path<String>,
) -> Result<impl Responder, RedirectError> {
    let short_url_id = path.into_inner();

    let url_option = url::Entity::find_by_id(short_url_id.clone())
        .column(url::Column::FullUrl)
        .one(&app_data.db)
        .await
        .map_err(|_| RedirectError::DatabaseError)?;

    if let Some(url) = url_option {
        url::Entity::update_many()
            .filter(url::Column::ShortUrl.eq(short_url_id.clone()))
            .col_expr(url::Column::Views, Expr::col(url::Column::Views).add(1))
            .exec(&app_data.db)
            .await
            .map_err(|_| RedirectError::DatabaseError)?;

        let mut response = HttpResponse::Ok();
        let full_url = url.full_url.to_owned();

        response.status(StatusCode::PERMANENT_REDIRECT);
        response.append_header((header::LOCATION, full_url));

        Ok(response)
    } else {
        Err(RedirectError::RedirectError)
    }
}
