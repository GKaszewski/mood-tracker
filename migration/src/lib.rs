#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20250413_012556_mood_entries;
mod m20250414_230400_activities;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250413_012556_mood_entries::Migration),
            Box::new(m20250414_230400_activities::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}