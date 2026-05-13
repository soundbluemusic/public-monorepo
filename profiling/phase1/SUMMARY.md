# Phase 1 - Build Profile Summary

## 빌드 시간 비교

| 구분 | Wall time | 캐시 히트 | 비고 |
| --- | --- | --- | --- |
| **Cold** (clean install + first build) | **1m 11.764s** | 0/7 | `profiling/phase1/build-cold.log` |
| **Warm** (immediately after cold) | **40.441s** | 3/7 | `profiling/phase1/build-warm.log` — context/permissive build/prebuild 캐시 안 됨 |
| **No-op** (nothing changed) | **1.726s** (FULL TURBO) | 7/7 | `profiling/phase1/build-partial.log` |

## 태스크별 시간 (cold)

| Task | Time | Cache |
| --- | --- | --- |
| roots#build | 67s | MISS |
| context#build | 61s | MISS |
| permissive#build | 52s | MISS |
| @soundblue/config#build | 3s | MISS |
| roots#prebuild | 3s | MISS |
| permissive#prebuild | 2s | MISS |
| context#prebuild | 1s | MISS |

출처: `profiling/phase1/task-durations-cold.txt`

## 태스크별 시간 (warm — 직후)

| Task | Time | Cache |
| --- | --- | --- |
| context#build | 38s | **MISS** ⚠️ |
| permissive#build | 29s | **MISS** ⚠️ |
| permissive#prebuild | 1s | **MISS** ⚠️ |
| context#prebuild | 0s | **MISS** ⚠️ |
| roots#prebuild | 0s | HIT |
| roots#build | 0s | HIT |
| @soundblue/config#build | 0s | HIT |

출처: `profiling/phase1/task-durations-warm.txt`

## 🚨 핵심 발견

| # | 발견 | 영향 | 출처 |
| - | --- | --- | --- |
| F1 | **Context client 디렉토리 51 MB** (data/ 49MB, ko/en 중복) | 배포 크기·R2 비용·캐시 비효율 | `profiling/phase1/context-client-detail.txt` |
| F2 | **vendor-react client 청크**: Context 1638KB / Roots 1660KB / Permissive 445KB (Context·Roots가 ~3.7배 큼) | LCP·다운로드 시간 | `profiling/phase1/client-assets.txt` |
| F3 | **Roots `useAutoAnimate-CPTLYVYF.js` server 청크 728KB** (이름과 내용 불일치 의심) | Worker 번들 크기, 콜드스타트 | `profiling/phase1/server-bundles.txt` |
| F4 | **Context `entry-index` server 청크 823KB** | Worker 콜드스타트 | `profiling/phase1/server-bundles.txt` |
| F5 | **Context/Permissive prebuild 매번 캐시 MISS** (Roots는 HIT) | warm 빌드 30s+ 손해 | `profiling/phase1/task-durations-warm.txt` |
| F6 | **빌드 시간의 65–84%가 `tanstack-start-core:import-protection` 플러그인** | 빌드 시간 전반 | `profiling/phase1/plugin-timings.txt` |
| F7 | Service Worker precache: roots 2105KB, context 2005KB, permissive 999KB | 초기 SW 설치 트래픽 | `build-cold.log` "Service Worker generated" 라인 |

## Dist 크기 비교

| App | Server | Client | Total |
| --- | --- | --- | --- |
| Context | 2.2 MB | **51 MB** | 53.2 MB |
| Permissive | 992 KB | 1.5 MB | 2.5 MB |
| Roots | 3.3 MB | 4.7 MB | 8.0 MB |

출처: `profiling/phase1/dist-sizes.txt`

## Worker entry (실제 fetch handler)

| App | Server `index.js` |
| --- | --- |
| Context | 23 KB |
| Permissive | 7 KB |
| Roots | 7 KB |

> **주의**: Context의 23KB는 빌드 후 `inject-polyfill.mjs`로 패치되어 실제 핸들러 로직이 추가됨 (`CLAUDE.md` Context 빌드 진입점 함정 섹션). 다른 server/assets/*.js 청크들이 dynamic import로 로드되므로 콜드스타트 시 실제 메모리 영향은 더 큼.
