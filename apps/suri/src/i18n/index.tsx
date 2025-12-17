/**
 * @fileoverview URL 기반 로케일 라우팅 시스템 (ko, en, ja)
 *
 * URL 경로에 따라 언어를 결정합니다:
 * - `/` 또는 `/browse` → 영어 (기본)
 * - `/ko` 또는 `/ko/browse` → 한국어
 * - `/ja` 또는 `/ja/browse` → 일본어
 */
import {
  createContext,
  useContext,
  createMemo,
  type ParentComponent,
} from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

export type Language = "ko" | "en" | "ja";

export interface UILabels {
  // Common
  search: string;
  searchPlaceholder: string;
  home: string;
  browse: string;
  about: string;
  noResults: string;
  loading: string;

  // Navigation
  backToList: string;
  viewAll: string;
  previous: string;
  next: string;

  // Math specific
  definition: string;
  formula: string;
  formulas: string;
  example: string;
  examples: string;
  visualization: string;
  history: string;
  applications: string;
  relatedConcepts: string;

  // Difficulty
  difficulty: string;
  elementary: string;
  middleSchool: string;
  highSchool: string;
  undergraduate: string;
  graduate: string;

  // Relations
  prerequisites: string;
  nextTopics: string;
  related: string;
  appliedIn: string;

  // Math fields
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

  // Hero
  heroTitle: string;
  heroSubtitle: string;
  featuredConcepts: string;
  browseByField: string;

  // About
  aboutTitle: string;
  aboutDescription: string;

  // Favorites & Study
  favorites: string;
  study: string;
  learningPath: string;
  progress: string;
  recentlyViewed: string;
}

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
    // Common
    search: "검색",
    searchPlaceholder: "수학 개념을 검색하세요...",
    home: "홈",
    browse: "찾아보기",
    about: "소개",
    noResults: "검색 결과가 없습니다",
    loading: "로딩 중...",

    // Navigation
    backToList: "목록으로",
    viewAll: "전체 보기",
    previous: "이전",
    next: "다음",

    // Math specific
    definition: "정의",
    formula: "공식",
    formulas: "공식들",
    example: "예제",
    examples: "예제들",
    visualization: "시각화",
    history: "역사",
    applications: "응용 분야",
    relatedConcepts: "연관 개념",

    // Difficulty
    difficulty: "난이도",
    elementary: "초등",
    middleSchool: "중등",
    highSchool: "고등",
    undergraduate: "대학",
    graduate: "대학원+",

    // Relations
    prerequisites: "선행 개념",
    nextTopics: "후행 개념",
    related: "관련 개념",
    appliedIn: "응용 분야",

    // Math fields
    foundations: "기초 수학",
    algebra: "대수학",
    geometry: "기하학",
    trigonometry: "삼각법",
    analysis: "해석학",
    linearAlgebra: "선형대수",
    probability: "확률/통계",
    discrete: "이산수학",
    numberTheory: "수론",
    topology: "위상수학",
    logic: "수리논리",
    dynamics: "동역학/카오스",
    optimization: "최적화",
    numerical: "수치해석",
    applied: "응용수학",
    constants: "수학 상수",
    symbols: "수학 기호",
    theorems: "유명 정리",

    // Hero
    heroTitle: "수리 - 수학 문서",
    heroSubtitle: "누구나 쉽게 배우는 수학 개념 사전",
    featuredConcepts: "주요 개념",
    browseByField: "분야별 찾아보기",

    // About
    aboutTitle: "수리 소개",
    aboutDescription: "모든 수준의 학습자를 위한 수학 개념 문서입니다.",

    // Favorites & Study
    favorites: "즐겨찾기",
    study: "학습",
    learningPath: "학습 경로",
    progress: "진행률",
    recentlyViewed: "최근 본 문서",
  },
  en: {
    // Common
    search: "Search",
    searchPlaceholder: "Search math concepts...",
    home: "Home",
    browse: "Browse",
    about: "About",
    noResults: "No results found",
    loading: "Loading...",

    // Navigation
    backToList: "Back to list",
    viewAll: "View all",
    previous: "Previous",
    next: "Next",

    // Math specific
    definition: "Definition",
    formula: "Formula",
    formulas: "Formulas",
    example: "Example",
    examples: "Examples",
    visualization: "Visualization",
    history: "History",
    applications: "Applications",
    relatedConcepts: "Related Concepts",

    // Difficulty
    difficulty: "Difficulty",
    elementary: "Elementary",
    middleSchool: "Middle School",
    highSchool: "High School",
    undergraduate: "Undergraduate",
    graduate: "Graduate+",

    // Relations
    prerequisites: "Prerequisites",
    nextTopics: "Next Topics",
    related: "Related",
    appliedIn: "Applied In",

    // Math fields
    foundations: "Foundations",
    algebra: "Algebra",
    geometry: "Geometry",
    trigonometry: "Trigonometry",
    analysis: "Analysis",
    linearAlgebra: "Linear Algebra",
    probability: "Probability & Statistics",
    discrete: "Discrete Math",
    numberTheory: "Number Theory",
    topology: "Topology",
    logic: "Mathematical Logic",
    dynamics: "Dynamics & Chaos",
    optimization: "Optimization",
    numerical: "Numerical Analysis",
    applied: "Applied Math",
    constants: "Constants",
    symbols: "Symbols",
    theorems: "Famous Theorems",

    // Hero
    heroTitle: "Suri - Math Documentation",
    heroSubtitle: "Learn math concepts easily",
    featuredConcepts: "Featured Concepts",
    browseByField: "Browse by Field",

    // About
    aboutTitle: "About Suri",
    aboutDescription: "Math concept documentation for learners of all levels.",

    // Favorites & Study
    favorites: "Favorites",
    study: "Study",
    learningPath: "Learning Path",
    progress: "Progress",
    recentlyViewed: "Recently Viewed",
  },
  ja: {
    // Common
    search: "検索",
    searchPlaceholder: "数学の概念を検索...",
    home: "ホーム",
    browse: "探す",
    about: "紹介",
    noResults: "検索結果がありません",
    loading: "読み込み中...",

    // Navigation
    backToList: "一覧に戻る",
    viewAll: "すべて見る",
    previous: "前へ",
    next: "次へ",

    // Math specific
    definition: "定義",
    formula: "公式",
    formulas: "公式集",
    example: "例題",
    examples: "例題集",
    visualization: "可視化",
    history: "歴史",
    applications: "応用分野",
    relatedConcepts: "関連概念",

    // Difficulty
    difficulty: "難易度",
    elementary: "小学校",
    middleSchool: "中学校",
    highSchool: "高校",
    undergraduate: "大学",
    graduate: "大学院+",

    // Relations
    prerequisites: "前提知識",
    nextTopics: "次のトピック",
    related: "関連",
    appliedIn: "応用分野",

    // Math fields
    foundations: "基礎数学",
    algebra: "代数学",
    geometry: "幾何学",
    trigonometry: "三角法",
    analysis: "解析学",
    linearAlgebra: "線形代数",
    probability: "確率・統計",
    discrete: "離散数学",
    numberTheory: "数論",
    topology: "位相数学",
    logic: "数理論理学",
    dynamics: "力学系・カオス",
    optimization: "最適化",
    numerical: "数値解析",
    applied: "応用数学",
    constants: "数学定数",
    symbols: "数学記号",
    theorems: "有名な定理",

    // Hero
    heroTitle: "Suri - 数学ドキュメント",
    heroSubtitle: "誰でも簡単に学べる数学概念辞典",
    featuredConcepts: "注目の概念",
    browseByField: "分野別に探す",

    // About
    aboutTitle: "Suriについて",
    aboutDescription: "あらゆるレベルの学習者のための数学概念ドキュメントです。",

    // Favorites & Study
    favorites: "お気に入り",
    study: "学習",
    learningPath: "学習パス",
    progress: "進捗",
    recentlyViewed: "最近見た文書",
  },
};

