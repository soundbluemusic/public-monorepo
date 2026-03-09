import { DarkModeToggle, LanguageToggle, ServicesDropdown } from '@soundblue/ui/components';
import type { CommandGroup } from '@soundblue/ui/patterns';
import { CommandPalette, useCommandPalette } from '@soundblue/ui/patterns';
import { cn } from '@soundblue/ui/utils';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Menu, Search, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useIsActiveRoute } from '@/hooks';
import { useI18n } from '@/i18n';
import { NoResults, SearchDropdown, SearchInput, useGlobalSearch } from './search';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
}

export function Header({ onMenuClick, sidebarCollapsed = false }: HeaderProps) {
  const { locale, t, localePath } = useI18n();
  const { isActive, currentPath } = useIsActiveRoute();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const commandPalette = useCommandPalette();

  const {
    inputRef,
    containerRef,
    query,
    results,
    isOpen,
    isReady,
    selectedIndex,
    handleKeyDown,
    handleChange,
    handleFocus,
    handleClear,
    handleResultClick,
    handleMouseEnter,
  } = useGlobalSearch({ locale, localePath });

  const commandGroups: CommandGroup[] = useMemo(
    () => [
      {
        label: { en: 'Navigation', ko: '빠른 이동' },
        items: [
          {
            id: 'nav-home',
            label: { en: 'Home', ko: '홈' },
            description: { en: 'Go to home page', ko: '홈 페이지로 이동' },
            onSelect: localePath('/'),
          },
          {
            id: 'nav-browse',
            label: { en: 'Browse Categories', ko: '카테고리 탐색' },
            description: { en: 'Browse all categories', ko: '모든 카테고리 보기' },
            onSelect: localePath('/browse'),
          },
          {
            id: 'nav-conversations',
            label: { en: 'Conversations', ko: '대화' },
            description: { en: 'View conversations', ko: '대화 보기' },
            onSelect: localePath('/conversations'),
          },
          {
            id: 'nav-favorites',
            label: { en: 'Favorites', ko: '즐겨찾기' },
            description: { en: 'Your saved entries', ko: '저장한 항목' },
            onSelect: localePath('/favorites'),
          },
        ],
      },
      {
        label: { en: 'Actions', ko: '액션' },
        items: [
          {
            id: 'action-theme',
            label: { en: 'Toggle Dark Mode', ko: '다크모드 전환' },
            keywords: ['dark', 'light', 'theme', '테마', '어두운', '밝은'],
            onSelect: () => {
              document.querySelector<HTMLButtonElement>('[data-dark-mode-toggle]')?.click();
            },
          },
          {
            id: 'action-language',
            label: { en: 'Switch Language', ko: '언어 변경' },
            description: {
              en: locale === 'ko' ? 'Switch to English' : '한국어로 변경',
              ko: locale === 'ko' ? 'Switch to English' : '한국어로 변경',
            },
            keywords: ['language', 'english', 'korean', '영어', '한국어'],
            onSelect: locale === 'ko' ? currentPath : `/ko${currentPath}`,
          },
        ],
      },
    ],
    [locale, localePath, currentPath],
  );

  const handleCommandNavigate = useCallback(
    (url: string) => {
      navigate({ to: url });
    },
    [navigate],
  );

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false);
    handleClear();
  };

  const openMobileSearch = () => {
    setIsMobileSearchOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const isMac =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 h-(--header-height) backdrop-blur-sm bg-(--bg-primary)/80 border-b border-(--border-primary)">
        <div
          className={cn(
            'h-full pl-4 pr-6 flex items-center gap-2 sm:gap-4 transition-[padding] duration-200',
            sidebarCollapsed
              ? 'lg:pl-[calc(var(--sidebar-collapsed-width)+1rem)]'
              : 'lg:pl-[calc(var(--sidebar-width)+1rem)]',
          )}
        >
          {isMobileSearchOpen ? (
            <div className="flex items-center gap-2 w-full sm:hidden">
              <button
                type="button"
                onClick={closeMobileSearch}
                className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary) shrink-0"
                aria-label={t('back') || 'Back'}
              >
                <ArrowLeft size={20} aria-hidden="true" />
              </button>

              <div className="relative flex-1 min-w-0" ref={containerRef}>
                <SearchInput
                  ref={inputRef}
                  query={query}
                  placeholder={t('searchShort')}
                  clearLabel={t('clear')}
                  searchLabel={t('search')}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={() => {}}
                  onKeyDown={handleKeyDown}
                  onClear={handleClear}
                />

                {isOpen && results.length > 0 && (
                  <SearchDropdown
                    results={results}
                    selectedIndex={selectedIndex}
                    localePath={localePath}
                    onResultClick={() => {
                      handleResultClick();
                      closeMobileSearch();
                    }}
                    onMouseEnter={handleMouseEnter}
                  />
                )}

                {isOpen && query.trim() && query.length >= 2 && isReady && results.length === 0 && (
                  <NoResults message={t('noResults')} />
                )}
              </div>

              <button
                type="button"
                onClick={closeMobileSearch}
                className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary) shrink-0"
                aria-label={t('close') || 'Close'}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onMenuClick}
                className="lg:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary)"
                aria-label={t('menu')}
              >
                <Menu size={20} aria-hidden="true" />
              </button>

              <Link
                to={localePath('/')}
                className="font-semibold text-(--text-primary) no-underline shrink-0"
              >
                Context
              </Link>

              {/* 모바일 검색 아이콘 (sm 이하) */}
              <button
                type="button"
                onClick={openMobileSearch}
                className="sm:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary) bg-(--bg-tertiary) border border-(--border-primary)"
                aria-label={t('search')}
              >
                <Search size={18} aria-hidden="true" className="text-(--text-tertiary)" />
              </button>

              {/* 커맨드 팔레트 트리거 (sm 이상) */}
              <button
                type="button"
                onClick={commandPalette.open}
                className="hidden sm:flex items-center gap-2 min-h-11 px-3 rounded-xl text-sm transition-colors cursor-pointer max-w-70 flex-1 min-w-0 text-(--text-tertiary) bg-(--bg-elevated) border border-(--border-primary) hover:border-(--border-focus)"
              >
                <Search size={16} aria-hidden="true" />
                <span className="truncate">{t('searchShort')}</span>
                <kbd className="ml-auto hidden md:inline-flex items-center px-1.5 py-0.5 text-[0.6875rem] font-medium rounded text-(--text-tertiary) bg-(--bg-secondary) border border-(--border-primary)">
                  {isMac ? '⌘K' : 'Ctrl+K'}
                </kbd>
              </button>

              <div className="flex-1 min-w-0" />

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  to={localePath('/browse')}
                  className={cn(
                    'hidden lg:flex px-3 py-2 text-sm rounded-lg transition-colors min-h-11 items-center justify-center',
                    'text-(--text-secondary) hover:bg-(--bg-tertiary)',
                    isActive('/browse') && 'text-(--accent-primary) bg-(--bg-tertiary)',
                  )}
                >
                  {t('browse')}
                </Link>
                <Link
                  to={localePath('/conversations')}
                  className={cn(
                    'hidden lg:flex px-3 py-2 text-sm rounded-lg transition-colors min-h-11 items-center justify-center',
                    'text-(--text-secondary) hover:bg-(--bg-tertiary)',
                    isActive('/conversations') && 'text-(--accent-primary) bg-(--bg-tertiary)',
                  )}
                >
                  {t('conversations')}
                </Link>
                <ServicesDropdown currentAppId="context" locale={locale} />
                <LanguageToggle locale={locale} currentPath={currentPath} />
                <DarkModeToggle />
              </div>
            </>
          )}
        </div>
      </header>

      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
        groups={commandGroups}
        onNavigate={handleCommandNavigate}
        locale={locale}
      />
    </>
  );
}
