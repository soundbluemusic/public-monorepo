/**
 * @fileoverview Tests for JSON-LD structured data schemas
 */

import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateDefinedTermSchema,
  generateFAQSchema,
  generateJsonLdScript,
  generateOrganizationSchema,
  generateSoftwareApplicationSchema,
  generateTechArticleSchema,
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

describe('generateDefinedTermSchema', () => {
  it('should generate basic defined term schema', () => {
    const schema = generateDefinedTermSchema({
      name: '안녕',
      description: 'Hello - Korean greeting',
      url: 'https://context.soundbluemusic.com/entry/annyeong',
    });

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: '안녕',
      description: 'Hello - Korean greeting',
      url: 'https://context.soundbluemusic.com/entry/annyeong',
    });
  });

  it('should include termCode when provided', () => {
    const schema = generateDefinedTermSchema({
      name: '안녕',
      description: 'Hello - Korean greeting',
      url: 'https://context.soundbluemusic.com/entry/annyeong',
      termCode: 'annyeong',
    });

    expect(schema).toHaveProperty('termCode', 'annyeong');
  });

  it('should include inDefinedTermSet when provided', () => {
    const schema = generateDefinedTermSchema({
      name: '안녕',
      description: 'Hello - Korean greeting',
      url: 'https://context.soundbluemusic.com/entry/annyeong',
      inDefinedTermSet: 'Korean Greetings',
    });

    expect(schema).toHaveProperty('inDefinedTermSet', 'Korean Greetings');
  });

  it('should include inLanguage when provided', () => {
    const schema = generateDefinedTermSchema({
      name: '안녕',
      description: 'Hello - Korean greeting',
      url: 'https://context.soundbluemusic.com/entry/annyeong',
      inLanguage: 'ko',
    });

    expect(schema).toHaveProperty('inLanguage', 'ko');
  });

  it('should include educationalLevel when provided', () => {
    const schema = generateDefinedTermSchema({
      name: '안녕',
      description: 'Hello - Korean greeting',
      url: 'https://context.soundbluemusic.com/entry/annyeong',
      educationalLevel: 'beginner',
    });

    expect(schema).toHaveProperty('educationalLevel', 'beginner');
  });

  it('should include all optional fields when provided', () => {
    const schema = generateDefinedTermSchema({
      name: '감사합니다',
      description: 'Thank you in Korean',
      url: 'https://context.soundbluemusic.com/entry/gamsahamnida',
      termCode: 'gamsahamnida',
      inDefinedTermSet: 'Korean Phrases',
      inLanguage: 'ko',
      educationalLevel: 'intermediate',
    });

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: '감사합니다',
      description: 'Thank you in Korean',
      url: 'https://context.soundbluemusic.com/entry/gamsahamnida',
      termCode: 'gamsahamnida',
      inDefinedTermSet: 'Korean Phrases',
      inLanguage: 'ko',
      educationalLevel: 'intermediate',
    });
  });
});

