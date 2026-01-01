import { renderToString } from 'react-dom/server';
import type { EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';

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
  const html = renderToString(<ServerRouter context={routerContext} url={request.url} />);

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${html}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
