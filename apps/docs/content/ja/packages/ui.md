---
title: "@soundblue/ui"
description: React UIコンポーネント、アニメーション、デザインプリミティブ - Layer 3 UIパッケージ
sidebar:
  order: 11
---

# @soundblue/ui

**Layer 3 (UI)** — 共有Reactコンポーネント、アニメーション、UIプリミティブ。

## 概要

このパッケージは、React、Tailwind CSS、Framer Motionで構築された再利用可能なUIコンポーネントを提供します。プリミティブ、パターン、アプリ固有のコンポーネントが含まれています。

| プロパティ | 値 |
|----------|-------|
| レイヤー | 3 (UI) |
| 依存関係 | framer-motion, lucide-react, @tanstack/react-virtual, cva |
| React必須 | はい |
| Storybook | 利用可能 (`pnpm storybook`) |

## インストール

```json
{
  "dependencies": {
    "@soundblue/ui": "workspace:*"
  }
}
```

## エクスポート

### `/components`

アプリレベルの共有コンポーネント。

```typescript
import {
  DarkModeToggle,
  LanguageToggle,
  FamilySites,
  SearchBar,
  BackToTop
} from '@soundblue/ui/components';

// システム検出付きダークモードトグル
<DarkModeToggle />

// 言語スイッチャー (EN/KO)
<LanguageToggle locale={locale} onSwitch={switchLocale} />

// サイト間ナビゲーション
<FamilySites currentAppId="context" variant="footer" locale="en" />

// サジェスト付き検索バー
<SearchBar
  placeholder="検索..."
  onSearch={handleSearch}
  suggestions={suggestions}
/>

// トップに戻るボタン (スクロールで表示)
<BackToTop threshold={400} />
```

### `/primitives`

基本UIビルディングブロック。

```typescript
import {
  Button,
  Input,
  Badge,
  Skeleton,
  ProgressBar,
  Spinner
} from '@soundblue/ui/primitives';

// バリアント付きボタン
<Button variant="primary" size="lg">クリック</Button>
<Button variant="ghost" size="sm">キャンセル</Button>

// アイコン付きインプット
<Input
  type="search"
  placeholder="検索..."
  icon={<SearchIcon />}
/>

// バッジ
<Badge variant="success">新規</Badge>
<Badge variant="warning">ベータ</Badge>

// ローディング状態
<Skeleton width={200} height={20} />
<ProgressBar value={75} max={100} />
<Spinner size="md" />
```

#### ボタンバリアント

| バリアント | 説明 |
|---------|-------------|
| `primary` | ソリッド背景、メインCTA |
| `secondary` | アウトライン、セカンダリアクション |
| `ghost` | 背景なし、三次アクション |
| `danger` | 赤、破壊的アクション |

### `/patterns`

複雑なUIパターン。

```typescript
import {
  SearchDropdown,
  VirtualList,
  Tabs,
  Accordion,
  Modal
} from '@soundblue/ui/patterns';

// ドロップダウン結果付き検索
<SearchDropdown
  query={query}
  results={results}
  onSelect={handleSelect}
  renderItem={(item) => <EntryPreview entry={item} />}
/>

// 大規模データセット用仮想化リスト
<VirtualList
  items={entries}
  itemHeight={64}
  renderItem={(entry) => <EntryRow entry={entry} />}
/>

// タブ
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">タブ1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">タブ2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">コンテンツ1</Tabs.Content>
  <Tabs.Content value="tab2">コンテンツ2</Tabs.Content>
</Tabs>

// アコーディオン
<Accordion type="single" collapsible>
  <Accordion.Item value="item1">
    <Accordion.Trigger>セクション1</Accordion.Trigger>
    <Accordion.Content>コンテンツ1</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### `/feedback`

ユーザーフィードバックコンポーネント。

```typescript
import {
  ToastContainer,
  ErrorBoundary,
  EmptyState,
  LoadingOverlay
} from '@soundblue/ui/feedback';

// トースト通知 (@soundblue/features/toastと併用)
<ToastContainer position="bottom-right" />

// フォールバック付きエラーバウンダリ
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>

// 空状態
<EmptyState
  icon={<SearchIcon />}
  title="結果が見つかりません"
  description="検索条件を調整してみてください"
  action={<Button>フィルターをクリア</Button>}
/>

// ローディングオーバーレイ
<LoadingOverlay isLoading={isLoading}>
  <Content />
</LoadingOverlay>
```

### `/animation`

Framer Motionラッパー。

```typescript
import {
  FadeIn,
  SlideUp,
  ScaleIn,
  StaggerChildren,
  AnimatePresence
} from '@soundblue/ui/animation';

// マウント時にフェードイン
<FadeIn>
  <Card />
</FadeIn>

// 遅延付きスライドアップ
<SlideUp delay={0.2}>
  <Content />
</SlideUp>

// スケールイン
<ScaleIn>
  <Modal />
</ScaleIn>

// 子アニメーションのスタガー
<StaggerChildren staggerDelay={0.1}>
  {items.map(item => (
    <FadeIn key={item.id}>
      <ListItem item={item} />
    </FadeIn>
  ))}
</StaggerChildren>

// 終了アニメーション用AnimatePresence
<AnimatePresence>
  {isVisible && (
    <FadeIn key="modal">
      <Modal />
    </FadeIn>
  )}
</AnimatePresence>
```

### `/hooks`

UI関連のReactフック。

```typescript
import {
  useAutoAnimate,
  useClickOutside,
  useScrollLock,
  useFocusTrap
} from '@soundblue/ui/hooks';

// リスト変更の自動アニメート
function List({ items }) {
  const [parent] = useAutoAnimate();
  return (
    <ul ref={parent}>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

// 外部クリックで閉じる
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));
  return <div ref={ref}>{/* ... */}</div>;
}

// モーダル用スクロールロック
function Modal({ isOpen }) {
  useScrollLock(isOpen);
  return isOpen ? <div>モーダルコンテンツ</div> : null;
}

// アクセシビリティ用フォーカストラップ
function Dialog() {
  const ref = useFocusTrap();
  return <div ref={ref}>{/* ... */}</div>;
}
```

### `/utils`

UIユーティリティ関数。

```typescript
import { cn, preloadImage, formatNumber } from '@soundblue/ui/utils';

// クラス名マージ (@soundblue/coreから再エクスポート)
cn('px-4 py-2', condition && 'bg-blue-500');

// 画像プリロード
await preloadImage('/hero.jpg');

// 数値フォーマット
formatNumber(1234567);  // "1,234,567"
```

### `/styles/base.css`

ベースCSSスタイル。

```css
/* app/app.css */
@import "tailwindcss";
@import "@soundblue/ui/styles/base.css";
```

## Storybook

コンポーネントを単独で表示・テスト：

```bash
cd packages/ui
pnpm storybook
# → http://localhost:6006
```

## アクセシビリティ

すべてのコンポーネントはWCAG 2.1ガイドラインに従います：

- キーボードナビゲーション
- ARIA属性
- フォーカス管理
- スクリーンリーダーサポート
- 色コントラスト準拠

## ベストプラクティス

1. **基本要素にはプリミティブ**、複雑なインタラクションにはパターンを使用
2. **スムーズな遷移のためにアニメーションでラップ**
3. **アプリのメインCSSファイルにbase.cssをインポート**
4. **コンポーネントのドキュメントと例はStorybookを確認**
