/**
 * @fileoverview 자동 생성된 엔트리 메타데이터
 *
 * 이 파일은 scripts/load-entries.ts에 의해 자동 생성됩니다.
 * 직접 수정하지 마세요. 대신 src/data/entries/*.json 파일을 수정하세요.
 *
 * ## 번들 최적화 (v2)
 * - lightEntries 배열이 번들에서 제거됨 (2.2MB → 0)
 * - 데이터는 /public/data/browse/initial.json에서 동적 로드
 * - SSR loader에서 fs로 직접 읽어서 HTML에 주입
 *
 * @generated
 * @date 2024-01-01T00:00:00.000Z
 */

export const jsonEntriesCount = 16394;

/**
 * Browse 페이지용 경량 엔트리 타입
 */
export interface LightEntry {
  id: string;
  korean: string;
  romanization: string;
  categoryId: string;
  word: { ko: string; en: string };
}

/**
 * lightEntries는 더 이상 번들에 포함되지 않습니다.
 * SSR loader에서 JSON 파일을 읽어서 사용하세요.
 *
 * @example
 * // SSR loader에서
 * const { readFileSync } = await import('node:fs');
 * const data = JSON.parse(readFileSync('public/data/browse/initial.json', 'utf-8'));
 *
 * // 클라이언트에서
 * const response = await fetch('/data/browse/alphabetical/chunk-0.json');
 */
export const lightEntries: LightEntry[] = [];
