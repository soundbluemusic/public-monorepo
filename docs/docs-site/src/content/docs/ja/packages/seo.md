---
title: "@soundblue/seo"
description: SEO用メタタグ、サイトマップ生成、構造化データ - Layer 2 ドメインパッケージ
sidebar:
  order: 8
---

# @soundblue/seo

**Layer 2 (ドメイン)** — メタタグ、サイトマップ、構造化データのためのSEOユーティリティ。

## 概要

このパッケージは、SEO最適化されたメタタグ、XMLサイトマップ、JSON-LD構造化データを生成するためのビルド時ユーティリティを提供します。

| プロパティ | 値 |
|----------|-------|
| レイヤー | 2 (ドメイン) |
| 依存関係 | なし |
| React必須 | いいえ |
| 環境 | ビルドのみ |

## インストール

```json
{
  "dependencies": {
    "@soundblue/seo": "workspace:*"
  }
}
```

## エクスポート

### `/meta`

React Router用メタタグ生成。

```typescript
import { metaFactory, dynamicMetaFactory } from '@soundblue/seo/meta';

// 静的ルート
export const meta = metaFactory({
  ko: { title: '소개', description: '한국어 사전 소개' },
  en: { title: 'About', description: 'About Korean Dictionary' },
}, 'https://context.soundbluemusic.com');

// 動的ルート
export const meta = dynamicMetaFactory<typeof loader>({
  getTitle: (data) => `${data.entry.word} - Context`,
  getDescription: (data) => data.entry.translations.explanation,
  baseUrl: 'https://context.soundbluemusic.com',
});
```

### `/sitemap`

XMLサイトマップ生成。

```typescript
import { generateSitemap, type SitemapEntry } from '@soundblue/seo/sitemap';

const entries: SitemapEntry[] = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/about', priority: 0.8, changefreq: 'monthly' },
  ...allEntries.map(e => ({
    url: `/entry/${e.id}`,
    priority: 0.6,
    changefreq: 'weekly',
    lastmod: e.updatedAt,
  })),
];

const sitemap = generateSitemap({
  baseUrl: 'https://context.soundbluemusic.com',
  entries,
  locales: ['en', 'ko'],
});

// public/sitemap.xmlに保存
writeFileSync('public/sitemap.xml', sitemap);
```

### `/robots`

Robots.txt生成。

```typescript
import { generateRobots } from '@soundblue/seo/robots';

const robots = generateRobots({
  sitemapUrl: 'https://context.soundbluemusic.com/sitemap.xml',
  allow: ['/'],
  disallow: ['/api/', '/admin/'],
});

// public/robots.txtに保存
writeFileSync('public/robots.txt', robots);
```

### `/structured-data`

JSON-LD構造化データ生成。

```typescript
import {
  generateWebSite,
  generateBreadcrumb,
  generateArticle
} from '@soundblue/seo/structured-data';

// WebSiteスキーマ
const websiteSchema = generateWebSite({
  name: 'Context Dictionary',
  url: 'https://context.soundbluemusic.com',
  description: '学習者のための韓国語辞書',
  searchUrl: 'https://context.soundbluemusic.com/search?q={search_term_string}',
});

// Breadcrumbスキーマ
const breadcrumbSchema = generateBreadcrumb([
  { name: 'ホーム', url: 'https://context.soundbluemusic.com' },
  { name: '挨拶', url: 'https://context.soundbluemusic.com/category/greetings' },
  { name: '안녕', url: 'https://context.soundbluemusic.com/entry/hello' },
]);

// Article/Entryスキーマ
const articleSchema = generateArticle({
  headline: '안녕 - 韓国語の挨拶',
  description: '韓国語でこんにちはと言う方法を学びます',
  url: 'https://context.soundbluemusic.com/entry/hello',
  datePublished: '2024-01-01',
  dateModified: '2024-06-15',
});
```

## メタファクトリー出力

`metaFactory`は必要なすべてのメタタグを生成します：

```html
<!-- Title -->
<title>안녕 - Context Dictionary</title>

<!-- Description -->
<meta name="description" content="韓国語の単語안녕を学びます" />

<!-- Canonical -->
<link rel="canonical" href="https://context.soundbluemusic.com/entry/hello" />

<!-- Hreflang (全言語) -->
<link rel="alternate" hreflang="en" href="https://context.soundbluemusic.com/entry/hello" />
<link rel="alternate" hreflang="ko" href="https://context.soundbluemusic.com/ko/entry/hello" />
<link rel="alternate" hreflang="x-default" href="https://context.soundbluemusic.com/entry/hello" />

<!-- Open Graph -->
<meta property="og:title" content="안녕 - Context Dictionary" />
<meta property="og:description" content="韓国語の単語안녕を学びます" />
<meta property="og:url" href="https://context.soundbluemusic.com/entry/hello" />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="안녕 - Context Dictionary" />
```

## サイトマップ出力

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://context.soundbluemusic.com/entry/hello</loc>
    <lastmod>2024-06-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en"
                href="https://context.soundbluemusic.com/entry/hello"/>
    <xhtml:link rel="alternate" hreflang="ko"
                href="https://context.soundbluemusic.com/ko/entry/hello"/>
  </url>
</urlset>
```

## ビルドスクリプト例

```typescript
// scripts/generate-seo.ts
import { generateSitemap } from '@soundblue/seo/sitemap';
import { generateRobots } from '@soundblue/seo/robots';
import { writeFileSync } from 'fs';

async function main() {
  const entries = await loadAllEntries();

  // サイトマップ生成
  const sitemap = generateSitemap({
    baseUrl: 'https://context.soundbluemusic.com',
    entries: entries.map(e => ({
      url: `/entry/${e.id}`,
      priority: 0.6,
      changefreq: 'weekly',
    })),
    locales: ['en', 'ko'],
  });

  writeFileSync('public/sitemap.xml', sitemap);

  // robots.txt生成
  const robots = generateRobots({
    sitemapUrl: 'https://context.soundbluemusic.com/sitemap.xml',
  });

  writeFileSync('public/robots.txt', robots);
}

main();
```
