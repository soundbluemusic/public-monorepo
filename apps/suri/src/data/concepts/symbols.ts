/**
 * @fileoverview 수학 기호 데이터
 */
import type { MathConcept } from "../types";

export const symbolsConcepts: MathConcept[] = [
  {
    id: "summation-notation",
    name: {
      ko: "합의 기호 Σ",
      en: "Summation Notation (Σ)",
      ja: "総和記号 Σ",
    },
    field: "symbols",
    subfield: "operations",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "Σ(시그마)는 연속된 항들의 합을 간결하게 표현하는 기호입니다. 아래에 시작 인덱스, 위에 끝 인덱스를 씁니다.",
        formulas: [
          {
            latex: "\\sum_{i=1}^{n} a_i = a_1 + a_2 + ... + a_n",
            description: "합의 기호 정의",
          },
          {
            latex: "\\sum_{i=1}^{n} c \\cdot a_i = c \\sum_{i=1}^{n} a_i",
            description: "상수 인수 분리",
          },
          {
            latex: "\\sum_{i=1}^{n} (a_i + b_i) = \\sum_{i=1}^{n} a_i + \\sum_{i=1}^{n} b_i",
            description: "합의 분배",
          },
        ],
        examples: [
          {
            problem: "Σᵢ₌₁⁵ i² 를 계산하세요.",
            solution: "1² + 2² + 3² + 4² + 5² = 1 + 4 + 9 + 16 + 25 = 55",
          },
          {
            problem: "Σᵢ₌₁ⁿ i = ?",
            solution: "1 + 2 + ... + n = n(n+1)/2",
          },
        ],
        applications: [
          { field: "통계학", description: "평균, 분산 계산" },
          { field: "수열", description: "급수의 합" },
          { field: "프로그래밍", description: "반복문 표현" },
        ],
      },
      en: {
        definition:
          "Σ (sigma) is a symbol for expressing sums of consecutive terms concisely. Lower index below, upper index above.",
        formulas: [
          {
            latex: "\\sum_{i=1}^{n} a_i = a_1 + a_2 + ... + a_n",
            description: "Summation definition",
          },
          {
            latex: "\\sum_{i=1}^{n} c \\cdot a_i = c \\sum_{i=1}^{n} a_i",
            description: "Constant factor",
          },
          {
            latex: "\\sum_{i=1}^{n} (a_i + b_i) = \\sum_{i=1}^{n} a_i + \\sum_{i=1}^{n} b_i",
            description: "Sum distribution",
          },
        ],
        examples: [
          {
            problem: "Calculate Σᵢ₌₁⁵ i².",
            solution: "1² + 2² + 3² + 4² + 5² = 1 + 4 + 9 + 16 + 25 = 55",
          },
          {
            problem: "Σᵢ₌₁ⁿ i = ?",
            solution: "1 + 2 + ... + n = n(n+1)/2",
          },
        ],
        applications: [
          { field: "Statistics", description: "Mean, variance calculation" },
          { field: "Sequences", description: "Series sums" },
          { field: "Programming", description: "Loop representation" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["product-notation", "series"],
      related: ["integral"],
    },
    tags: ["시그마", "합", "summation", "sigma"],
  },
  {
    id: "product-notation",
    name: {
      ko: "곱의 기호 Π",
      en: "Product Notation (Π)",
      ja: "総乗記号 Π",
    },
    field: "symbols",
    subfield: "operations",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "Π(파이)는 연속된 항들의 곱을 간결하게 표현하는 기호입니다. 팩토리얼과 조합에서 자주 사용됩니다.",
        formulas: [
          {
            latex: "\\prod_{i=1}^{n} a_i = a_1 \\times a_2 \\times ... \\times a_n",
            description: "곱의 기호 정의",
          },
          {
            latex: "n! = \\prod_{i=1}^{n} i",
            description: "팩토리얼의 표현",
          },
        ],
        examples: [
          {
            problem: "Πᵢ₌₁⁵ i 를 계산하세요.",
            solution: "1 × 2 × 3 × 4 × 5 = 120 = 5!",
          },
          {
            problem: "Πᵢ₌₁³ 2i 를 계산하세요.",
            solution: "2 × 4 × 6 = 48",
          },
        ],
        applications: [
          { field: "확률론", description: "독립 사건의 확률" },
          { field: "수론", description: "소인수분해" },
          { field: "조합론", description: "팩토리얼, 순열" },
        ],
      },
      en: {
        definition:
          "Π (capital pi) is a symbol for expressing products of consecutive terms. Often used in factorials and combinations.",
        formulas: [
          {
            latex: "\\prod_{i=1}^{n} a_i = a_1 \\times a_2 \\times ... \\times a_n",
            description: "Product definition",
          },
          {
            latex: "n! = \\prod_{i=1}^{n} i",
            description: "Factorial representation",
          },
        ],
        examples: [
          {
            problem: "Calculate Πᵢ₌₁⁵ i.",
            solution: "1 × 2 × 3 × 4 × 5 = 120 = 5!",
          },
          {
            problem: "Calculate Πᵢ₌₁³ 2i.",
            solution: "2 × 4 × 6 = 48",
          },
        ],
        applications: [
          { field: "Probability", description: "Independent event probabilities" },
          { field: "Number Theory", description: "Prime factorization" },
          { field: "Combinatorics", description: "Factorials, permutations" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["factorial", "combinations"],
      related: ["summation-notation"],
    },
    tags: ["파이", "곱", "product", "pi notation"],
  },
  {
    id: "infinity-symbol",
    name: {
      ko: "무한대 ∞",
      en: "Infinity (∞)",
      ja: "無限大 ∞",
    },
    field: "symbols",
    subfield: "special",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "∞(무한대)는 한없이 커지는 개념을 나타내는 기호입니다. 극한, 적분, 집합론에서 사용됩니다.",
        formulas: [
          {
            latex: "\\lim_{x \\to \\infty} f(x)",
            description: "x가 무한대로 갈 때의 극한",
          },
          {
            latex: "\\int_0^{\\infty} f(x) dx",
            description: "무한 적분",
          },
          {
            latex: "\\infty + 1 = \\infty, \\quad \\infty \\cdot 2 = \\infty",
            description: "무한대의 연산 (주의 필요)",
          },
        ],
        examples: [
          {
            problem: "lim(x→∞) 1/x를 구하세요.",
            solution: "x가 커질수록 1/x는 0에 가까워지므로, 극한값은 0입니다.",
          },
        ],
        history: {
          discoveredBy: "존 월리스",
          year: "1655년",
          background:
            "월리스가 이 기호를 처음 사용했으며, 칸토어가 무한의 종류를 구분했습니다.",
        },
        applications: [
          { field: "해석학", description: "극한, 수렴" },
          { field: "집합론", description: "무한집합의 크기" },
          { field: "물리학", description: "점근적 행동" },
        ],
      },
      en: {
        definition:
          "∞ (infinity) represents the concept of unboundedness. Used in limits, integrals, and set theory.",
        formulas: [
          {
            latex: "\\lim_{x \\to \\infty} f(x)",
            description: "Limit as x approaches infinity",
          },
          {
            latex: "\\int_0^{\\infty} f(x) dx",
            description: "Improper integral",
          },
          {
            latex: "\\infty + 1 = \\infty, \\quad \\infty \\cdot 2 = \\infty",
            description: "Infinity operations (caution needed)",
          },
        ],
        examples: [
          {
            problem: "Find lim(x→∞) 1/x.",
            solution: "As x grows, 1/x approaches 0, so the limit is 0.",
          },
        ],
        history: {
          discoveredBy: "John Wallis",
          year: "1655",
          background:
            "Wallis first used this symbol; Cantor distinguished types of infinity.",
        },
        applications: [
          { field: "Analysis", description: "Limits, convergence" },
          { field: "Set Theory", description: "Cardinality of infinite sets" },
          { field: "Physics", description: "Asymptotic behavior" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["limits", "improper-integrals"],
      related: ["aleph-numbers"],
    },
    tags: ["무한", "극한", "infinity", "unbounded"],
  },
  {
    id: "partial-derivative-symbol",
    name: {
      ko: "편미분 기호 ∂",
      en: "Partial Derivative (∂)",
      ja: "偏微分記号 ∂",
    },
    field: "symbols",
    subfield: "calculus",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "∂는 다변수 함수에서 한 변수에 대해서만 미분할 때 사용하는 기호입니다. 다른 변수는 상수로 취급합니다.",
        formulas: [
          {
            latex: "\\frac{\\partial f}{\\partial x}",
            description: "x에 대한 편미분",
          },
          {
            latex: "\\frac{\\partial^2 f}{\\partial x \\partial y}",
            description: "혼합 편미분",
          },
          {
            latex: "\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right)",
            description: "그래디언트",
          },
        ],
        examples: [
          {
            problem: "f(x,y) = x²y + y³에서 ∂f/∂x를 구하세요.",
            solution: "y를 상수로 보고 x로 미분: ∂f/∂x = 2xy",
          },
        ],
        applications: [
          { field: "물리학", description: "열역학, 전자기학" },
          { field: "경제학", description: "한계 효용, 한계 비용" },
          { field: "기계학습", description: "역전파 알고리즘" },
        ],
      },
      en: {
        definition:
          "∂ is used for differentiating multivariable functions with respect to one variable, treating others as constants.",
        formulas: [
          {
            latex: "\\frac{\\partial f}{\\partial x}",
            description: "Partial derivative with respect to x",
          },
          {
            latex: "\\frac{\\partial^2 f}{\\partial x \\partial y}",
            description: "Mixed partial derivative",
          },
          {
            latex: "\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right)",
            description: "Gradient",
          },
        ],
        examples: [
          {
            problem: "Find ∂f/∂x for f(x,y) = x²y + y³.",
            solution: "Treating y as constant: ∂f/∂x = 2xy",
          },
        ],
        applications: [
          { field: "Physics", description: "Thermodynamics, electromagnetism" },
          { field: "Economics", description: "Marginal utility, marginal cost" },
          { field: "Machine Learning", description: "Backpropagation" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative"],
      nextTopics: ["gradient", "jacobian"],
      related: ["total-derivative"],
    },
    tags: ["편미분", "다변수", "partial", "derivative"],
  },
  {
    id: "set-notation",
    name: {
      ko: "집합 기호",
      en: "Set Notation",
      ja: "集合記号",
    },
    field: "symbols",
    subfield: "sets",
    difficulty: 1,
    content: {
      ko: {
        definition:
          "집합 기호는 집합과 그 연산을 표현하는 기호들입니다. ∈, ⊆, ∪, ∩ 등이 있습니다.",
        formulas: [
          {
            latex: "x \\in A",
            description: "x는 A의 원소",
          },
          {
            latex: "A \\subseteq B",
            description: "A는 B의 부분집합",
          },
          {
            latex: "A \\cup B",
            description: "합집합",
          },
          {
            latex: "A \\cap B",
            description: "교집합",
          },
          {
            latex: "A^c \\text{ or } \\bar{A}",
            description: "여집합",
          },
          {
            latex: "\\emptyset \\text{ or } \\{\\}",
            description: "공집합",
          },
        ],
        examples: [
          {
            problem: "A = {1, 2, 3}일 때 2 ∈ A인지 확인하세요.",
            solution: "2는 A의 원소이므로 2 ∈ A는 참입니다.",
          },
        ],
        applications: [
          { field: "논리학", description: "명제의 진리집합" },
          { field: "데이터베이스", description: "쿼리 연산" },
          { field: "프로그래밍", description: "자료구조" },
        ],
      },
      en: {
        definition:
          "Set notation includes symbols for sets and their operations: ∈, ⊆, ∪, ∩, etc.",
        formulas: [
          {
            latex: "x \\in A",
            description: "x is an element of A",
          },
          {
            latex: "A \\subseteq B",
            description: "A is a subset of B",
          },
          {
            latex: "A \\cup B",
            description: "Union",
          },
          {
            latex: "A \\cap B",
            description: "Intersection",
          },
          {
            latex: "A^c \\text{ or } \\bar{A}",
            description: "Complement",
          },
          {
            latex: "\\emptyset \\text{ or } \\{\\}",
            description: "Empty set",
          },
        ],
        examples: [
          {
            problem: "If A = {1, 2, 3}, check if 2 ∈ A.",
            solution: "2 is an element of A, so 2 ∈ A is true.",
          },
        ],
        applications: [
          { field: "Logic", description: "Truth sets" },
          { field: "Databases", description: "Query operations" },
          { field: "Programming", description: "Data structures" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["sets", "venn-diagrams"],
      related: ["logic-symbols"],
    },
    tags: ["집합", "원소", "set", "element"],
  },
  {
    id: "nabla-operator",
    name: {
      ko: "나블라 연산자 ∇",
      en: "Nabla Operator (∇)",
      ja: "ナブラ演算子 ∇",
    },
    field: "symbols",
    subfield: "calculus",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "∇(나블라, 델)는 벡터 미분 연산자입니다. 그래디언트, 발산, 회전을 표현하는 데 사용됩니다.",
        formulas: [
          {
            latex: "\\nabla = \\left( \\frac{\\partial}{\\partial x}, \\frac{\\partial}{\\partial y}, \\frac{\\partial}{\\partial z} \\right)",
            description: "나블라의 정의",
          },
          {
            latex: "\\nabla f",
            description: "그래디언트 (스칼라장 → 벡터장)",
          },
          {
            latex: "\\nabla \\cdot \\vec{F}",
            description: "발산 (벡터장 → 스칼라장)",
          },
          {
            latex: "\\nabla \\times \\vec{F}",
            description: "회전 (벡터장 → 벡터장)",
          },
          {
            latex: "\\nabla^2 = \\nabla \\cdot \\nabla",
            description: "라플라시안",
          },
        ],
        examples: [
          {
            problem: "f(x,y,z) = x² + y² + z²의 그래디언트를 구하세요.",
            solution: "∇f = (2x, 2y, 2z)",
          },
        ],
        applications: [
          { field: "전자기학", description: "맥스웰 방정식" },
          { field: "유체역학", description: "유동 분석" },
          { field: "최적화", description: "경사 하강법" },
        ],
      },
      en: {
        definition:
          "∇ (nabla, del) is a vector differential operator. Used for gradient, divergence, and curl.",
        formulas: [
          {
            latex: "\\nabla = \\left( \\frac{\\partial}{\\partial x}, \\frac{\\partial}{\\partial y}, \\frac{\\partial}{\\partial z} \\right)",
            description: "Definition of nabla",
          },
          {
            latex: "\\nabla f",
            description: "Gradient (scalar → vector field)",
          },
          {
            latex: "\\nabla \\cdot \\vec{F}",
            description: "Divergence (vector → scalar field)",
          },
          {
            latex: "\\nabla \\times \\vec{F}",
            description: "Curl (vector → vector field)",
          },
          {
            latex: "\\nabla^2 = \\nabla \\cdot \\nabla",
            description: "Laplacian",
          },
        ],
        examples: [
          {
            problem: "Find the gradient of f(x,y,z) = x² + y² + z².",
            solution: "∇f = (2x, 2y, 2z)",
          },
        ],
        applications: [
          { field: "Electromagnetism", description: "Maxwell's equations" },
          { field: "Fluid Dynamics", description: "Flow analysis" },
          { field: "Optimization", description: "Gradient descent" },
        ],
      },
    },
    relations: {
      prerequisites: ["partial-derivative-symbol", "vector-basics"],
      nextTopics: ["divergence", "curl", "laplacian"],
      related: ["maxwell-equations"],
    },
    tags: ["나블라", "벡터미분", "nabla", "del"],
  },

  // ===== 17.4 추가 수학 기호 =====
  {
    id: "integral-symbol",
    name: {
      ko: "적분 기호 ∫",
      en: "Integral Symbol (∫)",
      ja: "積分記号 ∫",
    },
    field: "symbols",
    subfield: "calculus",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "∫는 적분을 나타내는 기호로, 라틴어 'summa'(합)의 S에서 유래했습니다. 연속적인 합, 면적, 누적량을 계산합니다.",
        formulas: [
          {
            latex: "\\int f(x) dx",
            description: "부정적분",
          },
          {
            latex: "\\int_a^b f(x) dx",
            description: "정적분",
          },
          {
            latex: "\\iint f(x,y) dA, \\quad \\iiint f(x,y,z) dV",
            description: "이중/삼중 적분",
          },
          {
            latex: "\\oint f(z) dz",
            description: "폐곡선 적분",
          },
        ],
        examples: [
          {
            problem: "∫x² dx를 계산하세요.",
            solution: "∫x² dx = x³/3 + C",
          },
        ],
        history: {
          discoveredBy: "고트프리트 라이프니츠",
          year: "1675년",
          background:
            "라이프니츠가 S를 길게 늘인 모양으로 합의 연속화를 표현했습니다.",
        },
        applications: [
          { field: "물리학", description: "일, 에너지, 면적" },
          { field: "통계학", description: "확률밀도의 누적" },
          { field: "공학", description: "신호 적분" },
        ],
      },
      en: {
        definition:
          "∫ represents integration, derived from Latin 'summa' (sum). Calculates continuous sums, areas, and accumulated quantities.",
        formulas: [
          {
            latex: "\\int f(x) dx",
            description: "Indefinite integral",
          },
          {
            latex: "\\int_a^b f(x) dx",
            description: "Definite integral",
          },
          {
            latex: "\\iint f(x,y) dA, \\quad \\iiint f(x,y,z) dV",
            description: "Double/triple integrals",
          },
          {
            latex: "\\oint f(z) dz",
            description: "Contour integral",
          },
        ],
        examples: [
          {
            problem: "Calculate ∫x² dx.",
            solution: "∫x² dx = x³/3 + C",
          },
        ],
        history: {
          discoveredBy: "Gottfried Leibniz",
          year: "1675",
          background:
            "Leibniz elongated S to represent the continuous version of summation.",
        },
        applications: [
          { field: "Physics", description: "Work, energy, area" },
          { field: "Statistics", description: "Cumulative probability" },
          { field: "Engineering", description: "Signal integration" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["fundamental-theorem-calculus", "integration-techniques"],
      related: ["summation-notation", "derivative"],
    },
    tags: ["적분", "미적분", "integral", "calculus"],
  },
  {
    id: "forall-exists",
    name: {
      ko: "양화 기호 ∀, ∃",
      en: "Quantifiers (∀, ∃)",
      ja: "量化記号 ∀, ∃",
    },
    field: "symbols",
    subfield: "logic",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "∀(전칭 양화사)는 '모든'을, ∃(존재 양화사)는 '존재한다'를 나타냅니다. 술어 논리의 기본 기호입니다.",
        formulas: [
          {
            latex: "\\forall x \\, P(x)",
            description: "모든 x에 대해 P(x)가 참",
          },
          {
            latex: "\\exists x \\, P(x)",
            description: "P(x)를 만족하는 x가 존재",
          },
          {
            latex: "\\neg(\\forall x \\, P(x)) \\equiv \\exists x \\, \\neg P(x)",
            description: "드모르간 유사 법칙",
          },
        ],
        examples: [
          {
            problem: "'모든 짝수는 2의 배수이다'를 기호로 표현하세요.",
            solution: "∀n (짝수(n) → 2|n) 또는 ∀n ∈ 짝수: 2|n",
          },
        ],
        applications: [
          { field: "수학기초론", description: "공리, 정리 표현" },
          { field: "프로그래밍", description: "루프 불변식" },
          { field: "형식 검증", description: "명세 작성" },
        ],
      },
      en: {
        definition:
          "∀ (universal quantifier) means 'for all', ∃ (existential quantifier) means 'there exists'. Basic symbols of predicate logic.",
        formulas: [
          {
            latex: "\\forall x \\, P(x)",
            description: "P(x) is true for all x",
          },
          {
            latex: "\\exists x \\, P(x)",
            description: "There exists x such that P(x)",
          },
          {
            latex: "\\neg(\\forall x \\, P(x)) \\equiv \\exists x \\, \\neg P(x)",
            description: "De Morgan-like law",
          },
        ],
        examples: [
          {
            problem: "Express 'all even numbers are multiples of 2' symbolically.",
            solution: "∀n (even(n) → 2|n) or ∀n ∈ Evens: 2|n",
          },
        ],
        applications: [
          { field: "Foundations", description: "Expressing axioms, theorems" },
          { field: "Programming", description: "Loop invariants" },
          { field: "Formal Verification", description: "Specification" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["predicate-logic"],
      related: ["propositional-logic"],
    },
    tags: ["양화사", "논리", "quantifier", "logic"],
  },
  {
    id: "implies-iff",
    name: {
      ko: "함의와 동치 ⇒, ⇔",
      en: "Implication and Equivalence",
      ja: "含意と同値 ⇒, ⇔",
    },
    field: "symbols",
    subfield: "logic",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "⇒(함의)는 'A이면 B'를, ⇔(동치)는 'A와 B가 필요충분'임을 나타냅니다. 논리와 증명의 핵심 기호입니다.",
        formulas: [
          {
            latex: "P \\Rightarrow Q",
            description: "P이면 Q (P가 참이면 Q도 참)",
          },
          {
            latex: "P \\Leftrightarrow Q",
            description: "P와 Q가 동치 (P ⇔ Q는 (P⇒Q) ∧ (Q⇒P))",
          },
          {
            latex: "P \\Rightarrow Q \\equiv \\neg P \\lor Q",
            description: "함의의 정의",
          },
        ],
        examples: [
          {
            problem: "'x가 짝수이면 x²도 짝수이다'의 역과 대우를 쓰세요.",
            solution:
              "역: x²가 짝수이면 x도 짝수 (참). 대우: x²가 홀수이면 x도 홀수 (원명제와 동치).",
          },
        ],
        applications: [
          { field: "수학", description: "정리 증명" },
          { field: "프로그래밍", description: "조건문 논리" },
          { field: "철학", description: "논증 분석" },
        ],
      },
      en: {
        definition:
          "⇒ (implication) means 'if A then B', ⇔ (equivalence) means 'A if and only if B'. Core symbols for logic and proofs.",
        formulas: [
          {
            latex: "P \\Rightarrow Q",
            description: "If P then Q (P true implies Q true)",
          },
          {
            latex: "P \\Leftrightarrow Q",
            description: "P and Q are equivalent (P⇔Q means (P⇒Q)∧(Q⇒P))",
          },
          {
            latex: "P \\Rightarrow Q \\equiv \\neg P \\lor Q",
            description: "Definition of implication",
          },
        ],
        examples: [
          {
            problem: "Write converse and contrapositive of 'if x is even, x² is even'.",
            solution:
              "Converse: if x² is even, x is even (true). Contrapositive: if x² is odd, x is odd (equivalent to original).",
          },
        ],
        applications: [
          { field: "Mathematics", description: "Theorem proving" },
          { field: "Programming", description: "Conditional logic" },
          { field: "Philosophy", description: "Argument analysis" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["propositional-logic", "proof-methods"],
      related: ["truth-tables"],
    },
    tags: ["함의", "동치", "implication", "equivalence"],
  },
  {
    id: "factorial-binomial",
    name: {
      ko: "팩토리얼과 이항계수",
      en: "Factorial and Binomial Coefficients",
      ja: "階乗と二項係数",
    },
    field: "symbols",
    subfield: "combinatorics",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "n!(팩토리얼)은 1부터 n까지의 곱, (n k)는 n개에서 k개를 선택하는 조합의 수입니다.",
        formulas: [
          {
            latex: "n! = n \\times (n-1) \\times ... \\times 2 \\times 1",
            description: "팩토리얼",
          },
          {
            latex: "\\binom{n}{k} = \\frac{n!}{k!(n-k)!}",
            description: "이항계수",
          },
          {
            latex: "(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k",
            description: "이항정리",
          },
        ],
        examples: [
          {
            problem: "5명 중 2명을 선택하는 경우의 수는?",
            solution: "C(5,2) = 5!/(2!×3!) = 120/(2×6) = 10가지",
          },
        ],
        applications: [
          { field: "확률론", description: "이항분포" },
          { field: "조합론", description: "경우의 수" },
          { field: "알고리즘", description: "동적 프로그래밍" },
        ],
      },
      en: {
        definition:
          "n! (factorial) is product 1 to n, (n k) (binomial coefficient) is the number of ways to choose k from n items.",
        formulas: [
          {
            latex: "n! = n \\times (n-1) \\times ... \\times 2 \\times 1",
            description: "Factorial",
          },
          {
            latex: "\\binom{n}{k} = \\frac{n!}{k!(n-k)!}",
            description: "Binomial coefficient",
          },
          {
            latex: "(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k",
            description: "Binomial theorem",
          },
        ],
        examples: [
          {
            problem: "How many ways to choose 2 from 5 people?",
            solution: "C(5,2) = 5!/(2!×3!) = 120/(2×6) = 10 ways",
          },
        ],
        applications: [
          { field: "Probability", description: "Binomial distribution" },
          { field: "Combinatorics", description: "Counting" },
          { field: "Algorithms", description: "Dynamic programming" },
        ],
      },
    },
    relations: {
      prerequisites: ["product-notation"],
      nextTopics: ["binomial-theorem", "pascals-triangle"],
      related: ["combinations"],
    },
    tags: ["팩토리얼", "이항계수", "factorial", "binomial"],
  },
];
