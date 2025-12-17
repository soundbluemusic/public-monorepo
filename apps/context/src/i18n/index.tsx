import { createSignal, createContext, useContext, createMemo, ParentComponent } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { isServer } from "solid-js/web";
import type { Language, UILabels } from "@/data/types";

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

// Extract locale from URL pathname
function getLocaleFromPath(pathname: string): Language {
  if (pathname.startsWith("/ko/") || pathname === "/ko") return "ko";
  if (pathname.startsWith("/ja/") || pathname === "/ja") return "ja";
  return "en"; // Default is English (no prefix)
}

// Remove locale prefix from path
function stripLocaleFromPath(pathname: string): string {
  if (pathname.startsWith("/ko/")) return pathname.slice(3) || "/";
  if (pathname.startsWith("/ja/")) return pathname.slice(3) || "/";
  if (pathname === "/ko" || pathname === "/ja") return "/";
  return pathname;
}

export const I18nProvider: ParentComponent = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive locale from URL
  const locale = createMemo((): Language => {
    return getLocaleFromPath(location.pathname);
  });

  // Change locale by navigating to new URL
  const setLocale = (lang: Language) => {
    const currentPath = stripLocaleFromPath(location.pathname);
    let newPath: string;

    if (lang === "en") {
      // English has no prefix (default)
      newPath = currentPath;
    } else {
      // Korean and Japanese have prefix
      newPath = `/${lang}${currentPath === "/" ? "" : currentPath}`;
    }

    navigate(newPath);
  };

  const t = <K extends keyof UILabels>(key: K): string => {
    return translations[locale()][key] || key;
  };

  const isKorean = () => locale() === "ko";
  const isEnglish = () => locale() === "en";

  // Generate locale-aware path
  const localePath = (path: string): string => {
    const currentLocale = locale();
    if (currentLocale === "en") {
      return path; // English has no prefix (default)
    }
    // Add locale prefix for ko/ja
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
