/// <reference types="@cloudflare/workers-types" />

interface Env {
  BUCKET: R2Bucket;
}

/**
 * Pages Functions: R2에서 대용량 파일 서빙
 *
 * ## R2에서 서빙하는 항목:
 * 1. /entry/* - 엔트리 HTML 페이지 (67,000+개)
 * 2. /data/* - JSON 데이터 파일 (32,000+개)
 *
 * ## Pages에서 서빙하는 항목:
 * - 정적 자산 (JS, CSS, 이미지 등)
 * - 핵심 페이지 (/, /about, /categories 등)
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // /data/* 요청은 R2에서 서빙
  if (path.startsWith('/data/')) {
    const r2Path = `public-monorepo/context${path}`;
    const object = await context.env.BUCKET.get(r2Path);

    if (object) {
      const headers = new Headers();
      // Content-Type 결정
      if (path.endsWith('.json')) {
        headers.set('Content-Type', 'application/json; charset=utf-8');
      } else if (path.endsWith('.bin')) {
        headers.set('Content-Type', 'application/octet-stream');
      } else {
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
      }

      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');

      return new Response(object.body, { headers });
    }

    // R2에 없으면 Pages 정적 에셋으로 폴백 (client builds)
    return context.next();
  }

  // /entry/* 요청은 R2에서 HTML 서빙
  if (path.startsWith('/entry/') || path.startsWith('/ko/entry/')) {
    const htmlPath = path.endsWith('/') ? `${path}index.html` : `${path}/index.html`;
    const r2Path = `public-monorepo/context${htmlPath}`;
    const object = await context.env.BUCKET.get(r2Path);

    if (object) {
      const headers = new Headers();
      headers.set('Content-Type', 'text/html; charset=utf-8');
      headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');

      // CORS: context.soundbluemusic.com 및 미리보기 URL(*.pages.dev) 허용
      const origin = context.request.headers.get('Origin');
      const allowedOrigins = ['https://context.soundbluemusic.com'];
      if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.pages.dev'))) {
        headers.set('Access-Control-Allow-Origin', origin);
      }

      return new Response(object.body, { headers });
    }

    // R2에 없으면 SPA fallback으로 (clientLoader가 처리)
    return context.next();
  }

  // 나머지는 Pages에서 처리
  return context.next();
};
