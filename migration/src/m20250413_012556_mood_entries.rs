use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "mood_entries",
            &[
            
            ("id", ColType::PkAuto),
            
            ("user_id", ColType::String),
            ("mood", ColType::SmallInteger),
            ("activities", ColType::StringNull),
            ("note", ColType::StringNull),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "mood_entries").await
    }
}
