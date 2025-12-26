import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import type { Category, MeaningEntry } from '@/data/types';
import { useI18n } from '@/i18n';
import { studyRecords } from '@/lib/db';
import { cn } from '@soundblue/shared-react';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router';

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 */
export async function loader({ params }: { params: { categoryId: string } }) {
  const category = categories.find((c) => c.id === params.categoryId);
  const entries = meaningEntries.filter((e) => e.categoryId === params.categoryId);
  return { category: category || null, entries };
}

export function meta() {
  return [{ title: 'Category - Context' }];
}

export default function CategoryPage() {
  const { category, entries } = useLoaderData<{
    category: Category | null;
    entries: MeaningEntry[];
  }>();
  const { locale, t, localePath } = useI18n();
  const [studiedIds, setStudiedIds] = useState<Set<string>>(new Set());

  // Load studied words
  useEffect(() => {
    async function loadStudied() {
      const ids = await studyRecords.getStudiedEntryIds();
      setStudiedIds(new Set(ids));
    }
    loadStudied();
  }, []);

  if (!category) {
    return (
      <Layout>
        <div className="text-center py-12 px-4 text-[var(--text-tertiary)]">
          <p className="text-[var(--text-secondary)]">{t('categoryNotFound')}</p>
          <Link
            to={localePath('/browse')}
            className="text-[var(--accent-primary)] hover:underline mt-4 inline-block"
          >
            {t('browse')}
          </Link>
        </div>
      </Layout>
    );
  }

  const studiedCount = entries.filter((e) => studiedIds.has(e.id)).length;

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{category.icon}</span>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            {category.name[locale]}
          </h1>
        </div>
        <p className="text-[var(--text-secondary)]">
          {studiedCount}/{entries.length} {locale === 'ko' ? '단어 학습함' : 'words studied'}
        </p>

        {/* Progress bar */}
        {studiedCount > 0 && (
          <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--bg-secondary)] mt-3">
            <div
              className="h-full bg-[var(--accent-primary)] transition-all duration-300"
              style={{ width: `${(studiedCount / entries.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="space-y-1">
        {entries.map((entry) => {
          const translation = entry.translations[locale];
          const isStudied = studiedIds.has(entry.id);

          return (
            <Link
              key={entry.id}
              to={localePath(`/entry/${entry.id}`)}
              className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg border-b border-[var(--border-primary)] transition-colors no-underline hover:bg-[var(--bg-tertiary)]"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Checkmark */}
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                    isStudied ? 'bg-[var(--accent-primary)]' : '',
                  )}
                >
                  {isStudied && <Check size={14} className="text-white" />}
                </div>

                {/* Word info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={cn(
                      'text-lg font-medium',
                      isStudied
                        ? 'text-[var(--text-secondary)] line-through opacity-70'
                        : 'text-[var(--text-primary)]',
                    )}
                  >
                    {entry.korean}
                  </span>
                  <span className="text-sm text-[var(--text-tertiary)]">{entry.romanization}</span>
                </div>
              </div>

              <span className="text-sm text-[var(--text-secondary)] shrink-0 ml-2">
                {translation.word}
              </span>
            </Link>
          );
        })}
      </div>

      {entries.length === 0 && (
        <p className="text-center py-12 px-4 text-[var(--text-tertiary)]">{t('noCategoryWords')}</p>
      )}
    </Layout>
  );
}
