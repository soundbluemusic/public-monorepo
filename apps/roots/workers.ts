import { createRequestHandler } from '@react-router/cloudflare';
// @ts-expect-error - virtual module from build
import * as serverBuild from './build/server';

const requestHandler = createRequestHandler({
  build: serverBuild,
  mode: 'production',
});

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext) {
    return requestHandler({
      request,
      env,
      waitUntil: ctx.waitUntil.bind(ctx),
      passThroughOnException: ctx.passThroughOnException.bind(ctx),
    });
  },
} satisfies ExportedHandler;
