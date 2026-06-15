/**
 * 대응 언어 라벨/순서 헬퍼 — 매핑 카드용.
 * UI 로케일(ko|en)과 별개로, 한국어 원어에 1:1 대응되는 외국어들을 다룬다.
 * @environment universal
 */
import type { TargetLanguage } from './types';

/** UI 로케일별 대응 언어 표시 라벨 */
export const TARGET_LANG_LABELS: Record<'en' | 'ko', Record<TargetLanguage, string>> = {
  en: { en: 'English', ja: 'Japanese', es: 'Spanish', pt: 'Portuguese' },
  ko: { en: '영어', ja: '일본어', es: '스페인어', pt: '포르투갈어' },
};

/** 매핑 카드에 표시할 대응 언어 순서 */
export const TARGET_LANG_ORDER: TargetLanguage[] = ['en', 'ja', 'es', 'pt'];

export interface MappingTarget {
  label: string;
  word: string;
}

/**
 * targetWords → 매핑 카드용 targets 배열로 변환.
 * 존재하는 언어만, TARGET_LANG_ORDER 순서로 정렬.
 */
export function buildTargets(
  targetWords: Partial<Record<TargetLanguage, string>> | undefined,
  uiLocale: 'en' | 'ko',
): MappingTarget[] {
  if (!targetWords) return [];
  const labels = TARGET_LANG_LABELS[uiLocale];
  return TARGET_LANG_ORDER.filter((lang) => targetWords[lang]).map((lang) => ({
    label: labels[lang],
    word: targetWords[lang] as string,
  }));
}
