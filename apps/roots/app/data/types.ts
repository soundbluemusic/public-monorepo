/**
 * @fileoverview 수학 문서 앱 타입 정의
 *
 * 수학 개념, 분야, 공식, 예제 등의 타입을 정의합니다.
 */

// Import Language from i18n package (Single Source of Truth)
import type { Language } from '@soundblue/i18n';

// ============================================
// 기본 타입
// ============================================

// Re-export Language for backward compatibility
export type { Language } from '@soundblue/i18n';

/**
 * 난이도 (Roots 앱 전용)
 *
 * 수학 개념의 학습 난이도를 학년별로 분류합니다.
 * - 1: 초등 (Elementary)
 * - 2: 중등 (Middle School)
 * - 3: 고등 (High School)
 * - 4: 대학 (Undergraduate)
 * - 5: 대학원+ (Graduate+)
 *
 * @note Context 앱은 문자열 기반 난이도('beginner'|'intermediate'|'advanced')를 사용합니다.
 *       공유 패키지에서는 이 타입을 사용하지 마세요.
 */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

/** 난이도 레이블 */
export const difficultyLabels: Record<DifficultyLevel, Record<Language, string>> = {
  1: { ko: '초등', en: 'Elementary' },
  2: { ko: '중등', en: 'Middle School' },
  3: { ko: '고등', en: 'High School' },
  4: { ko: '대학', en: 'Undergraduate' },
  5: { ko: '대학원+', en: 'Graduate+' },
};

// ============================================
// 수학 분야 (18개 대분류)
// ============================================

export type MathField =
  | 'foundations'
  | 'algebra'
  | 'geometry'
  | 'trigonometry'
  | 'analysis'
  | 'linear-algebra'
  | 'probability'
  | 'discrete'
  | 'number-theory'
  | 'topology'
  | 'logic'
  | 'dynamics'
  | 'optimization'
  | 'numerical'
  | 'applied'
  | 'constants'
  | 'symbols'
  | 'theorems'
  // Extended fields from data
  | 'abstract-algebra'
  | 'algebraic-geometry'
  | 'algebraic-topology'
  | 'calculus-of-variations'
  | 'category-theory'
  | 'combinatorics'
  | 'complex-analysis'
  | 'cryptography'
  | 'differential-geometry'
  | 'discrete-mathematics'
  | 'functional-analysis'
  | 'game-theory'
  | 'graph-theory'
  | 'harmonic-analysis'
  | 'homological-algebra'
  | 'information-theory'
  | 'lie-theory'
  | 'measure-theory'
  | 'numerical-analysis'
  | 'operations-research'
  | 'partial-differential-equations'
  | 'representation-theory'
  | 'set-theory'
  | 'statistics'
  | 'stochastic-processes'
  // Applied subfields
  | 'applied-cs'
  | 'applied-engineering'
  | 'applied-finance'
  | 'applied-music'
  | 'applied-physics';

/** 대분류 정보 */
export interface MathFieldInfo {
  id: MathField;
  name: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  icon: string;
  color: string;
  order: number;
}

/** 소분류 정보 */
export interface MathSubfield {
  id: string;
  parentField: MathField;
  name: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  order: number;
  icon?: string;
}

// ============================================
// 수학 개념 (핵심 타입)
// ============================================

/** 수학 개념 문서 */
export interface MathConcept {
  id: string;

  /** 이름 (다국어) */
  name: {
    ko: string;
    en: string;
  };

  /** 분류 */
  field: MathField;
  subfield: string;
  difficulty: DifficultyLevel;

  /** 내용 (언어별) - 문자열(정의만) 또는 ConceptContent 객체 */
  content: {
    ko: string | ConceptContent;
    en: string | ConceptContent;
  };

  /** LaTeX 표현 (선택) */
  latex?: string;

  /** 연관 관계 */
  relations: ConceptRelations;

