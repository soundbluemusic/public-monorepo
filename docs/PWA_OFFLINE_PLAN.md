# PWA 오프라인 지원 계획서 (100% SSG 최적화)

## 🎯 SSG + PWA 핵심 원칙

**SSG의 특징:**
- 모든 HTML 페이지가 **빌드 시점**에 생성됨
- 서버 없음 → API 캐싱, Background Sync **불필요**
- 모든 콘텐츠가 정적 파일 → **프리캐싱이 핵심**

**전략:** 빌드된 모든 파일을 Service Worker 설치 시점에 캐시 → 오프라인에서 100% 동작

---

## 📋 현재 상태

| 앱 | SW 방식 | 프리캐싱 | 문제점 |
|----|---------|----------|--------|
| Context | vite-plugin-pwa | ⚠️ 부분적 | globPatterns 미설정, HTML 프리캐시 안됨 |
| Permissive | 커스텀 sw.js | ❌ 없음 | 런타임 캐싱만, 첫 방문 필요 |

---

## 🏗️ 구현 계획

### Phase 1: 프리캐싱 완성 (핵심)

SSG에서 가장 중요한 것은 **빌드된 모든 파일을 프리캐시**하는 것.

#### 1.1 Context 앱 설정 수정

**파일:** `apps/context/app.config.ts`

```typescript
import { VitePWA } from "vite-plugin-pwa";

VitePWA({
  registerType: "autoUpdate",

  // ✅ SSG 핵심: 빌드된 모든 정적 파일 프리캐시
  workbox: {
    globPatterns: [
      "**/*.html",           // 모든 SSG 페이지
      "**/*.js",             // JS 번들
      "**/*.css",            // 스타일
      "**/*.{png,jpg,svg,ico,webp}",  // 이미지
      "**/*.{woff,woff2}",   // 폰트
    ],

    // ✅ SSG는 navigateFallback 불필요 (모든 페이지가 프리캐시됨)
    navigateFallback: null,

    // ✅ 외부 리소스만 런타임 캐싱
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1년
        },
      },
    ],
  },

  manifest: {
    name: "한국어 어휘 데이터베이스",
    short_name: "Context",
    theme_color: "#3B82F6",
    background_color: "#ffffff",
    display: "standalone",
    start_url: "/",
    icons: [
      { src: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  },
})
```

#### 1.2 Permissive 앱 - vite-plugin-pwa로 전환

**이유:** 커스텀 SW는 프리캐싱 구현이 복잡함. Workbox가 자동 처리.

**작업:**
1. 의존성 추가
2. app.config.ts에 PWA 설정
3. 기존 sw.js, register-sw.js 삭제
4. entry-server.tsx에서 수동 등록 제거

**파일:** `apps/permissive/app.config.ts`

```typescript
import { VitePWA } from "vite-plugin-pwa";

VitePWA({
  registerType: "autoUpdate",

  workbox: {
    globPatterns: ["**/*.{html,js,css,png,jpg,svg,ico,woff2}"],
    navigateFallback: null,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
    ],
  },

  manifest: {
    name: "Permissive - 무료 웹개발 자료",
    short_name: "Permissive",
    theme_color: "#3b82f6",
    background_color: "#ffffff",
    display: "standalone",
    start_url: "/",
    icons: [
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  },
})
```

---

### Phase 2: 사용자 데이터 로컬 저장 (IndexedDB)

SSG는 서버가 없으므로 **모든 사용자 데이터는 브라우저에 저장**.

#### 2.1 Context 앱 - Dexie 도입

**새 파일:** `apps/context/src/lib/db.ts`

```typescript
import Dexie, { type EntityTable } from "dexie";

interface SearchHistory {
  id?: number;
  query: string;
  timestamp: number;
}

interface FavoriteWord {
  id?: number;
  word: string;
  reading?: string;
  meaning: string;
  addedAt: number;
}

const db = new Dexie("ContextDB") as Dexie & {
  searchHistory: EntityTable<SearchHistory, "id">;
  favoriteWords: EntityTable<FavoriteWord, "id">;
};

db.version(1).stores({
  searchHistory: "++id, query, timestamp",
  favoriteWords: "++id, word, addedAt",
});

export { db };
```

**활용:**
- 검색 기록 → 오프라인에서도 최근 검색어 자동완성
- 단어 즐겨찾기 → 학습 목록 오프라인 접근

#### 2.2 Permissive 앱 - 기존 Dexie 유지

이미 `favoriteLibraries`, `favoriteWebApis`, `settings`, `recentViews` 구현됨.
추가 작업 불필요.

---

### Phase 3: 오프라인 상태 UI (선택적)

