/**
 * @fileoverview PWA Package - Progressive Web App utilities
 *
 * This package contains:
 * - Build-only: Manifest generation, service worker config
 * - Client-only: React hooks and components for offline handling
 *
 * Import paths:
 * - `@soundblue/pwa/manifest` - Manifest generator (build-only)
 * - `@soundblue/pwa/service-worker` - SW strategies (build-only)
 * - `@soundblue/pwa/react` - React components/hooks (client-only)
 */

// Build-only exports
export {
  generateManifest,
  generateManifestContent,
  generateStandardIcons,
  type ManifestConfig,
  type ManifestIcon,
  type ManifestShortcut,
} from './manifest';
// Client-only exports
export { OfflineIndicator, type UseOnlineStatusReturn, useOnlineStatus } from './react';
export {
  API_STRATEGY,
  BUNDLE_STRATEGY,
  type CacheStrategy,
  createSSGServiceWorkerConfig,
  DATA_STRATEGY,
  getSSGCachingRules,
  PAGE_STRATEGY,
  type RuntimeCaching,
  type ServiceWorkerConfig,
  STATIC_ASSETS_STRATEGY,
} from './service-worker';
