import { useI18n } from '@/i18n';
import { stripLocaleFromPath } from '@soundblue/shared';
import {
  DarkModeToggle,
  LanguageToggle,
  SearchDropdown,
  type SearchResult,
  cn,
  useSearchWorker,
} from '@soundblue/shared-react';
import { Menu } from 'lucide-react';
import { useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

const stripLocale = stripLocaleFromPath;

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { locale, t, localePath } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const { query, setQuery, results, isLoading } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: 8,
  });

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      navigate(localePath(`/entry/${result.item.id}`));
    },
    [navigate, localePath],
  );

  const renderContextResult = useCallback((result: SearchResult, _isSelected: boolean) => {
    const name = result.item.name;
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-(--text-primary)">{name.ko}</span>
          <span className="text-xs text-(--text-tertiary)">
            {result.item.tags?.[result.item.tags.length - 1]}
          </span>
        </div>
        <span className="text-(--text-secondary)">{name.en}</span>
      </div>
    );
  }, []);

  const isActive = (basePath: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === basePath;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-(--header-height) backdrop-blur-sm bg-(--bg-primary)/80 border-b border-(--border-primary)">
      <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        {/* Menu Button + Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary)"
            aria-label={t('menu')}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <Link to={localePath('/')} className="font-semibold text-(--text-primary) no-underline">
            Context
          </Link>
        </div>

        {/* Search */}
        <SearchDropdown
          query={query}
          onQueryChange={setQuery}
          results={results}
          isLoading={isLoading}
          onSelect={handleSelectResult}
          locale={locale}
          renderResult={renderContextResult}
          className="flex-1 max-w-md"
        />

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
