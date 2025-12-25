/**
 * @fileoverview Entry 생성 헬퍼 함수
 *
 * 카테고리별 엔트리 정의를 간결하게 만들어주는 유틸리티입니다.
 * - id는 객체 키에서 자동 생성
 * - categoryId는 createCategory 호출 시 자동 설정
 *
 * @example
 * ```ts
 * // entries/greetings.ts
 * export default createCategory('greetings', {
 *   annyeong: {
 *     korean: '안녕',
 *     romanization: 'annyeong',
 *     partOfSpeech: 'interjection',
 *     difficulty: 'beginner',
 *     tags: ['casual'],
 *     translations: { ... }
 *   }
 * });
 * ```
 */
import type {
  DifficultyLevel,
  FrequencyLevel,
  MeaningEntry,
  PartOfSpeech,
  Translation,
} from '../types';

/**
 * createCategory에서 사용하는 엔트리 입력 타입
 * id와 categoryId는 자동으로 생성되므로 제외
 */
export type EntryInput = {
  korean: string;
  romanization: string;
  pronunciation?: {
    korean: string;
    ipa: string;
  };
  partOfSpeech: PartOfSpeech;
  difficulty: DifficultyLevel;
  frequency?: FrequencyLevel;
  tags: string[];
  translations: {
    ko: Translation;
    en: Translation;
  };
  createdAt?: string;
  updatedAt?: string;
};

/**
 * 카테고리별 엔트리 맵 타입
 */
export type EntryMap = Record<string, EntryInput>;

/**
 * 카테고리 엔트리 생성 함수
 *
 * @param categoryId - 카테고리 ID (예: 'greetings', 'emotions')
 * @param entries - 엔트리 맵 (키가 id로 사용됨)
 * @returns MeaningEntry 배열
 *
 * @example
 * ```ts
 * const greetings = createCategory('greetings', {
 *   annyeong: { korean: '안녕', ... },
 *   annyeonghaseyo: { korean: '안녕하세요', ... },
 * });
 * // 결과: [{ id: 'annyeong', categoryId: 'greetings', ... }, ...]
 * ```
 */
export function createCategory(categoryId: string, entries: EntryMap): MeaningEntry[] {
  return Object.entries(entries).map(([id, entry]) => ({
    id,
    categoryId,
    ...entry,
  }));
}
