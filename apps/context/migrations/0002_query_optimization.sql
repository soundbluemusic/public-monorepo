-- Migration: 0002_query_optimization
-- Created: 2026-05-13
-- 근거: profiling/phase5/SUMMARY.md (D1-1, D1-2)
--
-- Q8a (browse alphabetical): ORDER BY korean COLLATE NOCASE
--   기존 idx_entries_korean(BINARY)은 NOCASE 비교 시 무용 → SCAN + TEMP B-TREE
-- Q9 (search index): ORDER BY frequency DESC LIMIT 5000
--   frequency 인덱스 없음 → SCAN + TEMP B-TREE

CREATE INDEX IF NOT EXISTS idx_entries_korean_nocase
  ON entries(korean COLLATE NOCASE);

CREATE INDEX IF NOT EXISTS idx_entries_frequency
  ON entries(frequency DESC);
