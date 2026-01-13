---
title: "@soundblue/pwa"
description: 서비스 워커와 매니페스트를 포함한 프로그레시브 웹 앱 지원 - Layer 2 도메인 패키지
sidebar:
  order: 9
---

# @soundblue/pwa

**Layer 2 (도메인)** — 서비스 워커 및 매니페스트 생성을 포함한 프로그레시브 웹 앱 유틸리티.

## 개요

이 패키지는 오프라인 지원, 앱 설치, 캐싱 전략을 포함한 PWA 기능을 제공합니다.

| 속성 | 값 |
|------|------|
| 레이어 | 2 (도메인) |
| 의존성 | 없음 |
| React 필요 | 예 (훅용) |
| 환경 | 클라이언트 + 빌드 |

## 설치

```json
{
  "dependencies": {
    "@soundblue/pwa": "workspace:*"
  }
}
```

## 내보내기

### `/manifest`

웹 앱 매니페스트 생성.

```typescript
import { generateManifest, type ManifestConfig } from '@soundblue/pwa/manifest';

const manifest = generateManifest({
  name: 'Context - 한국어 사전',
  shortName: 'Context',
  description: '학습자를 위한 한국어 사전',
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

// public/manifest.webmanifest에 저장
writeFileSync('public/manifest.webmanifest', JSON.stringify(manifest));
```

### `/service-worker`

서비스 워커 설정 및 유틸리티.

```typescript
import {
  generateServiceWorker,
  type CacheStrategy
} from '@soundblue/pwa/service-worker';

const swConfig = {
  // 라우트별 캐시 전략
  strategies: {
    // 정적 자산은 캐시 우선
    '/assets/*': 'cache-first',

    // API/데이터는 네트워크 우선
    '/data/*': 'network-first',

    // 페이지는 stale-while-revalidate
    '/*': 'stale-while-revalidate',
  },

  // 설치 시 사전 캐시할 파일
  precache: [
    '/',
    '/offline.html',
    '/assets/app.css',
    '/assets/app.js',
  ],

  // 새 서비스 워커 대기 건너뛰기
  skipWaiting: true,
};

const sw = generateServiceWorker(swConfig);
writeFileSync('public/sw.js', sw);
```

### `/react`

PWA 기능을 위한 React 훅.

```typescript
import {
  useOnlineStatus,
  useServiceWorker,
  useInstallPrompt,
  OfflineIndicator
} from '@soundblue/pwa/react';

// 온라인/오프라인 감지
function App() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      {!isOnline && <OfflineIndicator />}
      <MainContent />
    </div>
  );
}

// 서비스 워커 업데이트
function UpdateNotification() {
  const { updateAvailable, update } = useServiceWorker();

  if (!updateAvailable) return null;

  return (
    <div>
      새 버전을 사용할 수 있습니다!
      <button onClick={update}>지금 업데이트</button>
    </div>
  );
}

// 설치 프롬프트 (홈 화면에 추가)
function InstallButton() {
  const { canInstall, install } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button onClick={install}>
      앱 설치
    </button>
  );
}
```

## 캐시 전략

| 전략 | 설명 | 사용 사례 |
|------|------|----------|
| `cache-first` | 캐시 먼저 확인, 네트워크 폴백 | 정적 자산 (CSS, JS, 이미지) |
| `network-first` | 네트워크 먼저 시도, 캐시 폴백 | API 응답, 최신 데이터 |
| `stale-while-revalidate` | 캐시 반환, 백그라운드 업데이트 | HTML 페이지, 자주 업데이트되는 콘텐츠 |
| `network-only` | 항상 네트워크에서 가져오기 | 인증, 실시간 데이터 |
| `cache-only` | 캐시만 사용 | 오프라인 전용 리소스 |

## OfflineIndicator 컴포넌트

```typescript
import { OfflineIndicator } from '@soundblue/pwa/react';

// 기본 사용
<OfflineIndicator />

// 커스텀 스타일링
<OfflineIndicator
  className="fixed bottom-4 left-4"
  message="오프라인 상태입니다"
/>
```

## Vite PWA 통합

패키지는 `@soundblue/config` Vite 설정과 함께 작동합니다:

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
    // 추가 매니페스트 옵션
    description: '학습자를 위한 한국어 사전',
    categories: ['education', 'reference'],
  },
});
```

## 매니페스트 옵션

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

## 서비스 워커 라이프사이클

```typescript
// 서비스 워커 이벤트 리스닝
import { useServiceWorker } from '@soundblue/pwa/react';

function App() {
  const {
    isRegistered,
    updateAvailable,
    update,
    registration
  } = useServiceWorker({
    onRegistered: (reg) => console.log('SW 등록됨:', reg),
    onUpdateFound: () => console.log('새 콘텐츠를 사용할 수 있습니다'),
    onOfflineReady: () => console.log('앱이 오프라인 사용 준비됨'),
  });

  return (/* ... */);
}
```

## 모범 사례

1. **중요한 자산 사전 캐시** - 핵심 UI가 오프라인에서 작동하도록 보장
2. **페이지에 stale-while-revalidate 사용** - 빠른 로드와 백그라운드 업데이트
3. **오프라인 인디케이터 표시** - 사용자에게 오프라인 상태 알림
4. **업데이트 프롬프트 처리** - 강제 새로고침 없이 사용자 결정 허용
