import { stripLocaleFromPath } from '@soundblue/shared';
import { cn } from '@soundblue/shared-react';
import { Grid3X3, Home, Info, LayoutGrid, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useI18n } from '@/i18n';

const stripLocale = stripLocaleFromPath;

export function BottomNav() {
  const { t, localePath } = useI18n();
  const location = useLocation();

  const isActive = (basePath: string) => {
    const currentPath = stripLocale(location.pathname);
    if (basePath === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(basePath);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-(--bg-elevated) border-t border-(--border-primary) flex items-center justify-around h-(--bottom-nav-height) pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile navigation"
    >
      <Link
        to={localePath('/')}
        className={cn(
          'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 rounded-lg transition-colors',
          isActive('/') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
        )}
      >
        <Home size={20} aria-hidden="true" />
        <span className="text-[12px]">{t('home')}</span>
      </Link>
      <Link
        to={localePath('/browse')}
        className={cn(
          'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 rounded-lg transition-colors',
          isActive('/browse') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
        )}
      >
        <Grid3X3 size={20} aria-hidden="true" />
        <span className="text-[12px]">{t('browse')}</span>
      </Link>
      <Link
        to={localePath('/conversations')}
        className={cn(
          'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 rounded-lg transition-colors',
          isActive('/conversations') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
        )}
      >
        <MessageCircle size={20} aria-hidden="true" />
        <span className="text-[12px]">{t('talk')}</span>
      </Link>
      <Link
        to={localePath('/my-learning')}
        className={cn(
          'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 rounded-lg transition-colors',
          isActive('/my-learning') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
        )}
      >
        <LayoutGrid size={20} aria-hidden="true" />
        <span className="text-[12px]">{t('learn')}</span>
      </Link>
      <Link
        to={localePath('/about')}
        className={cn(
          'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 rounded-lg transition-colors',
          isActive('/about') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
        )}
      >
        <Info size={20} aria-hidden="true" />
        <span className="text-[12px]">{t('about')}</span>
      </Link>
    </nav>
  );
}
