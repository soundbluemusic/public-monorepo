import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { getFieldById } from '@/data/fields';
import type { MathConcept } from '@/data/types';
import { useI18n } from '@/i18n';
/**
 * @fileoverview 개념 미리보기 카드 컴포넌트
 */
import { Link } from 'react-router';
import styles from '../../styles/pages.module.scss';

interface ConceptCardProps {
  concept: MathConcept;
}

/**
 * 개념을 카드 형태로 미리보기
 */
export function ConceptCard({ concept }: ConceptCardProps) {
  const { locale, localePath } = useI18n();

  const field = getFieldById(concept.field);
  const name = concept.name[locale] || concept.name.en;
  const definition = (() => {
    const content = concept.content[locale] || concept.content.en;
    // content가 문자열이면 그대로, 객체면 definition 속성 반환
    return typeof content === 'string' ? content : content.definition;
  })();

  return (
    <Link to={localePath(`/concept/${concept.id}`)} className={styles.conceptCard}>
      {/* 헤더 */}
      <div className={styles.conceptCardHeader}>
        <h3 className={styles.conceptCardTitle}>{name}</h3>
        <DifficultyBadge level={concept.difficulty} showLabel={false} size="sm" />
      </div>

      {/* 정의 */}
      <p className={styles.conceptCardDescription}>{definition}</p>

      {/* 분야 태그 */}
      <div className={styles.conceptCardMeta}>
        <span>{field?.icon}</span>
        <span className={styles.conceptCardField}>{field?.name[locale] || field?.name.en}</span>
      </div>
    </Link>
  );
}

/**
 * 개념 카드 그리드
 */
export function ConceptGrid({ concepts }: { concepts: MathConcept[] }) {
  return (
    <div className={styles.grid3}>
      {concepts.map((concept) => (
        <ConceptCard key={concept.id} concept={concept} />
      ))}
    </div>
  );
}
