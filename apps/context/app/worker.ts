/**
 * Cloudflare Worker Entry
 *
 * API 라우트(sitemap, offline-db 등)를 인터셉트한 후 TanStack Start로 전달합니다.
 */

import tanstackHandler from '@tanstack/react-start/server-entry';
import { handleApiRoute } from './api-handlers';

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    // Build context with Cloudflare bindings
    const context = {
      cloudflare: { env },
    };

    // Check for API routes first (sitemap, offline-db)
    const apiResponse = await handleApiRoute(request, context);
    if (apiResponse) {
      return apiResponse;
    }

    // Pass to TanStack Start for page routes
    // @ts-expect-error - TanStack Start internal handler
    return tanstackHandler.fetch(request, env, ctx);
  },
};
