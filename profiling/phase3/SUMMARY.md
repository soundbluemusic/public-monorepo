# Phase 3 - Bundle Profile Summary

## size-limit 결과 (`.size-limit.json:1-17` 기준, brotli 압축)

| App | Size (brotli) | Limit | Usage |
| --- | --- | --- | --- |
| context-js | **371.99 kB** | 500 kB | 74% ✓ |
| permissive-js | **186.07 kB** | 500 kB | 37% ✓ |
| roots-js | **427.98 kB** | 500 kB | **86% ⚠️ 한도 근접** |

> 출처: `profiling/phase3/size-limit.log`

## 클라이언트 vendor-react 청크 (가장 큰 문제)

| App | raw | gzip | gz 비율 |
| --- | --- | --- | --- |
| Context | 1,677,007 B (~1.6 MB) | 440 KB | 26% |
| Roots | 1,699,828 B (~1.7 MB) | 494 KB | 29% |
| Permissive | 455,341 B (~445 KB) | 137 KB | 30% |

> 출처: `profiling/phase3/compression-sizes.txt`

### 🚨 원인 분석

`packages/config/src/vite.ts:54-103`의 `createManualChunks`에서:
- 1번째 조건: `id.includes('react-dom') || id.includes('/react/')` → vendor-react
- 그 외 vendor 분류는 그 다음

`vendor-react-j1Xh8G8H.js` 내용을 strings로 추출한 결과 (`profiling/phase3/context-vendor-react-contents.txt`):
- `minisearch`, `immer`, `schema/`, `dcastil`, `lukeed` 등 React 외 라이브러리 다수
- 라우트 경로 문자열 (`browse`, `entry`, `category` 등)
- → **React 외 라이브러리들이 vendor-react로 빨려 들어감**

가능한 원인:
1. pnpm 가상 디렉토리 경로에 `/react/` 부분 문자열이 우연히 포함될 수 있음
2. React가 의존하는 작은 패키지(`scheduler`, `loose-envify` 등)가 함께 묶인 결과
3. **사용자 검증 권장**: `apps/context/dist/stats.html`을 브라우저에서 열어 정확한 내역 확인 (`profiling/phase3/context-stats.html` 복사본 있음)

> ⚠️ Permissive가 Context/Roots의 1/3.7 크기인 이유: Permissive는 `minisearch`, `immer`, `dexie`(IndexedDB) 등 무거운 런타임 라이브러리 의존이 없음. Context/Roots는 PWA + 오프라인 + 검색 기능이 포함되어 vendor 크기가 큼.

## 서버 청크 분포 (분할된 dynamic-import 청크)

### Context (총 server 1,884 KB)

| Top chunks | size |
| --- | --- |
| `entry-index-BWpEiaQo.js` | **823 KB** ⚠️ |
| `vendor-react-Bt7a4R8Q.js` | 277 KB |
| `layout-No6uMwdw.js` | 106 KB |
| `vendor-tanstack-DDOkrM0m.js` | 106 KB |
| `vendor-storage-B_JsULqC.js` | 93 KB |
| `schemas-Dh6rMSVK.js` | 61 KB |

### Roots (총 server 2,993 KB)

| Top chunks | size |
| --- | --- |
| `useAutoAnimate-CPTLYVYF.js` | **728 KB** ⚠️ (이름과 내용 불일치 의심) |
| `pages-CCPWDT8S.js` | **386 KB** ⚠️ |
| `vendor-react-DLWUI59M.js` | 277 KB |
| `vendor-storage-lfCw2y8R.js` | 93 KB |
| `vendor-tanstack-Ek29vU-c.js` | 89 KB |

### Permissive (총 server 827 KB)

| Top chunks | size |
| --- | --- |
| `vendor-react-BpI_Oe3P.js` | 277 KB |
| `vendor-tanstack-B1m3I6_Y.js` | 89 KB |
| `libraries-CGGMrsP8.js` | 67 KB |
| `DocsLayout-BIVKlD53.js` | 65 KB |

## Worker entry (실제 fetch handler 진입점)

| App | Server entry (`dist/server/index.js`) | gzip |
| --- | --- | --- |
| Context | 23 KB | 7 KB |
| Permissive | 7 KB | 2.5 KB |
| Roots | 7 KB | 2.5 KB |

> Cloudflare Workers 무료 한도 1MB (압축 후) - 모두 통과. 단, dynamic import 청크들은 같은 worker가 lazy 로드하므로 콜드 스타트 시 전체 server/ 디렉토리 크기가 영향. Context 1.9MB, Roots 3.0MB.

## 🚨 발견 요약

| # | 발견 | 권장 액션 | 출처 |
| - | --- | --- | --- |
| B1 | vendor-react 청크 비대 (1.6-1.7MB) | `createManualChunks` 정규식을 정확히 (`/node_modules/react/` 또는 exact 패키지 매칭) | `packages/config/src/vite.ts:58` |
| B2 | Context entry-index 823KB | dynamic import 분리, route-level code-splitting 강화 | `profiling/phase1/server-bundles.txt` |
| B3 | Roots useAutoAnimate 청크 728KB (오인 이름) | 이름 오인 → 별도 chunk 강제 분리 | `profiling/phase1/server-bundles.txt` |
| B4 | roots-js size-limit 86% (428/500 KB) | 한도 근접 → 추가 분할 또는 한도 상향 결정 | `profiling/phase3/size-limit.log` |
| B5 | Context client `data/` 디렉토리 49 MB (ko/en JSON 중복) | 오프라인 DB와 정적 JSON 중 하나만 유지, 또는 압축 | `profiling/phase1/context-client-detail.txt` |
