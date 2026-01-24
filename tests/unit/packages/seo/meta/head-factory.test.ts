/**
 * @fileoverview Unit tests for SEO head-factory
 *
 * Tests for TanStack Start head function factories:
 * - headFactory - static pages
 * - dynamicHeadFactory - dynamic pages with loader data
 * - headFactoryKo/En - locale-specific factories
 * - dynamicHeadFactoryKo/En - dynamic locale-specific factories
 */

import {
  dynamicHeadFactory,
  dynamicHeadFactoryEn,
  dynamicHeadFactoryKo,
  headFactory,
  headFactoryEn,
  headFactoryKo,
} from '@soundblue/seo/meta/head-factory';
import { describe, expect, it } from 'vitest';

const mockLocalizedMeta = {
  ko: { title: '테스트 제목', description: '테스트 설명', keywords: ['키워드1', '키워드2'] },
  en: { title: 'Test Title', description: 'Test Description', keywords: ['keyword1', 'keyword2'] },
};

const baseUrl = 'https://test.example.com';

describe('headFactory', () => {
  it('should return a function', () => {
    const head = headFactory(mockLocalizedMeta, baseUrl);
    expect(typeof head).toBe('function');
  });

  it('should return English meta for English path', () => {
    const head = headFactory(mockLocalizedMeta, baseUrl);
    const result = head({ location: { pathname: '/about' } });

    expect(result.meta).toContainEqual({ title: 'Test Title' });
    expect(result.meta).toContainEqual({ name: 'description', content: 'Test Description' });
    expect(result.meta).toContainEqual({
      name: 'keywords',
      content: 'keyword1, keyword2',
    });
  });

  it('should return Korean meta for Korean path', () => {
    const head = headFactory(mockLocalizedMeta, baseUrl);
    const result = head({ location: { pathname: '/ko/about' } });

    expect(result.meta).toContainEqual({ title: '테스트 제목' });
    expect(result.meta).toContainEqual({ name: 'description', content: '테스트 설명' });
    expect(result.meta).toContainEqual({ name: 'keywords', content: '키워드1, 키워드2' });
  });

  it('should generate correct canonical URL for English path', () => {
    const head = headFactory(mockLocalizedMeta, baseUrl);
    const result = head({ location: { pathname: '/about' } });

    expect(result.links).toContainEqual({
      rel: 'canonical',
      href: 'https://test.example.com/about',
    });
  });

  it('should generate correct canonical URL for Korean path', () => {
    const head = headFactory(mockLocalizedMeta, baseUrl);
    const result = head({ location: { pathname: '/ko/about' } });

    expect(result.links).toContainEqual({
      rel: 'canonical',
      href: 'https://test.example.com/ko/about',
    });
  });

  it('should generate hreflang alternate links', () => {
    const head = headFactory(mockLocalizedMeta, baseUrl);
    const result = head({ location: { pathname: '/about' } });

    expect(result.links).toContainEqual({
      rel: 'alternate',
      hrefLang: 'en',
      href: 'https://test.example.com/about',
    });
    expect(result.links).toContainEqual({
      rel: 'alternate',
      hrefLang: 'ko',
      href: 'https://test.example.com/ko/about',
    });
    expect(result.links).toContainEqual({
      rel: 'alternate',
      hrefLang: 'x-default',
      href: 'https://test.example.com/about',
    });
  });

  it('should handle root path correctly', () => {
    const head = headFactory(mockLocalizedMeta, baseUrl);
    const result = head({ location: { pathname: '/' } });

    expect(result.links).toContainEqual({
      rel: 'canonical',
      href: 'https://test.example.com',
    });
    expect(result.links).toContainEqual({
      rel: 'alternate',
      hrefLang: 'ko',
      href: 'https://test.example.com/ko',
    });
  });

  it('should handle Korean root path correctly', () => {
    const head = headFactory(mockLocalizedMeta, baseUrl);
    const result = head({ location: { pathname: '/ko' } });

    expect(result.links).toContainEqual({
      rel: 'canonical',
      href: 'https://test.example.com/ko',
    });
  });

  it('should generate Open Graph meta tags', () => {
    const head = headFactory(mockLocalizedMeta, baseUrl);
    const result = head({ location: { pathname: '/about' } });

    expect(result.meta).toContainEqual({ property: 'og:title', content: 'Test Title' });
    expect(result.meta).toContainEqual({
      property: 'og:description',
      content: 'Test Description',
    });
  });

  it('should generate Twitter Card meta tags', () => {
    const head = headFactory(mockLocalizedMeta, baseUrl);
    const result = head({ location: { pathname: '/about' } });

    expect(result.meta).toContainEqual({ name: 'twitter:card', content: 'summary' });
    expect(result.meta).toContainEqual({ name: 'twitter:title', content: 'Test Title' });
    expect(result.meta).toContainEqual({
      name: 'twitter:description',
      content: 'Test Description',
    });
  });

  it('should handle missing location pathname gracefully', () => {
    const head = headFactory(mockLocalizedMeta, baseUrl);
    // @ts-expect-error - Testing edge case with undefined pathname
    const result = head({ location: {} });

    expect(result.meta).toContainEqual({ title: 'Test Title' });
  });

  it('should handle meta without description', () => {
    const metaWithoutDesc = {
      ko: { title: '제목만' },
      en: { title: 'Title Only' },
    };
    const head = headFactory(metaWithoutDesc, baseUrl);
    const result = head({ location: { pathname: '/' } });

    expect(result.meta).toContainEqual({ title: 'Title Only' });
    expect(result.meta).not.toContainEqual(
      expect.objectContaining({ name: 'description' }),
    );
  });

  it('should handle meta without keywords', () => {
    const metaWithoutKeywords = {
      ko: { title: '제목', description: '설명' },
      en: { title: 'Title', description: 'Desc' },
    };
    const head = headFactory(metaWithoutKeywords, baseUrl);
    const result = head({ location: { pathname: '/' } });

    expect(result.meta).not.toContainEqual(
      expect.objectContaining({ name: 'keywords' }),
    );
  });

  it('should strip trailing slash from baseUrl', () => {
    const head = headFactory(mockLocalizedMeta, 'https://test.example.com/');
    const result = head({ location: { pathname: '/about' } });

    expect(result.links).toContainEqual({
      rel: 'canonical',
      href: 'https://test.example.com/about',
    });
  });
});

