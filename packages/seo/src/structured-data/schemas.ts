/**
 * @fileoverview JSON-LD Structured Data Schemas
 * @environment build-only
 *
 * Generates Schema.org JSON-LD for SEO.
 * Returns plain objects that can be serialized to JSON.
 */

// ============================================================================
// Types
// ============================================================================

/**
 * WebSite 스키마 생성을 위한 입력 설정
 *
 * Google 검색 결과에서 사이트 이름과 검색창(Sitelinks Searchbox)을 표시하는 데 사용됩니다.
 *
 * @see https://schema.org/WebSite
 * @see https://developers.google.com/search/docs/appearance/site-names
 *
 * @example
 * ```typescript
 * const config: WebsiteSchema = {
 *   name: 'Context - Korean Dictionary',
 *   url: 'https://context.soundbluemusic.com',
 *   description: '한국어 학습자를 위한 맥락 기반 사전',
 *   inLanguage: ['en', 'ko'],
 *   potentialAction: {
 *     target: 'https://context.soundbluemusic.com/search?q={search_term_string}',
 *     queryInput: 'required name=search_term_string',
 *   },
 * };
 * ```
 */
export interface WebsiteSchema {
  /** 웹사이트 이름 (Google 검색 결과에 표시됨) */
  name: string;
  /** 웹사이트 기본 URL (trailing slash 없음) */
  url: string;
  /** 웹사이트 설명 (선택사항) */
  description?: string;
  /** 지원 언어 - 단일 언어 또는 언어 배열 (예: 'ko', ['en', 'ko']) */
  inLanguage?: string | string[];
  /** 사이트 검색 기능 설정 - Sitelinks Searchbox 활성화에 필요 */
  potentialAction?: SearchActionSchema;
}

/**
 * SearchAction 스키마 설정 - 사이트 검색창 기능 정의
 *
 * Google Sitelinks Searchbox를 활성화하려면 이 설정이 필요합니다.
 * target URL에 `{search_term_string}` 플레이스홀더를 포함해야 합니다.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
 *
 * @example
 * ```typescript
 * const searchAction: SearchActionSchema = {
 *   target: 'https://example.com/search?q={search_term_string}',
 *   queryInput: 'required name=search_term_string',
 * };
 * ```
 */
export interface SearchActionSchema {
  /** 검색 URL 템플릿 - `{search_term_string}` 플레이스홀더 필수 */
  target: string;
  /** 검색 입력 정의 - 일반적으로 'required name=search_term_string' 사용 */
  queryInput: string;
}

/**
 * Organization 스키마 생성을 위한 입력 설정
 *
 * Google Knowledge Panel에 조직 정보를 표시하는 데 사용됩니다.
 * sameAs로 소셜 미디어 프로필을 연결하면 검색 결과에 표시될 수 있습니다.
 *
 * @see https://schema.org/Organization
 * @see https://developers.google.com/search/docs/appearance/structured-data/organization
 *
 * @example
 * ```typescript
 * const config: OrganizationSchema = {
 *   name: 'SoundBlue Music',
 *   url: 'https://soundbluemusic.com',
 *   logo: 'https://soundbluemusic.com/logo.png',
 *   sameAs: [
 *     'https://www.youtube.com/@SoundBlueMusic',
 *     'https://x.com/SoundBlueMusic',
 *     'https://www.instagram.com/soundbluemusic/',
 *   ],
 * };
 * ```
 */
export interface OrganizationSchema {
  /** 조직/회사 이름 */
  name: string;
  /** 공식 웹사이트 URL */
  url: string;
  /** 로고 이미지 URL (최소 112x112px, 권장 1200x630px) */
  logo?: string;
  /** 공식 소셜 미디어 프로필 URL 배열 */
  sameAs?: string[];
}

/**
 * Breadcrumb 네비게이션의 단일 항목
 *
 * BreadcrumbList 스키마에서 각 경로 단계를 나타냅니다.
 * position은 generateBreadcrumbSchema()에서 자동 계산됩니다.
 *
 * @see https://schema.org/BreadcrumbList
 *
 * @example
 * ```typescript
 * const items: BreadcrumbItem[] = [
 *   { name: 'Home', url: 'https://example.com' },
 *   { name: 'Category', url: 'https://example.com/category' },
 *   { name: 'Current Page', url: 'https://example.com/category/page' },
 * ];
 * ```
 */
