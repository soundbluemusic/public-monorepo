import { cn } from '@soundblue/ui/utils';
import { memo } from 'react';
import type { DifficultyLevel } from '@/data/types';
import { type MessageKey, useI18n } from '@/i18n';

interface DifficultyBadgeProps {
  level: 1 | 2 | 3 | 4 | 5;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const labels: Record<1 | 2 | 3 | 4 | 5, MessageKey> = {
  1: 'elementary',
  2: 'middleSchool',
  3: 'highSchool',
  4: 'undergraduate',
  5: 'graduate',
};

const levelColors: Record<number, string> = {
  1: 'bg-[color-mix(in_srgb,var(--difficulty-1)_15%,transparent)] text-(--difficulty-1)',
  2: 'bg-[color-mix(in_srgb,var(--difficulty-2)_15%,transparent)] text-(--difficulty-2)',
  3: 'bg-[color-mix(in_srgb,var(--difficulty-3)_15%,transparent)] text-(--difficulty-3)',
  4: 'bg-[color-mix(in_srgb,var(--difficulty-4)_15%,transparent)] text-(--difficulty-4)',
  5: 'bg-[color-mix(in_srgb,var(--difficulty-5)_15%,transparent)] text-(--difficulty-5)',
};

// Pre-computed star indices to avoid array recreation
const STAR_INDICES = [0, 1, 2, 3, 4] as const;

/**
 * 난이도 별표 컴포넌트 (공통 추출)
 */
export const DifficultyStars = memo(function DifficultyStars({
  level,
}: {
  level: DifficultyLevel;
}) {
  return (
    <span className="flex items-center gap-0.5">
      {STAR_INDICES.map((i) => (
        <span
          key={i}
          className={cn('w-1.5 h-1.5 rounded-full bg-current', i >= level && 'opacity-30')}
        />
      ))}
    </span>
  );
});

export const DifficultyBadge = memo(function DifficultyBadge({
  level,
  showLabel = true,
  size = 'md',
}: DifficultyBadgeProps) {
  const { t } = useI18n();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        levelColors[level],
        size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1',
      )}
    >
      <DifficultyStars level={level} />
      {showLabel && <span>{t(labels[level])}</span>}
    </span>
  );
});