describe('dynamicHeadFactory', () => {
  interface TestData {
    entry: { korean: string; english: string; desc: string };
  }

  const getMeta = (data: TestData) => ({
    ko: { title: `${data.entry.korean} - 앱`, description: data.entry.desc },
    en: { title: `${data.entry.english} - App`, description: data.entry.desc },
  });

  it('should return a function', () => {
    const head = dynamicHeadFactory(getMeta, baseUrl);
    expect(typeof head).toBe('function');
  });

  it('should use loader data for English path', () => {
    const head = dynamicHeadFactory(getMeta, baseUrl);
    const result = head({
      loaderData: { entry: { korean: '안녕', english: 'Hello', desc: 'Greeting' } },
      location: { pathname: '/entry/hello' },
    });

    expect(result.meta).toContainEqual({ title: 'Hello - App' });
    expect(result.meta).toContainEqual({ name: 'description', content: 'Greeting' });
  });

  it('should use loader data for Korean path', () => {
    const head = dynamicHeadFactory(getMeta, baseUrl);
    const result = head({
      loaderData: { entry: { korean: '안녕', english: 'Hello', desc: 'Greeting' } },
      location: { pathname: '/ko/entry/hello' },
    });

    expect(result.meta).toContainEqual({ title: '안녕 - 앱' });
  });
});

describe('headFactoryKo', () => {
  it('should always return Korean meta', () => {
    const head = headFactoryKo(mockLocalizedMeta, baseUrl);
    const result = head();

    expect(result.meta).toContainEqual({ title: '테스트 제목' });
    expect(result.meta).toContainEqual({ name: 'description', content: '테스트 설명' });
  });

  it('should generate Korean canonical URL', () => {
    const head = headFactoryKo(mockLocalizedMeta, baseUrl);
    const result = head();

    expect(result.links).toContainEqual({
      rel: 'canonical',
      href: 'https://test.example.com/ko',
    });
  });
});

describe('headFactoryEn', () => {
  it('should always return English meta', () => {
    const head = headFactoryEn(mockLocalizedMeta, baseUrl);
    const result = head();

    expect(result.meta).toContainEqual({ title: 'Test Title' });
    expect(result.meta).toContainEqual({ name: 'description', content: 'Test Description' });
  });

  it('should generate English canonical URL', () => {
    const head = headFactoryEn(mockLocalizedMeta, baseUrl);
    const result = head();

    expect(result.links).toContainEqual({
      rel: 'canonical',
      href: 'https://test.example.com',
    });
  });
});

describe('dynamicHeadFactoryKo', () => {
  interface TestData {
    entry: { title: string };
  }

  const getMeta = (data: TestData) => ({
    ko: { title: `${data.entry.title} - 앱` },
    en: { title: `${data.entry.title} - App` },
  });

  it('should always return Korean meta from loader data', () => {
    const head = dynamicHeadFactoryKo(getMeta, baseUrl);
    const result = head({
      loaderData: { entry: { title: '테스트' } },
      location: { pathname: '/ko/entry/test' },
    });

    expect(result.meta).toContainEqual({ title: '테스트 - 앱' });
  });

  it('should use custom pathname getter', () => {
    const getPathname = (data: TestData) => `/entry/${data.entry.title}`;
    const head = dynamicHeadFactoryKo(getMeta, baseUrl, getPathname);
    const result = head({
      loaderData: { entry: { title: 'test' } },
      location: { pathname: '/ko' },
    });

    expect(result.links).toContainEqual({
      rel: 'canonical',
      href: 'https://test.example.com/ko/entry/test',
    });
  });
});

describe('dynamicHeadFactoryEn', () => {
  interface TestData {
    entry: { title: string };
  }

  const getMeta = (data: TestData) => ({
    ko: { title: `${data.entry.title} - 앱` },
    en: { title: `${data.entry.title} - App` },
  });

  it('should always return English meta from loader data', () => {
    const head = dynamicHeadFactoryEn(getMeta, baseUrl);
    const result = head({
      loaderData: { entry: { title: 'Test' } },
      location: { pathname: '/entry/test' },
    });

    expect(result.meta).toContainEqual({ title: 'Test - App' });
  });

  it('should use custom pathname getter', () => {
    const getPathname = (data: TestData) => `/entry/${data.entry.title}`;
    const head = dynamicHeadFactoryEn(getMeta, baseUrl, getPathname);
    const result = head({
      loaderData: { entry: { title: 'test' } },
      location: { pathname: '/' },
    });

    expect(result.links).toContainEqual({
      rel: 'canonical',
      href: 'https://test.example.com/entry/test',
    });
  });
});