export interface BreadcrumbItem {
  /** 브레드크럼에 표시될 이름 */
  name: string;
  /** 해당 페이지의 전체 URL */
  url: string;
}

/**
 * Article 스키마 생성을 위한 입력 설정
 *
 * 뉴스 기사, 블로그 포스트, 학습 콘텐츠 등에 사용됩니다.
 * Google 검색 결과에서 풍부한 미리보기를 제공합니다.
 *
 * @see https://schema.org/Article
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 *
 * @example
 * ```typescript
 * const config: ArticleSchema = {
 *   headline: '한국어 조사 "은/는"과 "이/가"의 차이',
 *   description: '주제 표지 조사와 주격 조사의 사용법을 예문과 함께 설명합니다.',
 *   url: 'https://context.soundbluemusic.com/entry/topic-markers',
 *   datePublished: '2025-01-01',
 *   dateModified: '2025-12-15',
 *   author: 'SoundBlue Music',
 *   image: 'https://context.soundbluemusic.com/og/topic-markers.png',
 *   inLanguage: 'ko',
 * };
 * ```
 */
export interface ArticleSchema {
  /** 기사 제목 - 110자 이내 권장 */
  headline: string;
  /** 기사 설명/요약 */
  description: string;
  /** 기사 페이지의 canonical URL */
  url: string;
  /** 최초 발행일 (ISO 8601 형식: YYYY-MM-DD 또는 YYYY-MM-DDTHH:mm:ssZ) */
  datePublished: string;
  /** 최종 수정일 (선택사항, ISO 8601 형식) */
  dateModified?: string;
  /** 저자 - 문자열(개인) 또는 OrganizationSchema(조직) */
  author?: string | OrganizationSchema;
  /** 대표 이미지 URL (최소 1200x630px 권장) */
  image?: string;
  /** 기사 언어 코드 (예: 'ko', 'en') */
  inLanguage?: string;
}

/**
 * FAQ(자주 묻는 질문)의 단일 항목
 *
 * FAQPage 스키마에서 각 질문-답변 쌍을 나타냅니다.
 * Google 검색 결과에서 FAQ 리치 스니펫으로 표시될 수 있습니다.
 *
 * @see https://schema.org/FAQPage
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 *
 * @example
 * ```typescript
 * const items: FAQItem[] = [
 *   {
 *     question: '한국어 "안녕하세요"는 언제 사용하나요?',
 *     answer: '"안녕하세요"는 격식체 인사말로, 처음 만나거나 존댓말을 사용해야 하는 상황에서 사용합니다.',
 *   },
 *   {
 *     question: '"감사합니다"와 "고마워요"의 차이는?',
 *     answer: '"감사합니다"는 격식체, "고마워요"는 비격식체입니다. 비즈니스나 공식 상황에서는 "감사합니다"를 사용합니다.',
 *   },
 * ];
 * ```
 */
export interface FAQItem {
  /** 질문 텍스트 */
  question: string;
  /** 답변 텍스트 - HTML 허용되지만 단순 텍스트 권장 */
  answer: string;
}

// ============================================================================
// JSON-LD Schema Types
// ============================================================================

/** Base JSON-LD schema with context and type */
export interface JsonLdSchema {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

/** WebSite JSON-LD schema */
export interface WebSiteJsonLd extends JsonLdSchema {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  inLanguage?: string | string[];
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

/** Organization JSON-LD schema */
export interface OrganizationJsonLd extends JsonLdSchema {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

/** BreadcrumbList JSON-LD schema */
export interface BreadcrumbListJsonLd extends JsonLdSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

/** Article JSON-LD schema */
export interface ArticleJsonLd extends JsonLdSchema {
  '@type': 'Article';
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: { '@type': 'Person' | 'Organization'; name: string; url?: string };
  image?: string;
  inLanguage?: string;
}

/** FAQPage JSON-LD schema */
export interface FAQPageJsonLd extends JsonLdSchema {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * WebSite JSON-LD 스키마를 생성합니다.
 *
 * Google 검색 결과에서 사이트 이름을 올바르게 표시하고,
 * Sitelinks Searchbox(사이트 검색창)를 활성화하는 데 사용됩니다.
 *
 * @param config - WebSite 스키마 설정 객체
 * @returns Schema.org WebSite 형식의 JSON-LD 객체
 *
 * @example 기본 사용법
 * ```typescript
 * const schema = generateWebsiteSchema({
 *   name: 'Context - Korean Dictionary',
 *   url: 'https://context.soundbluemusic.com',
 * });
 * // 결과: { "@context": "https://schema.org", "@type": "WebSite", ... }
 * ```
 *
 * @example Sitelinks Searchbox 활성화
 * ```typescript
 * const schema = generateWebsiteSchema({
 *   name: 'Context',
 *   url: 'https://context.soundbluemusic.com',
 *   description: '한국어 학습자를 위한 맥락 기반 사전',
 *   inLanguage: ['en', 'ko'],
 *   potentialAction: {
 *     target: 'https://context.soundbluemusic.com/search?q={search_term_string}',
 *     queryInput: 'required name=search_term_string',
 *   },
 * });
 * ```
 *
 * @see https://schema.org/WebSite
 * @see https://developers.google.com/search/docs/appearance/site-names
 */
export function generateWebsiteSchema(config: WebsiteSchema): WebSiteJsonLd {
  const schema: WebSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url,
  };

