/**
 * @fileoverview 경량 개념 카드 컴포넌트 (browse 페이지용)
 */
import { memo, useMemo } from 'react';
import { Link } from 'react-router';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import type { LightConcept } from '@/data/concepts';
import { getFieldById } from '@/data/fields';
import { useI18n } from '@/i18n';

interface LightConceptCardProps {
  concept: LightConcept;
}

/**
 * 경량 개념 카드 (browse 페이지용)
 * MathConcept 대신 LightConcept 사용으로 메모리 절약
 */
export const LightConceptCard = memo(function LightConceptCard({ concept }: LightConceptCardProps) {
  const { locale, localePath } = useI18n();

  const field = useMemo(() => getFieldById(concept.field), [concept.field]);
  const name = concept.name[locale] || concept.name.en;
  const definition = concept.def[locale] || concept.def.en;

  return (
    <Link
      to={localePath(`/concept/${concept.id}`)}
      className="block p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-(--border-focus)"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-(--text-primary) truncate">{name}</h3>
        <DifficultyBadge level={concept.difficulty} showLabel={false} size="sm" />
      </div>

      {/* 정의 */}
      <p className="text-sm text-(--text-secondary) line-clamp-2 mb-2">{definition}</p>

      {/* 분야 태그 */}
      <div className="flex items-center gap-2 text-xs">
        <span>{field?.icon}</span>
        <span className="px-2 py-1 rounded bg-(--bg-tertiary) text-(--text-secondary)">
          {field?.name[locale] || field?.name.en}
        </span>
      </div>
    </Link>
  );
});
