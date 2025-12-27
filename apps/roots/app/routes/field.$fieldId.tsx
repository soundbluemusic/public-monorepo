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

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 */
export async function loader({ params }: { params: { fieldId: string } }) {
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
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-(--text-primary) mb-4">{t('fieldNotFound')}</h1>
          <Link
            to={localePath('/browse')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
          >
            {t('backToList')}
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link
          to={localePath('/')}
          className="text-(--text-secondary) no-underline hover:text-(--text-primary)"
        >
          {t('home')}
        </Link>
        <span className="text-(--text-tertiary)">/</span>
        <Link
          to={localePath('/browse')}
          className="text-(--text-secondary) no-underline hover:text-(--text-primary)"
        >
          {t('browse')}
        </Link>
        <span className="text-(--text-tertiary)">/</span>
        <span className="text-(--text-primary)">{field.name[locale] || field.name.en}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-(--text-primary) mb-2 flex items-center gap-3">
          <span className="text-4xl">{field.icon}</span>
          {field.name[locale] || field.name.en}
        </h1>
        <p className="text-lg text-(--text-secondary)">
          {field.description[locale] || field.description.en}
        </p>
      </header>

      {/* Subfields */}
      <section>
        <h2 className="text-xl font-semibold text-(--text-primary) mb-4">{t('subfields')}</h2>

        {subfields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subfields.map((subfield) => (
              <Link
                key={subfield.id}
                to={localePath(`/field/${field.id}/${subfield.id}`)}
                className="block p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-(--border-focus)"
              >
                <h3 className="text-base font-medium text-(--text-primary) mb-1">
                  {subfield.name[locale] || subfield.name.en}
                </h3>
                <p className="text-sm text-(--text-secondary)">
                  {subfield.description[locale] || subfield.description.en}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-(--text-tertiary)">{t('noSubfields')}</p>
        )}
      </section>

      {/* Concepts in this field */}
      {concepts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-(--text-primary) mb-4">{t('concepts')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {concepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
