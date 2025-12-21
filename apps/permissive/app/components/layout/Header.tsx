import { DarkModeToggle, LanguageToggle } from '@soundblue/shared-react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useI18n } from '../../i18n';

function stripLocale(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3);
  if (pathname === '/ko') return '/';
  return pathname;
}

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const { locale, t } = useI18n();
  const location = useLocation();
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
          className="md:hidden min-h-11 min-w-11 flex items-center justify-center -ml-2 rounded-lg hover-bg text-[var(--text-secondary)]"
          aria-label={isSidebarOpen ? t('aria.closeMenu') : t('aria.openMenu')}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
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
        <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
        <DarkModeToggle />
      </div>
    </header>
  );
}
