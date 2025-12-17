// Supported languages
export type Language = "ko" | "en" | "ja";

// Translation for a specific language
export interface Translation {
  word: string;           // Translated word
  reading?: string;       // Reading (for Japanese: hiragana/katakana)
  explanation: string;    // Explanation in target language
  examples?: string[];    // Example sentences in target language
}

// Meaning entry - Korean word with translations
export interface MeaningEntry {
  id: string;
  korean: string;         // Korean word (always the source)
  romanization: string;   // Romanization for English speakers (e.g., "gamsahamnida")
  pronunciation?: string; // Standard Korean pronunciation for Korean speakers (e.g., "[감사함니다]")
  hanja?: string;         // Hanja for Japanese speakers
  partOfSpeech: PartOfSpeech;
  categoryId: string;
  translations: {
    ko: Translation;      // Korean explanation (for Korean users)
    en: Translation;
    ja: Translation;
  };
  tags: string[];
  difficulty: DifficultyLevel;
  frequency?: FrequencyLevel;
  createdAt?: string;
  updatedAt?: string;
}

// Part of speech
export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "particle"
  | "interjection"
  | "conjunction"
  | "pronoun"
  | "determiner"
  | "expression";

// Difficulty level
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

// Frequency level
export type FrequencyLevel = "common" | "frequent" | "occasional" | "rare";

// Category for organizing entries
export interface Category {
  id: string;
  name: {
    ko: string;
    en: string;
    ja: string;
  };
  description: {
    ko: string;
    en: string;
    ja: string;
  };
  icon: string;
  color: CategoryColor;
  order: number;
}

export type CategoryColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "indigo"
  | "purple"
  | "pink";

// Search result
export interface SearchResult {
  entry: MeaningEntry;
  category: Category;
  score: number;
  matchedIn: ("korean" | "translation" | "explanation" | "tags")[];
}

// Navigation item
export interface NavItem {
  id: string;
  label: {
    ko: string;
    en: string;
    ja: string;
  };
  href: string;
  icon?: string;
}

// Page metadata
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
}

// UI Labels type for i18n
export interface UILabels {
  // Common
  search: string;
  searchPlaceholder: string;
  home: string;
  browse: string;
  about: string;
  noResults: string;
  loading: string;

  // Entry
  korean: string;
  romanization: string;
  translation: string;
  explanation: string;
  examples: string;
  relatedWords: string;
  partOfSpeech: string;
  difficulty: string;
  category: string;
  tags: string;

  // Difficulty labels
  beginner: string;
  intermediate: string;
  advanced: string;

  // Part of speech labels
  noun: string;
  verb: string;
  adjective: string;
  adverb: string;
  particle: string;
  interjection: string;
  conjunction: string;
  pronoun: string;
  determiner: string;
  expression: string;

  // Actions
  copyToClipboard: string;
  copied: string;
  listenPronunciation: string;

  // Navigation
  backToList: string;
  viewAll: string;

  // Homepage
  heroTitle: string;
  heroSubtitle: string;
  featuredWords: string;
  browseByCategory: string;

  // About
  aboutTitle: string;
  aboutDescription: string;
}
