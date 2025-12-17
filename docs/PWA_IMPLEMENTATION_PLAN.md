# PWA 완벽 구현 계획서

## 적용 대상

| 앱 | 설명 |
|----|------|
| Context | 한국어 어휘 데이터베이스 |
| Permissive | 무료 웹개발 자료 |

---

## 1. Web App Manifest

### Context (`apps/context/public/manifest.json`)

```json
{
  "name": "Context - 한국어 어휘 데이터베이스",
  "short_name": "Context",
  "description": "학습자를 위한 한국어 사전",
  "start_url": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "categories": ["education", "reference"],
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/icons/icon-128x128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144x144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152x152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-384x384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-maskable-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "screenshots": [
    { "src": "/icons/screenshot-wide.png", "sizes": "1280x720", "type": "image/png", "form_factor": "wide" },
    { "src": "/icons/screenshot-narrow.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" }
  ],
  "shortcuts": [
    { "name": "검색", "short_name": "검색", "url": "/", "icons": [{ "src": "/icons/icon-96x96.png", "sizes": "96x96" }] }
  ]
}
```

### Permissive (`apps/permissive/public/manifest.json`)

```json
{
  "name": "Permissive - 무료 웹개발 자료",
  "short_name": "Permissive",
  "description": "무료로 사용 가능한 웹개발 라이브러리 및 리소스",
  "start_url": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "categories": ["developer", "productivity"],
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/icons/icon-128x128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144x144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152x152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-384x384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-maskable-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "screenshots": [
    { "src": "/icons/screenshot-wide.png", "sizes": "1280x720", "type": "image/png", "form_factor": "wide" },
    { "src": "/icons/screenshot-narrow.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" }
  ],
  "shortcuts": [
    { "name": "라이브러리", "short_name": "라이브러리", "url": "/libraries", "icons": [{ "src": "/icons/icon-96x96.png", "sizes": "96x96" }] },
    { "name": "Web APIs", "short_name": "APIs", "url": "/web-apis", "icons": [{ "src": "/icons/icon-96x96.png", "sizes": "96x96" }] }
  ]
}
```

---

## 2. Service Worker (Vite PWA + Workbox)

### 공통 설정 (`app.config.ts`)

```typescript
import { defineConfig } from "@solidjs/start/config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: { preset: "static" },
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "icons/*.png", "og-image.png"],

        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,json}"],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          navigationPreload: true,

          runtimeCaching: [
            // 1. HTML 페이지 - NetworkFirst (오프라인 폴백)
            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "pages-cache",
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7일
                },
              },
            },
            // 2. 폰트 파일
            {
              urlPattern: /\.(?:woff|woff2)$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "font-cache",
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 24 * 60 * 60, // 60일
                },
              },
            },
            // 3. 이미지
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "image-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
                },
              },
            },
            // 4. JS/CSS 정적 리소스
            {
              urlPattern: /\.(?:js|css)$/i,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "static-resources",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7일
                },
              },
            },
            // 5. Google Fonts
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-stylesheets",
                expiration: {
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1년
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-webfonts",
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1년
                },
              },
            },
          ],
        },

        manifest: false, // manifest.json 직접 관리
      }),
    ],
  },
});
```

---

## 3. HTTP Headers (`public/_headers`)

### Context & Permissive 공통

```
# 모든 경로 - 보안 헤더
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), geolocation=(), microphone=()

# CSP
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://cloudflareinsights.com

# HTML - 항상 최신 확인
/*.html
  Cache-Control: max-age=0, must-revalidate

/
  Cache-Control: max-age=0, must-revalidate

# Service Worker - 항상 최신
/sw.js
  Cache-Control: max-age=0, must-revalidate

# Manifest - 하루 캐시
/manifest.json
  Cache-Control: max-age=86400, stale-while-revalidate=604800

# 정적 자산 - 1년 캐시 (해시 포함)
/assets/*
  Cache-Control: max-age=31536000, immutable

# 아이콘 - 1년 캐시
/icons/*
  Cache-Control: max-age=31536000, immutable

# 폰트 - 1년 캐시
/*.woff2
  Cache-Control: max-age=31536000, immutable

/*.woff
  Cache-Control: max-age=31536000, immutable
```

