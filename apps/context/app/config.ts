/**
 * @fileoverview Context App 설정
 *
 * 앱 전역에서 사용되는 상수들을 중앙 관리합니다.
 * DRY 원칙: baseUrl 등 하드코딩 값을 한 곳에서 관리.
 */

export const APP_CONFIG = {
  /** 앱 기본 URL (SEO, JSON-LD, canonical 등에 사용) */
  baseUrl: 'https://context.soundbluemusic.com',
  /** 앱 이름 */
  name: 'Context',
  /** 앱 설명 */
  description: 'Korean Dictionary for Learners',
} as const;

export type AppConfig = typeof APP_CONFIG;
