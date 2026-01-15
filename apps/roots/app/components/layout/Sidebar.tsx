/**
 * @fileoverview Roots 앱 사이드바 컴포넌트
 * BaseSidebar를 사용하여 앱별 데이터만 전달
 */

import { stripLocaleFromPath } from '@soundblue/i18n';
import { BaseSidebar, FamilySites, SidebarSection } from '@soundblue/ui/components';
import { cn } from '@soundblue/ui/utils';
import { Link, useLocation } from 'react-router';
import { fields } from '@/data/fields';
import { useI18n } from '@/i18n';

// Use shared utility for locale stripping
const stripLocale = stripLocaleFromPath;

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const { locale, localePath, t } = useI18n();
  const location = useLocation();

  const isActive = (basePath: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === basePath || currentPath.startsWith(`${basePath}/`);
  };

  return (
    <BaseSidebar
      isOpen={isOpen}
      isCollapsed={isCollapsed}
      onClose={onClose}
      onToggleCollapse={onToggleCollapse}
      locale={locale}
      localePath={localePath}
      isActive={isActive}
      logo={<span className="font-semibold">{t('mathFields')}</span>}
      ariaLabel="Math fields"
      navItems={[]}
      closeMenuLabel={locale === 'ko' ? '메뉴 닫기' : 'Close menu'}
    >
      {/* Math Fields Section */}
      <SidebarSection title={t('mathFields')}>
        {fields.map((field) => (
          <Link
            key={field.id}
            to={localePath(`/field/${field.id}`)}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-3 rounded-lg min-h-11 transition-all no-underline',
              isActive(`/field/${field.id}`)
                ? 'bg-(--bg-tertiary) text-(--accent-primary) shadow-sm'
                : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
            )}
          >
            <span className="text-xl shrink-0">{field.icon}</span>
            <span className="font-medium text-sm truncate">
              {field.name[locale] || field.name.en}
            </span>
            {isActive(`/field/${field.id}`) && (
              <div className="w-1 h-6 rounded-full shrink-0 bg-(--accent-primary) ml-auto" />
            )}
          </Link>
        ))}
      </SidebarSection>

      {/* More from Us */}
      <div className="mt-6 pt-4 border-t border-(--border-primary)">
        <FamilySites currentAppId="roots" variant="sidebar" locale={locale} />
      </div>
    </BaseSidebar>
  );
}
