import { Layout } from '@/components/Layout';
import { getFeaturedEntries } from '@/data/entries';
import type { MeaningEntry } from '@/data/types';
import { type Language, useI18n } from '@/i18n';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';

const getPronunciation = (entry: MeaningEntry, locale: Language): string | undefined => {
  switch (locale) {
    case 'en':
      return entry.romanization;
    case 'ko':
      return entry.pronunciation;
  }
};

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');

  if (isKorean) {
    return [
      { title: 'Context - 한국어 사전' },
      { name: 'description', content: '한국어 학습자를 위한 의미 사전' },
    ];
  }

  return [
    { title: 'Context - Korean Dictionary' },
    { name: 'description', content: 'Meaning dictionary for Korean learners' },
  ];
};

export default function HomePage() {
  const { locale, t, localePath } = useI18n();
  const featuredEntries = getFeaturedEntries(12);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('heroTitle')}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('heroSubtitle')}</p>
      </div>

      <div className="space-y-1">
        {featuredEntries.map((entry) => {
          const translation = entry.translations[locale];
          const pronunciation = getPronunciation(entry, locale);
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
                {pronunciation && (
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {pronunciation}
                  </span>
                )}
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {translation.word}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          to={localePath('/browse')}
          className="text-sm transition-colors"
          style={{ color: 'var(--accent-primary)' }}
        >
          {t('viewAll')} →
        </Link>
      </div>
    </Layout>
  );
}
