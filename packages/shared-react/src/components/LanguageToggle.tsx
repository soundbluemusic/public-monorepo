import type { Language } from '../utils/i18n';

export interface LanguageToggleProps {
  locale: Language;
  onLocaleChange: (lang: Language) => void;
}

/**
 * Simple language toggle button that switches between EN and KR
 */
export function LanguageToggle({ locale, onLocaleChange }: LanguageToggleProps) {
  const handleClick = () => {
    onLocaleChange(locale === 'en' ? 'ko' : 'en');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-2 py-1.5 text-sm rounded-lg transition-colors cursor-pointer text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
      aria-label={`Switch to ${locale === 'en' ? 'Korean' : 'English'}`}
      title={locale === 'en' ? '한국어로 전환' : 'Switch to English'}
    >
      {locale === 'en' ? 'EN' : 'KR'}
    </button>
  );
}
