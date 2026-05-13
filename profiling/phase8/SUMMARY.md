# Phase 8 - Fix Verification Summary

## 빌드 변화

| 지표 | Before | After | 변화 |
| --- | --- | --- | --- |
| Cold 빌드 | 1m 11.764s | 1m 14.507s | +3% (변화 미미) |
| **Warm 빌드** | **40.441s** | **1.102s** | **-97%** ✅ |
| Cache HIT (warm) | 3/7 | **7/7 FULL TURBO** | ✅ |

출처: `profiling/phase8/build-{after,warm-after}.log`

## 클라이언트 vendor 청크 변화

| App | vendor-react Before | vendor-react After | Δ |
| --- | --- | --- | --- |
| Context | 1638 KB | **178 KB** | **-89%** ✅ |
| Roots | 1660 KB | **178 KB** | **-89%** ✅ |
| Permissive | 445 KB | 178 KB | -60% |

| App | vendor-tanstack Before | vendor-tanstack After | Δ |
| --- | --- | --- | --- |
| Context | 1 KB | **1280 KB** | ⚠ vendor-react가 빠진 코드 일부 이동 |
| Roots | 0 KB | **1052 KB** | ⚠ 동일 |
| Permissive | 268 KB | 268 KB | 동일 |

> ⚠️ vendor-react는 -89% 줄었으나 vendor-tanstack이 늘어 총합 비슷. 추가 분리 필요 (별도 PR).

## SEO 검증 (Permissive)

| Path | canonical Before | canonical After |
| --- | --- | --- |
| `/` | home | home (정상) ✅ |
| `/libraries` | home ❌ | **`/libraries`** ✅ |
| `/web-api` | home ❌ | **`/web-api`** ✅ |
| `/tags` | home ❌ | **`/tags`** ✅ |
| `/built-with` | home ❌ | **`/built-with`** ✅ |
| `/sitemap` | home ❌ | **`/sitemap`** ✅ |
| `/ko/libraries` | `/ko` ❌ | **`/ko/libraries`** ✅ |
| `/ko/web-api` | `/ko` ❌ | **`/ko/web-api`** ✅ |

출처: `profiling/phase8/permissive-after-v2.txt`

## /web-apis 라우트 상태

| 측정 | Before | After |
| --- | --- | --- |
| HTTP status | 500 ❌ | **404** ✅ |

## D1 EXPLAIN 변화

| Query | Before | After |
| --- | --- | --- |
| Q8a (alphabetical) | SCAN + TEMP B-TREE | **SCAN USING INDEX idx_entries_korean_nocase** ✅ |
| Q9 (search-index) | SCAN + TEMP B-TREE | **SCAN USING INDEX idx_entries_frequency** ✅ |

출처: `profiling/phase5/explain-after.txt`

## 남은 이슈

| # | 이슈 | 사유 |
| - | --- | --- |
| H1 잔존 | vendor-tanstack 1MB+ | createManualChunks 우선순위로 일부 코드 tanstack 청크로 이동. 추가 패키지 분리 필요 |
| M6 잔존 | catch-all 404 페이지 robots noindex 메타 응답에 미반영 | TanStack Router `throw notFound()` 시 라우트 head 함수가 실행되지 않는 한계. 컴파일된 코드에는 들어있음 (`grep noindex apps/permissive/dist/server/assets/router-*.js`). 별도 PR로 __root head 또는 notFoundComponent 패턴 검토 필요 |
| H2 미수정 | Context 49MB client data | 큰 리팩터링 (ko/en 통합), 별도 작업 |
| H3 미수정 | Context entry-index 823KB | route-level dynamic import 분리, 별도 작업 |
| H9 미수정 | Permissive /libraries 706KB SSR | 페이지네이션/가상화, 별도 작업 |
