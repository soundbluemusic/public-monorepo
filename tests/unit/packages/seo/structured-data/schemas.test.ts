/**
 * @fileoverview Tests for JSON-LD structured data schemas
 */

import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateJsonLdScript,
  generateOrganizationSchema,
  generateWebsiteSchema,
  serializeSchema,
} from '@soundblue/seo/structured-data';
import { describe, expect, it } from 'vitest';

describe('generateWebsiteSchema', () => {
  it('should generate basic website schema', () => {
    const schema = generateWebsiteSchema({
      name: 'My Site',
      url: 'https://example.com',
    });

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'My Site',
      url: 'https://example.com',
    });
  });

  it('should include description when provided', () => {
    const schema = generateWebsiteSchema({
      name: 'My Site',
      url: 'https://example.com',
      description: 'A great website',
    });

    expect(schema).toHaveProperty('description', 'A great website');
  });

  it('should include inLanguage when provided', () => {
    const schema = generateWebsiteSchema({
      name: 'My Site',
      url: 'https://example.com',
      inLanguage: 'en-US',
    });

    expect(schema).toHaveProperty('inLanguage', 'en-US');
  });

  it('should include search action when provided', () => {
    const schema = generateWebsiteSchema({
      name: 'My Site',
      url: 'https://example.com',
      potentialAction: {
        target: 'https://example.com/search?q={search_term}',
        queryInput: 'required name=search_term',
      },
    }) as Record<string, unknown>;

    expect(schema.potentialAction).toMatchObject({
      '@type': 'SearchAction',
      target: 'https://example.com/search?q={search_term}',
      'query-input': 'required name=search_term',
    });
  });
});

describe('generateOrganizationSchema', () => {
  it('should generate basic organization schema', () => {
    const schema = generateOrganizationSchema({
      name: 'My Company',
      url: 'https://example.com',
    });

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'My Company',
      url: 'https://example.com',
    });
  });

  it('should include logo when provided', () => {
    const schema = generateOrganizationSchema({
      name: 'My Company',
      url: 'https://example.com',
      logo: 'https://example.com/logo.png',
    });

    expect(schema).toHaveProperty('logo', 'https://example.com/logo.png');
  });

  it('should include sameAs when provided', () => {
    const schema = generateOrganizationSchema({
      name: 'My Company',
      url: 'https://example.com',
      sameAs: ['https://twitter.com/company', 'https://facebook.com/company'],
    });

    expect(schema).toHaveProperty('sameAs', [
      'https://twitter.com/company',
      'https://facebook.com/company',
    ]);
  });

  it('should not include sameAs for empty array', () => {
    const schema = generateOrganizationSchema({
      name: 'My Company',
      url: 'https://example.com',
      sameAs: [],
    });

    expect(schema).not.toHaveProperty('sameAs');
  });
});

describe('generateBreadcrumbSchema', () => {
  it('should generate breadcrumb schema', () => {
    const schema = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://example.com' },
      { name: 'Products', url: 'https://example.com/products' },
      { name: 'Widget', url: 'https://example.com/products/widget' },
    ]) as Record<string, unknown>;

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
    });

    const items = schema.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(3);
    expect(items[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://example.com',
    });
    expect(items[2]).toMatchObject({
      '@type': 'ListItem',
      position: 3,
      name: 'Widget',
    });
  });

  it('should handle empty breadcrumbs', () => {
    const schema = generateBreadcrumbSchema([]) as Record<string, unknown>;
    expect(schema.itemListElement).toEqual([]);
  });
});

describe('generateArticleSchema', () => {
  it('should generate basic article schema', () => {
    const schema = generateArticleSchema({
      headline: 'My Article',
      description: 'Article description',
      url: 'https://example.com/article',
      datePublished: '2024-01-01',
    });

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'My Article',
      description: 'Article description',
      url: 'https://example.com/article',
      datePublished: '2024-01-01',
    });
  });

  it('should include dateModified when provided', () => {
    const schema = generateArticleSchema({
      headline: 'My Article',
      description: 'Description',
      url: 'https://example.com/article',
      datePublished: '2024-01-01',
      dateModified: '2024-02-01',
    });

    expect(schema).toHaveProperty('dateModified', '2024-02-01');
  });

  it('should include string author as Person', () => {
    const schema = generateArticleSchema({
      headline: 'My Article',
      description: 'Description',
      url: 'https://example.com/article',
      datePublished: '2024-01-01',
      author: 'John Doe',
    }) as Record<string, unknown>;

    expect(schema.author).toMatchObject({
      '@type': 'Person',
      name: 'John Doe',
    });
  });

  it('should include organization author', () => {
    const schema = generateArticleSchema({
      headline: 'My Article',
      description: 'Description',
      url: 'https://example.com/article',
      datePublished: '2024-01-01',
      author: { name: 'My Company', url: 'https://company.com' },
    }) as Record<string, unknown>;

    expect(schema.author).toMatchObject({
      '@type': 'Organization',
      name: 'My Company',
      url: 'https://company.com',
    });
  });

  it('should include image when provided', () => {
    const schema = generateArticleSchema({
      headline: 'My Article',
      description: 'Description',
      url: 'https://example.com/article',
      datePublished: '2024-01-01',
      image: 'https://example.com/image.png',
    });

    expect(schema).toHaveProperty('image', 'https://example.com/image.png');
  });

  it('should include inLanguage when provided', () => {
    const schema = generateArticleSchema({
      headline: 'My Article',
      description: 'Description',
      url: 'https://example.com/article',
      datePublished: '2024-01-01',
      inLanguage: 'en-US',
    });

    expect(schema).toHaveProperty('inLanguage', 'en-US');
  });
});

describe('generateFAQSchema', () => {
  it('should generate FAQ schema', () => {
    const schema = generateFAQSchema([
      { question: 'What is this?', answer: 'This is a test.' },
      { question: 'How does it work?', answer: 'It just works.' },
    ]) as Record<string, unknown>;

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
    });

    const items = schema.mainEntity as Array<Record<string, unknown>>;
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      '@type': 'Question',
      name: 'What is this?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This is a test.',
      },
    });
  });

  it('should handle empty FAQ', () => {
    const schema = generateFAQSchema([]) as Record<string, unknown>;
    expect(schema.mainEntity).toEqual([]);
  });
});

describe('serializeSchema', () => {
  it('should serialize schema to JSON string', () => {
    const schema = { name: 'Test', value: 123 };
    const serialized = serializeSchema(schema);

    expect(serialized).toBe('{"name":"Test","value":123}');
  });
});

describe('generateJsonLdScript', () => {
  it('should generate script tag with JSON-LD', () => {
    const schema = { '@type': 'WebSite', name: 'Test' };
    const script = generateJsonLdScript(schema);

    expect(script).toBe(
      '<script type="application/ld+json">{"@type":"WebSite","name":"Test"}</script>',
    );
  });
});
