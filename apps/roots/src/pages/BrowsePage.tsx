import { Layout } from '@/components/layout/Layout';
import { fields } from '@/data/fields';
import { getSubfieldsByParent } from '@/data/subfields';
import { useI18n } from '@/i18n';
import { Meta, Title } from '@solidjs/meta';
import { A } from '@solidjs/router';
/**
 * @fileoverview 전체 분야 목록 페이지
 */
import { For } from 'solid-js';

export default function BrowsePage() {
  const { locale, t, localePath } = useI18n();

  return (
    <Layout>
      <Title>{t('browse')} - Suri</Title>
      <Meta name="description" content={t('browseByField')} />

      <h1 class="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        {t('browseByField')}
      </h1>

      <div class="space-y-8">
        <For each={fields}>
          {(field) => {
            const subfields = getSubfieldsByParent(field.id);
            return (
              <section>
                <A
                  href={localePath(`/field/${field.id}`)}
                  class="flex items-center gap-3 mb-4 group"
                >
                  <span class="text-2xl">{field.icon}</span>
                  <h2
                    class="text-xl font-semibold group-hover:underline"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {field.name[locale()] || field.name.en}
                  </h2>
                </A>
                <p class="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {field.description[locale()] || field.description.en}
                </p>

                {subfields.length > 0 && (
                  <div class="flex flex-wrap gap-2">
                    <For each={subfields}>
                      {(subfield) => (
                        <A
                          href={localePath(`/field/${field.id}/${subfield.id}`)}
                          class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                          style={{
                            'background-color': 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {subfield.name[locale()] || subfield.name.en}
                        </A>
                      )}
                    </For>
                  </div>
                )}
              </section>
            );
          }}
        </For>
      </div>
    </Layout>
  );
}
