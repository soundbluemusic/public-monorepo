---
title: "@soundblue/features"
description: 설정, 토스트, 미디어 쿼리를 위한 비즈니스 로직 훅 - Layer 3 UI 패키지
sidebar:
  order: 10
---

# @soundblue/features

**Layer 3 (UI)** — Zustand를 사용한 상태 관리를 위한 비즈니스 로직 React 훅.

## 개요

이 패키지는 설정 저장, 토스트 알림, 미디어 쿼리와 같은 일반적인 앱 기능을 위한 React 훅을 제공합니다.

| 속성 | 값 |
|------|------|
| 레이어 | 3 (UI) |
| 의존성 | zustand |
| React 필요 | 예 |
| 환경 | 클라이언트 전용 |

## 설치

```json
{
  "dependencies": {
    "@soundblue/features": "workspace:*"
  }
}
```

## 내보내기

### `/settings`

Zustand를 사용한 영구 설정 스토어.

```typescript
import { useSettingsStore } from '@soundblue/features/settings';

function SettingsPanel() {
  const {
    theme,
    setTheme,
    sidebarCollapsed,
    setSidebarCollapsed,
    fontSize,
    setFontSize,
  } = useSettingsStore();

  return (
    <div>
      {/* 테마 토글 */}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
      >
        <option value="light">라이트</option>
        <option value="dark">다크</option>
        <option value="system">시스템</option>
      </select>

      {/* 사이드바 토글 */}
      <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
        사이드바 {sidebarCollapsed ? '펼치기' : '접기'}
      </button>

      {/* 글꼴 크기 */}
      <input
        type="range"
        min={12}
        max={20}
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
      />
    </div>
  );
}
```

#### 설정 스토어 상태

```typescript
interface SettingsState {
  // 테마
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: Theme) => void;

  // 사이드바
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // 글꼴
  fontSize: number;
  setFontSize: (size: number) => void;

  // 로케일 (읽기 전용, URL로 설정)
  locale: 'en' | 'ko';
}
```

### `/toast`

토스트 알림 시스템.

```typescript
import { useToast, toast, ToastContainer } from '@soundblue/features/toast';

// 앱 루트에 ToastContainer 추가
function App() {
  return (
    <>
      <MainContent />
      <ToastContainer />
    </>
  );
}

// 어디서나 toast 함수 사용
function CopyButton({ text }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success('클립보드에 복사되었습니다!');
  };

  return <button onClick={handleCopy}>복사</button>;
}

// 또는 더 많은 제어를 위해 훅 사용
function Component() {
  const { addToast, removeToast, toasts } = useToast();

  const showCustomToast = () => {
    addToast({
      type: 'info',
      message: '커스텀 토스트 메시지',
      duration: 5000,
    });
  };

  return <button onClick={showCustomToast}>토스트 표시</button>;
}
```

#### 토스트 유형

```typescript
// 빠른 토스트 메서드
toast.success('작업이 완료되었습니다');
toast.error('문제가 발생했습니다');
toast.info('정보입니다');
toast.warning('주의하세요!');

// 커스텀 토스트
toast({
  type: 'success',
  message: '파일이 업로드되었습니다',
  duration: 3000,        // 3초 후 자동 닫힘 (기본값: 4000)
  dismissible: true,     // 닫기 버튼 표시 (기본값: true)
  icon: <CheckIcon />,   // 커스텀 아이콘
});
```

### `/media`

반응형 디자인 훅.

```typescript
import { useMediaQuery, useIsMobile, useIsTablet } from '@soundblue/features/media';

function ResponsiveLayout() {
  const isMobile = useIsMobile();      // < 768px
  const isTablet = useIsTablet();      // 768px - 1024px
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isMobile) {
    return <MobileLayout />;
  }

  if (isTablet) {
    return <TabletLayout />;
  }

  return <DesktopLayout />;
}

// 커스텀 미디어 쿼리
function DarkModeAware() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div className={prefersDark ? 'dark' : 'light'}>
      사용자 선호: {prefersDark ? '다크' : '라이트'} 모드
    </div>
  );
}
```

#### 내장 미디어 쿼리 훅

| 훅 | 브레이크포인트 |
|------|--------------|
| `useIsMobile()` | `< 768px` |
| `useIsTablet()` | `768px - 1024px` |
| `useMediaQuery(query)` | 커스텀 쿼리 |

## 영속성

설정은 localStorage에 자동으로 저장됩니다:

```typescript
// 설정은 변경 시 localStorage에 저장됨
const { theme, setTheme } = useSettingsStore();
setTheme('dark');  // localStorage['soundblue-settings']에 저장됨

// 앱 로드 시, 설정은 localStorage에서 복원됨
// 저장된 설정이 없으면 기본값 사용
```

## SSG 호환성

모든 훅은 SSG 안전하며 서버 사이드 렌더링 중 합리적인 기본값을 반환합니다:

```typescript
// SSG 빌드 중
useSettingsStore()   // 기본 상태 반환
useIsMobile()        // false 반환
useMediaQuery(...)   // false 반환
```

## 통합 예시

```typescript
// app/root.tsx
import { useSettingsStore } from '@soundblue/features/settings';
import { ToastContainer } from '@soundblue/features/toast';

export default function Root() {
  const { theme } = useSettingsStore();

  return (
    <html data-theme={theme}>
      <body>
        <Outlet />
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
```

## 모범 사례

1. **ToastContainer는 한 번만 추가** - 앱 루트 레벨에서
2. **내장 미디어 훅 사용** - 복잡한 로직에서 CSS-in-JS 미디어 쿼리 대신
3. **설정은 자동으로 저장됨** - 수동 저장 불필요
