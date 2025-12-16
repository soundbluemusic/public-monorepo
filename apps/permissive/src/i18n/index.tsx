import { createSignal, createContext, useContext, ParentComponent } from "solid-js";
import { isServer } from "solid-js/web";

type Language = "en" | "ko";

interface I18nContextType {
  locale: () => Language;
  setLocale: (lang: Language) => void;
  t: (key: string) => string;
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
    "common.browse": "Browse",
    "common.noResults": "No results found",
    "common.usedHere": "Used here",
    "common.apis": "APIs",
    "common.libraries": "libraries",
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
    "common.browse": "둘러보기",
    "common.noResults": "검색 결과가 없습니다",
    "common.usedHere": "사용 중",
    "common.apis": "개의 API",
    "common.libraries": "개의 라이브러리",
  },
};

export const I18nProvider: ParentComponent = (props) => {
  const getInitialLocale = (): Language => {
    if (isServer) return "en";
    const stored = localStorage.getItem("locale") as Language;
    if (stored) return stored;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith("ko") ? "ko" : "en";
  };

  const [locale, setLocaleState] = createSignal<Language>(getInitialLocale());

  const setLocale = (lang: Language) => {
    setLocaleState(lang);
    if (!isServer) {
      localStorage.setItem("locale", lang);
    }
  };

  const t = (key: string): string => {
    return translations[locale()][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
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
