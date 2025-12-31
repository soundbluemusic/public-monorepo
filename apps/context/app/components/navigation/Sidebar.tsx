import { LIMITS } from '@soundblue/core/validation';
import { stripLocaleFromPath } from '@soundblue/i18n';
import { FamilySites } from '@soundblue/ui/components';
import { cn } from '@soundblue/ui/utils';
import { Bookmark, Code2, Home, Info, LayoutGrid, List, MessageCircle, X } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { categories } from '@/data/categories';
import { useI18n } from '@/i18n';

const stripLocale = stripLocaleFromPath;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { locale, t, localePath } = useI18n();
  const location = useLocation();

  // Escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open (mobile)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (basePath: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === basePath;
  };

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-(--bg-elevated) border-r border-(--border-primary)',
          'flex flex-col transform transition-transform duration-200',
          // Mobile: slide in/out based on isOpen
          'md:translate-x-0 md:top-(--header-height) md:h-[calc(100vh-var(--header-height))]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label={t('menu')}
      >
        {/* Header (mobile only) */}
        <div className="md:hidden h-14 flex items-center justify-between px-4 shrink-0 border-b border-(--border-primary)">
          <span className="font-semibold text-(--text-primary)">{t('menu')}</span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary)"
            aria-label={t('closeMenu')}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto py-4">
          {/* Main navigation */}
          <div className="px-3 mb-6">
            <Link
              to={localePath('/')}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
                'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                isActive('/') && 'bg-(--bg-tertiary) text-(--accent-primary)',
              )}
            >
              <Home size={20} aria-hidden="true" />
              {t('home')}
            </Link>
            <Link
              to={localePath('/browse')}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
                'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                isActive('/browse') && 'bg-(--bg-tertiary) text-(--accent-primary)',
              )}
            >
              <List size={20} aria-hidden="true" />
              {t('browse')}
            </Link>
            <Link
              to={localePath('/conversations')}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
                'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                isActive('/conversations') && 'bg-(--bg-tertiary) text-(--accent-primary)',
              )}
            >
              <MessageCircle size={20} aria-hidden="true" />
              {t('conversationExamples')}
            </Link>
            <Link
              to={localePath('/my-learning')}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
                'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                isActive('/my-learning') && 'bg-(--bg-tertiary) text-(--accent-primary)',
              )}
            >
              <LayoutGrid size={20} aria-hidden="true" />
              {t('myLearning')}
            </Link>
            <Link
              to={localePath('/bookmarks')}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
                'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                isActive('/bookmarks') && 'bg-(--bg-tertiary) text-(--accent-primary)',
              )}
            >
              <Bookmark size={20} aria-hidden="true" />
              {t('bookmarks')}
            </Link>
            <Link
              to={localePath('/about')}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
                'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                isActive('/about') && 'bg-(--bg-tertiary) text-(--accent-primary)',
              )}
            >
              <Info size={20} aria-hidden="true" />
              {t('about')}
            </Link>
          </div>

          {/* Categories */}
          <div className="px-3 mb-6">
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-(--text-tertiary)">
              {t('browseByCategory')}
            </div>
            <div className="flex flex-col gap-0.5">
              {categories.slice(0, LIMITS.SIDEBAR_CATEGORIES_PREVIEW).map((category) => (
                <Link
                  key={category.id}
                  to={localePath(`/category/${category.id}`)}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11 text-sm',
                    'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
                    isActive(`/category/${category.id}`) &&
                      'bg-(--bg-tertiary) text-(--accent-primary)',
                  )}
                >
                  <span className="text-base">{category.icon}</span>
                  {category.name[locale]}
                </Link>
              ))}
              <Link
                to={localePath('/browse')}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11 text-sm text-(--accent-primary) hover:bg-(--bg-tertiary)"
              >
                <span className="text-base text-(--text-secondary)">+{categories.length - 6}</span>
                {t('viewAll')}
              </Link>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-(--border-primary)">
          <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-(--text-tertiary)">
            {t('more')}
          </div>
          <Link
            to={localePath('/built-with')}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
              'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
              isActive('/built-with') && 'bg-(--bg-tertiary) text-(--accent-primary)',
            )}
          >
            <Code2 size={20} aria-hidden="true" />
            {t('builtWithTitle')}
          </Link>
          <Link
            to={localePath('/sitemap')}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-11',
              'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)',
              isActive('/sitemap') && 'bg-(--bg-tertiary) text-(--accent-primary)',
            )}
          >
            <LayoutGrid size={20} aria-hidden="true" />
            {t('sitemap')}
          </Link>

          {/* More from Us */}
          <div className="mt-4">
            <FamilySites currentAppId="context" variant="sidebar" locale={locale} />
          </div>
        </div>
      </aside>
    </>
  );
}
