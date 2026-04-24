/**
 * @fileoverview Permissive 라우트 SEO 메타 단일 소스
 *
 * en/ko 라우트 쌍 사이에서 중복되던 `localizedMeta` 객체를 한곳에 모읍니다.
 * 각 라우트 파일은 여기서 해당 메타를 import하여 `headFactoryEn/Ko`에 전달합니다.
 */

import { notFound } from '@tanstack/react-router';
import {
  allLibraryTags,
  type CategoryMeta,
  getCategoryBySlug,
  getLibrariesByCategorySlug,
  getLibrariesByTag,
  getLibraryBySlug,
  getLibrarySlug,
  getRelatedLibraries,
  type Library,
  totalLibraryTagCount,
} from './data/libraries';
import { getRelatedWebApis, getWebApiBySlug, getWebApiSlug, type WebAPI } from './data/web-apis';

export const homeMeta = {
  ko: {
    title: 'Permissive - 무료 웹개발 도구 모음',
    description: '웹표준 API와 MIT 라이센스 라이브러리를 한눈에 보세요',
    keywords: [
      '웹개발 도구',
      '오픈소스 라이브러리',
      'MIT 라이선스',
      'Web API',
      '무료 라이브러리',
      'JavaScript 라이브러리',
      'permissive',
    ],
  },
  en: {
    title: 'Permissive - Free Web Dev Tools',
    description: 'Web Standard APIs and MIT licensed libraries at a glance',
    keywords: [
      'web development tools',
      'open source libraries',
      'MIT license',
      'Web API',
      'free libraries',
      'JavaScript libraries',
      'permissive',
    ],
  },
};

export const builtWithMeta = {
  ko: {
    title: '오픈소스 - Permissive',
    description: '이 사이트를 만드는 데 사용된 오픈소스 프로젝트 목록',
  },
  en: {
    title: 'Open source - Permissive',
    description: 'Open source projects used to build this site',
  },
};

export const librariesMeta = {
  ko: { title: 'Libraries - Permissive', description: 'MIT 라이센스 오픈소스 라이브러리' },
  en: { title: 'Libraries - Permissive', description: 'MIT licensed open source libraries' },
};

export const sitemapMeta = {
  ko: { title: '사이트맵 - Permissive', description: 'Permissive 사이트의 모든 페이지 목록' },
  en: { title: 'Sitemap - Permissive', description: 'Complete list of all pages on Permissive' },
};

export const tagsMeta = {
  ko: {
    title: '태그 목록 | Permissive',
    description: `${totalLibraryTagCount}개의 태그로 라이브러리 탐색하기`,
    keywords: ['라이브러리 태그', '태그 목록', '오픈소스', 'library tags'],
  },
  en: {
    title: 'All Tags | Permissive',
    description: `Browse ${totalLibraryTagCount} tags to explore libraries`,
    keywords: ['library tags', 'tag list', 'open source', 'free libraries'],
  },
};

/** 태그 목록 (tags 라우트에서 참조 — import 한 곳으로 통일) */
export { allLibraryTags, totalLibraryTagCount };

export const webApiMeta = {
  ko: { title: 'Web API - Permissive', description: '브라우저에 내장된 웹 표준 API' },
  en: { title: 'Web API - Permissive', description: 'Browser built-in Web Standard APIs' },
};

/* =============================================================================
 * 동적 라우트 공유 헬퍼 (loader / head builder / canonical)
 * en/ko 라우트 쌍이 공유하는 로직. 페이지 컴포넌트 UI는 각 라우트에 유지합니다.
 * =========================================================================== */

export type CategoryRouteLoaderData = {
  category: CategoryMeta;
  libraries: Library[];
  categoryId: string;
};

export async function categoryRouteLoader({
  params,
}: {
  params: { categoryId: string };
}): Promise<CategoryRouteLoaderData> {
  const category = getCategoryBySlug(params.categoryId);
  if (!category) {
    throw new Response('Not Found', { status: 404 });
  }
  const libraries = getLibrariesByCategorySlug(params.categoryId);
  return { category, libraries, categoryId: params.categoryId };
}

export function buildCategoryRouteHead(data: CategoryRouteLoaderData | undefined) {
  if (!data?.category) {
    return {
      ko: { title: 'Not Found - Permissive' },
      en: { title: 'Not Found - Permissive' },
    };
  }
  const cat = data.category;
  return {
    ko: {
      title: `${cat.name.ko} 라이브러리 - Permissive`,
      description: cat.description.ko,
    },
    en: {
      title: `${cat.name.en} Libraries - Permissive`,
      description: cat.description.en,
    },
  };
}

export function categoryCanonicalPath(data: CategoryRouteLoaderData): string {
  return `/category/${data.categoryId}`;
}

/* ---------- library/$slug ---------- */