function getLocaleFromPath(pathname: string): Language {
  if (pathname.startsWith("/ko/") || pathname === "/ko") return "ko";
  if (pathname.startsWith("/ja/") || pathname === "/ja") return "ja";
  return "en";
}

function stripLocaleFromPath(pathname: string): string {
  if (pathname.startsWith("/ko/")) return pathname.slice(3) || "/";
  if (pathname.startsWith("/ja/")) return pathname.slice(3) || "/";
  if (pathname === "/ko" || pathname === "/ja") return "/";
  return pathname;
}

export const I18nProvider: ParentComponent = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const locale = createMemo((): Language => {
    return getLocaleFromPath(location.pathname);
  });

  const setLocale = (lang: Language) => {
    const currentPath = stripLocaleFromPath(location.pathname);
    let newPath: string;

    if (lang === "en") {
      newPath = currentPath;
    } else {
      newPath = `/${lang}${currentPath === "/" ? "" : currentPath}`;
    }

    navigate(newPath);
  };

  const t = <K extends keyof UILabels>(key: K): string => {
    return translations[locale()][key] || key;
  };

  const isKorean = () => locale() === "ko";

  const localePath = (path: string): string => {
    const currentLocale = locale();
    if (currentLocale === "en") {
      return path;
    }
    return `/${currentLocale}${path === "/" ? "" : path}`;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isKorean, localePath }}>
      {props.children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};

export const useLocale = () => useI18n().locale;
export const useT = () => useI18n().t;

export const languageNames: Record<Language, { native: string; english: string }> = {
  ko: { native: "한국어", english: "Korean" },
  en: { native: "English", english: "English" },
  ja: { native: "日本語", english: "Japanese" },
};

export const languageFlags: Record<Language, string> = {
  ko: "KR",
  en: "EN",
  ja: "JP",
};
