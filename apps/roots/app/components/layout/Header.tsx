import { LIMITS } from '@soundblue/core/validation';
import { stripLocaleFromPath } from '@soundblue/i18n';
import { useSearchWorker } from '@soundblue/search/react';
import { DarkModeToggle, LanguageToggle, ServicesDropdown } from '@soundblue/ui/components';
import type { CommandGroup, CommandItem } from '@soundblue/ui/patterns';
import { CommandPalette, useCommandPalette } from '@soundblue/ui/patterns';
import { cn } from '@soundblue/ui/utils';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Menu, Search } from 'lucide-react';
import { useCallback, useMemo } from 'react';
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
  const commandPalette = useCommandPalette();

  const { query, setQuery, results, isLoading } = useSearchWorker({
    indexUrl: '/search-index.json',
    locale,
    debounceMs: 150,
    maxResults: LIMITS.SEARCH_MAX_RESULTS,
    enabled: commandPalette.isOpen,
  });

  const isActive = (basePath: string) => {
    const currentPath = stripLocaleFromPath(pathname);
    return currentPath === basePath || currentPath.startsWith(`${basePath}/`);
  };

  const searchResultsAsCommands: CommandItem[] = useMemo(
    () =>
      results.map((r) => ({
        id: r.item.id,
        label: { en: r.item.name.en, ko: r.item.name.ko ?? r.item.name.en },
        description: r.item.description
          ? { en: r.item.description.en, ko: r.item.description.ko ?? r.item.description.en }
          : undefined,
        onSelect: localePath(`/concept/${r.item.id}`),
      })),
    [results, localePath],
  );

  const commandGroups: CommandGroup[] = useMemo(
    () => [
      {
        label: { en: 'Navigation', ko: '빠른 이동' },
        items: [
          {
            id: 'nav-home',
            label: { en: 'Home', ko: '홈' },
            onSelect: localePath('/'),
          },
          {
            id: 'nav-browse',
            label: { en: 'Browse Fields', ko: '분야 탐색' },
            onSelect: localePath('/browse'),
          },
          {
            id: 'nav-favorites',
            label: { en: 'Favorites', ko: '즐겨찾기' },
            onSelect: localePath('/favorites'),
          },
          {
            id: 'nav-constants',
            label: { en: 'Constants', ko: '상수' },
            onSelect: localePath('/constants'),
          },
        ],
      },
      {
        label: { en: 'Actions', ko: '액션' },
        items: [
          {
            id: 'action-theme',
            label: { en: 'Toggle Dark Mode', ko: '다크모드 전환' },
            keywords: ['dark', 'light', 'theme', '테마'],
            onSelect: () => {
              document.querySelector<HTMLButtonElement>('[data-dark-mode-toggle]')?.click();
            },
          },
          {
            id: 'action-language',
            label: { en: 'Switch Language', ko: '언어 변경' },
            keywords: ['language', '영어', '한국어'],
            onSelect:
              locale === 'ko'
                ? stripLocaleFromPath(pathname)
                : `/ko${stripLocaleFromPath(pathname)}`,
          },
        ],
      },
    ],
    [locale, localePath, pathname],
  );

  const handleCommandSearch = useCallback(
    (q: string) => {
      setQuery(q);
    },
    [setQuery],
  );

  const handleCommandNavigate = useCallback(
    (url: string) => {
      navigate({ to: url });
    },
    [navigate],
  );

  const isMac =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 h-(--header-height) backdrop-blur-sm bg-(--bg-primary)/80 border-b border-(--border-primary)">
        <div
          className={cn(
            'h-full px-4 flex items-center gap-4 transition-[padding] duration-200',
            sidebarCollapsed
              ? 'lg:pl-[calc(var(--sidebar-collapsed-width)+1rem)]'
              : 'lg:pl-[calc(var(--sidebar-width)+1rem)]',
          )}
        >
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer"
            aria-label={locale === 'ko' ? '메뉴 열기' : 'Open menu'}
          >
            <Menu size={20} aria-hidden="true" />
          </button>

          <Link
            to={localePath('/')}
            className="font-semibold shrink-0 flex items-center gap-2 text-(--text-primary) no-underline"
          >
            <span className="text-xl">π</span>
            <span>Roots</span>
          </Link>

          {/* 커맨드 팔레트 트리거 */}
          <button
            type="button"
            onClick={commandPalette.open}
            className="flex items-center gap-2 min-h-11 px-3 rounded-xl text-sm transition-colors cursor-pointer flex-1 max-w-80 max-lg:max-w-64 max-sm:max-w-48 text-(--text-tertiary) bg-(--bg-elevated) border border-(--border-primary) hover:border-(--border-focus)"
          >
            <Search size={16} aria-hidden="true" />
            <span className="truncate">{locale === 'ko' ? '검색...' : 'Search...'}</span>
            <kbd className="ml-auto hidden md:inline-flex items-center px-1.5 py-0.5 text-[0.6875rem] font-medium rounded text-(--text-tertiary) bg-(--bg-secondary) border border-(--border-primary)">
              {isMac ? '⌘K' : 'Ctrl+K'}
            </kbd>
          </button>

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

      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
        groups={commandGroups}
        onSearch={handleCommandSearch}
        searchResults={query.trim().length >= 2 ? searchResultsAsCommands : undefined}
        isSearching={isLoading}
        onNavigate={handleCommandNavigate}
        locale={locale}
      />
    </>
  );
}