SSG + 완전 프리캐싱 시 오프라인에서도 모든 기능이 동작하므로,
배너는 **사용자 안심용**으로만 필요.

#### 3.1 공유 훅

**새 파일:** `packages/shared/src/useOnlineStatus.ts`

```typescript
import { createSignal, onMount, onCleanup } from "solid-js";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = createSignal(true);

  onMount(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    onCleanup(() => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    });
  });

  return isOnline;
}
```

#### 3.2 오프라인 표시 (앱에서 직접 구현)

```tsx
// 예: apps/context/src/components/OfflineIndicator.tsx
import { Show } from "solid-js";
import { useOnlineStatus } from "@soundblue/shared";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  return (
    <Show when={!isOnline()}>
      <div class="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm">
        오프라인 모드
      </div>
    </Show>
  );
}
```

---

## 📁 파일 변경 요약

### 새로 생성
| 파일 | 설명 |
|------|------|
| `apps/context/src/lib/db.ts` | IndexedDB 설정 |
| `packages/shared/src/useOnlineStatus.ts` | 온라인 상태 훅 |

### 수정
| 파일 | 변경 |
|------|------|
| `apps/context/app.config.ts` | globPatterns 추가, runtimeCaching 정리 |
| `apps/permissive/app.config.ts` | vite-plugin-pwa 설정 추가 |
| `apps/permissive/package.json` | vite-plugin-pwa, workbox-window 추가 |
| `apps/context/package.json` | dexie 추가 |
| `apps/permissive/src/entry-server.tsx` | SW 수동 등록 코드 제거 |

### 삭제
| 파일 | 이유 |
|------|------|
| `apps/permissive/public/sw.js` | Workbox 자동 생성으로 대체 |
| `apps/permissive/public/register-sw.js` | 자동 등록으로 대체 |
| `apps/permissive/public/manifest.json` | app.config.ts에서 생성 |

---

## ✅ 구현 순서

| # | 작업 | 복잡도 | 효과 |
|---|------|--------|------|
| 1 | Context globPatterns 설정 | 낮음 | 즉시 오프라인 가능 |
| 2 | Permissive → vite-plugin-pwa | 중간 | 통일된 PWA 구조 |
| 3 | Context Dexie 도입 | 낮음 | 사용자 데이터 보존 |
| 4 | 오프라인 UI 표시 | 낮음 | UX 개선 |

---

## 🧪 테스트 방법

### 1. 프리캐싱 확인
```bash
pnpm build --filter context
npx serve apps/context/.output/public
```
- Chrome DevTools → Application → Cache Storage 확인
- 모든 HTML, JS, CSS가 캐시되어 있는지 확인

### 2. 오프라인 테스트
- Chrome DevTools → Network → Offline 체크
- 모든 페이지 이동 가능한지 확인
- 새로고침해도 동작하는지 확인

### 3. Lighthouse PWA 점수
- 목표: 100점
- "Installable", "PWA Optimized" 섹션 모두 통과

---

## 📊 SSG + PWA 캐싱 전략 비교

| 전략 | SSG에서 용도 | 사용 여부 |
|------|-------------|----------|
| **Precache** | 빌드된 모든 정적 파일 | ✅ 필수 |
| CacheFirst | 외부 폰트, CDN | ✅ 외부 리소스만 |
| NetworkFirst | 자주 변경되는 콘텐츠 | ❌ 불필요 (SSG는 빌드 시 고정) |
| StaleWhileRevalidate | API 응답 | ❌ 불필요 (API 없음) |
| NetworkOnly | 실시간 필수 데이터 | ❌ 불필요 |

---

## 🚫 SSG에서 불필요한 것들

이전 계획서에서 제거한 항목:

1. ~~Background Sync~~ → 서버 없음
2. ~~API 캐싱~~ → API 없음
3. ~~NetworkFirst 전략~~ → 콘텐츠가 빌드 시 고정
4. ~~navigateFallback~~ → 모든 페이지가 프리캐시됨
5. ~~offlinePages IndexedDB 테이블~~ → SW가 HTML 캐시
6. ~~pendingActions 큐~~ → 동기화할 서버 없음

---

## 🎯 최종 목표

| 상태 | 동작 |
|------|------|
| 온라인 (첫 방문) | SW 설치, 모든 파일 프리캐시 |
| 온라인 (재방문) | 캐시에서 즉시 로드, 백그라운드 업데이트 확인 |
| 오프라인 | 캐시에서 100% 동작, 모든 페이지 접근 가능 |
| 온라인 복귀 | SW 업데이트 확인, 새 버전 있으면 다운로드 |

**결과:** 첫 방문 후 네트워크 완전 차단해도 앱이 100% 동작
