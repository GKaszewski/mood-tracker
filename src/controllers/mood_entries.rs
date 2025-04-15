#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use axum::{debug_handler, Extension};
use loco_keycloak_auth::KeycloakToken;
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::mood_entries::{ActiveModel, Entity, Model};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Params {
    pub mood: i16,
    pub activities: Option<String>,
    pub note: Option<String>,
}

impl Params {
    fn update(&self, item: &mut ActiveModel) {
        item.mood = Set(self.mood.clone());
        item.activities = Set(self.activities.clone());
        item.note = Set(self.note.clone());
    }
}

async fn load_item(ctx: &AppContext, id: i32, user_id: &str) -> Result<Model> {
    let item = Entity::get_by_id_and_user_id(id, &user_id)
        .one(&ctx.db)
        .await?;

    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Extension(token): Extension<KeycloakToken<String>>,
) -> Result<Response> {
    let user_id = token.subject.to_string();
    format::json(Entity::find_by_user_id(&user_id).all(&ctx.db).await?)
}

#[debug_handler]
pub async fn add(
    State(ctx): State<AppContext>,
    Extension(token): Extension<KeycloakToken<String>>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let user_id = token.subject.to_string();

    let mut item = ActiveModel {
        user_id: Set(user_id),
        ..Default::default()
    };

    params.update(&mut item);

    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
    Extension(token): Extension<KeycloakToken<String>>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let user_id = token.subject.to_string();
    let item = load_item(&ctx, id, &user_id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let item = item.update(&ctx.db).await?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
    Extension(token): Extension<KeycloakToken<String>>,
) -> Result<Response> {
    let user_id = token.subject.to_string();

    load_item(&ctx, id, &user_id).await?.delete(&ctx.db).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
    Extension(token): Extension<KeycloakToken<String>>,
) -> Result<Response> {
    let user_id = token.subject.to_string();
    format::json(load_item(&ctx, id, &user_id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/moods/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
