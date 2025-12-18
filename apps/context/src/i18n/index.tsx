import type { UILabels } from '@/data/types';
import { useLocation, useNavigate } from '@solidjs/router';
import {
  type Language,
  getLocaleFromPath,
  languageFlags,
  languageNames,
  stripLocaleFromPath,
} from '@soundblue/shared';
/**
 * @fileoverview URL 기반 로케일 라우팅 시스템 (ko, en)
 *
 * URL 경로에 따라 언어를 결정합니다:
 * - `/` 또는 `/browse` → 영어 (기본)
 * - `/ko` 또는 `/ko/browse` → 한국어
 *
 * @example
 * ```tsx
 * import { I18nProvider, useI18n, useT, useLocale } from '@/i18n';
 *
 * // Provider로 감싸기 (Router 내부)
 * <Router>
 *   <I18nProvider>
 *     <App />
 *   </I18nProvider>
 * </Router>
 *
 * // 컴포넌트 내에서 사용
 * function Component() {
 *   const { locale, setLocale, t, localePath } = useI18n();
 *
 *   return (
 *     <div>
 *       <h1>{t('heroTitle')}</h1>
 *       <button onClick={() => setLocale('ko')}>한국어</button>
 *       <a href={localePath('/browse')}>둘러보기</a>
 *     </div>
 *   );
 * }
 * ```
 */
import { type ParentComponent, createContext, createMemo, useContext } from 'solid-js';

// Re-export from shared
export { languageNames, languageFlags };
export type { Language };

/**
 * i18n 컨텍스트 타입
 * @property locale - 현재 로케일 반환 함수
 * @property setLocale - 로케일 변경 (URL 네비게이션 발생)
 * @property t - 타입 안전한 번역 함수 (UILabels 키만 허용)
 * @property isKorean - 현재 한국어인지 여부
 * @property localePath - 현재 로케일에 맞는 경로 생성
 */
interface I18nContextType {
  locale: () => Language;
  setLocale: (lang: Language) => void;
  t: <K extends keyof UILabels>(key: K) => string;
  isKorean: () => boolean;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType>();

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

/**
 * i18n 컨텍스트 프로바이더
 *
 * 앱의 최상위에서 Router 내부에 배치해야 합니다.
 *
 * @example
 * ```tsx
 * <Router>
 *   <I18nProvider>
 *     <Routes>...</Routes>
 *   </I18nProvider>
 * </Router>
 * ```
 */
export const I18nProvider: ParentComponent = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const locale = createMemo((): Language => {
    return getLocaleFromPath(location.pathname);
  });

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
    return translations[locale()][key] || key;
  };

  const isKorean = () => locale() === 'ko';
  const isEnglish = () => locale() === 'en';

  const localePath = (path: string): string => {
    const currentLocale = locale();
    if (currentLocale === 'en') {
      return path;
    }
    return `/${currentLocale}${path === '/' ? '' : path}`;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isKorean, localePath }}>
      {props.children}
    </I18nContext.Provider>
  );
};

/**
 * i18n 컨텍스트 훅
 *
 * @returns I18nContextType 객체 (locale, setLocale, t, isKorean, localePath)
 * @throws I18nProvider 외부에서 호출 시 에러
 */
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

/**
 * 현재 로케일만 반환하는 훅
 * @returns 현재 로케일을 반환하는 시그널 함수
 */
export const useLocale = () => useI18n().locale;

/**
 * 번역 함수만 반환하는 훅
 * @returns UILabels 키를 받아 번역된 문자열을 반환하는 함수
 */
export const useT = () => useI18n().t;
