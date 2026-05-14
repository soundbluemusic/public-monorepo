# Phase 6 - Lighthouse Summary (Production URLs, mobile)

> 측정 환경: Lighthouse 13.1.0 + Chromium 1194 headless, slow 4G + 4× CPU throttle (LH 기본). 측정 시각 UTC 06:48–06:50, 2026-05-13.

## 점수 비교

| App | Perf | A11y | SEO | BP | LCP | FCP | CLS | TBT | TTI |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Context** | **0.80 ❌** | 1.00 ✅ | 1.00 ✅ | 1.00 ✅ | **3260 ms ❌** | 3260 ms | 0 | 300 ms | 4224 ms |
| **Permissive** | **1.00 ✅** | 1.00 ✅ | 1.00 ✅ | 1.00 ✅ | 1109 ms | 1109 ms | 0 | 81 ms | 2290 ms |
| **Roots** | **0.94 ✅** | 1.00 ✅ | 1.00 ✅ | 1.00 ✅ | 1094 ms | 1094 ms | 0 | 297 ms | 4375 ms |

> 기준: `lighthouserc.cjs:24-32` — perf/a11y/bp/seo ≥ 0.9, LCP ≤ 2500ms, CLS ≤ 0.1, TBT ≤ 200ms

## ✅ 기준 통과/위반

| 기준 | Context | Permissive | Roots |
| --- | --- | --- | --- |
| Performance ≥ 0.9 | ❌ 0.80 | ✅ 1.00 | ✅ 0.94 |
| A11y ≥ 0.9 | ✅ | ✅ | ✅ |
| BP ≥ 0.9 | ✅ | ✅ | ✅ |
| SEO ≥ 0.9 | ✅ | ✅ | ✅ |
| LCP ≤ 2500ms | ❌ 3260 | ✅ 1109 | ✅ 1094 |
| CLS ≤ 0.1 | ✅ 0 | ✅ 0 | ✅ 0 |
| TBT ≤ 200ms (warn) | ⚠ 300 | ✅ 81 | ⚠ 297 |

## 🚨 발견

### LH-1: Context Performance 0.80 (CI 기준 미달)

원인 (높은 영향 순):

| 원인 | 값 | 영향 | 출처 |
| --- | --- | --- | --- |
| **server-response-time (TTFB)** | **701 ms** | LCP/FCP 직접 (한도의 28%) | `profiling/phase6/details.txt` |
| **unused-javascript** | 117 KB (`vendor-react-j1Xh8G8H.js`) | LCP +300–600ms 잠재 절감 | `profiling/phase6/context-issues.txt` |
| max-potential-fid | 점수 0.25 | INP 영향 | 동일 |

> TTFB 701ms는 Cloudflare Workers + D1 응답으로는 매우 높음. Phase 5의 D1 인덱스 누락 (Q8a/Q9)이 부분 원인일 가능성. Worker CPU 시간도 영향 (Phase 7 측정 필요).

### LH-2: Roots TBT 297ms 중 692ms가 단일 vendor-react 파일 parse

> 출처: `profiling/phase6/details.txt` (bootup-time)

```
692.4 ms  vendor-react-B_-mAaoG.js  (Phase 3 발견 B1과 동일 청크, 1.66 MB raw)
 19.4 ms  /
  3.0 ms  Unattributable
```

→ Phase 3 발견 B1 (vendor-react 1.6MB 비대)이 직접 TBT 점수를 깎고 있음을 **사용자 메트릭으로 검증 완료**.

### LH-3: Phase 4 SEO 발견은 LH가 못 잡음

LH는 **home URL만** 측정하므로:
- Permissive의 `/libraries`, `/web-api` 등 페이지 canonical=home 버그 (Phase 4 R2) → 검출 안 됨
- Roots `/concept/addition` 동적 title 누락 (Phase 4 R4) → 검출 안 됨
- 페이지별 LH 측정 또는 별도 SEO 도구 (예: `screaming-frog`, `sitebulb`)로 보완 권장

## ⚠️ 측정 한계

- `lighthouserc.cjs:14`는 `numberOfRuns: 1` — 결과 분산 큼. 권장: 3–5회 평균
- 클라우드 환경에서 Chromium 사용 (Playwright 브라우저), 표준 LH 환경과 다름 가능
- TBT 측정값이 throttling 환경 의존도 큼

## 원시 데이터

| 파일 | 내용 |
| --- | --- |
| `profiling/phase6/lh-context-raw.json` | Context 전체 LH JSON (513 KB) |
| `profiling/phase6/lh-permissive-raw.json` | Permissive 전체 |
| `profiling/phase6/lh-roots-raw.json` | Roots 전체 |
| `profiling/phase6/scores-summary.json` | 3앱 점수만 추출 |
| `profiling/phase6/details.txt` | TBT/TTFB/unused-js 세부 |
