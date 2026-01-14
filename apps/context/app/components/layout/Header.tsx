import { DarkModeToggle, LanguageToggle, ServicesDropdown } from '@soundblue/ui/components';
import { cn } from '@soundblue/ui/utils';
import { Menu } from 'lucide-react';
import { Link } from 'react-router';
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

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-(--header-height) backdrop-blur-sm bg-(--bg-primary)/80 border-b border-(--border-primary) overflow-hidden">
      <div
        className={cn(
          'h-full pl-4 pr-6 flex items-center gap-2 sm:gap-4 transition-[padding] duration-200',
          sidebarCollapsed
            ? 'md:pl-[calc(var(--sidebar-collapsed-width)+1rem)]'
            : 'md:pl-[calc(var(--sidebar-width)+1rem)]',
        )}
      >
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

        {/* Search */}
        <div
          className="relative min-w-0 flex-1 max-w-70 max-md:max-w-40 max-[480px]:max-w-30"
          ref={containerRef}
        >
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
              onResultClick={handleResultClick}
              onMouseEnter={handleMouseEnter}
            />
          )}

          {isOpen && query.trim() && query.length >= 2 && isReady && results.length === 0 && (
            <NoResults message={t('noResults')} />
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1 min-w-0" />

        {/* Right Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Nav links - only on large screens */}
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
      </div>
    </header>
  );
}
