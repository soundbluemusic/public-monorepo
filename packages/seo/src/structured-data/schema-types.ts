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
// Navigation & List Schemas
// ============================================================================

/**
 * SiteNavigationElement 스키마 생성을 위한 네비게이션 항목
 *
 * @see https://schema.org/SiteNavigationElement
 */
export interface NavigationItem {
  /** 네비게이션 링크 이름 */
  name: string;
  /** 네비게이션 링크 URL */
  url: string;
}

/**
 * SiteNavigationElement 스키마 설정
 *
 * 검색엔진이 사이트의 주요 네비게이션 구조를 파악하는 데 사용됩니다.
 * Google 사이트링크(Sitelinks) 노출에 도움을 줍니다.
 *
 * @see https://schema.org/SiteNavigationElement
 *
 * @example
 * ```typescript
 * const config: SiteNavigationSchema = {
 *   name: 'Main Navigation',
 *   url: 'https://context.soundbluemusic.com',
 *   navigationItems: [
 *     { name: 'Home', url: 'https://context.soundbluemusic.com/' },
 *     { name: 'Browse', url: 'https://context.soundbluemusic.com/browse' },
 *     { name: 'Categories', url: 'https://context.soundbluemusic.com/categories' },
 *   ],
 * };
 * ```
 */
export interface SiteNavigationSchema {
  /** 네비게이션 이름 (예: 'Main Navigation') */
  name: string;
  /** 사이트 기본 URL */
  url: string;
  /** 네비게이션 항목 배열 */
  navigationItems: NavigationItem[];
}

/** SiteNavigationElement JSON-LD schema */
export interface SiteNavigationJsonLd extends JsonLdSchema {
  '@type': 'ItemList';
  name: string;
  url: string;
  itemListElement: Array<{
    '@type': 'SiteNavigationElement';
    position: number;
    name: string;
    url: string;
  }>;
}

/**
 * ItemList 스키마 생성을 위한 단일 항목
 *
 * @see https://schema.org/ListItem
 */
export interface ItemListItem {
  /** 항목 이름 */
  name: string;
  /** 항목 URL */
  url: string;
  /** 항목 설명 (선택사항) */
  description?: string;
}

/**
 * ItemList 스키마 설정
 *
 * 목록 페이지의 항목들을 구조화된 데이터로 제공합니다.
 * Google 검색 결과에서 캐러셀/리스트 리치 스니펫으로 노출될 수 있습니다.
 *
 * @see https://schema.org/ItemList
 * @see https://developers.google.com/search/docs/appearance/structured-data/carousel
 *
 * @example
 * ```typescript
 * const config: ItemListSchema = {
 *   name: 'Korean Dictionary Categories',
 *   description: '52 categories of Korean vocabulary',
 *   url: 'https://context.soundbluemusic.com/',
 *   items: [
 *     { name: 'Greetings', url: 'https://context.soundbluemusic.com/category/greetings' },
 *     { name: 'Food', url: 'https://context.soundbluemusic.com/category/food' },
 *   ],
 * };
 * ```
 */
export interface ItemListSchema {
  /** 목록 이름 (선택사항) */
  name?: string;
  /** 목록 설명 (선택사항) */
  description?: string;
  /** 목록 페이지 URL */
  url: string;
  /** 목록 항목 배열 */
  items: ItemListItem[];
  /** 전체 항목 수 (선택사항 - items 배열이 일부만 포함하는 경우) */
  numberOfItems?: number;
}

/** ItemList JSON-LD schema */
export interface ItemListJsonLd extends JsonLdSchema {
  '@type': 'ItemList';
  name?: string;
  description?: string;
  url: string;
  numberOfItems: number;
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    url: string;
    description?: string;
  }>;
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
