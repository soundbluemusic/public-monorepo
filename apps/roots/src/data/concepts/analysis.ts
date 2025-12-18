/**
 * @fileoverview 해석학 개념 데이터
 */
import type { MathConcept } from "../types";

export const analysisConcepts: MathConcept[] = [
  // ============================================
  // 5.1 극한과 연속 Limits and Continuity
  // ============================================
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
            solution:
              "분자를 인수분해: x² - 4 = (x+2)(x-2)\n(x+2)(x-2)/(x-2) = x+2\nx→2일 때: 2+2 = 4",
            latex: "\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} (x+2) = 4",
            difficulty: 3,
          },
          {
            problem: "lim(x→∞) (3x² + x)/(x² + 1)를 구하시오.",
            solution:
              "분자, 분모를 x²으로 나눔\n(3 + 1/x)/(1 + 1/x²)\nx→∞일 때: 3/1 = 3",
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
        definition:
          "The value a function approaches as the variable approaches some value.",
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
            solution:
              "Factor numerator: x² - 4 = (x+2)(x-2)\n(x+2)(x-2)/(x-2) = x+2\nAs x→2: 2+2 = 4",
            latex: "\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} (x+2) = 4",
            difficulty: 3,
          },
          {
            problem: "Find lim(x→∞) (3x² + x)/(x² + 1).",
            solution:
              "Divide by x²\n(3 + 1/x)/(1 + 1/x²)\nAs x→∞: 3/1 = 3",
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
    id: "continuity",
    name: {
      ko: "연속성",
      en: "Continuity",
      ja: "連続性",
    },
    field: "analysis",
    subfield: "limits-continuity",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "함수가 어떤 점에서 연속이란, 그 점에서 극한값과 함수값이 같다는 것이다.",
        formulas: [
          {
            latex: "\\lim_{x \\to a} f(x) = f(a)",
            description: "연속의 정의",
          },
        ],
        examples: [
          {
            problem: "f(x) = |x|/x가 x=0에서 연속인지 판단하시오.",
            solution:
              "lim(x→0⁺) f(x) = 1\nlim(x→0⁻) f(x) = -1\n좌극한 ≠ 우극한이므로 불연속",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "중간값 정리", description: "연속함수의 중요한 성질" },
          { field: "최대최소 정리", description: "닫힌 구간에서 최대/최소 존재" },
        ],
      },
      en: {
        definition:
          "A function is continuous at a point if the limit equals the function value at that point.",
        formulas: [
          {
            latex: "\\lim_{x \\to a} f(x) = f(a)",
            description: "Definition of continuity",
          },
        ],
        examples: [
          {
            problem: "Is f(x) = |x|/x continuous at x=0?",
            solution:
              "lim(x→0⁺) f(x) = 1\nlim(x→0⁻) f(x) = -1\nLeft limit ≠ right limit, so discontinuous",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Intermediate Value Theorem", description: "Key property of continuous functions" },
          { field: "Extreme Value Theorem", description: "Max/min existence on closed intervals" },
        ],
      },
    },
    relations: {
      prerequisites: ["limit"],
      nextTopics: ["derivative"],
      related: ["intermediate-value-theorem"],
      applications: ["applied-math"],
    },
    tags: ["analysis", "continuity", "calculus"],
  },

  // ============================================
  // 5.2 미분 Differentiation
  // ============================================
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
            solution:
              "곱의 미분법: (fg)' = f'g + fg'\nf'(x) = 2x·sin(x) + x²·cos(x)",
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
        definition:
          "The instantaneous rate of change of a function, or slope of the tangent line.",
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
            solution:
              "Using product rule: (fg)' = f'g + fg'\nf'(x) = 2x·sin(x) + x²·cos(x)",
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
      nextTopics: ["integral", "chain-rule"],
      related: ["implicit-differentiation"],
      applications: ["applied-physics", "applied-economics"],
    },
    tags: ["analysis", "calculus", "derivative", "fundamental"],
  },
  {
    id: "chain-rule",
    name: {
      ko: "연쇄 법칙",
      en: "Chain Rule",
      ja: "連鎖律",
    },
    field: "analysis",
    subfield: "differentiation",
    difficulty: 4,
    content: {
      ko: {
        definition: "합성함수의 미분법으로, 바깥 함수의 미분에 안쪽 함수의 미분을 곱한다.",
        formulas: [
          {
            latex: "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)",
            description: "연쇄 법칙",
          },
          {
            latex: "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}",
            description: "라이프니츠 표기법",
          },
        ],
        examples: [
          {
            problem: "f(x) = sin(x²)의 도함수를 구하시오.",
            solution:
              "외부함수: sin(u), 내부함수: u = x²\nf'(x) = cos(x²) · 2x = 2x cos(x²)",
            latex: "f'(x) = 2x\\cos(x^2)",
            difficulty: 3,
          },
          {
            problem: "f(x) = e^(3x+1)의 도함수를 구하시오.",
            solution: "f'(x) = e^(3x+1) · 3 = 3e^(3x+1)",
            latex: "f'(x) = 3e^{3x+1}",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "물리학", description: "관련 변화율 문제" },
          { field: "신경망", description: "역전파 알고리즘" },
        ],
      },
      en: {
        definition:
          "Differentiation of composite functions: derivative of outer times derivative of inner.",
        formulas: [
          {
            latex: "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)",
            description: "Chain rule",
          },
          {
            latex: "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}",
            description: "Leibniz notation",
          },
        ],
        examples: [
          {
            problem: "Find the derivative of f(x) = sin(x²).",
            solution:
              "Outer: sin(u), Inner: u = x²\nf'(x) = cos(x²) · 2x = 2x cos(x²)",
            latex: "f'(x) = 2x\\cos(x^2)",
            difficulty: 3,
          },
          {
            problem: "Find the derivative of f(x) = e^(3x+1).",
            solution: "f'(x) = e^(3x+1) · 3 = 3e^(3x+1)",
            latex: "f'(x) = 3e^{3x+1}",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Physics", description: "Related rates problems" },
          { field: "Neural Networks", description: "Backpropagation algorithm" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative"],
      nextTopics: ["implicit-differentiation"],
      related: ["composite-functions"],
      applications: ["applied-cs", "applied-physics"],
    },
    tags: ["analysis", "calculus", "chain-rule", "differentiation"],
  },
  {
    id: "derivatives-trig",
    name: {
      ko: "삼각함수의 미분",
      en: "Derivatives of Trigonometric Functions",
      ja: "三角関数の微分",
    },
    field: "analysis",
    subfield: "differentiation",
    difficulty: 3,
    content: {
      ko: {
        definition: "삼각함수들의 도함수 공식이다.",
        formulas: [
          {
            latex: "\\frac{d}{dx}(\\sin x) = \\cos x",
            description: "사인의 미분",
          },
          {
            latex: "\\frac{d}{dx}(\\cos x) = -\\sin x",
            description: "코사인의 미분",
          },
          {
            latex: "\\frac{d}{dx}(\\tan x) = \\sec^2 x",
            description: "탄젠트의 미분",
          },
          {
            latex: "\\frac{d}{dx}(\\sec x) = \\sec x \\tan x",
            description: "시컨트의 미분",
          },
        ],
        examples: [
          {
            problem: "f(x) = sin(3x)의 도함수를 구하시오.",
            solution: "연쇄법칙 적용: f'(x) = cos(3x) · 3 = 3cos(3x)",
            difficulty: 2,
          },
        ],
      },
      en: {
        definition: "Derivative formulas for trigonometric functions.",
        formulas: [
          {
            latex: "\\frac{d}{dx}(\\sin x) = \\cos x",
            description: "Derivative of sine",
          },
          {
            latex: "\\frac{d}{dx}(\\cos x) = -\\sin x",
            description: "Derivative of cosine",
          },
          {
            latex: "\\frac{d}{dx}(\\tan x) = \\sec^2 x",
            description: "Derivative of tangent",
          },
          {
            latex: "\\frac{d}{dx}(\\sec x) = \\sec x \\tan x",
            description: "Derivative of secant",
          },
        ],
        examples: [
          {
            problem: "Find the derivative of f(x) = sin(3x).",
            solution: "Using chain rule: f'(x) = cos(3x) · 3 = 3cos(3x)",
            difficulty: 2,
          },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative", "sine-cosine"],
      nextTopics: ["derivatives-exp-log"],
      related: ["chain-rule"],
      applications: ["applied-physics"],
    },
    tags: ["analysis", "calculus", "differentiation", "trigonometry"],
  },
  {
    id: "derivatives-exp-log",
    name: {
      ko: "지수/로그 함수의 미분",
      en: "Derivatives of Exponential and Logarithmic Functions",
      ja: "指数・対数関数の微分",
    },
    field: "analysis",
    subfield: "differentiation",
    difficulty: 3,
    content: {
      ko: {
        definition: "지수함수와 로그함수의 도함수 공식이다.",
        formulas: [
          {
            latex: "\\frac{d}{dx}(e^x) = e^x",
            description: "자연지수함수의 미분 (자기 자신)",
          },
          {
            latex: "\\frac{d}{dx}(a^x) = a^x \\ln a",
            description: "일반 지수함수의 미분",
          },
          {
            latex: "\\frac{d}{dx}(\\ln x) = \\frac{1}{x}",
            description: "자연로그의 미분",
          },
          {
            latex: "\\frac{d}{dx}(\\log_a x) = \\frac{1}{x \\ln a}",
            description: "일반 로그의 미분",
          },
        ],
        examples: [
          {
            problem: "f(x) = e^(2x)의 도함수를 구하시오.",
            solution: "연쇄법칙: f'(x) = e^(2x) · 2 = 2e^(2x)",
            difficulty: 2,
          },
          {
            problem: "f(x) = ln(x² + 1)의 도함수를 구하시오.",
            solution: "연쇄법칙: f'(x) = (1/(x²+1)) · 2x = 2x/(x²+1)",
            difficulty: 3,
          },
        ],
      },
      en: {
        definition: "Derivative formulas for exponential and logarithmic functions.",
        formulas: [
          {
            latex: "\\frac{d}{dx}(e^x) = e^x",
            description: "Derivative of natural exponential (itself)",
          },
          {
            latex: "\\frac{d}{dx}(a^x) = a^x \\ln a",
            description: "Derivative of general exponential",
          },
          {
            latex: "\\frac{d}{dx}(\\ln x) = \\frac{1}{x}",
            description: "Derivative of natural log",
          },
          {
            latex: "\\frac{d}{dx}(\\log_a x) = \\frac{1}{x \\ln a}",
            description: "Derivative of general log",
          },
        ],
        examples: [
          {
            problem: "Find the derivative of f(x) = e^(2x).",
            solution: "Using chain rule: f'(x) = e^(2x) · 2 = 2e^(2x)",
            difficulty: 2,
          },
          {
            problem: "Find the derivative of f(x) = ln(x² + 1).",
            solution: "Using chain rule: f'(x) = (1/(x²+1)) · 2x = 2x/(x²+1)",
            difficulty: 3,
          },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative", "exponential-function", "logarithm"],
      nextTopics: ["integral"],
      related: ["chain-rule"],
      applications: ["applied-physics", "applied-biology"],
    },
    tags: ["analysis", "calculus", "differentiation", "exponential"],
  },
  {
    id: "higher-derivatives",
    name: {
      ko: "고계 도함수",
      en: "Higher Order Derivatives",
      ja: "高階導関数",
    },
    field: "analysis",
    subfield: "differentiation",
    difficulty: 3,
    content: {
      ko: {
        definition: "도함수를 다시 미분한 것으로, 2차 도함수는 곡률과 관련된다.",
        formulas: [
          {
            latex: "f''(x) = \\frac{d^2y}{dx^2} = \\frac{d}{dx}\\left(\\frac{dy}{dx}\\right)",
            description: "2차 도함수",
          },
          {
            latex: "f^{(n)}(x) = \\frac{d^n y}{dx^n}",
            description: "n차 도함수",
          },
        ],
        examples: [
          {
            problem: "f(x) = x⁴의 1차, 2차, 3차 도함수를 구하시오.",
            solution: "f'(x) = 4x³\nf''(x) = 12x²\nf'''(x) = 24x",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "물리학", description: "가속도 (속도의 미분)" },
          { field: "곡률 분석", description: "오목/볼록 판정" },
        ],
      },
      en: {
        definition:
          "Derivatives of derivatives. The second derivative relates to curvature.",
        formulas: [
          {
            latex: "f''(x) = \\frac{d^2y}{dx^2} = \\frac{d}{dx}\\left(\\frac{dy}{dx}\\right)",
            description: "Second derivative",
          },
          {
            latex: "f^{(n)}(x) = \\frac{d^n y}{dx^n}",
            description: "nth derivative",
          },
        ],
        examples: [
          {
            problem: "Find the first, second, and third derivatives of f(x) = x⁴.",
            solution: "f'(x) = 4x³\nf''(x) = 12x²\nf'''(x) = 24x",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Physics", description: "Acceleration (derivative of velocity)" },
          { field: "Curve Analysis", description: "Concavity determination" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative"],
      nextTopics: ["taylor-series"],
      related: ["concavity"],
      applications: ["applied-physics"],
    },
    tags: ["analysis", "calculus", "differentiation"],
  },

  // ============================================
  // 5.3 적분 Integration
  // ============================================
  {
    id: "indefinite-integral",
    name: {
      ko: "부정적분",
      en: "Indefinite Integral",
      ja: "不定積分",
    },
    field: "analysis",
    subfield: "integration",
    difficulty: 3,
    content: {
      ko: {
        definition: "미분의 역연산으로, 도함수로부터 원래 함수를 찾는다.",
        formulas: [
          {
            latex: "\\int f(x)\\,dx = F(x) + C",
            description: "부정적분의 정의 (C는 적분상수)",
          },
          {
            latex: "\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)",
            description: "거듭제곱 적분",
          },
          {
            latex: "\\int e^x\\,dx = e^x + C",
            description: "지수함수 적분",
          },
          {
            latex: "\\int \\frac{1}{x}\\,dx = \\ln|x| + C",
            description: "역수 적분",
          },
        ],
        examples: [
          {
            problem: "∫ 3x² dx를 구하시오.",
            solution: "∫ 3x² dx = 3 · (x³/3) + C = x³ + C",
            difficulty: 2,
          },
          {
            problem: "∫ (2x + cos x) dx를 구하시오.",
            solution: "= x² + sin x + C",
            difficulty: 2,
          },
        ],
      },
      en: {
        definition:
          "The reverse of differentiation, finding the original function from its derivative.",
        formulas: [
          {
            latex: "\\int f(x)\\,dx = F(x) + C",
            description: "Definition (C is constant of integration)",
          },
          {
            latex: "\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)",
            description: "Power rule for integration",
          },
          {
            latex: "\\int e^x\\,dx = e^x + C",
            description: "Exponential integral",
          },
          {
            latex: "\\int \\frac{1}{x}\\,dx = \\ln|x| + C",
            description: "Integral of reciprocal",
          },
        ],
        examples: [
          {
            problem: "Find ∫ 3x² dx.",
            solution: "∫ 3x² dx = 3 · (x³/3) + C = x³ + C",
            difficulty: 2,
          },
          {
            problem: "Find ∫ (2x + cos x) dx.",
            solution: "= x² + sin x + C",
            difficulty: 2,
          },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative"],
      nextTopics: ["definite-integral"],
      related: ["antiderivative"],
      applications: ["applied-physics"],
    },
    tags: ["analysis", "calculus", "integration", "fundamental"],
  },
  {
    id: "definite-integral",
    name: {
      ko: "정적분",
      en: "Definite Integral",
      ja: "定積分",
    },
    field: "analysis",
    subfield: "integration",
    difficulty: 4,
    content: {
      ko: {
        definition: "함수와 x축 사이의 넓이를 나타내며, 극한으로 정의된다.",
        formulas: [
          {
            latex: "\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i)\\Delta x",
            description: "리만 합의 극한으로 정의",
          },
          {
            latex: "\\int_a^b f(x)\\,dx = F(b) - F(a)",
            description: "미적분학의 기본정리",
          },
        ],
        examples: [
          {
            problem: "∫₀² x² dx를 구하시오.",
            solution: "= [x³/3]₀² = 8/3 - 0 = 8/3",
            latex: "\\int_0^2 x^2\\,dx = \\frac{8}{3}",
            difficulty: 2,
          },
          {
            problem: "∫₀^π sin x dx를 구하시오.",
            solution: "= [-cos x]₀^π = -(-1) - (-1) = 2",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "기하학", description: "곡선 아래 넓이" },
          { field: "물리학", description: "변위, 일" },
        ],
      },
      en: {
        definition:
          "Represents the area between a function and the x-axis, defined as a limit.",
        formulas: [
          {
            latex: "\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i)\\Delta x",
            description: "Defined as limit of Riemann sums",
          },
          {
            latex: "\\int_a^b f(x)\\,dx = F(b) - F(a)",
            description: "Fundamental Theorem of Calculus",
          },
        ],
        examples: [
          {
            problem: "Find ∫₀² x² dx.",
            solution: "= [x³/3]₀² = 8/3 - 0 = 8/3",
            latex: "\\int_0^2 x^2\\,dx = \\frac{8}{3}",
            difficulty: 2,
          },
          {
            problem: "Find ∫₀^π sin x dx.",
            solution: "= [-cos x]₀^π = -(-1) - (-1) = 2",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Geometry", description: "Area under curves" },
          { field: "Physics", description: "Displacement, work" },
        ],
      },
    },
    relations: {
      prerequisites: ["indefinite-integral", "limit"],
      nextTopics: ["integration-techniques"],
      related: ["riemann-sum"],
      applications: ["applied-physics", "applied-engineering"],
    },
    tags: ["analysis", "calculus", "integration", "fundamental"],
  },
  {
    id: "integration-substitution",
    name: {
      ko: "치환적분",
      en: "Integration by Substitution",
      ja: "置換積分",
    },
    field: "analysis",
    subfield: "integration",
    difficulty: 4,
    content: {
      ko: {
        definition: "연쇄법칙의 역으로, 복잡한 적분을 단순하게 만드는 기법이다.",
        formulas: [
          {
            latex: "\\int f(g(x)) \\cdot g'(x)\\,dx = \\int f(u)\\,du",
            description: "치환적분 공식 (u = g(x))",
          },
        ],
        examples: [
          {
            problem: "∫ 2x·e^(x²) dx를 구하시오.",
            solution: "u = x², du = 2x dx\n∫ e^u du = e^u + C = e^(x²) + C",
            difficulty: 3,
          },
          {
            problem: "∫ cos(3x) dx를 구하시오.",
            solution: "u = 3x, du = 3dx\n∫ cos u · (1/3) du = (1/3)sin u + C = (1/3)sin(3x) + C",
            difficulty: 3,
          },
        ],
      },
      en: {
        definition:
          "The reverse of the chain rule, simplifying complex integrals.",
        formulas: [
          {
            latex: "\\int f(g(x)) \\cdot g'(x)\\,dx = \\int f(u)\\,du",
            description: "Substitution formula (u = g(x))",
          },
        ],
        examples: [
          {
            problem: "Find ∫ 2x·e^(x²) dx.",
            solution: "u = x², du = 2x dx\n∫ e^u du = e^u + C = e^(x²) + C",
            difficulty: 3,
          },
          {
            problem: "Find ∫ cos(3x) dx.",
            solution:
              "u = 3x, du = 3dx\n∫ cos u · (1/3) du = (1/3)sin u + C = (1/3)sin(3x) + C",
            difficulty: 3,
          },
        ],
      },
    },
    relations: {
      prerequisites: ["indefinite-integral", "chain-rule"],
      nextTopics: ["integration-by-parts"],
      related: ["u-substitution"],
      applications: [],
    },
    tags: ["analysis", "calculus", "integration", "technique"],
  },
  {
    id: "integration-by-parts",
    name: {
      ko: "부분적분",
      en: "Integration by Parts",
      ja: "部分積分",
    },
    field: "analysis",
    subfield: "integration",
    difficulty: 4,
    content: {
      ko: {
        definition: "곱의 미분법의 역으로, 두 함수의 곱을 적분하는 기법이다.",
        formulas: [
          {
            latex: "\\int u\\,dv = uv - \\int v\\,du",
            description: "부분적분 공식",
          },
        ],
        examples: [
          {
            problem: "∫ x·e^x dx를 구하시오.",
            solution:
              "u = x, dv = e^x dx\ndu = dx, v = e^x\n= xe^x - ∫ e^x dx = xe^x - e^x + C",
            difficulty: 3,
          },
          {
            problem: "∫ x·cos x dx를 구하시오.",
            solution:
              "u = x, dv = cos x dx\ndu = dx, v = sin x\n= x sin x - ∫ sin x dx = x sin x + cos x + C",
            difficulty: 3,
          },
        ],
      },
      en: {
        definition:
          "The reverse of the product rule, for integrating products of functions.",
        formulas: [
          {
            latex: "\\int u\\,dv = uv - \\int v\\,du",
            description: "Integration by parts formula",
          },
        ],
        examples: [
          {
            problem: "Find ∫ x·e^x dx.",
            solution:
              "u = x, dv = e^x dx\ndu = dx, v = e^x\n= xe^x - ∫ e^x dx = xe^x - e^x + C",
            difficulty: 3,
          },
          {
            problem: "Find ∫ x·cos x dx.",
            solution:
              "u = x, dv = cos x dx\ndu = dx, v = sin x\n= x sin x - ∫ sin x dx = x sin x + cos x + C",
            difficulty: 3,
          },
        ],
      },
    },
    relations: {
      prerequisites: ["indefinite-integral", "derivative"],
      nextTopics: ["partial-fractions"],
      related: ["product-rule"],
      applications: [],
    },
    tags: ["analysis", "calculus", "integration", "technique"],
  },

  // ============================================
  // 5.4 급수 Series
  // ============================================
  {
    id: "taylor-series",
    name: {
      ko: "테일러 급수",
      en: "Taylor Series",
      ja: "テイラー級数",
    },
    field: "analysis",
    subfield: "series-sequences",
    difficulty: 5,
    content: {
      ko: {
        definition: "함수를 무한 다항식으로 표현하는 급수 전개이다.",
        formulas: [
          {
            latex:
              "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n",
            description: "테일러 급수 (x=a 주위)",
          },
          {
            latex: "e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + ...",
            description: "자연지수함수의 테일러 급수",
          },
          {
            latex: "\\sin x = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}",
            description: "사인함수의 테일러 급수",
          },
          {
            latex: "\\cos x = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{(2n)!}",
            description: "코사인함수의 테일러 급수",
          },
        ],
        examples: [
          {
            problem: "e^x의 x=0에서의 4차까지 테일러 다항식을 구하시오.",
            solution: "P₄(x) = 1 + x + x²/2! + x³/3! + x⁴/4! = 1 + x + x²/2 + x³/6 + x⁴/24",
            difficulty: 4,
          },
        ],
        history: {
          discoveredBy: "브룩 테일러",
          year: "1715년",
          background: "콜린 매클로린이 x=0 특수 케이스를 연구했다.",
        },
        applications: [
          { field: "근사 계산", description: "복잡한 함수의 다항식 근사" },
          { field: "물리학", description: "선형화, 섭동 이론" },
          { field: "컴퓨터", description: "삼각/지수 함수 계산" },
        ],
      },
      en: {
        definition:
          "A series expansion that represents a function as an infinite polynomial.",
        formulas: [
          {
            latex:
              "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n",
            description: "Taylor series about x=a",
          },
          {
            latex: "e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + ...",
            description: "Taylor series for e^x",
          },
          {
            latex: "\\sin x = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}",
            description: "Taylor series for sine",
          },
          {
            latex: "\\cos x = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{(2n)!}",
            description: "Taylor series for cosine",
          },
        ],
        examples: [
          {
            problem: "Find the Taylor polynomial of degree 4 for e^x about x=0.",
            solution:
              "P₄(x) = 1 + x + x²/2! + x³/3! + x⁴/4! = 1 + x + x²/2 + x³/6 + x⁴/24",
            difficulty: 4,
          },
        ],
        history: {
          discoveredBy: "Brook Taylor",
          year: "1715",
          background: "Colin Maclaurin studied the special case at x=0.",
        },
        applications: [
          { field: "Approximation", description: "Polynomial approximation of functions" },
          { field: "Physics", description: "Linearization, perturbation theory" },
          { field: "Computing", description: "Trig/exponential function calculation" },
        ],
      },
    },
    relations: {
      prerequisites: ["higher-derivatives", "series"],
      nextTopics: ["fourier-series"],
      related: ["maclaurin-series"],
      applications: ["applied-physics", "applied-cs"],
    },
    tags: ["analysis", "series", "taylor", "advanced"],
  },

  // ============================================
  // 5.5 다변수 미적분 Multivariable Calculus
  // ============================================
  {
    id: "partial-derivative",
    name: {
      ko: "편미분",
      en: "Partial Derivative",
      ja: "偏微分",
    },
    field: "analysis",
    subfield: "multivariable",
    difficulty: 4,
    content: {
      ko: {
        definition: "다변수 함수에서 하나의 변수에 대해서만 미분하는 것이다.",
        formulas: [
          {
            latex: "\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h, y) - f(x, y)}{h}",
            description: "x에 대한 편미분 정의",
          },
          {
            latex: "\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right)",
            description: "그래디언트 (기울기 벡터)",
          },
        ],
        examples: [
          {
            problem: "f(x, y) = x²y + xy³에서 ∂f/∂x를 구하시오.",
            solution: "y를 상수로 보고 x로 미분\n∂f/∂x = 2xy + y³",
            difficulty: 3,
          },
          {
            problem: "f(x, y) = x²y + xy³에서 ∂f/∂y를 구하시오.",
            solution: "x를 상수로 보고 y로 미분\n∂f/∂y = x² + 3xy²",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "최적화", description: "다변수 함수의 극값" },
          { field: "머신러닝", description: "손실함수 최소화" },
          { field: "물리학", description: "열방정식, 파동방정식" },
        ],
      },
      en: {
        definition:
          "Differentiating a multivariable function with respect to one variable while holding others constant.",
        formulas: [
          {
            latex: "\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h, y) - f(x, y)}{h}",
            description: "Definition of partial derivative w.r.t. x",
          },
          {
            latex: "\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right)",
            description: "Gradient vector",
          },
        ],
        examples: [
          {
            problem: "Find ∂f/∂x for f(x, y) = x²y + xy³.",
            solution: "Treat y as constant, differentiate w.r.t. x\n∂f/∂x = 2xy + y³",
            difficulty: 3,
          },
          {
            problem: "Find ∂f/∂y for f(x, y) = x²y + xy³.",
            solution: "Treat x as constant, differentiate w.r.t. y\n∂f/∂y = x² + 3xy²",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Optimization", description: "Extrema of multivariable functions" },
          { field: "Machine Learning", description: "Loss function minimization" },
          { field: "Physics", description: "Heat equation, wave equation" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative"],
      nextTopics: ["gradient", "multiple-integrals"],
      related: ["directional-derivative"],
      applications: ["applied-cs", "applied-physics"],
    },
    tags: ["analysis", "calculus", "multivariable", "partial"],
  },
  {
    id: "multiple-integrals",
    name: {
      ko: "중적분",
      en: "Multiple Integrals",
      ja: "重積分",
    },
    field: "analysis",
    subfield: "multivariable",
    difficulty: 4,
    content: {
      ko: {
        definition: "여러 변수에 대해 적분하는 것으로, 부피나 질량 등을 계산한다.",
        formulas: [
          {
            latex: "\\iint_R f(x,y)\\,dA = \\int_a^b \\int_c^d f(x,y)\\,dy\\,dx",
            description: "이중적분 (반복적분)",
          },
          {
            latex: "\\iiint_V f(x,y,z)\\,dV",
            description: "삼중적분",
          },
        ],
        examples: [
          {
            problem: "∫∫_R xy dA (R: 0≤x≤1, 0≤y≤2)를 구하시오.",
            solution:
              "= ∫₀¹ ∫₀² xy dy dx\n= ∫₀¹ [xy²/2]₀² dx\n= ∫₀¹ 2x dx = [x²]₀¹ = 1",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "물리학", description: "질량, 관성 모멘트" },
          { field: "공학", description: "부피 계산" },
        ],
      },
      en: {
        definition:
          "Integration over multiple variables, used to compute volume, mass, etc.",
        formulas: [
          {
            latex: "\\iint_R f(x,y)\\,dA = \\int_a^b \\int_c^d f(x,y)\\,dy\\,dx",
            description: "Double integral (iterated)",
          },
          {
            latex: "\\iiint_V f(x,y,z)\\,dV",
            description: "Triple integral",
          },
        ],
        examples: [
          {
            problem: "Find ∫∫_R xy dA where R: 0≤x≤1, 0≤y≤2.",
            solution:
              "= ∫₀¹ ∫₀² xy dy dx\n= ∫₀¹ [xy²/2]₀² dx\n= ∫₀¹ 2x dx = [x²]₀¹ = 1",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Physics", description: "Mass, moment of inertia" },
          { field: "Engineering", description: "Volume calculation" },
        ],
      },
    },
    relations: {
      prerequisites: ["definite-integral", "partial-derivative"],
      nextTopics: ["surface-integrals"],
      related: ["jacobian"],
      applications: ["applied-physics", "applied-engineering"],
    },
    tags: ["analysis", "calculus", "multivariable", "integration"],
  },
];
