import { Layout } from '@/components/Layout';
import { getFeaturedEntries } from '@/data/entries';
import type { MeaningEntry } from '@/data/types';
import { type Language, useI18n } from '@/i18n';
import { Link } from 'react-router';

const getPronunciation = (entry: MeaningEntry, locale: Language): string | undefined => {
  switch (locale) {
    case 'en':
      return entry.romanization;
    case 'ko':
      return entry.pronunciation;
  }
};

export function meta() {
  return [
    { title: 'Context - Korean Dictionary' },
    { name: 'description', content: 'Meaning dictionary for Korean learners' },
  ];
}

export default function HomePage() {
  const { locale, t, localePath } = useI18n();
  const featuredEntries = getFeaturedEntries(12);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {locale === 'ko' ? '한국어 의미 사전' : 'Korean Dictionary'}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {locale === 'ko'
            ? '한국어 단어의 의미를 영어로 설명합니다'
            : 'Korean words explained in English'}
        </p>
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
