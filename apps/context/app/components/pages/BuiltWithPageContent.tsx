/**
 * @fileoverview 오픈소스 페이지 공유 컴포넌트
 *
 * 영어/한국어 라우트 파일에서 공통으로 사용하는 UI 컴포넌트입니다.
 * useI18n()을 통해 locale에 따라 자동으로 번역된 텍스트를 표시합니다.
 */

import { getOpenSourceGrouped } from '@soundblue/core';
import { Layout } from '@/components/layout';
import { useI18n } from '@/i18n';

export const builtWithMeta = {
  ko: {
    title: '오픈소스 - Context',
    description: '이 프로젝트에서 사용된 오픈소스 라이브러리',
  },
  en: {
    title: 'Open Source - Context',
    description: 'Open source libraries used in this project',
  },
};

export function BuiltWithPageContent() {
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
                  <span className="text-(--text-tertiary)">&rsaquo;</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
}
