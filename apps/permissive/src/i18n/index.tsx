import { createContext, useContext, createMemo, ParentComponent } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

type Language = "en" | "ko";

interface I18nContextType {
  locale: () => Language;
  setLocale: (lang: Language) => void;
  t: (key: string) => string;
  isKorean: () => boolean;
  isEnglish: () => boolean;
  localePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextType>();

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Home
    "home.title": "Free Web Dev Tools",
    "home.subtitle": "Web Standard APIs and MIT licensed libraries at a glance",
    "home.builtWith": "This site is built with tools listed here",

    // Web API
    "webapi.title": "Web API",
    "webapi.desc": "Browser built-in APIs. Free to use, no installation required",
    "webapi.search": "Search APIs...",

    // Libraries
    "libraries.title": "Libraries",
    "libraries.desc": "MIT licensed open source. Free for commercial use",
    "libraries.search": "Search libraries...",

    // Common
    "common.all": "All",
    "common.favorites": "Favorites",
    "common.browse": "Browse",
    "common.noResults": "No results found",
    "common.usedHere": "Used here",
    "common.apis": "APIs",
    "common.libraries": "libraries",
    "common.support": "Support",
    "common.license": "License",
    "common.category": "Category",
    "common.viewDocs": "View Docs",
    "common.viewGithub": "GitHub",
  },
  ko: {
    // Home
    "home.title": "무료 웹개발 도구 모음",
    "home.subtitle": "웹표준 API와 MIT 라이센스 라이브러리를 한눈에 보세요",
    "home.builtWith": "이 사이트도 여기 있는 도구로 만들었어요",

    // Web API
    "webapi.title": "Web API",
    "webapi.desc": "브라우저에 내장된 무료 API. 설치 없이 바로 사용 가능",
    "webapi.search": "API 검색...",

    // Libraries
    "libraries.title": "Libraries",
    "libraries.desc": "MIT 라이센스 오픈소스. 상업적 사용 가능",
    "libraries.search": "라이브러리 검색...",

    // Common
    "common.all": "전체",
    "common.favorites": "즐겨찾기",
    "common.browse": "둘러보기",
    "common.noResults": "검색 결과가 없습니다",
    "common.usedHere": "사용 중",
    "common.apis": "개의 API",
    "common.libraries": "개의 라이브러리",
    "common.support": "지원율",
    "common.license": "라이센스",
    "common.category": "카테고리",
    "common.viewDocs": "문서 보기",
    "common.viewGithub": "GitHub",
  },
};

// Extract locale from URL pathname
function getLocaleFromPath(pathname: string): Language {
  if (pathname.startsWith("/ko/") || pathname === "/ko") return "ko";
  return "en"; // Default is English (no prefix)
}

// Remove locale prefix from path
function stripLocaleFromPath(pathname: string): string {
  if (pathname.startsWith("/ko/")) return pathname.slice(3) || "/";
  if (pathname === "/ko") return "/";
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
      // Korean has prefix
      newPath = `/ko${currentPath === "/" ? "" : currentPath}`;
    }

    navigate(newPath);
  };

  const t = (key: string): string => {
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
    // Add locale prefix for ko
    return `/ko${path === "/" ? "" : path}`;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isKorean, isEnglish, localePath }}>
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
  en: { native: "English", english: "English" },
  ko: { native: "한국어", english: "Korean" },
};

export const languageFlags: Record<Language, string> = {
  en: "EN",
  ko: "KR",
};
