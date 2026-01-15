/**
 * JSON → D1 Migration Script
 *
 * Usage:
 *   npx tsx scripts/migrate-to-d1.ts > migrations/0002_seed_data.sql
 *
 * Then apply to D1:
 *   wrangler d1 execute context-db --file=migrations/0002_seed_data.sql
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(import.meta.dirname, '../../../data/context');

interface Category {
  id: string;
  name: { ko: string; en: string };
  description: { ko: string; en: string };
  icon: string;
  color: string;
  order: number;
}

interface Entry {
  id: string;
  korean: string;
  romanization?: string;
  partOfSpeech?: string;
  categoryId: string;
  difficulty?: string;
  frequency?: string;
  tags?: string[];
  translations: {
    ko: Record<string, unknown>;
    en: Record<string, unknown>;
  };
}

interface Conversation {
  id: string;
  categoryId: string;
  title: { ko: string; en: string };
  dialogue: Array<{
    speaker: string;
    ko: string;
    romanization: string;
    en: string;
  }>;
}

function escapeSQL(str: string): string {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function jsonToSQL(obj: unknown): string {
  if (obj === null || obj === undefined) return 'NULL';
  return escapeSQL(JSON.stringify(obj));
}

function generateCategoriesSQL(categories: Category[]): string {
  const lines: string[] = [
    '-- ============================================',
    '-- Seed Categories',
    '-- ============================================',
    '',
  ];

  for (const cat of categories) {
    lines.push(
      `INSERT INTO categories (id, name_ko, name_en, description_ko, description_en, icon, color, sort_order) VALUES (` +
        `${escapeSQL(cat.id)}, ` +
        `${escapeSQL(cat.name.ko)}, ` +
        `${escapeSQL(cat.name.en)}, ` +
        `${escapeSQL(cat.description?.ko)}, ` +
        `${escapeSQL(cat.description?.en)}, ` +
        `${escapeSQL(cat.icon)}, ` +
        `${escapeSQL(cat.color)}, ` +
        `${cat.order}` +
        `);`
    );
  }

  return lines.join('\n');
}

function generateEntriesSQL(entries: Entry[]): string {
  const lines: string[] = [
    '',
    '-- ============================================',
    '-- Seed Entries',
    '-- ============================================',
    '',
  ];

  for (const entry of entries) {
    lines.push(
      `INSERT INTO entries (id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations) VALUES (` +
        `${escapeSQL(entry.id)}, ` +
        `${escapeSQL(entry.korean)}, ` +
        `${escapeSQL(entry.romanization ?? '')}, ` +
        `${escapeSQL(entry.partOfSpeech ?? '')}, ` +
        `${escapeSQL(entry.categoryId)}, ` +
        `${escapeSQL(entry.difficulty ?? '')}, ` +
        `${escapeSQL(entry.frequency ?? '')}, ` +
        `${jsonToSQL(entry.tags ?? [])}, ` +
        `${jsonToSQL(entry.translations)}` +
        `);`
    );
  }

  return lines.join('\n');
}

function generateConversationsSQL(conversations: Conversation[]): string {
  const lines: string[] = [
    '',
    '-- ============================================',
    '-- Seed Conversations',
    '-- ============================================',
    '',
  ];

  for (const conv of conversations) {
    lines.push(
      `INSERT INTO conversations (id, category_id, title_ko, title_en, dialogue) VALUES (` +
        `${escapeSQL(conv.id)}, ` +
        `${escapeSQL(conv.categoryId)}, ` +
        `${escapeSQL(conv.title.ko)}, ` +
        `${escapeSQL(conv.title.en)}, ` +
        `${jsonToSQL(conv.dialogue)}` +
        `);`
    );
  }

  return lines.join('\n');
}

async function main() {
  // 1. Load categories
  const categoriesPath = join(DATA_DIR, 'categories.json');
  const categories: Category[] = JSON.parse(readFileSync(categoriesPath, 'utf-8'));

  // 2. Load all entries from entries/*.json
  const entriesDir = join(DATA_DIR, 'entries');
  const entryFiles = readdirSync(entriesDir).filter((f) => f.endsWith('.json'));
  const allEntries: Entry[] = [];

  for (const file of entryFiles) {
    const entries: Entry[] = JSON.parse(readFileSync(join(entriesDir, file), 'utf-8'));
    allEntries.push(...entries);
  }

  // 3. Load conversations
  const conversationsPath = join(DATA_DIR, 'conversations.json');
  const conversations: Conversation[] = JSON.parse(readFileSync(conversationsPath, 'utf-8'));

  // 4. Generate SQL
  console.log('-- D1 Seed Data');
  console.log('-- Generated:', new Date().toISOString());
  console.log(`-- Categories: ${categories.length}`);
  console.log(`-- Entries: ${allEntries.length}`);
  console.log(`-- Conversations: ${conversations.length}`);
  console.log('');
  console.log('BEGIN TRANSACTION;');
  console.log('');
  console.log(generateCategoriesSQL(categories));
  console.log(generateEntriesSQL(allEntries));
  console.log(generateConversationsSQL(conversations));
  console.log('');
  console.log('COMMIT;');
}

main().catch(console.error);