export type LibraryRouteLoaderData = { library: Library; related: Library[] };

export async function libraryRouteLoader({
  params,
}: {
  params: { slug: string };
}): Promise<LibraryRouteLoaderData> {
  const library = getLibraryBySlug(params.slug);
  if (!library) {
    throw new Response('Not Found', { status: 404 });
  }
  const related = getRelatedLibraries(library);
  return { library, related };
}

export function buildLibraryRouteHead(data: LibraryRouteLoaderData | undefined) {
  if (!data?.library) {
    return {
      ko: { title: 'Not Found - Permissive' },
      en: { title: 'Not Found - Permissive' },
    };
  }
  const lib = data.library;
  const tags = lib.tags || [];
  return {
    ko: {
      title: `${lib.name} - Permissive`,
      description: lib.descriptionKo,
      keywords: [
        lib.name,
        `${lib.name} 라이브러리`,
        lib.license,
        lib.category,
        '오픈소스',
        '무료 라이브러리',
        ...tags.slice(0, 3),
      ],
    },
    en: {
      title: `${lib.name} - Permissive`,
      description: lib.description,
      keywords: [
        lib.name,
        `${lib.name} library`,
        lib.license,
        lib.category,
        'open source',
        'free library',
        ...tags.slice(0, 3),
      ],
    },
  };
}

export function libraryCanonicalPath(data: LibraryRouteLoaderData): string {
  return `/library/${getLibrarySlug(data.library.name)}`;
}

/* ---------- tag/$tagId (loader에서 href 생성 제거 — 컴포넌트가 localePath로 생성) ---------- */

export type TagRouteLoaderData = {
  tag: string;
  libraries: Library[];
  relatedTags: { tag: string; count: number }[];
};

export async function tagRouteLoader({
  params,
}: {
  params: { tagId: string };
}): Promise<TagRouteLoaderData> {
  const tag = decodeURIComponent(params.tagId);
  const libraries = getLibrariesByTag(tag);

  if (libraries.length === 0) {
    throw notFound();
  }

  const relatedTagCounts = new Map<string, number>();
  for (const lib of libraries) {
    for (const t of lib.tags || []) {
      if (t !== tag) {
        relatedTagCounts.set(t, (relatedTagCounts.get(t) || 0) + 1);
      }
    }
  }

  const relatedTags = Array.from(relatedTagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([t, count]) => ({ tag: t, count }));

  return { tag, libraries, relatedTags };
}

export function buildTagRouteHead(data: TagRouteLoaderData | undefined) {
  if (!data?.tag) {
    return {
      ko: { title: 'Not Found - Permissive' },
      en: { title: 'Not Found - Permissive' },
    };
  }
  const { tag, libraries } = data;
  return {
    ko: {
      title: `#${tag} 태그 | Permissive`,
      description: `"${tag}" 태그가 붙은 ${libraries.length}개의 라이브러리`,
      keywords: [tag, '라이브러리 태그', '오픈소스', 'library tag'],
    },
    en: {
      title: `#${tag} Tag | Permissive`,
      description: `${libraries.length} libraries tagged with "${tag}"`,
      keywords: [tag, 'library tag', 'open source', 'free libraries'],
    },
  };
}

export function tagCanonicalPath(data: TagRouteLoaderData): string {
  return `/tag/${encodeURIComponent(data.tag)}`;
}

/* ---------- web-api/$slug ---------- */

export type WebApiRouteLoaderData = { api: WebAPI; related: WebAPI[] };

export async function webApiRouteLoader({
  params,
}: {
  params: { slug: string };
}): Promise<WebApiRouteLoaderData> {
  const api = getWebApiBySlug(params.slug);
  if (!api) {
    throw new Response('Not Found', { status: 404 });
  }
  const related = getRelatedWebApis(api);
  return { api, related };
}

export function buildWebApiRouteHead(data: WebApiRouteLoaderData | undefined) {
  if (!data?.api) {
    return {
      ko: { title: 'Not Found - Permissive' },
      en: { title: 'Not Found - Permissive' },
    };
  }
  const api = data.api;
  return {
    ko: {
      title: `${api.name} - Permissive`,
      description: api.descriptionKo,
      keywords: [
        api.name,
        `${api.name} API`,
        'Web API',
        api.category,
        '브라우저 API',
        'JavaScript API',
        'MDN',
      ],
    },
    en: {
      title: `${api.name} - Permissive`,
      description: api.description,
      keywords: [
        api.name,
        `${api.name} API`,
        'Web API',
        api.category,
        'browser API',
        'JavaScript API',
        'MDN',
      ],
    },
  };
}

export function webApiCanonicalPath(data: WebApiRouteLoaderData): string {
  return `/web-api/${getWebApiSlug(data.api.name)}`;
}
