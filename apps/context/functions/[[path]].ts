/// <reference types="@cloudflare/workers-types" />

interface Env {
  BUCKET: R2Bucket;
  ASSETS: Fetcher;
}

/**
 * Pages Functions: R2에서 대용량 파일 서빙
 *
 * ## R2에서 서빙하는 항목:
 * 1. /data/* - JSON 데이터 파일 (압축된 엔트리 데이터)
 *
 * ## SPA Fallback으로 처리하는 항목:
 * 1. /entry/* - 엔트리 페이지 (clientLoader가 데이터 로드)
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

      headers.set('Cache-Control', 'public, max-age=31536000');
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');

      return new Response(object.body, { headers });
    }

    // R2에 없으면 Pages 정적 에셋으로 폴백 (client builds)
    return context.next();
  }

  // /entry/* 요청: R2에서 SSG HTML 먼저 찾고, 없으면 SPA fallback
  if (path.startsWith('/entry/') || path.startsWith('/ko/entry/')) {
    // R2에서 SSG HTML 조회 (BUILD_TARGET=r2 빌드 결과물)
    // 경로 예: /entry/hello → public-monorepo/context/entry/hello.html
    const htmlPath = `public-monorepo/context${path}.html`;
    const ssgHtml = await context.env.BUCKET.get(htmlPath);

    if (ssgHtml) {
      // SSG HTML 발견 → 완성차 서빙
      const headers = new Headers();
      headers.set('Content-Type', 'text/html; charset=utf-8');
      headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      headers.set('X-SSG-Source', 'r2'); // 디버깅용

      return new Response(ssgHtml.body, { headers });
    }

    // R2에 SSG HTML 없음 → SPA fallback (Pages 빌드만 있는 경우)
    const fallbackRequest = new Request(new URL('/__spa-fallback.html', url.origin));
    return context.env.ASSETS.fetch(fallbackRequest);
  }

  // 나머지는 Pages에서 처리
  return context.next();
};
