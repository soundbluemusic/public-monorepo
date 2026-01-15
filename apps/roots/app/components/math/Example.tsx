import { PencilLine } from 'lucide-react';
import { useState } from 'react';
import { DifficultyStars } from '@/components/ui/DifficultyBadge';
import type { DifficultyLevel, Example as ExampleType } from '@/data/types';
import { useI18n } from '@/i18n';
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
    <div className="p-5 rounded-xl bg-(--bg-elevated) border border-(--border-primary) mb-4">
      {/* 예제 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-(--text-tertiary)">
          {t('exampleNumber')} {index + 1}
        </span>
        {example.difficulty && <DifficultyStars level={example.difficulty as DifficultyLevel} />}
      </div>

      {/* 문제 */}
      <div className="mb-3">
        <p className="text-(--text-primary)">{example.problem}</p>
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
        className="min-h-11 inline-flex items-center text-sm font-medium text-(--accent-primary) bg-transparent border-none cursor-pointer px-0 hover:underline"
      >
        {showSolution ? `▼ ${t('hideSolution')}` : `▶ ${t('showSolution')}`}
      </button>

      {/* 풀이 */}
      {showSolution && (
        <div className="mt-3 p-4 rounded-lg bg-(--bg-secondary) border border-(--border-primary)">
          <p className="text-(--text-secondary) whitespace-pre-wrap">{example.solution}</p>
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
    <div className="p-5 rounded-xl bg-(--bg-elevated) border border-(--border-primary) mb-4">
      <span className="text-sm font-medium text-(--text-tertiary)">
        {t('exampleNumber')} {index + 1}
      </span>
      <p className="text-(--text-primary) mt-2">{example}</p>
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
        <h3 className="flex items-center gap-2 text-lg font-semibold text-(--text-primary) mb-4">
          <PencilLine size={20} aria-hidden="true" />
          {title}
        </h3>
      )}
      <div className="space-y-3">
        {(examples ?? []).map((example, index) =>
          typeof example === 'string' ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: examples are static and won't be reordered
            <SimpleExample key={`example-str-${index}`} example={example} index={index} />
          ) : (
            // biome-ignore lint/suspicious/noArrayIndexKey: examples are static and won't be reordered
            <ExampleCard key={`example-obj-${index}`} example={example} index={index} />
          ),
        )}
      </div>
    </div>
  );
}
