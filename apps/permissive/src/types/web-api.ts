/**
 * @fileoverview 웹 표준 API 타입 정의
 *
 * 브라우저 Web API 정보와 호환성 데이터를 정의합니다.
 *
 * @example
 * ```ts
 * import type { WebAPI, BrowserSupport, APIStatus } from '@/types/web-api';
 *
 * const fetchAPI: WebAPI = {
 *   id: 'fetch',
 *   name: 'Fetch API',
 *   description: 'Modern interface for fetching resources',
 *   category: 'network',
 *   mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
 *   status: 'stable',
 *   support: {
 *     chrome: { supported: true, version: '42' },
 *     firefox: { supported: true, version: '39' },
 *     safari: { supported: true, version: '10.1' },
 *     edge: { supported: true, version: '14' },
 *   },
 * };
 * ```
 */

/**
 * 웹 API 정보
 * @property id - 고유 식별자 (예: 'fetch', 'intersection-observer')
 * @property name - 표시용 API 이름
 * @property description - API 설명
 * @property category - 소속 카테고리 ID
 * @property mdnUrl - MDN 문서 URL (선택)
 * @property whatwgUrl - WHATWG 명세 URL (선택)
 * @property w3cUrl - W3C 명세 URL (선택)
 * @property canIUseUrl - Can I Use URL (선택)
 * @property support - 브라우저별 지원 현황
 * @property status - API 상태 (stable/experimental/deprecated)
 * @property related - 관련 API ID 목록 (선택)
 * @property usedInSite - 이 사이트에서 사용 중인지 여부 (선택)
 */
export interface WebAPI {
  id: string;
  name: string;
  description: string;
  category: string;
  mdnUrl?: string;
  whatwgUrl?: string;
  w3cUrl?: string;
  canIUseUrl?: string;
  support: BrowserSupport;
  status: APIStatus;
  related?: string[];
  usedInSite?: boolean;
}

/**
 * 브라우저별 지원 현황
 *
 * 주요 4대 브라우저(Chrome, Firefox, Safari, Edge)의 지원 정보입니다.
 */
export interface BrowserSupport {
  chrome: BrowserVersion;
  firefox: BrowserVersion;
  safari: BrowserVersion;
  edge: BrowserVersion;
}

/**
 * 개별 브라우저 버전 정보
 * @property supported - 지원 여부
 * @property version - 지원 시작 버전 (예: '42', '10.1')
 * @property partial - 부분 지원 여부 (일부 기능만 지원)
 */
export interface BrowserVersion {
  supported: boolean;
  version?: string;
  partial?: boolean;
}

/**
 * API 상태
 * - stable: 안정화됨 (프로덕션 사용 가능)
 * - experimental: 실험적 (변경 가능, 주의 필요)
 * - deprecated: 사용 중단 예정 (대안 API 권장)
 */
export type APIStatus = "stable" | "experimental" | "deprecated";

/**
 * Web API 카테고리
 * @property id - 고유 식별자 (예: 'network', 'storage', 'dom')
 * @property name - 표시용 카테고리명
 * @property icon - Lucide 아이콘 이름
 * @property description - 카테고리 설명
 * @property items - 소속 Web API 목록
 */
export interface WebAPICategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: WebAPI[];
}
