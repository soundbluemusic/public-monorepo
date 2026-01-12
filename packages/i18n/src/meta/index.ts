/**
 * @soundblue/i18n - Meta
 *
 * React Router v7 meta 함수 팩토리
 * canonical URL과 hreflang 태그를 자동으로 생성합니다.
 *
 * @deprecated 이 모듈은 @soundblue/seo/meta에서 re-export됩니다.
 * 새 코드에서는 @soundblue/seo/meta를 직접 import하세요.
 * 하위 호환성을 위해 유지됩니다.
 */

export {
  dynamicMetaFactory,
  type LocalizedMeta,
  type MetaData,
  metaFactory,
} from '@soundblue/seo/meta';
