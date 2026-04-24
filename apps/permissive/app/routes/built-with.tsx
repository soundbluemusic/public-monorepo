import { getOpenSourceGrouped } from '@soundblue/core';
import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { APP_CONFIG } from '../config';
import { builtWithMeta } from '../routes-meta';

export const Route = createFileRoute('/built-with')({
  head: headFactoryEn(builtWithMeta, APP_CONFIG.baseUrl),
  component: BuiltWithPage,
});

function BuiltWithPage() {
  const _locale = 'en';
  const groups = getOpenSourceGrouped();

  return (
    <DocsLayout>
      <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-8">Open source</h1>

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="text-sm font-medium text-(--text-tertiary) mb-2">{group.label.en}</h2>
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
