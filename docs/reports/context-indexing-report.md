# Context 앱 페이지 색인 생성 보고서

> **작성일**: 2026-02-05
> **대상**: context.soundbluemusic.com
> **미색인 페이지**: ~8,000개 (추정)

---

## 조사 요약

| 항목 | 값 |
|:-----|:---|
| 사이트맵 총 URL 수 | **34,888개** (17,444 entries x 2 언어) |
| 카테고리 사이트맵 수 | 65개 (모두 HTTP 200) |
| 비ASCII URL 수 | **15,474개** (44%) |
| SSR 렌더링 | 정상 |
| robots.txt 차단 | 없음 |
| noindex 태그 | 없음 |

---

## 발견된 문제

### 1. [치명적] 사이트맵 URL에 한글 문자 미인코딩 — 15,474개 URL

- **파일**: `apps/context/app/server.ts:199`
- **함수**: `generateBilingualUrl()`
- **영향**: 34,888개 중 **15,474개**(44%) URL이 비ASCII 문자 포함
- **일치**: 15,474 / 2 = **7,737 entry** → "약 8천개" 미색인과 거의 정확히 일치

**현재 출력**:
```xml
<loc>https://context.soundbluemusic.com/entry/d-foo-된jang</loc>
<xhtml:link rel="alternate" hreflang="ko" href="https://context.soundbluemusic.com/ko/entry/d-foo-된jang"/>
```

**기대값**:
```xml
<loc>https://context.soundbluemusic.com/entry/d-foo-%EB%90%9Cjang</loc>
<xhtml:link rel="alternate" hreflang="ko" href="https://context.soundbluemusic.com/ko/entry/d-foo-%EB%90%9Cjang"/>
```

**비ASCII 문자가 포함된 entry ID 예시**:

| Entry ID | 포함 한글 | 원어 |
|:---------|:---------|:-----|
| `d-foo-된jang` | 된 | 된장 |
| `d-foo-밥` | 밥 | 밥 |
| `d-foo-bibim밥` | 밥 | 비빔밥 |
| `d-foo-gim밥` | 밥 | 김밥 |
| `d-foo-맥ju` | 맥 | 맥주 |
| `d-foo-chamgi름` | 름 | 참기름 |
| `d-hom-dandokju택` | 택 | 단독주택 |

**근거**: Google 사이트맵 문서에서 URL에 ASCII가 아닌 문자가 포함된 경우 퍼센트 인코딩을 권장합니다. `<loc>` 태그와 `xhtml:link href` 속성 모두에서 미인코딩 한글이 노출되어, Google의 URL 정규화 과정에서 실제 페이지 URL과 불일치가 발생할 수 있습니다.

**수정 방법**: `generateBilingualUrl()`에서 path를 `encodeURI()` 처리:

```typescript
// server.ts의 generateBilingualUrl 함수
function generateBilingualUrl(path: string, priority: string, changefreq: string, now: string): string {
  const encodedPath = path.split('/').map(segment => encodeURIComponent(segment)).join('/');
  const enUrl = `${SITE_URL}${encodedPath}`;
  const koUrl = `${SITE_URL}/ko${encodedPath === '/' ? '' : encodedPath}`;
  // ...
}
```

---

### 2. [높음] lastmod가 항상 현재 날짜

- **파일**: `apps/context/app/server.ts:16-18`
- **영향**: 34,888개 전체 URL

```typescript
// 현재 코드
function getCurrentDateString(): string {
  return new Date().toISOString().slice(0, 10); // 매번 오늘 날짜
}
```

**문제**: Google은 부정확한 lastmod를 감지하면 해당 신호를 무시합니다. 매일 변경되는 것처럼 보이지만 실제로 변경되지 않는 콘텐츠는 Google이 크롤링 우선순위를 올바르게 판단할 수 없게 합니다.

**수정 방법**:
- D1에 `updated_at` 컬럼이 있으면 해당 값 사용
- 없으면 고정 날짜 사용 (마지막 데이터 업데이트일)
- 또는 lastmod 태그를 아예 제거 (부정확한 것보다 없는 것이 나음)

---

### 3. [높음] Open Graph 메타 태그 불완전

- **파일**: `packages/seo/src/meta/head-factory.ts:100-125`
- **영향**: 전체 페이지

**현재 생성되는 태그**:
- `og:title` ✅
- `og:description` ✅
- `twitter:card` ✅
- `twitter:title` ✅
- `twitter:description` ✅

**누락된 태그**:

