/**
 * Pages Worker: R2에서 대용량 파일 서빙
 *
 * ## R2에서 서빙하는 항목:
 * 1. /data/* - JSON 데이터 파일 (압축된 엔트리 데이터)
 * 2. /entry/* - SSG HTML 파일
 *
 * ## Pages에서 서빙하는 항목:
 * - 정적 자산 (JS, CSS, 이미지 등)
 * - 핵심 페이지 (/, /about, /categories 등)
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // /data/* 요청은 R2에서 서빙
    if (path.startsWith('/data/')) {
      const r2Path = `public-monorepo/context${path}`;
      const object = await env.BUCKET.get(r2Path);

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

      // R2에 없으면 Pages 정적 에셋으로 폴백
      return env.ASSETS.fetch(request);
    }

    // /entry/* 요청: R2에서 SSG HTML 먼저 찾고, 없으면 SPA fallback
    if (path.startsWith('/entry/') || path.startsWith('/ko/entry/')) {
      const htmlPath = `public-monorepo/context${path}/index.html`;

      try {
        const ssgHtml = await env.BUCKET.get(htmlPath);

        if (ssgHtml) {
          // SSG HTML 발견 → 서빙
          const headers = new Headers();
          headers.set('Content-Type', 'text/html; charset=utf-8');
          headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
          headers.set('X-SSG-Source', 'r2');
          headers.set('X-R2-Path', htmlPath);

          return new Response(ssgHtml.body, { headers });
        }

        // R2에 SSG HTML 없음 → SPA fallback
        const fallbackResponse = await env.ASSETS.fetch(
          new Request(new URL('/__spa-fallback', url.origin))
        );

        const headers = new Headers(fallbackResponse.headers);
        headers.set('X-SSG-Source', 'spa-fallback');
        headers.set('X-R2-Path-Checked', htmlPath);

        return new Response(fallbackResponse.body, {
          status: fallbackResponse.status,
          headers,
        });
      } catch (error) {
        // R2 접근 에러 → SPA fallback
        const fallbackResponse = await env.ASSETS.fetch(
          new Request(new URL('/__spa-fallback', url.origin))
        );

        const headers = new Headers(fallbackResponse.headers);
        headers.set('X-SSG-Source', 'error');
        headers.set('X-R2-Error', String(error));

        return new Response(fallbackResponse.body, {
          status: fallbackResponse.status,
          headers,
        });
      }
    }

    // 사이트맵 파일: 캐시 비활성화 (검색엔진 크롤링용)
    if (path.startsWith('/sitemap') && (path.endsWith('.xml') || path.endsWith('.xsl'))) {
      const response = await env.ASSETS.fetch(request);
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }

    // 나머지는 Pages에서 처리
    return env.ASSETS.fetch(request);
  },
};
