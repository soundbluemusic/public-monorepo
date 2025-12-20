/**
 * @fileoverview 분야 상세 페이지
 */
import { ConceptCard } from '@/components/concept/ConceptCard';
import { Layout } from '@/components/layout/Layout';
import { getFieldById } from '@/data/fields';
import { getSubfieldsByParent } from '@/data/subfields';
import type { MathConcept, MathField } from '@/data/types';
import { useI18n } from '@/i18n';
import { getConceptsByField } from '@/lib/concepts';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

export default function FieldPage() {
  const params = useParams<{ fieldId: string }>();
  const { locale, t, localePath } = useI18n();

  const field = getFieldById(params.fieldId as MathField);
  const subfields = getSubfieldsByParent(params.fieldId || '');

  const [concepts, setConcepts] = useState<MathConcept[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 개념 데이터 비동기 로드
  useEffect(() => {
    if (params.fieldId) {
      getConceptsByField(params.fieldId).then((data) => {
        setConcepts(data);
        setIsLoading(false);
      });
    }
  }, [params.fieldId]);

  if (!field) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Field not found
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
          {locale === 'ko' ? '세부 분야' : 'Subfields'}
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
          <p style={{ color: 'var(--text-tertiary)' }}>
            {locale === 'ko' ? '아직 세부 분야가 없습니다.' : 'No subfields available yet.'}
          </p>
        )}
      </section>

      {/* Concepts in this field */}
      {!isLoading && concepts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {locale === 'ko' ? '개념 목록' : 'Concepts'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {concepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </section>
      )}

      {/* Loading */}
      {isLoading && (
        <section className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-xl animate-pulse"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