---

## 4. 커스텀 Hooks

### `packages/shared/src/hooks/use-service-worker.ts`

```typescript
import { createSignal, onMount, onCleanup, type Accessor } from "solid-js";

export interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  updateAvailable: boolean;
  isControlled: boolean;
  registration: ServiceWorkerRegistration | null;
}

export interface UseServiceWorkerReturn {
  state: Accessor<ServiceWorkerState>;
  checkForUpdates: () => Promise<void>;
  skipWaiting: () => void;
  onUpdateAvailable: (callback: () => void) => void;
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [state, setState] = createSignal<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    updateAvailable: false,
    isControlled: false,
    registration: null,
  });

  const updateCallbacks: (() => void)[] = [];

  onMount(async () => {
    if (!("serviceWorker" in navigator)) return;

    setState((prev) => ({
      ...prev,
      isSupported: true,
      isControlled: !!navigator.serviceWorker.controller,
    }));

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        setState((prev) => ({
          ...prev,
          isRegistered: true,
          registration,
        }));

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setState((prev) => ({ ...prev, updateAvailable: true }));
                updateCallbacks.forEach((cb) => cb());
              }
            });
          }
        });
      }
    } catch (error) {
      console.error("SW registration check failed:", error);
    }

    // 페이지 재로드 시 새 SW 적용
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });

  const checkForUpdates = async () => {
    const registration = state().registration;
    if (registration) {
      await registration.update();
    }
  };

  const skipWaiting = () => {
    const registration = state().registration;
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  };

  const onUpdateAvailable = (callback: () => void) => {
    updateCallbacks.push(callback);
  };

  return { state, checkForUpdates, skipWaiting, onUpdateAvailable };
}
```

### `packages/shared/src/hooks/use-online-status.ts`

```typescript
import { createSignal, onMount, onCleanup, type Accessor } from "solid-js";

export interface UseOnlineStatusReturn {
  isOnline: Accessor<boolean>;
  wasOffline: Accessor<boolean>;
  lastChanged: Accessor<number>;
  onStatusChange: (callback: (online: boolean) => void) => void;
}

export function useOnlineStatus(): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = createSignal(true);
  const [wasOffline, setWasOffline] = createSignal(false);
  const [lastChanged, setLastChanged] = createSignal(Date.now());

  const callbacks: ((online: boolean) => void)[] = [];

  onMount(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setLastChanged(Date.now());
      callbacks.forEach((cb) => cb(true));
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setLastChanged(Date.now());
      callbacks.forEach((cb) => cb(false));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    onCleanup(() => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    });
  });

  const onStatusChange = (callback: (online: boolean) => void) => {
    callbacks.push(callback);
  };

  return { isOnline, wasOffline, lastChanged, onStatusChange };
}
```

---

## 5. UI 컴포넌트

### `packages/shared/src/components/OfflineIndicator.tsx`

```tsx
import { Show, createSignal, onMount } from "solid-js";
import { useOnlineStatus } from "../hooks/use-online-status";
import { useServiceWorker } from "../hooks/use-service-worker";

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const { state: swState, skipWaiting } = useServiceWorker();
  const [showReconnected, setShowReconnected] = createSignal(false);

  onMount(() => {
    // 온라인 복귀 시 토스트 표시
    const unsubscribe = useOnlineStatus().onStatusChange((online) => {
      if (online && wasOffline()) {
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
    });
  });

  return (
    <>
      {/* 오프라인 배너 */}
      <Show when={!isOnline()}>
        <div class="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a4 4 0 010-5.656m-7.072 7.072a9 9 0 010-12.728m3.536 3.536a4 4 0 010 5.656" />
          </svg>
          오프라인 상태입니다
        </div>
      </Show>

      {/* 온라인 복귀 토스트 */}
      <Show when={showReconnected()}>
        <div class="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          다시 온라인 상태입니다
        </div>
      </Show>

      {/* 업데이트 배너 */}
      <Show when={swState().updateAvailable}>
        <div class="fixed bottom-0 left-0 right-0 z-50 bg-blue-600 text-white text-center py-3 px-4 flex items-center justify-center gap-4">
          <span class="text-sm">새 버전이 있습니다</span>
          <button
            onClick={skipWaiting}
            class="bg-white text-blue-600 px-4 py-1 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            지금 업데이트
          </button>
        </div>
      </Show>
    </>
  );
}
```

