/**
 * @fileoverview 모든 개념 데이터 통합
 */
import type { MathConcept } from "../types";
import { geometryConcepts } from "./geometry";

/** 모든 개념 목록 */
export const allConcepts: MathConcept[] = [
  ...geometryConcepts,
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
