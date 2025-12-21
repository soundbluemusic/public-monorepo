import { DarkModeToggle, LanguageToggle } from '@soundblue/shared-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useI18n } from '../../i18n';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const { locale, setLocale, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-header h-header flex items-center justify-between px-4 pt-[env(safe-area-inset-top,0)] transition-all duration-200 ${
        scrolled
          ? 'backdrop-blur-md shadow-sm bg-[var(--bg-elevated)] border-b border-[var(--border-primary)]'
          : 'bg-[var(--bg-primary)] border-b border-transparent'
      }`}
    >
      {/* Left: Menu button (mobile) + Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg hover-bg text-[var(--text-secondary)]"
          aria-label={isSidebarOpen ? t('aria.closeMenu') : t('aria.openMenu')}
          aria-expanded={isSidebarOpen}
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isSidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-lg">✨</span>
          <span className="font-semibold transition-colors text-[var(--text-primary)]">
            Permissive
          </span>
        </Link>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1">
        <LanguageToggle locale={locale} onLocaleChange={setLocale} />
        <DarkModeToggle />
      </div>
    </header>
  );
}
