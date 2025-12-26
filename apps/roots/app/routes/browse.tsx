import { Layout } from '@/components/layout/Layout';
import { fields } from '@/data/fields';
import { getSubfieldsByParent } from '@/data/subfields';
import { useI18n } from '@/i18n';
/**
 * @fileoverview 전체 분야 목록 페이지
 */
import { Link } from 'react-router';
import type { MetaFunction } from 'react-router';
import styles from '../styles/pages.module.scss';

export const meta: MetaFunction = ({ location }) => {
  const locale = location.pathname.startsWith('/ko') ? 'ko' : 'en';
  const title = locale === 'ko' ? '찾아보기 - 수리' : 'Browse - Roots';
  const description =
    locale === 'ko' ? '분야별로 수학 개념 찾아보기' : 'Browse math concepts by field';
  return [{ title }, { name: 'description', content: description }];
};

export default function BrowsePage() {
  const { locale, t, localePath } = useI18n();

  return (
    <Layout>
      <h1 className={styles.browseTitle}>{t('browseByField')}</h1>

      <div className={styles.spaceY8}>
        {fields.map((field) => {
          const subfields = getSubfieldsByParent(field.id);
          return (
            <section key={field.id} className={styles.browseSection}>
              <Link to={localePath(`/field/${field.id}`)} className={styles.browseSectionHeader}>
                <span className={styles.browseSectionIcon}>{field.icon}</span>
                <h2 className={styles.browseSectionTitle}>{field.name[locale] || field.name.en}</h2>
              </Link>
              <p className={styles.browseSectionDesc}>
                {field.description[locale] || field.description.en}
              </p>

              {subfields.length > 0 && (
                <div className={styles.subfieldTags}>
                  {subfields.map((subfield) => (
                    <Link
                      key={subfield.id}
                      to={localePath(`/field/${field.id}/${subfield.id}`)}
                      className={styles.subfieldTag}
                    >
                      {subfield.name[locale] || subfield.name.en}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </Layout>
  );
}
