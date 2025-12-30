/**
 * @fileoverview Language Toggle Component
 * @environment universal
 */

export type Language = 'ko' | 'en';

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

  // Use visible text in aria-label to satisfy WCAG 2.5.3 Label in Name
  const displayText = locale === 'en' ? 'EN' : 'KR';
  const ariaLabel =
    locale === 'en' ? `${displayText} - Switch to Korean` : `${displayText} - Switch to English`;

  return (
    <a
      href={href}
      className="min-h-11 min-w-11 flex items-center justify-center rounded-lg text-sm font-medium text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors no-underline"
      aria-label={ariaLabel}
      title={locale === 'en' ? '한국어로 전환' : 'Switch to English'}
    >
      {displayText}
    </a>
  );
}
