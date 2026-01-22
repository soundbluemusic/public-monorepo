---
title: "@soundblue/features"
description: Business logic hooks for settings, toast, and media queries - Layer 3 UI package
sidebar:
  order: 10
---

# @soundblue/features

**Layer 3 (UI)** — Business logic React hooks using Zustand for state management.

## Overview

This package provides React hooks for common app features like settings persistence, toast notifications, and media queries.

| Property | Value |
|----------|-------|
| Layer | 3 (UI) |
| Dependencies | zustand |
| React Required | Yes |
| Environment | Client-only |

## Installation

```json
{
  "dependencies": {
    "@soundblue/features": "workspace:*"
  }
}
```

## Exports

### `/settings`

Persistent settings store using Zustand.

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
      {/* Theme toggle */}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>

      {/* Sidebar toggle */}
      <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
        {sidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar
      </button>

      {/* Font size */}
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

#### Settings Store State

```typescript
interface SettingsState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: Theme) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Font
  fontSize: number;
  setFontSize: (size: number) => void;

  // Locale (read-only, set via URL)
  locale: 'en' | 'ko';
}
```

### `/toast`

Toast notification system.

```typescript
import { useToast, toast, ToastContainer } from '@soundblue/features/toast';

// Add ToastContainer to your app root
function App() {
  return (
    <>
      <MainContent />
      <ToastContainer />
    </>
  );
}

// Use the toast function anywhere
function CopyButton({ text }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return <button onClick={handleCopy}>Copy</button>;
}

// Or use the hook for more control
function Component() {
  const { addToast, removeToast, toasts } = useToast();

  const showCustomToast = () => {
    addToast({
      type: 'info',
      message: 'Custom toast message',
      duration: 5000,
    });
  };

  return <button onClick={showCustomToast}>Show Toast</button>;
}
```

#### Toast Types

```typescript
// Quick toast methods
toast.success('Operation completed');
toast.error('Something went wrong');
toast.info('Here is some information');
toast.warning('Be careful!');

// Custom toast
toast({
  type: 'success',
  message: 'File uploaded',
  duration: 3000,        // Auto-dismiss after 3s (default: 4000)
  dismissible: true,     // Show close button (default: true)
  icon: <CheckIcon />,   // Custom icon
});
```

### `/media`

Responsive design hooks.

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

// Custom media query
function DarkModeAware() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div className={prefersDark ? 'dark' : 'light'}>
      User prefers {prefersDark ? 'dark' : 'light'} mode
    </div>
  );
}
```

#### Built-in Media Query Hooks

| Hook | Breakpoint |
|------|------------|
| `useIsMobile()` | `< 768px` |
| `useIsTablet()` | `768px - 1024px` |
| `useMediaQuery(query)` | Custom query |

## Persistence

Settings are automatically persisted to localStorage:

```typescript
// Settings are saved to localStorage on change
const { theme, setTheme } = useSettingsStore();
setTheme('dark');  // Saved to localStorage['soundblue-settings']

// On app load, settings are restored from localStorage
// If no saved settings, defaults are used
```

## SSG Compatibility

All hooks are SSG-safe and return sensible defaults during server-side rendering:

```typescript
// During SSG build
useSettingsStore()   // Returns default state
useIsMobile()        // Returns false
useMediaQuery(...)   // Returns false
```

## Integration Example

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

## Best Practices

1. **Add ToastContainer once** at the app root level
2. **Use built-in media hooks** instead of CSS-in-JS media queries for complex logic
3. **Settings persist automatically** - no need to manually save
