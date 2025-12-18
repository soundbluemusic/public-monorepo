/**
 * @fileoverview Permissive 앱 데이터 타입 정의
 */

/**
 * 라이브러리 상세 정보
 */
export interface LibraryDetail {
  name: string;
  description: string;
  descriptionKo: string;
  category: string;
  license: string;
  github: string;
  npm?: string;
  stars: string;
  features?: string[];
  featuresKo?: string[];
  usedHere?: boolean;
  alternatives?: string[];
}

/**
 * 라이브러리 데이터 맵
 */
export type LibrariesData = Record<string, LibraryDetail>;
