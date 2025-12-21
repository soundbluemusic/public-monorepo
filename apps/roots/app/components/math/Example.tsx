import { DifficultyStars } from '@/components/ui/DifficultyBadge';
import type { DifficultyLevel, Example as ExampleType } from '@/data/types';
import { useI18n } from '@/i18n';
import { useState } from 'react';
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
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
      }}
    >
      {/* 예제 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
          {t('exampleNumber')} {index + 1}
        </span>
        {example.difficulty && <DifficultyStars level={example.difficulty as DifficultyLevel} />}
      </div>

      {/* 문제 */}
      <div className="mb-3">
        <p style={{ color: 'var(--text-primary)' }}>{example.problem}</p>
        {example.latex && (
          <div className="mt-2">
            <LaTeX math={example.latex} display />
          </div>
        )}
      </div>

      {/* 풀이 토글 버튼 */}
      <button
        type="button"
        onClick={() => setShowSolution(!showSolution)}
        className="text-sm font-medium transition-colors"
        style={{ color: 'var(--accent-primary)' }}
      >
        {showSolution ? `▼ ${t('hideSolution')}` : `▶ ${t('showSolution')}`}
      </button>

      {/* 풀이 */}
      {showSolution && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-primary)' }}>
          <p className="whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
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
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
      }}
    >
      <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
        {t('exampleNumber')} {index + 1}
      </span>
      <p className="mt-2" style={{ color: 'var(--text-primary)' }}>
        {example}
      </p>
    </div>
  );
}

/**
 * 예제 목록 컴포넌트
 */
export function ExampleList({ examples, title }: { examples?: ExampleInput[]; title?: string }) {
  return (
    <div className="space-y-4">
      {title && (
        <h3
          className="text-lg font-semibold flex items-center gap-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <span>✏️</span>
          {title}
        </h3>
      )}
      <div className="space-y-3">
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
