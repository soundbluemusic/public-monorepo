import type { Category, CategoryColor } from "./types";

export const categories: Category[] = [
  {
    id: "greetings",
    name: {
      ko: "인사",
      en: "Greetings",
      ja: "挨拶",
    },
    description: {
      ko: "일상에서 사용하는 인사말",
      en: "Everyday greetings and salutations",
      ja: "日常で使う挨拶表現",
    },
    icon: "👋",
    color: "yellow",
    order: 1,
  },
  {
    id: "emotions",
    name: {
      ko: "감정",
      en: "Emotions",
      ja: "感情",
    },
    description: {
      ko: "감정과 기분을 표현하는 단어",
      en: "Words expressing feelings and moods",
      ja: "気持ちや感情を表す言葉",
    },
    icon: "💭",
    color: "pink",
    order: 2,
  },
  {
    id: "daily-life",
    name: {
      ko: "일상생활",
      en: "Daily Life",
      ja: "日常生活",
    },
    description: {
      ko: "일상생활에서 자주 쓰는 단어",
      en: "Common words used in daily activities",
      ja: "日常生活でよく使う言葉",
    },
    icon: "🏠",
    color: "blue",
    order: 3,
  },
  {
    id: "food",
    name: {
      ko: "음식",
      en: "Food",
      ja: "食べ物",
    },
    description: {
      ko: "음식과 식사 관련 단어",
      en: "Food and dining related vocabulary",
      ja: "食べ物と食事に関する言葉",
    },
    icon: "🍜",
    color: "orange",
    order: 4,
  },
  {
    id: "travel",
    name: {
      ko: "여행",
      en: "Travel",
      ja: "旅行",
    },
    description: {
      ko: "여행과 이동 관련 단어",
      en: "Travel and transportation vocabulary",
      ja: "旅行と移動に関する言葉",
    },
    icon: "✈️",
    color: "teal",
    order: 5,
  },
  {
    id: "work",
    name: {
      ko: "직장",
      en: "Work",
      ja: "仕事",
    },
    description: {
      ko: "직장과 비즈니스 관련 단어",
      en: "Work and business related vocabulary",
      ja: "職場とビジネスに関する言葉",
    },
    icon: "💼",
    color: "indigo",
    order: 6,
  },
  {
    id: "culture",
    name: {
      ko: "문화",
      en: "Culture",
      ja: "文化",
    },
    description: {
      ko: "한국 문화 관련 단어",
      en: "Korean culture related vocabulary",
      ja: "韓国文化に関する言葉",
    },
    icon: "🎭",
    color: "purple",
    order: 7,
  },
  {
    id: "numbers",
    name: {
      ko: "숫자/시간",
      en: "Numbers & Time",
      ja: "数字・時間",
    },
    description: {
      ko: "숫자와 시간 관련 단어",
      en: "Numbers and time related vocabulary",
      ja: "数字と時間に関する言葉",
    },
    icon: "🔢",
    color: "green",
    order: 8,
  },
];

// Get category color classes
export function getCategoryColor(color: CategoryColor): string {
  const colors: Record<CategoryColor, string> = {
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    pink: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  };
  return colors[color];
}

// Get category background color for badges
export function getCategoryBgColor(color: CategoryColor): string {
  const colors: Record<CategoryColor, string> = {
    red: "bg-red-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    teal: "bg-teal-500",
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
  };
  return colors[color];
}

// Get category by ID
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
