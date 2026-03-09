import { stripLocaleFromPath } from '@soundblue/i18n';
import { DarkModeToggle, LanguageToggle, ServicesDropdown } from '@soundblue/ui/components';
import type { CommandGroup } from '@soundblue/ui/patterns';
import { CommandPalette, useCommandPalette } from '@soundblue/ui/patterns';
import { cn } from '@soundblue/ui/utils';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { Menu, Search, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../i18n';

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
  const commandPalette = useCommandPalette();

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

  const commandGroups: CommandGroup[] = useMemo(
    () => [
      {
        label: { en: 'Navigation', ko: '빠른 이동' },
        items: [
          {
            id: 'nav-home',
            label: { en: 'Home', ko: '홈' },
            onSelect: '/',
          },
          {
            id: 'nav-libraries',
            label: { en: 'Libraries', ko: '라이브러리' },
            description: { en: 'Browse web dev libraries', ko: '웹개발 라이브러리 탐색' },
            onSelect: '/libraries',
          },
          {
            id: 'nav-apis',
            label: { en: 'Web APIs', ko: '웹 API' },
            description: { en: 'Browse Web APIs', ko: '웹 API 탐색' },
            onSelect: '/apis',
          },
          {
            id: 'nav-favorites',
            label: { en: 'Favorites', ko: '즐겨찾기' },
            onSelect: '/favorites',
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
                ? stripLocale(location.pathname)
                : `/ko${stripLocale(location.pathname)}`,
          },
        ],
      },
    ],
    [locale, location.pathname],
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
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 h-14 flex items-center justify-between gap-4 px-4 bg-(--bg-primary)/80 backdrop-blur-sm border-b border-(--border-primary) transition-shadow',
          scrolled && 'shadow-sm',
        )}
      >
        {/* Left: Menu button (mobile) + Logo */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMenuClick}
            data-mobile-menu
            className="lg:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer"
            aria-label={isSidebarOpen ? t('aria.closeMenu') : t('aria.openMenu')}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 text-(--text-primary) font-semibold no-underline"
          >
            <Sparkles size={20} aria-hidden="true" className="text-(--accent-primary)" />
            <span>Permissive</span>
          </Link>
        </div>

        {/* Center: Command Palette Trigger */}
        <button
          type="button"
          onClick={commandPalette.open}
          className="hidden sm:flex items-center gap-2 min-h-11 px-3 rounded-xl text-sm transition-colors cursor-pointer max-w-64 text-(--text-tertiary) bg-(--bg-elevated) border border-(--border-primary) hover:border-(--border-focus)"
        >
          <Search size={16} aria-hidden="true" />
          <span>{locale === 'ko' ? '검색...' : 'Search...'}</span>
          <kbd className="ml-auto hidden md:inline-flex items-center px-1.5 py-0.5 text-[0.6875rem] font-medium rounded text-(--text-tertiary) bg-(--bg-secondary) border border-(--border-primary)">
            {isMac ? '⌘K' : 'Ctrl+K'}
          </kbd>
        </button>

        {/* Right: Controls */}
        <div className="flex items-center gap-1">
          {/* 모바일 검색 아이콘 */}
          <button
            type="button"
            onClick={commandPalette.open}
            className="sm:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer"
            aria-label={locale === 'ko' ? '검색' : 'Search'}
          >
            <Search size={18} aria-hidden="true" />
          </button>
          <ServicesDropdown currentAppId="permissive" locale={locale} />
          <LanguageToggle locale={locale} currentPath={stripLocale(location.pathname)} />
          <DarkModeToggle />
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
