/**
 * @fileoverview 사이드바 컴포넌트 - 수학 분야 카테고리 네비게이션
 */
import { fields } from '@/data/fields';
import { useI18n } from '@/i18n';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

function stripLocale(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3);
  if (pathname === '/ko') return '/';
  return pathname;
}

export function Sidebar() {
  const { locale, localePath } = useI18n();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (fieldId: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === `/field/${fieldId}` || currentPath.startsWith(`/field/${fieldId}/`);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-colors"
        style={{
          backgroundColor: 'var(--accent-primary)',
          color: 'white',
        }}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsMobileOpen(false);
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)]
          w-64 lg:w-72 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
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
              {locale === 'ko' ? '수학 분야' : 'Math Fields'}
            </h2>
          </div>

          {fields.map((field) => (
            <Link
              key={field.id}
              to={localePath(`/field/${field.id}`)}
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
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
    </>
  );
}
