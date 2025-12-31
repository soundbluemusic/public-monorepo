/**
 * @fileoverview 사이드바 컴포넌트 - 수학 분야 카테고리 네비게이션
 */

import { stripLocaleFromPath } from '@soundblue/i18n';
import { FamilySites } from '@soundblue/ui/components';
import { cn } from '@soundblue/ui/utils';
import { Link, useLocation } from 'react-router';
import { fields } from '@/data/fields';
import { useI18n } from '@/i18n';

// Use shared utility for locale stripping
const stripLocale = stripLocaleFromPath;

export function Sidebar() {
  const { locale, localePath, t } = useI18n();
  const location = useLocation();

  const isActive = (fieldId: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === `/field/${fieldId}` || currentPath.startsWith(`/field/${fieldId}/`);
  };

  return (
    <aside className="hidden lg:block sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-64 overflow-y-auto shrink-0 bg-(--bg-primary) border-r border-(--border-primary)">
      <nav aria-label="Math fields" className="p-4 flex flex-col gap-1">
        <div className="mb-4 pb-4 border-b border-(--border-primary)">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-(--text-tertiary) m-0">
            {t('mathFields')}
          </h2>
        </div>

        {fields.map((field) => (
          <Link
            key={field.id}
            to={localePath(`/field/${field.id}`)}
            className={cn(
              'flex items-center gap-3 px-3 py-3 rounded-lg min-h-11 transition-all no-underline',
              isActive(field.id)
                ? 'bg-(--bg-tertiary) text-(--accent-primary) shadow-sm'
                : 'text-(--text-secondary) hover:translate-x-1',
            )}
          >
            <span className="text-xl shrink-0">{field.icon}</span>
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  'font-medium text-sm truncate',
                  isActive(field.id) ? 'text-(--accent-primary)' : 'text-(--text-primary)',
                )}
              >
                {field.name[locale] || field.name.en}
              </div>
            </div>
            {isActive(field.id) && (
              <div className="w-1 h-6 rounded-full shrink-0 bg-(--accent-primary)" />
            )}
          </Link>
        ))}

        {/* More from Us */}
        <div className="mt-6 pt-4 border-t border-(--border-primary)">
          <FamilySites currentAppId="roots" variant="sidebar" locale={locale} />
        </div>
      </nav>
    </aside>
  );
}
