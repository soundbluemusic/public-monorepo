---
name: cost-check
description: R2 비용 최적화 규칙 검사. Turborepo Remote Cache 비활성화 상태 확인
---

# Cost Check 스킬

R2 비용 최적화 규칙 준수 여부를 검사하는 스킬입니다.

## 자동 실행 지시

**이 스킬이 호출되면 즉시 다음을 수행하세요:**

1. `turbo.json` 파일 읽기
2. `remoteCache.enabled` 값 확인
3. 결과 출력

```bash
# turbo.json에서 remoteCache 설정 확인
grep -A 2 '"remoteCache"' turbo.json
```

## 검사 규칙

| 항목 | 기대값 | 위반 시 조치 |
|------|--------|-------------|
| `remoteCache.enabled` | `false` | 즉시 `false`로 수정 |
| 환경변수 `TURBO_REMOTE_ONLY` | 미설정 | 제거 권고 |

## 위반 발견 시 자동 처리

1. `turbo.json`에서 `remoteCache.enabled: true` 발견 시:
   - 즉시 `false`로 수정
   - 사용자에게 수정 사실 알림

2. 환경변수 확인 (선택):
   ```bash
   # .env 파일에서 TURBO 관련 변수 확인
   grep -r "TURBO_REMOTE" .env* 2>/dev/null || echo "No TURBO_REMOTE variables found"
   ```

## 배경

- **문제**: Turborepo Remote Cache 활성화 시 빌드마다 R2 Class A 요청 발생
- **비용**: Class A 요청 (LIST, PUT) → 과금 대상
- **대안**: 로컬 캐시 `.turbo/` 폴더 (무료, 1인 개발에 충분)

## 관련 파일

- `turbo.json` - Remote Cache 설정
- `.env*` - 환경변수 파일들
- `CLAUDE.md` - 규칙 문서 (섹션 7)
