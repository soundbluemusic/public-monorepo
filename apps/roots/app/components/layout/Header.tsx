import { LIMITS } from '@soundblue/core/validation';
import { stripLocaleFromPath } from '@soundblue/i18n';
import { useSearchWorker } from '@soundblue/search/react';
import { DarkModeToggle, LanguageToggle, ServicesDropdown } from '@soundblue/ui/components';
import { SearchDropdown } from '@soundblue/ui/patterns';
import { cn } from '@soundblue/ui/utils';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { useCallback } from 'react';
import { useI18n } from '@/i18n';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export function Header({ sidebarCollapsed, onMenuClick }: HeaderProps) {
  const { locale, t, localePath } = useI18n();
  const routerState = useRouterState();
  const pathname = routerState.location?.pathname ?? '/';
  const navigate = useNavigate();

  const { query, setQuery, results, isLoading } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: LIMITS.SEARCH_MAX_RESULTS,
  });

  const handleSelectResult = useCallback(
    (result: { item: { id: string } }) => {
      navigate({ to: localePath(`/concept/${result.item.id}`) });
    },
    [navigate, localePath],
  );

  const isActive = (basePath: string) => {
    const currentPath = stripLocaleFromPath(pathname);
    return currentPath === basePath || currentPath.startsWith(`${basePath}/`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-(--header-height) backdrop-blur-sm bg-(--bg-primary)/80 border-b border-(--border-primary)">
      <div
        className={cn(
          'h-full px-4 flex items-center gap-4 transition-[padding] duration-200',
          sidebarCollapsed
            ? 'lg:pl-[calc(var(--sidebar-collapsed-width)+1rem)]'
            : 'lg:pl-[calc(var(--sidebar-width)+1rem)]',
        )}
      >
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer"
          aria-label={locale === 'ko' ? '메뉴 열기' : 'Open menu'}
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        {/* Logo */}
        <Link
          to={localePath('/')}
          className="font-semibold shrink-0 flex items-center gap-2 text-(--text-primary) no-underline"
        >
          <span className="text-xl">π</span>
          <span>Roots</span>
        </Link>

        {/* Real-time Search Dropdown */}
        <div className="relative flex-1 max-w-80 max-lg:max-w-64 max-sm:max-w-48">
          <SearchDropdown
            query={query}
            onQueryChange={setQuery}
            results={results}
            isLoading={isLoading}
            onSelect={handleSelectResult}
            locale={locale}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Actions - Desktop */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            to={localePath('/browse')}
            className={cn(
              'min-h-11 flex items-center px-3 py-2 text-sm rounded-lg transition-colors no-underline',
              isActive('/browse')
                ? 'text-(--accent-primary) bg-(--bg-tertiary)'
                : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
            )}
          >
            {t('browse')}
          </Link>

          <Link
            to={localePath('/favorites')}
            className={cn(
              'min-h-11 flex items-center px-3 py-2 text-sm rounded-lg transition-colors no-underline',
              isActive('/favorites')
                ? 'text-(--accent-primary) bg-(--bg-tertiary)'
                : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
            )}
          >
            {t('favorites')}
          </Link>

          <Link
            to={localePath('/constants')}
            className={cn(
              'min-h-11 flex items-center px-3 py-2 text-sm rounded-lg transition-colors no-underline',
              isActive('/constants')
                ? 'text-(--accent-primary) bg-(--bg-tertiary)'
                : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
            )}
          >
            {t('constants')}
          </Link>

          <ServicesDropdown currentAppId="roots" locale={locale} />
          <LanguageToggle locale={locale} currentPath={stripLocaleFromPath(pathname)} />
          <DarkModeToggle />
        </div>

        {/* Right Actions - Mobile */}
        <div className="flex sm:hidden items-center gap-1">
          <ServicesDropdown currentAppId="roots" locale={locale} />
          <LanguageToggle locale={locale} currentPath={stripLocaleFromPath(pathname)} />
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
