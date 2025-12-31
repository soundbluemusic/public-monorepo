/**
 * @fileoverview 모든 개념 데이터 통합
 *
 * ## 데이터 구조
 *
 * - allConcepts: 전체 개념 배열 (MathConcept[])
 * - lightConcepts: 경량 버전 (LightConcept[]) - browse 페이지 최적화용
 * - conceptsSortedByName: 이름순 정렬 (빌드 시 1회 정렬)
 * - conceptsSortedByDifficulty: 난이도순 정렬
 *
 * @example
 * ```ts
 * import { lightConcepts, getConceptById } from '@/data/concepts';
 * ```
 */
import type { DifficultyLevel, MathConcept, MathField } from '../types';

// ============================================================================
// 경량 타입 (Browse 페이지 최적화용)
// ============================================================================

/**
 * 경량 개념 타입 (브라우즈용)
 *
 * MathConcept의 85% 이상 용량 절감을 위해 필수 필드만 포함.
 * - content, latex, relations 등 무거운 필드 제외
 * - 정의만 추출 (def)
 */
export interface LightConcept {
  id: string;
  name: { ko: string; en: string };
  field: MathField;
  subfield: string;
  difficulty: DifficultyLevel;
  /** 정의 (ConceptContent에서 definition만 추출) */
  def: { ko: string; en: string };
  tags: string[];
}

import { abstractAlgebraConcepts } from './abstractAlgebra';
import { algebraConcepts } from './algebra';
import { algebraicGeometryConcepts } from './algebraicGeometry';
import { algebraicTopologyConcepts } from './algebraicTopology';
import { analysisConcepts } from './analysis';
import { appliedConcepts } from './applied';
import { calculusVariationsConcepts } from './calculusVariations';
import { categoryTheoryConcepts } from './categoryTheory';
import { combinatoricsAdvancedConcepts } from './combinatoricsAdvanced';
import { complexAnalysisConcepts } from './complexAnalysis';
import { computerScienceConcepts } from './computerScience';
import { constantsConcepts } from './constants';
import { cryptographyConcepts } from './cryptography';
import { differentialGeometryConcepts } from './differentialGeometry';
import { discreteConcepts } from './discrete';
import { dynamicalSystemsAdvancedConcepts } from './dynamicalSystemsAdvanced';
import { dynamicsConcepts } from './dynamics';
import { engineeringConcepts } from './engineering';
import { financeConcepts } from './finance';
import { foundationsConcepts } from './foundations';
import { functionalAnalysisConcepts } from './functionalAnalysis';
import { gameTheoryConcepts } from './gameTheory';
import { geometryConcepts } from './geometry';
import { graphTheoryAdvancedConcepts } from './graphTheoryAdvanced';
import { harmonicAnalysisConcepts } from './harmonicAnalysis';
import { homologicalAlgebraConcepts } from './homologicalAlgebra';
import { informationTheoryConcepts } from './informationTheory';
import { lieTheoryConcepts } from './lieTheory';
import { linearAlgebraConcepts } from './linearAlgebra';
import { logicConcepts } from './logic';
import { logicAdvancedConcepts } from './logicAdvanced';
import { measureTheoryConcepts } from './measureTheory';
import { musicConcepts } from './music';
import { numberTheoryConcepts } from './numberTheory';
import { numericalConcepts } from './numerical';
import { numericalLinearAlgebraConcepts } from './numericalLinearAlgebra';
import { operationsResearchConcepts } from './operationsResearch';
import { optimizationConcepts } from './optimization';
import { pdeConcepts } from './pde';
import { physicsConcepts } from './physics';
import { probabilityConcepts } from './probability';
import { representationTheoryConcepts } from './representationTheory';
import { setTheoryConcepts } from './setTheory';
import { statisticsConcepts } from './statistics';
import { stochasticProcessesConcepts } from './stochasticProcesses';
import { symbolsConcepts } from './symbols';
import { tensorAnalysisConcepts } from './tensorAnalysis';
import { theoremsConcepts } from './theorems';
import { topologyConcepts } from './topology';
import { trigonometryConcepts } from './trigonometry';

/** 모든 개념 목록 */
export const allConcepts: MathConcept[] = [
  ...foundationsConcepts,
  ...algebraConcepts,
  ...geometryConcepts,
  ...analysisConcepts,
  ...trigonometryConcepts,
  ...linearAlgebraConcepts,
  ...probabilityConcepts,
  ...discreteConcepts,
  ...numberTheoryConcepts,
  ...topologyConcepts,
  ...logicConcepts,
  ...dynamicsConcepts,
  ...optimizationConcepts,
  ...numericalConcepts,
  ...appliedConcepts,
  ...constantsConcepts,
  ...symbolsConcepts,
  ...theoremsConcepts,
  ...abstractAlgebraConcepts,
  ...complexAnalysisConcepts,
  ...financeConcepts,
  ...musicConcepts,
  ...physicsConcepts,
  ...computerScienceConcepts,
  ...engineeringConcepts,
  ...cryptographyConcepts,
  ...gameTheoryConcepts,
  ...measureTheoryConcepts,
  ...categoryTheoryConcepts,
  ...differentialGeometryConcepts,
  ...statisticsConcepts,
  ...setTheoryConcepts,
  ...operationsResearchConcepts,
  ...algebraicGeometryConcepts,
  ...functionalAnalysisConcepts,
  ...combinatoricsAdvancedConcepts,
  ...representationTheoryConcepts,
  ...homologicalAlgebraConcepts,
  ...calculusVariationsConcepts,
  ...informationTheoryConcepts,
  ...stochasticProcessesConcepts,
  ...pdeConcepts,
  ...numericalLinearAlgebraConcepts,
  ...graphTheoryAdvancedConcepts,
  ...logicAdvancedConcepts,
  ...dynamicalSystemsAdvancedConcepts,
  ...tensorAnalysisConcepts,
  ...lieTheoryConcepts,
  ...algebraicTopologyConcepts,
  ...harmonicAnalysisConcepts,
];

