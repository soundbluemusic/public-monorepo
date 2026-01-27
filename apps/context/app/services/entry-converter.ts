/**
 * Entry Converter - D1 Row를 LocaleEntry로 변환하는 공유 유틸리티
 *
 * d1.ts와 offline-db.ts에서 공통으로 사용합니다.
 *
 * @environment universal
 */

import type { D1EntryRow } from '@soundblue/platform/sqlite/types';
import type { Language, LocaleEntry, Translation } from '@/data/types';

/**
 * D1 row를 LocaleEntry로 변환
 *
 * @param row - D1 데이터베이스 row
 * @param locale - 언어 ('ko' | 'en')
 * @returns LocaleEntry 또는 null (변환 실패 시)
 */
export function rowToLocaleEntry(row: D1EntryRow, locale: Language): LocaleEntry | null {
  if (!row.translations) return null;

  try {
    const translations = JSON.parse(row.translations) as {
      ko?: Translation;
      en?: Translation;
    };

    const translation = translations[locale];
    if (!translation) return null;

    const tags = row.tags ? (JSON.parse(row.tags) as string[]) : [];

    return {
      id: row.id,
      korean: row.korean,
      romanization: row.romanization || '',
      partOfSpeech: (row.part_of_speech || 'noun') as LocaleEntry['partOfSpeech'],
      categoryId: row.category_id,
      tags,
      difficulty: (row.difficulty || 'beginner') as LocaleEntry['difficulty'],
      frequency: row.frequency as LocaleEntry['frequency'] | undefined,
      dialogue: translation.dialogue,
      translation: {
        word: translation.word,
        explanation: translation.explanation,
        examples: translation.examples,
        variations: translation.variations,
      },
    };
  } catch (error) {
    console.error(`Failed to parse entry ${row.id}:`, error);
    return null;
  }
}

// D1EntryRow 타입도 재export하여 d1.ts에서 사용할 수 있도록 함
export type { D1EntryRow };
