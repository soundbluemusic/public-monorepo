# Phase 5 - D1 Query Profile Summary

## 측정 환경

- 로컬 D1 (miniflare) — wrangler 인증 없음 (`whoami` 결과 "not authenticated")
- 스키마 적용: `apps/context/migrations/0001_initial.sql`
- **데이터는 0건** (시드 미실행, EXPLAIN 계획만 분석 — 행 수 16,944 가정 시 영향 평가)

## 기존 인덱스 (`migrations/0001_initial.sql:39-41,57`)

| 이름 | 정의 |
| --- | --- |
| `idx_entries_category` | `entries(category_id)` |
| `idx_entries_korean` | `entries(korean)` (binary collation) |
| `idx_entries_difficulty` | `entries(difficulty)` |
| `idx_conversations_category` | `conversations(category_id)` |

## 런타임 쿼리 인벤토리 (총 12, unique 10)

| ID | 출처 | 쿼리 패턴 |
| --- | --- | --- |
| Q1 | `inject-polyfill.mjs:89,93` | `SELECT id FROM categories ORDER BY sort_order` |
| Q2 | `inject-polyfill.mjs:95` | `SELECT id FROM entries WHERE category_id=?` |
| Q3 | `inject-polyfill.mjs:97` | `SELECT DISTINCT category_id FROM conversations ORDER BY category_id` |
| Q4 | `inject-polyfill.mjs:99` | `SELECT tags FROM entries WHERE tags IS NOT NULL AND tags != '[]'` |
| Q5 | `inject-polyfill.mjs:101` | `SELECT id,korean,...,translations FROM entries` (offline DB dump) |
| Q6 | `inject-polyfill.mjs:101` | `SELECT id,name_ko,... FROM categories` |
| Q7 | `inject-polyfill.mjs:101` | `SELECT id,category_id,... FROM conversations` |
| Q8a | `inject-polyfill.mjs:103` | `ORDER BY korean COLLATE NOCASE LIMIT 100 OFFSET ?` (alphabetical browse) |
| Q8b | `inject-polyfill.mjs:103` | `ORDER BY category_id, korean LIMIT 100 OFFSET ?` (category browse) |
| Q8c | `inject-polyfill.mjs:103` | `ORDER BY rowid DESC LIMIT 100 OFFSET ?` (recent browse) |
| Q9 | `inject-polyfill.mjs:105` | `ORDER BY frequency DESC LIMIT 5000` (search index) |
| Q10 | `d1-server.ts:233` | `SELECT COUNT(*) FROM entries` |
| Q11 | `d1-server.ts:245` | `SELECT * FROM entries ORDER BY id LIMIT 1 OFFSET ?` (random) |

## EXPLAIN QUERY PLAN 결과

| ID | Plan | 평가 | 호출 빈도 |
| --- | --- | --- | --- |
| Q1 | `SCAN categories` + TEMP B-TREE | OK (65 rows) | sitemap |
| Q2 | `SEARCH USING idx_entries_category` ✅ | **최적** | sitemap × category 수 |
| Q3 | `SCAN COVERING INDEX idx_conversations_category` ✅ | **최적** | sitemap |
| **Q4** | **`SCAN entries`** | **🚨 풀 스캔 16,944 rows** | sitemap-tags (1회/요청) |
| Q5 | `SCAN entries` | 의도적 (offline DB 전체 덤프) | `/api/offline-db` |
| Q6 | `SCAN categories` | OK (65 rows) | `/api/offline-db` |
| Q7 | `SCAN conversations` | OK (53 rows) | `/api/offline-db` |
| **Q8a** | **`SCAN entries` + TEMP B-TREE** | **🚨 COLLATE NOCASE 때문에 idx_entries_korean 무용** | browse alphabetical 페이지마다 |
| Q8b | `SCAN USING idx_entries_category` + TEMP B-TREE | 부분 활용 | browse category 페이지마다 |
| Q8c | `SCAN entries` | 풀 스캔 (id가 TEXT라 rowid가 PK 아님) | browse recent 페이지마다 |
| **Q9** | **`SCAN entries` + TEMP B-TREE** | **🚨 frequency 인덱스 없음** | search index (캐시 24h) |
| Q10 | `SCAN COVERING idx_entries_difficulty` | 우연히 최적 | random entry 사전 카운트 |
| Q11 | `SEARCH USING sqlite_autoindex (PK)` ✅ | **최적** | random entry |

