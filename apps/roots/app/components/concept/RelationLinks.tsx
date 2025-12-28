/**
 * @fileoverview 연관 문서 링크 컴포넌트
 * 빌드 시 loader에서 전달받은 concept names 사용 (SSG 최적화)
 */

import { Link2 } from 'lucide-react';
import { Link } from 'react-router';
import type { ConceptRelations } from '@/data/types';
import { useI18n } from '@/i18n';

export type ConceptNames = Record<string, { ko: string; en: string }>;

interface RelationLinksProps {
  relations: ConceptRelations;
  /** Concept names loaded at build time from loader */
  names: ConceptNames;
}

interface RelationSectionProps {
  title: string;
  icon: string;
  ids: string[];
  type: 'prerequisite' | 'next' | 'related' | 'application';
  names: ConceptNames;
}

const typeConfig: Record<RelationSectionProps['type'], { prefix: string; prefixClass: string }> = {
  prerequisite: { prefix: '→', prefixClass: 'text-(--color-warning)' },
  next: { prefix: '←', prefixClass: 'text-(--color-success)' },
  related: { prefix: '↔', prefixClass: 'text-(--accent-primary)' },
  application: { prefix: '◆', prefixClass: 'text-(--accent-tertiary)' },
};

function RelationSection({ title, icon, ids, type, names }: RelationSectionProps) {
  const { locale, localePath } = useI18n();

  const config = typeConfig[type];

  if (ids.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-(--text-tertiary) mb-2 uppercase tracking-wider">
        <span>{icon}</span>
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {ids.map((id) => {
          const conceptName = names[id];
          const name = conceptName ? conceptName[locale] || conceptName.en : id;

          return (
            <Link
              key={id}
              to={localePath(`/concept/${id}`)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm bg-(--bg-tertiary) text-(--text-secondary) no-underline transition-all hover:bg-(--bg-secondary) hover:text-(--accent-primary)"
            >
              <span className={config.prefixClass}>{config.prefix}</span>
              <span>{name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 연관 문서 링크 섹션
 * 빌드 시 loader에서 전달받은 names 사용 (SSG 최적화)
 */
export function RelationLinks({ relations, names }: RelationLinksProps) {
  const { t } = useI18n();

  const hasAnyRelations =
    relations.prerequisites.length > 0 ||
    relations.nextTopics.length > 0 ||
    relations.related.length > 0 ||
    (relations.applications?.length ?? 0) > 0;

  if (!hasAnyRelations) return null;

  return (
    <div className="p-4 rounded-lg bg-(--bg-secondary) border border-(--border-primary)">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-(--text-primary) mb-4">
        <Link2 size={20} aria-hidden="true" />
        {t('relatedDocuments')}
      </h3>

      <RelationSection
        title={t('prerequisites')}
        icon="→"
        ids={relations.prerequisites}
        type="prerequisite"
        names={names}
      />

      <RelationSection
        title={t('nextTopics')}
        icon="←"
        ids={relations.nextTopics}
        type="next"
        names={names}
      />

      <RelationSection
        title={t('related')}
        icon="↔"
        ids={relations.related}
        type="related"
        names={names}
      />

      <RelationSection
        title={t('appliedIn')}
        icon="◆"
        ids={relations.applications ?? []}
        type="application"
        names={names}
      />
    </div>
  );
}