  if (config.description) {
    schema.description = config.description;
  }

  if (config.inLanguage) {
    schema.inLanguage = config.inLanguage;
  }

  if (config.potentialAction) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: config.potentialAction.target,
      'query-input': config.potentialAction.queryInput,
    };
  }

  return schema;
}

/**
 * Organization JSON-LD 스키마를 생성합니다.
 *
 * Google Knowledge Panel에 조직 정보를 표시하고,
 * 소셜 미디어 프로필을 연결하는 데 사용됩니다.
 *
 * @param config - Organization 스키마 설정 객체
 * @returns Schema.org Organization 형식의 JSON-LD 객체
 *
 * @example 기본 사용법
 * ```typescript
 * const schema = generateOrganizationSchema({
 *   name: 'SoundBlue Music',
 *   url: 'https://soundbluemusic.com',
 * });
 * ```
 *
 * @example 로고와 소셜 미디어 포함
 * ```typescript
 * const schema = generateOrganizationSchema({
 *   name: 'SoundBlue Music',
 *   url: 'https://soundbluemusic.com',
 *   logo: 'https://soundbluemusic.com/logo.png',
 *   sameAs: [
 *     'https://www.youtube.com/@SoundBlueMusic',
 *     'https://x.com/SoundBlueMusic',
 *     'https://www.instagram.com/soundbluemusic/',
 *     'https://www.threads.com/@soundbluemusic',
 *   ],
 * });
 * ```
 *
 * @remarks
 * - logo는 최소 112x112px 이상이어야 합니다
 * - sameAs에는 공식 소셜 미디어 프로필만 포함하세요
 * - 빈 sameAs 배열은 출력에서 자동 제외됩니다
 *
 * @see https://schema.org/Organization
 * @see https://developers.google.com/search/docs/appearance/structured-data/organization
 */
export function generateOrganizationSchema(config: OrganizationSchema): OrganizationJsonLd {
  const schema: OrganizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: config.url,
  };

  if (config.logo) {
    schema.logo = config.logo;
  }

  if (config.sameAs && config.sameAs.length > 0) {
    schema.sameAs = config.sameAs;
  }

  return schema;
}

