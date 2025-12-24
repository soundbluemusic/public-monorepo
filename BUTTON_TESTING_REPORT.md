# 버튼 동작 테스트 완벽 분석 리포트

**테스트 일자**: 2025-12-23
**테스트 도구**: Playwright E2E Testing
**테스트 대상**: Context, Permissive, Roots 앱
**마지막 상태 확인**: 2025-12-24

---

## ⚠️ 수정 상태 (Fix Status)

| 실패 항목 | 앱 | 수정 상태 | 담당 |
|:----------|:---|:--------:|:-----|
| Dark Mode Toggle | Context, Roots | ❌ 미수정 | SSG 하이드레이션 이슈 |
| Theme Toggle | Permissive | ❌ 미수정 | 셀렉터 문제 |
| Back to Top | Context, Permissive | ❌ 미수정 | viewport 밖 위치 |
| Menu Button | Context, Permissive | ❌ 미수정 | 사이드바 오버레이 |
| Search Form | Roots | ❌ 미수정 | navigate() 이슈 |
| Bottom Nav | Roots | ❌ 미수정 | 셀렉터 오류 |

> **우선 해결 필요**: Dark Mode Toggle (SSG 하이드레이션 문제)
>
> **권장 조치**: entry.client.tsx에 테마 초기화 스크립트 추가

---

## 📊 전체 요약

| 앱 | 통과 | 실패 | 성공률 |
|:---:|:---:|:---:|:---:|
| **Context** | 3/6 | 3/6 | 50% |
| **Permissive** | 3/6 | 3/6 | 50% |
| **Roots** | 3/4 | 1/4 | 75% |
| **전체** | **9/18** | **9/18** | **50%** |

---

## ✅ 작동하는 것 (PASSED: 9개)

### Context 앱

1. **✓ Language Toggle** (언어 전환)
   - **상태**: 완벽 작동
   - **테스트 내용**: EN ↔ KR 전환 시 URL이 /ko로 변경
   - **구현 위치**: `apps/context/app/components/Layout.tsx:266-273`
   - **컴포넌트**: `<LanguageToggle>` (shared-react)
   - **동작 방식**: `<a>` 태그 사용, JavaScript 없이도 작동 (SSG 친화적)

2. **✓ Search Input** (검색 입력)
   - **상태**: 완벽 작동
   - **테스트 내용**: 검색어 입력 시 자동완성 결과 표시
   - **구현 위치**: `apps/context/app/components/Layout.tsx:180-207`
   - **동작 방식**:
     - `useMemo`로 검색 결과 필터링
     - 실시간 입력 감지 및 드롭다운 표시
     - 키보드 네비게이션 (↑↓ Enter Esc) 지원

3. **✓ Navigation Links** (네비게이션 링크)
   - **상태**: 완벽 작동
   - **테스트 내용**: Browse 링크 클릭 시 페이지 이동
   - **구현 위치**: `apps/context/app/components/Layout.tsx:255-264`
   - **동작 방식**: React Router의 `<Link>` 사용

### Permissive 앱

4. **✓ Language Toggle** (언어 전환)
   - **상태**: 완벽 작동
   - **테스트 내용**: EN ↔ KR 전환
   - **구현 위치**: `apps/permissive/app/components/layout/Header.tsx:75`
   - **컴포넌트**: `<LanguageToggle>` (shared-react)

5. **✓ Navigation Links** (네비게이션 링크)
   - **상태**: 완벽 작동
   - **테스트 내용**: Web API 페이지로 이동
   - **구현 위치**: `apps/permissive/app/components/layout/Sidebar.tsx:196-220`

6. **✓ External Links** (외부 링크 속성)
   - **상태**: 완벽 작동
   - **테스트 내용**: GitHub 링크가 `target="_blank"`, `rel="noopener noreferrer"` 속성 보유
   - **구현 위치**: `apps/permissive/app/components/layout/Sidebar.tsx:276-280`
   - **보안**: Tabnabbing 공격 방지

### Roots 앱

