import type { Formula as FormulaType } from '@/data/types';
import { Calculator } from 'lucide-react';
import styles from '../../styles/app.module.scss';
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
    <div className={styles.formulaCard}>
      {/* LaTeX 수식 */}
      <div className={styles.formulaLatex}>
        <LaTeX math={formula.latex} display />
      </div>

      {/* 설명 */}
      <p className={styles.formulaCardDescription}>{formula.description}</p>

      {/* 변수 설명 */}
      {formula.variables && formula.variables.length > 0 && (
        <ul className={`${styles.spaceY2} ${styles.variableList}`}>
          {formula.variables.map((variable) => (
            <li key={variable.symbol} className={styles.flexCenter}>
              <span className={styles.variableSymbol}>
                <LaTeX math={variable.symbol} />
              </span>
              <span className={styles.textSecondary}>{variable.meaning}</span>
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
    <div className={styles.formulaBlock}>
      <LaTeX math={formula} display />
    </div>
  );
}

/**
 * 여러 공식을 나열하는 컴포넌트
 */
export function FormulaList({ formulas, title }: { formulas: FormulaInput[]; title?: string }) {
  return (
    <div className={styles.spaceY4}>
      {title && (
        <h3 className={styles.sectionTitle}>
          <Calculator size={20} aria-hidden="true" />
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
