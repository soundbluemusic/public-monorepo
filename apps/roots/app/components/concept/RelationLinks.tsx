/**
 * @fileoverview 연관 문서 링크 컴포넌트
 * 클라이언트 사이드에서 concept-names.json을 fetch하여 이름 표시
 */
import type { ConceptRelations } from '@/data/types';
import { useI18n } from '@/i18n';
import { Link2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import styles from '../../styles/app.module.scss';

type ConceptNames = Record<string, { ko: string; en: string }>;

interface RelationLinksProps {
  relations: ConceptRelations;
}

interface RelationSectionProps {
  title: string;
  icon: string;
  ids: string[];
  type: 'prerequisite' | 'next' | 'related' | 'application';
  names: ConceptNames;
}

const typeConfig: Record<RelationSectionProps['type'], { prefix: string; prefixClass: string }> = {
  prerequisite: { prefix: '→', prefixClass: styles.relationPrefixPrerequisite },
  next: { prefix: '←', prefixClass: styles.relationPrefixNext },
  related: { prefix: '↔', prefixClass: styles.relationPrefixRelated },
  application: { prefix: '◆', prefixClass: styles.relationPrefixApplication },
};

function RelationSection({ title, icon, ids, type, names }: RelationSectionProps) {
  const { locale, localePath } = useI18n();

  const config = typeConfig[type];

  if (ids.length === 0) return null;

  return (
    <div className={styles.relationSection}>
      <h4 className={styles.relationTitle}>
        <span>{icon}</span>
        {title}
      </h4>
      <div className={styles.relationLinks}>
        {ids.map((id) => {
          const conceptName = names[id];
          const name = conceptName ? conceptName[locale] || conceptName.en : id;

          return (
            <Link key={id} to={localePath(`/concept/${id}`)} className={styles.relationLink}>
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
 * 클라이언트 사이드에서 이름을 로드하여 hydration 데이터 최소화
 */
export function RelationLinks({ relations }: RelationLinksProps) {
  const { t } = useI18n();
  const [names, setNames] = useState<ConceptNames>({});

  // 클라이언트에서만 이름 로드
  useEffect(() => {
    fetch('/concept-names.json')
      .then((res) => res.json())
      .then(setNames)
      .catch(() => setNames({}));
  }, []);

  const hasAnyRelations =
    relations.prerequisites.length > 0 ||
    relations.nextTopics.length > 0 ||
    relations.related.length > 0 ||
    (relations.applications?.length ?? 0) > 0;

  if (!hasAnyRelations) return null;

  return (
    <div className={styles.historyCard}>
      <h3 className={styles.sectionTitle}>
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
