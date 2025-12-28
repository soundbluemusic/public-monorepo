import { LIMITS, stripLocaleFromPath } from '@soundblue/shared';
import { cn, DarkModeToggle, LanguageToggle, useSearchWorker } from '@soundblue/shared-react';
import { Menu } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useI18n } from '@/i18n';

const stripLocale = stripLocaleFromPath;

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { locale, t, localePath } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  // Fuzzy search with debouncing via useSearchWorker
  const {
    query,
    setQuery,
    results: searchResults,
  } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: LIMITS.SEARCH_MAX_RESULTS,
  });

  // Map search results to simple format for rendering
  const results = searchResults.map((r) => ({
    id: r.item.id,
    name: r.item.name,
  }));

  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isMac =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

  // Global keyboard shortcuts
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      inputRef.current?.focus();
    }
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleGlobalKeyDown, handleClickOutside]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter' && query.trim()) setIsOpen(true);
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter': {
        e.preventDefault();
        const selectedResult = results[selectedIndex];
        if (selectedIndex >= 0 && selectedResult) {
          navigate(localePath(`/entry/${selectedResult.id}`));
          setIsOpen(false);
          setQuery('');
        }
        break;
      }
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const isActive = (basePath: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === basePath;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-(--header-height) backdrop-blur-sm bg-(--bg-primary)/80 border-b border-(--border-primary)">
      <div className="h-full px-4 flex items-center gap-4 md:pl-[calc(var(--sidebar-width)+1rem)]">
        {/* Menu Button (mobile only) */}
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary)"
          aria-label={t('menu')}
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        {/* Logo */}
        <Link
          to={localePath('/')}
          className="font-semibold text-(--text-primary) no-underline shrink-0"
        >
          Context
        </Link>

        {/* Search - Sound Blue style */}
        <div
          className="relative flex-1 max-w-70 max-md:max-w-40 max-[480px]:max-w-30"
          ref={containerRef}
        >
          <div className="relative flex items-center">
            <svg
              className="absolute left-2.5 w-4 h-4 text-(--text-tertiary) pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              className="w-full h-9 max-md:h-10 pl-8.5 pr-8 text-sm font-inherit text-(--text-primary) bg-(--bg-tertiary) border border-(--border-primary) rounded-xl outline-hidden transition-[border-color,background-color] duration-150 placeholder:text-(--text-tertiary) focus:border-(--border-focus) focus:bg-(--bg-secondary) [&::-webkit-search-cancel-button]:hidden"
              placeholder={locale === 'ko' ? '검색...' : 'Search...'}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(e.target.value.trim().length > 0);
                setSelectedIndex(-1);
              }}
              onFocus={() => {
                setIsFocused(true);
                if (query.trim()) setIsOpen(true);
              }}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              aria-label={locale === 'ko' ? '검색' : 'Search'}
            />
            {!isFocused && !query && (
              <span className="absolute right-2 flex items-center px-1.5 py-0.5 font-inherit text-[0.6875rem] font-medium text-(--text-tertiary) bg-(--bg-secondary) border border-(--border-primary) rounded pointer-events-none max-md:hidden">
                {isMac ? '\u2318K' : 'Ctrl+K'}
              </span>
            )}
            {query && (
              <button
                type="button"
                className="absolute right-1.5 flex items-center justify-center w-6 h-6 p-0 bg-transparent border-none rounded text-(--text-tertiary) cursor-pointer transition-all duration-150 hover:text-(--text-primary) active:scale-90"
                onClick={handleClear}
                aria-label={locale === 'ko' ? '지우기' : 'Clear'}
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {isOpen && results.length > 0 && (
            <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-600 max-h-75 overflow-y-auto bg-(--bg-secondary) border border-(--border-primary) rounded-xl shadow-lg m-0 p-1">
              {results.map((result, index) => (
                <Link
                  key={result.id}
                  to={localePath(`/entry/${result.id}`)}
                  className={cn(
                    'flex flex-col gap-0.5 py-2.5 px-3 no-underline rounded-lg transition-all duration-150',
                    index === selectedIndex ? 'bg-(--bg-tertiary)' : 'hover:bg-(--bg-tertiary)',
                  )}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium text-(--text-primary)">
                      {result.name.ko}
                    </span>
                    <span className="text-sm text-(--text-secondary)">{result.name.en}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {isOpen && query.trim() && results.length === 0 && (
            <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-600 bg-(--bg-secondary) border border-(--border-primary) rounded-xl shadow-lg p-4 text-center text-sm text-(--text-tertiary)">
              {locale === 'ko' ? '검색 결과 없음' : 'No results found'}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Actions - Desktop */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            to={localePath('/browse')}
            className={cn(
              'px-3 py-2 text-sm rounded-lg transition-colors min-h-11 flex items-center justify-center',
              'text-(--text-secondary) hover:bg-(--bg-tertiary)',
              isActive('/browse') && 'text-(--accent-primary) bg-(--bg-tertiary)',
            )}
          >
            {t('browse')}
          </Link>
          <Link
            to={localePath('/conversations')}
            className={cn(
              'px-3 py-2 text-sm rounded-lg transition-colors min-h-11 flex items-center justify-center',
              'text-(--text-secondary) hover:bg-(--bg-tertiary)',
              isActive('/conversations') && 'text-(--accent-primary) bg-(--bg-tertiary)',
            )}
          >
            {locale === 'ko' ? '대화' : 'Conversations'}
          </Link>
          <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
          <DarkModeToggle />
        </div>

        {/* Right Actions - Mobile */}
        <div className="flex sm:hidden items-center gap-1">
          <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
