import type { MathConcept } from '../types';

export const measureTheoryConcepts: MathConcept[] = [
  {
    id: 'sigma-algebra',
    name: {
      ko: '시그마 대수',
      en: 'Sigma-Algebra (σ-algebra)',
      ja: 'σ代数',
    },
    field: 'measure-theory',
    subfield: 'foundations',
    difficulty: 4,
    content: {
      ko: {
        definition: '집합의 여집합, 가산 합집합에 닫힌 집합족. 측도를 정의할 수 있는 구조',
        formulas: ['1. Ω ∈ Σ', '2. A ∈ Σ ⇒ A^c ∈ Σ', '3. A₁, A₂, ... ∈ Σ ⇒ ∪A_n ∈ Σ'],
        examples: ['보렐 시그마 대수 B(ℝ)', '{∅, Ω}', '멱집합 P(Ω)'],
        applications: ['확률론', '적분론', '함수해석학'],
      },
      en: {
        definition:
          'Collection of sets closed under complement and countable union. Structure for defining measures',
        formulas: ['1. Ω ∈ Σ', '2. A ∈ Σ ⇒ A^c ∈ Σ', '3. A₁, A₂, ... ∈ Σ ⇒ ∪A_n ∈ Σ'],
        examples: ['Borel σ-algebra B(ℝ)', '{∅, Ω}', 'Power set P(Ω)'],
        applications: ['Probability', 'Integration', 'Functional analysis'],
      },
      ja: {
        definition: '補集合と可算和について閉じた集合族。測度を定義できる構造',
        formulas: ['1. Ω ∈ Σ', '2. A ∈ Σ ⇒ A^c ∈ Σ', '3. A₁, A₂, ... ∈ Σ ⇒ ∪A_n ∈ Σ'],
        examples: ['ボレルσ代数 B(ℝ)', '{∅, Ω}', '冪集合 P(Ω)'],
        applications: ['確率論', '積分論', '関数解析'],
      },
    },
    latex: 'A \\in \\Sigma \\Rightarrow A^c \\in \\Sigma',
    relations: {
      prerequisites: ['set-theory'],
      nextTopics: ['measure', 'borel-sets'],
      related: ['topology'],
      applications: ['probability-theory'],
    },
    tags: ['시그마', 'sigma', '대수', 'algebra'],
  },
  {
    id: 'lebesgue-measure',
    name: {
      ko: '르베그 측도',
      en: 'Lebesgue Measure',
      ja: 'ルベーグ測度',
    },
    field: 'measure-theory',
    subfield: 'measures',
    difficulty: 4,
    content: {
      ko: {
        definition: 'ℝⁿ에서 집합의 "크기"를 일반화한 측도. 리만 적분의 한계를 극복',
        formulas: [
          '구간의 측도: λ([a,b]) = b - a',
          '가산 가법성: λ(∪A_n) = Σλ(A_n) (서로소)',
          '외측도: λ*(A) = inf{Σℓ(I_n): A ⊆ ∪I_n}',
        ],
        examples: ['λ(ℚ ∩ [0,1]) = 0', 'λ(칸토어 집합) = 0'],
        applications: ['적분론', '확률론', '푸리에 해석'],
      },
      en: {
        definition:
          'Generalized notion of "size" for sets in ℝⁿ. Overcomes limitations of Riemann integral',
        formulas: [
          'Interval measure: λ([a,b]) = b - a',
          'Countable additivity: λ(∪A_n) = Σλ(A_n) (disjoint)',
          'Outer measure: λ*(A) = inf{Σℓ(I_n): A ⊆ ∪I_n}',
        ],
        examples: ['λ(ℚ ∩ [0,1]) = 0', 'λ(Cantor set) = 0'],
        applications: ['Integration', 'Probability', 'Fourier analysis'],
      },
      ja: {
        definition: 'ℝⁿにおける集合の「大きさ」を一般化した測度。リーマン積分の限界を克服',
        formulas: [
          '区間の測度: λ([a,b]) = b - a',
          '可算加法性: λ(∪A_n) = Σλ(A_n) (互いに素)',
          '外測度: λ*(A) = inf{Σℓ(I_n): A ⊆ ∪I_n}',
        ],
        examples: ['λ(ℚ ∩ [0,1]) = 0', 'λ(カントール集合) = 0'],
        applications: ['積分論', '確率論', 'フーリエ解析'],
      },
    },
    latex: '\\lambda([a,b]) = b - a',
    relations: {
      prerequisites: ['sigma-algebra', 'real-analysis'],
      nextTopics: ['lebesgue-integral', 'measure-zero'],
      related: ['riemann-integral'],
      applications: ['integration', 'probability'],
    },
    tags: ['르베그', 'Lebesgue', '측도', 'measure'],
  },
  {
    id: 'lebesgue-integral',
    name: {
      ko: '르베그 적분',
      en: 'Lebesgue Integral',
      ja: 'ルベーグ積分',
    },
    field: 'measure-theory',
    subfield: 'integration',
    difficulty: 5,
    content: {
      ko: {
        definition: '함수값의 범위를 분할하여 정의하는 적분. 리만 적분을 일반화',
        formulas: [
          '단순함수: ∫φ dμ = Σa_i μ(A_i)',
          '일반함수: ∫f dμ = sup{∫φ dμ: φ ≤ f, φ 단순}',
          'MCT, DCT',
        ],
        examples: ['디리클레 함수의 적분', '∫_ℝ e^{-x²} dx = √π'],
        applications: ['확률론', '푸리에 해석', '함수공간'],
      },
      en: {
        definition:
          'Integration defined by partitioning range of function. Generalizes Riemann integral',
        formulas: [
          'Simple function: ∫φ dμ = Σa_i μ(A_i)',
          'General: ∫f dμ = sup{∫φ dμ: φ ≤ f, φ simple}',
          'MCT, DCT',
        ],
        examples: ['Integral of Dirichlet function', '∫_ℝ e^{-x²} dx = √π'],
        applications: ['Probability', 'Fourier analysis', 'Function spaces'],
      },
      ja: {
        definition: '関数の値域を分割して定義する積分。リーマン積分を一般化',
        formulas: [
          '単関数: ∫φ dμ = Σa_i μ(A_i)',
          '一般: ∫f dμ = sup{∫φ dμ: φ ≤ f, φ 単関数}',
          'MCT, DCT',
        ],
        examples: ['ディリクレ関数の積分', '∫_ℝ e^{-x²} dx = √π'],
        applications: ['確率論', 'フーリエ解析', '関数空間'],
      },
    },
    latex:
      '\\int f \\, d\\mu = \\sup\\left\\{\\int \\phi \\, d\\mu : \\phi \\leq f, \\phi \\text{ simple}\\right\\}',
    relations: {
      prerequisites: ['lebesgue-measure', 'limits'],
      nextTopics: ['lp-spaces', 'fubini-theorem'],
      related: ['riemann-integral'],
      applications: ['probability-expectation'],
    },
    tags: ['르베그', 'Lebesgue', '적분', 'integral'],
  },
  {
    id: 'probability-measure',
    name: {
      ko: '확률 측도',
      en: 'Probability Measure',
      ja: '確率測度',
    },
    field: 'measure-theory',
    subfield: 'probability',
    difficulty: 4,
    content: {
      ko: {
        definition: '전체 측도가 1인 측도. 확률론의 수학적 기초',
        formulas: ['P(Ω) = 1', 'P(A) ≥ 0', 'P(∪A_n) = ΣP(A_n) (서로소)'],
        examples: ['동전 던지기', '정규분포', '균등분포'],
        applications: ['통계학', '금융', '물리학'],
      },
      en: {
        definition: 'Measure with total measure 1. Mathematical foundation of probability',
        formulas: ['P(Ω) = 1', 'P(A) ≥ 0', 'P(∪A_n) = ΣP(A_n) (disjoint)'],
        examples: ['Coin flip', 'Normal distribution', 'Uniform distribution'],
        applications: ['Statistics', 'Finance', 'Physics'],
      },
      ja: {
        definition: '全測度が1の測度。確率論の数学的基礎',
        formulas: ['P(Ω) = 1', 'P(A) ≥ 0', 'P(∪A_n) = ΣP(A_n) (互いに素)'],
        examples: ['コイン投げ', '正規分布', '一様分布'],
        applications: ['統計学', '金融', '物理学'],
      },
    },
    latex: 'P(\\Omega) = 1, \\quad P(A) \\geq 0',
    relations: {
      prerequisites: ['sigma-algebra', 'lebesgue-measure'],
      nextTopics: ['random-variable', 'expectation'],
      related: ['kolmogorov-axioms'],
      applications: ['statistics', 'stochastic-processes'],
    },
    tags: ['확률', 'probability', '측도', 'measure'],
  },
  {
    id: 'fubini-theorem',
    name: {
      ko: '푸비니 정리',
      en: "Fubini's Theorem",
      ja: 'フビニの定理',
    },
    field: 'measure-theory',
    subfield: 'integration',
    difficulty: 5,
    content: {
      ko: {
        definition: '다중 적분에서 적분 순서를 교환할 수 있는 조건을 제시',
        formulas: [
          '∬f d(μ×ν) = ∫(∫f(x,y) dν(y)) dμ(x) = ∫(∫f(x,y) dμ(x)) dν(y)',
          '조건: f가 적분 가능 또는 비음',
        ],
        examples: ['이중적분 계산', '기댓값의 독립 분해'],
        applications: ['다변량 적분', '확률론', '푸리에 변환'],
      },
      en: {
        definition:
          'Conditions under which order of integration can be exchanged in multiple integrals',
        formulas: [
          '∬f d(μ×ν) = ∫(∫f(x,y) dν(y)) dμ(x) = ∫(∫f(x,y) dμ(x)) dν(y)',
          'Condition: f integrable or non-negative',
        ],
        examples: ['Double integral computation', 'Independent expectation decomposition'],
        applications: ['Multivariable integration', 'Probability', 'Fourier transform'],
      },
      ja: {
        definition: '多重積分で積分順序を交換できる条件を提示',
        formulas: [
          '∬f d(μ×ν) = ∫(∫f(x,y) dν(y)) dμ(x) = ∫(∫f(x,y) dμ(x)) dν(y)',
          '条件: fが可積分または非負',
        ],
        examples: ['二重積分の計算', '期待値の独立分解'],
        applications: ['多変数積分', '確率論', 'フーリエ変換'],
      },
    },
    latex:
      '\\iint f \\, d(\\mu \\times \\nu) = \\int\\left(\\int f(x,y) \\, d\\nu(y)\\right) d\\mu(x)',
    relations: {
      prerequisites: ['lebesgue-integral', 'product-measure'],
      nextTopics: ['tonelli-theorem'],
      related: ['double-integral'],
      applications: ['multivariable-calculus'],
    },
    tags: ['푸비니', 'Fubini', '이중적분', 'iterated'],
  },
  {
    id: 'dominated-convergence',
    name: {
      ko: '지배 수렴 정리',
      en: 'Dominated Convergence Theorem',
      ja: '優収束定理',
    },
    field: 'measure-theory',
    subfield: 'convergence',
    difficulty: 5,
    content: {
      ko: {
        definition: '적분 가능한 함수에 의해 지배되는 함수열의 극한과 적분을 교환',
        formulas: ['조건: |f_n| ≤ g, ∫g < ∞', '결론: lim∫f_n = ∫lim f_n', '즉: ∫f = lim∫f_n'],
        examples: ['점별 수렴 함수열', '파라미터 적분의 미분'],
        applications: ['극한-적분 교환', '확률론'],
      },
      en: {
        definition: 'Exchange limit and integral for functions dominated by an integrable function',
        formulas: [
          'Condition: |f_n| ≤ g, ∫g < ∞',
          'Conclusion: lim∫f_n = ∫lim f_n',
          'i.e.: ∫f = lim∫f_n',
        ],
        examples: ['Pointwise convergent sequences', 'Differentiation under integral'],
        applications: ['Limit-integral exchange', 'Probability'],
      },
      ja: {
        definition: '可積分関数で支配される関数列の極限と積分を交換',
        formulas: ['条件: |f_n| ≤ g, ∫g < ∞', '結論: lim∫f_n = ∫lim f_n', 'つまり: ∫f = lim∫f_n'],
        examples: ['各点収束する関数列', 'パラメータ積分の微分'],
        applications: ['極限-積分の交換', '確率論'],
      },
    },
    latex:
      '\\lim_{n \\to \\infty} \\int f_n \\, d\\mu = \\int \\lim_{n \\to \\infty} f_n \\, d\\mu',
    relations: {
      prerequisites: ['lebesgue-integral'],
      nextTopics: ['bounded-convergence'],
      related: ['monotone-convergence'],
      applications: ['analysis', 'probability'],
    },
    tags: ['DCT', '지배수렴', 'dominated', 'convergence'],
  },
  {
    id: 'radon-nikodym',
    name: {
      ko: '라돈-니코딤 정리',
      en: 'Radon-Nikodym Theorem',
      ja: 'ラドン・ニコディム定理',
    },
    field: 'measure-theory',
    subfield: 'measures',
    difficulty: 5,
    content: {
      ko: {
        definition: '절대연속인 측도는 다른 측도에 대한 적분으로 표현 가능',
        formulas: ['ν ≪ μ ⟺ ∃f: ν(A) = ∫_A f dμ', 'f = dν/dμ (라돈-니코딤 도함수)'],
        examples: ['확률밀도함수', '조건부 기댓값'],
        applications: ['확률론', '통계역학', '함수해석'],
      },
      en: {
        definition:
          'Absolutely continuous measure can be expressed as integral w.r.t. another measure',
        formulas: ['ν ≪ μ ⟺ ∃f: ν(A) = ∫_A f dμ', 'f = dν/dμ (Radon-Nikodym derivative)'],
        examples: ['Probability density function', 'Conditional expectation'],
        applications: ['Probability', 'Statistical mechanics', 'Functional analysis'],
      },
      ja: {
        definition: '絶対連続な測度は別の測度に関する積分で表現可能',
        formulas: ['ν ≪ μ ⟺ ∃f: ν(A) = ∫_A f dμ', 'f = dν/dμ (ラドン・ニコディム導関数)'],
        examples: ['確率密度関数', '条件付き期待値'],
        applications: ['確率論', '統計力学', '関数解析'],
      },
    },
    latex: '\\nu(A) = \\int_A \\frac{d\\nu}{d\\mu} \\, d\\mu',
    relations: {
      prerequisites: ['lebesgue-integral', 'absolute-continuity'],
      nextTopics: ['conditional-expectation'],
      related: ['probability-density'],
      applications: ['bayesian-inference'],
    },
    tags: ['라돈니코딤', 'Radon-Nikodym', '도함수', 'derivative'],
  },
  {
    id: 'lp-spaces',
    name: {
      ko: 'Lᵖ 공간',
      en: 'Lᵖ Spaces',
      ja: 'Lᵖ空間',
    },
    field: 'measure-theory',
    subfield: 'function-spaces',
    difficulty: 5,
    content: {
      ko: {
        definition: 'p승 적분 가능한 함수들의 바나흐 공간',
        formulas: [
          '||f||_p = (∫|f|^p dμ)^{1/p}',
          'L^∞: ||f||_∞ = ess sup |f|',
          '횔더: ||fg||_1 ≤ ||f||_p||g||_q (1/p+1/q=1)',
        ],
        examples: ['L²(ℝ): 제곱적분 가능', 'L^∞: 본질적 유계'],
        applications: ['푸리에 해석', '양자역학', 'PDE'],
      },
      en: {
        definition: 'Banach space of p-power integrable functions',
        formulas: [
          '||f||_p = (∫|f|^p dμ)^{1/p}',
          'L^∞: ||f||_∞ = ess sup |f|',
          'Hölder: ||fg||_1 ≤ ||f||_p||g||_q (1/p+1/q=1)',
        ],
        examples: ['L²(ℝ): square integrable', 'L^∞: essentially bounded'],
        applications: ['Fourier analysis', 'Quantum mechanics', 'PDEs'],
      },
      ja: {
        definition: 'p乗可積分関数のバナッハ空間',
        formulas: [
          '||f||_p = (∫|f|^p dμ)^{1/p}',
          'L^∞: ||f||_∞ = ess sup |f|',
          'ヘルダー: ||fg||_1 ≤ ||f||_p||g||_q (1/p+1/q=1)',
        ],
        examples: ['L²(ℝ): 自乗可積分', 'L^∞: 本質的有界'],
        applications: ['フーリエ解析', '量子力学', 'PDE'],
      },
    },
    latex: '\\|f\\|_p = \\left(\\int |f|^p \\, d\\mu\\right)^{1/p}',
    relations: {
      prerequisites: ['lebesgue-integral', 'normed-space'],
      nextTopics: ['hilbert-space', 'dual-space'],
      related: ['banach-space'],
      applications: ['functional-analysis'],
    },
    tags: ['Lp', '함수공간', 'Banach', 'norm'],
  },
];
