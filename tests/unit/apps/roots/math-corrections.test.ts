import { describe, expect, it } from 'vitest';
import { getConceptById } from '../../../../apps/roots/app/data/concepts';

function visible(id: string, language: 'ko' | 'en'): string {
  const concept = getConceptById(id);
  expect(concept, `Missing concept: ${id}`).toBeDefined();
  return JSON.stringify(concept?.content[language]);
}

function formula(id: string): string {
  return getConceptById(id)?.latex ?? '';
}

describe('Roots mathematical corrections', () => {
  it('states diagnostic-test assumptions and domains of examples', () => {
    expect(visible('bayes-theorem', 'en')).toContain('probability of a positive test');
    expect(visible('bayes-theorem', 'en')).toContain('P(A) > 0, P(B) > 0');
    expect(visible('binomial-theorem', 'en')).toContain('n is a nonnegative integer');
    expect(visible('homeomorphism', 'en')).toContain('surface of a cube');
    expect(visible('predicate-logic', 'en')).toContain('∀n ∈ ℕ');
    expect(visible('fields', 'en')).toContain('0 ≠ 1');
    expect(visible('bollinger-bands', 'en')).toContain('Upper ≠ Lower');
    expect(visible('laplace-transform', 'en')).toContain('Re(s) > Re(a)');
    expect(visible('complex-analysis-basics', 'en')).toContain('f analytic on a simply connected domain');
  });

  it('states conditions for expectation, variance, and probability examples', () => {
    expect(visible('expected-value', 'en')).toContain('E[|X|] < ∞');
    expect(visible('expected-value', 'en')).toContain('independent samples');
    expect(visible('variance', 'en')).toContain('E[X²] < ∞');
    expect(visible('variance', 'en')).toContain('population variance');
    expect(visible('probability-basics', 'en')).toContain('independent flips of a fair coin');
    expect(visible('independence', 'en')).toContain('independence assumption');
    expect(visible('correlation', 'en')).toContain('neither variable is constant');
  });

  it('preserves hypotheses and distinctions in analysis, finance, and number theory', () => {
    expect(visible('residue-theorem', 'en')).toContain('positively oriented simple closed contour');
    expect(visible('conformal-mapping', 'en')).toContain('other than the entire complex plane');
    expect(visible('compound-interest', 'en')).toContain('Rule of 72 approximation');
    expect(visible('quadratic-residues', 'en')).toContain('zero is included');
    expect(visible('regression', 'en')).toContain('does not establish causation');
    expect(visible('fundamental-theorem-calculus', 'en')).toContain('f continuous on [a,b]');
    expect(visible('stokes-theorem', 'en')).toContain('orientations must agree');
    expect(visible('infinity-symbol', 'en')).toContain('extended real numbers');
  });

  it('retains hypotheses for compactness, Tor, and minimizers', () => {
    const compact = visible('compact-operator', 'en');
    expect(compact).toContain('Between Hilbert spaces');
    expect(compact).toContain('complex Banach space');
    expect(visible('tor-functor', 'en')).toContain('Torₙ(A,B) = 0 for n > 0');
    expect(visible('direct-methods', 'en')).toContain('reflexive Banach space');
    expect(visible('direct-methods', 'en')).toContain('weakly lower semicontinuous');
  });

  it('states conditions for probability, statistics and integration formulas', () => {
    expect(visible('anova', 'en')).toContain('two or more groups');
    expect(visible('anova', 'en')).toContain('equal variances');
    expect(visible('markov-chain', 'en')).toContain('may depend on time');
    expect(formula('markov-chain')).toContain('X_{n+1}=j');
    expect(visible('fubini-theorem', 'en')).toContain('σ-finite');
    expect(visible('fubini-theorem', 'en')).toContain('f ≥ 0');
    expect(visible('markov-decision-process', 'en')).toContain('0≤γ<1');
  });

  it('qualifies tuning, sound intensity, and wave examples', () => {
    expect(visible('frequency-ratio', 'en')).toContain('Perfect fifth in just intonation');
    expect(visible('equal-temperament', 'en')).toContain('not necessarily equal temperament');
    expect(visible('decibel-scale', 'en')).toContain('uncorrelated sounds');
    expect(visible('wave-equation', 'en')).toContain('ω² = c²k²');
  });

  it('states convergence and model assumptions in applied formulas', () => {
    for (const language of ['ko', 'en'] as const) {
      expect(visible('z-transform', language)).toContain('|z| > 1');
      expect(visible('binary-representation', language)).toContain('256');
      expect(visible('binary-representation', language)).not.toContain('bits} = 2^8');
    }
    expect(visible('fluid-dynamics', 'en')).toContain('without body forces');
    expect(visible('thermodynamics-math', 'en')).toContain('Ideal-gas equation');
    expect(visible('information-theory-basics', 'en')).toContain('Gaussian noise channel');
    expect(visible('sharpe-ratio', 'en')).toContain('standard deviation of excess return');
    expect(visible('ichimoku-cloud', 'en')).toContain('does not guarantee');
  });

  it('states the scope of Lebesgue integration, Fourier convergence and source coding', () => {
    for (const language of ['ko', 'en'] as const) {
      expect(visible('lebesgue-integral', language)).toContain('0 ≤ φ ≤ f');
      expect(visible('fourier-series-advanced', language)).toContain('L²');
      expect(visible('source-coding-theorem', language)).toContain('⌈-log₂ p(xᵢ)⌉');
    }
    expect(formula('fourier-series-advanced')).toContain('\\int_{-\\pi}^{\\pi}');
    expect(formula('fourier-transform-advanced')).toContain('L^1\\cap L^2');
    expect(formula('littlewood-paley-theory')).toContain('1<p<\\infty');
    expect(formula('source-coding-theorem')).toContain('prefix code');
  });

  it('includes conditions required by advanced algebra and topology results', () => {
    expect(formula('hilbert-nullstellensatz')).toContain('algebraically closed');
    expect(formula('homotopy-groups')).toContain('n\\geq 1');
    expect(visible('irreducible-representation', 'en')).toContain('nonzero representation');
    expect(visible('irreducible-representation', 'en')).toContain('homomorphism');
    expect(visible('elliptic-curves-ag', 'en')).toContain('characteristic other than 2 and 3');
    expect(formula('lu-decomposition')).toContain('PA = LU');
  });

  it('states the assumptions of ergodicity and the direction of Noether’s theorem', () => {
    expect(formula('ergodic-theory')).toContain('ergodic and probability-preserving');
    expect(formula('ergodic-theory')).toContain('a.e.');
    expect(visible('noethers-theorem', 'en')).toContain('symmetry of the action ⟹');
    expect(visible('noethers-theorem', 'en')).not.toContain('↔');
  });
  it('states division, ratio, and exponent restrictions', () => {
    for (const language of ['ko', 'en'] as const) {
      expect(visible('arithmetic-operations', language)).toContain('b ≠ 0');
      expect(visible('exponents', language)).toContain('a ≠ 0');
      expect(visible('fractions', language)).toContain('b ≠ 0, c ≠ 0, d ≠ 0');
      expect(visible('ratios', language)).toContain('b ≠ 0');
      expect(visible('proportions', language)).toContain('b ≠ 0, d ≠ 0');
    }
    expect(visible('proportions', 'ko')).toContain('일정한 속도');
    expect(visible('proportions', 'en')).toContain('constant speed');
  });

  it('includes vertical lines in the discussion of slope and perpendicularity', () => {
    expect(visible('slope', 'ko')).toContain('수평선과 수직선도 서로 수직');
    expect(visible('slope', 'en')).toContain('horizontal line and a vertical line are also perpendicular');
  });

  it('states the domains and angle unit of derivative formulas', () => {
    expect(visible('derivatives-trig', 'ko')).toContain('라디안');
    expect(visible('derivatives-trig', 'en')).toContain('radians');
    for (const language of ['ko', 'en'] as const) {
      expect(visible('derivatives-exp-log', language)).toContain('x > 0, a > 0, a ≠ 1');
    }
  });

  it('uses complementary angles for a 90-degree sum', () => {
    expect(visible('angles', 'ko')).toMatch(/여각의 합은 90°/);
    expect(visible('angles', 'ko')).not.toMatch(/보각의 합은 90°/);
  });

  it('limits unique prime factorization to integers greater than one', () => {
    expect(visible('prime-numbers', 'ko')).toMatch(/1보다 큰 자연수.*순서/);
    expect(visible('prime-numbers', 'en')).toMatch(/greater than 1.*order/i);
  });

  it('states the real-domain conditions of the square-root rules', () => {
    for (const language of ['ko', 'en'] as const) {
      const content = visible('square-roots', language);
      expect(content).toContain('a ≥ 0, b ≥ 0');
      expect(content).toContain('a ≥ 0, b > 0');
    }
  });

  it('distinguishes an infinite line from a line segment and restricts its equation', () => {
    expect(visible('point-line-plane', 'ko')).toMatch(/직선.*양쪽.*끝없이/);
    expect(visible('point-line-plane', 'en')).toMatch(/line.*both directions/i);
    for (const language of ['ko', 'en'] as const) {
      expect(visible('point-line-plane', language)).toContain('a² + b² > 0');
    }
  });

  it('states the assumptions of incompleteness theorems', () => {
    expect(visible('godel-incompleteness', 'ko')).toMatch(/무모순.*공리.*페아노/);
    expect(visible('godel-incompleteness', 'en')).toMatch(/consistent.*axiomatized.*Peano/i);
  });

  it('explains repeated confidence intervals and conditions for the formulas', () => {
    expect(visible('confidence-interval', 'ko')).toMatch(/반복.*구간.*95%/);
    expect(visible('confidence-interval', 'en')).toMatch(/95% of intervals.*repeated samples/i);
    for (const language of ['ko', 'en'] as const) {
      expect(visible('confidence-interval', language)).toMatch(/σ.*sufficient|σ.*충분/);
      expect(visible('confidence-interval', language)).toContain('n(1-p)');
    }
  });

  it('states likelihood assumptions and the normal variance estimator explicitly', () => {
    for (const language of ['ko', 'en'] as const) {
      const content = visible('maximum-likelihood', language);
      expect(content).toContain('Σ(xᵢ-x̄)²/n');
      expect(content).toContain('f(xᵢ|θ)');
      expect(content).not.toContain('σ̂²=s²');
    }
  });

  it('describes Fibonacci levels without claiming proven market prediction', () => {
    expect(visible('fibonacci-retracement', 'ko')).toMatch(/예측.*보장되지/);
    expect(visible('fibonacci-retracement', 'en')).toMatch(/predict.*not guaranteed/i);
    expect(visible('fibonacci-retracement', 'ko')).toMatch(/50%.*피보나치 비율이 아닙니다/);
  });

  it('defines semisimplicity using nonzero ideals and the correct setting', () => {
    expect(visible('semisimple-lie-algebra', 'ko')).toMatch(/특성 0.*유한 차원.*0이 아닌 가해 이데알/);
    expect(visible('semisimple-lie-algebra', 'en')).toMatch(/finite-dimensional.*characteristic zero.*nonzero solvable ideals/i);
  });

  it('differentiates the coefficients of a differential form', () => {
    expect(formula('differential-forms')).toContain('f_I');
    expect(formula('differential-forms')).toContain('dx^I');
    expect(formula('differential-forms')).not.toContain('\\partial \\omega');
  });

  it('requires the choice function to select an element of each set', () => {
    expect(formula('axiom-of-choice')).toContain('f(A) \\in A');
  });

  it('constrains the allowed expected distortion', () => {
    expect(formula('rate-distortion')).toContain('\\mathbb{E}');
    expect(formula('rate-distortion')).toContain('\\le');
  });

  it('states the Poisson model and the one-hour interval', () => {
    expect(visible('poisson-distribution', 'ko')).toMatch(/한 시간.*포아송 분포/);
    expect(visible('poisson-distribution', 'en')).toMatch(/one hour.*Poisson distribution/i);
  });

  it('distinguishes finite-p spaces from L-infinity and identifies almost-everywhere equivalence', () => {
    expect(visible('lp-spaces', 'ko')).toMatch(/1 ≤ p < ∞.*거의 모든 곳/);
    expect(visible('lp-spaces', 'en')).toMatch(/1 ≤ p < ∞.*almost everywhere/i);
  });

  it('assumes a normal distribution in the height example', () => {
    expect(visible('normal-distribution', 'ko')).toMatch(/키.*정규분포/);
    expect(visible('normal-distribution', 'en')).toMatch(/heights.*normally distributed/i);
  });
});
