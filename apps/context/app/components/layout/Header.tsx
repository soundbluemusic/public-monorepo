import { DarkModeToggle, LanguageToggle, ServicesDropdown } from '@soundblue/ui/components';
import { cn } from '@soundblue/ui/utils';
import { ArrowLeft, Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

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

  /**
   * 모바일 검색 닫기 핸들러
   */
  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false);
    handleClear();
  };

  /**
   * 모바일 검색 열기 핸들러
   */
  const openMobileSearch = () => {
    setIsMobileSearchOpen(true);
    // 다음 렌더 사이클에서 input에 포커스
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-(--header-height) backdrop-blur-sm bg-(--bg-primary)/80 border-b border-(--border-primary)">
      <div
        className={cn(
          'h-full pl-4 pr-6 flex items-center gap-2 sm:gap-4 transition-[padding] duration-200',
          sidebarCollapsed
            ? 'lg:pl-[calc(var(--sidebar-collapsed-width)+1rem)]'
            : 'lg:pl-[calc(var(--sidebar-width)+1rem)]',
        )}
      >
        {/* 모바일 검색 확장 모드 (sm 이하에서만) */}
        {isMobileSearchOpen ? (
          <div className="flex items-center gap-2 w-full sm:hidden">
            {/* 뒤로가기 버튼 */}
            <button
              type="button"
              onClick={closeMobileSearch}
              className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary) shrink-0"
              aria-label={t('back') || 'Back'}
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </button>

            {/* 전체 너비 검색 입력 */}
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
                  onResultClick={(result) => {
                    handleResultClick(result);
                    closeMobileSearch();
                  }}
                  onMouseEnter={handleMouseEnter}
                />
              )}

              {isOpen && query.trim() && query.length >= 2 && isReady && results.length === 0 && (
                <NoResults message={t('noResults')} />
              )}
            </div>

            {/* 닫기 버튼 */}
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
            {/* Menu Button (mobile/tablet only) */}
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary)"
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

            {/* 모바일 검색 아이콘 버튼 (sm 이하에서만) */}
            <button
              type="button"
              onClick={openMobileSearch}
              className="sm:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary) bg-(--bg-tertiary) border border-(--border-primary)"
              aria-label={t('search')}
            >
              <Search size={18} aria-hidden="true" className="text-(--text-tertiary)" />
            </button>

            {/* 데스크톱/태블릿 검색 (sm 이상에서만) */}
            <div
              className="relative min-w-0 flex-1 max-w-70 hidden sm:block"
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
          </>
        )}
      </div>
    </header>
  );
}
