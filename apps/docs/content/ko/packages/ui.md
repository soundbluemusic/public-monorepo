---
title: "@soundblue/ui"
description: React UI 컴포넌트, 애니메이션, 디자인 프리미티브 - Layer 3 UI 패키지
sidebar:
  order: 11
---

# @soundblue/ui

**Layer 3 (UI)** — 공유 React 컴포넌트, 애니메이션, UI 프리미티브.

## 개요

이 패키지는 React, Tailwind CSS, Framer Motion으로 구축된 재사용 가능한 UI 컴포넌트를 제공합니다. 프리미티브, 패턴, 앱별 컴포넌트가 포함되어 있습니다.

| 속성 | 값 |
|------|------|
| 레이어 | 3 (UI) |
| 의존성 | framer-motion, lucide-react, @tanstack/react-virtual, cva |
| React 필요 | 예 |
| Storybook | 사용 가능 (`pnpm storybook`) |

## 설치

```json
{
  "dependencies": {
    "@soundblue/ui": "workspace:*"
  }
}
```

## 내보내기

### `/components`

앱 레벨 공유 컴포넌트.

```typescript
import {
  DarkModeToggle,
  LanguageToggle,
  FamilySites,
  SearchBar,
  BackToTop
} from '@soundblue/ui/components';

// 시스템 감지 포함 다크 모드 토글
<DarkModeToggle />

// 언어 전환기 (EN/KO)
<LanguageToggle locale={locale} onSwitch={switchLocale} />

// 사이트 간 네비게이션
<FamilySites currentAppId="context" variant="footer" locale="en" />

// 제안이 포함된 검색 바
<SearchBar
  placeholder="검색..."
  onSearch={handleSearch}
  suggestions={suggestions}
/>

// 맨 위로 버튼 (스크롤 시 표시)
<BackToTop threshold={400} />
```

### `/primitives`

기본 UI 빌딩 블록.

```typescript
import {
  Button,
  Input,
  Badge,
  Skeleton,
  ProgressBar,
  Spinner
} from '@soundblue/ui/primitives';

// 변형이 있는 버튼
<Button variant="primary" size="lg">클릭하세요</Button>
<Button variant="ghost" size="sm">취소</Button>

// 아이콘이 있는 입력
<Input
  type="search"
  placeholder="검색..."
  icon={<SearchIcon />}
/>

// 뱃지
<Badge variant="success">신규</Badge>
<Badge variant="warning">베타</Badge>

// 로딩 상태
<Skeleton width={200} height={20} />
<ProgressBar value={75} max={100} />
<Spinner size="md" />
```

#### 버튼 변형

| 변형 | 설명 |
|---------|-------------|
| `primary` | 단색 배경, 메인 CTA |
| `secondary` | 아웃라인, 보조 액션 |
| `ghost` | 배경 없음, 3차 액션 |
| `danger` | 빨간색, 파괴적 액션 |

### `/patterns`

복잡한 UI 패턴.

```typescript
import {
  SearchDropdown,
  VirtualList,
  Tabs,
  Accordion,
  Modal
} from '@soundblue/ui/patterns';

// 드롭다운 결과가 있는 검색
<SearchDropdown
  query={query}
  results={results}
  onSelect={handleSelect}
  renderItem={(item) => <EntryPreview entry={item} />}
/>

// 대용량 데이터셋용 가상화 리스트
<VirtualList
  items={entries}
  itemHeight={64}
  renderItem={(entry) => <EntryRow entry={entry} />}
/>

// 탭
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">탭 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">탭 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">콘텐츠 1</Tabs.Content>
  <Tabs.Content value="tab2">콘텐츠 2</Tabs.Content>
</Tabs>

// 아코디언
<Accordion type="single" collapsible>
  <Accordion.Item value="item1">
    <Accordion.Trigger>섹션 1</Accordion.Trigger>
    <Accordion.Content>콘텐츠 1</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### `/feedback`

사용자 피드백 컴포넌트.

```typescript
import {
  ToastContainer,
  ErrorBoundary,
  EmptyState,
  LoadingOverlay
} from '@soundblue/ui/feedback';

