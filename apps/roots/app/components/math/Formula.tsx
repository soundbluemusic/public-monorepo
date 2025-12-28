import { Calculator } from 'lucide-react';
import type { Formula as FormulaType } from '@/data/types';
/**
 * @fileoverview 수학 공식 카드 컴포넌트
 */
import { LaTeX } from './LaTeX';

/** 문자열 또는 Formula 객체 */
type FormulaInput = string | FormulaType;

interface FormulaCardProps {
  formula: FormulaType;
  /** 인덱스 (여러 공식일 때 번호 표시) */
  index?: number;
}

/**
 * 수학 공식을 카드 형태로 표시
 */
export function FormulaCard({ formula }: FormulaCardProps) {
  return (
    <div className="p-5 rounded-xl bg-(--bg-elevated) border border-(--border-primary) mb-4">
      {/* LaTeX 수식 */}
      <div className="mb-3">
        <LaTeX math={formula.latex} display />
      </div>

      {/* 설명 */}
      <p className="text-sm text-(--text-secondary)">{formula.description}</p>

      {/* 변수 설명 */}
      {formula.variables && formula.variables.length > 0 && (
        <ul className="mt-2 space-y-2">
          {formula.variables.map((variable) => (
            <li key={variable.symbol} className="flex items-center gap-2">
              <span className="font-mono px-1.5 py-0.5 rounded bg-(--bg-tertiary) text-(--math-formula)">
                <LaTeX math={variable.symbol} />
              </span>
              <span className="text-(--text-secondary)">{variable.meaning}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * 문자열 공식을 간단히 표시
 */
function SimpleFormula({ formula }: { formula: string }) {
  return (
    <div className="my-4 p-4 rounded-lg bg-(--bg-secondary) border border-(--border-primary) overflow-x-auto">
      <LaTeX math={formula} display />
    </div>
  );
}

/**
 * 여러 공식을 나열하는 컴포넌트
 */
export function FormulaList({ formulas, title }: { formulas: FormulaInput[]; title?: string }) {
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="flex items-center gap-2 text-lg font-semibold text-(--text-primary) mb-4">
          <Calculator size={20} aria-hidden="true" />
          {title}
        </h3>
      )}
      {formulas.map((formula, index) =>
        typeof formula === 'string' ? (
          <SimpleFormula key={`formula-str-${index}`} formula={formula} />
        ) : (
          <FormulaCard key={`formula-obj-${index}`} formula={formula} index={index} />
        ),
      )}
    </div>
  );
}
