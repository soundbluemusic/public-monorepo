/**
 * @fileoverview 언어 전환 토글 버튼 컴포넌트
 *
 * 한국어/영어 두 언어 간 토글 전환을 제공합니다.
 * 클릭 시 현재 언어의 반대 언어로 전환됩니다.
 *
 * @example
 * ```tsx
 * import { LanguageToggle } from '@soundblue/shared';
 * import { useI18n } from '@/i18n';
 *
 * function Header() {
 *   const { locale, setLocale } = useI18n();
 *   return <LanguageToggle locale={locale} setLocale={setLocale} />;
 * }
 * ```
 */
import type { Accessor } from 'solid-js';

type Language = 'ko' | 'en';

export interface LanguageToggleProps {
  locale: Accessor<Language>;
  setLocale: (lang: Language) => void;
}

/**
 * 언어 전환 토글 버튼
 *
 * @component
 * @param props.locale - 현재 언어 Accessor
 * @param props.setLocale - 언어 변경 함수
 */
export function LanguageToggle(props: LanguageToggleProps) {
  // 안전하게 locale 값 가져오기 (함수가 아닐 경우 대비)
  const getLocale = () => (typeof props.locale === 'function' ? props.locale() : 'en');

  const toggleLanguage = () => {
    props.setLocale(getLocale() === 'en' ? 'ko' : 'en');
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      class="px-2 py-1.5 text-sm cursor-pointer rounded-lg transition-colors"
      style={{ color: 'var(--text-secondary)' }}
      aria-label="Toggle language"
    >
      {getLocale() === 'en' ? '한국어' : 'EN'}
    </button>
  );
}