/**
 * BreadcrumbList JSON-LD 스키마를 생성합니다.
 *
 * Google 검색 결과에서 페이지 위치를 계층적으로 표시합니다.
 * 사용자가 사이트 구조를 이해하고 탐색하는 데 도움을 줍니다.
 *
 * @param items - 브레드크럼 항목 배열 (홈 → 카테고리 → 현재 페이지 순서)
 * @returns Schema.org BreadcrumbList 형식의 JSON-LD 객체
 *
 * @example 기본 사용법
 * ```typescript
 * const schema = generateBreadcrumbSchema([
 *   { name: 'Home', url: 'https://context.soundbluemusic.com' },
 *   { name: 'Categories', url: 'https://context.soundbluemusic.com/categories' },
 *   { name: 'Greetings', url: 'https://context.soundbluemusic.com/category/greetings' },
 * ]);
 * ```
 *
 * @example 동적 라우트에서 사용
 * ```typescript
 * // routes/entry.$entryId.tsx
 * export async function loader({ params }: Route.LoaderArgs) {
 *   const entry = getEntryById(params.entryId);
 *   const breadcrumbs = generateBreadcrumbSchema([
 *     { name: 'Home', url: 'https://context.soundbluemusic.com' },
 *     { name: entry.category, url: `https://context.soundbluemusic.com/category/${entry.categoryId}` },
 *     { name: entry.korean, url: `https://context.soundbluemusic.com/entry/${entry.id}` },
 *   ]);
 *   return { entry, breadcrumbs };
 * }
 * ```
 *
 * @remarks
 * - position은 배열 인덱스 + 1로 자동 계산됩니다 (1부터 시작)
 * - 첫 번째 항목은 항상 홈페이지여야 합니다
 * - 마지막 항목은 현재 페이지입니다
 *
 * @see https://schema.org/BreadcrumbList
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbListJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Article JSON-LD 스키마를 생성합니다.
 *
 * 뉴스 기사, 블로그 포스트, 학습 콘텐츠에 대한 리치 스니펫을 제공합니다.
 * Google Discover와 뉴스 검색 결과에서 향상된 표시를 얻을 수 있습니다.
 *
 * @param config - Article 스키마 설정 객체
 * @returns Schema.org Article 형식의 JSON-LD 객체
 *
 * @example 개인 저자 기사
 * ```typescript
 * const schema = generateArticleSchema({
 *   headline: '한국어 조사 "은/는"과 "이/가"의 차이',
 *   description: '주제 표지 조사와 주격 조사의 사용법을 예문과 함께 설명합니다.',
 *   url: 'https://context.soundbluemusic.com/entry/topic-markers',
 *   datePublished: '2025-01-01',
 *   author: '홍길동',
 * });
 * ```
 *
 * @example 조직 저자 + 이미지
 * ```typescript
 * const schema = generateArticleSchema({
 *   headline: '한국어 인사말 완벽 가이드',
 *   description: '상황별 한국어 인사말 사용법을 배워보세요.',
 *   url: 'https://context.soundbluemusic.com/entry/greetings-guide',
 *   datePublished: '2025-06-01',
 *   dateModified: '2025-12-15',
 *   author: {
 *     name: 'SoundBlue Music',
 *     url: 'https://soundbluemusic.com',
 *   },
 *   image: 'https://context.soundbluemusic.com/og/greetings-guide.png',
 *   inLanguage: 'ko',
 * });
 * ```
 *
 * @remarks
 * - headline은 110자 이내를 권장합니다
 * - datePublished/dateModified는 ISO 8601 형식 (YYYY-MM-DD)
 * - image는 1200x630px 이상 권장
 * - author가 문자열이면 Person, 객체면 Organization으로 처리됩니다
 *
 * @see https://schema.org/Article
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 */
export function generateArticleSchema(config: ArticleSchema): ArticleJsonLd {
  const schema: ArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.headline,
    description: config.description,
    url: config.url,
    datePublished: config.datePublished,
  };

  if (config.dateModified) {
    schema.dateModified = config.dateModified;
  }

  if (config.author) {
    schema.author =
      typeof config.author === 'string'
        ? { '@type': 'Person' as const, name: config.author }
        : { '@type': 'Organization' as const, name: config.author.name, url: config.author.url };
  }

  if (config.image) {
    schema.image = config.image;
  }

  if (config.inLanguage) {
    schema.inLanguage = config.inLanguage;
  }

  return schema;
}

