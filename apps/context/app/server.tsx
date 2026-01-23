/**
 * Cloudflare Workers server entry
 *
 * API 라우트(sitemap, offline-db 등)는 TanStack Start 전에 인터셉트하여 처리합니다.
 * TanStack Start는 loader에서 Response 직접 반환을 지원하지 않기 때문입니다.
 */

import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';
import { handleApiRoute } from './api-handlers';
import { getRouter } from './router';

// TanStack Start 핸들러 생성
// @ts-expect-error - TanStack Start internal types
const tanstackHandler = createStartHandler({ createRouter: getRouter })(defaultStreamHandler);

// Cloudflare Workers fetch handler
export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    // Build context with Cloudflare bindings
    const context = {
      cloudflare: { env },
    };

    // Check for API routes first
    const apiResponse = await handleApiRoute(request, context);
    if (apiResponse) {
      return apiResponse;
    }

    // Pass to TanStack Start for page routes
    // @ts-expect-error - TanStack Start internal types
    return tanstackHandler(request, { env, ctx, context });
  },
};
