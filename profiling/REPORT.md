# 프로파일링 종합 리포트

| 메타 | 값 |
| --- | --- |
| 측정일 | 2026-05-13 UTC 06:32–06:50 |
| 베이스라인 커밋 | `fa849c65bb1cb39ff9af54946afacd45a829300b` |
| 브랜치 | `claude/add-profiling-docs-qWoeh` |
| Node | v22.22.2 / pnpm 10.11.0 |
| 측정 범위 | Phase 0–6 (Phase 7 SKIP: wrangler 인증 없음) |

---

## 1. 핵심 발견 요약

총 **24건**의 발견. severity별 분류:

| Severity | 건수 | 비고 |
| --- | --- | --- |
| 🔥 Critical (SEO/기능) | **3** | 운영 영향 직접 |
| 🚨 High (성능/번들) | 9 | LCP/번들/D1 |
| ⚠️ Medium (캐시/구조) | 8 | 빌드 효율 / dev 경험 |
| ℹ️ Info | 4 | 관찰 사항 |

---

## 2. Critical 발견 (즉시 검토)

### C1. Permissive 모든 페이지의 canonical URL이 home으로 고정

| 항목 | 값 |
| --- | --- |
| 출처 | `profiling/phase4/permissive-seo-check.txt`, Phase 4 R2 |
| 증거 | `/libraries`, `/web-api`, `/web-apis` 모두 `<link rel="canonical" href="https://permissive.soundbluemusic.com">` |
| 위험 | 검색 엔진이 모든 페이지를 home으로 통합 인식 → **검색 노출 거의 불가능** |
| Lighthouse가 못 잡은 이유 | LH는 home URL만 측정. home의 canonical은 정상이므로 SEO 1.0 |

**조사 위치**: head 메타 팩토리 — Permissive head 설정 파일 (`packages/seo/src/meta/head-factory.ts` 또는 라우트별 head 옵션). canonical을 `data.pathname`/`location.pathname`으로 동적 생성하도록 수정.

### C2. Permissive `/web-apis` 라우트가 HTTP 500 반환

| 항목 | 값 |
| --- | --- |
| 출처 | `profiling/phase4/permissive-curl.txt:3회 모두 code=500` |
| 정체 | 실제 라우트는 `/web-api` (단수). `/web-apis`는 잘못된 URL이지만 404 대신 500 |
| 위험 | 잘못 진입한 사용자/봇이 500 받음, 검색 엔진 신뢰도 하락 |

**조사 위치**: TanStack Router catch-all 라우트 (`apps/permissive/app/routes/`) — 404 fallback 컴포넌트 확인.

### C3. Context Lighthouse Performance 0.80 (CI 기준 미달)

| 항목 | 값 |
| --- | --- |
| 출처 | `profiling/phase6/scores-summary.json` |
| 측정값 | Perf 0.80 (기준 ≥ 0.9), LCP 3260ms (기준 ≤ 2500ms) |
| 영향 | `lighthouserc.cjs:24-25`의 `error` 어설션 위반 → CI 실패 |
| 근본 원인 | TTFB 701ms + unused-JS 117KB + vendor-react 1.6MB |

---

## 3. High 발견 (큰 ROI, 1주 내 수정 가능)

### H1. vendor-react 청크 비대 (Context 1.6 MB, Roots 1.7 MB)

| 항목 | 값 |
| --- | --- |
| 출처 | `profiling/phase3/compression-sizes.txt`, Phase 3 B1 |
| 증거 | `vendor-react-j1Xh8G8H.js` strings 추출 결과 minisearch/immer/스키마/라우트 문자열 포함 (`profiling/phase3/context-vendor-react-contents.txt`) |
| 검증 | Roots TBT 297ms 중 **692ms가 vendor-react 단일 파일 parse**에서 발생 (`profiling/phase6/details.txt`) |
| 비교 | Permissive vendor-react는 445KB → 1/3.7 크기. PWA/오프라인/검색 라이브러리가 vendor-react로 합쳐졌을 가능성 |

