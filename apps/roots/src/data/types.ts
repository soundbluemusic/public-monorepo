/**
 * @fileoverview 수학 문서 앱 타입 정의
 *
 * 수학 개념, 분야, 공식, 예제 등의 타입을 정의합니다.
 */

// ============================================
// 기본 타입
// ============================================

/** 지원 언어 */
export type Language = "ko" | "en";

/** 난이도 (1-5) */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

/** 난이도 레이블 */
export const difficultyLabels: Record<DifficultyLevel, Record<Language, string>> = {
  1: { ko: "초등", en: "Elementary" },
  2: { ko: "중등", en: "Middle School" },
  3: { ko: "고등", en: "High School" },
  4: { ko: "대학", en: "Undergraduate" },
  5: { ko: "대학원+", en: "Graduate+" },
};

// ============================================
// 수학 분야 (18개 대분류)
// ============================================

export type MathField =
  | "foundations"
  | "algebra"
  | "geometry"
  | "trigonometry"
  | "analysis"
  | "linear-algebra"
  | "probability"
  | "discrete"
  | "number-theory"
  | "topology"
  | "logic"
  | "dynamics"
  | "optimization"
  | "numerical"
  | "applied"
  | "constants"
  | "symbols"
  | "theorems";

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

  /** 내용 (언어별) */
  content: {
    ko: ConceptContent;
    en: ConceptContent;
  };

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

  /** 공식들 */
  formulas?: Formula[];

  /** 예제들 (최소 2개) */
  examples: Example[];

  /** 시각화 */
  visualizations?: Visualization[];

  /** 역사 */
  history?: {
    discoveredBy?: string;
    year?: string;
    background?: string;
  };

  /** 응용 분야 */
  applications?: Application[];
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

/** 시각화 */
export interface Visualization {
  type: "graph" | "diagram" | "animation" | "interactive";
  description: string;
  /** Chart.js 등의 데이터 */
  data?: unknown;
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
  /** ⚡ 응용: 실제 쓰이는 분야 IDs */
  applications: string[];
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

export type SymbolCategory = "operation" | "set" | "logic" | "calculus" | "greek" | "relation";

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
  matchedIn: ("name" | "definition" | "formula" | "tags")[];
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
