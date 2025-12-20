import { Layout } from '@/components/Layout';
import { meaningEntries } from '@/data/entries';
import { useI18n } from '@/i18n';
import { Link, useParams } from 'react-router';

export function meta() {
  return [{ title: 'Entry - Context' }];
}

export default function EntryPage() {
  const { entryId } = useParams();
  const { locale, t, localePath } = useI18n();

  const entry = meaningEntries.find((e) => e.id === entryId);

  if (!entry) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-secondary)' }}>
            {locale === 'ko' ? '단어를 찾을 수 없습니다' : 'Entry not found'}
          </p>
          <Link
            to={localePath('/')}
            className="mt-4 inline-block"
            style={{ color: 'var(--accent-primary)' }}
          >
            {t('backToList')}
          </Link>
        </div>
      </Layout>
    );
  }

  const translation = entry.translations[locale];

  return (
    <Layout>
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {entry.korean}
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
            {entry.romanization}
          </p>
        </header>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {t('translation')}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>{translation.word}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {t('explanation')}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>{translation.explanation}</p>
        </section>

        {translation.examples && translation.examples.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('examples')}
            </h2>
            <ul className="space-y-2">
              {translation.examples.map((example) => (
                <li key={example} style={{ color: 'var(--text-secondary)' }}>
                  {example}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-8">
          <Link
            to={localePath('/browse')}
            className="text-sm"
            style={{ color: 'var(--accent-primary)' }}
          >
            ← {t('backToList')}
          </Link>
        </div>
      </article>
    </Layout>
  );
}
