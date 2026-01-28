---
name: latest-check
description: 프로젝트 기술 스택 최신 정보 검색. GitHub API로 정확한 릴리스 날짜 확인
---

# Latest Check 스킬

프로젝트에서 사용하는 핵심 기술 스택의 최신 변경사항을 **공식 소스**에서 검색합니다.

## 자동 실행 지시

**이 스킬이 호출되면 즉시 다음을 수행하세요:**

### 0단계: 오늘 날짜 확인

시스템 메시지의 `Today's date` 값을 확인합니다. 이 날짜를 기준으로:

- 문서의 최신 날짜가 오늘 기준 얼마나 지났는지 계산 (N일 전)
- prompt에 동적으로 날짜 범위 적용

### 1단계: GitHub API로 정확한 릴리스 날짜 확인 (병렬 실행)

**GitHub API는 정확한 ISO 타임스탬프를 반환합니다.** WebFetch로 아래 URL을 병렬 호출합니다.

| 기술 | GitHub API URL |
|------|----------------|
| TanStack Router | `https://api.github.com/repos/TanStack/router/releases?per_page=5` |
| Tailwind CSS | `https://api.github.com/repos/tailwindlabs/tailwindcss/releases?per_page=5` |
| TypeScript | `https://api.github.com/repos/microsoft/TypeScript/releases?per_page=5` |

**prompt 형식**:

```
Extract the tag_name and published_at for each release. List all releases with exact dates in YYYY-MM-DD format.
```

### 2단계: 공식 문서에서 변경사항 확인 (병렬 실행)

Cloudflare는 GitHub API가 없으므로 공식 문서를 직접 확인합니다.

| 기술 | URL |
|------|-----|
| Cloudflare Workers | `https://developers.cloudflare.com/workers/platform/changelog/` |
| Cloudflare D1 | `https://developers.cloudflare.com/d1/platform/release-notes/` |
| TanStack Router | `https://tanstack.com/router/latest/docs/framework/react/overview` |

**prompt 형식**:

```
"[오늘 날짜 기준 6개월 전] 이후 변경사항을 날짜와 함께 전체 나열해줘.
요약하지 말고 모든 항목을 포함해. 가장 최근 항목부터 나열해."
```

### 3단계: 추가 검색 (최후 수단)

공식 문서와 GitHub API에서 정보가 부족할 경우에만 WebSearch를 사용합니다.
**반드시 공식 도메인 필터를 적용합니다**:

```yaml
allowed_domains:
  - developers.cloudflare.com
  - reactrouter.com
  - tailwindcss.com
  - typescriptlang.org
  - github.com
  - blog.cloudflare.com
  - devblogs.microsoft.com
```

## 검색 대상

| 주제 | 데이터 소스 | 프로젝트 관련성 |
|------|------------|----------------|
| Cloudflare Workers | 공식 문서 (절대 날짜) | Context, Permissive 앱 호스팅 |
| Cloudflare D1 | 공식 문서 (절대 날짜) | Context 앱 데이터베이스 |
| TanStack Router/Start | GitHub API | 모든 앱 라우팅 |
| Tailwind CSS v4 | GitHub API | UI 스타일링 |
| TypeScript | GitHub API | 전체 코드베이스 |

## 출처 우선순위 (중요!)

1. **✅ 최우선**: GitHub API (정확한 ISO 타임스탬프)
2. **✅ 최우선**: 공식 문서 (developers.cloudflare.com, reactrouter.com)
3. **✅ 허용**: 공식 블로그 (blog.cloudflare.com, devblogs.microsoft.com)
4. **❌ 지양**: GitHub 릴리스 페이지 HTML (상대 시간 표시)
5. **❌ 지양**: Medium, dev.to, 개인 블로그, 커뮤니티 포럼

## 출력 형식

**상단에 오늘 날짜 명시** 후, 각 주제별로 출력합니다:

```markdown
> 기준일: YYYY-MM-DD (오늘)

### 1. [주제명]

- **최신 버전**: vX.Y.Z
- **릴리스 날짜**: YYYY-MM-DD (N일 전)
- **주요 변경사항**: (최근 5개 항목)
  - YYYY-MM-DD: [변경 내용]
  - YYYY-MM-DD: [변경 내용]
  - ...
- **공식 출처**: [URL]
- **프로젝트 영향**: [영향 있음/없음/확인 필요 + 설명]
```

## 예시 출력

> 기준일: 2026-01-17 (오늘)

### 1. Cloudflare Workers

- **최신 날짜**: 2026-01-13 (4일 전)
- **주요 변경사항**:
  - 2026-01-13: Updated v8 to version 14.4
  - 2025-12-19: Allow null name when creating dynamic workers
  - 2025-11-25: Updated v8 to version 14.3
- **공식 출처**: https://developers.cloudflare.com/workers/platform/changelog/
- **프로젝트 영향**: 없음 - 런타임 개선 자동 적용

### 2. Tailwind CSS v4

- **최신 버전**: v4.1.18
- **릴리스 날짜**: 2025-12-11 (37일 전)
- **주요 변경사항**:
  - v4.1.18: source() validation 수정, CSS parse errors 개선
  - v4.1.17: 2025-11-06
  - v4.1.16: 2025-10-23
- **공식 출처**: https://api.github.com/repos/tailwindlabs/tailwindcss/releases
- **프로젝트 영향**: 없음 - 현재 버전 유지

### 3. TypeScript

- **최신 버전**: v5.9.3
- **릴리스 날짜**: 2025-10-01 (108일 전)
- **공식 출처**: https://api.github.com/repos/microsoft/TypeScript/releases
- **프로젝트 영향**: 확인 필요 - 5.9 새 기능 검토

## 요약 테이블

출력 마지막에 요약 테이블을 포함합니다:

```markdown
## 요약

| 기술 | 최신 버전 | 릴리스 날짜 | 경과일 | 영향도 |
|------|----------|------------|--------|--------|
| Cloudflare Workers | - | 2026-01-13 | 4일 | 없음 |
| Cloudflare D1 | - | 2025-11-05 | 73일 | 없음 |
| TanStack Router | v1.157.2 | 2026-01-17 | 0일 | 확인 필요 |
| Tailwind CSS v4 | v4.1.18 | 2025-12-11 | 37일 | 없음 |
| TypeScript | v5.9.3 | 2025-10-01 | 108일 | 확인 필요 |
```

## 데이터 소스 정확도

| 소스 | 날짜 정확도 | 비고 |
|------|------------|------|
| GitHub API | ✅ 정확 | `published_at` 필드 (ISO 8601) |
| Cloudflare 공식 문서 | ✅ 정확 | 절대 날짜 표시 |
| TanStack 공식 문서 | ✅ 정확 | GitHub releases 연동 |
| GitHub 릴리스 페이지 HTML | ⚠️ 부정확 | 상대 시간 ("3 days ago") |
| npm registry | ❌ 사용 불가 | 응답 크기 초과 (10MB+) |

## 배경

Claude의 지식 컷오프(2025년 5월) 이후 기술 스택이 빠르게 변화합니다.
**블로그/커뮤니티 글은 outdated되거나 부정확할 수 있으므로, 반드시 공식 소스를 우선 확인합니다.**

GitHub API는 인증 없이 60회/시간 요청 가능하며, 정확한 ISO 타임스탬프를 반환합니다.

## 관련 문서

- `CLAUDE.md` - "최신 정보 확인 필수" 섹션
- `ARCHITECTURE.md` - 기술 스택 개요
