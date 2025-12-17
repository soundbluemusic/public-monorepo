/**
 * @fileoverview 해석학 개념 데이터
 */
import type { MathConcept } from "../types";

export const analysisConcepts: MathConcept[] = [
  {
    id: "limit",
    name: {
      ko: "극한",
      en: "Limit",
      ja: "極限",
    },
    field: "analysis",
    subfield: "limits-continuity",
    difficulty: 3,
    content: {
      ko: {
        definition: "변수가 어떤 값에 한없이 가까워질 때 함수값이 다가가는 값이다.",
        formulas: [
          {
            latex: "\\lim_{x \\to a} f(x) = L",
            description: "x가 a에 가까워질 때 f(x)가 L에 수렴",
            variables: [
              { symbol: "a", meaning: "x가 접근하는 값" },
              { symbol: "L", meaning: "극한값" },
            ],
          },
          {
            latex: "\\lim_{x \\to \\infty} \\frac{1}{x} = 0",
            description: "무한대로 갈 때의 극한",
          },
        ],
        examples: [
          {
            problem: "lim(x→2) (x² - 4)/(x - 2)를 구하시오.",
            solution: "분자를 인수분해: x² - 4 = (x+2)(x-2)\n(x+2)(x-2)/(x-2) = x+2\nx→2일 때: 2+2 = 4",
            latex: "\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} (x+2) = 4",
            difficulty: 3,
          },
          {
            problem: "lim(x→∞) (3x² + x)/(x² + 1)를 구하시오.",
            solution: "분자, 분모를 x²으로 나눔\n(3 + 1/x)/(1 + 1/x²)\nx→∞일 때: 3/1 = 3",
            latex: "\\lim_{x \\to \\infty} \\frac{3x^2 + x}{x^2 + 1} = 3",
            difficulty: 4,
          },
        ],
        history: {
          discoveredBy: "오귀스탱 루이 코시, 카를 바이어슈트라스",
          year: "19세기",
          background: "엄밀한 ε-δ 정의는 바이어슈트라스가 확립했다.",
        },
        applications: [
          { field: "미분", description: "도함수의 정의" },
          { field: "적분", description: "정적분의 정의" },
        ],
      },
      en: {
        definition: "The value a function approaches as the variable approaches some value.",
        formulas: [
          {
            latex: "\\lim_{x \\to a} f(x) = L",
            description: "f(x) approaches L as x approaches a",
            variables: [
              { symbol: "a", meaning: "The value x approaches" },
              { symbol: "L", meaning: "The limit value" },
            ],
          },
          {
            latex: "\\lim_{x \\to \\infty} \\frac{1}{x} = 0",
            description: "Limit as x approaches infinity",
          },
        ],
        examples: [
          {
            problem: "Find lim(x→2) (x² - 4)/(x - 2).",
            solution: "Factor numerator: x² - 4 = (x+2)(x-2)\n(x+2)(x-2)/(x-2) = x+2\nAs x→2: 2+2 = 4",
            latex: "\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} (x+2) = 4",
            difficulty: 3,
          },
          {
            problem: "Find lim(x→∞) (3x² + x)/(x² + 1).",
            solution: "Divide by x²\n(3 + 1/x)/(1 + 1/x²)\nAs x→∞: 3/1 = 3",
            latex: "\\lim_{x \\to \\infty} \\frac{3x^2 + x}{x^2 + 1} = 3",
            difficulty: 4,
          },
        ],
        history: {
          discoveredBy: "Augustin-Louis Cauchy, Karl Weierstrass",
          year: "19th century",
          background: "The rigorous ε-δ definition was established by Weierstrass.",
        },
        applications: [
          { field: "Differentiation", description: "Definition of derivative" },
          { field: "Integration", description: "Definition of definite integral" },
        ],
      },
    },
    relations: {
      prerequisites: ["functions", "infinity"],
      nextTopics: ["derivative", "continuity"],
      related: ["sequences", "series"],
      applications: ["calculus"],
    },
    tags: ["analysis", "calculus", "limit", "fundamental"],
  },
  {
    id: "derivative",
    name: {
      ko: "미분 / 도함수",
      en: "Derivative",
      ja: "微分 / 導関数",
    },
    field: "analysis",
    subfield: "differentiation",
    difficulty: 4,
    content: {
      ko: {
        definition: "함수의 순간 변화율, 또는 그래프의 접선의 기울기를 나타낸다.",
        formulas: [
          {
            latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
            description: "도함수의 정의 (극한)",
          },
          {
            latex: "\\frac{d}{dx}(x^n) = nx^{n-1}",
            description: "거듭제곱 미분법",
          },
          {
            latex: "(fg)' = f'g + fg'",
            description: "곱의 미분법",
          },
          {
            latex: "\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}",
            description: "몫의 미분법",
          },
        ],
        examples: [
          {
            problem: "f(x) = x³의 도함수를 구하시오.",
            solution: "거듭제곱 미분법 적용: d/dx(xⁿ) = nxⁿ⁻¹\nf'(x) = 3x²",
            latex: "f'(x) = 3x^2",
            difficulty: 3,
          },
          {
            problem: "f(x) = x²·sin(x)의 도함수를 구하시오.",
            solution: "곱의 미분법: (fg)' = f'g + fg'\nf'(x) = 2x·sin(x) + x²·cos(x)",
            latex: "f'(x) = 2x\\sin(x) + x^2\\cos(x)",
            difficulty: 4,
          },
        ],
        history: {
          discoveredBy: "아이작 뉴턴, 고트프리트 라이프니츠",
          year: "17세기 후반",
          background: "뉴턴과 라이프니츠가 독립적으로 미적분학을 발명했다.",
        },
        applications: [
          { field: "물리학", description: "속도, 가속도 계산" },
          { field: "경제학", description: "한계비용, 한계수익" },
          { field: "최적화", description: "함수의 극대/극소 찾기" },
        ],
      },
      en: {
        definition: "The instantaneous rate of change of a function, or slope of the tangent line.",
        formulas: [
          {
            latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
            description: "Definition of derivative (limit)",
          },
          {
            latex: "\\frac{d}{dx}(x^n) = nx^{n-1}",
            description: "Power rule",
          },
          {
            latex: "(fg)' = f'g + fg'",
            description: "Product rule",
          },
          {
            latex: "\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}",
            description: "Quotient rule",
          },
        ],
        examples: [
          {
            problem: "Find the derivative of f(x) = x³.",
            solution: "Using power rule: d/dx(xⁿ) = nxⁿ⁻¹\nf'(x) = 3x²",
            latex: "f'(x) = 3x^2",
            difficulty: 3,
          },
          {
            problem: "Find the derivative of f(x) = x²·sin(x).",
            solution: "Using product rule: (fg)' = f'g + fg'\nf'(x) = 2x·sin(x) + x²·cos(x)",
            latex: "f'(x) = 2x\\sin(x) + x^2\\cos(x)",
            difficulty: 4,
          },
        ],
        history: {
          discoveredBy: "Isaac Newton, Gottfried Leibniz",
          year: "Late 17th century",
          background: "Newton and Leibniz independently invented calculus.",
        },
        applications: [
          { field: "Physics", description: "Velocity, acceleration" },
          { field: "Economics", description: "Marginal cost, marginal revenue" },
          { field: "Optimization", description: "Finding maxima and minima" },
        ],
      },
    },
    relations: {
      prerequisites: ["limit", "functions"],
      nextTopics: ["integral", "differential-equations"],
      related: ["chain-rule", "implicit-differentiation"],
      applications: ["physics", "optimization"],
    },
    tags: ["analysis", "calculus", "derivative", "fundamental"],
  },
];