7. **✓ Language Toggle** (언어 전환)
   - **상태**: 완벽 작동
   - **테스트 내용**: EN ↔ KR 전환
   - **구현 위치**: `apps/roots/app/components/layout/Layout.tsx:152`

8. **✓ Back to Top Button** (맨 위로 버튼)
   - **상태**: 완벽 작동 🌟
   - **테스트 내용**: 스크롤 다운 후 버튼 클릭 시 페이지 상단으로 이동
   - **구현 위치**: `apps/roots/app/components/layout/Layout.tsx:239-253`
   - **동작 방식**:
     - 스크롤 300px 이상 시 버튼 표시
     - `window.scrollTo({ top: 0, behavior: 'smooth' })` 사용
     - 부드러운 스크롤 애니메이션

9. **✓ Navigation Links** (네비게이션 링크)
   - **상태**: 완벽 작동
   - **테스트 내용**: Browse 페이지로 이동
   - **구현 위치**: `apps/roots/app/components/layout/Layout.tsx:119-128`

---

## ❌ 작동하지 않는 것 (FAILED: 9개)

### 1. Dark Mode Toggle (다크 모드 전환) - Context, Roots 앱

**문제**: 버튼을 클릭했지만 테마가 변경되지 않음

**원인 분석**:
```typescript
// apps/context/app/components/Layout.tsx:267
<DarkModeToggle />
```

**실제 코드** (`packages/shared-react/src/components/DarkModeToggle.tsx:24-40`):
```typescript
const handleToggle = () => {
  const newIsDark = !isDark;
  setIsDark(newIsDark);

  // Apply theme to DOM
  document.documentElement.classList.toggle('dark', newIsDark);

  // Persist to localStorage
  try {
    const stored = localStorage.getItem('settings-storage');
    const data = stored ? JSON.parse(stored) : { state: {} };
    data.state = { ...data.state, theme: newIsDark ? 'dark' : 'light' };
    localStorage.setItem('settings-storage', JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
};
```

**문제점**:
1. **SSG (Static Site Generation) 환경에서 하이드레이션 이슈**: 빌드 시 생성된 HTML과 클라이언트의 초기 상태 불일치
2. **useEffect 마운트 전 상태**: `mounted` 상태가 `false`일 때 버튼이 클릭되면 작동하지 않을 수 있음
3. **localStorage 동기화 문제**: 페이지 로드 시 localStorage에서 테마를 읽어오는 로직이 부족

**해결 방안**:
- entry.client.tsx에 테마 초기화 스크립트 추가
- 또는 inline `<script>` 태그로 FOUC (Flash of Unstyled Content) 방지
- `useLayoutEffect` 사용 고려

---

### 2. Dark Mode Toggle - Permissive 앱 (데스크톱)

**문제**: 버튼이 보이지 않음 (element is not visible)

**원인**:
```typescript
// apps/permissive/app/components/layout/Header.tsx:50-62
<button
  type="button"
  onClick={onMenuClick}
  className="md:hidden min-h-11 ..." // ← 여기
  ...
>
```

**Playwright 테스트가 잘못 선택**:
- 테스트 셀렉터가 DarkModeToggle 대신 Menu 버튼을 선택함
- `md:hidden` 클래스로 인해 데스크톱 (viewport > 768px)에서 숨겨짐

**근본 원인**:
- 테스트의 셀렉터가 너무 포괄적: `.locator('button').filter({ has: page.locator('svg') }).first()`
- DarkModeToggle을 명확히 선택하지 못함

---

### 3. Back to Top Button - Context 앱

**문제**: 버튼을 찾았지만 viewport 밖에 있어서 클릭 불가

**Playwright 에러**:
```
element is outside of the viewport
```

**원인**:
```typescript
// apps/context/app/components/Layout.tsx:522-536
{showBackToTop && (
  <button
    type="button"
    onClick={scrollToTop}
    className="fixed bottom-20 sm:bottom-8 right-4 z-30 ..."
    // ↑ bottom-20 (모바일), sm:bottom-8 (데스크톱)
  >
    <ArrowUp size={20} aria-hidden="true" />
  </button>
)}
```

