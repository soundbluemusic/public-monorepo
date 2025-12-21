/**
 * @fileoverview 분야 상세 페이지
 */
import { ConceptCard } from '@/components/concept/ConceptCard';
import { Layout } from '@/components/layout/Layout';
import { getConceptsByField as getConceptsByFieldStatic } from '@/data/concepts/index';
import { getFieldById } from '@/data/fields';
import { getSubfieldsByParent } from '@/data/subfields';
import { useI18n } from '@/i18n';
import { Link, useLoaderData, useParams } from 'react-router';
import type { Route } from './+types/field.$fieldId';

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 */
export async function loader({ params }: Route.LoaderArgs) {
  if (!params.fieldId) {
    return { concepts: [] };
  }
  const concepts = getConceptsByFieldStatic(params.fieldId);
  return { concepts };
}

export default function FieldPage() {
  const loaderData = useLoaderData<typeof loader>();
  const concepts = loaderData?.concepts || [];
  const params = useParams<{ fieldId: string }>();
  const { locale, t, localePath } = useI18n();

  const field = getFieldById(params.fieldId ?? '');
  const subfields = getSubfieldsByParent(params.fieldId || '');

  if (!field) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('fieldNotFound')}
          </h1>
          <Link to={localePath('/browse')} className="btn btn-primary">
            {t('backToList')}
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <nav className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
        <Link to={localePath('/')} className="hover:underline">
          {t('home')}
        </Link>
        <span className="mx-2">/</span>
        <Link to={localePath('/browse')} className="hover:underline">
          {t('browse')}
        </Link>
        <span className="mx-2">/</span>
        <span style={{ color: 'var(--text-primary)' }}>{field.name[locale] || field.name.en}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{field.icon}</span>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {field.name[locale] || field.name.en}
          </h1>
        </div>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          {field.description[locale] || field.description.en}
        </p>
      </header>

      {/* Subfields */}
      <section>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('subfields')}
        </h2>

        {subfields.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subfields.map((subfield) => (
              <Link
                key={subfield.id}
                to={localePath(`/field/${field.id}/${subfield.id}`)}
                className="card hover:scale-[1.01] transition-transform"
              >
                <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  {subfield.name[locale] || subfield.name.en}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {subfield.description[locale] || subfield.description.en}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-tertiary)' }}>{t('noSubfields')}</p>
        )}
      </section>

      {/* Concepts in this field */}
      {concepts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('concepts')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {concepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
