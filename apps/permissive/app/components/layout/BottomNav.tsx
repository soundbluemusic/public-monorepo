import { cn } from '@soundblue/ui/utils';
import { Globe, Home, Package } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { useI18n } from '../../i18n';

interface BottomNavItem {
  href: string;
  label: string;
  labelKo: string;
  icon: ReactNode;
}

const navItems: readonly BottomNavItem[] = [
  {
    href: '/',
    label: 'Home',
    labelKo: '홈',
    icon: <Home size={20} aria-hidden="true" />,
  },
  {
    href: '/web-api',
    label: 'Web API',
    labelKo: 'Web API',
    icon: <Globe size={20} aria-hidden="true" />,
  },
  {
    href: '/libraries',
    label: 'Libraries',
    labelKo: 'Libraries',
    icon: <Package size={20} aria-hidden="true" />,
  },
];

export default function BottomNav() {
  const { locale, localePath } = useI18n();
  const location = useLocation();

  const isActive = (href: string) => location.pathname === localePath(href);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-(--bg-elevated) border-t border-(--border-primary) flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={localePath(item.href)}
          className={cn(
            'flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-4 py-2 no-underline transition-colors',
            isActive(item.href) ? 'text-(--accent-primary)' : 'text-(--text-secondary)',
          )}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          {item.icon}
          <span className="text-[11px] sm:text-xs font-medium">
            {locale === 'ko' ? item.labelKo : item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
