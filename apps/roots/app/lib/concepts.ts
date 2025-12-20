/**
 * @fileoverview 개념 데이터 동적 로딩 유틸리티
 *
 * 빌드 시 생성된 JSON 파일에서 개념 데이터를 동적으로 로드합니다.
 * 클라이언트에서 fetch를 사용합니다.
 */
import type { MathConcept } from '@/data/types';

// 개념 데이터 캐시
let conceptsData: MathConcept[] | null = null;
let conceptsMap: Map<string, MathConcept> | null = null;
let loadPromise: Promise<MathConcept[]> | null = null;

/**
 * 개념 데이터 로드 (클라이언트에서 fetch 사용)
 */
export async function loadConcepts(): Promise<MathConcept[]> {
  if (conceptsData) {
    return conceptsData;
  }

  if (loadPromise) {
    return loadPromise;
  }

  // 클라이언트: fetch 사용
  loadPromise = fetch('/concepts.json')
    .then((res) => res.json())
    .then((data: MathConcept[]) => {
      conceptsData = data;
      conceptsMap = new Map(data.map((c) => [c.id, c]));
      return data;
    })
    .catch(() => {
      console.warn('Failed to load concepts.json');
      return [];
    });

  return loadPromise;
}

/**
 * 개념 데이터 프리로드
 */
export function preloadConcepts(): void {
  loadConcepts();
}

/**
 * 개념 로드 여부
 */
export function isConceptsLoaded(): boolean {
  return conceptsData !== null;
}

/**
 * ID로 개념 찾기 (비동기)
 */
export async function getConceptById(id: string): Promise<MathConcept | undefined> {
  const data = await loadConcepts();
  return data.find((c) => c.id === id);
}

/**
 * ID로 개념 찾기 (동기 - 이미 로드된 경우만)
 */
export function getConceptByIdSync(id: string): MathConcept | undefined {
  return conceptsMap?.get(id);
}

/**
 * 분야로 개념 필터링 (비동기)
 */
export async function getConceptsByField(field: string): Promise<MathConcept[]> {
  const data = await loadConcepts();
  return data.filter((c) => c.field === field);
}

/**
 * 모든 개념 가져오기 (비동기)
 */
export async function getAllConcepts(): Promise<MathConcept[]> {
  return loadConcepts();
}

/**
 * 모든 개념 가져오기 (동기 - 이미 로드된 경우만)
 */
export function getAllConceptsSync(): MathConcept[] {
  return conceptsData ?? [];
}

/**
 * 개념 맵 가져오기 (동기 - 이미 로드된 경우만)
 */
export function getConceptsMapSync(): Map<string, MathConcept> {
  return conceptsMap ?? new Map();
}
