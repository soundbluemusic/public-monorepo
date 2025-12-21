import {
  type Language,
  buildLocalePath,
  getLocaleFromPath,
  stripLocaleFromPath,
} from '@soundblue/shared-react';
import { type ReactNode, createContext, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

/**
 * UI translation strings
 */
interface UILabels {
  // Home
  'home.title': string;
  'home.subtitle': string;
  'home.builtWith': string;

  // Web API
  'webapi.title': string;
  'webapi.desc': string;
  'webapi.search': string;

  // Libraries
  'libraries.title': string;
  'libraries.desc': string;
  'libraries.search': string;

  // Common
  'common.all': string;
  'common.favorites': string;
  'common.browse': string;
  'common.noResults': string;
  'common.usedHere': string;
  'common.apis': string;
  'common.libraries': string;
  'common.support': string;
  'common.license': string;
  'common.category': string;
  'common.viewDocs': string;
  'common.viewGithub': string;

  // Meta tags
  'meta.homeTitle': string;
  'meta.homeDescription': string;
  'meta.webapiTitle': string;
  'meta.webapiDescription': string;
  'meta.librariesTitle': string;
  'meta.librariesDescription': string;
  'meta.404Title': string;

  // Accessibility
  'aria.closeMenu': string;
  'aria.openMenu': string;
  'aria.closeSidebar': string;
  'aria.expandSidebar': string;
  'aria.collapseSidebar': string;

  // UI
  'ui.permissiveBy': string;
  'ui.github': string;
  'ui.viewSource': string;
  'ui.skipToContent': string;
}

interface I18nContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: <K extends keyof UILabels>(key: K) => string;
  isKorean: boolean;
  isEnglish: boolean;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const translations: Record<Language, UILabels> = {
  en: {
    // Home
    'home.title': 'Free Web Dev Tools',
    'home.subtitle': 'Web Standard APIs and MIT licensed libraries at a glance',
    'home.builtWith': 'This site is built with tools listed here',

    // Web API
    'webapi.title': 'Web API',
    'webapi.desc': 'Browser built-in APIs. Free to use, no installation required',
    'webapi.search': 'Search APIs...',

    // Libraries
    'libraries.title': 'Libraries',
    'libraries.desc': 'MIT licensed open source. Free for commercial use',
    'libraries.search': 'Search libraries...',

    // Common
    'common.all': 'All',
    'common.favorites': 'Favorites',
    'common.browse': 'Browse',
    'common.noResults': 'No results found',
    'common.usedHere': 'Used here',
    'common.apis': 'APIs',
    'common.libraries': 'libraries',
    'common.support': 'Support',
    'common.license': 'License',
    'common.category': 'Category',
    'common.viewDocs': 'View Docs',
    'common.viewGithub': 'GitHub',

    // Meta tags
    'meta.homeTitle': 'Permissive - Free Web Dev Tools',
    'meta.homeDescription': 'Web Standard APIs and MIT licensed libraries at a glance',
    'meta.webapiTitle': 'Web API - Permissive',
    'meta.webapiDescription': 'Browser built-in Web Standard APIs',
    'meta.librariesTitle': 'Libraries - Permissive',
    'meta.librariesDescription': 'MIT licensed open source libraries',
    'meta.404Title': '404 - Page Not Found | Permissive',

    // Accessibility
    'aria.closeMenu': 'Close menu',
    'aria.openMenu': 'Open menu',
    'aria.closeSidebar': 'Close sidebar',
    'aria.expandSidebar': 'Expand sidebar',
    'aria.collapseSidebar': 'Collapse sidebar',

    // UI
    'ui.permissiveBy': 'Permissive by',
    'ui.github': 'GitHub',
    'ui.viewSource': 'View source',
    'ui.skipToContent': 'Skip to content',
  },
  ko: {
    // Home
    'home.title': '무료 웹개발 도구 모음',
    'home.subtitle': '웹표준 API와 MIT 라이센스 라이브러리를 한눈에 보세요',
    'home.builtWith': '이 사이트도 여기 있는 도구로 만들었어요',

    // Web API
    'webapi.title': 'Web API',
    'webapi.desc': '브라우저에 내장된 무료 API. 설치 없이 바로 사용 가능',
    'webapi.search': 'API 검색...',

    // Libraries
    'libraries.title': 'Libraries',
    'libraries.desc': 'MIT 라이센스 오픈소스. 상업적 사용 가능',
    'libraries.search': '라이브러리 검색...',

    // Common
    'common.all': '전체',
    'common.favorites': '즐겨찾기',
    'common.browse': '둘러보기',
    'common.noResults': '검색 결과가 없습니다',
    'common.usedHere': '사용 중',
    'common.apis': '개의 API',
    'common.libraries': '개의 라이브러리',
    'common.support': '지원율',
    'common.license': '라이센스',
    'common.category': '카테고리',
    'common.viewDocs': '문서 보기',
    'common.viewGithub': 'GitHub',

    // Meta tags
    'meta.homeTitle': 'Permissive - 무료 웹개발 도구 모음',
    'meta.homeDescription': '웹표준 API와 MIT 라이센스 라이브러리를 한눈에 보세요',
    'meta.webapiTitle': 'Web API - Permissive',
    'meta.webapiDescription': '브라우저에 내장된 웹 표준 API',
    'meta.librariesTitle': 'Libraries - Permissive',
    'meta.librariesDescription': 'MIT 라이센스 오픈소스 라이브러리',
    'meta.404Title': '404 - 페이지를 찾을 수 없습니다 | Permissive',

    // Accessibility
    'aria.closeMenu': '메뉴 닫기',
    'aria.openMenu': '메뉴 열기',
    'aria.closeSidebar': '사이드바 닫기',
    'aria.expandSidebar': '사이드바 확장',
    'aria.collapseSidebar': '사이드바 축소',

    // UI
    'ui.permissiveBy': 'Permissive by',
    'ui.github': 'GitHub',
    'ui.viewSource': '소스 보기',
    'ui.skipToContent': '콘텐츠로 건너뛰기',
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const locale = useMemo(() => getLocaleFromPath(location.pathname), [location.pathname]);

  const value = useMemo(() => {
    const setLocale = (lang: Language) => {
      const currentPath = stripLocaleFromPath(location.pathname);
      const newPath = lang === 'en' ? currentPath : `/ko${currentPath === '/' ? '' : currentPath}`;
      navigate(newPath);
    };

    const t = <K extends keyof UILabels>(key: K): string => {
      return translations[locale][key] || key;
    };

    const localePath = (path: string): string => {
      return buildLocalePath(path, locale);
    };

    return {
      locale,
      setLocale,
      t,
      isKorean: locale === 'ko',
      isEnglish: locale === 'en',
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

export const languageNames: Record<Language, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  ko: { native: '한국어', english: 'Korean' },
};

export const languageFlags: Record<Language, string> = {
  en: 'EN',
  ko: 'KR',
};
