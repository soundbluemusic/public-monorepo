/**
 * @fileoverview 모든 개념 데이터 통합
 */
import type { MathConcept } from '../types';
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
