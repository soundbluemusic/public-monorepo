import { stripLocaleFromPath } from '@soundblue/i18n';
import { DarkModeToggle, LanguageToggle } from '@soundblue/shared-react';
import { cn } from '@soundblue/ui/utils';
import { Menu, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useI18n } from '../../i18n';

// Use shared utility for locale stripping
const stripLocale = stripLocaleFromPath;

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
      className={cn(
        'fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between gap-4 px-4 bg-(--bg-primary)/80 backdrop-blur-sm border-b border-(--border-primary) transition-shadow',
        scrolled && 'shadow-sm',
      )}
    >
      {/* Left: Menu button (mobile) + Logo */}
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer"
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
        <Link
          to="/"
          className="flex items-center gap-2 text-(--text-primary) font-semibold no-underline"
        >
          <Sparkles size={20} aria-hidden="true" className="text-(--accent-primary)" />
          <span>Permissive</span>
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
