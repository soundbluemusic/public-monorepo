# Phase 4 - SSR Runtime Profile Summary

> 측정 환경: `wrangler dev --config dist/server/wrangler.json` (로컬). 프로덕션과 다를 수 있음.

## 응답 시간 (로컬, 동일 머신, 클라이언트 = curl)

### Roots (서버 항상 OK)

| Path | First (ms) | Warm avg (ms) | Size |
| --- | --- | --- | --- |
| `/` | 19.5 | 17.9 | 47 KB |
| `/concept/addition` | 9.0 | 7.7 | **7.8 KB** ⚠ (작음) |
| `/fields` | 7.2 | 7.0 | 8.4 KB |
| `/sitemap.xml` | 8.7 | — | 555 B |

### Permissive (혼합 결과)

| Path | First (ms) | Warm avg (ms) | Size | Status |
| --- | --- | --- | --- | --- |
| `/` | 84.5 | 22 | 68 KB | 200 |
| `/libraries` | 103.6 | 96 | **706 KB** ⚠ | 200 |
| `/web-apis` | 12.5 | 7.6 | 11.8 KB | **500** ⚠️ |
| `/web-api` (정상 라우트) | — | — | — | 200 |

### Context (D1 의존 라우트 미동작 — 로컬 DB 빈 상태)

| Path | First (ms) | Warm avg (ms) | Size | Status |
| --- | --- | --- | --- | --- |
| `/` | 147.8 | 25 | 128 KB | 200 |
| `/entry/annyeong` | 9.7 | 6.2 | 12 KB | **404** (DB 빈 상태로 entry 없음) |
| `/sitemap.xml` | 6.4 | — | 6 B | **500** (D1 실패) |
| `/sitemap-categories.xml` | 5.8 | — | 6 B | **500** |
| `/api/offline-db` | 9.2 | — | 77 B | **500** |

## 🚨 발견

| # | 발견 | 위험도 | 출처 |
| - | --- | --- | --- |
| R1 | **Permissive `/web-apis` 500 에러** (실제 라우트는 `/web-api` 단수) | 중 — 잘못된 URL 진입 시 404 대신 500 | `profiling/phase4/permissive-curl.txt` |
| R2 | **Permissive 모든 페이지 canonical URL이 home으로 고정** (`https://permissive.soundbluemusic.com` — 페이지 경로 없음) | **🔥 매우 높음 (SEO 직격탄)** | `profiling/phase4/permissive-seo-check.txt` |
| R3 | **Permissive `/libraries` SSR HTML 706 KB** (전체 라이브러리 인라인) | 중 — TTFB / LCP 영향 | `profiling/phase4/permissive-curl.txt` |
| R4 | **Roots `/concept/addition` 페이지 동적 title 없음** ("Roots - Math Documentation"으로 고정) | 높음 (SEO/접근성) | `profiling/phase4/roots-ssr-check.txt` |
| R5 | **Roots `/concept/addition` HTML에 h1 없음** | 중 (접근성/SEO) | `profiling/phase4/roots-ssr-check.txt` |
| R6 | **Context D1 빈 상태 → 사이트맵/오프라인DB API 500** | 중 — graceful degradation 부재 (404 또는 빈 sitemap이 적절) | `profiling/phase4/context-curl.txt` |
| R7 | **Context 404 페이지 title/canonical/meta 누락** | 중 (SEO) | `profiling/phase4/context-ssr-check.txt` |
| R8 | **First-request 콜드 ttfb**: Context 147ms, Permissive 84ms, Roots 19ms (모두 로컬) | 정보성 — 프로덕션 콜드스타트는 더 높을 것 | 각 `*-curl.txt` 1번째 라인 |

## 의미 있는 패턴

- Roots: 가장 빠르고 일관됨. SSR 자체는 잘 동작 (단 head meta 동적 처리 누락)
- Permissive: TTFB는 양호하나 **canonical 버그 + 큰 페이지 + 잘못 라우트 500** 3대 SEO 위협
- Context: 빈 D1에서 graceful fallback 없음 → 운영 중 D1 장애 시 사이트맵 전체 다운

## ⚠️ 측정 한계

- 모든 측정이 동일 머신/같은 프로세스 통신 → 네트워크 latency 0. 실제 사용자는 +50–200ms 추가.
- 로컬 D1 빈 상태 → Context의 D1 쿼리 성능은 Phase 5에서 시드 후 측정.
- 프로덕션 콜드 스타트 (Worker 처음 spin-up)는 측정 불가. wrangler tail로만 가능 (Phase 7).
