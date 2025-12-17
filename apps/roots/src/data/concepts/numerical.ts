/**
 * @fileoverview 수치해석 개념 데이터
 */
import type { MathConcept } from "../types";

export const numericalConcepts: MathConcept[] = [
  {
    id: "numerical-error",
    name: {
      ko: "수치 오차",
      en: "Numerical Error",
      ja: "数値誤差",
    },
    field: "numerical",
    subfield: "error-analysis",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "수치 오차는 컴퓨터 계산에서 발생하는 오차입니다. 반올림 오차, 절단 오차, 전파 오차 등이 있습니다.",
        formulas: [
          {
            latex: "\\text{절대 오차} = |x - \\tilde{x}|",
            description: "절대 오차",
          },
          {
            latex: "\\text{상대 오차} = \\frac{|x - \\tilde{x}|}{|x|}",
            description: "상대 오차",
          },
          {
            latex: "\\epsilon_{\\text{machine}} \\approx 2.2 \\times 10^{-16}",
            description: "배정밀도 기계 엡실론",
          },
        ],
        examples: [
          {
            problem: "참값이 π이고 근사값이 3.14일 때 상대 오차는?",
            solution:
              "상대 오차 = |π - 3.14| / |π| ≈ 0.00159 / 3.14159 ≈ 0.05%",
          },
        ],
        applications: [
          { field: "과학 계산", description: "계산 신뢰도 평가" },
          { field: "금융", description: "정밀 계산" },
          { field: "공학", description: "시뮬레이션 정확도" },
        ],
      },
      en: {
        definition:
          "Numerical error arises in computer calculations. Types include rounding error, truncation error, and propagation error.",
        formulas: [
          {
            latex: "\\text{Absolute error} = |x - \\tilde{x}|",
            description: "Absolute error",
          },
          {
            latex: "\\text{Relative error} = \\frac{|x - \\tilde{x}|}{|x|}",
            description: "Relative error",
          },
          {
            latex: "\\epsilon_{\\text{machine}} \\approx 2.2 \\times 10^{-16}",
            description: "Double precision machine epsilon",
          },
        ],
        examples: [
          {
            problem: "If true value is π and approximation is 3.14, find relative error.",
            solution:
              "Relative error = |π - 3.14| / |π| ≈ 0.00159 / 3.14159 ≈ 0.05%",
          },
        ],
        applications: [
          { field: "Scientific Computing", description: "Calculation reliability" },
          { field: "Finance", description: "Precision calculations" },
          { field: "Engineering", description: "Simulation accuracy" },
        ],
      },
    },
    relations: {
      prerequisites: ["floating-point"],
      nextTopics: ["stability-analysis", "conditioning"],
      related: ["approximation"],
    },
    tags: ["오차", "수치해석", "error", "numerical"],
  },
  {
    id: "newton-method",
    name: {
      ko: "뉴턴-랩슨 방법",
      en: "Newton-Raphson Method",
      ja: "ニュートン法",
    },
    field: "numerical",
    subfield: "root-finding",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "뉴턴-랩슨 방법은 f(x) = 0의 근을 찾는 반복법입니다. 접선을 이용해 빠르게 수렴합니다.",
        formulas: [
          {
            latex: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",
            description: "뉴턴-랩슨 반복 공식",
          },
        ],
        examples: [
          {
            problem: "√2를 뉴턴법으로 구하세요 (f(x) = x² - 2, x₀ = 1).",
            solution:
              "x₁ = 1 - (1-2)/(2·1) = 1.5, x₂ = 1.5 - (0.25)/(3) ≈ 1.4167, x₃ ≈ 1.4142...",
          },
        ],
        history: {
          discoveredBy: "아이작 뉴턴, 조제프 랩슨",
          year: "17세기",
          background:
            "뉴턴이 다항식 근을 찾기 위해 개발했고, 랩슨이 일반화했습니다.",
        },
        applications: [
          { field: "공학", description: "비선형 방정식 풀이" },
          { field: "최적화", description: "뉴턴 최적화" },
          { field: "컴퓨터 그래픽스", description: "레이 트레이싱" },
        ],
      },
      en: {
        definition:
          "Newton-Raphson method is an iterative technique for finding roots of f(x) = 0. It uses tangent lines for fast convergence.",
        formulas: [
          {
            latex: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",
            description: "Newton-Raphson iteration formula",
          },
        ],
        examples: [
          {
            problem: "Find √2 using Newton's method (f(x) = x² - 2, x₀ = 1).",
            solution:
              "x₁ = 1 - (1-2)/(2·1) = 1.5, x₂ = 1.5 - (0.25)/(3) ≈ 1.4167, x₃ ≈ 1.4142...",
          },
        ],
        history: {
          discoveredBy: "Isaac Newton, Joseph Raphson",
          year: "17th century",
          background:
            "Newton developed it for polynomial roots; Raphson generalized it.",
        },
        applications: [
          { field: "Engineering", description: "Nonlinear equation solving" },
          { field: "Optimization", description: "Newton optimization" },
          { field: "Computer Graphics", description: "Ray tracing" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative", "limits"],
      nextTopics: ["secant-method", "fixed-point-iteration"],
      related: ["bisection"],
    },
    tags: ["뉴턴", "근찾기", "Newton", "root finding"],
  },
  {
    id: "numerical-integration",
    name: {
      ko: "수치 적분",
      en: "Numerical Integration",
      ja: "数値積分",
    },
    field: "numerical",
    subfield: "integration",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "수치 적분은 정적분의 값을 근사적으로 계산하는 방법입니다. 사다리꼴 공식, 심프슨 공식 등이 있습니다.",
        formulas: [
          {
            latex: "\\int_a^b f(x)dx \\approx \\frac{h}{2}(f(a) + f(b))",
            description: "사다리꼴 공식 (단일 구간)",
          },
          {
            latex: "\\int_a^b f(x)dx \\approx \\frac{h}{3}(f(a) + 4f(m) + f(b))",
            description: "심프슨 1/3 공식",
          },
        ],
        examples: [
          {
            problem: "심프슨 공식으로 ∫₀² x² dx를 계산하세요.",
            solution:
              "h = 1, m = 1. S = (1/3)(0 + 4(1) + 4) = (1/3)(8) = 8/3 ≈ 2.67. 정확값 = 8/3 ✓",
          },
        ],
        applications: [
          { field: "물리학", description: "궤적 계산" },
          { field: "통계학", description: "누적분포함수" },
          { field: "공학", description: "면적, 부피 계산" },
        ],
      },
      en: {
        definition:
          "Numerical integration approximates definite integral values. Methods include trapezoidal rule and Simpson's rule.",
        formulas: [
          {
            latex: "\\int_a^b f(x)dx \\approx \\frac{h}{2}(f(a) + f(b))",
            description: "Trapezoidal rule (single interval)",
          },
          {
            latex: "\\int_a^b f(x)dx \\approx \\frac{h}{3}(f(a) + 4f(m) + f(b))",
            description: "Simpson's 1/3 rule",
          },
        ],
        examples: [
          {
            problem: "Calculate ∫₀² x² dx using Simpson's rule.",
            solution:
              "h = 1, m = 1. S = (1/3)(0 + 4(1) + 4) = (1/3)(8) = 8/3 ≈ 2.67. Exact value = 8/3 ✓",
          },
        ],
        applications: [
          { field: "Physics", description: "Trajectory calculation" },
          { field: "Statistics", description: "Cumulative distribution" },
          { field: "Engineering", description: "Area, volume calculation" },
        ],
      },
    },
    relations: {
      prerequisites: ["integral"],
      nextTopics: ["gaussian-quadrature", "monte-carlo-integration"],
      related: ["riemann-sum"],
    },
    tags: ["수치적분", "심프슨", "numerical integration", "quadrature"],
  },
  {
    id: "interpolation",
    name: {
      ko: "보간법",
      en: "Interpolation",
      ja: "補間法",
    },
    field: "numerical",
    subfield: "approximation",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "보간법은 주어진 데이터 점들 사이의 값을 추정하는 방법입니다. 다항식 보간, 스플라인 보간 등이 있습니다.",
        formulas: [
          {
            latex: "L(x) = \\sum_{i=0}^{n} y_i \\prod_{j \\neq i} \\frac{x - x_j}{x_i - x_j}",
            description: "라그랑주 보간 다항식",
          },
        ],
        examples: [
          {
            problem: "(0,1), (1,3), (2,7)을 지나는 라그랑주 보간다항식을 구하세요.",
            solution:
              "L(x) = 1·(x-1)(x-2)/((0-1)(0-2)) + 3·x(x-2)/((1-0)(1-2)) + 7·x(x-1)/((2-0)(2-1)) = x² + x + 1",
          },
        ],
        applications: [
          { field: "컴퓨터 그래픽스", description: "곡선/곡면 생성" },
          { field: "신호 처리", description: "리샘플링" },
          { field: "데이터 분석", description: "결측값 추정" },
        ],
      },
      en: {
        definition:
          "Interpolation estimates values between given data points. Methods include polynomial interpolation and spline interpolation.",
        formulas: [
          {
            latex: "L(x) = \\sum_{i=0}^{n} y_i \\prod_{j \\neq i} \\frac{x - x_j}{x_i - x_j}",
            description: "Lagrange interpolation polynomial",
          },
        ],
        examples: [
          {
            problem: "Find the Lagrange polynomial through (0,1), (1,3), (2,7).",
            solution:
              "L(x) = 1·(x-1)(x-2)/((0-1)(0-2)) + 3·x(x-2)/((1-0)(1-2)) + 7·x(x-1)/((2-0)(2-1)) = x² + x + 1",
          },
        ],
        applications: [
          { field: "Computer Graphics", description: "Curve/surface generation" },
          { field: "Signal Processing", description: "Resampling" },
          { field: "Data Analysis", description: "Missing value estimation" },
        ],
      },
    },
    relations: {
      prerequisites: ["polynomial", "linear-algebra"],
      nextTopics: ["spline", "least-squares"],
      related: ["curve-fitting"],
    },
    tags: ["보간", "라그랑주", "interpolation", "Lagrange"],
  },
  {
    id: "numerical-ode",
    name: {
      ko: "미분방정식의 수치해법",
      en: "Numerical ODE Methods",
      ja: "常微分方程式の数値解法",
    },
    field: "numerical",
    subfield: "ode",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "미분방정식의 수치해법은 해석적 해를 구하기 어려운 미분방정식의 해를 근사적으로 구하는 방법입니다.",
        formulas: [
          {
            latex: "y_{n+1} = y_n + h f(t_n, y_n)",
            description: "오일러 방법 (전진)",
          },
          {
            latex: "y_{n+1} = y_n + h f(t_n + h/2, y_n + \\frac{h}{2}f(t_n, y_n))",
            description: "중점법 (2차 룽게-쿠타)",
          },
        ],
        examples: [
          {
            problem: "dy/dt = y, y(0) = 1을 오일러법으로 풀이하세요 (h = 0.1).",
            solution:
              "y₁ = 1 + 0.1(1) = 1.1, y₂ = 1.1 + 0.1(1.1) = 1.21, ... (정확해: e^t)",
          },
        ],
        applications: [
          { field: "물리학", description: "운동 시뮬레이션" },
          { field: "공학", description: "회로, 제어 시스템" },
          { field: "생물학", description: "개체군 모델" },
        ],
      },
      en: {
        definition:
          "Numerical ODE methods approximate solutions to differential equations that are difficult to solve analytically.",
        formulas: [
          {
            latex: "y_{n+1} = y_n + h f(t_n, y_n)",
            description: "Euler method (forward)",
          },
          {
            latex: "y_{n+1} = y_n + h f(t_n + h/2, y_n + \\frac{h}{2}f(t_n, y_n))",
            description: "Midpoint method (RK2)",
          },
        ],
        examples: [
          {
            problem: "Solve dy/dt = y, y(0) = 1 using Euler method (h = 0.1).",
            solution:
              "y₁ = 1 + 0.1(1) = 1.1, y₂ = 1.1 + 0.1(1.1) = 1.21, ... (exact: e^t)",
          },
        ],
        applications: [
          { field: "Physics", description: "Motion simulation" },
          { field: "Engineering", description: "Circuits, control systems" },
          { field: "Biology", description: "Population models" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative", "differential-equations"],
      nextTopics: ["runge-kutta", "stiff-equations"],
      related: ["stability"],
    },
    tags: ["미분방정식", "오일러", "ODE", "Euler"],
  },
];
