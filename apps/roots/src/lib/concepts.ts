/**
 * @fileoverview 개념 데이터 동적 로딩 유틸리티
 *
 * 빌드 시 생성된 JSON 파일에서 개념 데이터를 동적으로 로드합니다.
 * SSG 빌드 시점에는 파일 시스템에서, 클라이언트에서는 fetch를 사용합니다.
 */
import type { MathConcept } from '@/data/types';

// 개념 데이터 캐시
let conceptsData: MathConcept[] | null = null;
let conceptsMap: Map<string, MathConcept> | null = null;
let loadPromise: Promise<MathConcept[]> | null = null;

/**
 * SSR/SSG 시점에 파일 시스템에서 개념 데이터 로드
 */
async function loadConceptsFromFS(): Promise<MathConcept[]> {
  try {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const path = fileURLToPath(new URL('../../public/concepts.json', import.meta.url));
    const data = JSON.parse(readFileSync(path, 'utf-8')) as MathConcept[];
    conceptsData = data;
    conceptsMap = new Map(data.map((c) => [c.id, c]));
    return data;
  } catch {
    console.warn('Failed to load concepts.json from filesystem');
    return [];
  }
}

/**
 * 개념 데이터 로드 (SSR/SSG + 클라이언트 모두 지원)
 */
export async function loadConcepts(): Promise<MathConcept[]> {
  if (conceptsData) {
    return conceptsData;
  }

  if (loadPromise) {
    return loadPromise;
  }

  // SSR/SSG 시점: 파일 시스템에서 로드
  if (typeof window === 'undefined') {
    loadPromise = loadConceptsFromFS();
    return loadPromise;
  }

  // 클라이언트: fetch 사용
  loadPromise = fetch('/concepts.json')
    .then((res) => res.json())
    .then((data: MathConcept[]) => {
      conceptsData = data;
      conceptsMap = new Map(data.map((c) => [c.id, c]));
      return data;
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
