import { renderToString } from 'react-dom/server';
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
 * @see react-router.config.ts for SSG route configuration
 */
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  // Manual locale extraction for SSG because Paraglide's runtime strategy 
  // excludes 'url' in this project's configuration
  const url = new URL(request.url);
  const locale = url.pathname.startsWith('/ko/') || url.pathname === '/ko' ? 'ko' : 'en';

  const html = storage.run({ locale }, () =>
    renderToString(<ServerRouter context={routerContext} url={request.url} />)
  );

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${html}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
