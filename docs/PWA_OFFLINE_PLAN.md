# PWA 완벽한 오프라인 지원 계획서

## 📋 현재 상태 분석

### Context 앱 (`apps/context`)
| 항목 | 상태 | 비고 |
|------|------|------|
| Service Worker | ✅ Workbox (vite-plugin-pwa) | 자동 생성 |
| Web Manifest | ✅ 자동 생성 | app.config.ts |
| 오프라인 캐싱 | ⚠️ 부분적 | Google Fonts만 |
| IndexedDB | ❌ 없음 | 구현 필요 |
| 설치 가능 | ✅ 완료 | |

### Permissive 앱 (`apps/permissive`)
| 항목 | 상태 | 비고 |
|------|------|------|
| Service Worker | ✅ 커스텀 | sw.js 수동 작성 |
| Web Manifest | ✅ 수동 | manifest.json |
| 오프라인 캐싱 | ⚠️ 기본적 | Cache-first |
| IndexedDB | ✅ Dexie | 즐겨찾기, 설정 등 |
| 설치 가능 | ✅ 완료 | |

---

## 🎯 목표

**"네트워크 없이도 100% 동작하는 앱"**

1. 모든 정적 자산 오프라인 접근 가능
2. 앱 데이터 로컬 저장 및 동기화
3. 오프라인 상태 UI 피드백
4. Background Sync로 재연결 시 자동 동기화

---

## 🏗️ 구현 계획

### Phase 1: Service Worker 강화 (기반 작업)

#### 1.1 Context 앱 - Workbox 캐싱 전략 확장

**파일:** `apps/context/app.config.ts`

```typescript
// 현재 (Google Fonts만 캐싱)
runtimeCaching: [
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    handler: 'CacheFirst',
    ...
  },
]

// 개선 후 (모든 자산 캐싱)
runtimeCaching: [
  // 1. 정적 자산 (CSS, JS, 이미지)
  {
    urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|gif|ico)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-assets',
      expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }, // 30일
    },
  },
  // 2. HTML 페이지 (Network First + 오프라인 폴백)
  {
    urlPattern: /\.html$/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'pages',
      networkTimeoutSeconds: 3,
    },
  },
  // 3. API 데이터 (Stale While Revalidate)
  {
    urlPattern: /\/api\//,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'api-cache',
      expiration: { maxAgeSeconds: 24 * 60 * 60 }, // 1일
    },
  },
  // 4. Google Fonts (기존 유지)
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    handler: 'CacheFirst',
    ...
  },
]
```

#### 1.2 Permissive 앱 - vite-plugin-pwa 마이그레이션

**이유:** 커스텀 SW보다 Workbox가 더 안정적이고 기능이 풍부함

**작업:**
1. `vite-plugin-pwa` 및 `workbox-window` 의존성 추가
2. `app.config.ts`에 PWA 플러그인 설정 추가
3. 기존 `sw.js`, `register-sw.js` 제거
4. `entry-server.tsx`에서 수동 등록 코드 제거

**새 설정 예시:**
```typescript
// apps/permissive/app.config.ts
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'icons/*.png'],
        manifest: {
          name: 'Permissive - 무료 웹개발 자료',
          short_name: 'Permissive',
          theme_color: '#3b82f6',
          // ... 기존 manifest.json 내용 이전
        },
        workbox: {
          // Dexie IndexedDB는 SW와 별개로 동작하므로 충돌 없음
          runtimeCaching: [/* Context와 동일한 전략 */],
          navigateFallback: '/index.html', // SPA 오프라인 폴백
        },
      }),
    ],
  },
});
```

---

### Phase 2: 오프라인 데이터 저장 (IndexedDB)

#### 2.1 Context 앱 - Dexie 도입

**의존성 추가:**
```bash
pnpm add dexie --filter @soundblue/context
```

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
  meaning: string;
  addedAt: number;
}

interface Settings {
  key: string;
  value: string;
}

const db = new Dexie("ContextDB") as Dexie & {
  searchHistory: EntityTable<SearchHistory, "id">;
  favoriteWords: EntityTable<FavoriteWord, "id">;
  settings: EntityTable<Settings, "key">;
};

db.version(1).stores({
  searchHistory: "++id, query, timestamp",
  favoriteWords: "++id, word, addedAt",
  settings: "key",
});