// ============================================================================
// Pre-computed Maps for O(1) lookup (빌드 시 1회 계산)
// ============================================================================

/** ID → Concept 맵 (O(1) 조회용) */
export const conceptsById = new Map<string, MathConcept>(allConcepts.map((c) => [c.id, c]));

/** Field → Concept[] 맵 (O(1) 조회용) */
export const conceptsByField = new Map<string, MathConcept[]>();
for (const concept of allConcepts) {
  const list = conceptsByField.get(concept.field) || [];
  list.push(concept);
  conceptsByField.set(concept.field, list);
}

/** Subfield → Concept[] 맵 (O(1) 조회용) */
export const conceptsBySubfield = new Map<string, MathConcept[]>();
for (const concept of allConcepts) {
  if (concept.subfield) {
    const list = conceptsBySubfield.get(concept.subfield) || [];
    list.push(concept);
    conceptsBySubfield.set(concept.subfield, list);
  }
}

/** ID로 개념 찾기 (O(1)) */
export function getConceptById(id: string): MathConcept | undefined {
  return conceptsById.get(id);
}

/** 분야로 개념 필터링 (O(1)) */
export function getConceptsByField(field: string): MathConcept[] {
  return conceptsByField.get(field) || [];
}

/** 소분야로 개념 필터링 (O(1)) */
export function getConceptsBySubfield(subfield: string): MathConcept[] {
  return conceptsBySubfield.get(subfield) || [];
}

/** 태그로 개념 검색 (O(n) - 태그는 배열이라 Map 불가) */
export function getConceptsByTag(tag: string): MathConcept[] {
  return allConcepts.filter((c) => c.tags.includes(tag));
}

/** 난이도로 개념 필터링 (O(n) - 자주 사용되지 않음) */
export function getConceptsByDifficulty(level: number): MathConcept[] {
  return allConcepts.filter((c) => c.difficulty === level);
}

/** @deprecated Use conceptsById instead */
export const conceptsMap = conceptsById;

// ============================================================================
// 경량 버전 (LightConcept) - browse 페이지 최적화용
// ============================================================================

/**
 * Content에서 정의(definition)만 추출
 */
function extractDefinition(content: string | { definition: string }): string {
  if (typeof content === 'string') {
    return content;
  }
  return content.definition;
}

/**
 * MathConcept → LightConcept 변환
 */
function toLightConcept(c: MathConcept): LightConcept {
  return {
    id: c.id,
    name: c.name,
    field: c.field,
    subfield: c.subfield,
    difficulty: c.difficulty,
    def: {
      ko: extractDefinition(c.content.ko),
      en: extractDefinition(c.content.en),
    },
    tags: c.tags,
  };
}

/** 경량 개념 배열 (browse 페이지용) */
export const lightConcepts: LightConcept[] = allConcepts.map(toLightConcept);

// ============================================================================
// Pre-sorted arrays for O(1) access (빌드 시 1회 정렬)
// ============================================================================

/** 이름순 정렬 (가나다순) */
export const lightConceptsSortedByName: LightConcept[] = [...lightConcepts].sort((a, b) =>
  a.name.ko.localeCompare(b.name.ko, 'ko'),
);

/** 난이도순 정렬 (쉬운 것 → 어려운 것) */
export const lightConceptsSortedByDifficulty: LightConcept[] = [...lightConcepts].sort((a, b) => {
  if (a.difficulty !== b.difficulty) {
    return a.difficulty - b.difficulty;
  }
  return a.name.ko.localeCompare(b.name.ko, 'ko');
});

/** 분야순 정렬 */
export const lightConceptsSortedByField: LightConcept[] = [...lightConcepts].sort((a, b) => {
  if (a.field !== b.field) {
    return a.field.localeCompare(b.field);
  }
  return a.name.ko.localeCompare(b.name.ko, 'ko');
});

// ============================================================================
// 정렬 인덱스 (필터링 후 정렬 유지용)
// ============================================================================

/** ID → 이름순 인덱스 */
export const nameIndex = new Map<string, number>(
  lightConceptsSortedByName.map((c, i) => [c.id, i]),
);

/** ID → 난이도순 인덱스 */
export const difficultyIndex = new Map<string, number>(
  lightConceptsSortedByDifficulty.map((c, i) => [c.id, i]),
);

/** ID → 분야순 인덱스 */
export const fieldIndex = new Map<string, number>(
  lightConceptsSortedByField.map((c, i) => [c.id, i]),
);
