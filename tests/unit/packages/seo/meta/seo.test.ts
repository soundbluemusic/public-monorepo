/**
 * @fileoverview Tests for SEO helper functions
 */

import { generateHreflangLinks, generateSEOMeta, sanitizeSEOString } from '@soundblue/seo/meta';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('generateSEOMeta', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  const validOptions = {
    title: 'Page Title - Site Name for Best Results',
    description:
      'This is a valid description that meets the recommended length requirements for SEO optimization.',
    url: 'https://example.com/page',
    locale: 'en_US',
    image: 'https://example.com/image.png',
  };

  it('should generate basic meta tags', () => {
    const meta = generateSEOMeta(validOptions);

    expect(meta).toContainEqual({ title: validOptions.title });
    expect(meta).toContainEqual({ name: 'description', content: validOptions.description });
  });

  it('should generate Open Graph meta tags', () => {
    const meta = generateSEOMeta(validOptions);

    expect(meta).toContainEqual({ property: 'og:type', content: 'website' });
    expect(meta).toContainEqual({ property: 'og:title', content: validOptions.title });
    expect(meta).toContainEqual({ property: 'og:description', content: validOptions.description });
    expect(meta).toContainEqual({ property: 'og:url', content: validOptions.url });
    expect(meta).toContainEqual({ property: 'og:locale', content: validOptions.locale });
    expect(meta).toContainEqual({ property: 'og:image', content: validOptions.image });
    expect(meta).toContainEqual({ property: 'og:image:width', content: '1200' });
    expect(meta).toContainEqual({ property: 'og:image:height', content: '630' });
  });

  it('should generate Twitter Card meta tags', () => {
    const meta = generateSEOMeta(validOptions);

    expect(meta).toContainEqual({ name: 'twitter:card', content: 'summary_large_image' });
    expect(meta).toContainEqual({ name: 'twitter:title', content: validOptions.title });
    expect(meta).toContainEqual({ name: 'twitter:description', content: validOptions.description });
    expect(meta).toContainEqual({ name: 'twitter:image', content: validOptions.image });
  });

  it('should include author when provided', () => {
    const meta = generateSEOMeta({ ...validOptions, author: 'John Doe' });
    expect(meta).toContainEqual({ name: 'author', content: 'John Doe' });
  });

  it('should include twitter:site when provided', () => {
    const meta = generateSEOMeta({ ...validOptions, twitterSite: '@example' });
    expect(meta).toContainEqual({ name: 'twitter:site', content: '@example' });
  });

  it('should include imageAlt when provided', () => {
    const meta = generateSEOMeta({ ...validOptions, imageAlt: 'Image description' });
    expect(meta).toContainEqual({ property: 'og:image:alt', content: 'Image description' });
    expect(meta).toContainEqual({ name: 'twitter:image:alt', content: 'Image description' });
  });

  it('should support article type', () => {
    const meta = generateSEOMeta({ ...validOptions, type: 'article' });
    expect(meta).toContainEqual({ property: 'og:type', content: 'article' });
  });

  it('should warn for short description', () => {
    generateSEOMeta({ ...validOptions, description: 'Too short' });
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Description length'));
  });

  it('should warn for long description', () => {
    const longDesc = 'a'.repeat(200);
    generateSEOMeta({ ...validOptions, description: longDesc });
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Description length'));
  });

  it('should warn for short title', () => {
    generateSEOMeta({ ...validOptions, title: 'Short' });
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Title length'));
  });

  it('should warn for long title', () => {
    const longTitle = 'a'.repeat(80);
    generateSEOMeta({ ...validOptions, title: longTitle });
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Title length'));
  });
});

describe('generateHreflangLinks', () => {
  const baseUrl = 'https://example.com';
  const locales = ['en', 'ko'];

  it('should generate canonical link', () => {
    const links = generateHreflangLinks('/about', baseUrl, locales);
    const canonical = links.find((l) => l.rel === 'canonical');
    expect(canonical).toBeDefined();
    expect(canonical?.href).toContain('/about');
  });

  it('should generate hreflang links for all locales', () => {
    const links = generateHreflangLinks('/about', baseUrl, locales);
    const alternates = links.filter((l) => l.rel === 'alternate' && l.hreflang !== 'x-default');
    expect(alternates).toHaveLength(2);
    expect(alternates.map((l) => l.hreflang)).toContain('en');
    expect(alternates.map((l) => l.hreflang)).toContain('ko');
  });

  it('should generate x-default link', () => {
    const links = generateHreflangLinks('/about', baseUrl, locales);
    const xDefault = links.find((l) => l.hreflang === 'x-default');
    expect(xDefault).toBeDefined();
    expect(xDefault?.rel).toBe('alternate');
  });

  it('should detect Korean locale from path', () => {
    const links = generateHreflangLinks('/ko/about', baseUrl, locales);
    const canonical = links.find((l) => l.rel === 'canonical');
    expect(canonical?.href).toContain('/ko/about');
  });

  it('should detect English locale from path', () => {
    const links = generateHreflangLinks('/en/about', baseUrl, locales);
    const canonical = links.find((l) => l.rel === 'canonical');
    expect(canonical?.href).toContain('/en/about');
  });

  it('should strip locale from path for alternate links', () => {
    const links = generateHreflangLinks('/ko/about', baseUrl, locales);
    const enLink = links.find((l) => l.hreflang === 'en');
    expect(enLink?.href).toBe('https://example.com/en/about');
    const koLink = links.find((l) => l.hreflang === 'ko');
    expect(koLink?.href).toBe('https://example.com/ko/about');
  });

  it('should handle root path', () => {
    const links = generateHreflangLinks('/', baseUrl, locales);
    expect(links.find((l) => l.hreflang === 'en')?.href).toBe('https://example.com/en');
    expect(links.find((l) => l.hreflang === 'ko')?.href).toBe('https://example.com/ko');
  });

  it('should handle trailing slash in baseUrl', () => {
    const links = generateHreflangLinks('/about', 'https://example.com/', locales);
    const canonical = links.find((l) => l.rel === 'canonical');
    expect(canonical?.href).not.toContain('//about');
  });

  it('should handle path without leading slash', () => {
    const links = generateHreflangLinks('about', baseUrl, locales);
    const canonical = links.find((l) => l.rel === 'canonical');
    expect(canonical?.href).toContain('/about');
  });

  it('should use custom default locale', () => {
    const links = generateHreflangLinks('/about', baseUrl, locales, 'en');
    const xDefault = links.find((l) => l.hreflang === 'x-default');
    expect(xDefault?.href).toContain('/en/about');
  });
});

describe('sanitizeSEOString', () => {
  it('should trim whitespace', () => {
    expect(sanitizeSEOString('  hello  ')).toBe('hello');
  });

  it('should limit to default 160 characters', () => {
    const longStr = 'a'.repeat(200);
    expect(sanitizeSEOString(longStr)).toHaveLength(160);
  });

  it('should limit to custom max length', () => {
    const longStr = 'a'.repeat(100);
    expect(sanitizeSEOString(longStr, 50)).toHaveLength(50);
  });

  it('should not modify short strings', () => {
    expect(sanitizeSEOString('hello', 50)).toBe('hello');
  });

  it('should handle empty string', () => {
    expect(sanitizeSEOString('')).toBe('');
  });
});
