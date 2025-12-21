import { type ReactNode, createContext, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

export type Language = 'ko' | 'en';

export interface UILabels {
  search: string;
  searchPlaceholder: string;
  home: string;
  browse: string;
  about: string;
  noResults: string;
  loading: string;
  korean: string;
  romanization: string;
  translation: string;
  explanation: string;
  examples: string;
  relatedWords: string;
  variations: string;
  formal: string;
  casual: string;
  short: string;
  partOfSpeech: string;
  difficulty: string;
  category: string;
  tags: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  noun: string;
  verb: string;
  adjective: string;
  adverb: string;
  particle: string;
  interjection: string;
  conjunction: string;
  pronoun: string;
  determiner: string;
  expression: string;
  copyToClipboard: string;
  copied: string;
  listenPronunciation: string;
  backToList: string;
  viewAll: string;
  heroTitle: string;
  heroSubtitle: string;
  featuredWords: string;
  browseByCategory: string;
  aboutTitle: string;
  aboutDescription: string;
  menu: string;
  more: string;
  sitemap: string;
  sitemapDescription: string;
  allCategories: string;
  allPages: string;
  searchEngineIndex: string;

  // Meta tags
  metaHomeTitle: string;
  metaHomeDescription: string;
  metaBrowseTitle: string;
  metaBrowseDescription: string;
  metaAboutTitle: string;
  metaAboutDescription: string;
  metaTermsTitle: string;
  metaPrivacyTitle: string;
  metaLicenseTitle: string;
  metaBuiltWithTitle: string;
  metaSitemapTitle: string;
  meta404Title: string;

  // Page content
  browseDescription: string;
  aboutContent: string;
  aboutContentExtra: string;
  entryNotFound: string;
  categoryNotFound: string;
  noCategoryWords: string;
  pageNotFound: string;
  pageNotFoundDescription: string;
  goHome: string;
  termsTitle: string;
  termsContent: string;
  privacyTitle: string;
  privacyContent: string;
  licenseTitle: string;
  licenseContent: string;
  builtWithTitle: string;
  builtWithDescription: string;
  wordCount: string;

  // Footer & UI
  footerCredits: string;
  footerGitHub: string;
  footerBuiltWith: string;
  privacy: string;
  terms: string;
  license: string;
}

interface I18nContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: <K extends keyof UILabels>(key: K) => string;
  isKorean: boolean;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const translations: Record<Language, UILabels> = {
  ko: {
    search: '검색',
    searchPlaceholder: '한국어 단어를 검색하세요...',
    home: '홈',
    browse: '찾아보기',
    about: '소개',
    noResults: '검색 결과가 없습니다',
    loading: '로딩 중...',
    korean: '한국어',
    romanization: '로마자 표기',
    translation: '번역',
    explanation: '설명',
    examples: '예문',
    relatedWords: '관련 단어',
    variations: '표현 변형',
    formal: '격식체',
    casual: '반말',
    short: '줄임말',
    partOfSpeech: '품사',
    difficulty: '난이도',
    category: '카테고리',
    tags: '태그',
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급',
    noun: '명사',
    verb: '동사',
    adjective: '형용사',
    adverb: '부사',
    particle: '조사',
    interjection: '감탄사',
    conjunction: '접속사',
    pronoun: '대명사',
    determiner: '관형사',
    expression: '표현',
    copyToClipboard: '클립보드에 복사',
    copied: '복사됨!',
    listenPronunciation: '발음 듣기',
    backToList: '목록으로',
    viewAll: '전체 보기',
    heroTitle: '한국어 의미 사전',
    heroSubtitle: '한국어 학습자를 위한 다국어 의미 사전',
    featuredWords: '주요 단어',
    browseByCategory: '카테고리로 찾아보기',
    aboutTitle: 'Context 소개',
    aboutDescription: '한국어 학습자를 위한 의미 중심 다국어 사전입니다.',
    menu: '메뉴',
    more: '더보기',
    sitemap: '사이트맵',
    sitemapDescription: '모든 페이지와 카테고리를 한눈에 확인하세요',
    allCategories: '전체 카테고리',
    allPages: '전체 페이지',
    searchEngineIndex: '검색엔진 색인용',

    // Meta tags
    metaHomeTitle: 'Context - 한국어 사전',
    metaHomeDescription: '한국어 학습자를 위한 의미 사전',
    metaBrowseTitle: '찾아보기 - Context',
    metaBrowseDescription: '카테고리별로 한국어 단어 찾아보기',
    metaAboutTitle: '소개 - Context',
    metaAboutDescription: 'Context 한국어 사전 소개',
    metaTermsTitle: '이용약관 - Context',
    metaPrivacyTitle: '개인정보처리방침 - Context',
    metaLicenseTitle: '라이선스 - Context',
    metaBuiltWithTitle: '사용된 기술 - Context',
    metaSitemapTitle: '사이트맵 - Context',
    meta404Title: '404 - 페이지를 찾을 수 없습니다 | Context',

    // Page content
    browseDescription: '카테고리별로 단어를 찾아보세요',
    aboutContent:
      'Context는 한국어 학습자를 위한 의미 중심 사전입니다. 단순한 번역을 넘어 단어의 맥락과 뉘앙스를 이해할 수 있도록 돕습니다.',
    aboutContentExtra: '모든 콘텐츠는 무료로 제공되며, 오픈소스 기술로 제작되었습니다.',
    entryNotFound: '단어를 찾을 수 없습니다',
    categoryNotFound: '카테고리를 찾을 수 없습니다',
    noCategoryWords: '이 카테고리에 단어가 없습니다',
    pageNotFound: '페이지를 찾을 수 없습니다',
    pageNotFoundDescription: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
    goHome: '홈으로 돌아가기',
    termsTitle: '이용약관',
    termsContent:
      '이 사이트를 사용함으로써 귀하는 다음 약관에 동의하는 것으로 간주됩니다. 모든 콘텐츠는 교육 목적으로 제공되며, 상업적 사용이 가능합니다.',
    privacyTitle: '개인정보처리방침',
    privacyContent:
      '이 사이트는 사용자의 개인정보를 수집하지 않습니다. 모든 데이터는 로컬 스토리지에만 저장됩니다.',
    licenseTitle: '라이선스',
    licenseContent:
      '이 프로젝트는 Apache License 2.0 하에 제공됩니다. 소스 코드는 GitHub에서 확인할 수 있습니다.',
    builtWithTitle: '사용된 기술',
    builtWithDescription: '이 사이트는 웹 표준 기술과 오픈소스 라이브러리로 제작되었습니다.',
    wordCount: '개 단어',

    // Footer & UI
    footerCredits: 'UI/UX based on web standards ·',
    footerGitHub: 'GitHub',
    footerBuiltWith: 'Built with ❤️',
    privacy: '개인정보',
    terms: '이용약관',
    license: '라이선스',
  },
  en: {
    search: 'Search',
    searchPlaceholder: 'Search Korean words...',
    home: 'Home',
    browse: 'Browse',
    about: 'About',
    noResults: 'No results found',
    loading: 'Loading...',
    korean: 'Korean',
    romanization: 'Romanization',
    translation: 'Translation',
    explanation: 'Explanation',
    examples: 'Examples',
    relatedWords: 'Related Words',
    variations: 'Variations',
    formal: 'Formal',
    casual: 'Casual',
    short: 'Short',
    partOfSpeech: 'Part of Speech',
    difficulty: 'Difficulty',
    category: 'Category',
    tags: 'Tags',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    noun: 'Noun',
    verb: 'Verb',
    adjective: 'Adjective',
    adverb: 'Adverb',
    particle: 'Particle',
    interjection: 'Interjection',
    conjunction: 'Conjunction',
    pronoun: 'Pronoun',
    determiner: 'Determiner',
    expression: 'Expression',
    copyToClipboard: 'Copy to clipboard',
    copied: 'Copied!',
    listenPronunciation: 'Listen to pronunciation',
    backToList: 'Back to list',
    viewAll: 'View all',
    heroTitle: 'Korean Meaning Dictionary',
    heroSubtitle: 'Multilingual meaning dictionary for Korean learners',
    featuredWords: 'Featured Words',
    browseByCategory: 'Browse by Category',
    aboutTitle: 'About Context',
    aboutDescription: 'A meaning-focused multilingual dictionary for Korean learners.',
    menu: 'Menu',
    more: 'More',
    sitemap: 'Sitemap',
    sitemapDescription: 'View all pages and categories at a glance',
    allCategories: 'All Categories',
    allPages: 'All Pages',
    searchEngineIndex: 'For search engines',

    // Meta tags
    metaHomeTitle: 'Context - Korean Dictionary',
    metaHomeDescription: 'Meaning dictionary for Korean learners',
    metaBrowseTitle: 'Browse - Context',
    metaBrowseDescription: 'Browse Korean words by category',
    metaAboutTitle: 'About - Context',
    metaAboutDescription: 'About Context Korean Dictionary',
    metaTermsTitle: 'Terms of Service - Context',
    metaPrivacyTitle: 'Privacy Policy - Context',
    metaLicenseTitle: 'License - Context',
    metaBuiltWithTitle: 'Built With - Context',
    metaSitemapTitle: 'Sitemap - Context',
    meta404Title: '404 - Page Not Found | Context',

    // Page content
    browseDescription: 'Browse words by category',
    aboutContent:
      'Context is a meaning-focused dictionary for Korean learners. It helps you understand the context and nuances of words beyond simple translation.',
    aboutContentExtra: 'All content is provided for free and built with open-source technology.',
    entryNotFound: 'Entry not found',
    categoryNotFound: 'Category not found',
    noCategoryWords: 'No words in this category',
    pageNotFound: 'Page Not Found',
    pageNotFoundDescription: 'The page you requested does not exist or has been moved.',
    goHome: 'Go Home',
    termsTitle: 'Terms of Service',
    termsContent:
      'By using this site, you agree to the following terms. All content is provided for educational purposes and may be used commercially.',
    privacyTitle: 'Privacy Policy',
    privacyContent:
      'This site does not collect any personal information. All data is stored locally on your device.',
    licenseTitle: 'License',
    licenseContent:
      'This project is provided under the Apache License 2.0. Source code is available on GitHub.',
    builtWithTitle: 'Built With',
    builtWithDescription:
      'This site is built with web standard technologies and open-source libraries.',
    wordCount: ' words',

    // Footer & UI
    footerCredits: 'UI/UX based on web standards ·',
    footerGitHub: 'GitHub',
    footerBuiltWith: 'Built with ❤️',
    privacy: 'Privacy',
    terms: 'Terms',
    license: 'License',
  },
};

function getLocaleFromPath(pathname: string): Language {
  if (pathname.startsWith('/ko/') || pathname === '/ko') return 'ko';
  return 'en';
}

function stripLocaleFromPath(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3) || '/';
  if (pathname === '/ko') return '/';
  return pathname;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const locale = useMemo(() => getLocaleFromPath(location.pathname), [location.pathname]);

  const value = useMemo(() => {
    const setLocale = (lang: Language) => {
      const currentPath = stripLocaleFromPath(location.pathname);
      let newPath: string;

      if (lang === 'en') {
        newPath = currentPath;
      } else {
        newPath = `/${lang}${currentPath === '/' ? '' : currentPath}`;
      }

      navigate(newPath);
    };

    const t = <K extends keyof UILabels>(key: K): string => {
      return translations[locale][key] || key;
    };

    const localePath = (path: string): string => {
      if (locale === 'en') {
        return path;
      }
      return `/${locale}${path === '/' ? '' : path}`;
    };

    return {
      locale,
      setLocale,
      t,
      isKorean: locale === 'ko',
      localePath,
    };
  }, [locale, location.pathname, navigate]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export const useLocale = () => useI18n().locale;
export const useT = () => useI18n().t;
