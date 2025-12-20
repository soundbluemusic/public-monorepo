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

  const isKorean = locale === 'ko';

  const localePath = (path: string): string => {
    if (locale === 'en') {
      return path;
    }
    return `/${locale}${path === '/' ? '' : path}`;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isKorean, localePath }}>
      {children}
    </I18nContext.Provider>
  );
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
