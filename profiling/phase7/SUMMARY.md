# Phase 7 - Cloudflare Runtime Metrics (SKIPPED)

## SKIP 사유

`wrangler whoami` 결과 (`profiling/phase5/schema-via-wrangler.txt:8`):

```
You are not authenticated. Please run `wrangler login`.
```

→ `wrangler tail`, Cloudflare Analytics, R2 cache 통계 등 인증이 필요한 모든 측정 불가.

## 인증 후 가능한 측정 (수동 후속 권장)

| # | 측정 | 명령 |
| - | --- | --- |
| 7.1 | Worker tail (JSON) | `wrangler tail --format=json --config dist/server/wrangler.json` |
| 7.2 | CPU 시간 분포 | tail 결과에서 `event.response.cpuTime` 추출 |
| 7.3 | 실제 콜드 스타트 latency | tail에서 첫 invocation `event.response.responseStartTime` |
| 7.4 | 5xx 에러율 | tail에서 `event.response.status >= 500` 카운트 |
| 7.5 | D1 평균 latency | tail 또는 `wrangler d1 info context-db` |
| 7.6 | R2 캐시 히트율 | Cloudflare 대시보드 → Workers → R2 metrics |

## Phase 7에서 검증되어야 했던 가설

| 가설 (다른 Phase에서 도출됨) | 검증 방법 |
| --- | --- |
| Context Worker 콜드 스타트 ≥ 500ms (Phase 6 LH TTFB 701ms 일부) | tail로 첫 invocation 측정 |
| Phase 5 D1 인덱스 누락이 실 latency에 영향 | tail로 Q8a/Q9 응답 시간 측정 |
| Phase 1 발견 Worker 번들 1.9MB가 CPU init 시간에 영향 | tail의 `responseStartTime` 분포 |
| Phase 4 발견 R6 (D1 빈 응답 시 500) 실제 발생 빈도 | Cloudflare 대시보드 5xx 분포 |

## 다음 단계

사용자가 `wrangler login` 수행 후 위 측정을 수동으로 진행 가능. 또는:

```bash
# 안전: --remote 없이 로컬만 측정 (이미 Phase 4, 5에서 완료)
# 위험 0: Cloudflare 대시보드 로그인 후 Analytics 탭에서 트래픽 그래프 캡처
```
