/**
 * @fileoverview SEO Edge Cases and Boundary Value Tests
 *
 * 검색 엔진 최적화를 위한 엣지 케이스 및 경계값 테스트.
 * - HTML/XML 특수 문자 이스케이프
 * - XSS 방지 (JSON-LD 스크립트 주입)
 * - 유니코드/다국어 처리
 * - 경계값 테스트 (제목/설명 길이)
 * - URL 검증
 * - 날짜 형식 검증
 */

import {
  generateBreadcrumbSchema,
  generateDefinedTermSchema,
  generateJsonLdScript,
  generateWebsiteSchema,
  serializeSchema,
} from '@soundblue/seo/structured-data';
import {
  createDynamicUrls,
  generateSitemap,
  generateSitemapIndex,
  generateUrlEntries,
} from '@soundblue/seo/sitemap';
import { generateHreflangLinks, generateSEOMeta, sanitizeSEOString } from '@soundblue/seo/meta';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ============================================================================
// 1. HTML/XML 특수 문자 이스케이프 테스트
// ============================================================================

describe('HTML/XML Special Character Escaping', () => {
  describe('Meta Tags - Special Characters', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    it('should handle ampersand in title', () => {
      const meta = generateSEOMeta({
        title: 'Tom & Jerry - Classic Animation for Entertainment',
        description:
          'A classic cartoon featuring the rivalry between Tom the cat and Jerry the mouse.',
        url: 'https://example.com/tom-jerry',
        locale: 'en_US',
      });

      const titleMeta = meta.find((m) => 'title' in m);
      expect(titleMeta).toBeDefined();
      // 메타 태그에서 & 문자는 그대로 유지 (브라우저가 처리)
      expect((titleMeta as { title: string }).title).toContain('&');
    });

    it('should handle quotes in description', () => {
      const meta = generateSEOMeta({
        title: 'Famous Quotes Collection for Daily Inspiration',
        description:
          'Collection of quotes like "Hello World" and \'Goodbye\' for daily inspiration and motivation.',
        url: 'https://example.com/quotes',
        locale: 'en_US',
      });

      const descMeta = meta.find((m) => 'name' in m && m.name === 'description');
      expect(descMeta).toBeDefined();
    });

    it('should handle angle brackets in content', () => {
      const meta = generateSEOMeta({
        title: 'HTML Tags Guide: <div> and <span> Elements Tutorial',
        description:
          'Learn about HTML elements like <div> and <span> tags for web development basics.',
        url: 'https://example.com/html-tags',
        locale: 'en_US',
      });

      const titleMeta = meta.find((m) => 'title' in m);
      expect(titleMeta).toBeDefined();
    });
  });

  describe('Sitemap - XML Special Characters', () => {
    const siteUrl = 'https://example.com';
    const languages = ['en', 'ko'] as const;

    it('should escape ampersand in URL path', () => {
      const entries = generateUrlEntries(
        siteUrl,
        '/search?q=tom&jerry',
        '0.8',
        'weekly',
        languages,
        '2024-01-01',
      );
      const entry = entries.join('\n');

      // XML에서 &는 &amp;로 이스케이프되어야 함
      expect(entry).toContain('&amp;');
      expect(entry).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
    });

    it('should handle special characters in dynamic URLs', () => {
      const urls = createDynamicUrls(
        siteUrl,
        '/entry',
        ['hello&world', 'test<script>'],
        '0.7',
        'weekly',
        languages,
      );

      // URL은 인코딩되어야 함
      for (const url of urls) {
        expect(url).not.toContain('<script>');
      }
    });
  });

  describe('JSON-LD - Script Injection Prevention', () => {
    it('should handle script tags in JSON-LD content safely', () => {
      const schema = generateDefinedTermSchema({
        name: '</script><script>alert("xss")</script>',
        description: 'Test description for XSS prevention testing',
        url: 'https://example.com/test',
      });

      const serialized = serializeSchema(schema);

      // JSON 직렬화가 정상적으로 되어야 함
      expect(() => JSON.parse(serialized)).not.toThrow();
      // 스키마 데이터가 보존되어야 함
      expect(schema.name).toContain('script');
    });

    it('should prevent JSON injection via special characters', () => {
      const schema = generateWebsiteSchema({
        name: 'Test", "malicious": "data',
        url: 'https://example.com',
        description: 'Valid description for JSON injection test',
      });

      const serialized = serializeSchema(schema);

      // JSON 파싱이 정상적으로 되어야 함
      expect(() => JSON.parse(serialized)).not.toThrow();
    });
  });
});

