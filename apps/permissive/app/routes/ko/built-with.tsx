import { getOpenSourceGrouped } from '@soundblue/core';
import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import DocsLayout from '../../components/layout/DocsLayout';

const localizedMeta = {
  ko: {
    title: '오픈소스 - Permissive',
    description: '이 사이트를 만드는 데 사용된 오픈소스 프로젝트 목록',
  },
  en: {
    title: 'Open source - Permissive',
    description: 'Open source projects used to build this site',
  },
};

export const Route = createFileRoute('/ko/built-with')({
  head: headFactoryKo(localizedMeta, 'https://permissive.soundbluemusic.com'),
  component: BuiltWithPageKo,
});

function BuiltWithPageKo() {
  const _locale = 'ko';
  const groups = getOpenSourceGrouped();

  return (
    <DocsLayout>
      <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-8">오픈소스</h1>

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="text-sm font-medium text-(--text-tertiary) mb-2">{group.label.ko}</h2>
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
    </DocsLayout>
  );
}
