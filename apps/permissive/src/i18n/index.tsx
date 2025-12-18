import { useLocation, useNavigate } from '@solidjs/router';
/**
 * @fileoverview URL 기반 로케일 라우팅 시스템 (en, ko)
 *
 * URL 경로에 따라 언어를 결정합니다:
 * - `/` 또는 `/libraries` → 영어 (기본)
 * - `/ko` 또는 `/ko/libraries` → 한국어
 *
 * @example
 * ```tsx
 * import { I18nProvider, useI18n, useT, useLocale } from '@/i18n';
 *
 * // Provider로 감싸기
 * <I18nProvider>
 *   <App />
 * </I18nProvider>
 *
 * // 컴포넌트 내에서 사용
 * function Component() {
 *   const { locale, setLocale, t, localePath } = useI18n();
 *
 *   return (
 *     <div>
 *       <p>{t('home.title')}</p>
 *       <button onClick={() => setLocale('ko')}>한국어</button>
 *       <a href={localePath('/libraries')}>라이브러리</a>
 *     </div>
 *   );
 * }
 * ```
 */
import { type ParentComponent, createContext, createMemo, useContext } from 'solid-js';

type Language = 'en' | 'ko';

/**
 * UI 번역 문자열 타입
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
}

/**
 * i18n 컨텍스트 타입
 * @property locale - 현재 로케일 반환 함수
 * @property setLocale - 로케일 변경 (URL 네비게이션 발생)
 * @property t - 타입 안전한 번역 함수 (UILabels 키만 허용)
 * @property isKorean - 현재 한국어인지 여부
 * @property isEnglish - 현재 영어인지 여부
 * @property localePath - 현재 로케일에 맞는 경로 생성
 */
interface I18nContextType {
  locale: () => Language;
  setLocale: (lang: Language) => void;
  t: <K extends keyof UILabels>(key: K) => string;
  isKorean: () => boolean;
  isEnglish: () => boolean;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType>();

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
  },
};

/**
 * URL 경로에서 로케일 추출
 *
 * @param pathname - URL 경로 (예: '/ko/libraries')
 * @returns 추출된 로케일 ('ko' | 'en')
 *
 * @example
 * getLocaleFromPath('/ko/libraries') // 'ko'
 * getLocaleFromPath('/libraries')    // 'en'
 * getLocaleFromPath('/ko')           // 'ko'
 */
function getLocaleFromPath(pathname: string): Language {
  if (pathname.startsWith('/ko/') || pathname === '/ko') return 'ko';
  return 'en'; // Default is English (no prefix)
}

/**
 * URL 경로에서 로케일 프리픽스 제거
 *
 * @param pathname - 로케일이 포함된 URL 경로
 * @returns 로케일이 제거된 순수 경로
 *
 * @example
 * stripLocaleFromPath('/ko/libraries') // '/libraries'
 * stripLocaleFromPath('/ko')           // '/'
 * stripLocaleFromPath('/libraries')    // '/libraries'
 */
function stripLocaleFromPath(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3) || '/';
  if (pathname === '/ko') return '/';
  return pathname;
}

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
      newPath = `/ko${currentPath === '/' ? '' : currentPath}`;
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
    return `/ko${path === '/' ? '' : path}`;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isKorean, isEnglish, localePath }}>
      {props.children}
    </I18nContext.Provider>
  );
};

/**
 * i18n 컨텍스트 훅
 *
 * @returns I18nContextType 객체 (locale, setLocale, t, isKorean, isEnglish, localePath)
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
 * @returns 키를 받아 번역된 문자열을 반환하는 함수
 */
export const useT = () => useI18n().t;

/** 언어별 표시 이름 */
export const languageNames: Record<Language, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  ko: { native: '한국어', english: 'Korean' },
};

/** 언어별 국가 코드 */
export const languageFlags: Record<Language, string> = {
  en: 'EN',
  ko: 'KR',
};
