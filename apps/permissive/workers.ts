import { createRequestHandler } from '@react-router/cloudflare';
// @ts-expect-error - virtual module from build
import * as serverBuild from './build/server';

const requestHandler = createRequestHandler(serverBuild, 'production');

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler;
