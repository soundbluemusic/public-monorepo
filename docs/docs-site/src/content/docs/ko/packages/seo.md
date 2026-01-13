---
title: "@soundblue/seo"
description: SEO를 위한 메타 태그, 사이트맵 생성, 구조화된 데이터 - Layer 2 도메인 패키지
sidebar:
  order: 8
---

# @soundblue/seo

**Layer 2 (도메인)** — 메타 태그, 사이트맵, 구조화된 데이터를 위한 SEO 유틸리티.

## 개요

이 패키지는 SEO 최적화된 메타 태그, XML 사이트맵, JSON-LD 구조화된 데이터를 생성하기 위한 빌드 시점 유틸리티를 제공합니다.

| 속성 | 값 |
|------|------|
| 레이어 | 2 (도메인) |
| 의존성 | 없음 |
| React 필요 | 아니오 |
| 환경 | 빌드 전용 |

## 설치

```json
{
  "dependencies": {
    "@soundblue/seo": "workspace:*"
  }
}
```

## 내보내기

### `/meta`

React Router용 메타 태그 생성.

```typescript
import { metaFactory, dynamicMetaFactory } from '@soundblue/seo/meta';

// 정적 라우트
export const meta = metaFactory({
  ko: { title: '소개', description: '한국어 사전 소개' },
  en: { title: 'About', description: 'About Korean Dictionary' },
}, 'https://context.soundbluemusic.com');

// 동적 라우트
export const meta = dynamicMetaFactory<typeof loader>({
  getTitle: (data) => `${data.entry.word} - Context`,
  getDescription: (data) => data.entry.translations.explanation,
  baseUrl: 'https://context.soundbluemusic.com',
});
```

### `/sitemap`

XML 사이트맵 생성.

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

// public/sitemap.xml에 저장
writeFileSync('public/sitemap.xml', sitemap);
```

### `/robots`

Robots.txt 생성.

```typescript
import { generateRobots } from '@soundblue/seo/robots';

const robots = generateRobots({
  sitemapUrl: 'https://context.soundbluemusic.com/sitemap.xml',
  allow: ['/'],
  disallow: ['/api/', '/admin/'],
});

// public/robots.txt에 저장
writeFileSync('public/robots.txt', robots);
```

### `/structured-data`

JSON-LD 구조화된 데이터 생성.

```typescript
import {
  generateWebSite,
  generateBreadcrumb,
  generateArticle
} from '@soundblue/seo/structured-data';

// WebSite 스키마
const websiteSchema = generateWebSite({
  name: 'Context Dictionary',
  url: 'https://context.soundbluemusic.com',
  description: '학습자를 위한 한국어 사전',
  searchUrl: 'https://context.soundbluemusic.com/search?q={search_term_string}',
});

// Breadcrumb 스키마
const breadcrumbSchema = generateBreadcrumb([
  { name: '홈', url: 'https://context.soundbluemusic.com' },
  { name: '인사', url: 'https://context.soundbluemusic.com/category/greetings' },
  { name: '안녕', url: 'https://context.soundbluemusic.com/entry/hello' },
]);

// Article/Entry 스키마
const articleSchema = generateArticle({
  headline: '안녕 - 한국어 인사',
  description: '한국어로 안녕하세요라고 말하는 방법을 배우세요',
  url: 'https://context.soundbluemusic.com/entry/hello',
  datePublished: '2024-01-01',
  dateModified: '2024-06-15',
});
```

## 메타 팩토리 출력

`metaFactory`는 필요한 모든 메타 태그를 생성합니다:

```html
<!-- Title -->
<title>안녕 - Context Dictionary</title>

<!-- Description -->
<meta name="description" content="한국어 단어 안녕을 배우세요" />

<!-- Canonical -->
<link rel="canonical" href="https://context.soundbluemusic.com/entry/hello" />

<!-- Hreflang (모든 언어) -->
<link rel="alternate" hreflang="en" href="https://context.soundbluemusic.com/entry/hello" />
<link rel="alternate" hreflang="ko" href="https://context.soundbluemusic.com/ko/entry/hello" />
<link rel="alternate" hreflang="x-default" href="https://context.soundbluemusic.com/entry/hello" />

<!-- Open Graph -->
<meta property="og:title" content="안녕 - Context Dictionary" />
<meta property="og:description" content="한국어 단어 안녕을 배우세요" />
<meta property="og:url" href="https://context.soundbluemusic.com/entry/hello" />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="안녕 - Context Dictionary" />
```

## 사이트맵 출력

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

## 빌드 스크립트 예시

```typescript
// scripts/generate-seo.ts
import { generateSitemap } from '@soundblue/seo/sitemap';
import { generateRobots } from '@soundblue/seo/robots';
import { writeFileSync } from 'fs';

async function main() {
  const entries = await loadAllEntries();

  // 사이트맵 생성
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

  // robots.txt 생성
  const robots = generateRobots({
    sitemapUrl: 'https://context.soundbluemusic.com/sitemap.xml',
  });

  writeFileSync('public/robots.txt', robots);
}

main();
```
