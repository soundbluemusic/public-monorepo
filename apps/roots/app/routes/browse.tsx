import { Layout } from '@/components/layout/Layout';
import { fields } from '@/data/fields';
import { getSubfieldsByParent } from '@/data/subfields';
import { useI18n } from '@/i18n';
/**
 * @fileoverview 전체 분야 목록 페이지
 */
import { Link } from 'react-router';
import type { MetaFunction } from 'react-router';

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
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        {t('browseByField')}
      </h1>

      <div className="space-y-8">
        {fields.map((field) => {
          const subfields = getSubfieldsByParent(field.id);
          return (
            <section key={field.id}>
              <Link
                to={localePath(`/field/${field.id}`)}
                className="flex items-center gap-3 mb-4 group"
              >
                <span className="text-2xl">{field.icon}</span>
                <h2
                  className="text-xl font-semibold group-hover:underline"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {field.name[locale] || field.name.en}
                </h2>
              </Link>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {field.description[locale] || field.description.en}
              </p>

              {subfields.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {subfields.map((subfield) => (
                    <Link
                      key={subfield.id}
                      to={localePath(`/field/${field.id}/${subfield.id}`)}
                      className="px-3 py-1.5 text-sm rounded-lg transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                      }}
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