describe('generateSoftwareApplicationSchema', () => {
  it('should generate basic software application schema', () => {
    const schema = generateSoftwareApplicationSchema({
      name: 'Lodash',
      description: 'A modern JavaScript utility library',
      url: 'https://permissive.soundbluemusic.com/library/lodash',
    });

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Lodash',
      description: 'A modern JavaScript utility library',
      url: 'https://permissive.soundbluemusic.com/library/lodash',
    });
  });

  it('should include applicationCategory when provided', () => {
    const schema = generateSoftwareApplicationSchema({
      name: 'Lodash',
      description: 'A modern JavaScript utility library',
      url: 'https://permissive.soundbluemusic.com/library/lodash',
      applicationCategory: 'DeveloperApplication',
    });

    expect(schema).toHaveProperty('applicationCategory', 'DeveloperApplication');
  });

  it('should include operatingSystem when provided', () => {
    const schema = generateSoftwareApplicationSchema({
      name: 'Lodash',
      description: 'A modern JavaScript utility library',
      url: 'https://permissive.soundbluemusic.com/library/lodash',
      operatingSystem: 'Cross-platform',
    });

    expect(schema).toHaveProperty('operatingSystem', 'Cross-platform');
  });

  it('should convert license to opensource.org URL', () => {
    const schema = generateSoftwareApplicationSchema({
      name: 'Lodash',
      description: 'A modern JavaScript utility library',
      url: 'https://permissive.soundbluemusic.com/library/lodash',
      license: 'MIT',
    });

    expect(schema).toHaveProperty('license', 'https://opensource.org/licenses/MIT');
  });

  it('should include codeRepository when provided', () => {
    const schema = generateSoftwareApplicationSchema({
      name: 'Lodash',
      description: 'A modern JavaScript utility library',
      url: 'https://permissive.soundbluemusic.com/library/lodash',
      codeRepository: 'https://github.com/lodash/lodash',
    });

    expect(schema).toHaveProperty('codeRepository', 'https://github.com/lodash/lodash');
  });

  it('should include programmingLanguage when provided', () => {
    const schema = generateSoftwareApplicationSchema({
      name: 'Lodash',
      description: 'A modern JavaScript utility library',
      url: 'https://permissive.soundbluemusic.com/library/lodash',
      programmingLanguage: 'JavaScript',
    });

    expect(schema).toHaveProperty('programmingLanguage', 'JavaScript');
  });

  it('should include offers when price and priceCurrency are provided', () => {
    const schema = generateSoftwareApplicationSchema({
      name: 'Lodash',
      description: 'A modern JavaScript utility library',
      url: 'https://permissive.soundbluemusic.com/library/lodash',
      price: '0',
      priceCurrency: 'USD',
    }) as Record<string, unknown>;

    expect(schema.offers).toMatchObject({
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    });
  });

  it('should not include offers when only price is provided', () => {
    const schema = generateSoftwareApplicationSchema({
      name: 'Lodash',
      description: 'A modern JavaScript utility library',
      url: 'https://permissive.soundbluemusic.com/library/lodash',
      price: '0',
    });

    expect(schema).not.toHaveProperty('offers');
  });

  it('should include string author as Person', () => {
    const schema = generateSoftwareApplicationSchema({
      name: 'Lodash',
      description: 'A modern JavaScript utility library',
      url: 'https://permissive.soundbluemusic.com/library/lodash',
      author: 'John-David Dalton',
    }) as Record<string, unknown>;

    expect(schema.author).toMatchObject({
      '@type': 'Person',
      name: 'John-David Dalton',
    });
  });

  it('should include organization author', () => {
    const schema = generateSoftwareApplicationSchema({
      name: 'React',
      description: 'A JavaScript library for building user interfaces',
      url: 'https://permissive.soundbluemusic.com/library/react',
      author: { name: 'Meta', url: 'https://meta.com' },
    }) as Record<string, unknown>;

    expect(schema.author).toMatchObject({
      '@type': 'Organization',
      name: 'Meta',
      url: 'https://meta.com',
    });
  });

  it('should include all optional fields when provided', () => {
    const schema = generateSoftwareApplicationSchema({
      name: 'Lodash',
      description: 'A modern JavaScript utility library',
      url: 'https://permissive.soundbluemusic.com/library/lodash',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Cross-platform',
      license: 'MIT',
      codeRepository: 'https://github.com/lodash/lodash',
      programmingLanguage: 'JavaScript',
      price: '0',
      priceCurrency: 'USD',
      author: 'John-David Dalton',
    }) as Record<string, unknown>;

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Lodash',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Cross-platform',
      license: 'https://opensource.org/licenses/MIT',
      codeRepository: 'https://github.com/lodash/lodash',
      programmingLanguage: 'JavaScript',
    });
    expect(schema.offers).toMatchObject({
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    });
    expect(schema.author).toMatchObject({
      '@type': 'Person',
      name: 'John-David Dalton',
    });
  });
});

