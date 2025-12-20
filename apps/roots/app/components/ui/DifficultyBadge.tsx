import type { DifficultyLevel } from '@/data/types';
import type { UILabels } from '@/i18n';
import { useI18n } from '@/i18n';

interface DifficultyBadgeProps {
  level: 1 | 2 | 3 | 4 | 5;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const difficultyColors: Record<number, string> = {
  1: 'var(--difficulty-1)',
  2: 'var(--difficulty-2)',
  3: 'var(--difficulty-3)',
  4: 'var(--difficulty-4)',
  5: 'var(--difficulty-5)',
};

const labels: Record<number, keyof UILabels> = {
  1: 'elementary',
  2: 'middleSchool',
  3: 'highSchool',
  4: 'undergraduate',
  5: 'graduate',
};

export function DifficultyBadge({ level, showLabel = true, size = 'md' }: DifficultyBadgeProps) {
  const { t } = useI18n();

  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses}`}
      style={{
        backgroundColor: `color-mix(in srgb, ${difficultyColors[level]} 15%, transparent)`,
        color: difficultyColors[level],
      }}
    >
      <span className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={`star-${i}`}
            className={`w-1.5 h-1.5 rounded-full ${i < level ? '' : 'opacity-30'}`}
            style={{ backgroundColor: difficultyColors[level] }}
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
    <span className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={`star-${i}`}
          className={`w-1.5 h-1.5 rounded-full ${i < level ? '' : 'opacity-30'}`}
          style={{ backgroundColor: difficultyColors[level] }}
        />
      ))}
    </span>
  );
}
