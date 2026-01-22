---
title: "@soundblue/features"
description: 設定、トースト、メディアクエリ用のビジネスロジックフック - Layer 3 UIパッケージ
sidebar:
  order: 10
---

# @soundblue/features

**Layer 3 (UI)** — Zustandを使用した状態管理のビジネスロジックReactフック。

## 概要

このパッケージは、設定の永続化、トースト通知、メディアクエリなどの一般的なアプリ機能のためのReactフックを提供します。

| プロパティ | 値 |
|----------|-------|
| レイヤー | 3 (UI) |
| 依存関係 | zustand |
| React必須 | はい |
| 環境 | クライアントのみ |

## インストール

```json
{
  "dependencies": {
    "@soundblue/features": "workspace:*"
  }
}
```

## エクスポート

### `/settings`

Zustandを使用した永続的設定ストア。

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
      {/* テーマトグル */}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
      >
        <option value="light">ライト</option>
        <option value="dark">ダーク</option>
        <option value="system">システム</option>
      </select>

      {/* サイドバートグル */}
      <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
        サイドバーを{sidebarCollapsed ? '展開' : '折りたたむ'}
      </button>

      {/* フォントサイズ */}
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

#### 設定ストアの状態

```typescript
interface SettingsState {
  // テーマ
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: Theme) => void;

  // サイドバー
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // フォント
  fontSize: number;
  setFontSize: (size: number) => void;

  // ロケール (読み取り専用、URLで設定)
  locale: 'en' | 'ko';
}
```

### `/toast`

トースト通知システム。

```typescript
import { useToast, toast, ToastContainer } from '@soundblue/features/toast';

// アプリルートにToastContainerを追加
function App() {
  return (
    <>
      <MainContent />
      <ToastContainer />
    </>
  );
}

// どこでもtoast関数を使用
function CopyButton({ text }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success('クリップボードにコピーしました！');
  };

  return <button onClick={handleCopy}>コピー</button>;
}

// または、より細かい制御のためにフックを使用
function Component() {
  const { addToast, removeToast, toasts } = useToast();

  const showCustomToast = () => {
    addToast({
      type: 'info',
      message: 'カスタムトーストメッセージ',
      duration: 5000,
    });
  };

  return <button onClick={showCustomToast}>トーストを表示</button>;
}
```

#### トーストタイプ

```typescript
// クイックトーストメソッド
toast.success('操作が完了しました');
toast.error('問題が発生しました');
toast.info('情報です');
toast.warning('注意してください！');

// カスタムトースト
toast({
  type: 'success',
  message: 'ファイルがアップロードされました',
  duration: 3000,        // 3秒後に自動消去 (デフォルト: 4000)
  dismissible: true,     // 閉じるボタンを表示 (デフォルト: true)
  icon: <CheckIcon />,   // カスタムアイコン
});
```

### `/media`

レスポンシブデザインフック。

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

// カスタムメディアクエリ
function DarkModeAware() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div className={prefersDark ? 'dark' : 'light'}>
      ユーザー設定: {prefersDark ? 'ダーク' : 'ライト'}モード
    </div>
  );
}
```

#### 組み込みメディアクエリフック

| フック | ブレークポイント |
|------|--------------|
| `useIsMobile()` | `< 768px` |
| `useIsTablet()` | `768px - 1024px` |
| `useMediaQuery(query)` | カスタムクエリ |

## 永続化

設定はlocalStorageに自動的に保存されます：

```typescript
// 設定は変更時にlocalStorageに保存される
const { theme, setTheme } = useSettingsStore();
setTheme('dark');  // localStorage['soundblue-settings']に保存

// アプリ読み込み時、設定はlocalStorageから復元される
// 保存された設定がない場合、デフォルトが使用される
```

## SSG互換性

すべてのフックはSSGセーフで、サーバーサイドレンダリング中は適切なデフォルトを返します：

```typescript
// SSGビルド中
useSettingsStore()   // デフォルト状態を返す
useIsMobile()        // falseを返す
useMediaQuery(...)   // falseを返す
```

## 統合例

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

## ベストプラクティス

1. **ToastContainerは一度だけ追加** - アプリルートレベルで
2. **組み込みメディアフックを使用** - 複雑なロジックではCSS-in-JSメディアクエリの代わりに
3. **設定は自動的に保存される** - 手動保存は不要
