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
  backToList: string;
  viewAll: string;
  previous: string;
  next: string;
  definition: string;
  formula: string;
  formulas: string;
  example: string;
  examples: string;
  visualization: string;
  history: string;
  applications: string;
  relatedConcepts: string;
  difficulty: string;
  elementary: string;
  middleSchool: string;
  highSchool: string;
  undergraduate: string;
  graduate: string;
  prerequisites: string;
  nextTopics: string;
  related: string;
  appliedIn: string;
  foundations: string;
  algebra: string;
  geometry: string;
  trigonometry: string;
  analysis: string;
  linearAlgebra: string;
  probability: string;
  discrete: string;
  numberTheory: string;
  topology: string;
  logic: string;
  dynamics: string;
  optimization: string;
  numerical: string;
  applied: string;
  constants: string;
  symbols: string;
  theorems: string;
  heroTitle: string;
  heroSubtitle: string;
  featuredConcepts: string;
  browseByField: string;
  aboutTitle: string;
  aboutDescription: string;
  favorites: string;
  study: string;
  learningPath: string;
  progress: string;
  recentlyViewed: string;
  // Meta tags
  metaHomeTitle: string;
  metaHomeDescription: string;
  metaAboutTitle: string;
  metaAboutDescription: string;
  metaBrowseTitle: string;
  metaBrowseDescription: string;
  metaSearchTitle: string;
  metaSearchDescription: string;
  metaConstantsTitle: string;
  metaConstantsDescription: string;
  metaFavoritesTitle: string;
  metaFavoritesDescription: string;
  meta404Title: string;
  meta404Description: string;
  // Page content
  logoText: string;
  browseAllConcepts: string;
  features: string;
  searchResults: string;
  searchResultsFor: string;
  resultsCount: string;
  tryDifferentSearch: string;
  conceptNotFound: string;
  fieldNotFound: string;
  subfields: string;
  noSubfields: string;
  concepts: string;
  mathFields: string;
  pageNotFoundMsg: string;
  goBackHome: string;
  discoveredBy: string;
  exampleNumber: string;
  hideSolution: string;
  showSolution: string;
  // About features
  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;
  feature5: string;
  feature6: string;
  feature7: string;
  feature8: string;
  // Footer & UI
  footerText: string;
  github: string;
  relatedDocuments: string;
  noFavoritesYet: string;
  addFavoritesHint: string;
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
    searchPlaceholder: '수학 개념을 검색하세요...',
    home: '홈',
    browse: '찾아보기',
    about: '소개',
    noResults: '검색 결과가 없습니다',
    loading: '로딩 중...',
    backToList: '목록으로',
    viewAll: '전체 보기',
    previous: '이전',
    next: '다음',
    definition: '정의',
    formula: '공식',
    formulas: '공식들',
    example: '예제',
    examples: '예제들',
    visualization: '시각화',
    history: '역사',
    applications: '응용 분야',
    relatedConcepts: '연관 개념',
    difficulty: '난이도',
    elementary: '초등',
    middleSchool: '중등',
    highSchool: '고등',
    undergraduate: '대학',
    graduate: '대학원+',
    prerequisites: '선행 개념',
    nextTopics: '후행 개념',
    related: '관련 개념',
    appliedIn: '응용 분야',
    foundations: '기초 수학',
    algebra: '대수학',
    geometry: '기하학',
    trigonometry: '삼각법',
    analysis: '해석학',
    linearAlgebra: '선형대수',
    probability: '확률/통계',
    discrete: '이산수학',
    numberTheory: '수론',
    topology: '위상수학',
    logic: '수리논리',
    dynamics: '동역학/카오스',
    optimization: '최적화',
    numerical: '수치해석',
    applied: '응용수학',
    constants: '수학 상수',
    symbols: '수학 기호',
    theorems: '유명 정리',
    heroTitle: '수리 - 수학 문서',
    heroSubtitle: '누구나 쉽게 배우는 수학 개념 사전',
    featuredConcepts: '주요 개념',
    browseByField: '분야별 찾아보기',
    aboutTitle: '수리 소개',
    aboutDescription: '모든 수준의 학습자를 위한 수학 개념 문서입니다.',
    favorites: '즐겨찾기',
    study: '학습',
    learningPath: '학습 경로',
    progress: '진행률',
    recentlyViewed: '최근 본 문서',
    // Meta tags
    metaHomeTitle: '수리 - 수학 문서',
    metaHomeDescription: '누구나 쉽게 배우는 수학 개념 사전',
    metaAboutTitle: '소개 - 수리',
    metaAboutDescription: '수리 소개 - 학습자를 위한 수학 문서',
    metaBrowseTitle: '찾아보기 - 수리',
    metaBrowseDescription: '분야별로 수학 개념 찾아보기',
    metaSearchTitle: '검색 - 수리',
    metaSearchDescription: '수학 개념 검색',
    metaConstantsTitle: '수학 상수 - 수리',
    metaConstantsDescription: '수학 상수',
    metaFavoritesTitle: '즐겨찾기 - 수리',
    metaFavoritesDescription: '즐겨찾는 수학 개념',
    meta404Title: '404 - 수리',
    meta404Description: '페이지를 찾을 수 없습니다',
    // Page content
    logoText: '수리',
    browseAllConcepts: '모든 개념 탐색하기',
    features: '기능',
    searchResults: '검색 결과',
    searchResultsFor: '에 대한 검색 결과',
    resultsCount: '개의 결과',
    tryDifferentSearch: '다른 검색어를 시도해보세요.',
    conceptNotFound: '개념을 찾을 수 없습니다',
    fieldNotFound: '분야를 찾을 수 없습니다',
    subfields: '세부 분야',
    noSubfields: '아직 세부 분야가 없습니다.',
    concepts: '개념 목록',
    mathFields: '수학 분야',
    pageNotFoundMsg: '페이지를 찾을 수 없습니다',
    goBackHome: '홈으로 돌아가기',
    discoveredBy: '발견자',
    exampleNumber: '예제',
    hideSolution: '풀이 숨기기',
    showSolution: '풀이 보기',
    // About features
    feature1: '18개의 주요 수학 분야 (기초 수학부터 응용 수학까지)',
    feature2: 'Unicode와 MathML을 사용한 네이티브 수식 렌더링',
    feature3: '모든 개념에 대한 난이도 표시 (초등~대학원)',
    feature4: '연관 개념 탐색',
    feature5: '다국어 지원 (한국어, 영어)',
    feature6: '다크 모드 지원',
    feature7: 'PWA - 오프라인에서도 동작',
    feature8: '완전한 정적 사이트 생성 (SSG)',
    // Footer & UI
    footerText: 'Roots by SoundBlueMusic',
    github: 'GitHub',
    relatedDocuments: '연관 문서',
    noFavoritesYet: '아직 즐겨찾기한 개념이 없습니다',
    addFavoritesHint: '개념 페이지에서 ♡ 버튼을 눌러 추가하세요',
  },
  en: {
    search: 'Search',
    searchPlaceholder: 'Search math concepts...',
    home: 'Home',
    browse: 'Browse',
    about: 'About',
    noResults: 'No results found',
    loading: 'Loading...',
    backToList: 'Back to list',
    viewAll: 'View all',
    previous: 'Previous',
    next: 'Next',
    definition: 'Definition',
    formula: 'Formula',
    formulas: 'Formulas',
    example: 'Example',
    examples: 'Examples',
    visualization: 'Visualization',
    history: 'History',
    applications: 'Applications',
    relatedConcepts: 'Related Concepts',
    difficulty: 'Difficulty',
    elementary: 'Elementary',
    middleSchool: 'Middle School',
    highSchool: 'High School',
    undergraduate: 'Undergraduate',
    graduate: 'Graduate+',
    prerequisites: 'Prerequisites',
    nextTopics: 'Next Topics',
    related: 'Related',
    appliedIn: 'Applied In',
    foundations: 'Foundations',
    algebra: 'Algebra',
    geometry: 'Geometry',
    trigonometry: 'Trigonometry',
    analysis: 'Analysis',
    linearAlgebra: 'Linear Algebra',
    probability: 'Probability & Statistics',
    discrete: 'Discrete Math',
    numberTheory: 'Number Theory',
    topology: 'Topology',
    logic: 'Mathematical Logic',
    dynamics: 'Dynamics & Chaos',
    optimization: 'Optimization',
    numerical: 'Numerical Analysis',
    applied: 'Applied Math',
    constants: 'Constants',
    symbols: 'Symbols',
    theorems: 'Famous Theorems',
    heroTitle: 'Roots - Math Documentation',
    heroSubtitle: 'Learn math concepts easily',
    featuredConcepts: 'Featured Concepts',
    browseByField: 'Browse by Field',
    aboutTitle: 'About Roots',
    aboutDescription: 'Math concept documentation for learners of all levels.',
    favorites: 'Favorites',
    study: 'Study',
    learningPath: 'Learning Path',
    progress: 'Progress',
    recentlyViewed: 'Recently Viewed',
    // Meta tags
    metaHomeTitle: 'Roots - Math Documentation',
    metaHomeDescription: 'Learn math concepts easily',
    metaAboutTitle: 'About - Roots',
    metaAboutDescription: 'About Roots - Math documentation for learners',
    metaBrowseTitle: 'Browse - Roots',
    metaBrowseDescription: 'Browse math concepts by field',
    metaSearchTitle: 'Search - Roots',
    metaSearchDescription: 'Search math concepts',
    metaConstantsTitle: 'Constants - Roots',
    metaConstantsDescription: 'Mathematical constants',
    metaFavoritesTitle: 'Favorites - Roots',
    metaFavoritesDescription: 'Your favorite math concepts',
    meta404Title: '404 - Roots',
    meta404Description: 'Page not found',
    // Page content
    logoText: 'Roots',
    browseAllConcepts: 'Browse all concepts',
    features: 'Features',
    searchResults: 'Search results',
    searchResultsFor: 'Search results for',
    resultsCount: ' results',
    tryDifferentSearch: 'Try a different search term.',
    conceptNotFound: 'Concept not found',
    fieldNotFound: 'Field not found',
    subfields: 'Subfields',
    noSubfields: 'No subfields available yet.',
    concepts: 'Concepts',
    mathFields: 'Math Fields',
    pageNotFoundMsg: 'Page not found',
    goBackHome: 'Go back home',
    discoveredBy: 'Discovered by',
    exampleNumber: 'Example',
    hideSolution: 'Hide solution',
    showSolution: 'Show solution',
    // About features
    feature1: '18 major math fields from foundations to applied mathematics',
    feature2: 'Native math rendering with Unicode and MathML',
    feature3: 'Difficulty levels for all concepts (Elementary to Graduate)',
    feature4: 'Related concepts navigation',
    feature5: 'Multi-language support (Korean, English)',
    feature6: 'Dark mode support',
    feature7: 'PWA - works offline',
    feature8: 'Full static site generation (SSG)',
    // Footer & UI
    footerText: 'Roots by SoundBlueMusic',
    github: 'GitHub',
    relatedDocuments: 'Related Documents',
    noFavoritesYet: 'No favorite concepts yet',
    addFavoritesHint: 'Click the ♡ button on concept pages to add favorites',
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
