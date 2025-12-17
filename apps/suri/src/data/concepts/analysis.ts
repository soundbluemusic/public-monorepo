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

  // ===== 5.1 극한과 연속 (Limits and Continuity) =====
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
          "함수 f가 점 a에서 연속이란, a에서의 극한값과 함수값이 존재하고 같다는 것입니다.",
        formulas: [
          {
            latex: "\\lim_{x \\to a} f(x) = f(a)",
            description: "연속의 정의",
          },
          {
            latex:
              "\\forall \\varepsilon > 0, \\exists \\delta > 0: |x - a| < \\delta \\Rightarrow |f(x) - f(a)| < \\varepsilon",
            description: "ε-δ 정의",
          },
        ],
        examples: [
          {
            problem: "f(x) = x²이 x = 2에서 연속임을 보이세요.",
            solution:
              "lim(x→2) x² = 4 = f(2)이므로 연속입니다.",
          },
        ],
        applications: [
          { field: "미적분", description: "중간값 정리, 최대최소 정리" },
          { field: "해석학", description: "함수의 성질 분석" },
        ],
      },
      en: {
        definition:
          "A function f is continuous at point a if the limit and function value both exist and are equal.",
        formulas: [
          {
            latex: "\\lim_{x \\to a} f(x) = f(a)",
            description: "Definition of continuity",
          },
          {
            latex:
              "\\forall \\varepsilon > 0, \\exists \\delta > 0: |x - a| < \\delta \\Rightarrow |f(x) - f(a)| < \\varepsilon",
            description: "ε-δ definition",
          },
        ],
        examples: [
          {
            problem: "Show that f(x) = x² is continuous at x = 2.",
            solution: "lim(x→2) x² = 4 = f(2), so it's continuous.",
          },
        ],
        applications: [
          { field: "Calculus", description: "Intermediate value theorem, extreme value theorem" },
          { field: "Analysis", description: "Function property analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["limit"],
      nextTopics: ["derivative", "intermediate-value-theorem"],
      related: ["uniform-continuity"],
    },
    tags: ["연속", "해석학", "continuity", "analysis"],
  },
  {
    id: "epsilon-delta",
    name: {
      ko: "엡실론-델타 정의",
      en: "Epsilon-Delta Definition",
      ja: "イプシロン・デルタ定義",
    },
    field: "analysis",
    subfield: "limits-continuity",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "극한의 엄밀한 정의로, 임의의 ε > 0에 대해 적당한 δ > 0가 존재하여 조건을 만족함을 보입니다.",
        formulas: [
          {
            latex:
              "\\lim_{x \\to a} f(x) = L \\Leftrightarrow \\forall \\varepsilon > 0, \\exists \\delta > 0: 0 < |x - a| < \\delta \\Rightarrow |f(x) - L| < \\varepsilon",
            description: "극한의 ε-δ 정의",
          },
        ],
        examples: [
          {
            problem: "ε-δ 정의로 lim(x→2) 3x = 6을 증명하세요.",
            solution:
              "|3x - 6| < ε가 되려면 |x - 2| < ε/3이 필요합니다. δ = ε/3으로 선택하면 됩니다.",
          },
        ],
        history: {
          discoveredBy: "카를 바이어슈트라스",
          year: "1861",
          background:
            "해석학의 기초를 엄밀하게 세우는 데 기여했습니다.",
        },
      },
      en: {
        definition:
          "The rigorous definition of a limit, showing that for any ε > 0, there exists δ > 0 satisfying the condition.",
        formulas: [
          {
            latex:
              "\\lim_{x \\to a} f(x) = L \\Leftrightarrow \\forall \\varepsilon > 0, \\exists \\delta > 0: 0 < |x - a| < \\delta \\Rightarrow |f(x) - L| < \\varepsilon",
            description: "ε-δ definition of limit",
          },
        ],
        examples: [
          {
            problem: "Prove lim(x→2) 3x = 6 using ε-δ definition.",
            solution:
              "We need |3x - 6| < ε, which requires |x - 2| < ε/3. Choose δ = ε/3.",
          },
        ],
        history: {
          discoveredBy: "Karl Weierstrass",
          year: "1861",
          background:
            "Contributed to establishing rigorous foundations of analysis.",
        },
      },
    },
    relations: {
      prerequisites: ["limit"],
      nextTopics: ["continuity", "uniform-continuity"],
      related: ["real-analysis"],
    },
    tags: ["엡실론델타", "극한", "epsilon-delta", "limit"],
  },

  // ===== 5.2 미분 (Differentiation) =====
  {
    id: "chain-rule",
    name: {
      ko: "연쇄 법칙",
      en: "Chain Rule",
      ja: "合成関数の微分",
    },
    field: "analysis",
    subfield: "differentiation",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "합성함수의 미분 법칙으로, 바깥 함수의 도함수에 안쪽 함수의 도함수를 곱합니다.",
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
            problem: "y = sin(x²)의 도함수를 구하세요.",
            solution:
              "dy/dx = cos(x²) · 2x = 2x cos(x²)",
          },
          {
            problem: "y = (3x + 1)⁵의 도함수를 구하세요.",
            solution: "dy/dx = 5(3x + 1)⁴ · 3 = 15(3x + 1)⁴",
          },
        ],
        applications: [
          { field: "물리학", description: "관련 비율 문제" },
          { field: "최적화", description: "복잡한 함수의 미분" },
        ],
      },
      en: {
        definition:
          "The chain rule for differentiating composite functions multiplies the outer derivative by the inner derivative.",
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
            problem: "Find the derivative of y = sin(x²).",
            solution: "dy/dx = cos(x²) · 2x = 2x cos(x²)",
          },
        ],
        applications: [
          { field: "Physics", description: "Related rates problems" },
          { field: "Optimization", description: "Differentiating complex functions" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative"],
      nextTopics: ["implicit-differentiation"],
      related: ["product-rule", "quotient-rule"],
    },
    tags: ["연쇄법칙", "합성함수", "chain rule", "composite function"],
  },
  {
    id: "implicit-differentiation",
    name: {
      ko: "음함수 미분",
      en: "Implicit Differentiation",
      ja: "陰関数の微分",
    },
    field: "analysis",
    subfield: "differentiation",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "y가 x의 명시적 함수가 아닐 때, 방정식 양변을 x에 대해 미분하여 dy/dx를 구합니다.",
        formulas: [
          {
            latex: "\\frac{d}{dx}[y^n] = ny^{n-1}\\frac{dy}{dx}",
            description: "y의 거듭제곱 미분",
          },
        ],
        examples: [
          {
            problem: "x² + y² = 25에서 dy/dx를 구하세요.",
            solution:
              "2x + 2y(dy/dx) = 0, dy/dx = -x/y",
          },
        ],
        applications: [
          { field: "기하학", description: "곡선의 접선" },
          { field: "최적화", description: "제약 조건이 있는 문제" },
        ],
      },
      en: {
        definition:
          "When y is not explicitly a function of x, differentiate both sides with respect to x to find dy/dx.",
        formulas: [
          {
            latex: "\\frac{d}{dx}[y^n] = ny^{n-1}\\frac{dy}{dx}",
            description: "Power of y differentiation",
          },
        ],
        examples: [
          {
            problem: "Find dy/dx for x² + y² = 25.",
            solution: "2x + 2y(dy/dx) = 0, dy/dx = -x/y",
          },
        ],
        applications: [
          { field: "Geometry", description: "Tangent lines to curves" },
          { field: "Optimization", description: "Constrained problems" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative", "chain-rule"],
      nextTopics: ["related-rates"],
      related: ["implicit-function-theorem"],
    },
    tags: ["음함수미분", "미분", "implicit differentiation"],
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
        definition:
          "도함수를 다시 미분한 것입니다. 이계 도함수는 곡률, 가속도 등을 나타냅니다.",
        formulas: [
          {
            latex: "f''(x) = \\frac{d^2y}{dx^2} = \\frac{d}{dx}\\left(\\frac{dy}{dx}\\right)",
            description: "이계 도함수",
          },
          {
            latex: "f^{(n)}(x) = \\frac{d^ny}{dx^n}",
            description: "n계 도함수",
          },
        ],
        examples: [
          {
            problem: "f(x) = x⁴의 1~4계 도함수를 구하세요.",
            solution:
              "f'(x) = 4x³, f''(x) = 12x², f'''(x) = 24x, f⁴(x) = 24",
          },
        ],
        applications: [
          { field: "물리학", description: "위치 → 속도 → 가속도 → 저크" },
          { field: "곡선 분석", description: "변곡점, 오목/볼록 판정" },
        ],
      },
      en: {
        definition:
          "Derivatives of derivatives. Second derivative represents curvature, acceleration, etc.",
        formulas: [
          {
            latex: "f''(x) = \\frac{d^2y}{dx^2}",
            description: "Second derivative",
          },
          {
            latex: "f^{(n)}(x) = \\frac{d^ny}{dx^n}",
            description: "nth derivative",
          },
        ],
        examples: [
          {
            problem: "Find the 1st through 4th derivatives of f(x) = x⁴.",
            solution:
              "f'(x) = 4x³, f''(x) = 12x², f'''(x) = 24x, f⁴(x) = 24",
          },
        ],
        applications: [
          { field: "Physics", description: "Position → velocity → acceleration → jerk" },
          { field: "Curve Analysis", description: "Inflection points, concavity" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative"],
      nextTopics: ["taylor-series"],
      related: ["concavity"],
    },
    tags: ["고계도함수", "이계도함수", "higher derivatives"],
  },

  // ===== 5.3 적분 (Integration) =====
  {
    id: "integral",
    name: {
      ko: "적분",
      en: "Integral",
      ja: "積分",
    },
    field: "analysis",
    subfield: "integration",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "적분은 미분의 역연산으로, 부정적분(원시함수)과 정적분(넓이)으로 나뉩니다.",
        formulas: [
          {
            latex: "\\int f(x)\\,dx = F(x) + C",
            description: "부정적분 (F'(x) = f(x))",
          },
          {
            latex: "\\int_a^b f(x)\\,dx = F(b) - F(a)",
            description: "정적분 (미적분의 기본정리)",
          },
          {
            latex: "\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)",
            description: "거듭제곱 적분",
          },
        ],
        examples: [
          {
            problem: "∫(3x² + 2x)dx를 구하세요.",
            solution: "∫3x²dx + ∫2xdx = x³ + x² + C",
          },
          {
            problem: "∫₀¹ x²dx를 구하세요.",
            solution: "[x³/3]₀¹ = 1/3 - 0 = 1/3",
          },
        ],
        history: {
          discoveredBy: "아이작 뉴턴, 고트프리트 라이프니츠",
          year: "17세기",
          background:
            "미적분학의 기본정리가 미분과 적분의 관계를 확립했습니다.",
        },
        applications: [
          { field: "물리학", description: "일, 에너지, 유량 계산" },
          { field: "기하학", description: "넓이, 부피 계산" },
          { field: "확률론", description: "확률 밀도 함수의 적분" },
        ],
      },
      en: {
        definition:
          "Integration is the reverse of differentiation, divided into indefinite integrals (antiderivatives) and definite integrals (area).",
        formulas: [
          {
            latex: "\\int f(x)\\,dx = F(x) + C",
            description: "Indefinite integral (F'(x) = f(x))",
          },
          {
            latex: "\\int_a^b f(x)\\,dx = F(b) - F(a)",
            description: "Definite integral (Fundamental theorem)",
          },
        ],
        examples: [
          {
            problem: "Find ∫(3x² + 2x)dx.",
            solution: "∫3x²dx + ∫2xdx = x³ + x² + C",
          },
        ],
        history: {
          discoveredBy: "Isaac Newton, Gottfried Leibniz",
          year: "17th century",
          background:
            "The fundamental theorem of calculus established the connection between differentiation and integration.",
        },
        applications: [
          { field: "Physics", description: "Work, energy, flow calculations" },
          { field: "Geometry", description: "Area, volume calculations" },
          { field: "Probability", description: "Integration of probability density functions" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative"],
      nextTopics: ["integration-techniques", "improper-integral"],
      related: ["fundamental-theorem-calculus"],
    },
    tags: ["적분", "미적분", "integral", "calculus"],
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
        definition:
          "곱의 미분법을 역으로 적용한 적분 기법입니다.",
        formulas: [
          {
            latex: "\\int u\\,dv = uv - \\int v\\,du",
            description: "부분적분 공식",
          },
          {
            latex: "\\int u(x)v'(x)\\,dx = u(x)v(x) - \\int u'(x)v(x)\\,dx",
            description: "함수 형태",
          },
        ],
        examples: [
          {
            problem: "∫x·eˣdx를 구하세요.",
            solution:
              "u = x, dv = eˣdx로 놓으면, du = dx, v = eˣ\n∫xeˣdx = xeˣ - ∫eˣdx = xeˣ - eˣ + C = eˣ(x - 1) + C",
          },
        ],
        applications: [
          { field: "적분", description: "로그, 역삼각함수 적분" },
          { field: "물리학", description: "일과 에너지 계산" },
        ],
      },
      en: {
        definition:
          "An integration technique that reverses the product rule.",
        formulas: [
          {
            latex: "\\int u\\,dv = uv - \\int v\\,du",
            description: "Integration by parts formula",
          },
        ],
        examples: [
          {
            problem: "Find ∫x·eˣdx.",
            solution:
              "Let u = x, dv = eˣdx. Then du = dx, v = eˣ\n∫xeˣdx = xeˣ - ∫eˣdx = xeˣ - eˣ + C",
          },
        ],
        applications: [
          { field: "Integration", description: "Logarithm, inverse trig integrals" },
          { field: "Physics", description: "Work and energy calculations" },
        ],
      },
    },
    relations: {
      prerequisites: ["integral", "derivative"],
      nextTopics: ["reduction-formulas"],
      related: ["product-rule"],
    },
    tags: ["부분적분", "적분기법", "integration by parts"],
  },
  {
    id: "substitution",
    name: {
      ko: "치환적분",
      en: "Integration by Substitution",
      ja: "置換積分",
    },
    field: "analysis",
    subfield: "integration",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "연쇄법칙을 역으로 적용한 적분 기법으로, 변수를 치환하여 적분을 간단히 합니다.",
        formulas: [
          {
            latex: "\\int f(g(x))g'(x)\\,dx = \\int f(u)\\,du",
            description: "치환적분 (u = g(x))",
          },
        ],
        examples: [
          {
            problem: "∫2x·cos(x²)dx를 구하세요.",
            solution:
              "u = x², du = 2xdx\n∫cos(u)du = sin(u) + C = sin(x²) + C",
          },
        ],
        applications: [
          { field: "적분", description: "복잡한 합성함수 적분" },
        ],
      },
      en: {
        definition:
          "An integration technique that reverses the chain rule by substituting variables.",
        formulas: [
          {
            latex: "\\int f(g(x))g'(x)\\,dx = \\int f(u)\\,du",
            description: "Substitution (u = g(x))",
          },
        ],
        examples: [
          {
            problem: "Find ∫2x·cos(x²)dx.",
            solution:
              "Let u = x², du = 2xdx\n∫cos(u)du = sin(u) + C = sin(x²) + C",
          },
        ],
        applications: [
          { field: "Integration", description: "Integrating complex composite functions" },
        ],
      },
    },
    relations: {
      prerequisites: ["integral", "chain-rule"],
      nextTopics: ["trig-substitution"],
      related: ["chain-rule"],
    },
    tags: ["치환적분", "적분기법", "substitution", "u-substitution"],
  },
  {
    id: "improper-integral",
    name: {
      ko: "이상적분",
      en: "Improper Integral",
      ja: "広義積分",
    },
    field: "analysis",
    subfield: "integration",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "적분 구간이 무한이거나 피적분함수에 불연속점이 있는 적분입니다.",
        formulas: [
          {
            latex: "\\int_a^{\\infty} f(x)\\,dx = \\lim_{t \\to \\infty} \\int_a^t f(x)\\,dx",
            description: "무한 구간 적분",
          },
          {
            latex: "\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx = \\lim_{\\varepsilon \\to 0^+} \\int_{\\varepsilon}^1 \\frac{1}{\\sqrt{x}}\\,dx",
            description: "불연속점이 있는 적분",
          },
        ],
        examples: [
          {
            problem: "∫₁^∞ 1/x²dx를 구하세요.",
            solution:
              "lim(t→∞)[−1/x]₁^t = lim(t→∞)(−1/t + 1) = 1 (수렴)",
          },
        ],
        applications: [
          { field: "확률론", description: "정규분포 적분" },
          { field: "물리학", description: "무한 범위의 적분" },
        ],
      },
      en: {
        definition:
          "An integral where the interval is infinite or the integrand has discontinuities.",
        formulas: [
          {
            latex: "\\int_a^{\\infty} f(x)\\,dx = \\lim_{t \\to \\infty} \\int_a^t f(x)\\,dx",
            description: "Infinite interval integral",
          },
        ],
        examples: [
          {
            problem: "Find ∫₁^∞ 1/x²dx.",
            solution:
              "lim(t→∞)[−1/x]₁^t = lim(t→∞)(−1/t + 1) = 1 (converges)",
          },
        ],
        applications: [
          { field: "Probability", description: "Normal distribution integral" },
          { field: "Physics", description: "Integration over infinite ranges" },
        ],
      },
    },
    relations: {
      prerequisites: ["integral", "limit"],
      nextTopics: ["convergence-tests"],
      related: ["gamma-function"],
    },
    tags: ["이상적분", "무한적분", "improper integral"],
  },

  // ===== 5.4 급수 (Series) =====
  {
    id: "sequences",
    name: {
      ko: "수열",
      en: "Sequences",
      ja: "数列",
    },
    field: "analysis",
    subfield: "sequences-series",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "수열은 자연수에서 실수로의 함수입니다. 수렴 또는 발산할 수 있습니다.",
        formulas: [
          {
            latex: "\\{a_n\\} = a_1, a_2, a_3, \\ldots",
            description: "수열의 표기",
          },
          {
            latex: "\\lim_{n \\to \\infty} a_n = L",
            description: "수열의 극한",
          },
        ],
        examples: [
          {
            problem: "aₙ = 1/n의 극한을 구하세요.",
            solution: "lim(n→∞) 1/n = 0",
          },
          {
            problem: "등차수열 2, 5, 8, 11, ...의 일반항을 구하세요.",
            solution: "aₙ = 2 + (n-1)·3 = 3n - 1",
          },
        ],
      },
      en: {
        definition:
          "A sequence is a function from natural numbers to real numbers. It can converge or diverge.",
        formulas: [
          {
            latex: "\\{a_n\\} = a_1, a_2, a_3, \\ldots",
            description: "Sequence notation",
          },
          {
            latex: "\\lim_{n \\to \\infty} a_n = L",
            description: "Limit of a sequence",
          },
        ],
        examples: [
          {
            problem: "Find the limit of aₙ = 1/n.",
            solution: "lim(n→∞) 1/n = 0",
          },
        ],
      },
    },
    relations: {
      prerequisites: ["limit"],
      nextTopics: ["series", "convergence-tests"],
      related: ["recurrence-relation"],
    },
    tags: ["수열", "극한", "sequences", "limits"],
  },
  {
    id: "series",
    name: {
      ko: "급수",
      en: "Series",
      ja: "級数",
    },
    field: "analysis",
    subfield: "sequences-series",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "급수는 수열의 항들을 더한 것입니다. 부분합의 극한이 존재하면 수렴합니다.",
        formulas: [
          {
            latex: "\\sum_{n=1}^{\\infty} a_n = \\lim_{N \\to \\infty} \\sum_{n=1}^{N} a_n",
            description: "급수의 정의",
          },
          {
            latex: "\\sum_{n=0}^{\\infty} r^n = \\frac{1}{1-r} \\quad (|r| < 1)",
            description: "기하급수",
          },
        ],
        examples: [
          {
            problem: "Σ(1/2)ⁿ (n=0부터 ∞)을 구하세요.",
            solution: "= 1/(1 - 1/2) = 2",
          },
        ],
        applications: [
          { field: "수학", description: "함수의 급수 표현" },
          { field: "물리학", description: "푸리에 급수, 파동 분석" },
        ],
      },
      en: {
        definition:
          "A series is the sum of terms in a sequence. It converges if the limit of partial sums exists.",
        formulas: [
          {
            latex: "\\sum_{n=1}^{\\infty} a_n = \\lim_{N \\to \\infty} \\sum_{n=1}^{N} a_n",
            description: "Definition of series",
          },
          {
            latex: "\\sum_{n=0}^{\\infty} r^n = \\frac{1}{1-r} \\quad (|r| < 1)",
            description: "Geometric series",
          },
        ],
        examples: [
          {
            problem: "Find Σ(1/2)ⁿ (n=0 to ∞).",
            solution: "= 1/(1 - 1/2) = 2",
          },
        ],
        applications: [
          { field: "Mathematics", description: "Series representation of functions" },
          { field: "Physics", description: "Fourier series, wave analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["sequences"],
      nextTopics: ["taylor-series", "power-series"],
      related: ["convergence-tests"],
    },
    tags: ["급수", "무한급수", "series", "infinite series"],
  },
  {
    id: "taylor-series",
    name: {
      ko: "테일러 급수",
      en: "Taylor Series",
      ja: "テイラー級数",
    },
    field: "analysis",
    subfield: "sequences-series",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "테일러 급수는 함수를 한 점 근처에서 다항식의 무한 합으로 표현합니다.",
        formulas: [
          {
            latex: "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n",
            description: "테일러 급수",
          },
          {
            latex: "e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}",
            description: "eˣ의 테일러 급수",
          },
          {
            latex: "\\sin x = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}",
            description: "sin x의 테일러 급수",
          },
        ],
        examples: [
          {
            problem: "f(x) = eˣ의 매클로린 급수를 구하세요.",
            solution:
              "eˣ = 1 + x + x²/2! + x³/3! + ... = Σ(xⁿ/n!)",
          },
        ],
        history: {
          discoveredBy: "브룩 테일러, 콜린 매클로린",
          year: "1715",
          background:
            "테일러가 일반 공식을, 매클로린이 x=0에서의 특수 경우를 연구했습니다.",
        },
        applications: [
          { field: "수치 해석", description: "함수 근사 계산" },
          { field: "물리학", description: "미분방정식의 근사해" },
          { field: "컴퓨터 과학", description: "삼각함수, 지수함수 계산" },
        ],
      },
      en: {
        definition:
          "Taylor series represents a function as an infinite sum of polynomials around a point.",
        formulas: [
          {
            latex: "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n",
            description: "Taylor series",
          },
          {
            latex: "e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}",
            description: "Taylor series of eˣ",
          },
        ],
        examples: [
          {
            problem: "Find the Maclaurin series of f(x) = eˣ.",
            solution: "eˣ = 1 + x + x²/2! + x³/3! + ... = Σ(xⁿ/n!)",
          },
        ],
        history: {
          discoveredBy: "Brook Taylor, Colin Maclaurin",
          year: "1715",
          background:
            "Taylor developed the general formula; Maclaurin studied the special case at x=0.",
        },
        applications: [
          { field: "Numerical Analysis", description: "Function approximation" },
          { field: "Physics", description: "Approximate solutions to differential equations" },
          { field: "Computer Science", description: "Computing trig, exponential functions" },
        ],
      },
    },
    relations: {
      prerequisites: ["higher-derivatives", "series"],
      nextTopics: ["power-series"],
      related: ["maclaurin-series"],
    },
    tags: ["테일러급수", "매클로린급수", "Taylor series", "power series"],
  },

  // ===== 5.5 미분방정식 (Differential Equations) =====
  {
    id: "ode",
    name: {
      ko: "상미분방정식",
      en: "Ordinary Differential Equation",
      ja: "常微分方程式",
    },
    field: "analysis",
    subfield: "differential-equations",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "상미분방정식(ODE)은 하나의 독립변수에 대한 함수와 그 도함수들의 관계식입니다.",
        formulas: [
          {
            latex: "\\frac{dy}{dx} = f(x, y)",
            description: "1계 상미분방정식",
          },
          {
            latex: "\\frac{d^2y}{dx^2} + p(x)\\frac{dy}{dx} + q(x)y = r(x)",
            description: "2계 선형 ODE",
          },
        ],
        examples: [
          {
            problem: "dy/dx = 2x를 풀이하세요.",
            solution: "y = ∫2x dx = x² + C",
          },
          {
            problem: "dy/dx = ky (지수 성장)를 풀이하세요.",
            solution: "y = Ceᵏˣ",
          },
        ],
        applications: [
          { field: "물리학", description: "운동 방정식, 회로 분석" },
          { field: "생물학", description: "인구 성장 모델" },
          { field: "공학", description: "제어 시스템" },
        ],
      },
      en: {
        definition:
          "An ordinary differential equation (ODE) relates a function of one variable to its derivatives.",
        formulas: [
          {
            latex: "\\frac{dy}{dx} = f(x, y)",
            description: "First-order ODE",
          },
          {
            latex: "\\frac{d^2y}{dx^2} + p(x)\\frac{dy}{dx} + q(x)y = r(x)",
            description: "Second-order linear ODE",
          },
        ],
        examples: [
          {
            problem: "Solve dy/dx = 2x.",
            solution: "y = ∫2x dx = x² + C",
          },
        ],
        applications: [
          { field: "Physics", description: "Equations of motion, circuit analysis" },
          { field: "Biology", description: "Population growth models" },
          { field: "Engineering", description: "Control systems" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative", "integral"],
      nextTopics: ["pde", "laplace-transform"],
      related: ["initial-value-problem"],
    },
    tags: ["상미분방정식", "ODE", "differential equations"],
  },
  {
    id: "pde",
    name: {
      ko: "편미분방정식",
      en: "Partial Differential Equation",
      ja: "偏微分方程式",
    },
    field: "analysis",
    subfield: "differential-equations",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "편미분방정식(PDE)은 여러 독립변수에 대한 함수와 그 편도함수들의 관계식입니다.",
        formulas: [
          {
            latex: "\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2}",
            description: "파동 방정식",
          },
          {
            latex: "\\frac{\\partial u}{\\partial t} = k \\frac{\\partial^2 u}{\\partial x^2}",
            description: "열 방정식",
          },
          {
            latex: "\\nabla^2 u = \\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2} = 0",
            description: "라플라스 방정식",
          },
        ],
        examples: [
          {
            problem: "1차원 열 방정식의 물리적 의미를 설명하세요.",
            solution:
              "막대에서 열이 시간에 따라 어떻게 퍼지는지를 설명합니다. k는 열확산계수입니다.",
          },
        ],
        applications: [
          { field: "물리학", description: "열전달, 파동, 유체 역학" },
          { field: "금융", description: "블랙-숄즈 방정식" },
          { field: "양자역학", description: "슈뢰딩거 방정식" },
        ],
      },
      en: {
        definition:
          "A partial differential equation (PDE) relates a function of several variables to its partial derivatives.",
        formulas: [
          {
            latex: "\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2}",
            description: "Wave equation",
          },
          {
            latex: "\\frac{\\partial u}{\\partial t} = k \\frac{\\partial^2 u}{\\partial x^2}",
            description: "Heat equation",
          },
          {
            latex: "\\nabla^2 u = 0",
            description: "Laplace equation",
          },
        ],
        examples: [
          {
            problem: "Explain the physical meaning of the 1D heat equation.",
            solution:
              "It describes how heat spreads through a rod over time. k is the thermal diffusivity.",
          },
        ],
        applications: [
          { field: "Physics", description: "Heat transfer, waves, fluid dynamics" },
          { field: "Finance", description: "Black-Scholes equation" },
          { field: "Quantum Mechanics", description: "Schrödinger equation" },
        ],
      },
    },
    relations: {
      prerequisites: ["ode", "partial-derivative"],
      nextTopics: ["fourier-analysis"],
      related: ["boundary-conditions"],
    },
    tags: ["편미분방정식", "PDE", "partial differential equation"],
  },

  // ===== 5.6 다변수 해석학 (Multivariable) =====
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
        definition:
          "편미분은 다변수 함수에서 하나의 변수에 대해서만 미분하고 나머지는 상수로 취급합니다.",
        formulas: [
          {
            latex: "\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h, y) - f(x, y)}{h}",
            description: "x에 대한 편미분",
          },
          {
            latex: "\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right)",
            description: "기울기 벡터 (그래디언트)",
          },
        ],
        examples: [
          {
            problem: "f(x, y) = x²y + y³에서 ∂f/∂x와 ∂f/∂y를 구하세요.",
            solution: "∂f/∂x = 2xy, ∂f/∂y = x² + 3y²",
          },
        ],
        applications: [
          { field: "최적화", description: "그래디언트 하강법" },
          { field: "물리학", description: "열, 전기장 분석" },
          { field: "경제학", description: "한계 비용, 한계 효용" },
        ],
      },
      en: {
        definition:
          "A partial derivative differentiates a multivariable function with respect to one variable, treating others as constants.",
        formulas: [
          {
            latex: "\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h, y) - f(x, y)}{h}",
            description: "Partial derivative with respect to x",
          },
          {
            latex: "\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right)",
            description: "Gradient vector",
          },
        ],
        examples: [
          {
            problem: "For f(x, y) = x²y + y³, find ∂f/∂x and ∂f/∂y.",
            solution: "∂f/∂x = 2xy, ∂f/∂y = x² + 3y²",
          },
        ],
        applications: [
          { field: "Optimization", description: "Gradient descent" },
          { field: "Physics", description: "Heat, electric field analysis" },
          { field: "Economics", description: "Marginal cost, marginal utility" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative"],
      nextTopics: ["multiple-integrals", "pde"],
      related: ["gradient", "directional-derivative"],
    },
    tags: ["편미분", "다변수함수", "partial derivative", "multivariable"],
  },
  {
    id: "multiple-integral",
    name: {
      ko: "중적분",
      en: "Multiple Integral",
      ja: "重積分",
    },
    field: "analysis",
    subfield: "multivariable",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "중적분은 다변수 함수를 여러 변수에 대해 적분합니다. 이중적분은 부피, 삼중적분은 4차원 부피를 계산합니다.",
        formulas: [
          {
            latex: "\\iint_R f(x,y)\\,dA = \\int_a^b \\int_{c}^{d} f(x,y)\\,dy\\,dx",
            description: "이중적분",
          },
          {
            latex: "\\iiint_V f(x,y,z)\\,dV",
            description: "삼중적분",
          },
        ],
        examples: [
          {
            problem: "∫₀¹∫₀² xy dydx를 구하세요.",
            solution:
              "= ∫₀¹ x[y²/2]₀² dx = ∫₀¹ 2x dx = [x²]₀¹ = 1",
          },
        ],
        applications: [
          { field: "기하학", description: "넓이, 부피, 질량 계산" },
          { field: "물리학", description: "질량 중심, 관성 모멘트" },
          { field: "확률론", description: "결합 확률 분포" },
        ],
      },
      en: {
        definition:
          "Multiple integrals integrate a multivariable function over several variables. Double integrals compute volume; triple integrals compute 4D volume.",
        formulas: [
          {
            latex: "\\iint_R f(x,y)\\,dA",
            description: "Double integral",
          },
          {
            latex: "\\iiint_V f(x,y,z)\\,dV",
            description: "Triple integral",
          },
        ],
        examples: [
          {
            problem: "Find ∫₀¹∫₀² xy dydx.",
            solution:
              "= ∫₀¹ x[y²/2]₀² dx = ∫₀¹ 2x dx = [x²]₀¹ = 1",
          },
        ],
        applications: [
          { field: "Geometry", description: "Area, volume, mass calculation" },
          { field: "Physics", description: "Center of mass, moment of inertia" },
          { field: "Probability", description: "Joint probability distributions" },
        ],
      },
    },
    relations: {
      prerequisites: ["integral", "partial-derivative"],
      nextTopics: ["line-integral", "surface-integral"],
      related: ["fubini-theorem"],
    },
    tags: ["중적분", "이중적분", "multiple integral", "double integral"],
  },
  {
    id: "line-integral",
    name: {
      ko: "선적분",
      en: "Line Integral",
      ja: "線積分",
    },
    field: "analysis",
    subfield: "vector-calculus",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "선적분은 곡선을 따라 함수를 적분합니다. 스칼라 필드 또는 벡터 필드에 대해 정의됩니다.",
        formulas: [
          {
            latex: "\\int_C f\\,ds = \\int_a^b f(\\mathbf{r}(t))|\\mathbf{r}'(t)|\\,dt",
            description: "스칼라 함수의 선적분",
          },
          {
            latex: "\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_a^b \\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)\\,dt",
            description: "벡터 필드의 선적분",
          },
        ],
        examples: [
          {
            problem: "벡터장 F = (y, x)를 원 x² + y² = 1을 따라 적분하세요.",
            solution:
              "r(t) = (cos t, sin t), r'(t) = (-sin t, cos t)\nF·r' = sin t(-sin t) + cos t(cos t) = cos²t - sin²t = cos 2t\n∫₀^2π cos 2t dt = 0",
          },
        ],
        applications: [
          { field: "물리학", description: "일(work) 계산" },
          { field: "전자기학", description: "전위, 자기장" },
        ],
      },
      en: {
        definition:
          "A line integral integrates a function along a curve. Defined for scalar or vector fields.",
        formulas: [
          {
            latex: "\\int_C f\\,ds",
            description: "Scalar line integral",
          },
          {
            latex: "\\int_C \\mathbf{F} \\cdot d\\mathbf{r}",
            description: "Vector line integral",
          },
        ],
        examples: [
          {
            problem: "Integrate F = (y, x) along the circle x² + y² = 1.",
            solution:
              "r(t) = (cos t, sin t), F·r' = cos 2t\n∫₀^2π cos 2t dt = 0",
          },
        ],
        applications: [
          { field: "Physics", description: "Work calculation" },
          { field: "Electromagnetism", description: "Potential, magnetic field" },
        ],
      },
    },
    relations: {
      prerequisites: ["integral", "vector-basics"],
      nextTopics: ["greens-theorem", "stokes-theorem"],
      related: ["path-independence"],
    },
    tags: ["선적분", "벡터해석", "line integral", "vector calculus"],
  },
  {
    id: "gradient-divergence-curl",
    name: {
      ko: "기울기, 발산, 회전",
      en: "Gradient, Divergence, Curl",
      ja: "勾配・発散・回転",
    },
    field: "analysis",
    subfield: "vector-calculus",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "벡터 해석의 기본 연산으로, 스칼라/벡터 필드의 변화율을 나타냅니다.",
        formulas: [
          {
            latex: "\\nabla f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right)",
            description: "기울기 (gradient)",
          },
          {
            latex: "\\nabla \\cdot \\mathbf{F} = \\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y} + \\frac{\\partial F_z}{\\partial z}",
            description: "발산 (divergence)",
          },
          {
            latex: "\\nabla \\times \\mathbf{F} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ F_x & F_y & F_z \\end{vmatrix}",
            description: "회전 (curl)",
          },
        ],
        examples: [
          {
            problem: "f(x, y, z) = x² + y² + z²의 기울기를 구하세요.",
            solution: "∇f = (2x, 2y, 2z)",
          },
        ],
        applications: [
          { field: "물리학", description: "전자기학, 유체역학" },
          { field: "기상학", description: "바람 패턴 분석" },
        ],
      },
      en: {
        definition:
          "Fundamental operations in vector calculus representing rates of change in scalar/vector fields.",
        formulas: [
          {
            latex: "\\nabla f",
            description: "Gradient",
          },
          {
            latex: "\\nabla \\cdot \\mathbf{F}",
            description: "Divergence",
          },
          {
            latex: "\\nabla \\times \\mathbf{F}",
            description: "Curl",
          },
        ],
        examples: [
          {
            problem: "Find the gradient of f(x, y, z) = x² + y² + z².",
            solution: "∇f = (2x, 2y, 2z)",
          },
        ],
        applications: [
          { field: "Physics", description: "Electromagnetism, fluid dynamics" },
          { field: "Meteorology", description: "Wind pattern analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["partial-derivative", "vector-basics"],
      nextTopics: ["greens-theorem", "divergence-theorem"],
      related: ["laplacian"],
    },
    tags: ["그래디언트", "발산", "회전", "gradient", "divergence", "curl"],
  },

  // ===== 5.7 복소해석 (Complex Analysis) =====
  {
    id: "complex-functions",
    name: {
      ko: "복소함수",
      en: "Complex Functions",
      ja: "複素関数",
    },
    field: "analysis",
    subfield: "complex-analysis",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "복소함수는 복소수를 입력받아 복소수를 출력하는 함수입니다. f(z) = u(x,y) + iv(x,y) 형태입니다.",
        formulas: [
          {
            latex: "f(z) = u(x, y) + iv(x, y)",
            description: "복소함수의 표현 (z = x + iy)",
          },
          {
            latex: "e^{iz} = \\cos z + i\\sin z",
            description: "오일러 공식",
          },
        ],
        examples: [
          {
            problem: "f(z) = z²를 전개하세요.",
            solution:
              "z = x + iy일 때, z² = (x + iy)² = x² - y² + 2ixy\nu = x² - y², v = 2xy",
          },
        ],
        applications: [
          { field: "전자공학", description: "AC 회로 분석" },
          { field: "유체역학", description: "2D 유동 분석" },
          { field: "양자역학", description: "파동 함수" },
        ],
      },
      en: {
        definition:
          "A complex function takes complex numbers as input and outputs complex numbers. Form: f(z) = u(x,y) + iv(x,y).",
        formulas: [
          {
            latex: "f(z) = u(x, y) + iv(x, y)",
            description: "Complex function representation (z = x + iy)",
          },
          {
            latex: "e^{iz} = \\cos z + i\\sin z",
            description: "Euler's formula",
          },
        ],
        examples: [
          {
            problem: "Expand f(z) = z².",
            solution:
              "For z = x + iy: z² = x² - y² + 2ixy\nu = x² - y², v = 2xy",
          },
        ],
        applications: [
          { field: "Electrical Engineering", description: "AC circuit analysis" },
          { field: "Fluid Mechanics", description: "2D flow analysis" },
          { field: "Quantum Mechanics", description: "Wave functions" },
        ],
      },
    },
    relations: {
      prerequisites: ["complex-numbers"],
      nextTopics: ["analytic-functions", "contour-integration"],
      related: ["euler-formula"],
    },
    tags: ["복소함수", "복소해석", "complex function", "complex analysis"],
  },
  {
    id: "cauchy-riemann",
    name: {
      ko: "코시-리만 방정식",
      en: "Cauchy-Riemann Equations",
      ja: "コーシー・リーマン方程式",
    },
    field: "analysis",
    subfield: "complex-analysis",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "복소함수가 해석적(미분가능)이기 위한 필요충분조건을 나타내는 편미분 방정식입니다.",
        formulas: [
          {
            latex: "\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}, \\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}",
            description: "코시-리만 방정식",
          },
        ],
        examples: [
          {
            problem: "f(z) = z²이 해석적임을 코시-리만으로 보이세요.",
            solution:
              "u = x² - y², v = 2xy\n∂u/∂x = 2x = ∂v/∂y ✓\n∂u/∂y = -2y = -∂v/∂x ✓",
          },
        ],
        history: {
          discoveredBy: "오귀스탱 코시, 베른하르트 리만",
          year: "19세기",
          background:
            "복소해석학의 기초를 이루는 중요한 조건입니다.",
        },
      },
      en: {
        definition:
          "A system of partial differential equations that are necessary and sufficient conditions for a complex function to be analytic (differentiable).",
        formulas: [
          {
            latex: "\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}, \\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}",
            description: "Cauchy-Riemann equations",
          },
        ],
        examples: [
          {
            problem: "Show f(z) = z² is analytic using Cauchy-Riemann.",
            solution:
              "u = x² - y², v = 2xy\n∂u/∂x = 2x = ∂v/∂y ✓\n∂u/∂y = -2y = -∂v/∂x ✓",
          },
        ],
        history: {
          discoveredBy: "Augustin Cauchy, Bernhard Riemann",
          year: "19th century",
          background:
            "Fundamental conditions in complex analysis.",
        },
      },
    },
    relations: {
      prerequisites: ["complex-functions", "partial-derivative"],
      nextTopics: ["contour-integration"],
      related: ["harmonic-functions"],
    },
    tags: ["코시리만", "해석함수", "Cauchy-Riemann", "analytic"],
  },
  {
    id: "residue-theorem",
    name: {
      ko: "유수 정리",
      en: "Residue Theorem",
      ja: "留数定理",
    },
    field: "analysis",
    subfield: "complex-analysis",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "유수 정리는 특이점을 포함하는 닫힌 경로를 따른 복소 적분을 유수의 합으로 계산합니다.",
        formulas: [
          {
            latex: "\\oint_C f(z)\\,dz = 2\\pi i \\sum_{k} \\text{Res}(f, z_k)",
            description: "유수 정리",
          },
          {
            latex: "\\text{Res}(f, z_0) = \\lim_{z \\to z_0} (z - z_0)f(z)",
            description: "단순 극에서의 유수",
          },
        ],
        examples: [
          {
            problem: "∮ 1/(z² + 1) dz를 |z| = 2를 따라 계산하세요.",
            solution:
              "극점: z = ±i\nRes(f, i) = 1/(2i), Res(f, -i) = -1/(2i)\n∮ = 2πi(1/2i - 1/2i) = 0",
          },
        ],
        applications: [
          { field: "적분 계산", description: "실수 적분의 계산" },
          { field: "물리학", description: "양자장론" },
        ],
      },
      en: {
        definition:
          "The residue theorem computes complex integrals around closed curves containing singularities as a sum of residues.",
        formulas: [
          {
            latex: "\\oint_C f(z)\\,dz = 2\\pi i \\sum_{k} \\text{Res}(f, z_k)",
            description: "Residue theorem",
          },
        ],
        examples: [
          {
            problem: "Compute ∮ 1/(z² + 1) dz around |z| = 2.",
            solution:
              "Poles: z = ±i\nRes(f, i) = 1/(2i), Res(f, -i) = -1/(2i)\n∮ = 2πi(1/2i - 1/2i) = 0",
          },
        ],
        applications: [
          { field: "Integration", description: "Computing real integrals" },
          { field: "Physics", description: "Quantum field theory" },
        ],
      },
    },
    relations: {
      prerequisites: ["cauchy-riemann", "complex-functions"],
      nextTopics: [],
      related: ["contour-integration", "laurent-series"],
    },
    tags: ["유수정리", "복소적분", "residue theorem", "contour integral"],
  },

  // ===== 5.8 측도론과 실해석 (Measure Theory & Real Analysis) =====
  {
    id: "measure-theory",
    name: {
      ko: "측도론",
      en: "Measure Theory",
      ja: "測度論",
    },
    field: "analysis",
    subfield: "real-analysis",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "측도론은 집합의 '크기'를 일반화한 이론입니다. 확률론과 적분론의 기초가 됩니다.",
        formulas: [
          {
            latex: "\\mu\\left(\\bigcup_{i=1}^{\\infty} A_i\\right) = \\sum_{i=1}^{\\infty} \\mu(A_i)",
            description: "가산 가법성 (서로소 집합)",
          },
          {
            latex: "\\mu(\\emptyset) = 0",
            description: "공집합의 측도",
          },
        ],
        examples: [
          {
            problem: "르베그 측도에서 [0, 1] 구간의 측도를 구하세요.",
            solution: "μ([0, 1]) = 1 (길이와 일치)",
          },
        ],
        history: {
          discoveredBy: "앙리 르베그",
          year: "1902",
          background:
            "리만 적분의 한계를 극복하기 위해 개발되었습니다.",
        },
        applications: [
          { field: "확률론", description: "확률 측도의 기초" },
          { field: "적분론", description: "르베그 적분" },
        ],
      },
      en: {
        definition:
          "Measure theory generalizes the concept of 'size' of sets. It's fundamental to probability theory and integration.",
        formulas: [
          {
            latex: "\\mu\\left(\\bigcup_{i=1}^{\\infty} A_i\\right) = \\sum_{i=1}^{\\infty} \\mu(A_i)",
            description: "Countable additivity (disjoint sets)",
          },
        ],
        examples: [
          {
            problem: "Find the Lebesgue measure of [0, 1].",
            solution: "μ([0, 1]) = 1 (equals the length)",
          },
        ],
        history: {
          discoveredBy: "Henri Lebesgue",
          year: "1902",
          background:
            "Developed to overcome limitations of Riemann integration.",
        },
        applications: [
          { field: "Probability", description: "Foundation of probability measures" },
          { field: "Integration", description: "Lebesgue integral" },
        ],
      },
    },
    relations: {
      prerequisites: ["integral", "set-theory"],
      nextTopics: ["lebesgue-integral"],
      related: ["probability-theory"],
    },
    tags: ["측도론", "르베그측도", "measure theory", "Lebesgue"],
  },
  {
    id: "lebesgue-integral",
    name: {
      ko: "르베그 적분",
      en: "Lebesgue Integral",
      ja: "ルベーグ積分",
    },
    field: "analysis",
    subfield: "real-analysis",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "르베그 적분은 리만 적분을 일반화한 것으로, 측도를 사용하여 더 넓은 함수 클래스를 적분합니다.",
        formulas: [
          {
            latex: "\\int f\\,d\\mu = \\sup\\left\\{ \\int s\\,d\\mu : s \\leq f, s \\text{ 단순} \\right\\}",
            description: "르베그 적분의 정의",
          },
        ],
        examples: [
          {
            problem: "[0, 1]에서 디리클레 함수의 르베그 적분을 구하세요.",
            solution:
              "유리수에서 1, 무리수에서 0인 함수\n∫f dμ = 1·μ(Q∩[0,1]) + 0·μ(Irrational∩[0,1]) = 0 (Q는 측도 0)",
          },
        ],
        history: {
          discoveredBy: "앙리 르베그",
          year: "1902",
          background:
            "리만 적분으로는 다룰 수 없는 함수를 적분할 수 있게 했습니다.",
        },
        applications: [
          { field: "확률론", description: "기댓값 계산" },
          { field: "함수해석", description: "Lp 공간 정의" },
        ],
      },
      en: {
        definition:
          "The Lebesgue integral generalizes the Riemann integral, using measures to integrate a wider class of functions.",
        formulas: [
          {
            latex: "\\int f\\,d\\mu",
            description: "Lebesgue integral",
          },
        ],
        examples: [
          {
            problem: "Find the Lebesgue integral of Dirichlet function on [0, 1].",
            solution:
              "Function is 1 on rationals, 0 on irrationals\n∫f dμ = 0 (rationals have measure 0)",
          },
        ],
        history: {
          discoveredBy: "Henri Lebesgue",
          year: "1902",
          background:
            "Enabled integration of functions not integrable in the Riemann sense.",
        },
        applications: [
          { field: "Probability", description: "Expected value computation" },
          { field: "Functional Analysis", description: "Lp space definition" },
        ],
      },
    },
    relations: {
      prerequisites: ["measure-theory", "integral"],
      nextTopics: ["lp-spaces"],
      related: ["dominated-convergence"],
    },
    tags: ["르베그적분", "측도론", "Lebesgue integral"],
  },

  // ===== 5.9 함수해석 (Functional Analysis) =====
  {
    id: "hilbert-space",
    name: {
      ko: "힐베르트 공간",
      en: "Hilbert Space",
      ja: "ヒルベルト空間",
    },
    field: "analysis",
    subfield: "functional-analysis",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "힐베르트 공간은 내적이 정의되고 완비인 벡터 공간입니다. 무한 차원 기하학의 기초가 됩니다.",
        formulas: [
          {
            latex: "\\langle x, y \\rangle",
            description: "내적",
          },
          {
            latex: "\\|x\\| = \\sqrt{\\langle x, x \\rangle}",
            description: "내적에서 유도된 노름",
          },
          {
            latex: "\\ell^2 = \\left\\{ (x_n) : \\sum_{n=1}^{\\infty} |x_n|^2 < \\infty \\right\\}",
            description: "ℓ² 공간 (예시)",
          },
        ],
        examples: [
          {
            problem: "L²([0, 2π])에서 sin(x)와 cos(x)가 직교함을 보이세요.",
            solution:
              "⟨sin x, cos x⟩ = ∫₀^{2π} sin x cos x dx = [sin²x/2]₀^{2π} = 0",
          },
        ],
        history: {
          discoveredBy: "다비드 힐베르트",
          year: "1906",
          background:
            "적분방정식 연구에서 발전했습니다.",
        },
        applications: [
          { field: "양자역학", description: "상태 공간" },
          { field: "신호처리", description: "푸리에 분석" },
          { field: "기계학습", description: "커널 방법" },
        ],
      },
      en: {
        definition:
          "A Hilbert space is a complete vector space with an inner product. It's the foundation of infinite-dimensional geometry.",
        formulas: [
          {
            latex: "\\langle x, y \\rangle",
            description: "Inner product",
          },
          {
            latex: "\\|x\\| = \\sqrt{\\langle x, x \\rangle}",
            description: "Norm induced by inner product",
          },
        ],
        examples: [
          {
            problem: "Show sin(x) and cos(x) are orthogonal in L²([0, 2π]).",
            solution:
              "⟨sin x, cos x⟩ = ∫₀^{2π} sin x cos x dx = 0",
          },
        ],
        history: {
          discoveredBy: "David Hilbert",
          year: "1906",
          background:
            "Developed from the study of integral equations.",
        },
        applications: [
          { field: "Quantum Mechanics", description: "State space" },
          { field: "Signal Processing", description: "Fourier analysis" },
          { field: "Machine Learning", description: "Kernel methods" },
        ],
      },
    },
    relations: {
      prerequisites: ["vector-spaces", "inner-product"],
      nextTopics: ["banach-space", "operators"],
      related: ["orthonormal-basis"],
    },
    tags: ["힐베르트공간", "내적공간", "Hilbert space", "inner product"],
  },
  {
    id: "banach-space",
    name: {
      ko: "바나흐 공간",
      en: "Banach Space",
      ja: "バナッハ空間",
    },
    field: "analysis",
    subfield: "functional-analysis",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "바나흐 공간은 노름이 정의되고 완비인 벡터 공간입니다. 힐베르트 공간보다 일반적입니다.",
        formulas: [
          {
            latex: "\\|x + y\\| \\leq \\|x\\| + \\|y\\|",
            description: "삼각 부등식",
          },
          {
            latex: "\\|\\alpha x\\| = |\\alpha| \\cdot \\|x\\|",
            description: "동질성",
          },
        ],
        examples: [
          {
            problem: "C([0, 1])이 sup 노름에서 바나흐 공간임을 설명하세요.",
            solution:
              "연속함수 공간에서 코시 수열의 극한이 연속이므로 완비입니다.",
          },
        ],
        history: {
          discoveredBy: "스테판 바나흐",
          year: "1920년대",
          background:
            "폴란드 수학자가 노름 공간의 완비성을 연구했습니다.",
        },
        applications: [
          { field: "미분방정식", description: "존재성/유일성 정리" },
          { field: "최적화", description: "고정점 정리" },
        ],
      },
      en: {
        definition:
          "A Banach space is a complete normed vector space. More general than Hilbert spaces.",
        formulas: [
          {
            latex: "\\|x + y\\| \\leq \\|x\\| + \\|y\\|",
            description: "Triangle inequality",
          },
        ],
        examples: [
          {
            problem: "Explain why C([0, 1]) with sup norm is a Banach space.",
            solution:
              "Cauchy sequences of continuous functions converge to continuous functions, so it's complete.",
          },
        ],
        history: {
          discoveredBy: "Stefan Banach",
          year: "1920s",
          background:
            "Polish mathematician studied completeness of normed spaces.",
        },
        applications: [
          { field: "Differential Equations", description: "Existence/uniqueness theorems" },
          { field: "Optimization", description: "Fixed point theorems" },
        ],
      },
    },
    relations: {
      prerequisites: ["vector-spaces", "metric-spaces"],
      nextTopics: ["hilbert-space"],
      related: ["lp-spaces"],
    },
    tags: ["바나흐공간", "노름공간", "Banach space", "normed space"],
  },

  // ===== 5.10 푸리에 해석 (Fourier Analysis) =====
  {
    id: "fourier-series",
    name: {
      ko: "푸리에 급수",
      en: "Fourier Series",
      ja: "フーリエ級数",
    },
    field: "analysis",
    subfield: "fourier-analysis",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "푸리에 급수는 주기 함수를 삼각함수(사인과 코사인)의 무한 합으로 표현합니다.",
        formulas: [
          {
            latex: "f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\left( a_n \\cos(nx) + b_n \\sin(nx) \\right)",
            description: "푸리에 급수",
          },
          {
            latex: "a_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\cos(nx)\\,dx",
            description: "푸리에 계수 aₙ",
          },
          {
            latex: "b_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\sin(nx)\\,dx",
            description: "푸리에 계수 bₙ",
          },
        ],
        examples: [
          {
            problem: "구간 [-π, π]에서 f(x) = x의 푸리에 급수를 구하세요.",
            solution:
              "f(x)가 홀함수이므로 aₙ = 0\nbₙ = 2(-1)^{n+1}/n\nf(x) = 2(sin x - sin 2x/2 + sin 3x/3 - ...)",
          },
        ],
        history: {
          discoveredBy: "조제프 푸리에",
          year: "1807",
          background:
            "열 전도 연구에서 개발되었습니다.",
        },
        applications: [
          { field: "신호 처리", description: "주파수 분석" },
          { field: "음향학", description: "음색 분석, 합성" },
          { field: "이미지 처리", description: "압축, 필터링" },
        ],
      },
      en: {
        definition:
          "Fourier series represents a periodic function as an infinite sum of trigonometric functions (sines and cosines).",
        formulas: [
          {
            latex: "f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\left( a_n \\cos(nx) + b_n \\sin(nx) \\right)",
            description: "Fourier series",
          },
          {
            latex: "a_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\cos(nx)\\,dx",
            description: "Fourier coefficient aₙ",
          },
        ],
        examples: [
          {
            problem: "Find the Fourier series of f(x) = x on [-π, π].",
            solution:
              "Since f(x) is odd, aₙ = 0\nbₙ = 2(-1)^{n+1}/n\nf(x) = 2(sin x - sin 2x/2 + sin 3x/3 - ...)",
          },
        ],
        history: {
          discoveredBy: "Joseph Fourier",
          year: "1807",
          background:
            "Developed from the study of heat conduction.",
        },
        applications: [
          { field: "Signal Processing", description: "Frequency analysis" },
          { field: "Acoustics", description: "Timbre analysis, synthesis" },
          { field: "Image Processing", description: "Compression, filtering" },
        ],
      },
    },
    relations: {
      prerequisites: ["integral", "series", "trig-identities"],
      nextTopics: ["fourier-transform"],
      related: ["harmonic-analysis"],
    },
    tags: ["푸리에급수", "주기함수", "Fourier series", "harmonics"],
  },
  {
    id: "fourier-transform",
    name: {
      ko: "푸리에 변환",
      en: "Fourier Transform",
      ja: "フーリエ変換",
    },
    field: "analysis",
    subfield: "fourier-analysis",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "푸리에 변환은 함수를 주파수 성분으로 분해합니다. 비주기 함수에도 적용됩니다.",
        formulas: [
          {
            latex: "\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i x \\xi}\\,dx",
            description: "푸리에 변환",
          },
          {
            latex: "f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i x \\xi}\\,d\\xi",
            description: "역푸리에 변환",
          },
        ],
        examples: [
          {
            problem: "가우시안 함수 f(x) = e^{-πx²}의 푸리에 변환을 구하세요.",
            solution: "f̂(ξ) = e^{-πξ²} (가우시안은 자기 자신으로 변환됨)",
          },
        ],
        applications: [
          { field: "신호 처리", description: "스펙트럼 분석" },
          { field: "양자역학", description: "위치-운동량 표현" },
          { field: "이미지 처리", description: "주파수 도메인 필터링" },
        ],
      },
      en: {
        definition:
          "The Fourier transform decomposes a function into frequency components. Applies to non-periodic functions.",
        formulas: [
          {
            latex: "\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i x \\xi}\\,dx",
            description: "Fourier transform",
          },
          {
            latex: "f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i x \\xi}\\,d\\xi",
            description: "Inverse Fourier transform",
          },
        ],
        examples: [
          {
            problem: "Find the Fourier transform of the Gaussian f(x) = e^{-πx²}.",
            solution: "f̂(ξ) = e^{-πξ²} (Gaussians transform to themselves)",
          },
        ],
        applications: [
          { field: "Signal Processing", description: "Spectrum analysis" },
          { field: "Quantum Mechanics", description: "Position-momentum representation" },
          { field: "Image Processing", description: "Frequency domain filtering" },
        ],
      },
    },
    relations: {
      prerequisites: ["fourier-series", "improper-integral"],
      nextTopics: ["laplace-transform", "wavelet-transform"],
      related: ["convolution"],
    },
    tags: ["푸리에변환", "주파수분석", "Fourier transform", "frequency"],
  },
  {
    id: "laplace-transform",
    name: {
      ko: "라플라스 변환",
      en: "Laplace Transform",
      ja: "ラプラス変換",
    },
    field: "analysis",
    subfield: "fourier-analysis",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "라플라스 변환은 시간 함수를 복소 주파수 영역으로 변환합니다. 미분방정식을 대수 방정식으로 바꿉니다.",
        formulas: [
          {
            latex: "\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^{\\infty} f(t) e^{-st}\\,dt",
            description: "라플라스 변환",
          },
          {
            latex: "\\mathcal{L}\\{f'(t)\\} = sF(s) - f(0)",
            description: "도함수의 라플라스 변환",
          },
          {
            latex: "\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s-a}",
            description: "지수함수의 변환",
          },
        ],
        examples: [
          {
            problem: "L{sin(ωt)}를 구하세요.",
            solution: "L{sin(ωt)} = ω/(s² + ω²)",
          },
        ],
        applications: [
          { field: "제어 공학", description: "전달함수, 시스템 분석" },
          { field: "전자공학", description: "회로 분석" },
          { field: "미분방정식", description: "초기값 문제 풀이" },
        ],
      },
      en: {
        definition:
          "The Laplace transform converts time functions to the complex frequency domain. It turns differential equations into algebraic ones.",
        formulas: [
          {
            latex: "\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^{\\infty} f(t) e^{-st}\\,dt",
            description: "Laplace transform",
          },
          {
            latex: "\\mathcal{L}\\{f'(t)\\} = sF(s) - f(0)",
            description: "Laplace transform of derivative",
          },
        ],
        examples: [
          {
            problem: "Find L{sin(ωt)}.",
            solution: "L{sin(ωt)} = ω/(s² + ω²)",
          },
        ],
        applications: [
          { field: "Control Engineering", description: "Transfer functions, system analysis" },
          { field: "Electronics", description: "Circuit analysis" },
          { field: "Differential Equations", description: "Solving initial value problems" },
        ],
      },
    },
    relations: {
      prerequisites: ["improper-integral", "ode"],
      nextTopics: ["z-transform"],
      related: ["fourier-transform"],
    },
    tags: ["라플라스변환", "제어이론", "Laplace transform", "control"],
  },
];