> 전체 출력: `profiling/phase5/explain.txt`

## 🚨 핵심 발견 (Critical)

### D1-1: `idx_entries_korean`이 `COLLATE NOCASE`로 인해 무용 (Q8a)

**현재**:
```sql
CREATE INDEX idx_entries_korean ON entries(korean);  -- BINARY collation (default)
-- 쿼리:
SELECT ... FROM entries ORDER BY korean COLLATE NOCASE LIMIT 100 OFFSET ?
```

쿼리에 `COLLATE NOCASE`가 있어 인덱스를 사용할 수 없음 → **16,944 행 전체 정렬 후 LIMIT 100**. 페이지마다 동일 비용.

**수정**:
```sql
CREATE INDEX idx_entries_korean_nocase ON entries(korean COLLATE NOCASE);
```

**예상 영향**: alphabetical browse 페이지 응답 시간 ~10×↓ (Cloudflare D1 평균 5–20ms → 0.5–2ms 추정, 실측 필요)

### D1-2: `frequency` 인덱스 누락 (Q9)

**현재**:
```sql
-- 쿼리:
SELECT ... FROM entries ORDER BY frequency DESC LIMIT 5000
```

frequency 컬럼에 인덱스 없음 → **16,944 행 풀 스캔 + 정렬 + LIMIT 5000**. 5000개는 전체의 30%.

**수정**:
```sql
CREATE INDEX idx_entries_frequency ON entries(frequency DESC);
```

> ⚠️ Cache-Control: `max-age=86400` (24h) 이므로 실 트래픽은 적지만, **첫 요청 / 캐시 만료 직후의 latency 영향 큼**.

### D1-3: tags 사이트맵 풀 스캔 (Q4)

**현재**:
```sql
SELECT tags FROM entries WHERE tags IS NOT NULL AND tags != '[]'
```

부분 인덱스 추천:
```sql
CREATE INDEX idx_entries_with_tags ON entries(id, tags) 
WHERE tags IS NOT NULL AND tags != '[]';
```

> 단, `sitemap-tags.xml` 호출 빈도가 낮으면 우선순위 낮음. **D1-1, D1-2 우선**.

## 비-Critical 관찰

| # | 관찰 | 의견 |
| - | --- | --- |
| O1 | Q10 (COUNT)이 `idx_entries_difficulty`를 covering index로 사용 | 우연이지만 작동. 인덱스 자체가 분석 결과 안 쓰이는 컬럼 → 다른 곳에서 difficulty 필터링 쿼리 없으면 인덱스 제거 후보 |
| O2 | Q8c rowid DESC가 풀 스캔 | recent를 정확히 구현하려면 `created_at DESC` 인덱스 추가. 단 `created_at` 미사용으로 보이면 의미 미흡 |
| O3 | `idx_entries_difficulty` 활용 검증 | 코드에서 `WHERE difficulty=?` 패턴 없음. 인덱스 유지 비용 검토 |

## 권장 마이그레이션 (예시)

```sql
-- 0002_query_optimization.sql
CREATE INDEX IF NOT EXISTS idx_entries_korean_nocase 
  ON entries(korean COLLATE NOCASE);

CREATE INDEX IF NOT EXISTS idx_entries_frequency 
  ON entries(frequency DESC);

-- 검토 후 결정:
-- DROP INDEX IF EXISTS idx_entries_difficulty;  -- 사용 분석 후
```

> ⚠️ 위 SQL은 권장안이며 실제 마이그레이션은 **(a) `/browse` 등 페이지의 실 사용 트래픽 데이터, (b) Q10의 difficulty 인덱스 의존성**을 확인한 후 적용 결정 필요.

## 실측 미수행 사항 (Phase 7 또는 수동 후속)

- 시드된 D1(16,944 rows)에서 각 쿼리의 ms 단위 latency
- Worker CPU 시간 계측 (`event.response.cpuTime` via tail)
- 인덱스 적용 전/후 비교

이는 wrangler 인증 + 프로덕션 데이터/트래픽이 필요해 SKIP.