/**
 * FAQPage JSON-LD 스키마를 생성합니다.
 *
 * Google 검색 결과에서 FAQ 리치 스니펫을 표시합니다.
 * 각 질문-답변 쌍이 검색 결과에 아코디언 형태로 표시될 수 있습니다.
 *
 * @param items - FAQ 항목 배열 (질문-답변 쌍)
 * @returns Schema.org FAQPage 형식의 JSON-LD 객체
 *
 * @example 기본 사용법
 * ```typescript
 * const schema = generateFAQSchema([
 *   {
 *     question: '한국어 "안녕하세요"는 언제 사용하나요?',
 *     answer: '"안녕하세요"는 격식체 인사말로, 처음 만나거나 존댓말을 사용해야 하는 상황에서 사용합니다.',
 *   },
 *   {
 *     question: '"감사합니다"와 "고마워요"의 차이는?',
 *     answer: '"감사합니다"는 격식체, "고마워요"는 비격식체입니다.',
 *   },
 * ]);
 * ```
 *
 * @example 학습 콘텐츠에서 사용
 * ```typescript
 * // 엔트리의 FAQ 섹션에서 스키마 생성
 * const faqItems = entry.frequentQuestions.map(q => ({
 *   question: q.title,
 *   answer: q.explanation,
 * }));
 * const schema = generateFAQSchema(faqItems);
 * ```
 *
 * @remarks
 * - 최소 2개 이상의 FAQ 항목을 권장합니다
 * - 답변에 HTML을 포함할 수 있지만, 단순 텍스트 권장
 * - 질문은 자연스러운 질문 형태여야 합니다 ("~는 무엇인가요?")
 * - 답변은 질문에 직접적으로 대답해야 합니다
 *
 * @see https://schema.org/FAQPage
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export function generateFAQSchema(items: FAQItem[]): FAQPageJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer,
      },
    })),
  };
}

// ============================================================================
// Serialization Helpers
// ============================================================================

/**
 * JSON-LD 스키마 객체를 문자열로 직렬화합니다.
 *
 * 스키마 객체를 압축된 JSON 문자열로 변환합니다.
 * 공백 없이 출력하여 HTML 크기를 최소화합니다.
 *
 * @param schema - JSON-LD 스키마 객체
 * @returns 압축된 JSON 문자열
 *
 * @example
 * ```typescript
 * const schema = generateWebsiteSchema({
 *   name: 'Context',
 *   url: 'https://context.soundbluemusic.com',
 * });
 * const json = serializeSchema(schema);
 * // '{"@context":"https://schema.org","@type":"WebSite","name":"Context",...}'
 * ```
 *
 * @see {@link generateJsonLdScript} - HTML script 태그 생성용
 */
export function serializeSchema(schema: JsonLdSchema): string {
  return JSON.stringify(schema, null, 0);
}

/**
 * JSON-LD 스키마를 HTML script 태그로 생성합니다.
 *
 * 스키마 객체를 `<script type="application/ld+json">` 태그로 감싸서 반환합니다.
 * SSG 빌드 시점에 HTML에 직접 삽입할 수 있습니다.
 *
 * @param schema - JSON-LD 스키마 객체
 * @returns 완전한 HTML script 태그 문자열
 *
 * @example SSG 빌드에서 사용
 * ```typescript
 * // entry.server.tsx 또는 root.tsx에서
 * const websiteSchema = generateWebsiteSchema({
 *   name: 'Context',
 *   url: 'https://context.soundbluemusic.com',
 * });
 * const scriptTag = generateJsonLdScript(websiteSchema);
 * // <script type="application/ld+json">{"@context":"https://schema.org",...}</script>
 * ```
 *
 * @example 여러 스키마 결합
 * ```typescript
 * const schemas = [
 *   generateWebsiteSchema({ name: 'Context', url: BASE_URL }),
 *   generateOrganizationSchema({ name: 'SoundBlue Music', url: ORG_URL }),
 *   generateBreadcrumbSchema(breadcrumbItems),
 * ];
 *
 * const scriptTags = schemas.map(generateJsonLdScript).join('\n');
 * ```
 *
 * @remarks
 * - 한 페이지에 여러 JSON-LD 스크립트를 포함할 수 있습니다
 * - Google은 페이지당 최대 하나의 각 스키마 타입만 인식합니다
 * - script 태그는 `<head>` 또는 `<body>` 어디에나 배치 가능합니다
 *
 * @see {@link serializeSchema} - 순수 JSON 문자열만 필요한 경우
 */
export function generateJsonLdScript(schema: JsonLdSchema): string {
  return `<script type="application/ld+json">${serializeSchema(schema)}</script>`;
}

// ============================================================================
// Extended Schema Types (Phase 2 & 3)
// ============================================================================

/**
 * DefinedTerm 스키마 생성을 위한 입력 설정
 *
 * 사전/용어집 형태의 콘텐츠에 사용됩니다.
 * Google 검색 결과에서 정의형 리치 스니펫으로 표시될 수 있습니다.
 *
 * @see https://schema.org/DefinedTerm
 *
 * @example
 * ```typescript
 * const config: DefinedTermSchema = {
 *   name: '안녕',
 *   description: 'Hello - Korean greeting used in informal situations',
 *   termCode: 'annyeong',
 *   inDefinedTermSet: 'Korean Vocabulary',
 *   url: 'https://context.soundbluemusic.com/entry/annyeong',
 *   inLanguage: 'ko',
 * };
 * ```
 */
