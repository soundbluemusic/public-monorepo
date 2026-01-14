---
name: ssg-check
description: SSG 규칙 위반 검사. ssr:false 유지, prerender() 존재, orphan DOM 정리 로직 확인
---

# SSG Check 스킬

SSG(Static Site Generation) 규칙 위반을 검사하는 스킬입니다.

## 자동 실행 지시

**이 스킬이 호출되면 즉시 다음을 수행하세요:**

1. Bash tool로 `pnpm verify:ssg` 실행
2. 결과 분석 후 요약 출력
3. 오류 발견 시 해당 파일 확인 및 수정 제안

```bash
pnpm verify:ssg
```

## 검사 항목

| 항목              | 기준                            |
| ----------------- | ------------------------------- |
| `ssr: false`      | react-router.config.ts에서 유지 |
| `prerender()`     | 함수 존재 및 라우트 반환        |
| HTML 출력         | 빈 `<div id="root">` 없음       |
| orphan DOM 정리   | entry.client.tsx 로직 유지      |

## 오류 발견 시 자동 처리

1. 위반 항목 식별
2. 해당 파일 Read로 확인
3. 수정 방법 제안
4. 사용자 승인 후 Edit로 수정

## 관련 파일

- `apps/*/react-router.config.ts`
- `apps/*/app/entry.client.tsx`
- `scripts/verify-ssg.ts`
