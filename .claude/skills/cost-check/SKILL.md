---
name: cost-check
description: R2 비용 최적화 규칙 검사. Turborepo Remote Cache 비활성화 상태 확인
---

# Cost Check 스킬

R2 비용 최적화 규칙 준수 여부를 검사하는 스킬입니다.

## 자동 실행 지시

**이 스킬이 호출되면 즉시 다음을 수행하세요:**

1. `turbo.json` 파일 읽기 → `remoteCache.enabled` 값 확인
2. `.github/workflows/deploy-context-r2.yml` 확인 → rclone 사용 여부
3. 결과 출력

```bash
# 1. turbo.json에서 remoteCache 설정 확인
grep -A 2 '"remoteCache"' turbo.json

# 2. R2 동기화 워크플로우에서 rclone 사용 확인
grep -E "(rclone|wrangler r2)" .github/workflows/deploy-context-r2.yml
```

## 검사 규칙

| 항목 | 기대값 | 위반 시 조치 |
| ---- | ------ | ------------ |
| `remoteCache.enabled` | `false` | 즉시 `false`로 수정 |
| 환경변수 `TURBO_REMOTE_ONLY` | 미설정 | 제거 권고 |
| R2 동기화 도구 | `rclone` | Wrangler 코드 제거 후 rclone으로 교체 |

## 위반 발견 시 자동 처리

### 1. Turborepo Remote Cache 위반

`turbo.json`에서 `remoteCache.enabled: true` 발견 시:

- 즉시 `false`로 수정
- 사용자에게 수정 사실 알림

### 2. Wrangler R2 사용 위반

`wrangler r2 object` 명령어 발견 시:

- **절대 사용 금지** - 단일 스레드로 34,676개 파일 처리 불가
- rclone으로 교체 제안

```bash
# ❌ 금지
wrangler r2 object put ...
wrangler r2 object sync ...

# ✅ 필수
rclone sync build/client/entry r2:bucket/path \
  --checksum \
  --transfers 32 \
  --checkers 32 \
  --fast-list
```

### 3. 환경변수 확인 (선택)

```bash
# .env 파일에서 TURBO 관련 변수 확인
grep -r "TURBO_REMOTE" .env* 2>/dev/null || echo "No TURBO_REMOTE variables found"
```

## 배경

### Turborepo Remote Cache

- **문제**: 활성화 시 빌드마다 R2 Class A 요청 발생
- **비용**: Class A 요청 (LIST, PUT) → 과금 대상
- **대안**: 로컬 캐시 `.turbo/` 폴더 (무료, 1인 개발에 충분)

### R2 동기화 도구

- **문제**: Wrangler는 단일 스레드로 대용량 파일 처리에 부적합
- **비교**:

| 항목 | Wrangler | rclone |
| ---- | -------- | ------ |
| 병렬 처리 | ❌ 단일 스레드 | ✅ 32개 동시 |
| 대용량 | ❌ 느림 | ✅ 최적화 |
| 동기화 | ❌ 수동 | ✅ `sync` (삭제 포함) |

## 관련 파일

- `turbo.json` - Remote Cache 설정
- `.github/workflows/deploy-context-r2.yml` - R2 배포 워크플로우 (rclone 사용)
- `.env*` - 환경변수 파일들
- `CLAUDE.md` - 규칙 문서 (섹션 7, 8)
