import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { SearchDialog } from './SearchDialog';

interface HeaderProps {
  locale: 'en' | 'ko' | 'ja';
}

export function Header({ locale }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const localePath = locale === 'en' ? '/' : `/${locale}`;

  const labels = {
    en: { search: 'Search...', github: 'GitHub', theme: 'Toggle theme' },
    ko: { search: '검색...', github: 'GitHub', theme: '테마 전환' },
    ja: { search: '検索...', github: 'GitHub', theme: 'テーマ切替' },
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[var(--header-height)] bg-(--bg-primary) border-b border-(--border-primary) z-40">
        <div className="h-full flex items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden p-2 hover:bg-(--bg-secondary) rounded"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link to={localePath} className="flex items-center gap-2 font-semibold text-lg">
              <svg
                className="w-8 h-8 text-(--accent)"
                viewBox="0 0 32 32"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="14" />
              </svg>
              <span className="hidden sm:inline">SoundBlue Docs</span>
            </Link>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-(--bg-secondary) hover:bg-(--bg-tertiary) rounded-lg text-sm text-(--text-secondary) transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="hidden sm:inline">{labels[locale].search}</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 text-xs bg-(--bg-tertiary) rounded">
                ⌘K
              </kbd>
            </button>

            {/* Language selector */}
            <LanguageSelector currentLocale={locale} />

            {/* GitHub */}
            {/* biome-ignore lint/a11y/useAnchorContent: icon-only link with aria-label */}
            <a
              href="https://github.com/soundbluemusic/public-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-(--bg-secondary) rounded transition-colors"
              aria-label={labels[locale].github}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                />
              </svg>
            </a>

            {/* Theme toggle */}
            <ThemeToggle label={labels[locale].theme} />
          </div>
        </div>
      </header>

      {/* Search dialog */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} locale={locale} />

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden cursor-default"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        />
      )}
    </>
  );
}

function LanguageSelector({ currentLocale }: { currentLocale: 'en' | 'ko' | 'ja' }) {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', path: '/' },
    { code: 'ko', label: '한국어', path: '/ko' },
    { code: 'ja', label: '日本語', path: '/ja' },
  ] as const;

  const current = languages.find((l) => l.code === currentLocale) ?? languages[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1.5 hover:bg-(--bg-secondary) rounded transition-colors text-sm"
      >
        {current.label}
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="Close language menu"
          />
          <div className="absolute right-0 mt-1 py-1 bg-(--bg-elevated) border border-(--border-primary) rounded-lg shadow-lg z-20">
            {languages.map((lang) => (
              <Link
                key={lang.code}
                to={lang.path as '/'}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm hover:bg-(--bg-secondary) ${
                  lang.code === currentLocale ? 'text-(--accent)' : ''
                }`}
              >
                {lang.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ThemeToggle({ label }: { label: string }) {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 hover:bg-(--bg-secondary) rounded transition-colors"
      aria-label={label}
    >
      <svg
        className="w-5 h-5 dark:hidden"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
      <svg
        className="w-5 h-5 hidden dark:block"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </button>
  );
}
