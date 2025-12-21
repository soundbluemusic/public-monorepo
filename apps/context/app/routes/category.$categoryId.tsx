import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import { useI18n } from '@/i18n';
import { Link, useParams } from 'react-router';

export function meta() {
  return [{ title: 'Category - Context' }];
}

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { locale, t, localePath } = useI18n();

  const category = categories.find((c) => c.id === categoryId);
  const entries = meaningEntries.filter((e) => e.categoryId === categoryId);

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
          {entries.length}
          {t('wordCount')}
        </p>
      </div>

      <div className="space-y-1">
        {entries.map((entry) => {
          const translation = entry.translations[locale];
          return (
            <Link
              key={entry.id}
              to={localePath(`/entry/${entry.id}`)}
              className="flex items-baseline justify-between py-3 -mx-2 px-2 rounded transition-colors"
              style={{ borderBottom: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                  {entry.korean}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {entry.romanization}
                </span>
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
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