  /** 메타데이터 */
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

/** 개념 내용 상세 */
export interface ConceptContent {
  /** 정의 (한 문장 쉬운 설명) */
  definition: string;

  /** 공식들 (문자열 또는 Formula 객체) */
  formulas?: (string | Formula)[];

  /** 예제들 (문자열 또는 Example 객체) */
  examples: (string | Example)[];

  /** 시각화 */
  visualizations?: Visualization[];

  /** 역사 */
  history?: {
    discoveredBy?: string;
    year?: string;
    background?: string;
  };

  /** 응용 분야 (문자열 또는 Application 객체) */
  applications?: (string | Application)[];
}

/** 수학 공식 */
export interface Formula {
  /** LaTeX 문법 */
  latex: string;
  /** 공식 설명 */
  description: string;
  /** 변수 설명 */
  variables?: Variable[];
}

/** 변수 설명 */
export interface Variable {
  symbol: string;
  meaning: string;
}

/** 예제 */
export interface Example {
  /** 문제 */
  problem: string;
  /** 풀이 */
  solution: string;
  /** 수식 (선택) */
  latex?: string;
  /** 예제별 난이도 */
  difficulty?: DifficultyLevel;
}

/** Chart data point for visualizations */
export interface ChartDataPoint {
  x: number;
  y: number;
  label?: string;
}

/** Chart dataset configuration */
export interface ChartDataset {
  label: string;
  data: ChartDataPoint[] | number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
}

/** Chart configuration data (compatible with Chart.js) */
export interface ChartData {
  labels?: string[];
  datasets: ChartDataset[];
}

/** 시각화 */
export interface Visualization {
  type: 'graph' | 'diagram' | 'animation' | 'interactive';
  description: string;
  /** Chart.js compatible data */
  data?: ChartData;
  /** 외부 도구 링크 */
  externalUrl?: string;
}

/** 응용 분야 */
export interface Application {
  field: string;
  description: string;
  /** 응용수학 섹션 링크 */
  conceptLink?: string;
}

/** 연관 관계 */
export interface ConceptRelations {
  /** → 선행: 먼저 봐야 할 문서 IDs */
  prerequisites: string[];
  /** ← 후행: 다음에 볼 문서 IDs */
  nextTopics: string[];
  /** ↔ 관련: 함께 참고할 문서 IDs */
  related: string[];
  /** ⚡ 응용: 실제 쓰이는 분야 IDs (선택) */
  applications?: string[];
}

// ============================================
// 수학 상수
// ============================================

export interface MathConstant {
  id: string;
  /** 기호 (π, e, φ 등) */
  symbol: string;
  name: {
    ko: string;
    en: string;
  };
  /** 값 */
  value: string;
  /** LaTeX 표현 */
  latex: string;
  description: {
    ko: string;
    en: string;
  };
  relatedConcepts: string[];
}

// ============================================
// 수학 기호
// ============================================

export type SymbolCategory = 'operation' | 'set' | 'logic' | 'calculus' | 'greek' | 'relation';

export interface MathSymbol {
  id: string;
  symbol: string;
  category: SymbolCategory;
  name: {
    ko: string;
    en: string;
  };
  latex: string;
  usage: string;
  relatedConcepts: string[];
}

// ============================================
// 유명 정리
// ============================================

export interface FamousTheorem {
  id: string;
  name: {
    ko: string;
    en: string;
  };
  /** 정리 내용 */
  statement: {
    ko: string;
    en: string;
  };
  latex?: string;
  field: MathField;
  /** 증명자 */
  prover?: string;
  year?: string;
  /** 중요성 */
  significance: string;
  relatedConcepts: string[];
}

// ============================================
// 검색 결과
// ============================================

export interface SearchResult {
  concept: MathConcept;
  score: number;
  matchedIn: ('name' | 'definition' | 'formula' | 'tags')[];
}

// ============================================
// 네비게이션
// ============================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}
