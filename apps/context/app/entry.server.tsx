import { prerender } from 'react-dom/static';
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
 * SSG Entry Point
 *
 * This file is required for React Router v7 SSG builds.
 * It only runs at BUILD TIME to generate static HTML files.
 * There is NO runtime server - all pages are pre-rendered as static files.
 *
 * Uses `prerender` from react-dom/static instead of renderToString because:
 * - prerender properly supports Suspense boundaries
 * - It waits for all data to load before resolving
 * - This is required for React Router v7's turbo-stream data transfer
 *
 * @see react-router.config.ts for SSG route configuration
 * @see https://react.dev/reference/react-dom/static/prerender
 */
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  // Manual locale extraction for SSG because Paraglide's runtime strategy 
  // excludes 'url' in this project's configuration
  const url = new URL(request.url);
  const locale = url.pathname.startsWith('/ko/') || url.pathname === '/ko' ? 'ko' : 'en';

  // Run the render within the Paraglide context
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
