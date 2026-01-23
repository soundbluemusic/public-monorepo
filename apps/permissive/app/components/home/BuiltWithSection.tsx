import { OPEN_SOURCE_PROJECTS } from '@soundblue/core';
import { Link } from '@tanstack/react-router';

interface BuiltWithSectionProps {
  locale: 'en' | 'ko';
}

// 홈페이지에 표시할 주요 도구 (카테고리: framework, build, styling)
// Set으로 O(1) lookup 성능 확보
const FEATURED_TOOLS = new Set(['React', 'React Router', 'TypeScript', 'Vite', 'Tailwind CSS']);

export function BuiltWithSection({ locale }: BuiltWithSectionProps) {
  const featuredProjects = OPEN_SOURCE_PROJECTS.filter((p) => FEATURED_TOOLS.has(p.name));
  const totalCount = OPEN_SOURCE_PROJECTS.length;

  return (
    <div className="py-8 text-center border-t border-(--border-primary)">
      <p className="text-sm text-(--text-tertiary) mb-3">
        {locale === 'ko' ? '사용된 오픈소스' : 'Open source'}
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {featuredProjects.map((project) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-full bg-(--bg-tertiary) text-(--text-secondary) text-xs hover:bg-(--accent-primary) hover:text-white transition-colors"
          >
            {project.name}
          </a>
        ))}
      </div>
      <Link
        to={locale === 'ko' ? '/ko/built-with' : '/built-with'}
        className="text-sm text-(--accent-primary) hover:underline"
      >
        {locale === 'ko'
          ? `+${totalCount - featuredProjects.length}개 더 보기`
          : `+${totalCount - featuredProjects.length} more`}
      </Link>
    </div>
  );
}
