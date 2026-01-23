/**
 * @fileoverview 다의어(Homonym) 인덱스
 *
 * 이 파일은 scripts/generate-homonyms.ts에 의해 자동 생성됩니다.
 * 직접 수정하지 마세요.
 *
 * ## 다의어 통계
 * - 다의어 단어 수: 0개
 * - 총 엔트리 수: 0개
 *
 * @generated
 */

/**
 * 다의어 엔트리 정보
 */
export interface HomonymEntry {
  /** 엔트리 ID */
  id: string;
  /** 번역 (ko/en) */
  word: { ko: string; en: string };
  /** 카테고리 ID */
  categoryId: string;
}

/**
 * 다의어 인덱스
 * korean → 해당 korean을 가진 엔트리들
 *
 * @example
 * homonymIndex['배'] = [
 *   { id: 'bae-transport', word: { ko: '배', en: 'ship' }, categoryId: 'transportation' },
 *   { id: 'd-foo-bae', word: { ko: '배', en: 'pear' }, categoryId: 'food' },
 *   { id: 'd-bod-bae', word: { ko: '배', en: 'belly' }, categoryId: 'body' },
 * ]
 */
export const homonymIndex: Record<string, HomonymEntry[]> = {};

/**
 * 다의어 조회 함수
 *
 * @param korean - 한글 단어
 * @param excludeId - 제외할 엔트리 ID (현재 보고 있는 항목)
 * @returns 다의어 목록 (현재 항목 제외)
 */
export function getHomonyms(korean: string, excludeId?: string): HomonymEntry[] {
  const homonyms = homonymIndex[korean];
  if (!homonyms) return [];
  if (!excludeId) return homonyms;
  return homonyms.filter((h) => h.id !== excludeId);
}

/**
 * 다의어인지 확인
 *
 * @param korean - 한글 단어
 * @returns 다의어 여부
 */
export function isHomonym(korean: string): boolean {
  return korean in homonymIndex;
}

/**
 * 다의어 통계
 */
export const homonymStats = {
  /** 다의어 단어 수 */
  wordCount: 0,
  /** 총 엔트리 수 */
  entryCount: 0,
} as const;