// ============================================================================
// 2. 유니코드/다국어 처리 테스트
// ============================================================================

describe('Unicode and Multilingual Support', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('Korean Characters', () => {
    it('should handle Korean title and description', () => {
      const meta = generateSEOMeta({
        title: '안녕하세요 - 한국어 인사말 배우기 | Context 사전',
        description:
          '한국어로 "안녕하세요"는 정중한 인사말입니다. 발음과 사용법을 배워보세요.',
        url: 'https://context.soundbluemusic.com/entry/annyeonghaseyo',
        locale: 'ko_KR',
      });

      const titleMeta = meta.find((m) => 'title' in m);
      expect((titleMeta as { title: string }).title).toContain('안녕하세요');
    });

    it('should generate valid hreflang for Korean paths', () => {
      const links = generateHreflangLinks('/ko/entry/감사합니다', 'https://example.com');

      const canonical = links.find((l) => l.rel === 'canonical');
      expect(canonical?.href).toContain('감사합니다');
    });

    it('should handle Korean in JSON-LD schema', () => {
      const schema = generateDefinedTermSchema({
        name: '감사합니다',
        description: 'Thank you in Korean - 한국어로 고마움을 표현하는 말',
        url: 'https://context.soundbluemusic.com/entry/gamsahamnida',
        termCode: 'gamsahamnida',
        inLanguage: 'ko',
      });

      expect(schema.name).toBe('감사합니다');
      const serialized = serializeSchema(schema);
      expect(() => JSON.parse(serialized)).not.toThrow();
    });
  });

  describe('Emoji Handling', () => {
    it('should handle emoji in title', () => {
      const meta = generateSEOMeta({
        title: '🎉 Celebration Guide - Party Planning Tips and Ideas',
        description:
          'Learn how to plan the perfect celebration with our comprehensive guide.',
        url: 'https://example.com/celebration',
        locale: 'en_US',
      });

      const titleMeta = meta.find((m) => 'title' in m);
      expect((titleMeta as { title: string }).title).toContain('🎉');
    });

    it('should handle emoji in JSON-LD', () => {
      const schema = generateDefinedTermSchema({
        name: '😀 Smile',
        description: 'A happy smiling face emoji for positive expressions',
        url: 'https://example.com/emoji/smile',
      });

      const serialized = serializeSchema(schema);
      expect(() => JSON.parse(serialized)).not.toThrow();
    });
  });

  describe('Mixed Language Content', () => {
    it('should handle mixed Korean and English', () => {
      const meta = generateSEOMeta({
        title: '안녕 (Annyeong) - Hello in Korean | Context Dictionary',
        description:
          'Learn the Korean word 안녕 (annyeong) meaning hello or goodbye in casual situations.',
        url: 'https://context.soundbluemusic.com/entry/annyeong',
        locale: 'en_US',
      });

      const ogTitle = meta.find((m) => 'property' in m && m.property === 'og:title');
      expect(ogTitle).toBeDefined();
    });
  });
});

// ============================================================================
// 3. 경계값 테스트 (Title/Description Length)
// ============================================================================

