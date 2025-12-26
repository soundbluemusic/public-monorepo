import { stripLocaleFromPath } from '@soundblue/shared';
import {
  DarkModeToggle,
  LanguageToggle,
  SearchDropdown,
  type SearchResult,
  cn,
  useSearchWorker,
} from '@soundblue/shared-react';
import { Menu, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
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
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Real-time search with Fuse.js
  const { query, setQuery, results, isLoading } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: 8,
  });

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      const item = result.item;
      // Navigate based on type: library or api
      if (item.type === 'library') {
        navigate(`/${locale === 'ko' ? 'ko/' : ''}libraries#${item.id}`);
      } else if (item.type === 'api') {
        navigate(`/${locale === 'ko' ? 'ko/' : ''}web-api#${item.id}`);
      }
    },
    [navigate, locale],
  );

  // Custom render for Permissive results (show type badge)
  const renderPermissiveResult = useCallback(
    (result: SearchResult, _isSelected: boolean) => {
      const name = result.item.name;
      const itemType = result.item.type;
      return (
        <div className="flex items-center justify-between gap-2">
          <span className="text-[var(--text-primary)]">{locale === 'ko' ? name.ko : name.en}</span>
          <span
            className={cn(
              'px-2 py-0.5 rounded text-xs font-medium',
              itemType === 'library'
                ? 'bg-purple-500/10 text-purple-500'
                : 'bg-blue-500/10 text-blue-500',
            )}
          >
            {itemType === 'library' ? 'Library' : 'API'}
          </span>
        </div>
      );
    },
    [locale],
  );

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
        'fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between gap-4 px-4 bg-[var(--bg-primary)]/80 backdrop-blur-sm border-b border-[var(--border-primary)] transition-shadow',
        scrolled && 'shadow-sm',
      )}
    >
      {/* Left: Menu button (mobile) + Logo */}
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
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
          className="flex items-center gap-2 text-[var(--text-primary)] font-semibold no-underline"
        >
          <Sparkles size={20} aria-hidden="true" className="text-[var(--accent-primary)]" />
          <span>Permissive</span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md">
        <SearchDropdown
          query={query}
          onQueryChange={setQuery}
          results={results}
          isLoading={isLoading}
          onSelect={handleSelectResult}
          locale={locale}
          renderResult={renderPermissiveResult}
        />
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1">
        <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
        <DarkModeToggle />
      </div>
    </header>
  );
}
