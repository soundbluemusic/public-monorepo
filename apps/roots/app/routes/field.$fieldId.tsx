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
import styles from '../styles/app.module.scss';

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
        <div className={styles.notFoundContainer}>
          <h1 className={styles.notFoundTitle}>{t('fieldNotFound')}</h1>
          <Link to={localePath('/browse')} className={styles.btnPrimary}>
            {t('backToList')}
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link to={localePath('/')} className={styles.breadcrumbLink}>
          {t('home')}
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link to={localePath('/browse')} className={styles.breadcrumbLink}>
          {t('browse')}
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.textPrimary}>{field.name[locale] || field.name.en}</span>
      </nav>

      {/* Header */}
      <header className={styles.fieldHeader}>
        <h1 className={styles.fieldTitle}>
          <span className={styles.fieldTitleIcon}>{field.icon}</span>
          {field.name[locale] || field.name.en}
        </h1>
        <p className={styles.fieldDescription}>
          {field.description[locale] || field.description.en}
        </p>
      </header>

      {/* Subfields */}
      <section>
        <h2 className={styles.sectionTitle}>{t('subfields')}</h2>

        {subfields.length > 0 ? (
          <div className={styles.grid2}>
            {subfields.map((subfield) => (
              <Link
                key={subfield.id}
                to={localePath(`/field/${field.id}/${subfield.id}`)}
                className={styles.conceptCard}
              >
                <h3 className={styles.conceptCardTitle}>
                  {subfield.name[locale] || subfield.name.en}
                </h3>
                <p className={styles.conceptCardDescription}>
                  {subfield.description[locale] || subfield.description.en}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.textTertiary}>{t('noSubfields')}</p>
        )}
      </section>

      {/* Concepts in this field */}
      {concepts.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('concepts')}</h2>
          <div className={styles.grid3}>
            {concepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
