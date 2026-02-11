import { stripLocaleFromPath } from '@soundblue/i18n';
import { cn } from '@soundblue/ui/utils';
import { Link, useRouterState } from '@tanstack/react-router';
import { BookOpen, Heart, Star } from 'lucide-react';
import { useI18n } from '@/i18n';

export function BottomNav() {
  const { t, localePath } = useI18n();
  const routerState = useRouterState();
  const pathname = routerState.location?.pathname ?? '/';

  const isActive = (basePath: string) => {
    const currentPath = stripLocaleFromPath(pathname);
    return currentPath === basePath || currentPath.startsWith(`${basePath}/`);
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-(--bg-elevated) border-t border-(--border-primary) flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
    >
      <Link
        to={localePath('/browse')}
        className={cn(
          'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-4 py-2 no-underline transition-colors',
          isActive('/browse') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
        )}
      >
        <BookOpen size={20} aria-hidden="true" />
        <span className="text-xs">{t('browse')}</span>
      </Link>
      <Link
        to={localePath('/favorites')}
        className={cn(
          'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-4 py-2 no-underline transition-colors',
          isActive('/favorites') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
        )}
      >
        <Heart size={20} aria-hidden="true" />
        <span className="text-xs">{t('favorites')}</span>
      </Link>
      <Link
        to={localePath('/constants')}
        className={cn(
          'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-4 py-2 no-underline transition-colors',
          isActive('/constants') ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
        )}
      >
        <Star size={20} aria-hidden="true" />
        <span className="text-xs">{t('constants')}</span>
      </Link>
    </nav>
  );
}
