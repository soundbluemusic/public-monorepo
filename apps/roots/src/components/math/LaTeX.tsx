/**
 * @fileoverview 수학 표현 렌더러 (MathML 네이티브)
 * KaTeX 제거 - 브라우저 내장 MathML 사용
 */

interface LaTeXProps {
  /** 수식 문자열 (간단한 LaTeX 또는 유니코드) */
  math: string;
  /** block (display) 모드 여부, 기본값 false (inline) */
  display?: boolean;
  /** 추가 CSS 클래스 */
  class?: string;
}

/**
 * LaTeX 문자열을 MathML로 변환하는 파서
 * 복잡한 LaTeX는 지원하지 않음 - 간단한 수식만 처리
 */
function latexToMathML(latex: string): string {
  let result = latex;

  // 기본 LaTeX 명령어를 유니코드/MathML로 변환
  const replacements: [RegExp, string][] = [
    // Greek letters
    [/\\alpha/g, 'α'],
    [/\\beta/g, 'β'],
    [/\\gamma/g, 'γ'],
    [/\\delta/g, 'δ'],
    [/\\epsilon/g, 'ε'],
    [/\\zeta/g, 'ζ'],
    [/\\eta/g, 'η'],
    [/\\theta/g, 'θ'],
    [/\\iota/g, 'ι'],
    [/\\kappa/g, 'κ'],
    [/\\lambda/g, 'λ'],
    [/\\mu/g, 'μ'],
    [/\\nu/g, 'ν'],
    [/\\xi/g, 'ξ'],
    [/\\pi/g, 'π'],
    [/\\rho/g, 'ρ'],
    [/\\sigma/g, 'σ'],
    [/\\tau/g, 'τ'],
    [/\\upsilon/g, 'υ'],
    [/\\phi/g, 'φ'],
    [/\\chi/g, 'χ'],
    [/\\psi/g, 'ψ'],
    [/\\omega/g, 'ω'],
    [/\\Gamma/g, 'Γ'],
    [/\\Delta/g, 'Δ'],
    [/\\Theta/g, 'Θ'],
    [/\\Lambda/g, 'Λ'],
    [/\\Xi/g, 'Ξ'],
    [/\\Pi/g, 'Π'],
    [/\\Sigma/g, 'Σ'],
    [/\\Phi/g, 'Φ'],
    [/\\Psi/g, 'Ψ'],
    [/\\Omega/g, 'Ω'],

    // Math operators
    [/\\times/g, '×'],
    [/\\div/g, '÷'],
    [/\\pm/g, '±'],
    [/\\mp/g, '∓'],
    [/\\cdot/g, '·'],
    [/\\ast/g, '∗'],
    [/\\star/g, '⋆'],
    [/\\circ/g, '∘'],
    [/\\bullet/g, '•'],

    // Relations
    [/\\leq/g, '≤'],
    [/\\geq/g, '≥'],
    [/\\neq/g, '≠'],
    [/\\approx/g, '≈'],
    [/\\equiv/g, '≡'],
    [/\\sim/g, '∼'],
    [/\\simeq/g, '≃'],
    [/\\cong/g, '≅'],
    [/\\propto/g, '∝'],
    [/\\ll/g, '≪'],
    [/\\gg/g, '≫'],
    [/\\prec/g, '≺'],
    [/\\succ/g, '≻'],
    [/\\subset/g, '⊂'],
    [/\\supset/g, '⊃'],
    [/\\subseteq/g, '⊆'],
    [/\\supseteq/g, '⊇'],
    [/\\in/g, '∈'],
    [/\\notin/g, '∉'],
    [/\\ni/g, '∋'],

    // Set operators
    [/\\cup/g, '∪'],
    [/\\cap/g, '∩'],
    [/\\setminus/g, '∖'],
    [/\\emptyset/g, '∅'],

    // Logic
    [/\\land/g, '∧'],
    [/\\lor/g, '∨'],
    [/\\lnot/g, '¬'],
    [/\\neg/g, '¬'],
    [/\\forall/g, '∀'],
    [/\\exists/g, '∃'],
    [/\\nexists/g, '∄'],
    [/\\Rightarrow/g, '⇒'],
    [/\\Leftarrow/g, '⇐'],
    [/\\Leftrightarrow/g, '⇔'],
    [/\\rightarrow/g, '→'],
    [/\\leftarrow/g, '←'],
    [/\\leftrightarrow/g, '↔'],
    [/\\to/g, '→'],
    [/\\mapsto/g, '↦'],

    // Calculus
    [/\\infty/g, '∞'],
    [/\\partial/g, '∂'],
    [/\\nabla/g, '∇'],
    [/\\int/g, '∫'],
    [/\\iint/g, '∬'],
    [/\\iiint/g, '∭'],
    [/\\oint/g, '∮'],
    [/\\sum/g, '∑'],
    [/\\prod/g, '∏'],
    [/\\coprod/g, '∐'],
    [/\\lim/g, 'lim'],

    // Misc
    [/\\sqrt/g, '√'],
    [/\\angle/g, '∠'],
    [/\\perp/g, '⊥'],
    [/\\parallel/g, '∥'],
    [/\\triangle/g, '△'],
    [/\\square/g, '□'],
    [/\\diamond/g, '◇'],
    [/\\prime/g, '′'],
    [/\\ldots/g, '…'],
    [/\\cdots/g, '⋯'],
    [/\\vdots/g, '⋮'],
    [/\\ddots/g, '⋱'],

    // Brackets
    [/\\{/g, '{'],
    [/\\}/g, '}'],
    [/\\langle/g, '⟨'],
    [/\\rangle/g, '⟩'],
    [/\\lfloor/g, '⌊'],
    [/\\rfloor/g, '⌋'],
    [/\\lceil/g, '⌈'],
    [/\\rceil/g, '⌉'],

    // Functions (keep as text)
    [/\\sin/g, 'sin'],
    [/\\cos/g, 'cos'],
    [/\\tan/g, 'tan'],
    [/\\sec/g, 'sec'],
    [/\\csc/g, 'csc'],
    [/\\cot/g, 'cot'],
    [/\\arcsin/g, 'arcsin'],
    [/\\arccos/g, 'arccos'],
    [/\\arctan/g, 'arctan'],
    [/\\sinh/g, 'sinh'],
    [/\\cosh/g, 'cosh'],
    [/\\tanh/g, 'tanh'],
    [/\\log/g, 'log'],
    [/\\ln/g, 'ln'],
    [/\\exp/g, 'exp'],
    [/\\det/g, 'det'],
    [/\\dim/g, 'dim'],
    [/\\ker/g, 'ker'],
    [/\\max/g, 'max'],
    [/\\min/g, 'min'],
    [/\\sup/g, 'sup'],
    [/\\inf/g, 'inf'],
    [/\\arg/g, 'arg'],
    [/\\gcd/g, 'gcd'],
    [/\\lcm/g, 'lcm'],
    [/\\mod/g, 'mod'],

    // Special
    [/\\mathbb\{R\}/g, 'ℝ'],
    [/\\mathbb\{N\}/g, 'ℕ'],
    [/\\mathbb\{Z\}/g, 'ℤ'],
    [/\\mathbb\{Q\}/g, 'ℚ'],
    [/\\mathbb\{C\}/g, 'ℂ'],
    [/\\mathbb\{P\}/g, 'ℙ'],
    // Remove remaining backslashes for simple commands
    [/\\text\{([^}]*)\}/g, '$1'],
    [/\\mathrm\{([^}]*)\}/g, '$1'],
    [/\\mathbf\{([^}]*)\}/g, '$1'],
    [/\\textbf\{([^}]*)\}/g, '$1'],
    [/\\textit\{([^}]*)\}/g, '$1'],
    [/\\left/g, ''],
    [/\\right/g, ''],
    [/\\,/g, ' '],
    [/\\;/g, ' '],
    [/\\!/g, ''],
    [/\\quad/g, '  '],
    [/\\qquad/g, '    '],
  ];

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  // mathcal 변환 (함수 교체라 별도 처리)
  result = result.replace(/\\mathcal\{([A-Z])\}/g, (_: string, c: string) =>
    String.fromCodePoint(0x1d49c + c.charCodeAt(0) - 65),
  );

  // 위첨자 ^{...} → 유니코드 위첨자 (간단한 경우만)
  result = result.replace(/\^(\d)/g, (_, d) => {
    const superscripts = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    return superscripts[Number.parseInt(d)] || `^${d}`;
  });
  result = result.replace(/\^\{(\d+)\}/g, (_, digits) => {
    const superscripts = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    return [...digits].map((d: string) => superscripts[Number.parseInt(d)] || d).join('');
  });
  result = result.replace(/\^\{([a-z])\}/g, (_, c) => {
    const map: Record<string, string> = { n: 'ⁿ', i: 'ⁱ' };
    return map[c] || `^${c}`;
  });
  result = result.replace(/\^n/g, 'ⁿ');
  result = result.replace(/\^i/g, 'ⁱ');
  result = result.replace(/\^T/g, 'ᵀ');
  result = result.replace(/\^\{T\}/g, 'ᵀ');
  result = result.replace(/\^\{-1\}/g, '⁻¹');
  result = result.replace(/\^\{\\prime\}/g, '′');
  result = result.replace(/\^\\prime/g, '′');

  // 아래첨자 _{...} → 유니코드 아래첨자 (간단한 경우만)
  result = result.replace(/_(\d)/g, (_, d) => {
    const subscripts = '₀₁₂₃₄₅₆₇₈₉';
    return subscripts[Number.parseInt(d)] || `_${d}`;
  });
  result = result.replace(/_\{(\d+)\}/g, (_, digits) => {
    const subscripts = '₀₁₂₃₄₅₆₇₈₉';
    return [...digits].map((d: string) => subscripts[Number.parseInt(d)] || d).join('');
  });
  result = result.replace(/_\{([a-z])\}/g, (_, c) => {
    const map: Record<string, string> = {
      a: 'ₐ',
      e: 'ₑ',
      h: 'ₕ',
      i: 'ᵢ',
      j: 'ⱼ',
      k: 'ₖ',
      l: 'ₗ',
      m: 'ₘ',
      n: 'ₙ',
      o: 'ₒ',
      p: 'ₚ',
      r: 'ᵣ',
      s: 'ₛ',
      t: 'ₜ',
      u: 'ᵤ',
      v: 'ᵥ',
      x: 'ₓ',
    };
    return map[c] || `_${c}`;
  });
  result = result.replace(/_([a-z])/g, (_, c) => {
    const map: Record<string, string> = {
      a: 'ₐ',
      e: 'ₑ',
      i: 'ᵢ',
      j: 'ⱼ',
      k: 'ₖ',
      n: 'ₙ',
      o: 'ₒ',
      p: 'ₚ',
      r: 'ᵣ',
      s: 'ₛ',
      t: 'ₜ',
      u: 'ᵤ',
      v: 'ᵥ',
      x: 'ₓ',
    };
    return map[c] || `_${c}`;
  });

  // 분수 \frac{a}{b} → a/b (간단하게)
  result = result.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)');
  result = result.replace(/\\dfrac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)');
  result = result.replace(/\\tfrac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)');

  // 루트 \sqrt{x} → √x, \sqrt[n]{x} → ⁿ√x
  result = result.replace(/\\sqrt\[(\d+)\]\{([^}]*)\}/g, (_, n, x) => {
    const superscripts = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    const sup = [...n].map((d: string) => superscripts[Number.parseInt(d)] || d).join('');
    return `${sup}√(${x})`;
  });
  result = result.replace(/\\sqrt\{([^}]*)\}/g, '√($1)');

  // 남은 중괄호 제거
  result = result.replace(/\{([^{}]*)\}/g, '$1');
  result = result.replace(/\{([^{}]*)\}/g, '$1'); // 중첩 처리

  return result;
}

/**
 * 수학 수식 렌더링 컴포넌트
 * LaTeX 문자열을 유니코드로 변환하여 표시
 */
export function LaTeX(props: LaTeXProps) {
  const rendered = () => latexToMathML(props.math);

  return (
    <span
      class={`math-formula ${props.class || ''}`}
      style={{
        display: props.display ? 'block' : 'inline',
        'text-align': props.display ? 'center' : 'inherit',
        'font-family': 'STIX Two Math, Cambria Math, serif',
        'font-size': props.display ? '1.2em' : 'inherit',
        'line-height': props.display ? '2' : 'inherit',
      }}
    >
      {rendered()}
    </span>
  );
}

/**
 * 블록 수식용 래퍼 컴포넌트
 */
export function MathBlock(props: { math: string; class?: string }) {
  return (
    <div class={`formula-block my-4 ${props.class || ''}`}>
      <LaTeX math={props.math} display />
    </div>
  );
}
