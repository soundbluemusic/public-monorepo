---
name: ssg-check
description: SSG 규칙 위반 검사. ssr:false 유지, prerender() 존재, orphan DOM 정리 로직 확인
---

# SSG Check 스킬

SSG(Static Site Generation) 규칙 위반을 검사하는 스킬입니다.

## 사용법

```
/ssg-check
/ssg-check [앱 이름]
```

## 실행 방법

**이 스킬을 실행하면 다음 명령어를 Bash로 실행하세요:**

```bash
pnpm verify:ssg
```

## 검사 항목

### 필수 확인
| 항목 | 기준 |
|------|------|
| `ssr: false` | react-router.config.ts에서 유지 |
| `prerender()` | 함수 존재 및 라우트 반환 |
| HTML 출력 | 빈 `<div id="root">` 없음 |
| orphan DOM 정리 | entry.client.tsx 로직 유지 |

### 금지 패턴 검출
- `ssr: true` 설정
- 빈 `prerender()` 반환
- SPA/SSR/ISR 패턴 코드

## 반환 형식

```
SSG 검사 결과:

✅ 통과:
- react-router.config.ts: ssr: false 유지
- prerender(): 33,748 라우트 반환

❌ 위반:
- (위반 항목 없음)
```

## 관련 파일

- `apps/*/react-router.config.ts`
- `apps/*/app/entry.client.tsx`
- `apps/*/app/entry.server.tsx`
- `scripts/verify-ssg.ts`
