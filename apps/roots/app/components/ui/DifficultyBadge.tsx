import type { DifficultyLevel } from '@/data/types';
import { useI18n } from '@/i18n';
import styles from '../../styles/pages.module.scss';

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

const labels: Record<number, string> = {
  1: 'elementary',
  2: 'middleSchool',
  3: 'highSchool',
  4: 'undergraduate',
  5: 'graduate',
};

export function DifficultyBadge({ level, showLabel = true, size = 'md' }: DifficultyBadgeProps) {
  const { t } = useI18n();

  const sizeStyles = {
    sm: { fontSize: '0.75rem', padding: '0.125rem 0.375rem' },
    md: { fontSize: '0.875rem', padding: '0.25rem 0.5rem' },
  };

  return (
    <span
      className={styles.difficultyBadge}
      style={{
        backgroundColor: `color-mix(in srgb, ${difficultyColors[level]} 15%, transparent)`,
        color: difficultyColors[level],
        borderRadius: '9999px',
        fontWeight: 500,
        ...sizeStyles[size],
      }}
    >
      <span className={styles.flexCenter} style={{ gap: '0.125rem' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={`star-${i}`}
            style={{
              width: '0.375rem',
              height: '0.375rem',
              borderRadius: '9999px',
              backgroundColor: difficultyColors[level],
              opacity: i < level ? 1 : 0.3,
            }}
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
    <span className={styles.flexCenter} style={{ gap: '0.125rem' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={`star-${i}`}
          style={{
            width: '0.375rem',
            height: '0.375rem',
            borderRadius: '9999px',
            backgroundColor: difficultyColors[level],
            opacity: i < level ? 1 : 0.3,
          }}
        />
      ))}
    </span>
  );
}
