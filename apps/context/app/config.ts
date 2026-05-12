/**
 * @fileoverview Context App 설정
 *
 * 앱 전역에서 사용되는 상수들을 중앙 관리합니다.
 * baseUrl은 `app/data/site.json`(Single Source of Truth)에서 읽어 옵니다.
 * 같은 JSON을 `scripts/inject-polyfill.mjs`와 `scripts/generate-sitemaps.ts`도
 * 읽기 때문에, 도메인 변경 시 단 한 곳(JSON)만 수정하면 모든 빌드 산출물이
 * 일치합니다.
 */

import siteConfig from './data/site.json';

export const APP_CONFIG = {
  /** 앱 기본 URL (SEO, JSON-LD, canonical 등에 사용) */
  baseUrl: siteConfig.baseUrl,
  /** 앱 이름 */
  name: 'Context',
  /** 앱 설명 */
  description: 'Korean Dictionary for Learners',
} as const;

export type AppConfig = typeof APP_CONFIG;
