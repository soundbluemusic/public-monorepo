import { Link } from '@tanstack/react-router';
import { FolderOpen } from 'lucide-react';
import type { categories } from '@/data/categories';
import type { MessageKey } from '@/i18n';

interface CategoryProgressListProps {
  cats: typeof categories;
  categoryProgress: Record<string, { studied: number; total: number }>;
  locale: 'en' | 'ko';
  localePath: (path: string) => string;
  /** i18n translation function (타입 안전) */
  t: (key: MessageKey) => string;
}

export function CategoryProgressList({
  cats,
  categoryProgress,
  locale,
  localePath,
  t,
}: CategoryProgressListProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
        <FolderOpen size={20} aria-hidden="true" />
        {t('progressByCategory')}
      </h2>
      <div className="space-y-3">
        {cats.map((category) => {
          const progress = categoryProgress[category.id] || { studied: 0, total: 0 };
          const percentage = progress.total > 0 ? (progress.studied / progress.total) * 100 : 0;

          return (
            <Link
              key={category.id}
              to={localePath(`/category/${category.id}`)}
              className="block p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-(--border-focus)"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium text-(--text-primary)">{category.name[locale]}</span>
                </div>
                <span className="text-sm text-(--text-secondary)">
                  {progress.studied}/{progress.total}
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-(--bg-secondary)">
                <div
                  className="h-full bg-(--accent-primary) transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
