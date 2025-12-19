import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { getFieldById } from '@/data/fields';
import type { MathConcept } from '@/data/types';
import { useI18n } from '@/i18n';
/**
 * @fileoverview 개념 미리보기 카드 컴포넌트
 */
import { A } from '@solidjs/router';

interface ConceptCardProps {
  concept: MathConcept;
}

/**
 * 개념을 카드 형태로 미리보기
 */
export function ConceptCard(props: ConceptCardProps) {
  const { locale, localePath } = useI18n();

  const field = () => getFieldById(props.concept.field);
  const name = () => props.concept.name[locale()] || props.concept.name.en;
  const definition = () => {
    const content = props.concept.content[locale()] || props.concept.content.en;
    return content.definition;
  };

  return (
    <A
      href={localePath(`/concept/${props.concept.id}`)}
      class="card card-field hover:scale-[1.01] transition-transform block"
      style={{ '--field-color': field()?.color || 'var(--accent-primary)' }}
    >
      {/* 헤더 */}
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {name()}
        </h3>
        <DifficultyBadge level={props.concept.difficulty} showLabel={false} size="sm" />
      </div>

      {/* 정의 */}
      <p class="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
        {definition()}
      </p>

      {/* 분야 태그 */}
      <div class="flex items-center gap-2">
        <span class="text-sm">{field()?.icon}</span>
        <span class="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {field()?.name[locale()] || field()?.name.en}
        </span>
      </div>
    </A>
  );
}

/**
 * 개념 카드 그리드
 */
export function ConceptGrid(props: { concepts: MathConcept[] }) {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {props.concepts.map((concept) => (
        <ConceptCard key={concept.id} concept={concept} />
      ))}
    </div>
  );
}
