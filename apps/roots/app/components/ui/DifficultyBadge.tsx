import type { DifficultyLevel } from '@/data/types';
import { useI18n } from '@/i18n';
import { cn } from '@soundblue/shared-react';

interface DifficultyBadgeProps {
  level: 1 | 2 | 3 | 4 | 5;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const labels: Record<1 | 2 | 3 | 4 | 5, string> = {
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

export function DifficultyBadge({ level, showLabel = true, size = 'md' }: DifficultyBadgeProps) {
  const { t } = useI18n();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        levelColors[level],
        size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1',
      )}
    >
      <span className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={`star-${i}`}
            className={cn('w-1.5 h-1.5 rounded-full bg-current', i >= level && 'opacity-30')}
          />
        ))}
      </span>
      {showLabel && <span>{t(labels[level])}</span>}
    </span>
  );
}

/**
 * 난이도 별표 컴포넌트 (예제 카드용)
 */
export function DifficultyStars({ level }: { level: DifficultyLevel }) {
  return (
    <span className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={`star-${i}`}
          className={cn('w-1.5 h-1.5 rounded-full bg-current', i >= level && 'opacity-30')}
        />
      ))}
    </span>
  );
}
