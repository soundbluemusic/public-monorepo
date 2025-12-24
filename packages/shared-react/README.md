# @soundblue/shared-react

> Shared React components, hooks, and stores for Soundblue monorepo apps

---

## Installation (설치)

```bash
# Already included in monorepo
pnpm add @soundblue/shared-react
```

**Peer Dependencies:** React 19+

---

## Exports (내보내기)

| Export Path | Description |
|:------------|:------------|
| `@soundblue/shared-react` | All exports |
| `@soundblue/shared-react/components` | Components only |
| `@soundblue/shared-react/hooks` | Hooks only |
| `@soundblue/shared-react/stores` | Zustand stores only |
| `@soundblue/shared-react/utils` | Utility functions only |

---

## Components

### DarkModeToggle

Toggle between light and dark themes.

```tsx
import { DarkModeToggle } from '@soundblue/shared-react/components';

<DarkModeToggle
  className="my-class"        // optional
  storageKey="settings-storage"  // optional, default
/>
```

**Props:**
| Prop | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| `className` | `string` | - | Additional CSS classes |
| `storageKey` | `string` | `'settings-storage'` | localStorage key for persistence |

**Known Issue:** SSG hydration mismatch. Add theme initialization script to `entry.client.tsx`.

---

### LanguageToggle

Toggle between English and Korean.

```tsx
import { LanguageToggle } from '@soundblue/shared-react/components';

<LanguageToggle
  currentLocale="en"
  localePath={(path, locale) => `/${locale}${path}`}
/>
```

**Props:**
| Prop | Type | Description |
|:-----|:-----|:------------|
| `currentLocale` | `'en' \| 'ko'` | Current language |
| `localePath` | `(path, locale) => string` | Path builder function |

---

### OfflineIndicator

Shows banner when user is offline.

```tsx
import { OfflineIndicator } from '@soundblue/shared-react/components';

<OfflineIndicator />
```

---

### Skeleton Components

Loading placeholder components.

```tsx
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonList,
  SkeletonGrid,
  PageSkeleton
} from '@soundblue/shared-react/components';

<Skeleton className="h-4 w-32" />
<SkeletonText lines={3} />
<SkeletonCard />
<SkeletonList count={5} />
<SkeletonGrid columns={3} count={6} />
<PageSkeleton variant="list" />
```

---

## Hooks

### useOnlineStatus

Track online/offline status.

```tsx
import { useOnlineStatus } from '@soundblue/shared-react/hooks';

function MyComponent() {
  const { isOnline, wasOffline } = useOnlineStatus();

  if (!isOnline) return <OfflineIndicator />;
  return <div>Online content</div>;
}
```

**Returns:**
| Property | Type | Description |
|:---------|:-----|:------------|
| `isOnline` | `boolean` | Current online status |
| `wasOffline` | `boolean` | Was offline at some point |

---

### useMediaQuery

Responsive design hook.

```tsx
import { useMediaQuery, useIsMobile } from '@soundblue/shared-react/hooks';

function MyComponent() {
  const isMobile = useIsMobile();  // < 768px
  const isLarge = useMediaQuery('(min-width: 1024px)');

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

---

## Stores (Zustand)

### useSettingsStore

Global settings store.

```tsx
import { useSettingsStore } from '@soundblue/shared-react/stores';

function MyComponent() {
  const { theme, language, setTheme, setLanguage } = useSettingsStore();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

**State:**
| Property | Type | Description |
|:---------|:-----|:------------|
| `theme` | `'light' \| 'dark'` | Current theme |
| `language` | `'en' \| 'ko'` | Current language |

**Actions:**
| Method | Description |
|:-------|:------------|
| `setTheme(theme)` | Set theme |
| `setLanguage(lang)` | Set language |

---

## Utils

### SEO Utilities

```tsx
import { generateMetaTags } from '@soundblue/shared-react/utils';

const meta = generateMetaTags({
  title: 'Page Title',
  description: 'Page description',
  url: 'https://example.com/page',
  image: 'https://example.com/og.png',
});
```

### i18n Utilities

```tsx
import { useI18n } from '@soundblue/shared-react/utils';

function MyComponent() {
  const { locale, t, localePath } = useI18n();

  return <a href={localePath('/about')}>{t('about')}</a>;
}
```

---

## SSG Compatibility Notes

All components are SSG-compatible with these considerations:

1. **DarkModeToggle**: Add inline script for FOUC prevention
2. **useOnlineStatus**: Returns `true` on server
3. **useMediaQuery**: Returns `false` on server (hydration-safe)
4. **Stores**: Persist to localStorage after hydration

---

## Dependencies

- `react` ^19.0.0
- `zustand` ^5.0.0
- `lucide-react` ^0.468.0
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-toggle`
- `@soundblue/shared`

---

## ⛔ Code Quality (코드 품질)

> **하드코딩 규칙: 우수한 설계 목적일 경우에만 허용**

```tsx
// ❌ NEVER - 익명의 매직 넘버
const isMobile = window.innerWidth < 768;
<div style={{ maxWidth: '980px' }}>

// ✅ ALLOWED - 공유 상수 또는 CSS 변수
import { BREAKPOINTS } from '@soundblue/shared';
const isMobile = window.innerWidth < BREAKPOINTS.MOBILE;
<div className="max-w-[var(--content-max-width)]">
```

See [root README](../../README.md#-code-quality-rules-코드-품질-규칙) for full guidelines.

---

## License

Apache License 2.0
