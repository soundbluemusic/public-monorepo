/**
 * @soundblue/i18n
 *
 * 다국어 지원을 위한 i18n 패키지
 */

// Core
export {
  DEFAULT_LANGUAGE,
  isValidLanguage,
  type Language,
  languageFlags,
  languageNames,
  type Messages,
  SUPPORTED_LANGUAGES,
  type TranslationParams,
} from './core/config';

// Meta
export {
  dynamicMetaFactory,
  type LocalizedMeta,
  type MetaData,
  metaFactory,
} from './meta';

// React
export { getLanguageFromParams, I18nProvider, useI18n } from './react';

// Utils
export {
  buildLocalePath,
  extractStaticRoutes,
  generateI18nRoutes,
  generateLocalizedPaths,
  getLanguageFromPath,
  getLocaleFromPath,
  isKoreanPath,
  stripLocaleFromPath,
  stripLocalePrefix,
} from './utils/routing';
