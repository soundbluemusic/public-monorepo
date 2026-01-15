-- D1 Schema for Context App
-- Migration: 0001_initial
-- Created: 2026-01-15

-- ============================================
-- Categories Table
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name_ko TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ko TEXT,
  description_en TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0
);

-- ============================================
-- Entries Table
-- ============================================
CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  korean TEXT NOT NULL,
  romanization TEXT,
  part_of_speech TEXT,
  category_id TEXT NOT NULL,
  difficulty TEXT,
  frequency TEXT,
  tags TEXT,           -- JSON array: ["casual", "informal"]
  translations TEXT,   -- JSON object: { ko: {...}, en: {...} }
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Indexes for entries
CREATE INDEX IF NOT EXISTS idx_entries_category ON entries(category_id);
CREATE INDEX IF NOT EXISTS idx_entries_korean ON entries(korean);
CREATE INDEX IF NOT EXISTS idx_entries_difficulty ON entries(difficulty);

-- ============================================
-- Conversations Table
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  category_id TEXT,
  title_ko TEXT NOT NULL,
  title_en TEXT NOT NULL,
  dialogue TEXT NOT NULL,  -- JSON array of dialogue objects
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Index for conversations
CREATE INDEX IF NOT EXISTS idx_conversations_category ON conversations(category_id);
