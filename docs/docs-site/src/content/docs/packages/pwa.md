---
title: "@soundblue/pwa"
description: Progressive Web App support with service worker and manifest - Layer 2 domain package
sidebar:
  order: 9
---

# @soundblue/pwa

**Layer 2 (Domain)** — Progressive Web App utilities including service worker and manifest generation.

## Overview

This package provides PWA capabilities including offline support, app installation, and caching strategies.

| Property | Value |
|----------|-------|
| Layer | 2 (Domain) |
| Dependencies | None |
| React Required | Yes (for hooks) |
| Environment | Client + Build |

## Installation

```json
{
  "dependencies": {
    "@soundblue/pwa": "workspace:*"
  }
}
```

## Exports

### `/manifest`

Web app manifest generation.

```typescript
import { generateManifest, type ManifestConfig } from '@soundblue/pwa/manifest';

const manifest = generateManifest({
  name: 'Context - Korean Dictionary',
  shortName: 'Context',
  description: 'Korean dictionary for learners',
  themeColor: '#3b82f6',
  backgroundColor: '#ffffff',
  display: 'standalone',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
  startUrl: '/',
  scope: '/',
});

// Write to public/manifest.webmanifest
writeFileSync('public/manifest.webmanifest', JSON.stringify(manifest));
```

### `/service-worker`

Service worker configuration and utilities.

```typescript
import {
  generateServiceWorker,
  type CacheStrategy
} from '@soundblue/pwa/service-worker';

const swConfig = {
  // Cache strategies by route
  strategies: {
    // Cache first for static assets
    '/assets/*': 'cache-first',

    // Network first for API/data
    '/data/*': 'network-first',

    // Stale while revalidate for pages
    '/*': 'stale-while-revalidate',
  },

  // Pre-cache these files on install
  precache: [
    '/',
    '/offline.html',
    '/assets/app.css',
    '/assets/app.js',
  ],

  // Skip waiting for new service worker
  skipWaiting: true,
};

const sw = generateServiceWorker(swConfig);
writeFileSync('public/sw.js', sw);
```

### `/react`

React hooks for PWA features.

```typescript
import {
  useOnlineStatus,
  useServiceWorker,
  useInstallPrompt,
  OfflineIndicator
} from '@soundblue/pwa/react';

// Online/Offline detection
function App() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      {!isOnline && <OfflineIndicator />}
      <MainContent />
    </div>
  );
}

// Service worker updates
function UpdateNotification() {
  const { updateAvailable, update } = useServiceWorker();

  if (!updateAvailable) return null;

  return (
    <div>
      New version available!
      <button onClick={update}>Update now</button>
    </div>
  );
}

// Install prompt (Add to Home Screen)
function InstallButton() {
  const { canInstall, install } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button onClick={install}>
      Install App
    </button>
  );
}
```

## Cache Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| `cache-first` | Check cache first, fallback to network | Static assets (CSS, JS, images) |
| `network-first` | Try network first, fallback to cache | API responses, fresh data |
| `stale-while-revalidate` | Return cached, update in background | HTML pages, frequently updated content |
| `network-only` | Always fetch from network | Auth, real-time data |
| `cache-only` | Only use cache | Offline-only resources |

## OfflineIndicator Component

```typescript
import { OfflineIndicator } from '@soundblue/pwa/react';

// Default usage
<OfflineIndicator />

// Custom styling
<OfflineIndicator
  className="fixed bottom-4 left-4"
  message="You're offline"
/>
```

## Vite PWA Integration

The package works with `@soundblue/config` Vite setup:

```typescript
// vite.config.ts
import { createViteConfig } from '@soundblue/config/vite';

export default createViteConfig({
  appName: 'context',
  port: 3003,
  pwa: {
    name: 'Context Dictionary',
    shortName: 'Context',
    themeColor: '#3b82f6',
    // Additional manifest options
    description: 'Korean dictionary for learners',
    categories: ['education', 'reference'],
  },
});
```

## Manifest Options

```typescript
interface ManifestConfig {
  name: string;
  shortName: string;
  description?: string;
  themeColor: string;
  backgroundColor?: string;
  display?: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation?: 'portrait' | 'landscape' | 'any';
  scope?: string;
  startUrl?: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: 'any' | 'maskable';
  }>;
  categories?: string[];
  shortcuts?: Array<{
    name: string;
    url: string;
    description?: string;
    icons?: Array<{ src: string; sizes: string }>;
  }>;
}
```

## Service Worker Lifecycle

```typescript
// Listen for service worker events
import { useServiceWorker } from '@soundblue/pwa/react';

function App() {
  const {
    isRegistered,
    updateAvailable,
    update,
    registration
  } = useServiceWorker({
    onRegistered: (reg) => console.log('SW registered:', reg),
    onUpdateFound: () => console.log('New content available'),
    onOfflineReady: () => console.log('App ready for offline use'),
  });

  return (/* ... */);
}
```

## Best Practices

1. **Pre-cache critical assets** - Ensure core UI works offline
2. **Use stale-while-revalidate** for pages - Fast load with background updates
3. **Show offline indicator** - Let users know when they're offline
4. **Handle update prompts** - Don't force refresh, let users decide