---

## 6. 공유 패키지 Export

### `packages/shared/src/index.ts`

```typescript
// 기존 exports 유지
export * from "./constants";
export * from "./validation";
export * from "./search";

// PWA hooks
export { useServiceWorker, type ServiceWorkerState, type UseServiceWorkerReturn } from "./hooks/use-service-worker";
export { useOnlineStatus, type UseOnlineStatusReturn } from "./hooks/use-online-status";

// PWA components
export { OfflineIndicator } from "./components/OfflineIndicator";
```

---

## 7. 앱에 적용

### `apps/context/src/app.tsx` & `apps/permissive/src/app.tsx`

```tsx
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { OfflineIndicator } from "@soundblue/shared";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <OfflineIndicator />
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
```

---

## 8. 파일 구조

```
apps/context/
├── app.config.ts                    # VitePWA 설정
├── public/
│   ├── manifest.json                # Web App Manifest
│   ├── _headers                     # Cloudflare 헤더
│   ├── favicon.ico
│   ├── og-image.png
│   └── icons/
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       ├── icon-512x512.png
│       ├── icon-maskable-192x192.png
│       ├── icon-maskable-512x512.png
│       ├── screenshot-wide.png      # 1280x720
│       └── screenshot-narrow.png    # 390x844
└── src/
    └── app.tsx                      # OfflineIndicator 적용

apps/permissive/
├── (동일 구조)

packages/shared/
├── src/
│   ├── index.ts                     # exports 추가
│   ├── hooks/
│   │   ├── use-service-worker.ts
│   │   └── use-online-status.ts
│   └── components/
│       └── OfflineIndicator.tsx
└── package.json                     # solid-js peer dependency 추가
```

---

## 9. 의존성 추가

### `apps/context/package.json` & `apps/permissive/package.json`

```json
{
  "devDependencies": {
    "vite-plugin-pwa": "^0.21.1",
    "workbox-window": "^7.3.0"
  }
}
```

### `packages/shared/package.json`

```json
{
  "peerDependencies": {
    "solid-js": "^1.9.0"
  }
}
```

---

## 10. 삭제할 파일

| 파일 | 이유 |
|------|------|
| `apps/permissive/public/sw.js` | Workbox 자동 생성 |
| `apps/permissive/public/register-sw.js` | vite-plugin-pwa가 처리 |

---

## 11. 구현 순서

| # | 작업 | 파일 |
|---|------|------|
| 1 | 의존성 추가 | `package.json` (context, permissive) |
| 2 | 공유 훅/컴포넌트 작성 | `packages/shared/src/hooks/*`, `components/*` |
| 3 | 공유 패키지 export | `packages/shared/src/index.ts` |
| 4 | 아이콘 세트 생성 | `public/icons/*.png` (각 10개) |
| 5 | 스크린샷 생성 | `public/icons/screenshot-*.png` (각 2개) |
| 6 | manifest.json 작성 | `public/manifest.json` |
| 7 | _headers 작성 | `public/_headers` |
| 8 | app.config.ts 수정 | VitePWA 플러그인 추가 |
| 9 | app.tsx 수정 | OfflineIndicator 적용 |
| 10 | 기존 SW 파일 삭제 | permissive의 sw.js, register-sw.js |
| 11 | 빌드 & 테스트 | `pnpm build`, Lighthouse 검사 |

---

## 12. 테스트 체크리스트

- [ ] Lighthouse PWA 점수 100점
- [ ] 오프라인에서 모든 페이지 접근 가능
- [ ] 오프라인 배너 표시
- [ ] 온라인 복귀 시 토스트 표시
- [ ] 업데이트 감지 및 알림
- [ ] "지금 업데이트" 버튼 동작
- [ ] 앱 설치 가능 (데스크톱/모바일)
- [ ] 설치 시 아이콘 정상 표시
- [ ] Shortcuts 동작
