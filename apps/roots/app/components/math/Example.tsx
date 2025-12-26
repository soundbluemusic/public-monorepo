import { DifficultyStars } from '@/components/ui/DifficultyBadge';
import type { DifficultyLevel, Example as ExampleType } from '@/data/types';
import { useI18n } from '@/i18n';
import { PencilLine } from 'lucide-react';
import { useState } from 'react';
import styles from '../../styles/app.module.scss';
/**
 * @fileoverview 예제 컴포넌트
 */
import { LaTeX } from './LaTeX';

/** 문자열 또는 Example 객체 */
type ExampleInput = string | ExampleType;

interface ExampleCardProps {
  example: ExampleType;
  index: number;
}

/**
 * 개별 예제 카드 컴포넌트
 */
export function ExampleCard({ example, index }: ExampleCardProps) {
  const { t } = useI18n();
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className={styles.exampleCard}>
      {/* 예제 헤더 */}
      <div className={styles.exampleHeader}>
        <span className={styles.exampleNumber}>
          {t('exampleNumber')} {index + 1}
        </span>
        {example.difficulty && <DifficultyStars level={example.difficulty as DifficultyLevel} />}
      </div>

      {/* 문제 */}
      <div className={styles.exampleProblemWrap}>
        <p className={styles.textPrimary}>{example.problem}</p>
        {example.latex && (
          <div className={styles.exampleLatex}>
            <LaTeX math={example.latex} display />
          </div>
        )}
      </div>

      {/* 풀이 토글 버튼 */}
      <button
        type="button"
        onClick={() => setShowSolution(!showSolution)}
        className={styles.solutionToggle}
      >
        {showSolution ? `▼ ${t('hideSolution')}` : `▶ ${t('showSolution')}`}
      </button>

      {/* 풀이 */}
      {showSolution && (
        <div className={`${styles.exampleSolution} ${styles.solutionContent}`}>
          <p className={`${styles.textSecondary} ${styles.exampleSolutionText}`}>
            {example.solution}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * 문자열 예제를 간단히 표시
 */
function SimpleExample({ example, index }: { example: string; index: number }) {
  const { t } = useI18n();
  return (
    <div className={styles.exampleCard}>
      <span className={styles.exampleNumber}>
        {t('exampleNumber')} {index + 1}
      </span>
      <p className={`${styles.textPrimary} ${styles.simpleExampleText}`}>{example}</p>
    </div>
  );
}

/**
 * 예제 목록 컴포넌트
 */
export function ExampleList({ examples, title }: { examples?: ExampleInput[]; title?: string }) {
  return (
    <div className={styles.spaceY4}>
      {title && (
        <h3 className={styles.sectionTitle}>
          <PencilLine size={20} aria-hidden="true" />
          {title}
        </h3>
      )}
      <div className={styles.spaceY3}>
        {(examples ?? []).map((example, index) =>
          typeof example === 'string' ? (
            <SimpleExample
              key={`example-${example.slice(0, 20)}`}
              example={example}
              index={index}
            />
          ) : (
            <ExampleCard
              key={`example-${example.problem.slice(0, 20)}`}
              example={example}
              index={index}
            />
          ),
        )}
      </div>
    </div>
  );
}
