-- Reset D1 Database
-- WARNING: This will delete all data!

DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS categories;
DROP INDEX IF EXISTS idx_entries_category;
DROP INDEX IF EXISTS idx_entries_korean;
DROP INDEX IF EXISTS idx_entries_difficulty;
DROP INDEX IF EXISTS idx_conversations_category;
