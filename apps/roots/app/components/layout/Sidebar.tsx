/**
 * @fileoverview 사이드바 컴포넌트 - 수학 분야 카테고리 네비게이션
 */
import { fields } from '@/data/fields';
import { useI18n } from '@/i18n';
import { stripLocaleFromPath } from '@soundblue/shared';
import { Link, useLocation } from 'react-router';

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
    <aside
      className="hidden lg:block sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-64 lg:w-72 overflow-y-auto shrink-0"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRight: '1px solid var(--border-primary)',
      }}
    >
      <nav className="p-4 space-y-1">
        <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {t('mathFields')}
          </h2>
        </div>

        {fields.map((field) => (
          <Link
            key={field.id}
            to={localePath(`/field/${field.id}`)}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-150 min-h-11
              ${isActive(field.id) ? 'shadow-sm' : 'hover:translate-x-1'}
            `}
            style={{
              backgroundColor: isActive(field.id) ? 'var(--bg-tertiary)' : 'transparent',
              color: isActive(field.id) ? 'var(--accent-primary)' : 'var(--text-secondary)',
            }}
          >
            <span className="text-xl shrink-0">{field.icon}</span>
            <div className="flex-1 min-w-0">
              <div
                className="font-medium text-sm truncate"
                style={{
                  color: isActive(field.id) ? 'var(--accent-primary)' : 'var(--text-primary)',
                }}
              >
                {field.name[locale] || field.name.en}
              </div>
            </div>
            {isActive(field.id) && (
              <div
                className="w-1 h-6 rounded-full shrink-0"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              />
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
