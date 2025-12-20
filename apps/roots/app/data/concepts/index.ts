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

/** ID로 개념 찾기 */
export function getConceptById(id: string): MathConcept | undefined {
  return allConcepts.find((c) => c.id === id);
}

/** 분야로 개념 필터링 */
export function getConceptsByField(field: string): MathConcept[] {
  return allConcepts.filter((c) => c.field === field);
}

/** 소분야로 개념 필터링 */
export function getConceptsBySubfield(subfield: string): MathConcept[] {
  return allConcepts.filter((c) => c.subfield === subfield);
}

/** 태그로 개념 검색 */
export function getConceptsByTag(tag: string): MathConcept[] {
  return allConcepts.filter((c) => c.tags.includes(tag));
}

/** 난이도로 개념 필터링 */
export function getConceptsByDifficulty(level: number): MathConcept[] {
  return allConcepts.filter((c) => c.difficulty === level);
}

/** 개념 맵 (ID -> 개념) */
export const conceptsMap = new Map<string, MathConcept>(allConcepts.map((c) => [c.id, c]));
