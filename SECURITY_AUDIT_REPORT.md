# 보안 및 타입 안전성 분석 보고서

**분석 일자:** 2025-12-17
**분석 대상:** apps/permissive, apps/context
**분석자:** Claude Code

---

## 목차

1. [요약](#요약)
2. [타입 에러 방지](#1-타입-에러-방지)
3. [해킹 방지](#2-해킹-방지)
4. [취약점 분석](#3-취약점-분석-owasp-top-10)
5. [수정 계획](#4-수정-계획)
6. [우선순위별 작업 목록](#5-우선순위별-작업-목록)

---

## 요약

| 분류 | 발견 건수 | 위험도 |
|------|----------|--------|
| 🔴 Critical | 2 | 즉시 수정 필요 |
| 🟠 High | 4 | 빠른 수정 권장 |
| 🟡 Medium | 6 | 계획적 수정 |
| 🟢 Low | 5 | 개선 권장 |
| **총계** | **17** | - |

---

## 1. 타입 에러 방지

### 🔴 CRITICAL-T1: Non-null 단언 (!) 남용

**위치:**
- `apps/permissive/src/entry-client.tsx:4`
- `apps/context/src/pages/EntryPage.tsx:78, 88, 123-126`
- `apps/permissive/src/routes/libraries/[libId].tsx` (여러 곳)

**현재 코드:**
```typescript
// entry-client.tsx
mount(() => <StartClient />, document.getElementById("app")!);

// EntryPage.tsx
<Title>{entry()!.korean} - Context</Title>
{entry()!.hanja}
```

**문제점:**
- `!` 연산자는 TypeScript에게 "이 값은 절대 null이 아니다"라고 선언
- 런타임에서 null/undefined가 발생하면 크래시 발생
- 코드 변경 시 예상치 못한 버그 유발

**수정 방안:**
```typescript
// entry-client.tsx - 명시적 null 체크
const appElement = document.getElementById("app");
if (!appElement) {
  throw new Error("App container element not found");
}
mount(() => <StartClient />, appElement);

// EntryPage.tsx - optional chaining 사용
<Title>{entry()?.korean ?? "Not Found"} - Context</Title>
```

---

### 🟠 HIGH-T2: URL 파라미터 타입 검증 부재

**위치:**
- `apps/permissive/src/routes/libraries/[libId].tsx:97`
- `apps/permissive/src/routes/web-api/[apiId].tsx:91`

**현재 코드:**
```typescript
const lib = () => params.libId ? libraries[params.libId.toLowerCase()] : undefined;
```

**문제점:**
- URL 파라미터는 외부 입력 → 신뢰 불가
- `__proto__`, `constructor` 같은 특수 키로 프로토타입 오염 가능
- 존재하지 않는 키 접근 시 undefined 반환 (의도된 동작이나 명시적이지 않음)

**수정 방안:**
```typescript
const lib = () => {
  if (!params.libId) return undefined;
  const key = params.libId.toLowerCase();
  // hasOwnProperty로 프로토타입 체인 접근 차단
  if (!Object.prototype.hasOwnProperty.call(libraries, key)) {
    return undefined;
  }
  return libraries[key];
};
```

---

### 🟡 MEDIUM-T3: reduce() 타입 안전성

**위치:**
- `apps/permissive/src/routes/libraries.tsx:159`
- `apps/permissive/src/routes/web-api/index.tsx:106`

**수정 완료:** 이전 작업에서 `reduce<Record<...>>()` 제네릭 문법으로 수정함

---

### 🟡 MEDIUM-T4: localStorage 값 타입 검증

**위치:**
- `apps/permissive/src/components/ui/ThemeToggle.tsx:10-11`
- `apps/permissive/src/components/layout/DocsLayout.tsx:33-34`

**현재 코드:**
```typescript
const stored = localStorage.getItem("theme");
if (stored === "dark" || ...) {
  setTheme("dark");
  // stored가 "dark"임이 확인되었지만 setTheme에 직접 전달하지 않음
}
```

**문제점:**
- 타입 체크 후에도 리터럴 값을 직접 사용 → 실수 가능성
- 일관되지 않은 검증 패턴

**수정 방안:**
```typescript
// 타입 가드 함수 생성
function isValidTheme(value: string | null): value is "light" | "dark" {
  return value === "light" || value === "dark";
}

const stored = localStorage.getItem("theme");
if (isValidTheme(stored)) {
  setTheme(stored); // 타입 안전하게 전달
}
```

---

## 2. 해킹 방지

### 🔴 CRITICAL-H1: dangerouslySetInnerHTML 사용

**위치:** `apps/permissive/src/entry-server.tsx:21-29`

**현재 코드:**
```tsx
<script dangerouslySetInnerHTML={{
  __html: `
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
      });
    }
  `
}} />
```

**위험도:** 🔴 Critical (현재는 하드코딩이지만 패턴 자체가 위험)

**문제점:**
- XSS 공격의 주요 진입점
- 코드 리뷰 시 간과하기 쉬움
- 향후 동적 데이터 삽입 시 취약점 발생

**수정 방안:**
```tsx
// entry-client.tsx로 이동 (클라이언트 전용 로직)
onMount(() => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
});

// 또는 별도 스크립트 파일로 분리
<script src="/register-sw.js" />
```

---

### 🟠 HIGH-H2: 동적 객체 키 접근 (Prototype Pollution)

**위치:**
- `apps/permissive/src/routes/libraries/[libId].tsx:97`
- `apps/permissive/src/routes/web-api/[apiId].tsx:91`

**공격 시나리오:**
```
URL: /libraries/__proto__
URL: /libraries/constructor
```

**수정 방안:**
```typescript
// 화이트리스트 기반 검증
const VALID_LIBRARY_IDS = Object.keys(libraries);

const lib = () => {
  const id = params.libId?.toLowerCase();
  if (!id || !VALID_LIBRARY_IDS.includes(id)) {
    return undefined;
  }
  return libraries[id];
};
```

---

### 🟡 MEDIUM-H3: IndexedDB 데이터 검증 부재

**위치:**
- `apps/permissive/src/lib/db.ts:52-58`
- `apps/context/src/lib/db.ts:44-47`

**현재 코드:**
```typescript
async add(libraryId: string) {
  const exists = await db.favoriteLibraries.where("libraryId").equals(libraryId).first();
  if (exists) return exists.id;
  return db.favoriteLibraries.add({ libraryId, addedAt: new Date() });
}
```

**문제점:**
- 임의의 문자열을 ID로 저장 가능
- 악의적인 대량 데이터 삽입 가능
- 존재하지 않는 라이브러리 ID 저장 가능

**수정 방안:**
```typescript
// 유효한 라이브러리 ID 목록
import { libraries } from "@/data/libraries";

async add(libraryId: string) {
  // 1. ID 유효성 검증
  if (!Object.prototype.hasOwnProperty.call(libraries, libraryId)) {
    throw new Error(`Invalid library ID: ${libraryId}`);
  }

  // 2. 길이 제한
  if (libraryId.length > 100) {
    throw new Error("Library ID too long");
  }

  // 3. 기존 로직
  const exists = await db.favoriteLibraries.where("libraryId").equals(libraryId).first();
  if (exists) return exists.id;
  return db.favoriteLibraries.add({ libraryId, addedAt: new Date() });
}
```

---

### 🟡 MEDIUM-H4: Rate Limiting 부재

**위치:** 모든 favorites 토글 함수

**문제점:**
- 무한 클릭으로 IndexedDB 과부하 가능
- 불필요한 연산 발생

**수정 방안:**
```typescript
import { createSignal } from "solid-js";

// 디바운스된 토글 함수
const [isProcessing, setIsProcessing] = createSignal(false);

const toggleFavorite = async (libraryId: string) => {
  if (isProcessing()) return;

  setIsProcessing(true);
  try {
    await favoriteLibraries.toggle(libraryId);
  } finally {
    // 300ms 쿨다운
    setTimeout(() => setIsProcessing(false), 300);
  }
};
```

---

## 3. 취약점 분석 (OWASP Top 10)

### 🟠 HIGH-V1: Service Worker Fetch 에러 미처리

**위치:** `apps/permissive/public/sw.js:22-36`

**현재 코드:**
```javascript
event.respondWith(
  caches.match(event.request).then((cached) => {
    const fetchPromise = fetch(event.request).then((response) => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      }
      return response;
    });
    return cached || fetchPromise;
  })
);
```

**문제점:**
- `fetch()` 실패 시 에러 미처리 → 앱 크래시
- 네트워크 오류 시 빈 응답 반환
- 오프라인 상태 대응 부재

**수정 방안:**
```javascript
event.respondWith(
  caches.match(event.request).then((cached) => {
    const fetchPromise = fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch((error) => {
        console.error('[SW] Fetch failed:', error);
        // 캐시된 버전 반환 또는 오프라인 페이지
        return cached || new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    return cached || fetchPromise;
  })
);
```

---

### 🟡 MEDIUM-V2: CSP (Content Security Policy) 미설정

**문제점:**
- XSS 공격에 대한 브라우저 레벨 방어 부재
- 인라인 스크립트 실행 허용

**수정 방안:**
```typescript
// app.config.ts 또는 서버 설정
export default defineConfig({
  server: {
    headers: {
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'", // SW 등록 스크립트용
        "style-src 'self' 'unsafe-inline'",  // 인라인 스타일용
        "img-src 'self' data: https:",
        "connect-src 'self' https://developer.mozilla.org",
      ].join("; ")
    }
  }
});
```

---

### 🟡 MEDIUM-V3: 검색어 길이 제한 부재

**위치:**
- `apps/context/src/components/Layout.tsx:60`
- `apps/permissive/src/routes/libraries.tsx:141`

**현재 코드:**
```typescript
const q = searchQuery().toLowerCase().trim();
```

**문제점:**
- 매우 긴 검색어 입력 시 성능 저하
- ReDoS (Regular Expression Denial of Service) 유사 공격 가능

**수정 방안:**
```typescript
const MAX_SEARCH_LENGTH = 100;
const q = searchQuery().toLowerCase().trim().slice(0, MAX_SEARCH_LENGTH);
```

---

### 🟢 LOW-V4: 외부 링크 보안

**위치:** Sidebar.tsx, 각종 라이브러리/API 상세 페이지

**현재 코드:**
```tsx
<a href={lib.github} target="_blank" rel="noopener noreferrer">
```

**상태:** ✅ 이미 `rel="noopener noreferrer"` 적용됨 (양호)

---

### 🟢 LOW-V5: DOM 직접 조작

**위치:** 여러 컴포넌트의 onMouseEnter/onMouseLeave

**현재 코드:**
```typescript
onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
```

**문제점:**
- CSS 클래스 대신 인라인 스타일 직접 조작
- 성능 저하 (layout thrashing)
- 유지보수 어려움

**수정 방안:**
```css
/* styles.css */
.hover-bg:hover {
  background-color: var(--bg-tertiary);
}
```
```tsx
<button class="hover-bg">...</button>
```

---

## 4. 수정 계획

### Phase 1: 즉시 수정 (Critical/High) - 예상 소요: 2-3시간

| # | 항목 | 파일 | 작업 내용 |
|---|------|------|----------|
| 1 | CRITICAL-T1 | entry-client.tsx | null 체크 추가 |
| 2 | CRITICAL-H1 | entry-server.tsx | dangerouslySetInnerHTML 제거 |
| 3 | HIGH-T2 | [libId].tsx, [apiId].tsx | 프로토타입 오염 방지 |
| 4 | HIGH-H2 | 동일 | 화이트리스트 검증 |
| 5 | HIGH-V1 | sw.js | 에러 핸들링 추가 |

### Phase 2: 계획적 수정 (Medium) - 예상 소요: 3-4시간

| # | 항목 | 파일 | 작업 내용 |
|---|------|------|----------|
| 6 | MEDIUM-T4 | ThemeToggle, DocsLayout | 타입 가드 함수 생성 |
| 7 | MEDIUM-H3 | db.ts (both) | ID 검증 로직 추가 |
| 8 | MEDIUM-H4 | 각 컴포넌트 | 디바운스 적용 |
| 9 | MEDIUM-V2 | app.config.ts | CSP 헤더 설정 |
| 10 | MEDIUM-V3 | Layout, libraries.tsx | 검색어 길이 제한 |

### Phase 3: 개선 작업 (Low) - 예상 소요: 2시간

| # | 항목 | 파일 | 작업 내용 |
|---|------|------|----------|
| 11 | LOW-V5 | 여러 컴포넌트 | CSS 클래스로 전환 |
| 12 | - | EntryPage.tsx | non-null 단언 제거 |
| 13 | - | 전체 | 일관된 에러 핸들링 패턴 |

---

## 5. 우선순위별 작업 목록

### 🔴 즉시 수정 (1-2일 내)

```
□ entry-client.tsx: getElementById null 체크
□ entry-server.tsx: SW 등록 스크립트 분리
□ sw.js: fetch 에러 핸들링
□ [libId].tsx, [apiId].tsx: 프로토타입 오염 방지
```

### 🟠 이번 주 내 수정

```
□ db.ts (both): 입력값 검증 강화
□ 검색 기능: 길이 제한 추가
□ CSP 헤더 설정
```

### 🟡 다음 스프린트

```
□ 타입 가드 유틸리티 함수 생성
□ 디바운스/Rate Limiting 적용
□ 인라인 스타일 → CSS 클래스 전환
```

---

## 부록: 보안 체크리스트

개발 시 확인해야 할 항목:

- [ ] 외부 입력(URL params, form input)을 객체 키로 사용하지 않음
- [ ] `dangerouslySetInnerHTML` 사용 시 하드코딩된 값만 사용
- [ ] localStorage/IndexedDB 값을 사용 전 검증
- [ ] 모든 fetch 호출에 에러 핸들링 존재
- [ ] 외부 링크에 `rel="noopener noreferrer"` 적용
- [ ] 사용자 입력에 길이 제한 적용
- [ ] non-null assertion (`!`) 대신 optional chaining 또는 명시적 체크 사용

---

*이 보고서는 자동 분석 도구와 수동 코드 리뷰를 통해 작성되었습니다.*