**수정 위치**: `packages/config/src/vite.ts:54-103` `createManualChunks`. 현재:
```typescript
if (id.includes('react-dom') || id.includes('/react/')) {
  return 'vendor-react';
}
```
권장:
```typescript
// 정확한 패키지 매칭
if (id.includes('/node_modules/react-dom/') || 
    id.includes('/node_modules/react/') ||
    id.includes('/node_modules/scheduler/')) {
  return 'vendor-react';
}
```
또는 sourcemap 활성화 후 `stats.html` 정밀 분석 (Visualizer 출력은 이미 `profiling/phase3/{context,permissive,roots}-stats.html`).

### H2. Context 클라이언트 `data/` 디렉토리 49 MB

| 항목 | 값 |
| --- | --- |
| 출처 | `profiling/phase1/context-client-detail.txt`, Phase 1 F1 |
| 증거 | `by-category-full/{ko,en}/*.json` 양 언어 중복 + `compressed/{ko,en}/*.json` 추가 |
| 위험 | R2 저장 비용 + 사용자 다운로드 + 캐시 무효화 시 트래픽 |

**조사 위치**: `apps/context/scripts/generate-browse-chunks.ts` — ko/en 중복 제거 또는 단일 소스 + 클라이언트에서 변환.

### H3. Context entry-index 서버 청크 823 KB

| 항목 | 값 |
| --- | --- |
| 출처 | `profiling/phase1/server-bundles.txt` |
| 영향 | Worker 콜드 스타트, CPU init |

**조사**: dynamic import로 route-level 분리, entry 페이지 데이터 fetch는 D1만 사용.

### H4. Roots `useAutoAnimate` 청크 728 KB (이름 오인)

| 항목 | 값 |
| --- | --- |
| 출처 | `profiling/phase1/server-bundles.txt` |
| 위험 | 728KB가 useAutoAnimate가 아니라 첫 import 모듈명이 이름이 됨 → 다른 라이브러리 다수 묶임 |

**조사**: `profiling/phase3/roots-stats.html` 브라우저로 열어 청크 내역 확인.

### H5. D1 `idx_entries_korean` 인덱스가 `COLLATE NOCASE`로 무용 (Q8a)

| 항목 | 값 |
| --- | --- |
| 출처 | `profiling/phase5/explain.txt:Q8a`, Phase 5 D1-1 |
| 영향 | browse alphabetical 페이지마다 16,944 행 풀 정렬 → LIMIT 100 |

**수정**:
```sql
CREATE INDEX IF NOT EXISTS idx_entries_korean_nocase 
  ON entries(korean COLLATE NOCASE);
```
새 마이그레이션 파일: `apps/context/migrations/0002_query_optimization.sql`

### H6. D1 frequency 인덱스 누락 (Q9 search-index)

| 항목 | 값 |
| --- | --- |
| 출처 | `profiling/phase5/explain.txt:Q9` |
| 영향 | search-index 캐시 만료 시 풀 스캔 + 정렬 |

**수정**:
```sql
CREATE INDEX IF NOT EXISTS idx_entries_frequency 
  ON entries(frequency DESC);
```

### H7. Context/Permissive prebuild 매번 캐시 MISS

| 항목 | 값 |
| --- | --- |
| 출처 | `profiling/phase1/task-durations-warm.txt`, Phase 1 F5 |
| 영향 | warm 빌드 30s+ 손해 (1.7s FULL TURBO vs 40s warm) |
| Roots는 HIT | inputs/outputs 차이 가능성 |

**조사 위치**: 
- `turbo.json:31-44` `prebuild.inputs` 정의
- `apps/context/scripts/generate-browse-chunks.ts` 출력 경로가 inputs에 등록 안 됐을 가능성
- `apps/permissive` prebuild 스크립트도 동일 점검

### H8. Roots `/concept/addition` 페이지 동적 title 누락

| 항목 | 값 |
| --- | --- |
| 출처 | `profiling/phase4/roots-ssr-check.txt`, Phase 4 R4 |
| 증거 | concept 페이지인데 `<title>Roots - Math Documentation</title>` (고정) |
| 추가 | `<h1>` 태그도 0개 |
| 위험 | 검색 결과 제목 일반화 + 접근성 |