describe('Boundary Value Tests for SEO Length', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Title Length Boundaries', () => {
    // Implementation uses 30-60 characters for titles

    it('should NOT warn for title at minimum boundary (30 chars)', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      // Exactly 30 characters
      const title30 = 'a'.repeat(30);
      generateSEOMeta({
        title: title30,
        description:
          'This is a valid description that meets the recommended length requirements for SEO optimization and search engines.',
        url: 'https://example.com',
        locale: 'en_US',
      });

      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should warn for title below minimum (29 chars)', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const title29 = 'a'.repeat(29);
      generateSEOMeta({
        title: title29,
        description:
          'This is a valid description that meets the recommended length requirements for SEO optimization and search engines.',
        url: 'https://example.com',
        locale: 'en_US',
      });

      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Title length'));
    });

    it('should NOT warn for title at maximum boundary (60 chars)', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      // Exactly 60 characters
      const title60 = 'a'.repeat(60);
      generateSEOMeta({
        title: title60,
        description:
          'This is a valid description that meets the recommended length requirements for SEO optimization and search engines.',
        url: 'https://example.com',
        locale: 'en_US',
      });

      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should warn for title above maximum (61 chars)', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const title61 = 'a'.repeat(61);
      generateSEOMeta({
        title: title61,
        description:
          'This is a valid description that meets the recommended length requirements for SEO optimization and search engines.',
        url: 'https://example.com',
        locale: 'en_US',
      });

      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Title length'));
    });
  });

  describe('Description Length Boundaries', () => {
    // Google recommends 50-160 characters for descriptions

    it('should NOT warn for description at minimum boundary (50 chars)', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const desc50 = 'a'.repeat(50);
      generateSEOMeta({
        title: 'Valid Title for Testing SEO Functions',
        description: desc50,
        url: 'https://example.com',
        locale: 'en_US',
      });

      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should warn for description below minimum (49 chars)', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const desc49 = 'a'.repeat(49);
      generateSEOMeta({
        title: 'Valid Title for Testing SEO Functions',
        description: desc49,
        url: 'https://example.com',
        locale: 'en_US',
      });

      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Description length'));
    });

    it('should NOT warn for description at maximum boundary (160 chars)', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const desc160 = 'a'.repeat(160);
      generateSEOMeta({
        title: 'Valid Title for Testing SEO Functions',
        description: desc160,
        url: 'https://example.com',
        locale: 'en_US',
      });

      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should warn for description above maximum (161 chars)', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const desc161 = 'a'.repeat(161);
      generateSEOMeta({
        title: 'Valid Title for Testing SEO Functions',
        description: desc161,
        url: 'https://example.com',
        locale: 'en_US',
      });

      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Description length'));
    });
  });

  describe('sanitizeSEOString Boundaries', () => {
    it('should not modify string at exactly max length', () => {
      const str160 = 'a'.repeat(160);
      expect(sanitizeSEOString(str160, 160)).toBe(str160);
      expect(sanitizeSEOString(str160, 160)).toHaveLength(160);
    });

    it('should truncate string at max length + 1', () => {
      const str161 = 'a'.repeat(161);
      expect(sanitizeSEOString(str161, 160)).toHaveLength(160);
    });

    it('should handle zero max length', () => {
      expect(sanitizeSEOString('hello', 0)).toBe('');
    });
  });
});

// ============================================================================
// 4. URL 검증 테스트
// ============================================================================

