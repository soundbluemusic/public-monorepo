---
title: "@soundblue/config"
description: 공유 Vite, Tailwind, Biome 설정 - Layer 0 기반 패키지
sidebar:
  order: 3
---

# @soundblue/config

**Layer 0 (기반)** — 모든 애플리케이션을 위한 중앙화된 빌드 도구 설정.

## 개요

이 패키지는 Vite, Tailwind CSS v4, Biome에 대한 공유 설정을 제공합니다. 모든 앱에서 일관된 빌드 동작을 보장합니다.

| 속성 | 값 |
|------|-----|
| 레이어 | 0 (기반) |
| 빌드 필요 | 예 (사전 컴파일) |
| React 필요 | 선택적 (entry-client용) |

## 내보내기

### `/vite`

React Router v7 SSG 앱을 위한 사전 설정된 Vite 설정 생성.

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
  },
});
```

#### 옵션

| 옵션 | 타입 | 설명 |
|------|------|------|
| `appName` | `string` | 애플리케이션 식별자 |
| `port` | `number` | 개발 서버 포트 |
| `pwa` | `object` | PWA manifest 옵션 |
| `pwa.name` | `string` | 전체 앱 이름 |
| `pwa.shortName` | `string` | 홈 화면용 짧은 이름 |
| `pwa.themeColor` | `string` | 테마 색상 (hex) |

### `/tailwind`

디자인 토큰이 포함된 Tailwind CSS v4 프리셋.

```css
/* app.css */
@import "tailwindcss";
@import "@soundblue/config/styles/tailwind.css";
```

#### 디자인 토큰

프리셋에는 CSS 사용자 정의 속성이 포함됩니다:

```css
:root {
  /* 색상 */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --accent-primary: #3b82f6;

  /* 간격 */
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 64px;
  --header-height: 64px;
}

[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
}
```

### `/biome`

Biome 린터/포매터 설정.

```json
// biome.json
{
  "extends": ["@soundblue/config/biome"]
}
```

### `/entry-client`

React Router v7 SSG용 hydration 우회가 포함된 공유 클라이언트 엔트리.

```typescript
// app/entry.client.tsx
import { hydrateWithCleanup } from '@soundblue/config/entry-client';

hydrateWithCleanup();
```

:::caution[삭제 금지]
entry-client에는 React Router v7 + React 19 SSG hydration 버그에 대한 우회 코드가 포함되어 있습니다.
자세한 내용은 [아키텍처](/public-monorepo/ko/guides/architecture/#3-hydration-workaround)를 참조하세요.
:::
