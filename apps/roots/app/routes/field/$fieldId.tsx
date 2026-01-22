/**
 * @fileoverview 분야 상세 페이지 (영어)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { type BreadcrumbItem, generateBreadcrumbSchema } from '@soundblue/seo/structured-data';
import { useAutoAnimate } from '@soundblue/ui/hooks';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ConceptCard } from '../../components/concept/ConceptCard';
import { Layout } from '../../components/layout/Layout';
import { APP_CONFIG } from '../../config';
import { getConceptsByField as getConceptsByFieldStatic } from '../../data/concepts/index';
import { getFieldById } from '../../data/fields';
import { getSubfieldsByParent } from '../../data/subfields';
import type { MathConcept, MathFieldInfo } from '../../data/types';
import { useI18n } from '../../i18n';

type LoaderData = { concepts: MathConcept[]; field: MathFieldInfo | null };

export const Route = createFileRoute('/field/$fieldId')({
  loader: async ({ params }) => {
    if (!params.fieldId) {
      return { concepts: [], field: null };
    }
    const concepts = getConceptsByFieldStatic(params.fieldId);
    const field = getFieldById(params.fieldId);
    return { concepts, field: field || null };
  },
  head: dynamicHeadFactoryEn<LoaderData>(
    (data) => {
      if (!data?.field) {
        return {
          ko: { title: '분야를 찾을 수 없습니다 | Roots' },
          en: { title: 'Field Not Found | Roots' },
        };
      }
      const { field } = data;
      const nameKo = field.name.ko || field.name.en;
      const nameEn = field.name.en;
      const descKo = field.description?.ko || `${nameKo} 분야의 수학 개념`;
      const descEn = field.description?.en || `Math concepts in ${nameEn}`;
      return {
        ko: {
          title: `${nameKo} | Roots`,
          description: descKo,
          keywords: [nameKo, `${nameKo} 수학`, '수학 분야', '수학 개념', '수학 공식'],
        },
        en: {
          title: `${nameEn} | Roots`,
          description: descEn,
          keywords: [nameEn, `${nameEn} math`, 'math field', 'math concepts', 'math formulas'],
        },
      };
    },
    'https://roots.soundbluemusic.com',
    (data) => `/field/${data.field?.id ?? ''}`,
  ),
  component: FieldPage,
});

function FieldPage() {
  const loaderData = Route.useLoaderData();
  const concepts = loaderData?.concepts || [];
  const params = Route.useParams();
  const { locale, t, localePath } = useI18n();

  const field = getFieldById(params.fieldId ?? '');
  const subfields = getSubfieldsByParent(params.fieldId || '');

  // Auto-animate for subfields and concepts grids
  const [subfieldsRef] = useAutoAnimate<HTMLDivElement>();
  const [conceptsRef] = useAutoAnimate<HTMLDivElement>();

  // JSON-LD 구조화 데이터
  const { baseUrl } = APP_CONFIG;
  const localePrefix = locale === 'ko' ? '/ko' : '';

  if (!field) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-(--text-primary) mb-4">{t('fieldNotFound')}</h1>
          <Link
            to={localePath('/browse')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-bg) text-white hover:brightness-110 active:scale-[0.98]"
          >
            {t('backToList')}
          </Link>
        </div>
      </Layout>
    );
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: locale === 'ko' ? '홈' : 'Home', url: `${baseUrl}${localePrefix}` },
    { name: locale === 'ko' ? '탐색' : 'Browse', url: `${baseUrl}${localePrefix}/browse` },
    {
      name: field.name[locale] || field.name.en,
      url: `${baseUrl}${localePrefix}/field/${field.id}`,
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <Layout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
          <div ref={subfieldsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subfields.map((subfield) => (
              <div
                key={subfield.id}
                className="block p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)"
              >
                <h3 className="text-base font-medium text-(--text-primary) mb-1">
                  {subfield.name[locale] || subfield.name.en}
                </h3>
                <p className="text-sm text-(--text-secondary)">
                  {subfield.description[locale] || subfield.description.en}
                </p>
              </div>
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
          <div ref={conceptsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {concepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