describe('URL Validation and Edge Cases', () => {
  describe('URL Format Validation', () => {
    it('should handle URL without trailing slash', () => {
      const links = generateHreflangLinks('/about', 'https://example.com');
      const canonical = links.find((l) => l.rel === 'canonical');
      expect(canonical?.href).toBe('https://example.com/about');
    });

    it('should handle baseUrl with trailing slash', () => {
      const links = generateHreflangLinks('/about', 'https://example.com/');
      const canonical = links.find((l) => l.rel === 'canonical');
      expect(canonical?.href).not.toContain('//about');
    });

    it('should handle root path', () => {
      const links = generateHreflangLinks('/', 'https://example.com');
      const canonical = links.find((l) => l.rel === 'canonical');
      expect(canonical?.href).toBe('https://example.com');
    });

    it('should handle path with multiple slashes', () => {
      const links = generateHreflangLinks('/category/subcategory/item', 'https://example.com');
      const canonical = links.find((l) => l.rel === 'canonical');
      expect(canonical?.href).toBe('https://example.com/category/subcategory/item');
    });
  });

  describe('Sitemap URL Validation', () => {
    const siteUrl = 'https://example.com';
    const languages = ['en', 'ko'] as const;

    it('should generate valid absolute URLs in sitemap', () => {
      const sitemap = generateSitemap(
        generateUrlEntries(siteUrl, '/', '1.0', 'daily', languages, '2024-01-01'),
      );

      expect(sitemap).toContain('https://');
      expect(sitemap).not.toContain('localhost');
      expect(sitemap).not.toContain('undefined');
      expect(sitemap).not.toContain('null');
    });

    it('should handle very long URLs', () => {
      const longPath = '/category/' + 'a'.repeat(500);
      const entry = generateUrlEntries(siteUrl, longPath, '0.5', 'monthly', languages).join('\n');

      expect(entry).toContain('<loc>');
      expect(entry).toContain('</loc>');
    });

    it('should handle URL with query parameters', () => {
      const entry = generateUrlEntries(
        siteUrl,
        '/search?q=test&page=1',
        '0.5',
        'daily',
        languages,
      ).join('\n');

      // Query parameters should be XML-escaped
      expect(entry).toContain('&amp;');
    });
  });

  describe('Sitemap Index Validation', () => {
    it('should generate valid sitemap index', () => {
      const index = generateSitemapIndex(
        'https://example.com',
        ['sitemap-1.xml', 'sitemap-2.xml'],
        '2024-01-15',
      );

      expect(index).toContain('<?xml version="1.0"');
      expect(index).toContain('<sitemapindex');
      expect(index).toContain('</sitemapindex>');
      expect(index).toContain('<loc>https://example.com/sitemap-1.xml</loc>');
    });

    it('should validate date format in sitemap', () => {
      const index = generateSitemapIndex(
        'https://example.com',
        ['sitemap.xml'],
        '2024-01-15',
      );

      // lastmod should be in ISO 8601 format
      expect(index).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });
  });
});

// ============================================================================
// 5. JSON-LD 구조화 데이터 엣지 케이스
// ============================================================================

