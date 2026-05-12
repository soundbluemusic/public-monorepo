/**
 * Context 앱 전용 상수
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

/** Browse 페이지 청크 크기 (JSON 파일 분할 단위) */
export const BROWSE_CHUNK_SIZE = 1000;

/** 페이지당 항목 수 */
export const PAGE_SIZE = 50;

/** 빌드 청크 기본 크기 */
export const BUILD_CHUNK_SIZE = 50000;
