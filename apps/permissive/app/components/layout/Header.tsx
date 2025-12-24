import { stripLocaleFromPath } from '@soundblue/shared';
import {
  DarkModeToggle,
  LanguageToggle,
  SearchDropdown,
  type SearchResult,
  useSearchWorker,
} from '@soundblue/shared-react';
import { Menu, X } from 'lucide-react';
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
        <div className="flex items-center justify-between w-full gap-2">
          <span style={{ color: 'var(--text-primary)' }} className="font-medium truncate">
            {locale === 'ko' ? name.ko : name.en}
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded shrink-0"
            style={{
              backgroundColor:
                itemType === 'library' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              color: itemType === 'library' ? 'white' : 'var(--text-secondary)',
            }}
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
      className={`fixed top-0 left-0 right-0 z-header h-header flex items-center justify-between px-4 pt-[env(safe-area-inset-top,0)] transition-all duration-200 ${
        scrolled
          ? 'backdrop-blur-md shadow-sm bg-[var(--bg-elevated)] border-b border-[var(--border-primary)]'
          : 'bg-[var(--bg-primary)] border-b border-transparent'
      }`}
    >
      {/* Left: Menu button (mobile) + Logo */}
      <div className="flex items-center gap-3 shrink-0">
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

      {/* Center: Search */}
      <div className="hidden sm:block flex-1 max-w-md mx-4">
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
      <div className="flex items-center gap-1 shrink-0">
        <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
        <DarkModeToggle />
      </div>
    </header>
  );
}
