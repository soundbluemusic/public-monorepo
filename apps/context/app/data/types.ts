// Re-export for backward compatibility
export type { Language } from '@soundblue/i18n';

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
 * 레벨별 예문 구조
 * 학습 난이도에 따라 예문을 분류합니다.
 * @property beginner - 초급 예문 (짧고 단순한 표현, 2~15자)
 * @property intermediate - 중급 예문 (일상 대화 수준, 10~25자)
 * @property advanced - 고급 예문 (문맥이 있는 표현, 25~45자)
 * @property master - 마스터 예문 (복잡한 상황 설명, 40자 이상)
 */
export interface LeveledExamples {
  beginner: string;
  intermediate: string;
  advanced: string;
  master: string;
}

/**
 * 어휘별 대화예문 한 줄
 * @property speaker - 화자 ("A" 또는 "B")
 * @property text - 대사 텍스트
 * @property romanization - 발음 표기
 * @property translation - 번역
 */
export interface EntryDialogueLine {
  speaker: 'A' | 'B';
  text: string;
  romanization: string;
  translation: string;
}

/**
 * 어휘별 대화예문
 * @property context - 대화 상황 설명 (예: "처음 만나서 인사하며")
 * @property dialogue - 대화 내용 배열 (2-6턴)
 */
export interface EntryDialogue {
  context: string;
  dialogue: EntryDialogueLine[];
}

/**
 * 특정 언어로의 번역 데이터
 * @property word - 번역된 단어
 * @property reading - 읽기 표기 (선택)
 * @property explanation - 해당 언어로 된 설명
 * @property examples - 레벨별 예문 (beginner, intermediate, advanced, master)
 * @property dialogue - 어휘별 대화예문 (선택)
 * @property variations - 격식 수준별 표현 변형
 */
export interface Translation {
  word: string;
  reading?: string;
  explanation: string;
  examples?: LeveledExamples;
  dialogue?: EntryDialogue;
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
 * @property pronunciation - 발음 표기 객체
 *   - korean: 한국어 발음 표기 (예: '[감사함니다]')
 *   - ipa: 국제음성기호 표기 (예: '[kam.sa.ham.ni.da]')
 * @property partOfSpeech - 품사
 * @property categoryId - 소속 카테고리 ID
 * @property translations - 언어별 번역 (ko, en)
 * @property tags - 검색 및 분류용 태그
 * @property difficulty - 학습 난이도
 * @property frequency - 사용 빈도 (선택)
 * @property colorCode - 색상 코드 (colors 카테고리 전용, hex 형식 예: "#FF0000")
 * @property createdAt - 생성 일시 (ISO 8601)
 * @property updatedAt - 수정 일시 (ISO 8601)
 */
export interface MeaningEntry {
  id: string;
  korean: string;
  romanization: string;
  pronunciation?: {
    korean: string;
    ipa: string;
  };
  partOfSpeech: PartOfSpeech;
  categoryId: string;
  translations: {
    ko: Translation;
    en: Translation;
  };
  tags: string[];
  difficulty: DifficultyLevel;
  frequency?: FrequencyLevel;
  /** 색상 코드 (colors 카테고리 전용, hex 형식) */
  colorCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Locale별 엔트리 (번들 최적화용)
 *
 * MeaningEntry와 동일하지만 translations 대신 단일 translation 필드만 포함합니다.
 * SSG 빌드 시 locale별로 분리된 JSON에서 로드되며, 약 50% 용량 절감 효과가 있습니다.
 *
 * ## Dialogue lazy-loading
 * dialogue 데이터는 translation에 포함되지 않으며, hasDialogue 플래그로 존재 여부만 표시합니다.
 * 실제 dialogue 데이터는 `/data/dialogues/{locale}/{entryId}.json`에서 별도 로드합니다.
 * biome entry는 파일명이 `biome.dialogue.json`으로 예외 처리됩니다.
 *
 * @property translation - 현재 locale의 번역만 포함 (dialogue 제외)
 * @property hasDialogue - dialogue 데이터 존재 여부 (lazy-load용)
 */
export interface LocaleEntry {
  id: string;
  korean: string;
  romanization: string;
  pronunciation?: {
    korean: string;
    ipa?: string;
  };
  partOfSpeech: PartOfSpeech;
  categoryId: string;
  tags: string[];
  difficulty: DifficultyLevel;
  frequency?: FrequencyLevel;
  /** dialogue 데이터 존재 여부 (별도 JSON에서 lazy-load) */
  hasDialogue?: boolean;
  /** 색상 코드 (colors 카테고리 전용, hex 형식) */
  colorCode?: string;
  /** 단일 locale의 번역 (dialogue 제외, 별도 로드) */
  translation: Omit<Translation, 'dialogue'>;
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
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'particle'
  | 'interjection'
  | 'conjunction'
  | 'pronoun'
  | 'determiner'
  | 'expression';

/**
 * 학습 난이도 (Context 앱 전용)
 *
 * 한국어 학습 난이도를 TOPIK 수준으로 분류합니다.
 * - beginner: 초급 (TOPIK 1-2급)
 * - intermediate: 중급 (TOPIK 3-4급)
 * - advanced: 고급 (TOPIK 5-6급)
 *
 * @note Roots 앱은 숫자 기반 난이도(1-5)를 사용합니다.
 *       공유 패키지에서는 이 타입을 사용하지 마세요.
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * 사용 빈도
 * - common: 매우 자주 사용 (일상 대화 필수)
 * - frequent: 자주 사용 (일반적인 상황)
 * - occasional: 가끔 사용 (특정 상황)
 * - rare: 드물게 사용 (문어체/전문 용어)
 */
export type FrequencyLevel = 'common' | 'frequent' | 'occasional' | 'rare';

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
  };
  description: {
    ko: string;
    en: string;
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
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink';

/**
 * 검색 결과 항목 (Context 앱 전용)
 *
 * 한국어 사전 검색 결과를 나타냅니다.
 *
 * @property entry - 매칭된 단어 엔트리
 * @property category - 해당 단어의 카테고리
 * @property score - 검색 관련도 점수 (높을수록 관련성 높음)
 * @property matchedIn - 검색어가 매칭된 필드 목록
 *
 * @note Roots 앱은 MathConcept 기반의 SearchResult를 사용합니다.
 */
export interface SearchResult {
  entry: MeaningEntry;
  category: Category;
  score: number;
  matchedIn: ('korean' | 'translation' | 'explanation' | 'tags')[];
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
// ============================================================================
// 대화 예시 (Conversations)
// ============================================================================

/**
 * 대화 한 줄 (화자와 텍스트)
 * @property speaker - 화자 ("A" 또는 "B")
 * @property ko - 한국어 텍스트
 * @property romanization - 발음 표기 (영어로 소리나는 대로)
 * @property en - 영어 텍스트
 */
export interface DialogueLine {
  speaker: 'A' | 'B';
  ko: string;
  romanization: string;
  en: string;
}

/**
 * 대화 예시 (카테고리별 실생활 대화)
 *
 * 각 카테고리의 어휘가 실제로 어떻게 사용되는지 보여주는 대화 예시입니다.
 * 대화 내 사전에 있는 단어는 자동으로 딥링크로 표시됩니다.
 *
 * @property id - 고유 식별자 (예: "greetings-morning-1")
 * @property categoryId - 소속 카테고리 ID
 * @property title - 다국어 대화 제목 (상황 설명)
 * @property dialogue - 대화 내용 배열
 */
export interface Conversation {
  id: string;
  categoryId: string;
  title: {
    ko: string;
    en: string;
  };
  dialogue: DialogueLine[];
}
