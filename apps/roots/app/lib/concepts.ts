/**
 * @fileoverview 개념 데이터 동적 로딩 유틸리티
 *
 * 빌드 시 생성된 필드별 JSON 파일에서 개념 데이터를 동적으로 로드합니다.
 * 클라이언트에서 fetch를 사용하며, 필드별 로딩으로 성능을 최적화합니다.
 */
import type { MathConcept } from '@/data/types';

// 인덱스 데이터 캐시 (개념 ID → 필드 매핑)
interface ConceptsIndex {
  fields: string[];
  stats: Record<string, { count: number; sizeKB: string }>;
  totalConcepts: number;
  conceptIdToField: Record<string, string>;
  generatedAt: string;
}

let conceptsIndex: ConceptsIndex | null = null;
let indexLoadPromise: Promise<ConceptsIndex> | null = null;

// 필드별 개념 데이터 캐시
const fieldCache = new Map<string, MathConcept[]>();
const fieldLoadPromises = new Map<string, Promise<MathConcept[]>>();

// 전체 개념 캐시 (하위 호환성)
let conceptsData: MathConcept[] | null = null;
let conceptsMap: Map<string, MathConcept> | null = null;

/**
 * 인덱스 파일 로드 (개념 ID → 필드 매핑)
 */
async function loadIndex(): Promise<ConceptsIndex> {
  if (conceptsIndex) {
    return conceptsIndex;
  }

  if (indexLoadPromise) {
    return indexLoadPromise;
  }

  indexLoadPromise = Promise.race([
    fetch('/concepts/index.json').then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data: ConceptsIndex = await res.json();
      conceptsIndex = data;
      console.log(
        `✓ Loaded concepts index (${data.totalConcepts} concepts, ${data.fields.length} fields)`,
      );
      return data;
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout loading concepts/index.json')), 10000),
    ),
  ]).catch((err) => {
    console.error('Failed to load concepts/index.json:', err);
    indexLoadPromise = null;
    throw err;
  });

  return indexLoadPromise;
}

/**
 * 필드별 개념 데이터 로드
 */
export async function loadConceptsByField(field: string): Promise<MathConcept[]> {
  // 캐시 확인
  const cached = fieldCache.get(field);
  if (cached !== undefined) {
    return cached;
  }

  // 이미 로딩 중인지 확인
  const loadingPromise = fieldLoadPromises.get(field);
  if (loadingPromise !== undefined) {
    return loadingPromise;
  }

  // 필드 데이터 fetch
  const promise = Promise.race([
    fetch(`/concepts/${field}.json`).then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data: MathConcept[] = await res.json();
      fieldCache.set(field, data);
      console.log(`✓ Loaded ${data.length} concepts from ${field}.json`);
      return data;
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout loading concepts/${field}.json`)), 10000),
    ),
  ]).catch((err) => {
    console.error(`Failed to load concepts/${field}.json:`, err);
    fieldLoadPromises.delete(field);
    throw err;
  });

  fieldLoadPromises.set(field, promise);
  return promise;
}

/**
 * 전체 개념 데이터 로드 (하위 호환성 - 모든 필드 로드)
 * @deprecated 가능하면 loadConceptsByField 또는 getConceptById 사용
 */
export async function loadConcepts(): Promise<MathConcept[]> {
  if (conceptsData) {
    return conceptsData;
  }

  // 인덱스 로드
  const index = await loadIndex();

  // 모든 필드 로드
  const allFieldConcepts = await Promise.all(
    index.fields.map((field) => loadConceptsByField(field)),
  );

  // 평탄화
  conceptsData = allFieldConcepts.flat();
  conceptsMap = new Map(conceptsData.map((c) => [c.id, c]));

  console.log(`✓ Loaded all ${conceptsData.length} concepts from ${index.fields.length} fields`);
  return conceptsData;
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
 * ID로 개념 찾기 (비동기) - 필드별 로딩 최적화
 */
export async function getConceptById(id: string): Promise<MathConcept | undefined> {
  // 인덱스에서 필드 찾기
  const index = await loadIndex();
  const field = index.conceptIdToField[id];

  if (!field) {
    console.warn(`Concept ID "${id}" not found in index`);
    return undefined;
  }

  // 해당 필드만 로드
  const concepts = await loadConceptsByField(field);
  return concepts.find((c) => c.id === id);
}

/**
 * ID로 개념 찾기 (동기 - 이미 로드된 경우만)
 */
export function getConceptByIdSync(id: string): MathConcept | undefined {
  return conceptsMap?.get(id);
}

/**
 * 분야로 개념 필터링 (비동기) - 필드별 로딩 최적화
 */
export async function getConceptsByField(field: string): Promise<MathConcept[]> {
  // 해당 필드만 로드
  return loadConceptsByField(field);
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