export { db };
export type { SearchHistory, FavoriteWord, Settings };
```

**활용 예시:**
- 검색 기록 저장 → 오프라인에서도 최근 검색어 표시
- 단어 즐겨찾기 → 네트워크 없이 학습
- 사용자 설정 → 테마, 언어 등

#### 2.2 Permissive 앱 - 기존 Dexie 확장

**현재 스키마:**
```typescript
// favoriteLibraries, favoriteWebApis, settings, recentViews
```

**추가할 테이블:**
```typescript
db.version(2).stores({
  // 기존 유지
  favoriteLibraries: "++id, name, addedAt",
  favoriteWebApis: "++id, name, addedAt",
  settings: "key",
  recentViews: "++id, type, itemId, viewedAt",
  // 신규 추가
  offlinePages: "url, html, cachedAt",     // 페이지 콘텐츠 캐싱
  pendingActions: "++id, action, data, createdAt", // 오프라인 액션 큐
});
```

---

### Phase 3: 오프라인 상태 감지 및 UI

#### 3.1 공통 컴포넌트 생성

**새 파일:** `packages/shared/src/hooks/useOnlineStatus.ts`
```typescript
import { createSignal, onMount, onCleanup } from "solid-js";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = createSignal(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  onMount(() => {
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

#### 3.2 오프라인 배너 컴포넌트

**새 파일:** `packages/shared/src/components/OfflineBanner.tsx`
```tsx
import { Show } from "solid-js";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  return (
    <Show when={!isOnline()}>
      <div class="fixed top-0 left-0 right-0 bg-amber-500 text-white text-center py-2 z-50">
        ⚠️ 오프라인 모드 - 일부 기능이 제한될 수 있습니다
      </div>
    </Show>
  );
}
```

#### 3.3 각 앱에 적용

```tsx
// apps/context/src/app.tsx & apps/permissive/src/app.tsx
import { OfflineBanner } from "@soundblue/shared";

export default function App() {
  return (
    <>
      <OfflineBanner />
      {/* 기존 내용 */}
    </>
  );
}
```

---

### Phase 4: Background Sync (선택적)

#### 4.1 오프라인 액션 큐잉

사용자가 오프라인 상태에서 수행한 액션을 저장했다가 온라인 복귀 시 실행

**예시 시나리오:**
- 오프라인에서 단어 즐겨찾기 추가 → 온라인 복귀 시 서버 동기화 (서버가 있는 경우)
- 현재는 100% SSG이므로 서버 동기화 불필요, IndexedDB만으로 충분

#### 4.2 SW에 Background Sync 등록 (향후 서버 연동 시)

```typescript
// workbox에서 BackgroundSync 플러그인 사용
workbox: {
  runtimeCaching: [
    {
      urlPattern: /\/api\/sync/,
      handler: 'NetworkOnly',
      options: {
        backgroundSync: {
          name: 'sync-queue',
          options: { maxRetentionTime: 24 * 60 }, // 24시간
        },
      },
    },
  ],
}
```

---

### Phase 5: 프리캐싱 최적화

#### 5.1 빌드 시 자동 프리캐시

vite-plugin-pwa가 빌드 시 자동으로 생성하는 파일들을 프리캐시

```typescript
workbox: {
  globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
  // SSG로 생성된 모든 HTML 페이지 포함
}
```

#### 5.2 중요 데이터 프리로드

앱 설치 시 핵심 데이터를 미리 다운로드

```typescript
// Context 앱: 자주 사용되는 단어 데이터 프리로드
// Permissive 앱: 라이브러리 목록 프리로드
```

---

## 📁 파일 변경 목록

### 새로 생성할 파일
| 파일 | 목적 |
|------|------|
| `packages/shared/src/hooks/useOnlineStatus.ts` | 온라인 상태 훅 |
| `packages/shared/src/components/OfflineBanner.tsx` | 오프라인 알림 UI |
| `apps/context/src/lib/db.ts` | Context IndexedDB 설정 |

### 수정할 파일
| 파일 | 변경 내용 |
|------|----------|
| `apps/context/app.config.ts` | 캐싱 전략 확장 |
| `apps/permissive/app.config.ts` | vite-plugin-pwa 추가 |
| `apps/permissive/package.json` | 의존성 추가 |
| `apps/context/package.json` | dexie 의존성 추가 |
| `packages/shared/package.json` | solid-js peer dependency |
| `packages/shared/src/index.ts` | 새 컴포넌트 export |
| `apps/*/src/app.tsx` | OfflineBanner 적용 |

### 삭제할 파일
| 파일 | 이유 |
|------|------|
| `apps/permissive/public/sw.js` | Workbox로 대체 |
| `apps/permissive/public/register-sw.js` | 자동 등록으로 대체 |

---

## ✅ 구현 우선순위

| 순서 | 작업 | 복잡도 | 영향도 |
|------|------|--------|--------|
| 1 | Context 캐싱 전략 강화 | 낮음 | 높음 |
| 2 | 공유 오프라인 상태 훅/컴포넌트 | 낮음 | 중간 |
| 3 | Permissive → vite-plugin-pwa 마이그레이션 | 중간 | 높음 |
| 4 | Context IndexedDB (Dexie) 도입 | 중간 | 중간 |
| 5 | 오프라인 배너 각 앱 적용 | 낮음 | 낮음 |
| 6 | Background Sync (선택) | 높음 | 낮음 |

---

## 🧪 테스트 계획

### 수동 테스트
1. Chrome DevTools → Network → Offline 체크
2. 앱이 정상 동작하는지 확인
3. 페이지 이동, 검색, 즐겨찾기 등 주요 기능 테스트

### Lighthouse PWA 감사
```bash
# 각 앱 빌드 후 serve
pnpm build --filter context
npx serve apps/context/.output/public

# Lighthouse로 PWA 점수 확인 (목표: 100점)
```

### 체크리스트
- [ ] 오프라인에서 모든 페이지 접근 가능
- [ ] 오프라인에서 이전에 본 데이터 표시
- [ ] 오프라인 상태 표시 UI 동작
- [ ] 온라인 복귀 시 UI 업데이트
- [ ] Service Worker 업데이트 알림

---

## 📊 예상 결과

| 지표 | 현재 | 목표 |
|------|------|------|
| Lighthouse PWA 점수 | ~70 | 100 |
| 오프라인 페이지 접근 | 일부 | 전체 |
| 오프라인 데이터 접근 | Context ❌ / Permissive ✅ | 둘 다 ✅ |
| 설치 경험 | 기본 | 완전 |

---

## 🚀 다음 단계

이 계획서에 동의하시면 Phase 1부터 순차적으로 구현을 시작하겠습니다.

**질문:**
1. Background Sync (Phase 4)가 현재 필요한가요? (서버 연동 계획 여부)
2. 오프라인 배너 디자인에 대한 선호사항이 있나요?
3. 특정 Phase를 먼저 구현하길 원하시나요?
