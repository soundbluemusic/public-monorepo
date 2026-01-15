import { prerender } from 'react-dom/static';
import { renderToReadableStream } from 'react-dom/server';
import type { EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  overwriteServerAsyncLocalStorage,
} from '~/paraglide/runtime.js';

// Create a single AsyncLocalStorage instance for the server build
const storage = new AsyncLocalStorage<{ locale: string }>();
overwriteServerAsyncLocalStorage(storage);

/**
 * Server Entry Point (SSG + SSR)
 *
 * SSG Mode (BUILD_MODE !== 'ssr'):
 * - Runs at BUILD TIME to generate static HTML files
 * - Uses `prerender` from react-dom/static
 * - No runtime server - all pages are pre-rendered
 *
 * SSR Mode (BUILD_MODE === 'ssr'):
 * - Runs at RUNTIME on Cloudflare Workers
 * - Uses `renderToReadableStream` for streaming SSR
 * - D1 database queries happen on each request
 * - Edge caching via Cache-Control headers
 *
 * @see react-router.config.ts for mode configuration
 * @see https://react.dev/reference/react-dom/static/prerender
 * @see https://react.dev/reference/react-dom/server/renderToReadableStream
 */
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  // Manual locale extraction for Paraglide
  const url = new URL(request.url);
  const locale = url.pathname.startsWith('/ko/') || url.pathname === '/ko' ? 'ko' : 'en';

  // SSR Mode: Use streaming rendering
  if (process.env.BUILD_MODE === 'ssr') {
    const stream = await storage.run({ locale }, () =>
      renderToReadableStream(<ServerRouter context={routerContext} url={request.url} />, {
        onError(error: unknown) {
          console.error('SSR Error:', error);
          responseStatusCode = 500;
        },
      })
    );

    responseHeaders.set('Content-Type', 'text/html');

    // Edge caching for SSR responses (1 hour cache, 1 day stale-while-revalidate)
    if (responseStatusCode === 200) {
      responseHeaders.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    }

    return new Response(stream, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  }

  // SSG Mode: Use prerender for static generation
  const { prelude } = await storage.run({ locale }, () =>
    prerender(<ServerRouter context={routerContext} url={request.url} />)
  );

  // Convert ReadableStream to string
  const reader = prelude.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) chunks.push(value);
    done = readerDone;
  }

  const html = new TextDecoder().decode(
    chunks.reduce((acc, chunk) => {
      const combined = new Uint8Array(acc.length + chunk.length);
      combined.set(acc);
      combined.set(chunk, acc.length);
      return combined;
    }, new Uint8Array(0)),
  );

  responseHeaders.set('Content-Type', 'text/html');

  // prerender already includes <!DOCTYPE html>, don't add it again
  const finalHtml = html.startsWith('<!DOCTYPE') ? html : `<!DOCTYPE html>${html}`;

  return new Response(finalHtml, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