describe('generateTechArticleSchema', () => {
  it('should generate basic tech article schema', () => {
    const schema = generateTechArticleSchema({
      headline: 'Fetch API',
      description: 'Modern way to make HTTP requests in JavaScript',
      url: 'https://permissive.soundbluemusic.com/web-api/fetch-api',
    });

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: 'Fetch API',
      description: 'Modern way to make HTTP requests in JavaScript',
      url: 'https://permissive.soundbluemusic.com/web-api/fetch-api',
    });
  });

  it('should include datePublished when provided', () => {
    const schema = generateTechArticleSchema({
      headline: 'Fetch API',
      description: 'Modern way to make HTTP requests',
      url: 'https://permissive.soundbluemusic.com/web-api/fetch-api',
      datePublished: '2024-01-01',
    });

    expect(schema).toHaveProperty('datePublished', '2024-01-01');
  });

  it('should include dateModified when provided', () => {
    const schema = generateTechArticleSchema({
      headline: 'Fetch API',
      description: 'Modern way to make HTTP requests',
      url: 'https://permissive.soundbluemusic.com/web-api/fetch-api',
      datePublished: '2024-01-01',
      dateModified: '2024-06-15',
    });

    expect(schema).toHaveProperty('dateModified', '2024-06-15');
  });

  it('should include proficiencyLevel when provided', () => {
    const schema = generateTechArticleSchema({
      headline: 'Fetch API',
      description: 'Modern way to make HTTP requests',
      url: 'https://permissive.soundbluemusic.com/web-api/fetch-api',
      proficiencyLevel: 'Beginner',
    });

    expect(schema).toHaveProperty('proficiencyLevel', 'Beginner');
  });

  it('should include dependencies as comma-separated string when provided', () => {
    const schema = generateTechArticleSchema({
      headline: 'Fetch API',
      description: 'Modern way to make HTTP requests',
      url: 'https://permissive.soundbluemusic.com/web-api/fetch-api',
      dependencies: ['JavaScript', 'Browser', 'Promise'],
    });

    expect(schema).toHaveProperty('dependencies', 'JavaScript, Browser, Promise');
  });

  it('should not include dependencies for empty array', () => {
    const schema = generateTechArticleSchema({
      headline: 'Fetch API',
      description: 'Modern way to make HTTP requests',
      url: 'https://permissive.soundbluemusic.com/web-api/fetch-api',
      dependencies: [],
    });

    expect(schema).not.toHaveProperty('dependencies');
  });

  it('should include string author as Person', () => {
    const schema = generateTechArticleSchema({
      headline: 'Fetch API',
      description: 'Modern way to make HTTP requests',
      url: 'https://permissive.soundbluemusic.com/web-api/fetch-api',
      author: 'MDN Contributors',
    }) as Record<string, unknown>;

    expect(schema.author).toMatchObject({
      '@type': 'Person',
      name: 'MDN Contributors',
    });
  });

  it('should include organization author', () => {
    const schema = generateTechArticleSchema({
      headline: 'Fetch API',
      description: 'Modern way to make HTTP requests',
      url: 'https://permissive.soundbluemusic.com/web-api/fetch-api',
      author: { name: 'Mozilla', url: 'https://mozilla.org' },
    }) as Record<string, unknown>;

    expect(schema.author).toMatchObject({
      '@type': 'Organization',
      name: 'Mozilla',
      url: 'https://mozilla.org',
    });
  });

  it('should include inLanguage when provided', () => {
    const schema = generateTechArticleSchema({
      headline: 'Fetch API',
      description: 'Modern way to make HTTP requests',
      url: 'https://permissive.soundbluemusic.com/web-api/fetch-api',
      inLanguage: 'en',
    });

    expect(schema).toHaveProperty('inLanguage', 'en');
  });

  it('should include all optional fields when provided', () => {
    const schema = generateTechArticleSchema({
      headline: 'WebSocket API',
      description: 'Real-time bidirectional communication',
      url: 'https://permissive.soundbluemusic.com/web-api/websocket-api',
      datePublished: '2024-01-01',
      dateModified: '2024-06-15',
      proficiencyLevel: 'Intermediate',
      dependencies: ['JavaScript', 'Browser'],
      author: 'MDN Contributors',
      inLanguage: 'en',
    }) as Record<string, unknown>;

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: 'WebSocket API',
      description: 'Real-time bidirectional communication',
      url: 'https://permissive.soundbluemusic.com/web-api/websocket-api',
      datePublished: '2024-01-01',
      dateModified: '2024-06-15',
      proficiencyLevel: 'Intermediate',
      dependencies: 'JavaScript, Browser',
      inLanguage: 'en',
    });
    expect(schema.author).toMatchObject({
      '@type': 'Person',
      name: 'MDN Contributors',
    });
  });
});
