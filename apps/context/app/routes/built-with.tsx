import { getOpenSourceGrouped } from '@soundblue/core';
import { metaFactory } from '@soundblue/i18n';
import { Layout } from '@/components/layout';
import { useI18n } from '@/i18n';

export const meta = metaFactory(
  {
    ko: { title: '사용된 기술 - Context' },
    en: { title: 'Built With - Context' },
  },
  'https://context.soundbluemusic.com',
);

export default function BuiltWithPage() {
  const { t, locale } = useI18n();
  const groups = getOpenSourceGrouped();

  return (
    <Layout>
      <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-4">
        {t('builtWithTitle')}
      </h1>
      <p className="text-(--text-secondary) mb-8">{t('builtWithDescription')}</p>

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="text-lg font-semibold text-(--text-primary) mb-3 border-b border-(--border-primary) pb-2">
              {locale === 'ko' ? group.label.ko : group.label.en}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.projects.map((project) => (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-(--bg-secondary) hover:bg-(--bg-tertiary) transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-(--text-primary)">{project.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-(--bg-tertiary) text-(--text-tertiary)">
                      {project.license}
                    </span>
                  </div>
                  <p className="text-sm text-(--text-secondary)">
                    {locale === 'ko' ? project.description.ko : project.description.en}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-(--text-tertiary) text-center">
        {locale === 'ko'
          ? `총 ${groups.reduce((sum, g) => sum + g.projects.length, 0)}개의 오픈소스 프로젝트 사용`
          : `Using ${groups.reduce((sum, g) => sum + g.projects.length, 0)} open source projects`}
      </p>
    </Layout>
  );
}
