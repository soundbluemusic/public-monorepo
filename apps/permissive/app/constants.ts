/**
 * Permissive 앱 전용 상수
 *
 * 앱 전반에서 사용되는 하드코딩 값들을 중앙화합니다.
 *
 * SITE_URL은 단일 출처(`app/data/site.json`)를 거쳐 `APP_CONFIG.baseUrl`로
 * 노출되며, 본 모듈은 호환성을 위한 재export입니다. 신규 코드는
 * `APP_CONFIG.baseUrl`을 직접 사용하세요.
 */

import { APP_CONFIG } from './config';

/** 프로덕션 사이트 URL */
export const SITE_URL = APP_CONFIG.baseUrl;

/**
 * 필터 기준 년도
 * - NEW_LIBRARY_YEAR: 2023년 이후 릴리스된 라이브러리를 "신규"로 표시
 * - NEW_API_YEAR: 2020년 이후 안정화된 Web API를 "신규"로 표시
 */
export const NEW_LIBRARY_YEAR = 2023;
export const NEW_API_YEAR = 2020;

/** 높은 브라우저 지원률 기준 (%) */
export const HIGH_SUPPORT_THRESHOLD = 95;
