/**
 * @fileoverview Service Worker Strategy Exports
 * @environment build-only
 */
export {
  API_STRATEGY,
  BUNDLE_STRATEGY,
  type CacheStrategy,
  createDefaultServiceWorkerConfig,
  createSSGServiceWorkerConfig, // deprecated alias
  DATA_STRATEGY,
  getDefaultCachingRules,
  getSSGCachingRules, // deprecated alias
  PAGE_STRATEGY,
  type RuntimeCaching,
  type ServiceWorkerConfig,
  STATIC_ASSETS_STRATEGY,
} from './strategies';
