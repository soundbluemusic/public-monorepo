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

## 예시

- `/ssg-check` - 전체 앱 검사
- `/ssg-check context` - context 앱만 검사
- `/ssg-check roots` - roots 앱만 검사

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

## 설정

- **context**: fork (메인 컨텍스트 오염 방지)
- **model**: haiku (규칙 기반 검사)

## 반환 형식

```
SSG 검사 결과:

✅ 통과:
- react-router.config.ts: ssr: false 유지
- prerender(): 33,748 라우트 반환

❌ 위반:
- (위반 항목 없음)

⚠️ 경고:
- (경고 항목 없음)
```

## 관련 파일

- `apps/*/react-router.config.ts`
- `apps/*/app/entry.client.tsx`
- `apps/*/app/entry.server.tsx`
