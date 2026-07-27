import type {
  DefinedTermJsonLd,
  DefinedTermSchema,
  SoftwareApplicationJsonLd,
  SoftwareApplicationSchema,
  TechArticleJsonLd,
  TechArticleSchema,
} from './schema-types';

/**
 * DefinedTerm JSON-LD 스키마를 생성합니다.
 *
 * 사전/용어집 형태의 콘텐츠에 대한 리치 스니펫을 제공합니다.
 * Context 앱의 Entry 페이지에 적합합니다.
 *
 * @param config - DefinedTerm 스키마 설정 객체
 * @returns Schema.org DefinedTerm 형식의 JSON-LD 객체
 *
 * @example
 * ```typescript
 * const schema = generateDefinedTermSchema({
 *   name: '안녕',
 *   description: 'Hello - Korean greeting',
 *   termCode: 'annyeong',
 *   url: 'https://context.soundbluemusic.com/entry/annyeong',
 *   inLanguage: 'ko',
 *   educationalLevel: 'beginner',
 * });
 * ```
 */
export function generateDefinedTermSchema(config: DefinedTermSchema): DefinedTermJsonLd {
  const schema: DefinedTermJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: config.name,
    description: config.description,
    url: config.url,
  };

  if (config.termCode) {
    schema.termCode = config.termCode;
  }

  if (config.inDefinedTermSet) {
    schema.inDefinedTermSet = config.inDefinedTermSet;
  }

  if (config.inLanguage) {
    schema.inLanguage = config.inLanguage;
  }

  if (config.educationalLevel) {
    schema.educationalLevel = config.educationalLevel;
  }

  return schema;
}

/**
 * SoftwareApplication JSON-LD 스키마를 생성합니다.
 *
 * 소프트웨어/라이브러리에 대한 리치 스니펫을 제공합니다.
 * Permissive 앱의 Library 페이지에 적합합니다.
 *
 * @param config - SoftwareApplication 스키마 설정 객체
 * @returns Schema.org SoftwareApplication 형식의 JSON-LD 객체
 *
 * @example
 * ```typescript
 * const schema = generateSoftwareApplicationSchema({
 *   name: 'Lodash',
 *   description: 'A modern JavaScript utility library',
 *   applicationCategory: 'DeveloperApplication',
 *   license: 'MIT',
 *   url: 'https://permissive.soundbluemusic.com/library/lodash',
 *   codeRepository: 'https://github.com/lodash/lodash',
 *   price: '0',
 *   priceCurrency: 'USD',
 * });
 * ```
 */
export function generateSoftwareApplicationSchema(
  config: SoftwareApplicationSchema,
): SoftwareApplicationJsonLd {
  const schema: SoftwareApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.name,
    description: config.description,
    url: config.url,
  };

  if (config.applicationCategory) {
    schema.applicationCategory = config.applicationCategory;
  }

  if (config.operatingSystem) {
    schema.operatingSystem = config.operatingSystem;
  }

  if (config.license) {
    schema.license = `https://opensource.org/licenses/${config.license}`;
  }

  if (config.codeRepository) {
    schema.codeRepository = config.codeRepository;
  }

  if (config.programmingLanguage) {
    schema.programmingLanguage = config.programmingLanguage;
  }

  if (config.price !== undefined && config.priceCurrency) {
    schema.offers = {
      '@type': 'Offer',
      price: config.price,
      priceCurrency: config.priceCurrency,
    };
  }

  if (config.author) {
    schema.author =
      typeof config.author === 'string'
        ? { '@type': 'Person' as const, name: config.author }
        : { '@type': 'Organization' as const, name: config.author.name, url: config.author.url };
  }

  return schema;
}

/**
 * TechArticle JSON-LD 스키마를 생성합니다.
 *
 * 기술 문서/API 참조에 대한 리치 스니펫을 제공합니다.
 * Permissive 앱의 Web API 페이지에 적합합니다.
 *
 * @param config - TechArticle 스키마 설정 객체
 * @returns Schema.org TechArticle 형식의 JSON-LD 객체
 *
 * @example
 * ```typescript
 * const schema = generateTechArticleSchema({
 *   headline: 'Fetch API',
 *   description: 'Modern way to make HTTP requests',
 *   url: 'https://permissive.soundbluemusic.com/web-api/fetch-api',
 *   proficiencyLevel: 'Beginner',
 *   inLanguage: 'en',
 * });
 * ```
 */
export function generateTechArticleSchema(config: TechArticleSchema): TechArticleJsonLd {
  const schema: TechArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: config.headline,
    description: config.description,
    url: config.url,
  };

  if (config.datePublished) {
    schema.datePublished = config.datePublished;
  }

  if (config.dateModified) {
    schema.dateModified = config.dateModified;
  }

  if (config.proficiencyLevel) {
    schema.proficiencyLevel = config.proficiencyLevel;
  }

  if (config.dependencies && config.dependencies.length > 0) {
    schema.dependencies = config.dependencies.join(', ');
  }

  if (config.author) {
    schema.author =
      typeof config.author === 'string'
        ? { '@type': 'Person' as const, name: config.author }
        : { '@type': 'Organization' as const, name: config.author.name, url: config.author.url };
  }

  if (config.inLanguage) {
    schema.inLanguage = config.inLanguage;
  }

  return schema;
}
