/**
 * Cloudflare Workers server entry
 *
 * TanStack Start 공식 패턴 사용.
 * API 라우트는 routes/ 디렉토리의 라우트 파일에서 처리됩니다.
 */

import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';
import { getRouter } from './router';

// TanStack Start 핸들러 생성 및 export
// @ts-expect-error - TanStack Start internal types
export default createStartHandler({ createRouter: getRouter })(defaultStreamHandler);
