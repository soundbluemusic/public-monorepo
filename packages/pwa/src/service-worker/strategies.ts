/**
 * @fileoverview Service Worker Cache Strategies
 * @environment build-only
 *
 * Defines cache strategies for PWA service workers.
 * These are configuration types - actual service worker uses Workbox.
 */

// ============================================================================
// Types
// ============================================================================

export type CacheStrategy =
  | 'CacheFirst'
  | 'NetworkFirst'
  | 'StaleWhileRevalidate'
  | 'NetworkOnly'
  | 'CacheOnly';

export interface RuntimeCaching {
  urlPattern: string | RegExp;
  handler: CacheStrategy;
  options?: {
    cacheName?: string;
    expiration?: {
      maxEntries?: number;
      maxAgeSeconds?: number;
    };
    networkTimeoutSeconds?: number;
    cacheableResponse?: {
      statuses?: number[];
    };
  };
}

export interface ServiceWorkerConfig {
  /** Files to precache (glob patterns) */
  globPatterns: string[];
  /** Directory containing build output */
  globDirectory: string;
  /** Filename for the generated service worker */
  swDest: string;
  /** Runtime caching rules */
  runtimeCaching?: RuntimeCaching[];
  /** Skip waiting on install */
  skipWaiting?: boolean;
  /** Claim clients immediately */
  clientsClaim?: boolean;
}

// ============================================================================
// Preset Strategies
// ============================================================================

/**
 * Cache strategy for static assets (fonts, images)
 * Uses CacheFirst - fast, rarely changes
 */
export const STATIC_ASSETS_STRATEGY: RuntimeCaching = {
  urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf|eot)$/,
  handler: 'CacheFirst',
  options: {
    cacheName: 'static-assets',
    expiration: {
      maxEntries: 100,
      maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
    },
    cacheableResponse: {
      statuses: [0, 200],
    },
  },
};

/**
 * Cache strategy for CSS and JS bundles
 * Uses StaleWhileRevalidate - fast, updates in background
 */
export const BUNDLE_STRATEGY: RuntimeCaching = {
  urlPattern: /\.(?:js|css)$/,
  handler: 'StaleWhileRevalidate',
  options: {
    cacheName: 'bundles',
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
    },
  },
};

/**
 * Cache strategy for HTML pages
 * Uses NetworkFirst - always try fresh, fallback to cache
 */
export const PAGE_STRATEGY: RuntimeCaching = {
  urlPattern: /^https:\/\/.*\.html$/,
  handler: 'NetworkFirst',
  options: {
    cacheName: 'pages',
    networkTimeoutSeconds: 3,
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
    },
  },
};

/**
 * Cache strategy for API calls
 * Uses NetworkFirst with short timeout
 */
export const API_STRATEGY: RuntimeCaching = {
  urlPattern: /\/api\//,
  handler: 'NetworkFirst',
  options: {
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
    expiration: {
      maxEntries: 100,
      maxAgeSeconds: 60 * 60, // 1 hour
    },
  },
};

/**
 * Cache strategy for data files (.data, .json)
 * Uses StaleWhileRevalidate - static data files
 */
export const DATA_STRATEGY: RuntimeCaching = {
  urlPattern: /\.(?:data|json)$/,
  handler: 'StaleWhileRevalidate',
  options: {
    cacheName: 'data-cache',
    expiration: {
      maxEntries: 200,
      maxAgeSeconds: 60 * 60 * 24, // 24 hours
    },
  },
};

// ============================================================================
// Config Generators
// ============================================================================

/**
 * Get default runtime caching rules for static apps
 */
export function getDefaultCachingRules(): RuntimeCaching[] {
  return [STATIC_ASSETS_STRATEGY, BUNDLE_STRATEGY, DATA_STRATEGY, PAGE_STRATEGY];
}

/**
 * @deprecated Use getDefaultCachingRules instead
 */
export const getSSGCachingRules = getDefaultCachingRules;

/**
 * Create service worker config for a static app
 */
export function createDefaultServiceWorkerConfig(
  globDirectory: string,
  swDest: string,
): ServiceWorkerConfig {
  return {
    globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,svg,gif,webp,ico,woff2,data,json}'],
    globDirectory,
    swDest,
    runtimeCaching: getDefaultCachingRules(),
    skipWaiting: true,
    clientsClaim: true,
  };
}

/**
 * @deprecated Use createDefaultServiceWorkerConfig instead
 */
export const createSSGServiceWorkerConfig = createDefaultServiceWorkerConfig;
