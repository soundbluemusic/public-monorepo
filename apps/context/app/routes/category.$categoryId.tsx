import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import type { Category, MeaningEntry } from '@/data/types';
import { useI18n } from '@/i18n';
import { studyRecords } from '@/lib/db';
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
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-secondary)' }}>{t('categoryNotFound')}</p>
          <Link
            to={localePath('/browse')}
            className="mt-4 inline-block"
            style={{ color: 'var(--accent-primary)' }}
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
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {category.name[locale]}
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          {studiedCount}/{entries.length} {locale === 'ko' ? '단어 학습함' : 'words studied'}
        </p>

        {/* Progress bar */}
        {studiedCount > 0 && (
          <div
            className="mt-3 w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${(studiedCount / entries.length) * 100}%`,
                backgroundColor: 'var(--accent-primary)',
              }}
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
              className="flex items-center justify-between py-3 -mx-2 px-2 rounded transition-colors hover:bg-[var(--bg-tertiary)]"
              style={{ borderBottom: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Checkmark */}
                <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                  {isStudied && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                      <Check size={14} style={{ color: 'white' }} />
                    </div>
                  )}
                </div>

                {/* Word info */}
                <div className="flex items-baseline gap-3 flex-1 min-w-0">
                  <span
                    className="text-lg font-medium"
                    style={{
                      color: isStudied ? 'var(--text-secondary)' : 'var(--text-primary)',
                      textDecoration: isStudied ? 'line-through' : 'none',
                      opacity: isStudied ? 0.7 : 1,
                    }}
                  >
                    {entry.korean}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {entry.romanization}
                  </span>
                </div>
              </div>

              <span className="text-sm shrink-0 ml-2" style={{ color: 'var(--text-secondary)' }}>
                {translation.word}
              </span>
            </Link>
          );
        })}
      </div>

      {entries.length === 0 && (
        <p className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
          {t('noCategoryWords')}
        </p>
      )}
    </Layout>
  );
}
