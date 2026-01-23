/**
 * @fileoverview 오픈소스 페이지 - 한국어 버전 (TanStack Start)
 */

import { getOpenSourceGrouped } from '@soundblue/core';
import { headFactory } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import { useI18n } from '@/i18n';

export const Route = createFileRoute('/ko/built-with')({
  // @ts-expect-error - TanStack Start head function type incompatibility
  head: headFactory(
    {
      ko: {
        title: '오픈소스 - Context',
        description: '이 프로젝트에서 사용된 오픈소스 라이브러리',
      },
      en: {
        title: 'Open Source - Context',
        description: 'Open source libraries used in this project',
      },
    },
    APP_CONFIG.baseUrl,
  ),
  component: BuiltWithPage,
});

function BuiltWithPage() {
  const { locale } = useI18n();
  const groups = getOpenSourceGrouped();

  return (
    <Layout>
      <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-8">
        {locale === 'ko' ? '오픈소스' : 'Open Source'}
      </h1>

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="text-sm font-medium text-(--text-tertiary) mb-2">
              {locale === 'ko' ? group.label.ko : group.label.en}
            </h2>
            <div className="divide-y divide-(--border-primary) border-y border-(--border-primary)">
              {group.projects.map((project) => (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 px-1 hover:bg-(--bg-secondary) transition-colors"
                >
                  <span className="font-medium text-(--text-primary)">{project.name}</span>
                  <span className="text-(--text-tertiary)">›</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
}
