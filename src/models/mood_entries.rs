use std::str::FromStr;

use super::_entities::mood_entries::Column;
pub use super::_entities::mood_entries::{ActiveModel, Entity, Model};
use chrono::NaiveDate;
use sea_orm::{entity::prelude::*, QuerySelect};
use serde::{Deserialize, Serialize};

pub type MoodEntries = Entity;

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    async fn before_save<C>(self, _db: &C, insert: bool) -> std::result::Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        if !insert && self.updated_at.is_unchanged() {
            let mut this = self;
            this.updated_at = sea_orm::ActiveValue::Set(chrono::Utc::now().into());
            Ok(this)
        } else {
            Ok(self)
        }
    }
}

// implement your read-oriented logic here
impl Model {
    pub fn to_mood(&self) -> Mood {
        match self.mood {
            0 => Mood::Awful,
            1 => Mood::Bad,
            2 => Mood::Meh,
            3 => Mood::Good,
            4 => Mood::Rad,
            _ => panic!("Invalid mood value"),
        }
    }

    pub fn from_mood(mood: Mood) -> i16 {
        mood as i16
    }
}

// implement your write-oriented logic here
impl ActiveModel {}

// implement your custom finders, selectors oriented logic here
impl Entity {
    pub fn find_by_user_id(user_id: &str) -> Select<Entity> {
        Entity::find().filter(Column::UserId.eq(user_id))
    }

    pub fn get_by_id_and_user_id(id: i32, user_id: &str) -> Select<Entity> {
        Entity::find()
            .filter(Column::Id.eq(id))
            .filter(Column::UserId.eq(user_id))
    }

    pub fn get_from_optional_date_to_date_for_user(
        start_date: Option<NaiveDate>,
        end_date: Option<NaiveDate>,
        user_id: &str,
    ) -> Select<Entity> {
        let mut query = Entity::find()
            .filter(Column::UserId.eq(user_id))
            .select_only()
            .column(Column::Mood)
            .column_as(Expr::col(Column::Mood).count(), "count")
            .group_by(Column::Mood);

        if let Some(start_date) = start_date {
            query = query.filter(Column::CreatedAt.gte(start_date));
        }

        if let Some(end_date) = end_date {
            query = query.filter(Column::CreatedAt.lte(end_date));
        }

        query
    }
}

#[derive(Clone, Debug, PartialEq, Eq, DeriveActiveEnum, EnumIter, Deserialize, Serialize)]
#[sea_orm(rs_type = "u8", db_type = "TinyInteger")]
#[serde(rename_all = "lowercase")]
#[serde(try_from = "u8", into = "u8")]
pub enum Mood {
    #[sea_orm(num_value = 0)]
    Awful = 0,
    #[sea_orm(num_value = 1)]
    Bad = 1,
    #[sea_orm(num_value = 2)]
    Meh = 2,
    #[sea_orm(num_value = 3)]
    Good = 3,
    #[sea_orm(num_value = 4)]
    Rad = 4,
}

impl TryFrom<u8> for Mood {
    type Error = &'static str;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Mood::Awful),
            1 => Ok(Mood::Bad),
            2 => Ok(Mood::Meh),
            3 => Ok(Mood::Good),
            4 => Ok(Mood::Rad),
            _ => Err("Invalid mood value"),
        }
    }
}

impl FromStr for Mood {
    type Err = &'static str;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "awful" => Ok(Mood::Awful),
            "bad" => Ok(Mood::Bad),
            "meh" => Ok(Mood::Meh),
            "good" => Ok(Mood::Good),
            "rad" => Ok(Mood::Rad),
            _ => Err("Invalid mood string"),
        }
    }
}

impl ToString for Mood {
    fn to_string(&self) -> String {
        match self {
            Mood::Awful => "awful".to_string(),
            Mood::Bad => "bad".to_string(),
            Mood::Meh => "meh".to_string(),
            Mood::Good => "good".to_string(),
            Mood::Rad => "rad".to_string(),
        }
    }
}

// Allow serializing to u8
impl From<Mood> for u8 {
    fn from(mood: Mood) -> Self {
        mood as u8
    }
}

pub fn activities_to_string(activities: Vec<String>) -> String {
    activities.join("|")
}

pub fn string_to_activities(activities: String) -> Vec<String> {
    activities.split('|').map(|s| s.to_string()).collect()
}
