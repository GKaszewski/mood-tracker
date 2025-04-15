#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use axum::{extract::Multipart, Extension};
use loco_keycloak_auth::KeycloakToken;
use loco_rs::prelude::*;

use crate::services::import_daylio::import_data_from_daylio_csv;

pub async fn import_from_daylio(
    State(ctx): State<AppContext>,
    Extension(token): Extension<KeycloakToken<String>>,
    multipart: Multipart,
) -> Result<Response> {
    let user_id = token.subject.to_string();

    let entries = import_data_from_daylio_csv(&ctx.db, multipart, &user_id).await?;

    format::json(entries)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/imports/")
        .add("/daylio", post(import_from_daylio))
}
