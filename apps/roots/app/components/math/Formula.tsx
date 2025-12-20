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
    <div className="formula-block">
      {/* LaTeX 수식 */}
      <div className="mb-3">
        <LaTeX math={formula.latex} display />
      </div>

      {/* 설명 */}
      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
        {formula.description}
      </p>

      {/* 변수 설명 */}
      {formula.variables && formula.variables.length > 0 && (
        <ul className="text-sm space-y-1" style={{ color: 'var(--text-tertiary)' }}>
          {formula.variables.map((variable) => (
            <li key={variable.symbol} className="flex items-center gap-2">
              <span
                className="font-mono px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--math-formula)',
                }}
              >
                <LaTeX math={variable.symbol} />
              </span>
              <span>{variable.meaning}</span>
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
    <div className="formula-block">
      <div className="mb-3">
        <LaTeX math={formula} display />
      </div>
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
        <h3
          className="text-lg font-semibold flex items-center gap-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <span>📐</span>
          {title}
        </h3>
      )}
      {formulas.map((formula, index) =>
        typeof formula === 'string' ? (
          <SimpleFormula key={`formula-${formula.slice(0, 30)}`} formula={formula} />
        ) : (
          <FormulaCard
            key={`formula-${formula.latex.slice(0, 30)}`}
            formula={formula}
            index={index}
          />
        ),
      )}
    </div>
  );
}
