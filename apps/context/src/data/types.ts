/**
 * @fileoverview Context 앱 핵심 타입 정의
 *
 * 한국어 학습 앱을 위한 데이터 구조를 정의합니다.
 * 한국어를 기준으로 영어, 일본어 번역을 제공합니다.
 *
 * @example
 * ```ts
 * import type { MeaningEntry, Translation, Category } from '@/data/types';
 *
 * const entry: MeaningEntry = {
 *   id: 'hello-1',
 *   korean: '안녕하세요',
 *   romanization: 'annyeonghaseyo',
 *   pronunciation: '[안녕하세요]',
 *   partOfSpeech: 'expression',
 *   categoryId: 'greetings',
 *   translations: {
 *     ko: { word: '안녕하세요', explanation: '만날 때 하는 인사말' },
 *     en: { word: 'Hello', explanation: 'A greeting when meeting someone' },
 *     ja: { word: 'こんにちは', reading: 'konnichiwa', explanation: '出会いの挨拶' },
 *   },
 *   tags: ['formal', 'greeting'],
 *   difficulty: 'beginner',
 *   frequency: 'common',
 * };
 * ```
 */

/**
 * 지원 언어 코드
 * - 'ko': 한국어
 * - 'en': 영어
 * - 'ja': 일본어
 */
export type Language = "ko" | "en" | "ja";

/**
 * 표현 변형 (격식 수준별)
 * @property formal - 격식체 표현 (존댓말, 공식적인 상황)
 * @property casual - 반말 표현 (친구, 비공식적인 상황)
 * @property short - 줄임말 표현 (축약형, 인터넷 용어 등)
 */
export interface Variations {
  formal?: string[];
  casual?: string[];
  short?: string[];
}

/**
 * 특정 언어로의 번역 데이터
 * @property word - 번역된 단어
 * @property reading - 읽기 표기 (일본어: 히라가나/가타카나)
 * @property explanation - 해당 언어로 된 설명
 * @property examples - 해당 언어로 된 예문 목록
 * @property variations - 격식 수준별 표현 변형
 */
export interface Translation {
  word: string;
  reading?: string;
  explanation: string;
  examples?: string[];
  variations?: Variations;
}

/**
 * 한국어 단어 엔트리 (핵심 데이터 구조)
 *
 * 한국어 단어를 중심으로 다국어 번역과 메타데이터를 포함합니다.
 *
 * @property id - 고유 식별자 (예: 'hello-1', 'thanks-2')
 * @property korean - 한국어 단어 (원본)
 * @property romanization - 로마자 표기 (영어 사용자용, 예: 'gamsahamnida')
 * @property pronunciation - 표준 발음 표기 (한국어 사용자용, 예: '[감사함니다]')
 * @property hanja - 한자 표기 (일본어 사용자용)
 * @property partOfSpeech - 품사
 * @property categoryId - 소속 카테고리 ID
 * @property translations - 언어별 번역 (ko, en, ja)
 * @property tags - 검색 및 분류용 태그
 * @property difficulty - 학습 난이도
 * @property frequency - 사용 빈도 (선택)
 * @property createdAt - 생성 일시 (ISO 8601)
 * @property updatedAt - 수정 일시 (ISO 8601)
 */
export interface MeaningEntry {
  id: string;
  korean: string;
  romanization: string;
  pronunciation?: string;
  hanja?: string;
  partOfSpeech: PartOfSpeech;
  categoryId: string;
  translations: {
    ko: Translation;
    en: Translation;
    ja: Translation;
  };
  tags: string[];
  difficulty: DifficultyLevel;
  frequency?: FrequencyLevel;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 품사 유형
 * - noun: 명사
 * - verb: 동사
 * - adjective: 형용사
 * - adverb: 부사
 * - particle: 조사
 * - interjection: 감탄사
 * - conjunction: 접속사
 * - pronoun: 대명사
 * - determiner: 관형사
 * - expression: 표현/관용구
 */
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

/**
 * 학습 난이도
 * - beginner: 초급 (TOPIK 1-2급)
 * - intermediate: 중급 (TOPIK 3-4급)
 * - advanced: 고급 (TOPIK 5-6급)
 */
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

/**
 * 사용 빈도
 * - common: 매우 자주 사용 (일상 대화 필수)
 * - frequent: 자주 사용 (일반적인 상황)
 * - occasional: 가끔 사용 (특정 상황)
 * - rare: 드물게 사용 (문어체/전문 용어)
 */
export type FrequencyLevel = "common" | "frequent" | "occasional" | "rare";

/**
 * 카테고리 (단어 분류)
 * @property id - 고유 식별자 (예: 'greetings', 'emotions')
 * @property name - 다국어 카테고리명
 * @property description - 다국어 카테고리 설명
 * @property icon - 아이콘 (이모지 또는 아이콘 클래스)
 * @property color - 테마 색상
 * @property order - 표시 순서 (오름차순)
 */
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

/**
 * 카테고리 색상 팔레트
 * Tailwind CSS 색상 클래스와 매핑됩니다.
 */
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

/**
 * 검색 결과 항목
 * @property entry - 매칭된 단어 엔트리
 * @property category - 해당 단어의 카테고리
 * @property score - 검색 관련도 점수 (높을수록 관련성 높음)
 * @property matchedIn - 검색어가 매칭된 필드 목록
 */
export interface SearchResult {
  entry: MeaningEntry;
  category: Category;
  score: number;
  matchedIn: ("korean" | "translation" | "explanation" | "tags")[];
}

/**
 * 네비게이션 항목
 * @property id - 고유 식별자
 * @property label - 다국어 레이블
 * @property href - 링크 URL
 * @property icon - 아이콘 (선택)
 */
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

/**
 * 페이지 메타데이터 (SEO)
 * @property title - 페이지 제목
 * @property description - 페이지 설명
 * @property keywords - 검색 키워드 목록 (선택)
 */
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
}

/**
 * UI 레이블 (다국어 지원)
 *
 * 앱 전체에서 사용되는 번역 문자열을 정의합니다.
 * i18n 시스템에서 언어별로 이 인터페이스를 구현합니다.
 */
export interface UILabels {
  /** 공통 UI 레이블 */
  search: string;
  searchPlaceholder: string;
  home: string;
  browse: string;
  about: string;
  noResults: string;
  loading: string;

  /** 단어 엔트리 관련 레이블 */
  korean: string;
  romanization: string;
  translation: string;
  explanation: string;
  examples: string;
  relatedWords: string;

  /** 변형 표현 레이블 */
  variations: string;
  formal: string;
  casual: string;
  short: string;
  partOfSpeech: string;
  difficulty: string;
  category: string;
  tags: string;

  /** 난이도 레이블 */
  beginner: string;
  intermediate: string;
  advanced: string;

  /** 품사 레이블 */
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

  /** 액션 버튼 레이블 */
  copyToClipboard: string;
  copied: string;
  listenPronunciation: string;

  /** 네비게이션 레이블 */
  backToList: string;
  viewAll: string;

  /** 홈페이지 레이블 */
  heroTitle: string;
  heroSubtitle: string;
  featuredWords: string;
  browseByCategory: string;

  /** 소개 페이지 레이블 */
  aboutTitle: string;
  aboutDescription: string;
}
