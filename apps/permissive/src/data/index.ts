import librariesJson from './libraries.json';
/**
 * @fileoverview 데이터 로더
 *
 * ## 데이터 추가 방법
 *
 * 새 라이브러리 추가:
 * `src/data/libraries.json`에 추가:
 * ```json
 * "library-id": {
 *   "name": "Library Name",
 *   "description": "English description",
 *   "descriptionKo": "한국어 설명",
 *   "category": "Frameworks",
 *   "license": "MIT",
 *   "github": "https://github.com/user/repo",
 *   "npm": "package-name",
 *   "stars": "10k",
 *   "features": ["Feature 1", "Feature 2"],
 *   "featuresKo": ["기능 1", "기능 2"],
 *   "alternatives": ["Alt1", "Alt2"]
 * }
 * ```
 */
import type { LibrariesData, LibraryDetail } from './types';

export const libraries: LibrariesData = librariesJson as LibrariesData;

/**
 * ID로 라이브러리 조회 (안전한 방식)
 */
export function getLibraryById(id: string): LibraryDetail | undefined {
  if (!id) return undefined;
  const key = id.toLowerCase();
  // Prototype pollution 방지
  if (!Object.prototype.hasOwnProperty.call(libraries, key)) {
    return undefined;
  }
  return libraries[key];
}

/**
 * 모든 라이브러리 ID 목록
 */
export function getAllLibraryIds(): string[] {
  return Object.keys(libraries);
}

/**
 * 카테고리별 라이브러리 그룹화
 */
export function getLibrariesByCategory(): Map<string, Array<{ id: string; lib: LibraryDetail }>> {
  const grouped = new Map<string, Array<{ id: string; lib: LibraryDetail }>>();

  for (const [id, lib] of Object.entries(libraries)) {
    const category = lib.category;
    const existing = grouped.get(category) ?? [];
    existing.push({ id, lib });
    grouped.set(category, existing);
  }

  return grouped;
}

/**
 * 이 사이트에서 사용 중인 라이브러리만 필터링
 */
export function getUsedHereLibraries(): Array<{ id: string; lib: LibraryDetail }> {
  return Object.entries(libraries)
    .filter(([, lib]) => lib.usedHere)
    .map(([id, lib]) => ({ id, lib }));
}

export type { LibraryDetail, LibrariesData } from './types';