// 토스트 알림 (@soundblue/features/toast와 함께 사용)
<ToastContainer position="bottom-right" />

// 폴백이 있는 에러 경계
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>

// 빈 상태
<EmptyState
  icon={<SearchIcon />}
  title="결과를 찾을 수 없습니다"
  description="검색어를 조정해 보세요"
  action={<Button>필터 초기화</Button>}
/>

// 로딩 오버레이
<LoadingOverlay isLoading={isLoading}>
  <Content />
</LoadingOverlay>
```

### `/animation`

Framer Motion 래퍼.

```typescript
import {
  FadeIn,
  SlideUp,
  ScaleIn,
  StaggerChildren,
  AnimatePresence
} from '@soundblue/ui/animation';

// 마운트 시 페이드 인
<FadeIn>
  <Card />
</FadeIn>

// 지연이 있는 슬라이드 업
<SlideUp delay={0.2}>
  <Content />
</SlideUp>

// 스케일 인
<ScaleIn>
  <Modal />
</ScaleIn>

// 자식 애니메이션 순차 실행
<StaggerChildren staggerDelay={0.1}>
  {items.map(item => (
    <FadeIn key={item.id}>
      <ListItem item={item} />
    </FadeIn>
  ))}
</StaggerChildren>

// 종료 애니메이션을 위한 애니메이트 프레즌스
<AnimatePresence>
  {isVisible && (
    <FadeIn key="modal">
      <Modal />
    </FadeIn>
  )}
</AnimatePresence>
```

### `/hooks`

UI 관련 React 훅.

```typescript
import {
  useAutoAnimate,
  useClickOutside,
  useScrollLock,
  useFocusTrap
} from '@soundblue/ui/hooks';

// 리스트 변경 자동 애니메이트
function List({ items }) {
  const [parent] = useAutoAnimate();
  return (
    <ul ref={parent}>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

// 외부 클릭 시 닫기
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));
  return <div ref={ref}>{/* ... */}</div>;
}

// 모달용 스크롤 잠금
function Modal({ isOpen }) {
  useScrollLock(isOpen);
  return isOpen ? <div>모달 콘텐츠</div> : null;
}

// 접근성을 위한 포커스 트랩
function Dialog() {
  const ref = useFocusTrap();
  return <div ref={ref}>{/* ... */}</div>;
}
```

### `/utils`

UI 유틸리티 함수.

```typescript
import { cn, preloadImage, formatNumber } from '@soundblue/ui/utils';

// 클래스 이름 병합 (@soundblue/core에서 재내보내기)
cn('px-4 py-2', condition && 'bg-blue-500');

// 이미지 프리로드
await preloadImage('/hero.jpg');

// 숫자 포맷
formatNumber(1234567);  // "1,234,567"
```

### `/styles/base.css`

기본 CSS 스타일.

```css
/* app/app.css */
@import "tailwindcss";
@import "@soundblue/ui/styles/base.css";
```

## Storybook

컴포넌트를 독립적으로 보고 테스트하세요:

```bash
cd packages/ui
pnpm storybook
# → http://localhost:6006
```

## 접근성

모든 컴포넌트는 WCAG 2.1 가이드라인을 따릅니다:

- 키보드 네비게이션
- ARIA 속성
- 포커스 관리
- 스크린 리더 지원
- 색상 대비 준수

## 모범 사례

1. **기본 요소에는 프리미티브**, 복잡한 인터랙션에는 패턴 사용
2. **부드러운 전환을 위해 애니메이션으로 래핑**
3. **앱의 메인 CSS 파일에 base.css import**
4. **컴포넌트 문서와 예제는 Storybook 확인**
