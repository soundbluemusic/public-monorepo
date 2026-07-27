export interface Library {
  name: string;
  description: string;
  descriptionKo: string;
  /**
   * 라이브러리가 속한 카테고리 (다중 분류 허용).
   * 첫 번째 항목이 primary category로 사용됩니다.
   * `categoryMeta` 의 `name.en` 값과 정확히 일치해야 합니다.
   */
  categories: string[];
  license: string;
  github: string;
  website?: string;
  npm?: string;
  stars: string;
  usedHere?: boolean;
  trending?: boolean;
  yearReleased?: number;
  tags?: string[];
  /** WASM 기반 여부 */
  wasmBased?: boolean;
  /** 용도 설명 (어디에 쓰이는지) */
  useCases?: { en: string; ko: string };
  /** 코드 예시 */
  codeExample?: string;
}

export interface CategoryMeta {
  id: string;
  name: { en: string; ko: string };
  description: { en: string; ko: string };
}
