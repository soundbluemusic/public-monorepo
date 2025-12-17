/**
 * @fileoverview 유명 정리 데이터
 */
import type { MathConcept } from "../types";

export const theoremsConcepts: MathConcept[] = [
  {
    id: "fundamental-theorem-calculus",
    name: {
      ko: "미적분학의 기본정리",
      en: "Fundamental Theorem of Calculus",
      ja: "微積分学の基本定理",
    },
    field: "theorems",
    subfield: "calculus",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "미적분학의 기본정리는 미분과 적분이 서로 역연산임을 보여줍니다. 연속함수의 정적분을 원시함수로 계산할 수 있게 합니다.",
        formulas: [
          {
            latex: "\\frac{d}{dx} \\int_a^x f(t) dt = f(x)",
            description: "제1 기본정리",
          },
          {
            latex: "\\int_a^b f(x) dx = F(b) - F(a)",
            description: "제2 기본정리 (F' = f)",
          },
        ],
        examples: [
          {
            problem: "∫₀² 3x² dx를 기본정리로 계산하세요.",
            solution:
              "F(x) = x³ (F' = 3x²). ∫₀² 3x² dx = 2³ - 0³ = 8",
          },
        ],
        history: {
          discoveredBy: "뉴턴, 라이프니츠",
          year: "1660년대",
          background:
            "뉴턴과 라이프니츠가 독립적으로 발견했으며, 미적분학의 핵심입니다.",
        },
        applications: [
          { field: "물리학", description: "운동 방정식" },
          { field: "공학", description: "면적, 부피 계산" },
          { field: "경제학", description: "총비용, 총수입" },
        ],
      },
      en: {
        definition:
          "The Fundamental Theorem of Calculus shows differentiation and integration are inverse operations. It allows computing definite integrals via antiderivatives.",
        formulas: [
          {
            latex: "\\frac{d}{dx} \\int_a^x f(t) dt = f(x)",
            description: "First Fundamental Theorem",
          },
          {
            latex: "\\int_a^b f(x) dx = F(b) - F(a)",
            description: "Second Fundamental Theorem (F' = f)",
          },
        ],
        examples: [
          {
            problem: "Calculate ∫₀² 3x² dx using the theorem.",
            solution:
              "F(x) = x³ (F' = 3x²). ∫₀² 3x² dx = 2³ - 0³ = 8",
          },
        ],
        history: {
          discoveredBy: "Newton, Leibniz",
          year: "1660s",
          background:
            "Discovered independently by Newton and Leibniz; core of calculus.",
        },
        applications: [
          { field: "Physics", description: "Equations of motion" },
          { field: "Engineering", description: "Area, volume calculation" },
          { field: "Economics", description: "Total cost, revenue" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative", "integral"],
      nextTopics: ["integration-techniques"],
      related: ["mean-value-theorem"],
    },
    tags: ["미적분", "기본정리", "calculus", "fundamental theorem"],
  },
  {
    id: "fundamental-theorem-algebra",
    name: {
      ko: "대수학의 기본정리",
      en: "Fundamental Theorem of Algebra",
      ja: "代数学の基本定理",
    },
    field: "theorems",
    subfield: "algebra",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "대수학의 기본정리는 모든 n차 다항식(n≥1)은 복소수 범위에서 정확히 n개의 근(중복 포함)을 가진다는 것입니다.",
        formulas: [
          {
            latex: "p(z) = a_n(z-r_1)(z-r_2)\\cdots(z-r_n)",
            description: "n차 다항식의 인수분해",
          },
        ],
        examples: [
          {
            problem: "x² + 1 = 0의 근을 찾으세요.",
            solution:
              "실수에서는 근이 없지만, 복소수에서 x = ±i (i² = -1)",
          },
          {
            problem: "x³ - 1 = 0의 모든 근을 찾으세요.",
            solution:
              "x = 1 (실근), x = (-1 ± i√3)/2 (허근 2개). 총 3개의 근.",
          },
        ],
        history: {
          discoveredBy: "카를 프리드리히 가우스",
          year: "1799년",
          background:
            "가우스가 박사 논문에서 최초로 엄밀하게 증명했습니다.",
        },
        applications: [
          { field: "제어 이론", description: "전달함수의 극점 분석" },
          { field: "신호 처리", description: "필터 설계" },
          { field: "수치해석", description: "다항식 근 찾기" },
        ],
      },
      en: {
        definition:
          "The Fundamental Theorem of Algebra states every polynomial of degree n≥1 has exactly n roots (counting multiplicity) in complex numbers.",
        formulas: [
          {
            latex: "p(z) = a_n(z-r_1)(z-r_2)\\cdots(z-r_n)",
            description: "Factorization of degree n polynomial",
          },
        ],
        examples: [
          {
            problem: "Find the roots of x² + 1 = 0.",
            solution:
              "No real roots, but in complex numbers x = ±i (i² = -1)",
          },
          {
            problem: "Find all roots of x³ - 1 = 0.",
            solution:
              "x = 1 (real), x = (-1 ± i√3)/2 (complex). Total 3 roots.",
          },
        ],
        history: {
          discoveredBy: "Carl Friedrich Gauss",
          year: "1799",
          background:
            "Gauss gave the first rigorous proof in his doctoral dissertation.",
        },
        applications: [
          { field: "Control Theory", description: "Transfer function poles" },
          { field: "Signal Processing", description: "Filter design" },
          { field: "Numerical Analysis", description: "Polynomial root finding" },
        ],
      },
    },
    relations: {
      prerequisites: ["complex-numbers", "polynomial"],
      nextTopics: ["galois-theory"],
      related: ["quadratic-formula"],
    },
    tags: ["대수학", "기본정리", "algebra", "fundamental theorem"],
  },
  {
    id: "fermats-last-theorem",
    name: {
      ko: "페르마의 마지막 정리",
      en: "Fermat's Last Theorem",
      ja: "フェルマーの最終定理",
    },
    field: "theorems",
    subfield: "number-theory",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "n ≥ 3인 정수에 대해 xⁿ + yⁿ = zⁿ을 만족하는 양의 정수 x, y, z는 존재하지 않습니다.",
        formulas: [
          {
            latex: "x^n + y^n = z^n \\text{ has no positive integer solutions for } n \\geq 3",
            description: "페르마의 마지막 정리",
          },
        ],
        examples: [
          {
            problem: "n = 2일 때는 해가 있나요?",
            solution:
              "예, 피타고라스 삼중수: 3² + 4² = 5², 5² + 12² = 13² 등 무한히 많습니다.",
          },
        ],
        history: {
          discoveredBy: "피에르 드 페르마 (추측), 앤드류 와일스 (증명)",
          year: "1637년 (추측), 1995년 (증명)",
          background:
            "페르마가 책 여백에 '증명을 발견했다'고 썼지만, 358년 후 와일스가 증명했습니다.",
        },
        applications: [
          { field: "수론", description: "타원곡선, 모듈러 형식" },
          { field: "암호학", description: "타원곡선 암호" },
        ],
      },
      en: {
        definition:
          "For integer n ≥ 3, there are no positive integer solutions x, y, z satisfying xⁿ + yⁿ = zⁿ.",
        formulas: [
          {
            latex: "x^n + y^n = z^n \\text{ has no positive integer solutions for } n \\geq 3",
            description: "Fermat's Last Theorem",
          },
        ],
        examples: [
          {
            problem: "Are there solutions for n = 2?",
            solution:
              "Yes, Pythagorean triples: 3² + 4² = 5², 5² + 12² = 13², infinitely many.",
          },
        ],
        history: {
          discoveredBy: "Pierre de Fermat (conjecture), Andrew Wiles (proof)",
          year: "1637 (conjecture), 1995 (proof)",
          background:
            "Fermat wrote he had a proof in a book margin; Wiles proved it 358 years later.",
        },
        applications: [
          { field: "Number Theory", description: "Elliptic curves, modular forms" },
          { field: "Cryptography", description: "Elliptic curve cryptography" },
        ],
      },
    },
    relations: {
      prerequisites: ["diophantine-equations", "modular-arithmetic"],
      nextTopics: ["elliptic-curves", "modular-forms"],
      related: ["pythagorean-theorem"],
    },
    tags: ["페르마", "마지막정리", "Fermat", "last theorem"],
  },
  {
    id: "prime-number-theorem",
    name: {
      ko: "소수 정리",
      en: "Prime Number Theorem",
      ja: "素数定理",
    },
    field: "theorems",
    subfield: "number-theory",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "소수 정리는 x 이하의 소수의 개수 π(x)가 x/ln(x)에 점근한다는 것입니다.",
        formulas: [
          {
            latex: "\\pi(x) \\sim \\frac{x}{\\ln x}",
            description: "소수 정리",
          },
          {
            latex: "\\lim_{x \\to \\infty} \\frac{\\pi(x)}{x / \\ln x} = 1",
            description: "정확한 점근 형태",
          },
        ],
        examples: [
          {
            problem: "1000 이하의 소수 개수를 추정하세요.",
            solution:
              "π(1000) ≈ 1000/ln(1000) ≈ 1000/6.9 ≈ 145. 실제: 168개",
          },
        ],
        history: {
          discoveredBy: "아다마르, 드 라 발레푸생",
          year: "1896년",
          background:
            "가우스가 추측하고, 아다마르와 드 라 발레푸생이 독립적으로 증명했습니다.",
        },
        applications: [
          { field: "암호학", description: "큰 소수 생성" },
          { field: "수론", description: "소수 분포 연구" },
        ],
      },
      en: {
        definition:
          "The Prime Number Theorem states that π(x), the count of primes ≤ x, is asymptotic to x/ln(x).",
        formulas: [
          {
            latex: "\\pi(x) \\sim \\frac{x}{\\ln x}",
            description: "Prime Number Theorem",
          },
          {
            latex: "\\lim_{x \\to \\infty} \\frac{\\pi(x)}{x / \\ln x} = 1",
            description: "Precise asymptotic form",
          },
        ],
        examples: [
          {
            problem: "Estimate the number of primes up to 1000.",
            solution:
              "π(1000) ≈ 1000/ln(1000) ≈ 1000/6.9 ≈ 145. Actual: 168",
          },
        ],
        history: {
          discoveredBy: "Hadamard, de la Vallée Poussin",
          year: "1896",
          background:
            "Conjectured by Gauss; proved independently by Hadamard and de la Vallée Poussin.",
        },
        applications: [
          { field: "Cryptography", description: "Large prime generation" },
          { field: "Number Theory", description: "Prime distribution" },
        ],
      },
    },
    relations: {
      prerequisites: ["prime-numbers", "logarithm"],
      nextTopics: ["riemann-hypothesis"],
      related: ["zeta-function"],
    },
    tags: ["소수", "정리", "prime", "theorem"],
  },
  {
    id: "mean-value-theorem",
    name: {
      ko: "평균값 정리",
      en: "Mean Value Theorem",
      ja: "平均値の定理",
    },
    field: "theorems",
    subfield: "calculus",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "평균값 정리는 [a,b]에서 연속이고 (a,b)에서 미분 가능한 함수에 대해, 접선의 기울기가 할선의 기울기와 같은 점이 존재함을 말합니다.",
        formulas: [
          {
            latex: "f'(c) = \\frac{f(b) - f(a)}{b - a}",
            description: "평균값 정리 (a < c < b인 c 존재)",
          },
        ],
        examples: [
          {
            problem: "f(x) = x² on [1, 3]에서 평균값 정리의 c를 찾으세요.",
            solution:
              "f'(x) = 2x, (f(3)-f(1))/(3-1) = (9-1)/2 = 4. 2c = 4이므로 c = 2.",
          },
        ],
        history: {
          discoveredBy: "오귀스탱 루이 코시",
          year: "1823년",
          background:
            "코시가 해석학의 엄밀화 과정에서 증명했습니다.",
        },
        applications: [
          { field: "해석학", description: "함수의 증감 판정" },
          { field: "물리학", description: "순간 속도와 평균 속도" },
          { field: "오차 분석", description: "테일러 전개의 나머지항" },
        ],
      },
      en: {
        definition:
          "The Mean Value Theorem states for a function continuous on [a,b] and differentiable on (a,b), there exists a point where tangent slope equals secant slope.",
        formulas: [
          {
            latex: "f'(c) = \\frac{f(b) - f(a)}{b - a}",
            description: "Mean Value Theorem (c exists with a < c < b)",
          },
        ],
        examples: [
          {
            problem: "Find c for f(x) = x² on [1, 3].",
            solution:
              "f'(x) = 2x, (f(3)-f(1))/(3-1) = (9-1)/2 = 4. 2c = 4, so c = 2.",
          },
        ],
        history: {
          discoveredBy: "Augustin-Louis Cauchy",
          year: "1823",
          background:
            "Cauchy proved it during the rigorization of analysis.",
        },
        applications: [
          { field: "Analysis", description: "Determining function increase/decrease" },
          { field: "Physics", description: "Instantaneous vs average velocity" },
          { field: "Error Analysis", description: "Taylor expansion remainder" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative", "continuity"],
      nextTopics: ["rolles-theorem", "lhopitals-rule"],
      related: ["intermediate-value-theorem"],
    },
    tags: ["평균값", "미적분", "mean value", "calculus"],
  },
  {
    id: "bayes-theorem",
    name: {
      ko: "베이즈 정리",
      en: "Bayes' Theorem",
      ja: "ベイズの定理",
    },
    field: "theorems",
    subfield: "probability",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "베이즈 정리는 조건부 확률을 뒤집는 공식입니다. 새로운 증거가 주어졌을 때 믿음을 업데이트하는 데 사용됩니다.",
        formulas: [
          {
            latex: "P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}",
            description: "베이즈 정리",
          },
          {
            latex: "P(B) = \\sum_i P(B|A_i)P(A_i)",
            description: "전확률 공식",
          },
        ],
        examples: [
          {
            problem:
              "질병 발생률 1%, 검사 정확도 99%. 양성일 때 실제 질병 확률은?",
            solution:
              "P(D|+) = P(+|D)P(D) / P(+) = (0.99)(0.01) / (0.99×0.01 + 0.01×0.99) = 0.5 (50%)",
          },
        ],
        history: {
          discoveredBy: "토머스 베이즈",
          year: "1763년",
          background:
            "베이즈 사후에 발표된 논문에서 처음 등장했습니다.",
        },
        applications: [
          { field: "기계학습", description: "나이브 베이즈 분류기" },
          { field: "의학", description: "진단 테스트 해석" },
          { field: "스팸 필터", description: "베이지안 스팸 필터" },
        ],
      },
      en: {
        definition:
          "Bayes' Theorem is a formula for reversing conditional probabilities. Used to update beliefs given new evidence.",
        formulas: [
          {
            latex: "P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}",
            description: "Bayes' Theorem",
          },
          {
            latex: "P(B) = \\sum_i P(B|A_i)P(A_i)",
            description: "Law of total probability",
          },
        ],
        examples: [
          {
            problem:
              "Disease rate 1%, test accuracy 99%. If positive, what's actual disease probability?",
            solution:
              "P(D|+) = P(+|D)P(D) / P(+) = (0.99)(0.01) / (0.99×0.01 + 0.01×0.99) = 0.5 (50%)",
          },
        ],
        history: {
          discoveredBy: "Thomas Bayes",
          year: "1763",
          background:
            "First appeared in a paper published posthumously.",
        },
        applications: [
          { field: "Machine Learning", description: "Naive Bayes classifier" },
          { field: "Medicine", description: "Diagnostic test interpretation" },
          { field: "Spam Filtering", description: "Bayesian spam filters" },
        ],
      },
    },
    relations: {
      prerequisites: ["conditional-probability"],
      nextTopics: ["bayesian-inference"],
      related: ["total-probability"],
    },
    tags: ["베이즈", "조건부확률", "Bayes", "conditional"],
  },
  {
    id: "noethers-theorem",
    name: {
      ko: "뇌터의 정리",
      en: "Noether's Theorem",
      ja: "ネーターの定理",
    },
    field: "theorems",
    subfield: "physics",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "뇌터의 정리는 물리계의 연속 대칭성에 대응하는 보존량이 존재함을 말합니다.",
        formulas: [
          {
            latex: "\\text{시간 평행이동 대칭} \\leftrightarrow \\text{에너지 보존}",
            description: "시간 대칭과 에너지",
          },
          {
            latex: "\\text{공간 평행이동 대칭} \\leftrightarrow \\text{운동량 보존}",
            description: "공간 대칭과 운동량",
          },
          {
            latex: "\\text{회전 대칭} \\leftrightarrow \\text{각운동량 보존}",
            description: "회전 대칭과 각운동량",
          },
        ],
        examples: [
          {
            problem: "왜 에너지가 보존되는지 뇌터 정리로 설명하세요.",
            solution:
              "물리 법칙이 시간에 따라 변하지 않으면(시간 평행이동 대칭), 에너지가 보존됩니다.",
          },
        ],
        history: {
          discoveredBy: "에미 뇌터",
          year: "1915년",
          background:
            "뇌터가 일반상대론 연구 중에 발견한, 물리학에서 가장 중요한 정리 중 하나입니다.",
        },
        applications: [
          { field: "물리학", description: "보존 법칙의 기원" },
          { field: "입자물리학", description: "게이지 대칭, 표준모형" },
          { field: "수학", description: "불변 이론" },
        ],
      },
      en: {
        definition:
          "Noether's Theorem states that every continuous symmetry of a physical system corresponds to a conserved quantity.",
        formulas: [
          {
            latex: "\\text{Time translation symmetry} \\leftrightarrow \\text{Energy conservation}",
            description: "Time symmetry and energy",
          },
          {
            latex: "\\text{Space translation symmetry} \\leftrightarrow \\text{Momentum conservation}",
            description: "Space symmetry and momentum",
          },
          {
            latex: "\\text{Rotational symmetry} \\leftrightarrow \\text{Angular momentum conservation}",
            description: "Rotation symmetry and angular momentum",
          },
        ],
        examples: [
          {
            problem: "Explain energy conservation via Noether's theorem.",
            solution:
              "If physical laws don't change over time (time translation symmetry), energy is conserved.",
          },
        ],
        history: {
          discoveredBy: "Emmy Noether",
          year: "1915",
          background:
            "Noether discovered this while working on general relativity; one of physics' most important theorems.",
        },
        applications: [
          { field: "Physics", description: "Origin of conservation laws" },
          { field: "Particle Physics", description: "Gauge symmetries, Standard Model" },
          { field: "Mathematics", description: "Invariant theory" },
        ],
      },
    },
    relations: {
      prerequisites: ["symmetry", "lagrangian-mechanics"],
      nextTopics: ["gauge-theory"],
      related: ["conservation-laws"],
    },
    tags: ["뇌터", "대칭", "Noether", "symmetry"],
  },
];
