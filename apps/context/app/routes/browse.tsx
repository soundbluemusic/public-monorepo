import { Layout } from '@/components/Layout';
import { categories } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import { useI18n } from '@/i18n';
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
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {category.name[locale]}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {count}
                    {t('wordCount')}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
}