describe('JSON-LD Structured Data Edge Cases', () => {
  describe('Empty and Null Values', () => {
    it('should handle breadcrumb with single item', () => {
      const schema = generateBreadcrumbSchema([
        { name: 'Home', url: 'https://example.com' },
      ]) as Record<string, unknown>;

      const items = schema.itemListElement as Array<Record<string, unknown>>;
      expect(items).toHaveLength(1);
      expect(items[0].position).toBe(1);
    });

    it('should handle website schema with minimal data', () => {
      const schema = generateWebsiteSchema({
        name: 'Site',
        url: 'https://example.com',
      });

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema).not.toHaveProperty('description');
    });

    it('should not include undefined optional fields', () => {
      const schema = generateDefinedTermSchema({
        name: 'Term',
        description: 'A term definition',
        url: 'https://example.com/term',
        // Optional fields not provided
      });

      expect(schema).not.toHaveProperty('termCode');
      expect(schema).not.toHaveProperty('inDefinedTermSet');
      expect(schema).not.toHaveProperty('inLanguage');
    });
  });

  describe('Special Values in Schema', () => {
    it('should handle very long description in schema', () => {
      const longDesc = 'a'.repeat(1000);
      const schema = generateDefinedTermSchema({
        name: 'Term',
        description: longDesc,
        url: 'https://example.com/term',
      });

      expect(schema.description).toBe(longDesc);
      const serialized = serializeSchema(schema);
      expect(() => JSON.parse(serialized)).not.toThrow();
    });

    it('should handle numeric-like strings', () => {
      const schema = generateDefinedTermSchema({
        name: '123',
        description: '456789 is a number-like string in description',
        url: 'https://example.com/123',
        termCode: '789',
      });

      expect(typeof schema.name).toBe('string');
      expect(typeof schema.termCode).toBe('string');
    });

    it('should preserve boolean-like strings', () => {
      const schema = generateDefinedTermSchema({
        name: 'true',
        description: 'A term that looks like boolean value true',
        url: 'https://example.com/true',
      });

      expect(schema.name).toBe('true');
      expect(typeof schema.name).toBe('string');
    });
  });

  describe('Nested Schema Validation', () => {
    it('should generate valid nested breadcrumb schema', () => {
      const items = Array.from({ length: 10 }, (_, i) => ({
        name: `Level ${i + 1}`,
        url: `https://example.com/level-${i + 1}`,
      }));

      const schema = generateBreadcrumbSchema(items) as Record<string, unknown>;
      const listItems = schema.itemListElement as Array<Record<string, unknown>>;

      expect(listItems).toHaveLength(10);
      expect(listItems[9].position).toBe(10);
    });
  });
});

// ============================================================================
// 6. 실제 앱별 SEO 시나리오 테스트
// ============================================================================

describe('App-Specific SEO Scenarios', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('Context App - Korean Dictionary', () => {
    it('should generate valid SEO for Korean entry', () => {
      const meta = generateSEOMeta({
        title: '안녕 - Hi / Bye | Context Korean Dictionary',
        description:
          '안녕 (annyeong): A casual Korean greeting meaning "hi" or "bye" used among friends.',
        url: 'https://context.soundbluemusic.com/entry/annyeong',
        locale: 'en_US',
        image: 'https://context.soundbluemusic.com/og-image.png',
      });

      expect(meta.find((m) => 'title' in m)).toBeDefined();
      expect(meta.find((m) => 'property' in m && m.property === 'og:title')).toBeDefined();
      expect(meta.find((m) => 'name' in m && m.name === 'twitter:card')).toBeDefined();
    });

    it('should generate valid DefinedTerm schema for dictionary entry', () => {
      const schema = generateDefinedTermSchema({
        name: '감사합니다',
        description: 'Thank you - Formal Korean expression of gratitude',
        url: 'https://context.soundbluemusic.com/entry/gamsahamnida',
        termCode: 'gamsahamnida',
        inDefinedTermSet: 'Korean Vocabulary',
        inLanguage: 'ko',
        educationalLevel: 'beginner',
      });

      expect(schema['@type']).toBe('DefinedTerm');
      expect(schema.inDefinedTermSet).toBe('Korean Vocabulary');
    });
  });

  describe('Roots App - Math Documentation', () => {
    it('should generate valid SEO for math concept', () => {
      const meta = generateSEOMeta({
        title: 'Variables | Algebra | Roots Math Documentation',
        description:
          'Learn about variables in algebra - symbols representing unknown or changeable values.',
        url: 'https://roots.soundbluemusic.com/concept/variables',
        locale: 'en_US',
      });

      expect(meta).toContainEqual(
        expect.objectContaining({ property: 'og:type', content: 'website' }),
      );
    });
  });

  describe('Permissive App - Web Dev Resources', () => {
    it('should generate valid SEO for library page', () => {
      const meta = generateSEOMeta({
        title: 'React - Permissive Web Development Resources',
        description:
          'A JavaScript library for building user interfaces. MIT licensed, open source.',
        url: 'https://permissive.soundbluemusic.com/library/react',
        locale: 'en_US',
      });

      expect(meta.find((m) => 'title' in m)).toBeDefined();
    });
  });
});