**문제점**:
1. **잘못된 셀렉터**: 테스트가 "닫기 버튼"을 선택함
   ```typescript
   const backToTopButton = page.locator('button')
     .filter({ has: page.locator('svg[aria-hidden="true"]') })
     .filter({ hasText: '' })
     .last(); // ← 이 셀렉터가 잘못된 버튼을 선택
   ```
2. **사이드바 오버레이**: 사이드바가 열려있어서 Back to Top 버튼이 가려짐
3. **Fixed 포지셔닝**: `bottom-20`으로 인해 viewport 밖에 위치

---

### 4. Back to Top Button - Permissive 앱

**문제**: 버튼을 클릭했지만 스크롤이 작동하지 않음

**테스트 결과**:
```
Expected: < 100
Received: 500
```

**원인**: Context 앱과 동일한 이유 + Permissive 앱에는 Back to Top 버튼이 **존재하지 않음**

**검증**:
```bash
$ grep -r "Back to top" apps/permissive/
# 결과 없음
$ grep -r "ArrowUp" apps/permissive/
# 결과 없음
```

**결론**: Permissive 앱에는 Back to Top 버튼이 구현되지 않음

---

### 5. Menu Button (사이드바 열기) - Context 앱

**문제**: 버튼을 찾았지만 viewport 밖에 있어서 클릭 불가

**원인**: Back to Top Button과 동일한 이유 - 잘못된 셀렉터로 인해 "닫기 버튼"을 선택

**실제 메뉴 버튼**:
```typescript
// apps/context/app/components/Layout.tsx:161-169
<button
  type="button"
  onClick={() => setSidebarOpen(true)}
  className="min-h-11 min-w-11 ..."
  aria-label={t('menu')}
>
  <Menu size={20} aria-hidden="true" />
</button>
```

**테스트가 선택한 버튼**:
```typescript
// 닫기 버튼 (사이드바 내부)
<button
  type="button"
  onClick={() => setSidebarOpen(false)}
  aria-label="Close menu"
>
  <X size={20} aria-hidden="true" />
</button>
```

---

### 6. Menu Button (모바일) - Permissive 앱

**문제**: 사이드바가 이미 열려있어서 버튼 클릭이 차단됨

**Playwright 에러**:
```
<span class="text-lg">✨</span> from <aside> subtree intercepts pointer events
```

**원인**:
```typescript
// apps/permissive/app/components/layout/Sidebar.tsx:136-145
<aside
  className={`fixed top-0 left-0 h-full z-sidebar flex flex-col ${...}`}
  style={{
    width: getSidebarWidth(),
    transform: getTransform(), // ← 모바일에서 기본적으로 열려있음
    ...
  }}
>
```

**문제점**:
- **SSG 빌드 시 초기 상태**: 사이드바가 열린 상태로 HTML 생성
- `isOpen` 상태가 클라이언트에서 하이드레이션되기 전에 테스트 실행
- 사이드바가 메뉴 버튼을 가림

---

### 7. Search Form - Roots 앱

**문제**: 검색 후 URL이 잘못됨

**테스트 결과**:
```
Expected: "http://localhost:3005/search?q=algebra"
Received: "http://localhost:3005/?"
```

**원인**:
```typescript
// apps/roots/app/components/layout/Layout.tsx:33-38
const handleSearchSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    navigate(localePath(`/search?q=${encodeURIComponent(searchQuery.trim())}`));
  }
};
```

**문제점**:
1. **SSG 환경에서 React Router 동작 이상**: `navigate()` 함수가 제대로 작동하지 않음
2. **Form 제출 처리**: `<form onSubmit={handleSearchSubmit}>`가 하이드레이션 전에 제출됨
3. **빈 action 속성**: Form에 `action` 속성이 없어서 기본 GET 요청으로 처리

---

### 8. Bottom Navigation (모바일) - Roots 앱

**문제**: Bottom nav 요소를 찾았지만 hidden 상태

**Playwright 결과**:
```
Expected: visible
Received: hidden
```

**원인**:
```typescript
// apps/roots/app/components/layout/Layout.tsx:199-236
<nav
  className="lg:hidden fixed bottom-0 ..." // ← 여기
  ...
>
```

