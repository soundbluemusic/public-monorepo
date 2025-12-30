import { cn } from '@soundblue/ui/utils';
import { Sparkles, X } from 'lucide-react';
import { Link } from 'react-router';

interface SidebarHeaderProps {
  localePath: (path: string) => string;
  isCollapsed: boolean;
  t: (key: string) => string;
  onClose: () => void;
}

export function SidebarHeader({ localePath, isCollapsed, t, onClose }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between h-14 px-4 border-b border-(--border-primary)">
      {/* Full logo - mobile always, desktop when not collapsed */}
      <Link
        to={localePath('/')}
        onClick={onClose}
        className={cn(
          'flex items-center gap-2 text-(--text-primary) font-semibold no-underline',
          isCollapsed && 'lg:hidden',
        )}
      >
        <Sparkles size={20} aria-hidden="true" className="text-(--accent-primary)" />
        <span>Permissive</span>
      </Link>

      {/* Icon only logo - desktop collapsed */}
      {isCollapsed && (
        <Link
          to={localePath('/')}
          className="hidden lg:flex items-center justify-center w-full text-(--accent-primary)"
        >
          <Sparkles size={20} aria-hidden="true" />
        </Link>
      )}

      {/* Close button (mobile only) */}
      <button
        type="button"
        onClick={onClose}
        className="min-h-11 min-w-11 flex items-center justify-center rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) cursor-pointer lg:hidden"
        aria-label={t('aria.closeMenu')}
      >
        <X size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
