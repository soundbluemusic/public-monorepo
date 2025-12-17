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

  // ===== 14.4 고급 수치해석 =====
  {
    id: "runge-kutta",
    name: {
      ko: "룽게-쿠타 방법",
      en: "Runge-Kutta Methods",
      ja: "ルンゲ・クッタ法",
    },
    field: "numerical",
    subfield: "ode",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "룽게-쿠타 방법은 미분방정식의 정확한 수치해를 구하는 다단계 방법입니다. RK4(4차)가 가장 널리 사용됩니다.",
        formulas: [
          {
            latex: "k_1 = hf(t_n, y_n)",
            description: "1단계",
          },
          {
            latex: "k_2 = hf(t_n + h/2, y_n + k_1/2)",
            description: "2단계",
          },
          {
            latex: "k_3 = hf(t_n + h/2, y_n + k_2/2)",
            description: "3단계",
          },
          {
            latex: "k_4 = hf(t_n + h, y_n + k_3)",
            description: "4단계",
          },
          {
            latex: "y_{n+1} = y_n + \\frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4)",
            description: "RK4 업데이트",
          },
        ],
        examples: [
          {
            problem: "RK4와 오일러 방법의 오차를 비교하세요.",
            solution:
              "오일러: O(h) 지역오차, O(1) 전역오차. RK4: O(h⁵) 지역오차, O(h⁴) 전역오차. RK4가 훨씬 정확.",
          },
        ],
        history: {
          discoveredBy: "칼 룽게, 마르틴 쿠타",
          year: "1901년",
          background:
            "오일러 방법을 정밀하게 개선한 방법입니다.",
        },
        applications: [
          { field: "물리 시뮬레이션", description: "궤도, 진동계" },
          { field: "컴퓨터 그래픽스", description: "물리 엔진" },
          { field: "생물학", description: "반응 동역학" },
        ],
      },
      en: {
        definition:
          "Runge-Kutta methods are multi-stage methods for accurate numerical ODE solutions. RK4 (4th order) is most widely used.",
        formulas: [
          {
            latex: "k_1 = hf(t_n, y_n)",
            description: "Stage 1",
          },
          {
            latex: "k_2 = hf(t_n + h/2, y_n + k_1/2)",
            description: "Stage 2",
          },
          {
            latex: "k_3 = hf(t_n + h/2, y_n + k_2/2)",
            description: "Stage 3",
          },
          {
            latex: "k_4 = hf(t_n + h, y_n + k_3)",
            description: "Stage 4",
          },
          {
            latex: "y_{n+1} = y_n + \\frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4)",
            description: "RK4 update",
          },
        ],
        examples: [
          {
            problem: "Compare error of RK4 vs Euler method.",
            solution:
              "Euler: O(h) local, O(1) global error. RK4: O(h⁵) local, O(h⁴) global error. RK4 is much more accurate.",
          },
        ],
        history: {
          discoveredBy: "Carl Runge, Martin Kutta",
          year: "1901",
          background:
            "A refined improvement over Euler's method.",
        },
        applications: [
          { field: "Physics Simulation", description: "Orbits, oscillators" },
          { field: "Computer Graphics", description: "Physics engines" },
          { field: "Biology", description: "Reaction kinetics" },
        ],
      },
    },
    relations: {
      prerequisites: ["numerical-ode"],
      nextTopics: ["adaptive-rk", "stiff-methods"],
      related: ["taylor-method"],
    },
    tags: ["룽게쿠타", "RK4", "Runge-Kutta", "ODE"],
  },
  {
    id: "bisection-method",
    name: {
      ko: "이분법",
      en: "Bisection Method",
      ja: "二分法",
    },
    field: "numerical",
    subfield: "root-finding",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "이분법은 구간을 반으로 나누어 근을 찾는 단순하고 안정적인 방법입니다. 연속함수에서 부호가 바뀌면 근이 존재합니다(중간값 정리).",
        formulas: [
          {
            latex: "c = \\frac{a + b}{2}",
            description: "중간점 계산",
          },
          {
            latex: "f(a) \\cdot f(c) < 0 \\Rightarrow b = c, \\text{ else } a = c",
            description: "구간 선택",
          },
        ],
        examples: [
          {
            problem: "f(x) = x³ - 2에서 [1, 2] 구간으로 ∛2를 구하세요.",
            solution:
              "f(1) = -1 < 0, f(2) = 6 > 0. c = 1.5, f(1.5) = 1.375 > 0. 새 구간 [1, 1.5]. 반복하면 1.26...에 수렴.",
          },
        ],
        applications: [
          { field: "공학", description: "방정식 근 찾기" },
          { field: "금융", description: "내부수익률 계산" },
          { field: "컴퓨터 과학", description: "이진 탐색" },
        ],
      },
      en: {
        definition:
          "Bisection method finds roots by halving intervals. Simple and reliable. Sign change in continuous function implies root (IVT).",
        formulas: [
          {
            latex: "c = \\frac{a + b}{2}",
            description: "Midpoint calculation",
          },
          {
            latex: "f(a) \\cdot f(c) < 0 \\Rightarrow b = c, \\text{ else } a = c",
            description: "Interval selection",
          },
        ],
        examples: [
          {
            problem: "Find ∛2 using f(x) = x³ - 2 on [1, 2].",
            solution:
              "f(1) = -1 < 0, f(2) = 6 > 0. c = 1.5, f(1.5) = 1.375 > 0. New interval [1, 1.5]. Iterate to converge to 1.26...",
          },
        ],
        applications: [
          { field: "Engineering", description: "Equation solving" },
          { field: "Finance", description: "IRR calculation" },
          { field: "Computer Science", description: "Binary search" },
        ],
      },
    },
    relations: {
      prerequisites: ["continuity"],
      nextTopics: ["newton-method", "secant-method"],
      related: ["intermediate-value-theorem"],
    },
    tags: ["이분법", "근찾기", "bisection", "root"],
  },
  {
    id: "gauss-elimination",
    name: {
      ko: "가우스 소거법",
      en: "Gaussian Elimination",
      ja: "ガウス消去法",
    },
    field: "numerical",
    subfield: "linear-systems",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "가우스 소거법은 선형 연립방정식을 행 연산으로 상삼각 형태로 변환하여 푸는 방법입니다. O(n³) 복잡도를 가집니다.",
        formulas: [
          {
            latex: "Ax = b \\rightarrow Ux = c",
            description: "상삼각행렬로 변환",
          },
          {
            latex: "m_{ij} = \\frac{a_{ij}}{a_{jj}}",
            description: "승수(multiplier)",
          },
        ],
        examples: [
          {
            problem:
              "2x + y = 5, x - y = 1을 가우스 소거법으로 푸세요.",
            solution:
              "행2 -= (1/2)×행1: 2x + y = 5, -3y/2 = -3/2. y = 1, 역대입: x = 2.",
          },
        ],
        applications: [
          { field: "공학", description: "구조 분석" },
          { field: "컴퓨터 그래픽스", description: "변환 행렬" },
          { field: "회로 분석", description: "키르히호프 방정식" },
        ],
      },
      en: {
        definition:
          "Gaussian elimination solves linear systems by row operations to upper triangular form. O(n³) complexity.",
        formulas: [
          {
            latex: "Ax = b \\rightarrow Ux = c",
            description: "Transform to upper triangular",
          },
          {
            latex: "m_{ij} = \\frac{a_{ij}}{a_{jj}}",
            description: "Multiplier",
          },
        ],
        examples: [
          {
            problem:
              "Solve 2x + y = 5, x - y = 1 using Gaussian elimination.",
            solution:
              "Row2 -= (1/2)×Row1: 2x + y = 5, -3y/2 = -3/2. y = 1, back-substitute: x = 2.",
          },
        ],
        applications: [
          { field: "Engineering", description: "Structural analysis" },
          { field: "Computer Graphics", description: "Transformation matrices" },
          { field: "Circuit Analysis", description: "Kirchhoff equations" },
        ],
      },
    },
    relations: {
      prerequisites: ["matrix", "linear-algebra"],
      nextTopics: ["lu-decomposition", "pivoting"],
      related: ["matrix-inverse"],
    },
    tags: ["가우스소거", "선형시스템", "Gaussian", "elimination"],
  },
  {
    id: "least-squares",
    name: {
      ko: "최소자승법",
      en: "Least Squares",
      ja: "最小二乗法",
    },
    field: "numerical",
    subfield: "approximation",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "최소자승법은 데이터 점들과의 오차 제곱합을 최소화하는 곡선/직선을 찾습니다. 회귀 분석의 기초입니다.",
        formulas: [
          {
            latex: "\\min \\sum_{i=1}^{n} (y_i - f(x_i))^2",
            description: "최소자승 목적함수",
          },
          {
            latex: "A^T A \\hat{x} = A^T b",
            description: "정규방정식",
          },
        ],
        examples: [
          {
            problem: "점 (0,1), (1,2), (2,4)에 대한 최소자승 직선을 구하세요.",
            solution:
              "y = ax + b. A^TAx = A^Tb 풀이. a = 1.5, b = 0.67. 직선: y = 1.5x + 0.67",
          },
        ],
        history: {
          discoveredBy: "카를 프리드리히 가우스, 아드리앵마리 르장드르",
          year: "1805-1809년",
          background:
            "천문학적 관측 데이터 피팅에 사용되었습니다.",
        },
        applications: [
          { field: "통계학", description: "선형 회귀" },
          { field: "신호 처리", description: "노이즈 필터링" },
          { field: "기계학습", description: "모델 피팅" },
        ],
      },
      en: {
        definition:
          "Least squares finds curves minimizing sum of squared errors to data points. Foundation of regression analysis.",
        formulas: [
          {
            latex: "\\min \\sum_{i=1}^{n} (y_i - f(x_i))^2",
            description: "Least squares objective",
          },
          {
            latex: "A^T A \\hat{x} = A^T b",
            description: "Normal equations",
          },
        ],
        examples: [
          {
            problem: "Find least squares line for (0,1), (1,2), (2,4).",
            solution:
              "y = ax + b. Solve A^TAx = A^Tb. a = 1.5, b = 0.67. Line: y = 1.5x + 0.67",
          },
        ],
        history: {
          discoveredBy: "Carl Friedrich Gauss, Adrien-Marie Legendre",
          year: "1805-1809",
          background:
            "Used for fitting astronomical observation data.",
        },
        applications: [
          { field: "Statistics", description: "Linear regression" },
          { field: "Signal Processing", description: "Noise filtering" },
          { field: "Machine Learning", description: "Model fitting" },
        ],
      },
    },
    relations: {
      prerequisites: ["linear-algebra", "optimization-basics"],
      nextTopics: ["regularization", "nonlinear-ls"],
      related: ["regression"],
    },
    tags: ["최소자승", "회귀", "least squares", "regression"],
  },
  {
    id: "fft",
    name: {
      ko: "고속 푸리에 변환",
      en: "Fast Fourier Transform",
      ja: "高速フーリエ変換",
    },
    field: "numerical",
    subfield: "transforms",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "FFT는 이산 푸리에 변환(DFT)을 O(n²)에서 O(n log n)으로 가속하는 알고리즘입니다. 분할정복 전략을 사용합니다.",
        formulas: [
          {
            latex: "X_k = \\sum_{n=0}^{N-1} x_n e^{-2\\pi i kn/N}",
            description: "DFT 정의",
          },
          {
            latex: "O(N^2) \\rightarrow O(N \\log N)",
            description: "FFT 복잡도 개선",
          },
        ],
        examples: [
          {
            problem: "8-point DFT를 FFT로 계산하는 이점을 설명하세요.",
            solution:
              "직접 DFT: 64회 곱셈. FFT: 8×3 = 24회 곱셈. 약 2.7배 빠름. N이 클수록 차이 증가.",
          },
        ],
        history: {
          discoveredBy: "쿨리, 튜키",
          year: "1965년",
          background:
            "가우스가 비슷한 아이디어를 가졌지만, 쿨리-튜키가 현대적 형태를 제시했습니다.",
        },
        applications: [
          { field: "신호 처리", description: "주파수 분석, 필터링" },
          { field: "이미지 처리", description: "압축, 필터링" },
          { field: "오디오", description: "음향 분석, 이퀄라이저" },
        ],
      },
      en: {
        definition:
          "FFT accelerates Discrete Fourier Transform from O(n²) to O(n log n) using divide-and-conquer strategy.",
        formulas: [
          {
            latex: "X_k = \\sum_{n=0}^{N-1} x_n e^{-2\\pi i kn/N}",
            description: "DFT definition",
          },
          {
            latex: "O(N^2) \\rightarrow O(N \\log N)",
            description: "FFT complexity improvement",
          },
        ],
        examples: [
          {
            problem: "Explain benefit of FFT for 8-point DFT.",
            solution:
              "Direct DFT: 64 multiplications. FFT: 8×3 = 24 multiplications. About 2.7× faster. Gap grows with N.",
          },
        ],
        history: {
          discoveredBy: "Cooley, Tukey",
          year: "1965",
          background:
            "Gauss had similar ideas, but Cooley-Tukey presented the modern form.",
        },
        applications: [
          { field: "Signal Processing", description: "Frequency analysis, filtering" },
          { field: "Image Processing", description: "Compression, filtering" },
          { field: "Audio", description: "Sound analysis, equalizers" },
        ],
      },
    },
    relations: {
      prerequisites: ["complex-numbers", "fourier-series"],
      nextTopics: ["spectral-analysis", "convolution"],
      related: ["discrete-fourier"],
    },
    tags: ["FFT", "푸리에변환", "fast Fourier", "transform"],
  },
];
