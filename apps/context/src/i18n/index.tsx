/**
 * @fileoverview URL 기반 로케일 라우팅 시스템 (ko, en, ja)
 *
 * URL 경로에 따라 언어를 결정합니다:
 * - `/` 또는 `/browse` → 영어 (기본)
 * - `/ko` 또는 `/ko/browse` → 한국어
 * - `/ja` 또는 `/ja/browse` → 일본어
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
 *       <button onClick={() => setLocale('ja')}>日本語</button>
 *       <a href={localePath('/browse')}>둘러보기</a>
 *     </div>
 *   );
 * }
 * ```
 */
import { createSignal, createContext, useContext, createMemo, ParentComponent } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { isServer } from "solid-js/web";
import type { Language, UILabels } from "@/data/types";

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
    search: "검색",
    searchPlaceholder: "한국어 단어를 검색하세요...",
    home: "홈",
    browse: "찾아보기",
    about: "소개",
    noResults: "검색 결과가 없습니다",
    loading: "로딩 중...",
    korean: "한국어",
    romanization: "로마자 표기",
    translation: "번역",
    explanation: "설명",
    examples: "예문",
    relatedWords: "관련 단어",
    partOfSpeech: "품사",
    difficulty: "난이도",
    category: "카테고리",
    tags: "태그",
    beginner: "초급",
    intermediate: "중급",
    advanced: "고급",
    noun: "명사",
    verb: "동사",
    adjective: "형용사",
    adverb: "부사",
    particle: "조사",
    interjection: "감탄사",
    conjunction: "접속사",
    pronoun: "대명사",
    determiner: "관형사",
    expression: "표현",
    copyToClipboard: "클립보드에 복사",
    copied: "복사됨!",
    listenPronunciation: "발음 듣기",
    backToList: "목록으로",
    viewAll: "전체 보기",
    heroTitle: "한국어 의미 사전",
    heroSubtitle: "한국어 학습자를 위한 다국어 의미 사전",
    featuredWords: "주요 단어",
    browseByCategory: "카테고리로 찾아보기",
    aboutTitle: "Context 소개",
    aboutDescription: "한국어 학습자를 위한 의미 중심 다국어 사전입니다.",
  },
  en: {
    search: "Search",
    searchPlaceholder: "Search Korean words...",
    home: "Home",
    browse: "Browse",
    about: "About",
    noResults: "No results found",
    loading: "Loading...",
    korean: "Korean",
    romanization: "Romanization",
    translation: "Translation",
    explanation: "Explanation",
    examples: "Examples",
    relatedWords: "Related Words",
    partOfSpeech: "Part of Speech",
    difficulty: "Difficulty",
    category: "Category",
    tags: "Tags",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    noun: "Noun",
    verb: "Verb",
    adjective: "Adjective",
    adverb: "Adverb",
    particle: "Particle",
    interjection: "Interjection",
    conjunction: "Conjunction",
    pronoun: "Pronoun",
    determiner: "Determiner",
    expression: "Expression",
    copyToClipboard: "Copy to clipboard",
    copied: "Copied!",
    listenPronunciation: "Listen to pronunciation",
    backToList: "Back to list",
    viewAll: "View all",
    heroTitle: "Korean Meaning Dictionary",
    heroSubtitle: "Multilingual meaning dictionary for Korean learners",
    featuredWords: "Featured Words",
    browseByCategory: "Browse by Category",
    aboutTitle: "About Context",
    aboutDescription: "A meaning-focused multilingual dictionary for Korean learners.",
  },
  ja: {
    search: "検索",
    searchPlaceholder: "韓国語の単語を検索...",
    home: "ホーム",
    browse: "探す",
    about: "紹介",
    noResults: "検索結果がありません",
    loading: "読み込み中...",
    korean: "韓国語",
    romanization: "ローマ字表記",
    translation: "翻訳",
    explanation: "説明",
    examples: "例文",
    relatedWords: "関連単語",
    partOfSpeech: "品詞",
    difficulty: "難易度",
    category: "カテゴリー",
    tags: "タグ",
    beginner: "初級",
    intermediate: "中級",
    advanced: "上級",
    noun: "名詞",
    verb: "動詞",
    adjective: "形容詞",
    adverb: "副詞",
    particle: "助詞",
    interjection: "感嘆詞",
    conjunction: "接続詞",
    pronoun: "代名詞",
    determiner: "連体詞",
    expression: "表現",
    copyToClipboard: "クリップボードにコピー",
    copied: "コピーしました！",
    listenPronunciation: "発音を聞く",
    backToList: "一覧に戻る",
    viewAll: "すべて見る",
    heroTitle: "韓国語意味辞典",
    heroSubtitle: "韓国語学習者のための多言語意味辞典",
    featuredWords: "注目の単語",
    browseByCategory: "カテゴリーで探す",
    aboutTitle: "Contextについて",
    aboutDescription: "韓国語学習者のための意味重視の多言語辞典です。",
  },
};

/**
 * URL 경로에서 로케일 추출
 *
 * @param pathname - URL 경로 (예: '/ko/browse', '/ja/word/hello')
 * @returns 추출된 로케일 ('ko' | 'en' | 'ja')
 *
 * @example
 * getLocaleFromPath('/ko/browse')  // 'ko'
 * getLocaleFromPath('/ja/browse')  // 'ja'
 * getLocaleFromPath('/browse')     // 'en'
 */
function getLocaleFromPath(pathname: string): Language {
  if (pathname.startsWith("/ko/") || pathname === "/ko") return "ko";
  if (pathname.startsWith("/ja/") || pathname === "/ja") return "ja";
  return "en"; // Default is English (no prefix)
}

/**
 * URL 경로에서 로케일 프리픽스 제거
 *
 * @param pathname - 로케일이 포함된 URL 경로
 * @returns 로케일이 제거된 순수 경로
 *
 * @example
 * stripLocaleFromPath('/ko/browse')  // '/browse'
 * stripLocaleFromPath('/ja')         // '/'
 * stripLocaleFromPath('/browse')     // '/browse'
 */
function stripLocaleFromPath(pathname: string): string {
  if (pathname.startsWith("/ko/")) return pathname.slice(3) || "/";
  if (pathname.startsWith("/ja/")) return pathname.slice(3) || "/";
  if (pathname === "/ko" || pathname === "/ja") return "/";
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
  const isEnglish = () => locale() === "en";

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

/**
 * i18n 컨텍스트 훅
 *
 * @returns I18nContextType 객체 (locale, setLocale, t, isKorean, localePath)
 * @throws I18nProvider 외부에서 호출 시 에러
 */
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
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

/** 언어별 표시 이름 */
export const languageNames: Record<Language, { native: string; english: string }> = {
  ko: { native: "한국어", english: "Korean" },
  en: { native: "English", english: "English" },
  ja: { native: "日本語", english: "Japanese" },
};

/** 언어별 국가 코드 */
export const languageFlags: Record<Language, string> = {
  ko: "KR",
  en: "EN",
  ja: "JP",
};
