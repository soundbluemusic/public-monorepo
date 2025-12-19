import type { Formula as FormulaType } from '@/data/types';
/**
 * @fileoverview 수학 공식 카드 컴포넌트
 */
import { For, Show } from 'solid-js';
import { LaTeX } from './LaTeX';

interface FormulaCardProps {
  formula: FormulaType;
  /** 인덱스 (여러 공식일 때 번호 표시) */
  index?: number;
}

/**
 * 수학 공식을 카드 형태로 표시
 *
 * @example
 * ```tsx
 * <FormulaCard
 *   formula={{
 *     latex: "a^2 + b^2 = c^2",
 *     description: "피타고라스 정리",
 *     variables: [
 *       { symbol: "a", meaning: "밑변" },
 *       { symbol: "b", meaning: "높이" },
 *       { symbol: "c", meaning: "빗변" },
 *     ]
 *   }}
 * />
 * ```
 */
export function FormulaCard(props: FormulaCardProps) {
  return (
    <div class="formula-block">
      {/* LaTeX 수식 */}
      <div class="mb-3">
        <LaTeX math={props.formula.latex} display />
      </div>

      {/* 설명 */}
      <p class="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
        {props.formula.description}
      </p>

      {/* 변수 설명 */}
      <Show when={props.formula.variables && props.formula.variables.length > 0}>
        <ul class="text-sm space-y-1" style={{ color: 'var(--text-tertiary)' }}>
          <For each={props.formula.variables}>
            {(variable) => (
              <li class="flex items-center gap-2">
                <span
                  class="font-mono px-1.5 py-0.5 rounded"
                  style={{
                    'background-color': 'var(--bg-tertiary)',
                    color: 'var(--math-formula)',
                  }}
                >
                  <LaTeX math={variable.symbol} />
                </span>
                <span>{variable.meaning}</span>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}

/**
 * 여러 공식을 나열하는 컴포넌트
 */
export function FormulaList(props: { formulas: FormulaType[]; title?: string }) {
  return (
    <div class="space-y-4">
      <Show when={props.title}>
        <h3
          class="text-lg font-semibold flex items-center gap-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <span>📐</span>
          {props.title}
        </h3>
      </Show>
      <For each={props.formulas}>
        {(formula, index) => <FormulaCard formula={formula} index={index()} />}
      </For>
    </div>
  );
}
