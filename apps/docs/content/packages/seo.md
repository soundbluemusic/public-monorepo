---
title: "@soundblue/seo"
description: Meta tags, sitemap generation, and structured data for SEO - Layer 2 domain package
head:
  - tag: meta
    attrs:
      name: keywords
      content: SEO package, meta tags, sitemap, structured data, JSON-LD, canonical, hreflang, Open Graph, Twitter Card
sidebar:
  order: 8
---

# @soundblue/seo

**Layer 2 (Domain)** — SEO utilities for meta tags, sitemaps, and structured data.

## Overview

This package provides build-time utilities for generating SEO-optimized meta tags, XML sitemaps, and JSON-LD structured data.

| Property | Value |
|----------|-------|
| Layer | 2 (Domain) |
| Dependencies | None |
| React Required | No |
| Environment | Build-only |

## Installation

```json
{
  "dependencies": {
    "@soundblue/seo": "workspace:*"
  }
}
```

## Exports

### `/meta`

Meta tag generation for React Router.

```typescript
import { metaFactory, dynamicMetaFactory } from '@soundblue/seo/meta';

// Static routes
export const meta = metaFactory({
  ko: { title: '소개', description: '한국어 사전 소개' },
  en: { title: 'About', description: 'About Korean Dictionary' },
}, 'https://context.soundbluemusic.com');

// Dynamic routes
export const meta = dynamicMetaFactory<typeof loader>({
  getTitle: (data) => `${data.entry.word} - Context`,
  getDescription: (data) => data.entry.translations.explanation,
  baseUrl: 'https://context.soundbluemusic.com',
});
```

### `/sitemap`

XML sitemap generation.

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

// Write to public/sitemap.xml
writeFileSync('public/sitemap.xml', sitemap);
```

### `/robots`

Robots.txt generation.

```typescript
import { generateRobots } from '@soundblue/seo/robots';

const robots = generateRobots({
  sitemapUrl: 'https://context.soundbluemusic.com/sitemap.xml',
  allow: ['/'],
  disallow: ['/api/', '/admin/'],
});

// Write to public/robots.txt
writeFileSync('public/robots.txt', robots);
```

### `/structured-data`

JSON-LD structured data generation.

```typescript
import {
  generateWebSite,
  generateBreadcrumb,
  generateArticle
} from '@soundblue/seo/structured-data';

// WebSite schema
const websiteSchema = generateWebSite({
  name: 'Context Dictionary',
  url: 'https://context.soundbluemusic.com',
  description: 'Korean dictionary for learners',
  searchUrl: 'https://context.soundbluemusic.com/search?q={search_term_string}',
});

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumb([
  { name: 'Home', url: 'https://context.soundbluemusic.com' },
  { name: 'Greetings', url: 'https://context.soundbluemusic.com/category/greetings' },
  { name: '안녕', url: 'https://context.soundbluemusic.com/entry/hello' },
]);

// Article/Entry schema
const articleSchema = generateArticle({
  headline: '안녕 - Korean Greeting',
  description: 'Learn how to say hello in Korean',
  url: 'https://context.soundbluemusic.com/entry/hello',
  datePublished: '2024-01-01',
  dateModified: '2024-06-15',
});
```

## Meta Factory Output

The `metaFactory` generates all necessary meta tags:

```html
<!-- Title -->
<title>안녕 - Context Dictionary</title>

<!-- Description -->
<meta name="description" content="Learn the Korean word 안녕" />

<!-- Canonical -->
<link rel="canonical" href="https://context.soundbluemusic.com/entry/hello" />

<!-- Hreflang (for all languages) -->
<link rel="alternate" hreflang="en" href="https://context.soundbluemusic.com/entry/hello" />
<link rel="alternate" hreflang="ko" href="https://context.soundbluemusic.com/ko/entry/hello" />
<link rel="alternate" hreflang="x-default" href="https://context.soundbluemusic.com/entry/hello" />

<!-- Open Graph -->
<meta property="og:title" content="안녕 - Context Dictionary" />
<meta property="og:description" content="Learn the Korean word 안녕" />
<meta property="og:url" href="https://context.soundbluemusic.com/entry/hello" />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="안녕 - Context Dictionary" />
```

## Sitemap Output

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

## Build Script Example

```typescript
// scripts/generate-seo.ts
import { generateSitemap } from '@soundblue/seo/sitemap';
import { generateRobots } from '@soundblue/seo/robots';
import { writeFileSync } from 'fs';

async function main() {
  const entries = await loadAllEntries();

  // Generate sitemap
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

  // Generate robots.txt
  const robots = generateRobots({
    sitemapUrl: 'https://context.soundbluemusic.com/sitemap.xml',
  });

  writeFileSync('public/robots.txt', robots);
}

main();
```
