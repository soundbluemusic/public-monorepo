/**
 * Cloudflare Workers server entry with URL polyfill
 */

// Must be synchronous and run before any TanStack imports
const OriginalURL = globalThis.URL;

// Wrap URL to handle undefined arguments during TanStack Router initialization
class SafeURL extends OriginalURL {
  constructor(
    url?: string | URL | { protocol?: string; host?: string; pathname?: string; search?: string },
    base?: string | URL,
  ) {
    if (url === undefined || url === null) {
      super('https://context.soundbluemusic.com/');
    } else if (typeof url === 'object' && !(url instanceof URL) && !('href' in url)) {
      // Handle TanStack Router's internal URL-like objects
      const {
        protocol = 'https:',
        host = 'context.soundbluemusic.com',
        pathname = '/',
        search = '',
      } = url;
      super(`${protocol}//${host}${pathname}${search}`);
    } else {
      super(url as string | URL, base);
    }
  }
}

globalThis.URL = SafeURL as typeof URL;

// Provide location if missing
if (!globalThis.location) {
  // @ts-expect-error - Mock location for SSR
  globalThis.location = {
    protocol: 'https:',
    host: 'context.soundbluemusic.com',
    hostname: 'context.soundbluemusic.com',
    port: '',
    pathname: '/',
    search: '',
    hash: '',
    href: 'https://context.soundbluemusic.com/',
    origin: 'https://context.soundbluemusic.com',
  };
}

import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';
import { createRouter } from './router';

// @ts-expect-error - TanStack Start types are not fully compatible
export default createStartHandler({ createRouter })(defaultStreamHandler);
