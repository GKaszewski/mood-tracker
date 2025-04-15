#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use std::collections::HashMap;

use axum::{extract::Query, Extension};
use chrono::NaiveDate;
use loco_keycloak_auth::KeycloakToken;
use loco_rs::prelude::*;
use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};

use crate::models::mood_entries::{self, Mood};

#[derive(Debug, Serialize)]
pub enum Trend {
    Positive,
    Neutral,
    Negative,
}

#[derive(Deserialize)]
pub struct MoodTrendQueryParams {
    start_date: Option<NaiveDate>,
    end_date: Option<NaiveDate>,
}

#[derive(FromQueryResult)]
struct MoodCount {
    pub mood: Mood,
    pub count: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MoodTrend {
    pub date: NaiveDate,
    pub trend: Trend,
    pub mood_counts: HashMap<String, i64>,
}

pub async fn get_mood_trend(
    State(ctx): State<AppContext>,
    Extension(token): Extension<KeycloakToken<String>>,
    Query(params): Query<MoodTrendQueryParams>,
) -> Result<Response> {
    let user_id = token.subject.to_string();
    let query = mood_entries::Entity::get_from_optional_date_to_date_for_user(
        params.start_date,
        params.end_date,
        &user_id,
    );

    let results = query.into_model::<MoodCount>().all(&ctx.db).await?;
    let mut counts = HashMap::new();
    for result in results {
        let mood_name = match result.mood {
            Mood::Awful => "Awful",
            Mood::Bad => "Bad",
            Mood::Meh => "Meh",
            Mood::Good => "Good",
            Mood::Rad => "Rad",
        };
        counts.insert(mood_name.to_string(), result.count);
    }

    let total_count: i64 = counts.values().sum();
    let mut trend = Trend::Neutral;

    if total_count > 0 {
        let average_mood = counts
            .iter()
            .map(|(mood, count)| {
                let mood_value = match mood.as_str() {
                    "Awful" => Mood::Awful,
                    "Bad" => Mood::Bad,
                    "Meh" => Mood::Meh,
                    "Good" => Mood::Good,
                    "Rad" => Mood::Rad,
                    _ => Mood::Meh,
                };
                mood_value as i64 * count
            })
            .sum::<i64>()
            / total_count;

        trend = if average_mood >= Mood::Good as i64 {
            Trend::Positive
        } else if average_mood <= Mood::Bad as i64 {
            Trend::Negative
        } else {
            Trend::Neutral
        };
    }

    let today = chrono::Utc::now().naive_utc().date();
    let date = params.end_date.unwrap_or(today);
    let trend = MoodTrend {
        date,
        trend,
        mood_counts: counts,
    };

    format::json(trend)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/stats/")
        .add("/mood-trend", get(get_mood_trend))
}
