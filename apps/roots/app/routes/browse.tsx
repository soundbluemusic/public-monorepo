/**
 * @fileoverview 전체 분야 목록 페이지
 */

import { metaFactory } from '@soundblue/i18n';
import { Link } from 'react-router';
import { Layout } from '@/components/layout/Layout';
import { fields } from '@/data/fields';
import { getSubfieldsByParent } from '@/data/subfields';
import { useI18n } from '@/i18n';

export const meta = metaFactory({
  ko: { title: '찾아보기 - 수리', description: '분야별로 수학 개념 찾아보기' },
  en: { title: 'Browse - Roots', description: 'Browse math concepts by field' },
});

export default function BrowsePage() {
  const { locale, t, localePath } = useI18n();

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-(--text-primary) mb-8">{t('browseByField')}</h1>

      <div className="space-y-8">
        {fields.map((field) => {
          const subfields = getSubfieldsByParent(field.id);
          return (
            <section
              key={field.id}
              className="p-6 rounded-xl bg-(--bg-elevated) border border-(--border-primary)"
            >
              <Link
                to={localePath(`/field/${field.id}`)}
                className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity"
              >
                <span className="text-3xl">{field.icon}</span>
                <h2 className="text-xl font-semibold text-(--text-primary)">
                  {field.name[locale] || field.name.en}
                </h2>
              </Link>
              <p className="text-(--text-secondary) mt-2 mb-4">
                {field.description[locale] || field.description.en}
              </p>

              {subfields.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {subfields.map((subfield) => (
                    <Link
                      key={subfield.id}
                      to={localePath(`/field/${field.id}/${subfield.id}`)}
                      className="px-3 py-1.5 rounded-full text-sm bg-(--bg-tertiary) text-(--text-secondary) no-underline transition-colors hover:bg-(--bg-secondary) hover:text-(--text-primary)"
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