export interface DefinedTermSchema {
  /** 용어 이름 (단어) */
  name: string;
  /** 용어 설명 */
  description: string;
  /** 용어 코드 (romanization 등) */
  termCode?: string;
  /** 용어가 속한 용어집/사전 이름 */
  inDefinedTermSet?: string;
  /** 용어 페이지 URL */
  url: string;
  /** 언어 코드 (예: 'ko', 'en') */
  inLanguage?: string;
  /** 난이도 (예: 'beginner', 'intermediate') */
  educationalLevel?: string;
}

/** DefinedTerm JSON-LD schema */
export interface DefinedTermJsonLd extends JsonLdSchema {
  '@type': 'DefinedTerm';
  name: string;
  description: string;
  termCode?: string;
  inDefinedTermSet?: string;
  url: string;
  inLanguage?: string;
  educationalLevel?: string;
}

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
 * SoftwareApplication 스키마 생성을 위한 입력 설정
 *
 * 소프트웨어/라이브러리에 대한 구조화 데이터입니다.
 * Google 검색 결과에서 소프트웨어 리치 스니펫으로 표시될 수 있습니다.
 *
 * @see https://schema.org/SoftwareApplication
 *
 * @example
 * ```typescript
 * const config: SoftwareApplicationSchema = {
 *   name: 'Lodash',
 *   description: 'A modern JavaScript utility library',
 *   applicationCategory: 'DeveloperApplication',
 *   operatingSystem: 'Cross-platform',
 *   license: 'MIT',
 *   url: 'https://permissive.soundbluemusic.com/library/lodash',
 *   codeRepository: 'https://github.com/lodash/lodash',
 * };
 * ```
 */
export interface SoftwareApplicationSchema {
  /** 소프트웨어 이름 */
  name: string;
  /** 소프트웨어 설명 */
  description: string;
  /** 애플리케이션 카테고리 (예: 'DeveloperApplication', 'WebApplication') */
  applicationCategory?: string;
  /** 지원 운영체제 */
  operatingSystem?: string;
  /** 라이선스 (예: 'MIT', 'Apache-2.0') */
  license?: string;
  /** 소프트웨어 페이지 URL */
  url: string;
  /** GitHub/GitLab 등 코드 저장소 URL */
  codeRepository?: string;
  /** 프로그래밍 언어 */
  programmingLanguage?: string;
  /** 가격 (무료인 경우 '0') */
  price?: string;
  /** 통화 코드 (예: 'USD') */
  priceCurrency?: string;
  /** 저자/개발자 */
  author?: string | OrganizationSchema;
}

/** SoftwareApplication JSON-LD schema */
export interface SoftwareApplicationJsonLd extends JsonLdSchema {
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory?: string;
  operatingSystem?: string;
  license?: string;
  url: string;
  codeRepository?: string;
  programmingLanguage?: string;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  author?: { '@type': 'Person' | 'Organization'; name: string; url?: string };
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
 * TechArticle 스키마 생성을 위한 입력 설정
 *
 * 기술 문서/API 참조에 대한 구조화 데이터입니다.
 * Google 검색 결과에서 기술 문서 리치 스니펫으로 표시될 수 있습니다.
 *
 * @see https://schema.org/TechArticle
 *
 * @example
 * ```typescript
 * const config: TechArticleSchema = {
 *   headline: 'Fetch API',
 *   description: 'Modern way to make HTTP requests in JavaScript',
 *   url: 'https://permissive.soundbluemusic.com/web-api/fetch-api',
 *   proficiencyLevel: 'Beginner',
 * };
 * ```
 */
export interface TechArticleSchema {
  /** 기사 제목 */
  headline: string;
  /** 기사 설명 */
  description: string;
  /** 기사 URL */
  url: string;
  /** 최초 발행일 (ISO 8601 형식: YYYY-MM-DD) */
  datePublished?: string;
  /** 최종 수정일 (ISO 8601 형식: YYYY-MM-DD) */
  dateModified?: string;
  /** 숙련도 수준 (예: 'Beginner', 'Expert') */
  proficiencyLevel?: string;
  /** 기술 종속성 (예: ['JavaScript', 'Browser']) */
  dependencies?: string[];
  /** 저자 */
  author?: string | OrganizationSchema;
  /** 언어 코드 */
  inLanguage?: string;
}

/** TechArticle JSON-LD schema */
export interface TechArticleJsonLd extends JsonLdSchema {
  '@type': 'TechArticle';
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  proficiencyLevel?: string;
  dependencies?: string;
  author?: { '@type': 'Person' | 'Organization'; name: string; url?: string };
  inLanguage?: string;
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