| 태그 | 필요성 | 기대값 예시 |
|:-----|:-------|:-----------|
| `og:url` | 높음 | `https://context.soundbluemusic.com/entry/annyeong` |
| `og:type` | 높음 | `website` |
| `og:image` | 높음 | `https://context.soundbluemusic.com/og-image.png` |
| `og:locale` | 중간 | `en` 또는 `ko` |
| `og:site_name` | 중간 | `Context Korean Dictionary` |

---

### 4. [중간] 사이트맵에 conversations/tags 페이지 미포함

- **파일**: `apps/context/app/server.ts:71-80`

**`STATIC_PAGES`에 포함된 경로** (8개):
```
/, /about, /browse, /download, /built-with, /license, /privacy, /terms
```

**누락된 경로**:

| 경로 | 콘텐츠 | URL 수 (x2 언어) |
|:-----|:-------|:-----------------|
| `/conversations` | 회화 인덱스 | 2 |
| `/conversations/{categoryId}` | 카테고리별 회화 | ~40+ |
| `/tags` | 태그 인덱스 | 2 |
| `/tag/{tagId}` | 태그별 단어 목록 | 다수 |
| `/sitemap` | HTML 사이트맵 | 2 |

---

### 5. [중간] Cloudflare Pages 레거시 파일 — Workers에서 미작동

현재 Context 앱은 **Cloudflare Workers**로 배포되지만, `public/` 디렉토리에 **Cloudflare Pages 전용** 설정 파일이 남아있습니다.

| 파일 | Pages 용도 | Workers 상태 |
|:-----|:----------|:------------|
| `public/_headers` | 보안 헤더, Cache-Control | **미적용** |
| `public/_redirects` | URL 리디렉션 | **미적용** |
| `public/_routes.json` | SSR 라우팅 규칙 | **미적용** (정적 파일로만 서빙) |

**실제 영향**: HTML 응답에 `Cache-Control` 헤더가 없습니다.

```
# curl -sI 응답 (실제)
HTTP/2 200
content-type: text/html; charset=utf-8
x-content-type-options: nosniff
(Cache-Control 헤더 없음!)
```

---

### 6. [중간] Entry 페이지 priority 차별화 없음

- **파일**: `apps/context/app/server.ts:199`
- **현재**: 모든 34,888개 entry URL이 동일한 `priority: 0.6`

**권장 차별화**:

| 카테고리 유형 | 예시 | 권장 priority |
|:-------------|:-----|:-------------|
| 핵심 어휘 (greetings, emotions) | 안녕, 감사합니다 | 0.8 |
| 일반 어휘 (food, travel) | 밥, 여행 | 0.6 |
| 특수 (consonants, vowels) | ㄱ, ㅏ | 0.4 |

---

### 7. [낮음] /tags 페이지 과도한 크기

| 페이지 | 크기 | 비교 |
|:-------|:----|:-----|
| `/entry/annyeong` | 62KB | 기준 |
| `/category/greetings` | 145KB | 2.3x |
| `/tags` | **474KB** | **7.6x** |

---

## 정상 확인 항목

| 확인 항목 | 결과 | 증거 |
|:----------|:-----|:-----|
| SSR 렌더링 | 정상 | `ssr:!0`, 완전한 HTML |
| `<title>` | 정상 | entry별 고유 (예: "안녕 (annyeong) - Hi / Bye") |
| `<meta description>` | 정상 | entry별 고유 설명 |
| `<link rel="canonical">` | 정상 | EN/KO 각각 올바른 canonical |
| `<link hreflang>` | 정상 | en, ko, x-default 모두 존재 |
| HTTP 상태 코드 | 정상 | 200 OK / 404 (미존재) |
| robots.txt | 정상 | 모든 크롤러 Allow |
| JSON-LD | 정상 | BreadcrumbList, DefinedTerm, WebSite |
| 사이트맵 구조 | 정상 | 67개 서브사이트맵, 모두 200 |
| 응답 시간 | 정상 | entry 0.15s, category 0.29s |

---

## 수정 우선순위

| 순서 | 작업 | 영향 | 예상 효과 |
|:-----|:-----|:-----|:---------|
| 1 | 사이트맵 URL 퍼센트 인코딩 | 15,474 URL | ~7,737 entries 색인 복구 |
| 2 | lastmod 정확한 날짜로 변경 | 전체 34,888 URL | 크롤링 우선순위 정상화 |
| 3 | OG 메타 태그 완성 | 전체 페이지 | 검색 결과 표시 개선 |
| 4 | conversations/tags 사이트맵 추가 | ~200+ URL | 누락 페이지 발견 |
| 5 | Workers용 Cache-Control 헤더 추가 | 전체 HTML | 크롤링 효율 개선 |