**조사**: `apps/roots/app/routes/concept/$conceptId.tsx`의 `head` 옵션에서 `loaderData.concept.name`을 사용해 동적 title 생성.

### H9. Permissive `/libraries` SSR HTML 706 KB

| 항목 | 값 |
| --- | --- |
| 출처 | `profiling/phase4/permissive-curl.txt` |
| 영향 | TTFB / 모바일 LCP 영향. LH home은 67KB라 LH 못 잡음 |

**조사**: 110개 라이브러리 카드를 모두 SSR 인라인 → 클라이언트 hydration 시 무거움. 가상화 또는 페이지네이션 고려.

---

## 4. Medium 발견

| ID | 발견 | 출처 | 영향 |
| --- | --- | --- | --- |
| M1 | 빌드 시간의 65–84%가 `tanstack-start-core:import-protection` 플러그인 | `profiling/phase1/plugin-timings.txt` | 빌드 시간 전반 |
| M2 | `vite-plugin-pwa 1.2.0`이 vite ≤7 peer 요구하는데 vite 8 사용 중 | `profiling/phase2/dedupe.log` | 향후 PWA 깨질 위험 |
| M3 | rollup 4.60+ peer 요구 패키지들이 rollup 2.80.0 발견 (overrides 결과) | `profiling/phase2/dedupe.log` | 향후 호환성 |
| M4 | 7 deprecated subdependencies | `profiling/phase2/dedupe.log` | transitive, 상위 업그레이드 대기 |
| M5 | Context D1 빈 응답 시 sitemap/api 500 (graceful degradation 부재) | `profiling/phase4/context-curl.txt` | 운영 D1 장애 시 사이트맵 다운 |
| M6 | Context 404 페이지 title/canonical/meta 누락 | `profiling/phase4/context-ssr-check.txt` | 404 페이지 SEO |
| M7 | roots-js size-limit 86% (428/500 KB) — 한도 근접 | `profiling/phase3/size-limit.log` | 추가 추가 시 위반 |
| M8 | Roots TBT 297ms / Context TBT 300ms (한도 200ms 초과) | `profiling/phase6/scores-summary.json` | LH warn |

---

## 5. Info 관찰

| ID | 관찰 | 출처 |
| --- | --- | --- |
| I1 | 순환 의존성 0 (apps 324 + packages 171 파일) | `profiling/phase2/circular.log` |
| I2 | 버전 드리프트 0 (syncpack) | `profiling/phase2/syncpack.log` |
| I3 | Deprecated import 0 (479 파일) | `profiling/phase2/deprecated.log` |
| I4 | 의존성 1,310 패키지, node_modules 1.3 GB | `profiling/phase2/dep-summary.txt` |

---

## 6. 우선순위 매트릭스

```
        │ Impact 높음                        │ Impact 낮음
────────┼──────────────────────────────────┼───────────────
Easy    │ C1 (canonical 동적화)             │ M6 (404 메타)
        │ H5 (D1 nocase 인덱스)             │ M7 (size-limit 한도)
        │ H6 (D1 frequency 인덱스)          │ I4 (이미 알려진)
        │ H8 (Roots concept title)          │
────────┼──────────────────────────────────┼───────────────
Hard    │ H1 (vendor-react 분리)            │ M1 (TanStack plugin)
        │ H2 (Context 49MB data)            │ M2 (vite-plugin-pwa)
        │ H3 (Context entry-index 823KB)    │ M4 (deprecated subs)
        │ C2 (Permissive /web-apis 500)     │
        │ C3 (Context LH 0.80)              │
```

---

## 7. KPI (수정 전 베이스라인 → 목표)

