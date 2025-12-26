import type { DifficultyLevel } from '@/data/types';
import { useI18n } from '@/i18n';
import styles from '../../styles/app.module.scss';

interface DifficultyBadgeProps {
  level: 1 | 2 | 3 | 4 | 5;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const labels: Record<number, string> = {
  1: 'elementary',
  2: 'middleSchool',
  3: 'highSchool',
  4: 'undergraduate',
  5: 'graduate',
};

const levelClasses: Record<number, string> = {
  1: styles.difficultyLevel1,
  2: styles.difficultyLevel2,
  3: styles.difficultyLevel3,
  4: styles.difficultyLevel4,
  5: styles.difficultyLevel5,
};

const sizeClasses: Record<string, string> = {
  sm: styles.difficultyBadgeSm,
  md: styles.difficultyBadgeMd,
};

export function DifficultyBadge({ level, showLabel = true, size = 'md' }: DifficultyBadgeProps) {
  const { t } = useI18n();

  return (
    <span className={`${styles.difficultyBadge} ${sizeClasses[size]} ${levelClasses[level]}`}>
      <span className={styles.difficultyStars}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={`star-${i}`}
            className={`${styles.difficultyDot} ${i >= level ? styles.difficultyDotInactive : ''}`}
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
    <span className={styles.difficultyStars}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={`star-${i}`}
          className={`${styles.difficultyDot} ${i >= level ? styles.difficultyDotInactive : ''}`}
        />
      ))}
    </span>
  );
}
