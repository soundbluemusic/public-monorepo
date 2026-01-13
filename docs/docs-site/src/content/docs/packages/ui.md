---
title: "@soundblue/ui"
description: React UI components, animations, and design primitives - Layer 3 UI package
sidebar:
  order: 11
---

# @soundblue/ui

**Layer 3 (UI)** — Shared React components, animations, and UI primitives.

## Overview

This package provides reusable UI components built with React, Tailwind CSS, and Framer Motion. It includes primitives, patterns, and app-specific components.

| Property | Value |
|----------|-------|
| Layer | 3 (UI) |
| Dependencies | framer-motion, lucide-react, @tanstack/react-virtual, cva |
| React Required | Yes |
| Storybook | Available (`pnpm storybook`) |

## Installation

```json
{
  "dependencies": {
    "@soundblue/ui": "workspace:*"
  }
}
```

## Exports

### `/components`

App-level shared components.

```typescript
import {
  DarkModeToggle,
  LanguageToggle,
  FamilySites,
  SearchBar,
  BackToTop
} from '@soundblue/ui/components';

// Dark mode toggle with system detection
<DarkModeToggle />

// Language switcher (EN/KO)
<LanguageToggle locale={locale} onSwitch={switchLocale} />

// Cross-site navigation
<FamilySites currentAppId="context" variant="footer" locale="en" />

// Search bar with suggestions
<SearchBar
  placeholder="Search..."
  onSearch={handleSearch}
  suggestions={suggestions}
/>

// Back to top button (appears on scroll)
<BackToTop threshold={400} />
```

### `/primitives`

Basic UI building blocks.

```typescript
import {
  Button,
  Input,
  Badge,
  Skeleton,
  ProgressBar,
  Spinner
} from '@soundblue/ui/primitives';

// Button with variants
<Button variant="primary" size="lg">Click me</Button>
<Button variant="ghost" size="sm">Cancel</Button>

// Input with icon
<Input
  type="search"
  placeholder="Search..."
  icon={<SearchIcon />}
/>

// Badge
<Badge variant="success">New</Badge>
<Badge variant="warning">Beta</Badge>

// Loading states
<Skeleton width={200} height={20} />
<ProgressBar value={75} max={100} />
<Spinner size="md" />
```

#### Button Variants

| Variant | Description |
|---------|-------------|
| `primary` | Solid background, main CTA |
| `secondary` | Outlined, secondary action |
| `ghost` | No background, tertiary action |
| `danger` | Red, destructive action |

### `/patterns`

Complex UI patterns.

```typescript
import {
  SearchDropdown,
  VirtualList,
  Tabs,
  Accordion,
  Modal
} from '@soundblue/ui/patterns';

// Search with dropdown results
<SearchDropdown
  query={query}
  results={results}
  onSelect={handleSelect}
  renderItem={(item) => <EntryPreview entry={item} />}
/>

// Virtualized list for large datasets
<VirtualList
  items={entries}
  itemHeight={64}
  renderItem={(entry) => <EntryRow entry={entry} />}
/>

// Tabs
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs>

// Accordion
<Accordion type="single" collapsible>
  <Accordion.Item value="item1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content 1</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### `/feedback`

User feedback components.

```typescript
import {
  ToastContainer,
  ErrorBoundary,
  EmptyState,
  LoadingOverlay
} from '@soundblue/ui/feedback';

// Toast notifications (use with @soundblue/features/toast)
<ToastContainer position="bottom-right" />

// Error boundary with fallback
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>

// Empty state
<EmptyState
  icon={<SearchIcon />}
  title="No results found"
  description="Try adjusting your search terms"
  action={<Button>Clear filters</Button>}
/>

// Loading overlay
<LoadingOverlay isLoading={isLoading}>
  <Content />
</LoadingOverlay>
```

### `/animation`

Framer Motion wrappers.

```typescript
import {
  FadeIn,
  SlideUp,
  ScaleIn,
  StaggerChildren,
  AnimatePresence
} from '@soundblue/ui/animation';

// Fade in on mount
<FadeIn>
  <Card />
</FadeIn>

// Slide up with delay
<SlideUp delay={0.2}>
  <Content />
</SlideUp>

// Scale in
<ScaleIn>
  <Modal />
</ScaleIn>

// Stagger children animations
<StaggerChildren staggerDelay={0.1}>
  {items.map(item => (
    <FadeIn key={item.id}>
      <ListItem item={item} />
    </FadeIn>
  ))}
</StaggerChildren>

// Animate presence for exit animations
<AnimatePresence>
  {isVisible && (
    <FadeIn key="modal">
      <Modal />
    </FadeIn>
  )}
</AnimatePresence>
```

### `/hooks`

UI-related React hooks.

```typescript
import {
  useAutoAnimate,
  useClickOutside,
  useScrollLock,
  useFocusTrap
} from '@soundblue/ui/hooks';

// Auto-animate list changes
function List({ items }) {
  const [parent] = useAutoAnimate();
  return (
    <ul ref={parent}>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

// Click outside to close
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));
  return <div ref={ref}>{/* ... */}</div>;
}

// Scroll lock for modals
function Modal({ isOpen }) {
  useScrollLock(isOpen);
  return isOpen ? <div>Modal content</div> : null;
}

// Focus trap for accessibility
function Dialog() {
  const ref = useFocusTrap();
  return <div ref={ref}>{/* ... */}</div>;
}
```

### `/utils`

UI utility functions.

```typescript
import { cn, preloadImage, formatNumber } from '@soundblue/ui/utils';

// Class name merging (re-exported from @soundblue/core)
cn('px-4 py-2', condition && 'bg-blue-500');

// Preload images
await preloadImage('/hero.jpg');

// Number formatting
formatNumber(1234567);  // "1,234,567"
```

### `/styles/base.css`

Base CSS styles.

```css
/* app/app.css */
@import "tailwindcss";
@import "@soundblue/ui/styles/base.css";
```

## Storybook

View and test components in isolation:

```bash
cd packages/ui
pnpm storybook
# → http://localhost:6006
```

## Accessibility

All components follow WCAG 2.1 guidelines:

- Keyboard navigation
- ARIA attributes
- Focus management
- Screen reader support
- Color contrast compliance

## Best Practices

1. **Use primitives** for basic elements, patterns for complex interactions
2. **Wrap with animations** for smooth transitions
3. **Import base.css** in your app's main CSS file
4. **Check Storybook** for component documentation and examples
