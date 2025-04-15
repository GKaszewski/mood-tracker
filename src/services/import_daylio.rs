use std::{collections::HashSet, str::FromStr};

use axum::extract::Multipart;
use chrono::{DateTime, FixedOffset, NaiveDate, NaiveTime};
use loco_rs::prelude::*;
use sea_orm::TryIntoModel;
use serde::{Deserialize, Deserializer, Serialize};

use crate::models::{
    activities::{self, DefaultActivities},
    mood_entries::{self, string_to_activities, Mood},
};

#[derive(Debug, Deserialize, Serialize)]
enum WeekDay {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
}

impl FromStr for WeekDay {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "Monday" => Ok(WeekDay::Monday),
            "Tuesday" => Ok(WeekDay::Tuesday),
            "Wednesday" => Ok(WeekDay::Wednesday),
            "Thursday" => Ok(WeekDay::Thursday),
            "Friday" => Ok(WeekDay::Friday),
            "Saturday" => Ok(WeekDay::Saturday),
            "Sunday" => Ok(WeekDay::Sunday),
            _ => Err(()),
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DaylioCsvLine {
    full_date: NaiveDate,
    date: String,
    weekday: WeekDay,
    #[serde(deserialize_with = "deserialize_time")]
    time: NaiveTime,
    mood: String,
    activities: String,
    note_title: String,
    note: String,
}

fn deserialize_time<'de, D>(deserializer: D) -> Result<NaiveTime, D::Error>
where
    D: Deserializer<'de>,
{
    let s: String = Deserialize::deserialize(deserializer)?;
    let normalized_str = s.replace('\u{202F}', " ");

    NaiveTime::parse_from_str(&normalized_str, "%I:%M %p").map_err(serde::de::Error::custom)
}

pub async fn import_data_from_daylio_csv(
    db: &DatabaseConnection,
    mut multipart: Multipart,
    user_id: &str,
) -> Result<i32> {
    let mut entries = Vec::new();

    while let Some(field) = multipart.next_field().await.map_err(|_| {
        eprintln!("Error reading multipart field");
        Error::BadRequest("Failed to read multipart field".to_string())
    })? {
        let field_name = field.name().unwrap();
        let content_type = field.content_type().unwrap();

        if field_name == "file" && content_type == "text/csv" {
            let bytes = field.bytes().await.map_err(|_| {
                eprintln!("Error reading field bytes");
                Error::BadRequest("Failed to read field bytes".to_string())
            })?;

            let mut reader = csv::ReaderBuilder::new()
                .has_headers(true)
                .flexible(true)
                .from_reader(bytes.as_ref());

            for result in reader.deserialize() {
                match result {
                    Ok(record) => {
                        let line: DaylioCsvLine = record;
                        entries.push(line);
                    }
                    Err(e) => {
                        eprintln!("Error parsing CSV line: {}", e);
                        return Err(Error::BadRequest("Failed to parse CSV".to_string()));
                    }
                }
            }
        }
    }

    let (mood_entries, activities) = process_daylio_csv(db, &entries, user_id).await?;
    let mood_entries_count = mood_entries.len() as i32;

    let _ = save_to_database(db, mood_entries, activities, user_id).await?;

    Ok(mood_entries_count)
}

async fn process_daylio_csv(
    db: &DatabaseConnection,
    csv_data: &[DaylioCsvLine],
    user_id: &str,
) -> Result<(Vec<mood_entries::Model>, Vec<activities::Model>)> {
    let mut mood_entries = Vec::new();
    let mut activities = Vec::new();

    let default_activities = DefaultActivities::to_string_vec();
    let user_activities = activities::Entity::find_by_user_id(user_id)
        .all(db)
        .await?
        .into_iter()
        .map(|activity| activity.name)
        .collect::<Vec<String>>();

    for record in csv_data {
        let activities_from_csv = string_to_activities(record.activities.to_string());
        for activity in activities_from_csv.iter() {
            if !user_activities.contains(activity)
                && !default_activities.contains(activity)
                && !activity.is_empty()
            {
                let activity = activities::ActiveModel {
                    id: Set(0),
                    name: Set(activity.to_string()),
                    user_id: Set(user_id.to_string()),
                    created_at: Set(chrono::Utc::now().into()),
                    updated_at: Set(chrono::Utc::now().into()),
                };

                let model = activity.try_into_model()?;
                activities.push(model);
            }
        }

        let mood = match Mood::from_str(&record.mood) {
            Ok(mood) => mood,
            Err(_) => continue,
        };

        let mood_entry = mood_entries::ActiveModel {
            id: Set(0),
            user_id: Set(user_id.to_string()),
            activities: Set(Some(record.activities.to_string())),
            mood: Set(mood as i16),
            note: Set(Some(record.note.to_string())),
            created_at: Set(DateTime::from_naive_utc_and_offset(
                record.full_date.and_time(record.time),
                FixedOffset::east_opt(0).unwrap(),
            )),
            updated_at: Set(chrono::Utc::now().into()),
        };

        let model = mood_entry.try_into_model()?;
        mood_entries.push(model);
    }

    Ok((mood_entries, activities))
}

async fn save_to_database(
    db: &DatabaseConnection,
    mood_entries: Vec<mood_entries::Model>,
    activities: Vec<activities::Model>,
    user_id: &str,
) -> Result<()> {
    let txn = db.begin().await?;
    let activity_names: HashSet<_> = activities.iter().map(|a| a.name.clone()).collect();
    let activities_to_insert: Vec<activities::ActiveModel> = activity_names
        .into_iter()
        .map(|name| activities::ActiveModel {
            name: Set(name),
            user_id: Set(user_id.to_string()),
            created_at: Set(chrono::Utc::now().into()),
            updated_at: Set(chrono::Utc::now().into()),
            ..Default::default()
        })
        .collect();

    if !activities_to_insert.is_empty() {
        activities::Entity::insert_many(activities_to_insert)
            .exec(&txn)
            .await?;
    }

    let mood_entries_to_insert: Vec<mood_entries::ActiveModel> = mood_entries
        .into_iter()
        .map(|entry| mood_entries::ActiveModel {
            user_id: Set(user_id.to_string()),
            activities: Set(entry.activities),
            mood: Set(entry.mood),
            note: Set(entry.note),
            created_at: Set(entry.created_at),
            updated_at: Set(entry.updated_at),
            ..Default::default()
        })
        .collect();

    if !mood_entries_to_insert.is_empty() {
        mood_entries::Entity::insert_many(mood_entries_to_insert)
            .exec(&txn)
            .await?;
    }

    txn.commit().await?;

    Ok(())
}
