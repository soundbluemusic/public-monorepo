import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import { useI18n } from '@/i18n';
import { studyRecords } from '@/lib/db';
import { useEffect, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');

  if (isKorean) {
    return [
      { title: '찾아보기 - Context' },
      { name: 'description', content: '카테고리별로 한국어 단어 찾아보기' },
    ];
  }

  return [
    { title: 'Browse - Context' },
    { name: 'description', content: 'Browse Korean words by category' },
  ];
};

export default function BrowsePage() {
  const { locale, t, localePath } = useI18n();
  const [categoryProgress, setCategoryProgress] = useState<
    Record<string, { studied: number; total: number; percentage: number }>
  >({});

  // Load progress data
  useEffect(() => {
    async function loadProgress() {
      const catProgress: Record<string, { studied: number; total: number; percentage: number }> =
        {};
      for (const cat of categories) {
        const entries = meaningEntries.filter((e) => e.categoryId === cat.id);
        const progress = await studyRecords.getCategoryProgress(cat.id, entries.length);
        catProgress[cat.id] = progress;
      }
      setCategoryProgress(catProgress);
    }
    loadProgress();
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('browse')}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('browseDescription')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => {
          const count = meaningEntries.filter((e) => e.categoryId === category.id).length;
          const progress = categoryProgress[category.id] || {
            studied: 0,
            total: count,
            percentage: 0,
          };

          return (
            <Link
              key={category.id}
              to={localePath(`/category/${category.id}`)}
              className="p-4 rounded-xl transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{category.icon}</span>
                <div className="flex-1">
                  <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {category.name[locale]}
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {progress.studied}/{count} {locale === 'ko' ? '단어' : 'words'}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              {progress.studied > 0 && (
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${progress.percentage}%`,
                      backgroundColor: 'var(--accent-primary)',
                    }}
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </Layout>
  );
}
