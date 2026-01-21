/**
 * @fileoverview Cloudflare Workers Entry Point for Permissive App
 * @environment server-only (Cloudflare Workers)
 *
 * React Router의 Cloudflare Workers 어댑터를 사용하여 SSR 요청을 처리합니다.
 * 웹 개발 자료(라이브러리, Web API)를 D1 데이터베이스에서 조회하여 제공합니다.
 */

import { createRequestHandler } from '@react-router/cloudflare';
// @ts-expect-error - virtual module from build (React Router generates this at build time)
import * as serverBuild from './build/server';

/**
 * Cloudflare Workers 환경 변수 타입 정의
 *
 * wrangler.toml의 바인딩과 일치해야 합니다.
 *
 * @see {@link wrangler.toml} 바인딩 설정
 */
interface Env {
  /** 학문/참고자료 D1 데이터베이스 (knowledge) - 라이브러리, Web API */
  KNOWLEDGE_DB: D1Database;
  /** 사용자 데이터용 프라이빗 D1 데이터베이스 */
  PRIVATE_DB: D1Database;
}

const requestHandler = createRequestHandler({
  build: serverBuild,
  mode: 'production',
});

export default {
  /**
   * Workers fetch 이벤트 핸들러
   *
   * @param request - 들어오는 HTTP 요청
   * @param env - Cloudflare 환경 바인딩 (D1 등)
   * @param ctx - 실행 컨텍스트 (waitUntil, passThroughOnException)
   * @returns HTTP 응답
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return requestHandler({
      request,
      env,
      waitUntil: ctx.waitUntil.bind(ctx),
      passThroughOnException: ctx.passThroughOnException.bind(ctx),
    });
  },
} satisfies ExportedHandler<Env>;
