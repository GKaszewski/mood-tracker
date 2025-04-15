use super::_entities::activities::Column;
pub use super::_entities::activities::{ActiveModel, Entity, Model};
use sea_orm::entity::prelude::*;
use strum::IntoEnumIterator;
pub type Activities = Entity;

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
impl Model {}

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

    pub fn get_by_name_and_user_id(name: &str, user_id: &str) -> Select<Entity> {
        Entity::find()
            .filter(Column::Name.eq(name))
            .filter(Column::UserId.eq(user_id))
    }
}

#[derive(strum_macros::EnumIter, Debug)]
pub enum DefaultActivities {
    Family,
    Friends,
    Date,
    Party,
    MoviesAndTv,
    Reading,
    Gaming,
    Sport,
    Relax,
    SleepEarly,
    GoodSleep,
    MediumSleep,
    BadSleep,
    Exercise,
    EatHealthy,
    DrinkWater,
    Walk,
    Shopping,
    Cleaning,
    Cooking,
    Laundry,
}

impl DefaultActivities {
    pub fn to_string_vec() -> Vec<String> {
        DefaultActivities::iter()
            .map(|activity| format!("{:?}", activity))
            .collect()
    }
}
