---
title: "@soundblue/pwa"
description: サービスワーカーとマニフェストによるプログレッシブウェブアプリサポート - Layer 2 ドメインパッケージ
sidebar:
  order: 9
---

# @soundblue/pwa

**Layer 2 (ドメイン)** — サービスワーカーとマニフェスト生成を含むプログレッシブウェブアプリユーティリティ。

## 概要

このパッケージは、オフラインサポート、アプリインストール、キャッシング戦略を含むPWA機能を提供します。

| プロパティ | 値 |
|----------|-------|
| レイヤー | 2 (ドメイン) |
| 依存関係 | なし |
| React必須 | はい (フック用) |
| 環境 | クライアント + ビルド |

## インストール

```json
{
  "dependencies": {
    "@soundblue/pwa": "workspace:*"
  }
}
```

## エクスポート

### `/manifest`

ウェブアプリマニフェスト生成。

```typescript
import { generateManifest, type ManifestConfig } from '@soundblue/pwa/manifest';

const manifest = generateManifest({
  name: 'Context - 韓国語辞書',
  shortName: 'Context',
  description: '学習者のための韓国語辞書',
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

// public/manifest.webmanifestに保存
writeFileSync('public/manifest.webmanifest', JSON.stringify(manifest));
```

### `/service-worker`

サービスワーカー設定とユーティリティ。

```typescript
import {
  generateServiceWorker,
  type CacheStrategy
} from '@soundblue/pwa/service-worker';

const swConfig = {
  // ルート別キャッシュ戦略
  strategies: {
    // 静的アセットはキャッシュ優先
    '/assets/*': 'cache-first',

    // API/データはネットワーク優先
    '/data/*': 'network-first',

    // ページはstale-while-revalidate
    '/*': 'stale-while-revalidate',
  },

  // インストール時にプリキャッシュするファイル
  precache: [
    '/',
    '/offline.html',
    '/assets/app.css',
    '/assets/app.js',
  ],

  // 新しいサービスワーカーの待機をスキップ
  skipWaiting: true,
};

const sw = generateServiceWorker(swConfig);
writeFileSync('public/sw.js', sw);
```

### `/react`

PWA機能用のReactフック。

```typescript
import {
  useOnlineStatus,
  useServiceWorker,
  useInstallPrompt,
  OfflineIndicator
} from '@soundblue/pwa/react';

// オンライン/オフライン検出
function App() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      {!isOnline && <OfflineIndicator />}
      <MainContent />
    </div>
  );
}

// サービスワーカーの更新
function UpdateNotification() {
  const { updateAvailable, update } = useServiceWorker();

  if (!updateAvailable) return null;

  return (
    <div>
      新しいバージョンが利用可能です！
      <button onClick={update}>今すぐ更新</button>
    </div>
  );
}

// インストールプロンプト（ホーム画面に追加）
function InstallButton() {
  const { canInstall, install } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button onClick={install}>
      アプリをインストール
    </button>
  );
}
```

## キャッシュ戦略

| 戦略 | 説明 | 使用ケース |
|------|------|----------|
| `cache-first` | キャッシュを先に確認、ネットワークにフォールバック | 静的アセット (CSS, JS, 画像) |
| `network-first` | ネットワークを先に試行、キャッシュにフォールバック | APIレスポンス、新鮮なデータ |
| `stale-while-revalidate` | キャッシュを返し、バックグラウンドで更新 | HTMLページ、頻繁に更新されるコンテンツ |
| `network-only` | 常にネットワークから取得 | 認証、リアルタイムデータ |
| `cache-only` | キャッシュのみ使用 | オフライン専用リソース |

## OfflineIndicatorコンポーネント

```typescript
import { OfflineIndicator } from '@soundblue/pwa/react';

// デフォルト使用
<OfflineIndicator />

// カスタムスタイリング
<OfflineIndicator
  className="fixed bottom-4 left-4"
  message="オフラインです"
/>
```

## Vite PWA統合

パッケージは`@soundblue/config` Vite設定と連携します：

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
    // 追加マニフェストオプション
    description: '学習者のための韓国語辞書',
    categories: ['education', 'reference'],
  },
});
```

## マニフェストオプション

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

## サービスワーカーライフサイクル

```typescript
// サービスワーカーイベントをリッスン
import { useServiceWorker } from '@soundblue/pwa/react';

function App() {
  const {
    isRegistered,
    updateAvailable,
    update,
    registration
  } = useServiceWorker({
    onRegistered: (reg) => console.log('SW登録完了:', reg),
    onUpdateFound: () => console.log('新しいコンテンツが利用可能'),
    onOfflineReady: () => console.log('アプリがオフライン使用準備完了'),
  });

  return (/* ... */);
}
```

## ベストプラクティス

1. **重要なアセットをプリキャッシュ** - コアUIがオフラインで動作するように保証
2. **ページにstale-while-revalidateを使用** - 高速読み込みとバックグラウンド更新
3. **オフラインインジケーターを表示** - ユーザーにオフライン状態を通知
4. **更新プロンプトを処理** - 強制リフレッシュせず、ユーザーに決定させる
