# Phase 2 - Dependency & Structure Summary

## 결과 요약

| 검사 | 결과 | 소요 | 출처 |
| --- | --- | --- | --- |
| 순환 의존성 (apps 324 + packages 171 files) | **✓ 0건** | 9.0s | `circular.log` |
| 버전 드리프트 (syncpack lint) | **✓ 0건** | 0.9s | `syncpack.log` |
| Deprecated imports (479 files) | **✓ 0건** | 1.4s | `deprecated.log` |
| Peer 의존성 충돌 | ⚠ **5건** | — | `dedupe.log` |
| Deprecated subdependencies | ⚠ **7건** | — | `dedupe.log` |

## 🚨 발견된 peer dependency 충돌

| # | 패키지 | 문제 | 위험도 |
| - | --- | --- | --- |
| P1 | `@tailwindcss/forms 0.5.11` | missing peer `tailwindcss` | 중 (직접 등록 안 됨) |
| P2 | `@tailwindcss/typography 0.5.19` | missing peer `tailwindcss` | 중 |
| P3 | `workbox-build 7.4.0` 하위 rollup 플러그인들 | rollup@^4.60.0 요구하는데 2.80.0 발견 | 낮음-중 (현재 빌드는 동작) |
| P4 | `rollup-plugin-visualizer 7.0.1` | 동일 (rollup 4.60+ 요구) | 낮음 (visualizer 출력은 정상) |
| P5 | `vite-plugin-pwa 1.2.0` (permissive) | vite ≤7 peer인데 8.0.10 사용 중 | **중-높음** |
| P6 | `@storybook/csf-plugin 10.3.5` | rollup 4.60+ 요구 | 낮음 |

> 출처: `profiling/phase2/dedupe.log`

> ⚠️ **P5 주의**: `vite-plugin-pwa` v1.2.0이 vite 8을 공식 지원하지 않음. 현재 빌드는 통과하지만 향후 vite-plugin-pwa 업데이트 또는 vite breaking change 시 깨질 위험. CLAUDE.md 다운그레이드 금지 정책에 따라 vite 8 유지 → vite-plugin-pwa의 vite 8 지원 PR/대안 추적 필요.

## Deprecated subdependencies

`glob@11.1.0`, `glob@7.2.3`, `inflight@1.0.6`, `rimraf@3.0.2`, `source-map@0.8.0-beta.0`, `sourcemap-codec@1.4.8`, `whatwg-encoding@3.1.1`

대부분 transitive 의존이라 직접 액션 불가. 상위 패키지 업데이트로만 해결.

## LOC 분포 (코드 크기)

| 순위 | 위치 | LOC |
| --- | --- | --- |
| 1 | apps/roots | **36,087** |
| 2 | apps/context | 15,281 |
| 3 | packages/ui | 10,369 |
| 4 | apps/permissive | 9,076 |
| 5 | packages/seo | 2,451 |
| 6 | packages/search | 2,245 |
| 7 | packages/platform | 1,612 |
| 8 | packages/core | 1,231 |
| 9 | packages/data | 1,188 |
| 10 | packages/i18n | 1,050 |
| 11 | packages/features | 998 |
| 12 | packages/pwa | 627 |
| 13 | packages/config | 500 |
| 14 | apps/docs | 10 |

> 출처: `profiling/phase2/loc.txt`

**관찰**: Roots LOC(36k)가 Context(15k)의 2.4배. 그러나 데이터 행 수는 Roots 438개 vs Context 16,944개 (`CLAUDE.md`). 즉 **Roots는 데이터를 TS 코드로 가지고 있음** → 빌드 시간이 많이 걸리는 이유 (cold 67s). Phase 1의 `useAutoAnimate-CPTLYVYF.js` 728KB 청크 정체도 이와 연결될 가능성 있음.

## 의존성 규모

| 항목 | 값 |
| --- | --- |
| Workspace 패키지 수 | 10 |
| Root devDependencies | 63 |
| Root dependencies | 5 |
| Resolved packages (node_modules/.pnpm) | **1,310** |
| node_modules 용량 | 1.3 GB |
