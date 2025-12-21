import type { Language } from '../utils/i18n';

export interface LanguageToggleProps {
  locale: Language;
  /** Current path without locale prefix for building the toggle href */
  currentPath?: string;
  /** @deprecated Use currentPath instead - kept for backward compatibility */
  onLocaleChange?: (lang: Language) => void;
}

/**
 * Language toggle using anchor tag for SSG compatibility
 * Works without JavaScript hydration
 */
export function LanguageToggle({ locale, currentPath = '/' }: LanguageToggleProps) {
  const targetLocale = locale === 'en' ? 'ko' : 'en';
  const href = targetLocale === 'en' ? currentPath : `/ko${currentPath === '/' ? '' : currentPath}`;

  return (
    <a
      href={href}
      className="px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] active:scale-95 inline-flex items-center justify-center min-h-11"
      aria-label={`Switch to ${locale === 'en' ? 'Korean' : 'English'}`}
      title={locale === 'en' ? '한국어로 전환' : 'Switch to English'}
    >
      {locale === 'en' ? 'EN' : 'KR'}
    </a>
  );
}
