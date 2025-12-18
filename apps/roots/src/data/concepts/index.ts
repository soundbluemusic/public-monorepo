/**
 * @fileoverview 모든 개념 데이터 통합
 */
import type { MathConcept } from "../types";
import { foundationsConcepts } from "./foundations";
import { algebraConcepts } from "./algebra";
import { geometryConcepts } from "./geometry";
import { analysisConcepts } from "./analysis";
import { trigonometryConcepts } from "./trigonometry";
import { linearAlgebraConcepts } from "./linearAlgebra";
import { probabilityConcepts } from "./probability";
import { discreteConcepts } from "./discrete";
import { numberTheoryConcepts } from "./numberTheory";
import { topologyConcepts } from "./topology";
import { logicConcepts } from "./logic";
import { dynamicsConcepts } from "./dynamics";
import { optimizationConcepts } from "./optimization";
import { numericalConcepts } from "./numerical";
import { appliedConcepts } from "./applied";
import { constantsConcepts } from "./constants";
import { symbolsConcepts } from "./symbols";
import { theoremsConcepts } from "./theorems";
import { abstractAlgebraConcepts } from "./abstractAlgebra";
import { complexAnalysisConcepts } from "./complexAnalysis";

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
export const conceptsMap = new Map<string, MathConcept>(
  allConcepts.map((c) => [c.id, c])
);
