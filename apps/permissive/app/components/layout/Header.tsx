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
import styles from './Header.module.scss';

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
        <div className={styles.searchResultRow}>
          <span className={styles.searchResultName}>{locale === 'ko' ? name.ko : name.en}</span>
          <span
            className={`${styles.searchResultBadge} ${itemType === 'library' ? styles.searchResultBadgeLibrary : styles.searchResultBadgeApi}`}
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
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      {/* Left: Menu button (mobile) + Logo */}
      <div className={styles.leftSection}>
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className={styles.menuButton}
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
        <Link to="/" className={styles.logo}>
          <span className={styles.logoEmoji}>✨</span>
          <span className={styles.logoText}>Permissive</span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className={styles.centerSection}>
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
      <div className={styles.rightSection}>
        <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
        <DarkModeToggle />
      </div>
    </header>
  );
}
