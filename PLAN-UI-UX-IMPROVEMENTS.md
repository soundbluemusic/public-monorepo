# UI/UX 대규모 개선 계획 (Radical Overhaul Plan)

> **철학**: "가장 좋은 부품은 없는 부품이다." — 불필요한 것을 제거하고, 남은 것을 극한까지 빠르고 직관적으로 만든다.

---

## 목차

1. [핵심 원칙](#1-핵심-원칙)
2. [Phase 1: 속도 혁명 (Performance)](#2-phase-1-속도-혁명)
3. [Phase 2: 네비게이션 단순화 (Navigation)](#3-phase-2-네비게이션-단순화)
4. [Phase 3: 검색 경험 혁신 (Search)](#4-phase-3-검색-경험-혁신)
5. [Phase 4: 콘텐츠 가독성 극대화 (Typography & Readability)](#5-phase-4-콘텐츠-가독성-극대화)
6. [Phase 5: 인터랙션 & 마이크로 애니메이션 (Interaction)](#6-phase-5-인터랙션--마이크로-애니메이션)
7. [Phase 6: 모바일 퍼스트 재설계 (Mobile)](#7-phase-6-모바일-퍼스트-재설계)
8. [Phase 7: 접근성 & 국제화 강화 (A11y & i18n)](#8-phase-7-접근성--국제화-강화)
9. [Phase 8: 통합 디자인 시스템 (Design System)](#9-phase-8-통합-디자인-시스템)
10. [앱별 특화 개선](#10-앱별-특화-개선)
11. [우선순위 & 실행 로드맵](#11-우선순위--실행-로드맵)

---

## 1. 핵심 원칙

| 원칙 | 설명 |
|------|------|
| **속도가 기능이다** | 100ms 이내 반응, 체감 로딩 0에 수렴 |
| **제거가 최고의 디자인** | 쓰이지 않는 UI 요소 삭제, 인지 부하 최소화 |
| **한 손 사용 가능** | 모바일에서 엄지 하나로 모든 핵심 기능 접근 |
| **데이터가 결정한다** | 클릭률, 이탈률 기반으로 UI 배치 최적화 |
| **일관성 > 개성** | 3개 앱이 하나의 플랫폼처럼 느껴져야 함 |

---

## 2. Phase 1: 속도 혁명

> **목표**: First Contentful Paint < 0.8s, Time to Interactive < 1.2s

### 2.1 Framer Motion 제거 → CSS 애니메이션 전환

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 애니메이션 라이브러리 | Framer Motion (LazyMotion, 4.6KB+) | 순수 CSS (`@keyframes` + `@starting-style`) | JS 번들 4.6KB+ 감소, 메인 스레드 부하 제거 |
| 모션 래퍼 컴포넌트 | `<FadeIn>`, `<SlideUp>` 등 11개 래퍼 | CSS utility 클래스 (`animate-fade-in`, `animate-slide-up`) | 컴포넌트 트리 단순화, hydration 비용 감소 |
| 페이지 전환 | Framer `AnimatePresence` | View Transitions API (이미 부분 구현) | 네이티브 브라우저 성능, 0 JS 비용 |

**구현 방법:**

```css
/* packages/ui/src/styles/animations.css */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Tailwind v4 utility 등록 */
@utility animate-fade-in {
  animation: fade-in 0.2s ease-out both;
}

@utility animate-slide-up {
  animation: slide-up 0.25s ease-out both;
}

@utility animate-scale-in {
  animation: scale-in 0.2s ease-out both;
}

/* Stagger: CSS custom property 활용 */
@utility stagger-item {
  animation-delay: calc(var(--stagger-index, 0) * 50ms);
}
```

**영향 범위:**
- `packages/ui/src/animation/motion.tsx` → 삭제 후 CSS 대체
- 모든 앱의 `__root.tsx`에서 `MotionProvider` 제거
- `packages/ui/package.json`에서 `framer-motion` 의존성 제거

### 2.2 이미지 & 폰트 최적화

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 폰트 로딩 | 블로킹 로딩 | `font-display: swap` + `preload` | FOIT 제거, LCP 개선 |
| 이미지 포맷 | PNG/JPG 혼합 | WebP/AVIF 우선 (`<picture>`) | 40-60% 용량 감소 |
| 아이콘 | SVG 인라인 (개별 import) | SVG 스프라이트 시트 | 네트워크 요청 감소 |

### 2.3 Critical CSS 인라인 강화

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| Critical CSS | 부분 인라인 (FOUC 방지용) | Above-the-fold 전체 인라인 | FCP 0.3s 단축 |
| 비핵심 CSS | 동기 로드 | `<link rel="preload" as="style">` 비동기 | 렌더 블로킹 제거 |

---

## 3. Phase 2: 네비게이션 단순화

> **목표**: 어떤 페이지에서든 2클릭 이내에 원하는 콘텐츠 도달

### 3.1 사이드바 제거 → 커맨드 팔레트 전환

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 데스크톱 네비게이션 | 사이드바 (288px, 접힘 56px) | 깔끔한 상단 헤더 + `Cmd+K` 커맨드 팔레트 | 콘텐츠 영역 288px 확보, 인지 부하 감소 |
| 모바일 네비게이션 | 햄버거 메뉴 + 바텀 네비 | 바텀 네비만 유지 (5탭 최적화) | 햄버거 메뉴 탭 한번 제거, 즉시 접근 |
| 카테고리 탐색 | 사이드바 트리 | 검색/커맨드 팔레트 + 메인 페이지 그리드 | 발견성 향상, 검색 의존도 증가 |

**커맨드 팔레트 설계:**

```
┌─────────────────────────────────────────────┐
│  🔍 검색하거나 명령어 입력...         ⌘K    │
├─────────────────────────────────────────────┤
│  최근 본 항목                               │
│  ├─ 📖 안녕 (인사)                          │
│  ├─ 📖 감사합니다 (인사)                     │
│  └─ 📖 사랑 (감정)                          │
│                                             │
│  빠른 이동                                  │
│  ├─ 📂 카테고리                             │
│  ├─ ⚙️ 설정                                │
│  └─ 📊 학습 진행률                          │
│                                             │
│  액션                                       │
│  ├─ 🌙 다크모드 전환                        │
│  ├─ 🌐 언어 변경                            │
│  └─ 📥 오프라인 다운로드                     │
└─────────────────────────────────────────────┘
```

**핵심 기능:**
- 검색 + 네비게이션 + 설정을 하나의 인터페이스에 통합
- 퍼지 매칭 (오타 허용)
- 최근 본 항목 자동 표시
- 키보드 네비게이션 완벽 지원

### 3.2 헤더 슬림화

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 헤더 높이 | 56px 고정 | 48px (스크롤 시 40px으로 축소) | 콘텐츠 공간 확보 |
| 헤더 요소 | 로고 + 검색 + 네비 + 토글 3개 | 로고 + 검색바 + 다크모드 | 시각적 소음 제거 |
| 스크롤 동작 | 항상 고정 | 아래 스크롤: 숨김, 위 스크롤: 표시 | 모바일 콘텐츠 영역 최대화 |

**스크롤 반응 헤더:**

```css
/* 스크롤 방향 기반 헤더 표시/숨김 */
.header {
  position: sticky;
  top: 0;
  transition: transform 0.2s ease;
}

.header--hidden {
  transform: translateY(-100%);
}
```

### 3.3 바텀 네비게이션 최적화

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 탭 수 | 5개 | 4개 (홈, 검색, 즐겨찾기, 더보기) | 탭 터치 영역 확대 |
| 활성 표시 | 색상 변경만 | 색상 + 도트 인디케이터 + 미세 확대 | 현재 위치 명확성 |
| 검색 탭 | 별도 페이지 이동 | 바텀 시트 형태로 즉시 열림 | 컨텍스트 전환 제거 |

---

## 4. Phase 3: 검색 경험 혁신

> **목표**: 사용자의 의도를 예측하고, 입력 전에 답을 제시

### 4.1 검색 UI 전면 재설계

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 검색 위치 | 헤더 고정 입력 필드 | 커맨드 팔레트 (전체 화면 오버레이) | 몰입감 증가, 결과 표시 공간 확대 |
| 결과 미리보기 | 제목만 표시 | 제목 + 한줄 설명 + 카테고리 태그 | 클릭 전 판단 가능 |
| 빈 상태 | 빈 드롭다운 | 인기 검색어 + 최근 검색 + 추천 카테고리 | 탐색 시작점 제공 |
| 검색 속도 | MiniSearch 클라이언트 | MiniSearch + 서버 하이브리드 (D1 FTS) | 대규모 데이터 정확도 향상 |

### 4.2 즉시 검색 (Instant Search)

```
입력: "안ㄴ"
         ↓ (50ms debounce)
결과: ┌──────────────────────────────────┐
      │ 📖 안녕 — 인사, Greeting        │ ← 하이라이트
      │ 📖 안녕하세요 — 인사             │
      │ 📖 안녕히 가세요 — 이별          │
      │ 📖 안내 — 정보                  │
      │                                │
      │ 📂 카테고리: 인사 (32개)          │ ← 카테고리 매칭
      └──────────────────────────────────┘
```

**기능:**
- **50ms debounce** (현재 대비 단축)
- **한글 자모 검색** (ㄱ, ㄴ, ㅎ로 시작하는 단어 매칭)
- **영어↔한글 교차 검색** ("hello" → 안녕)
- **카테고리 매칭** (검색어가 카테고리명과 일치 시 카테고리 결과도 표시)
- **검색 결과 그룹핑** (단어 | 카테고리 | 대화 구분)

### 4.3 검색 결과 페이지 개선

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 레이아웃 | 단순 리스트 | 카드 그리드 + 필터 사이드바 | 시각적 스캔 용이 |
| 필터링 | 없음 | 카테고리, 난이도, 품사 필터 | 정밀 탐색 |
| 정렬 | 관련도순 고정 | 관련도 / 가나다순 / 최근본순 | 사용자 선택권 |
| 무한 스크롤 | 페이지네이션 | 가상 스크롤 (VirtualList) | 매끄러운 탐색 |

---

## 5. Phase 4: 콘텐츠 가독성 극대화

> **목표**: 콘텐츠에 시선이 자연스럽게 흐르는 타이포그래피 시스템

### 5.1 타이포그래피 스케일 통일

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 폰트 스케일 | 앱별 개별 설정 | 통일된 모듈러 스케일 (1.25 ratio) | 시각적 위계 일관성 |
| 본문 크기 | 16px 고정 | 18px (데스크톱), 16px (모바일) | 가독성 향상 |
| 줄 높이 | 1.5 고정 | 1.6 (본문), 1.3 (제목) | 한글 가독성 최적화 |
| 최대 너비 | `max-w-3xl` (672px) | `max-w-2xl` (576px) 본문, 넓은 카드 영역 별도 | 읽기 최적 줄 길이 |

**타이포그래피 스케일:**

```css
/* packages/ui/src/styles/typography.css */
:root {
  --text-xs: 0.75rem;    /* 12px - 캡션 */
  --text-sm: 0.875rem;   /* 14px - 보조 텍스트 */
  --text-base: 1rem;     /* 16px - 모바일 본문 */
  --text-lg: 1.125rem;   /* 18px - 데스크톱 본문 */
  --text-xl: 1.25rem;    /* 20px - 소제목 */
  --text-2xl: 1.563rem;  /* 25px - 섹션 제목 */
  --text-3xl: 1.953rem;  /* 31px - 페이지 제목 */
  --text-4xl: 2.441rem;  /* 39px - 히어로 */
}
```

### 5.2 한글 최적화 타이포그래피

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 한글 줄바꿈 | 기본 (단어 중간 끊김) | `word-break: keep-all` 전역 적용 | 자연스러운 줄바꿈 |
| 자간 | 기본 | 한글 -0.02em, 영문 기본 | 한글 밀도감 개선 |
| 문단 간격 | 일관성 없음 | `1.5em` 통일 | 시각적 리듬 |

### 5.3 콘텐츠 카드 재설계

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 카드 스타일 | 그림자 + 둥근 모서리 | 미니멀 보더 + 호버 시 미묘한 엘리베이션 | 현대적 느낌, 콘텐츠 집중 |
| 카드 간격 | `gap-4` | `gap-6` (데스크톱), `gap-4` (모바일) | 여백으로 계층 표현 |
| 정보 밀도 | 중간 | 핵심 정보만 표시, 상세는 호버/클릭 | 스캐너빌리티 향상 |

---

## 6. Phase 5: 인터랙션 & 마이크로 애니메이션

> **목표**: 매 터치, 매 클릭에 즉각적이고 의미 있는 피드백

### 6.1 터치 피드백 강화

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 버튼 피드백 | `active:scale-[0.98]` | `active:scale-[0.97]` + 배경색 미세 변화 | 더 확실한 터치 피드백 |
| 카드 호버 | `-translate-y-0.5` + shadow | `scale(1.01)` + 보더 색상 변화 + 미묘한 그림자 | 부드럽고 자연스러운 반응 |
| 링크 피드백 | 밑줄 변경 | 밑줄 + 색상 전환 (0.15s) | 인터랙티브 요소 명확성 |

### 6.2 페이지 전환 애니메이션

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 전환 방식 | Framer AnimatePresence | View Transitions API 전면 활용 | 0 JS 비용, 네이티브 성능 |
| 전환 효과 | 슬라이드 좌/우 | 크로스페이드 (150ms) + 공유 요소 전환 | 매끄러운 연속성 |
| 카드→상세 | 새 페이지 로드 | 공유 요소 전환 (카드 → 상세 헤더) | 공간적 맥락 유지 |

**View Transitions API 활용:**

```css
/* 카드 → 상세 페이지 공유 요소 전환 */
.entry-card {
  view-transition-name: entry-card;
}

.entry-detail-header {
  view-transition-name: entry-card;
}

::view-transition-old(entry-card) {
  animation: 250ms ease-out both fade-out-scale;
}

::view-transition-new(entry-card) {
  animation: 250ms ease-out both fade-in-scale;
}
```

### 6.3 스켈레톤 로딩 개선

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 스켈레톤 형태 | 단순 회색 박스 | 실제 콘텐츠 레이아웃 미러링 | 로딩 중에도 구조 예측 가능 |
| 애니메이션 | 단순 펄스 | 시머(shimmer) 웨이브 효과 | 로딩 중인 느낌 강화 |
| 전환 | 즉시 교체 | 페이드 인 (150ms) | 갑작스러운 전환 방지 |

---

## 7. Phase 6: 모바일 퍼스트 재설계

> **목표**: 모바일이 기본, 데스크톱은 확장

### 7.1 제스처 기반 네비게이션

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 뒤로 가기 | 브라우저 기본 | 우측 스와이프 → 이전 페이지 | 네이티브 앱 느낌 |
| 카테고리 전환 | 탭 클릭 | 좌/우 스와이프로 카테고리 전환 | 빠른 탐색 |
| 풀 투 리프레시 | 없음 | 아래로 당김 → 데이터 갱신 | 앱 관행 |

### 7.2 바텀 시트 패턴

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 검색 | 별도 페이지 | 바텀 시트 (반만 올라옴 → 풀스크린) | 컨텍스트 유지 |
| 설정 | 별도 페이지 | 바텀 시트 | 빠른 접근 |
| 필터 | 없음 | 바텀 시트 필터 패널 | 모바일 친화적 필터 |

**바텀 시트 구현:**

```
┌─────────────────────────────┐
│                             │
│     (현재 페이지 콘텐츠)      │  ← 어둡게 처리 (0.3 opacity)
│                             │
├─────────────────────────────┤  ← 드래그 핸들
│  ━━━━━                      │
│                             │
│  🔍 검색하세요...            │
│                             │
│  최근 검색                   │
│  안녕  감사합니다  사랑       │
│                             │
│  인기 카테고리               │
│  📁 인사  📁 감정  📁 음식   │
│                             │
└─────────────────────────────┘
```

### 7.3 터치 타겟 최적화

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 최소 터치 영역 | 혼재 (일부 32px) | 전체 48x48px 이상 (WCAG 2.2) | 오탭 방지 |
| 탭 간격 | 일부 좁음 | 최소 8px 간격 | 실수 방지 |
| 링크 영역 | 텍스트만 | 카드 전체 클릭 가능 | 터치 용이성 |

### 7.4 키보드 & 입력 최적화

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 검색 키보드 | 기본 | `inputmode="search"` + 엔터키 "검색" | UX 일관성 |
| 자동 포커스 | 검색 페이지에서만 | 모바일 검색 열 때 자동 포커스 + 키보드 | 탭 하나 절약 |

---

## 8. Phase 7: 접근성 & 국제화 강화

> **목표**: 모든 사용자가 동등하게 사용 가능

### 8.1 접근성 개선

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| Focus 표시 | 기본 outline | 커스텀 포커스 링 (2px solid, 2px offset) | 키보드 사용자 가시성 |
| 스크린 리더 | 기본 ARIA | 라이브 리전 (검색 결과 수 알림) | 동적 콘텐츠 인지 |
| 색상 대비 | AA 준수 | AAA 목표 (7:1 이상) | 저시력 사용자 |
| 모션 감소 | `prefers-reduced-motion` 기본 | 모든 애니메이션에 일관 적용 + 사용자 설정 | 전정 장애 사용자 |

**포커스 링 디자인:**

```css
/* 통일된 포커스 스타일 */
:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* 다크모드에서 더 밝은 포커스 */
.dark :focus-visible {
  outline-color: var(--accent-light);
}
```

### 8.2 국제화 UX 개선

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 언어 전환 | 헤더 토글 (EN/KR) | 커맨드 팔레트에서도 가능 + URL 자동 매핑 | 접근성 향상 |
| RTL 준비 | 없음 | CSS logical properties 전환 (`margin-inline-start`) | 아랍어/히브리어 대비 |
| 날짜/숫자 | 고정 포맷 | `Intl.DateTimeFormat`, `Intl.NumberFormat` | 로케일 맞춤 |

---

## 9. Phase 8: 통합 디자인 시스템

> **목표**: 3개 앱이 하나의 플랫폼처럼 작동

### 9.1 통합 컬러 시스템

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 앱별 색상 | 앱별 개별 `--accent-primary` | 공통 팔레트 + 앱별 accent color만 변경 | 브랜드 통일감 |
| 시맨틱 컬러 | CSS 변수 있지만 불완전 | 완전한 시맨틱 토큰 체계 | 테마 확장성 |
| 상태 색상 | 앱별 다름 | 통일 (success, warning, error, info) | 일관된 피드백 |

**시맨틱 컬러 토큰:**

```css
:root {
  /* Surface */
  --surface-primary: #ffffff;
  --surface-secondary: #f8f9fa;
  --surface-elevated: #ffffff;

  /* Text */
  --text-primary: #1a1a2e;
  --text-secondary: #4a4a6a;
  --text-tertiary: #8a8aa0;
  --text-inverse: #ffffff;

  /* Border */
  --border-default: #e2e2e8;
  --border-strong: #c8c8d4;

  /* Interactive */
  --interactive-primary: var(--accent-primary);
  --interactive-hover: var(--accent-hover);
  --interactive-pressed: var(--accent-pressed);

  /* Feedback */
  --feedback-success: #22c55e;
  --feedback-warning: #f59e0b;
  --feedback-error: #ef4444;
  --feedback-info: #3b82f6;

  /* App-specific accent (이것만 앱별로 다름) */
  /* Context: --accent-primary: #6b4de6 (보라) */
  /* Roots: --accent-primary: #2563eb (파랑) */
  /* Permissive: --accent-primary: #059669 (초록) */
}
```

### 9.2 간격 시스템 통일

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

### 9.3 컴포넌트 리팩토링

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| Button variants | 7개 (default, destructive 등) | 4개 (primary, secondary, ghost, danger) | 선택지 감소 = 빠른 의사결정 |
| Button sizes | 7개 (sm~icon-lg) | 4개 (sm, md, lg, icon) | 단순화 |
| 카드 컴포넌트 | 앱별 개별 구현 | 통합 `Card` 컴포넌트 (header, body, footer 슬롯) | 재사용성 극대화 |
| 리스트 아이템 | 앱별 개별 구현 | 통합 `ListItem` (prefix, content, suffix 슬롯) | 일관성 |

---

## 10. 앱별 특화 개선

### 10.1 Context (한국어 사전)

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 단어 카드 | 기본 카드 레이아웃 | 플래시카드 모드 (탭하면 뒤집힘: 한글↔영어) | 학습 효과 증가 |
| 발음 가이드 | 텍스트만 | 발음 기호 + 오디오 파형 시각화 | 학습 몰입도 |
| 학습 진도 | ProgressBar | 히트맵 (GitHub 잔디처럼) + 연속 학습일 | 동기부여 |
| 예문 표시 | 단순 텍스트 | 한글/영어 하이라이트 + 단어별 탭 가능 | 문맥 학습 |
| 관련 단어 | 기본 리스트 | 시각적 연결 그래프 (미니 마인드맵) | 어휘 네트워크 인지 |

**플래시카드 모드 설계:**

```
┌─────────────────────────────┐
│                             │
│         안녕                │  ← 큰 한글 (3xl)
│         [annyeong]          │  ← 로마자
│                             │
│    ────────────────         │
│                             │
│    🔊 발음 듣기              │
│    📚 예문 보기              │
│    ❤️ 즐겨찾기               │
│                             │
│  ← 이전    [1/32]    다음 → │  ← 스와이프로도 이동
└─────────────────────────────┘
       ↓ (탭하면 뒤집힘)
┌─────────────────────────────┐
│                             │
│         Hello               │  ← 영어 뜻
│         Greeting            │  ← 카테고리
│                             │
│    ────────────────         │
│    Used to greet someone    │  ← 설명
│    informally.              │
│                             │
│    📝 나의 메모 추가          │
│                             │
│  ← 이전    [1/32]    다음 → │
└─────────────────────────────┘
```

### 10.2 Roots (수학 문서)

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 수식 표시 | 기본 | KaTeX 인라인 렌더링 + 수식 복사 버튼 | 수학 콘텐츠 가독성 |
| 개념 관계 | 리스트 | 인터랙티브 개념 맵 (선행 개념 → 현재 → 후속) | 학습 경로 시각화 |
| 예제 | 정적 텍스트 | 단계별 풀이 (접기/펼치기) | 자기주도 학습 |
| 필드 탐색 | 카테고리 그리드 | 트리맵 시각화 (크기 = 개념 수) | 전체 구조 파악 |

**개념 맵 시각화:**

```
  [기본 산술] ──→ [분수] ──→ [소수]
       │              │
       ▼              ▼
  [방정식] ──→ [부등식]
       │
       ▼
  [함수] ──→ [미적분]     ← 현재 보고 있는 개념
```

### 10.3 Permissive (웹개발 자료)

| 항목 | 전 (Before) | 후 (After) | 효과 (Effect) |
|------|-------------|-----------|---------------|
| 라이브러리 카드 | 기본 정보 | GitHub 스타/라이선스/최근 업데이트 시각화 | 의사결정 지원 |
| 비교 기능 | 없음 | 2-3개 라이브러리 나란히 비교 테이블 | 선택 도움 |
| 코드 예시 | 텍스트 | 구문 하이라이팅 + 복사 버튼 + 라이브 데모 링크 | 실용성 |
| 태그 시스템 | TagBadge 기본 | 필터링 가능한 인터랙티브 태그 | 탐색 효율 |

---

## 11. 우선순위 & 실행 로드맵

### 임팩트 vs 난이도 매트릭스

```
높은 임팩트 │  ⭐ 커맨드 팔레트    ⭐ Framer Motion 제거
           │  ⭐ 검색 UX 개선      ⭐ 모바일 바텀시트
           │  ⭐ 타이포그래피 통일
           │
           │  △ 플래시카드 모드    △ 제스처 네비게이션
           │  △ 개념 맵 시각화     △ 라이브러리 비교
           │
낮은 임팩트 │  ○ RTL 준비          ○ 바텀네비 최적화
           │  ○ SVG 스프라이트     ○ 히트맵 진도
           └──────────────────────────────────
              낮은 난이도           높은 난이도
```

### 실행 순서

| Phase | 기간 | 핵심 작업 | 예상 효과 |
|-------|------|---------|----------|
| **Phase 1** | 1주 | Framer Motion 제거 → CSS, 폰트/이미지 최적화 | 번들 사이즈 감소, FCP 개선 |
| **Phase 2** | 1주 | 사이드바 제거, 커맨드 팔레트 구축, 헤더 슬림화 | 콘텐츠 영역 확대, UX 단순화 |
| **Phase 3** | 1주 | 검색 전면 재설계, 즉시 검색, 결과 미리보기 | 검색 전환율 향상 |
| **Phase 4** | 3일 | 타이포그래피 스케일, 한글 최적화, 카드 재설계 | 가독성 향상 |
| **Phase 5** | 3일 | View Transitions, 스켈레톤 개선, 터치 피드백 | 체감 품질 향상 |
| **Phase 6** | 1주 | 바텀 시트, 제스처 네비, 터치 타겟 최적화 | 모바일 경험 혁신 |
| **Phase 7** | 3일 | 포커스 링, ARIA 라이브리전, 색상 대비 | 접근성 AAA |
| **Phase 8** | 1주 | 통합 컬러/간격 시스템, 컴포넌트 리팩토링 | 일관성, 유지보수성 |
| **앱 특화** | 2주 | 플래시카드, 개념맵, 비교 기능 | 각 앱 핵심 경쟁력 |

### KPI 목표

| 지표 | 현재 추정 | 목표 | 측정 방법 |
|------|----------|------|----------|
| **FCP** | ~1.2s | < 0.8s | Lighthouse |
| **TTI** | ~1.8s | < 1.2s | Lighthouse |
| **JS 번들** | Framer Motion 포함 | -15KB+ | 빌드 분석 |
| **모바일 터치 정확도** | 일부 작은 타겟 | 100% ≥ 48px | 수동 검증 |
| **접근성 점수** | ~90 | 100 | Lighthouse |
| **검색 반응시간** | ~200ms | < 100ms | 성능 측정 |
| **핵심 기능 도달** | 3+ 클릭 | ≤ 2 클릭 | UX 분석 |

---

## 변경 파일 영향 분석

| 파일/패키지 | 변경 유형 | Phase |
|------------|---------|-------|
| `packages/ui/src/animation/motion.tsx` | **삭제** (CSS 대체) | 1 |
| `packages/ui/src/styles/base.css` | 수정 (애니메이션, 타이포) | 1, 4 |
| `packages/ui/src/styles/animations.css` | **신규** | 1 |
| `packages/ui/src/styles/typography.css` | **신규** | 4 |
| `packages/ui/src/components/CommandPalette.tsx` | **신규** | 2 |
| `packages/ui/src/components/BottomSheet.tsx` | **신규** | 6 |
| `packages/ui/src/components/Button.tsx` | 수정 (variants 정리) | 8 |
| `packages/ui/src/components/Card.tsx` | **신규** (통합 카드) | 8 |
| `apps/*/app/routes/__root.tsx` | 수정 (MotionProvider 제거) | 1 |
| `apps/*/app/components/layout/Header.tsx` | 수정 (슬림화) | 2 |
| `apps/*/app/components/layout/Layout.tsx` | 수정 (사이드바 제거) | 2 |
| `apps/*/app/components/navigation/Sidebar.tsx` | **삭제** | 2 |
| `apps/*/app/styles/global.css` | 수정 (컬러 토큰, 타이포) | 4, 8 |
| `apps/context/app/components/FlashCard.tsx` | **신규** | 앱 특화 |
| `apps/roots/app/components/ConceptMap.tsx` | **신규** | 앱 특화 |
| `apps/permissive/app/components/CompareTable.tsx` | **신규** | 앱 특화 |

---

> **"완벽은 더 이상 추가할 것이 없을 때가 아니라, 더 이상 제거할 것이 없을 때 달성된다."**
> — Antoine de Saint-Exupéry