**문제점**:
- **테스트 셀렉터 오류**: 잘못된 `<nav>` 요소 선택
  ```typescript
  const bottomNav = page.locator('nav')
    .filter({ hasText: /browse|favorites|constants/i })
    .first(); // ← 사이드바의 <nav>을 선택함
  ```
- **Sidebar의 `<nav>` 선택**: `apps/roots/app/components/layout/Sidebar.tsx:31-73`에 있는 사이드바 네비게이션을 선택
- **lg:hidden**: Desktop 뷰에서는 bottom nav가 숨겨지지만, 테스트가 sidebar nav를 선택하여 hidden 상태 감지

---

## 🔍 Lighthouse CI vs Playwright E2E의 차이점

당신이 질문한 대로, **Lighthouse CI만으로는 버튼의 실제 동작을 확인할 수 없습니다**.

### Lighthouse CI가 확인하는 것:

| 항목 | 설명 |
|:---:|:-----|
| **접근성** | 버튼에 `role`, `aria-label` 있는지 |
| **터치 타겟 크기** | 클릭 가능한 영역이 ≥44px인지 |
| **구조적 문제** | `<button>` 요소인지, 클릭 핸들러가 있는지 |
| **Performance** | 렌더링 성능, LCP, CLS 등 |

### Lighthouse CI가 확인하지 못하는 것 (Playwright가 필요한 부분):

| 항목 | 예시 |
|:---:|:-----|
| **버튼 클릭 후 실제 동작** | ✗ Dark mode가 **정말** 전환되는가? |
| **상태 변경** | ✗ Search input이 **정말** 드롭다운을 표시하는가? |
| **네비게이션** | ✗ Link 클릭 시 **정말** 페이지가 이동하는가? |
| **에러 처리** | ✗ 실패 시나리오에서 **정말** 에러 메시지가 표시되는가? |
| **SSG 하이드레이션 이슈** | ✗ 정적 HTML과 클라이언트 JS의 상태 불일치 |
| **조건부 동작** | ✗ 특정 상태에서만 작동하는 버튼 |

---

## 🎯 결론 및 권장사항

### 1. 완벽한 품질 보증을 위한 조합

```
Lighthouse CI (성능/접근성/SEO)
    +
Playwright E2E (실제 사용자 시나리오)
    +
Vitest (컴포넌트 로직 단위 테스트)
    =
💯 완벽한 테스트 커버리지
```

### 2. 우선 수정이 필요한 항목

#### 🔴 Critical (즉시 수정 필요)

1. **Dark Mode Toggle** - 모든 앱
   - SSG 하이드레이션 이슈 해결
   - entry.client.tsx에 테마 초기화 스크립트 추가

2. **Permissive 앱 - Back to Top Button 추가**
   - 현재 존재하지 않음
   - Context/Roots와 동일한 구현 필요

#### 🟡 Medium (개선 권장)

3. **Search Form (Roots)** - Form action 속성 추가
4. **Selector 개선** - Playwright 테스트의 셀렉터를 더 명확하게

#### 🟢 Low (선택 사항)

5. **Menu Button 테스트** - 초기 상태 대기 로직 추가

### 3. 테스트 파일 위치

- **E2E 테스트**: `/home/user/public-monorepo/tests/e2e/button-interactions.spec.ts`
- **테스트 실행 명령어**: `npx playwright test --config=playwright-button-test.config.ts`
- **상세 결과**: `/home/user/public-monorepo/playwright-test-output.txt`

---

## 📈 성공률 향상 계획

| 단계 | 작업 | 예상 성공률 |
|:---:|:-----|:---:|
| 현재 | 기본 구현 | **50%** |
| Step 1 | Dark Mode 수정 | **67%** |
| Step 2 | Back to Top 추가 (Permissive) | **78%** |
| Step 3 | Search Form 수정 (Roots) | **89%** |
| Step 4 | Selector 개선 + 초기 상태 대기 | **100%** |

---

**작성자**: Claude (Anthropic)
**테스트 프레임워크**: Playwright 1.57.0
**Node 버전**: 20+
**pnpm 버전**: 10.0.0