| 지표 | 현재 (실측) | 목표 | 출처 |
| --- | --- | --- | --- |
| Build cold | 1m 11.764s | < 60s | `phase1/build-cold.log` |
| Build warm | 40.441s | < 5s (캐시 안정화) | `phase1/build-warm.log` |
| Context client total | 51 MB | < 5 MB | `phase1/dist-sizes.txt` |
| Context vendor-react (raw) | 1.6 MB | < 500 KB | `phase3/compression-sizes.txt` |
| Roots vendor-react (raw) | 1.7 MB | < 500 KB | 동일 |
| Context LH Perf | 0.80 | ≥ 0.90 | `phase6/scores-summary.json` |
| Context LCP | 3260 ms | < 2500 ms | 동일 |
| Roots TBT | 297 ms | < 200 ms | 동일 |
| Context TBT | 300 ms | < 200 ms | 동일 |
| D1 Q8a (alphabetical) plan | SCAN + TEMP B-TREE | SEARCH USING INDEX | `phase5/explain.txt` |
| D1 Q9 (search-index) plan | SCAN + TEMP B-TREE | SEARCH USING INDEX | 동일 |
| Permissive 페이지별 canonical | home (정적) | 페이지별 동적 | `phase4/permissive-seo-check.txt` |
| Permissive `/web-apis` | 500 | 404 또는 200 | `phase4/permissive-curl.txt` |

---

## 8. 권장 액션 PR 분해 (제안)

| PR # | 제목 | 영향 | 추정 시간 |
| --- | --- | --- | --- |
| 1 | **fix(seo): Permissive canonical URL 동적화** | Critical C1 | 1–2h |
| 2 | **fix(permissive): /web-apis 잘못된 라우트 404 처리** | Critical C2 | 30m |
| 3 | **perf(d1): browse/search 인덱스 추가 (0002_query_opt.sql)** | High H5, H6 | 1h + 마이그레이션 |
| 4 | **fix(seo): Roots concept/field 페이지 동적 head meta** | High H8 | 1h |
| 5 | **perf(bundle): createManualChunks 정확한 패키지 매칭** | High H1, C3 (간접) | 2–3h + 측정 |
| 6 | **perf(turbo): Context/Permissive prebuild inputs 정정** | High H7 | 1h |
| 7 | **refactor(data): Context client 49MB JSON ko/en 통합** | High H2 | 4–6h |
| 8 | **chore: vite-plugin-pwa v8 호환 버전 또는 대안 검토** | Medium M2 | 조사 1h+ |

---

## 9. 측정 한계 / 후속 권장

| 한계 | 후속 액션 |
| --- | --- |
| Phase 7 SKIP (wrangler 미인증) | 사용자 직접 `wrangler login` 후 tail 측정 |
| LH 1회 측정 | `numberOfRuns: 3` 또는 5로 변경, 분산 확인 |
| LH는 home만 측정 → 페이지별 SEO 버그 놓침 | 페이지별 LH 또는 다른 SEO 도구 추가 |
| 로컬 D1 데이터 0건 → 쿼리 latency 실측 못 함 | `pnpm seed:local` 후 wrk/k6로 벤치 |
| 모든 측정 1회 (변동성 미평가) | 핵심 KPI는 3–5회 평균 |

---

## 10. 파일 인덱스

| Phase | 디렉토리 | 주요 파일 |
| --- | --- | --- |
| 0 | `profiling/phase0/` | `env.txt`, `install.log`, `SUMMARY.md` |
| 1 | `profiling/phase1/` | `build-{cold,warm,partial}.log`, `task-durations-{cold,warm}.txt`, `*-detail.txt`, `SUMMARY.md` |
| 2 | `profiling/phase2/` | `circular.log`, `syncpack.log`, `dedupe.log`, `loc.txt`, `SUMMARY.md` |
| 3 | `profiling/phase3/` | `compression-sizes.txt`, `size-limit.log`, `{app}-stats.html`, `SUMMARY.md` |
| 4 | `profiling/phase4/` | `{app}-curl.txt`, `{app}-ssr-check.txt`, `permissive-seo-check.txt`, `SUMMARY.md` |
| 5 | `profiling/phase5/` | `query-inventory.txt`, `explain.txt`, `schema-applied.txt`, `SUMMARY.md` |
| 6 | `profiling/phase6/` | `lh-{app}-raw.json`, `scores-summary.json`, `details.txt`, `SUMMARY.md` |
| 7 | `profiling/phase7/` | `SUMMARY.md` (SKIP 사유) |
| 8 | `profiling/REPORT.md` | 본 문서 |
