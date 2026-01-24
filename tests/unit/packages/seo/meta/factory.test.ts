/**
 * @fileoverview Unit tests for SEO meta factory
 *
 * Tests for React Router v7 meta function factories:
 * - metaFactory - static pages
 * - dynamicMetaFactory - dynamic pages with loader data
 */

import { dynamicMetaFactory, metaFactory } from '@soundblue/seo/meta';
import { describe, expect, it } from 'vitest';

const mockLocalizedMeta = {
  ko: { title: '테스트 제목', description: '테스트 설명', keywords: ['키워드1', '키워드2'] },
  en: { title: 'Test Title', description: 'Test Description', keywords: ['keyword1', 'keyword2'] },
};

const baseUrl = 'https://test.example.com';

describe('metaFactory', () => {
  it('should return a function', () => {
    const meta = metaFactory(mockLocalizedMeta, baseUrl);
    expect(typeof meta).toBe('function');
  });

  it('should return English meta for English path', () => {
    const meta = metaFactory(mockLocalizedMeta, baseUrl);
    const result = meta({ location: { pathname: '/about' } });

    expect(result).toContainEqual({ title: 'Test Title' });
    expect(result).toContainEqual({ name: 'description', content: 'Test Description' });
    expect(result).toContainEqual({ name: 'keywords', content: 'keyword1, keyword2' });
  });

  it('should return Korean meta for Korean path', () => {
    const meta = metaFactory(mockLocalizedMeta, baseUrl);
    const result = meta({ location: { pathname: '/ko/about' } });

    expect(result).toContainEqual({ title: '테스트 제목' });
    expect(result).toContainEqual({ name: 'description', content: '테스트 설명' });
    expect(result).toContainEqual({ name: 'keywords', content: '키워드1, 키워드2' });
  });

  it('should generate canonical link tag for English path', () => {
    const meta = metaFactory(mockLocalizedMeta, baseUrl);
    const result = meta({ location: { pathname: '/about' } });

    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: 'https://test.example.com/about',
    });
  });

  it('should generate canonical link tag for Korean path', () => {
    const meta = metaFactory(mockLocalizedMeta, baseUrl);
    const result = meta({ location: { pathname: '/ko/about' } });

    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: 'https://test.example.com/ko/about',
    });
  });

  it('should generate hreflang alternate link tags', () => {
    const meta = metaFactory(mockLocalizedMeta, baseUrl);
    const result = meta({ location: { pathname: '/about' } });

    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'en',
      href: 'https://test.example.com/about',
    });
    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'ko',
      href: 'https://test.example.com/ko/about',
    });
    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'x-default',
      href: 'https://test.example.com/about',
    });
  });

  it('should handle root path correctly', () => {
    const meta = metaFactory(mockLocalizedMeta, baseUrl);
    const result = meta({ location: { pathname: '/' } });

    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: 'https://test.example.com',
    });
    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'ko',
      href: 'https://test.example.com/ko',
    });
  });

  it('should handle meta without description', () => {
    const metaWithoutDesc = {
      ko: { title: '제목만' },
      en: { title: 'Title Only' },
    };
    const meta = metaFactory(metaWithoutDesc, baseUrl);
    const result = meta({ location: { pathname: '/' } });

    expect(result).toContainEqual({ title: 'Title Only' });
    expect(result).not.toContainEqual(
      expect.objectContaining({ name: 'description' }),
    );
  });

  it('should handle meta without keywords', () => {
    const metaWithoutKeywords = {
      ko: { title: '제목', description: '설명' },
      en: { title: 'Title', description: 'Desc' },
    };
    const meta = metaFactory(metaWithoutKeywords, baseUrl);
    const result = meta({ location: { pathname: '/' } });

    expect(result).not.toContainEqual(
      expect.objectContaining({ name: 'keywords' }),
    );
  });

  it('should handle empty keywords array', () => {
    const metaWithEmptyKeywords = {
      ko: { title: '제목', keywords: [] },
      en: { title: 'Title', keywords: [] },
    };
    const meta = metaFactory(metaWithEmptyKeywords, baseUrl);
    const result = meta({ location: { pathname: '/' } });

    expect(result).not.toContainEqual(
      expect.objectContaining({ name: 'keywords' }),
    );
  });

  it('should strip trailing slash from baseUrl', () => {
    const meta = metaFactory(mockLocalizedMeta, 'https://test.example.com/');
    const result = meta({ location: { pathname: '/about' } });

    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: 'https://test.example.com/about',
    });
  });

  it('should handle path without leading slash', () => {
    const meta = metaFactory(mockLocalizedMeta, baseUrl);
    // Edge case: pathname without leading slash (shouldn't happen in practice)
    const result = meta({ location: { pathname: 'about' } });

    // Should still work and add the slash
    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: 'https://test.example.com/about',
    });
  });
});

describe('dynamicMetaFactory', () => {
  interface TestData {
    entry: { korean: string; english: string; desc: string };
  }

  const getMeta = (data: TestData) => ({
    ko: { title: `${data.entry.korean} - 앱`, description: data.entry.desc },
    en: { title: `${data.entry.english} - App`, description: data.entry.desc },
  });

  it('should return a function', () => {
    const meta = dynamicMetaFactory(getMeta, baseUrl);
    expect(typeof meta).toBe('function');
  });

  it('should use loader data for English path', () => {
    const meta = dynamicMetaFactory(getMeta, baseUrl);
    const result = meta({
      data: { entry: { korean: '안녕', english: 'Hello', desc: 'Greeting' } },
      location: { pathname: '/entry/hello' },
    });

    expect(result).toContainEqual({ title: 'Hello - App' });
    expect(result).toContainEqual({ name: 'description', content: 'Greeting' });
  });

  it('should use loader data for Korean path', () => {
    const meta = dynamicMetaFactory(getMeta, baseUrl);
    const result = meta({
      data: { entry: { korean: '안녕', english: 'Hello', desc: 'Greeting' } },
      location: { pathname: '/ko/entry/hello' },
    });

    expect(result).toContainEqual({ title: '안녕 - 앱' });
    expect(result).toContainEqual({ name: 'description', content: 'Greeting' });
  });

  it('should generate correct SEO links for dynamic pages', () => {
    const meta = dynamicMetaFactory(getMeta, baseUrl);
    const result = meta({
      data: { entry: { korean: '안녕', english: 'Hello', desc: 'Greeting' } },
      location: { pathname: '/entry/hello' },
    });

    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: 'https://test.example.com/entry/hello',
    });
    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'ko',
      href: 'https://test.example.com/ko/entry/hello',
    });
  });

  it('should handle dynamic data with keywords', () => {
    const getMetaWithKeywords = (data: TestData) => ({
      ko: { title: data.entry.korean, keywords: ['한국어', '키워드'] },
      en: { title: data.entry.english, keywords: ['english', 'keyword'] },
    });

    const meta = dynamicMetaFactory(getMetaWithKeywords, baseUrl);
    const result = meta({
      data: { entry: { korean: '안녕', english: 'Hello', desc: '' } },
      location: { pathname: '/' },
    });

    expect(result).toContainEqual({ name: 'keywords', content: 'english, keyword' });
  });
});
