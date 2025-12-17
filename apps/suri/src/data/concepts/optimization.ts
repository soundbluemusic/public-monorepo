/**
 * @fileoverview 최적화 이론 개념 데이터
 */
import type { MathConcept } from "../types";

export const optimizationConcepts: MathConcept[] = [
  {
    id: "optimization-basics",
    name: {
      ko: "최적화 기초",
      en: "Optimization Basics",
      ja: "最適化の基礎",
    },
    field: "optimization",
    subfield: "foundations",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "최적화는 주어진 조건 하에서 목적함수를 최대화하거나 최소화하는 변수 값을 찾는 것입니다.",
        formulas: [
          {
            latex: "\\min_{x} f(x) \\quad \\text{subject to} \\quad g(x) \\leq 0, h(x) = 0",
            description: "일반적인 최적화 문제",
          },
          {
            latex: "\\nabla f(x^*) = 0",
            description: "무제약 최적화의 필요조건",
          },
        ],
        examples: [
          {
            problem: "f(x) = x² - 4x + 5의 최솟값을 구하세요.",
            solution:
              "f'(x) = 2x - 4 = 0에서 x = 2. f''(2) = 2 > 0이므로 최솟값. f(2) = 4 - 8 + 5 = 1",
          },
        ],
        applications: [
          { field: "기계학습", description: "손실함수 최소화" },
          { field: "경제학", description: "효용 최대화" },
          { field: "공학", description: "설계 최적화" },
        ],
      },
      en: {
        definition:
          "Optimization is finding variable values that maximize or minimize an objective function under given constraints.",
        formulas: [
          {
            latex: "\\min_{x} f(x) \\quad \\text{subject to} \\quad g(x) \\leq 0, h(x) = 0",
            description: "General optimization problem",
          },
          {
            latex: "\\nabla f(x^*) = 0",
            description: "Necessary condition for unconstrained optimization",
          },
        ],
        examples: [
          {
            problem: "Find the minimum of f(x) = x² - 4x + 5.",
            solution:
              "f'(x) = 2x - 4 = 0 gives x = 2. f''(2) = 2 > 0, so minimum. f(2) = 4 - 8 + 5 = 1",
          },
        ],
        applications: [
          { field: "Machine Learning", description: "Loss function minimization" },
          { field: "Economics", description: "Utility maximization" },
          { field: "Engineering", description: "Design optimization" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative", "gradient"],
      nextTopics: ["gradient-descent", "lagrange-multipliers"],
      related: ["calculus"],
    },
    tags: ["최적화", "최솟값", "optimization", "minimum"],
  },
  {
    id: "gradient-descent",
    name: {
      ko: "경사 하강법",
      en: "Gradient Descent",
      ja: "勾配降下法",
    },
    field: "optimization",
    subfield: "algorithms",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "경사 하강법은 함수의 그래디언트(기울기) 반대 방향으로 반복적으로 이동하여 최솟값을 찾는 최적화 알고리즘입니다.",
        formulas: [
          {
            latex: "x_{n+1} = x_n - \\alpha \\nabla f(x_n)",
            description: "경사 하강법 업데이트 규칙",
          },
          {
            latex: "\\alpha",
            description: "학습률 (step size)",
          },
        ],
        examples: [
          {
            problem: "f(x) = x²에 경사 하강법을 x₀ = 4, α = 0.5로 적용하세요.",
            solution:
              "f'(x) = 2x. x₁ = 4 - 0.5(8) = 0. 한 번의 반복으로 최솟값에 도달.",
          },
        ],
        applications: [
          { field: "딥러닝", description: "신경망 학습" },
          { field: "기계학습", description: "모델 파라미터 최적화" },
          { field: "데이터 과학", description: "회귀 분석" },
        ],
      },
      en: {
        definition:
          "Gradient descent is an optimization algorithm that iteratively moves in the opposite direction of the gradient to find the minimum.",
        formulas: [
          {
            latex: "x_{n+1} = x_n - \\alpha \\nabla f(x_n)",
            description: "Gradient descent update rule",
          },
          {
            latex: "\\alpha",
            description: "Learning rate (step size)",
          },
        ],
        examples: [
          {
            problem: "Apply gradient descent to f(x) = x² with x₀ = 4, α = 0.5.",
            solution:
              "f'(x) = 2x. x₁ = 4 - 0.5(8) = 0. Reaches minimum in one iteration.",
          },
        ],
        applications: [
          { field: "Deep Learning", description: "Neural network training" },
          { field: "Machine Learning", description: "Model parameter optimization" },
          { field: "Data Science", description: "Regression analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["gradient", "derivative"],
      nextTopics: ["stochastic-gd", "adam-optimizer"],
      related: ["backpropagation"],
    },
    tags: ["경사하강", "기울기", "gradient descent", "optimization"],
  },
  {
    id: "lagrange-multipliers",
    name: {
      ko: "라그랑주 승수법",
      en: "Lagrange Multipliers",
      ja: "ラグランジュの未定乗数法",
    },
    field: "optimization",
    subfield: "constrained",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "라그랑주 승수법은 등식 제약 조건이 있는 최적화 문제를 푸는 방법입니다. 제약 조건을 새로운 변수(승수)와 결합합니다.",
        formulas: [
          {
            latex: "\\mathcal{L}(x, \\lambda) = f(x) - \\lambda g(x)",
            description: "라그랑지안",
          },
          {
            latex: "\\nabla f = \\lambda \\nabla g",
            description: "최적점에서의 조건",
          },
        ],
        examples: [
          {
            problem: "x + y = 10 제약 하에서 xy를 최대화하세요.",
            solution:
              "L = xy - λ(x+y-10). ∂L/∂x = y - λ = 0, ∂L/∂y = x - λ = 0. x = y이고 x + y = 10이므로 x = y = 5. 최댓값 = 25",
          },
        ],
        history: {
          discoveredBy: "조제프루이 라그랑주",
          year: "1788년",
          background:
            "라그랑주가 역학 문제를 풀면서 이 방법을 개발했습니다.",
        },
        applications: [
          { field: "경제학", description: "예산 제약 하 효용 최대화" },
          { field: "물리학", description: "역학적 제약 조건" },
          { field: "기계학습", description: "SVM의 최적화" },
        ],
      },
      en: {
        definition:
          "Lagrange multipliers method solves optimization problems with equality constraints by combining constraints with new variables (multipliers).",
        formulas: [
          {
            latex: "\\mathcal{L}(x, \\lambda) = f(x) - \\lambda g(x)",
            description: "Lagrangian",
          },
          {
            latex: "\\nabla f = \\lambda \\nabla g",
            description: "Condition at optimum",
          },
        ],
        examples: [
          {
            problem: "Maximize xy subject to x + y = 10.",
            solution:
              "L = xy - λ(x+y-10). ∂L/∂x = y - λ = 0, ∂L/∂y = x - λ = 0. x = y and x + y = 10, so x = y = 5. Maximum = 25",
          },
        ],
        history: {
          discoveredBy: "Joseph-Louis Lagrange",
          year: "1788",
          background:
            "Lagrange developed this method while solving mechanics problems.",
        },
        applications: [
          { field: "Economics", description: "Utility maximization under budget" },
          { field: "Physics", description: "Mechanical constraints" },
          { field: "Machine Learning", description: "SVM optimization" },
        ],
      },
    },
    relations: {
      prerequisites: ["gradient", "optimization-basics"],
      nextTopics: ["kkt-conditions", "convex-optimization"],
      related: ["multivariable-calculus"],
    },
    tags: ["라그랑주", "제약", "Lagrange", "constraint"],
  },
  {
    id: "linear-programming",
    name: {
      ko: "선형 계획법",
      en: "Linear Programming",
      ja: "線形計画法",
    },
    field: "optimization",
    subfield: "linear",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "선형 계획법은 선형 목적함수를 선형 제약조건 하에서 최적화하는 방법입니다. 심플렉스 알고리즘으로 효율적으로 풀 수 있습니다.",
        formulas: [
          {
            latex: "\\max c^T x \\quad \\text{s.t.} \\quad Ax \\leq b, x \\geq 0",
            description: "표준형 선형 계획 문제",
          },
        ],
        examples: [
          {
            problem:
              "max 3x + 2y, s.t. x + y ≤ 4, 2x + y ≤ 6, x,y ≥ 0을 푸세요.",
            solution:
              "꼭짓점 검사: (0,0)→0, (0,4)→8, (2,2)→10, (3,0)→9. 최적해: (2,2), 최댓값: 10",
          },
        ],
        history: {
          discoveredBy: "조지 단치그",
          year: "1947년",
          background:
            "단치그가 심플렉스 알고리즘을 개발하여 선형 계획법을 실용적으로 만들었습니다.",
        },
        applications: [
          { field: "운영 연구", description: "자원 배분, 스케줄링" },
          { field: "물류", description: "운송 최적화" },
          { field: "금융", description: "포트폴리오 최적화" },
        ],
      },
      en: {
        definition:
          "Linear programming optimizes a linear objective function under linear constraints. The simplex algorithm solves it efficiently.",
        formulas: [
          {
            latex: "\\max c^T x \\quad \\text{s.t.} \\quad Ax \\leq b, x \\geq 0",
            description: "Standard form linear program",
          },
        ],
        examples: [
          {
            problem:
              "Solve max 3x + 2y, s.t. x + y ≤ 4, 2x + y ≤ 6, x,y ≥ 0.",
            solution:
              "Check vertices: (0,0)→0, (0,4)→8, (2,2)→10, (3,0)→9. Optimal: (2,2), max: 10",
          },
        ],
        history: {
          discoveredBy: "George Dantzig",
          year: "1947",
          background:
            "Dantzig developed the simplex algorithm, making linear programming practical.",
        },
        applications: [
          { field: "Operations Research", description: "Resource allocation, scheduling" },
          { field: "Logistics", description: "Transportation optimization" },
          { field: "Finance", description: "Portfolio optimization" },
        ],
      },
    },
    relations: {
      prerequisites: ["linear-algebra", "inequalities"],
      nextTopics: ["integer-programming", "duality"],
      related: ["simplex-algorithm"],
    },
    tags: ["선형계획", "심플렉스", "linear programming", "LP"],
  },
  {
    id: "convex-optimization",
    name: {
      ko: "볼록 최적화",
      en: "Convex Optimization",
      ja: "凸最適化",
    },
    field: "optimization",
    subfield: "convex",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "볼록 최적화는 볼록 집합에서 볼록 함수를 최소화하는 문제입니다. 지역 최솟값이 전역 최솟값이 되어 효율적으로 풀 수 있습니다.",
        formulas: [
          {
            latex: "f(\\theta x + (1-\\theta)y) \\leq \\theta f(x) + (1-\\theta)f(y)",
            description: "볼록 함수의 정의",
          },
          {
            latex: "\\nabla^2 f(x) \\succeq 0",
            description: "볼록성의 이계 조건 (헤시안이 양반정치)",
          },
        ],
        examples: [
          {
            problem: "f(x) = x²이 볼록함을 보이세요.",
            solution:
              "f''(x) = 2 > 0 (항상 양수), 따라서 볼록합니다. 또는: f(θa + (1-θ)b) ≤ θf(a) + (1-θ)f(b)를 직접 확인.",
          },
        ],
        applications: [
          { field: "기계학습", description: "로지스틱 회귀, SVM" },
          { field: "신호 처리", description: "필터 설계" },
          { field: "제어 이론", description: "LQR 제어" },
        ],
      },
      en: {
        definition:
          "Convex optimization minimizes a convex function over a convex set. Local minima are global minima, making it efficiently solvable.",
        formulas: [
          {
            latex: "f(\\theta x + (1-\\theta)y) \\leq \\theta f(x) + (1-\\theta)f(y)",
            description: "Definition of convex function",
          },
          {
            latex: "\\nabla^2 f(x) \\succeq 0",
            description: "Second-order convexity condition (Hessian PSD)",
          },
        ],
        examples: [
          {
            problem: "Show f(x) = x² is convex.",
            solution:
              "f''(x) = 2 > 0 (always positive), so convex. Or verify: f(θa + (1-θ)b) ≤ θf(a) + (1-θ)f(b).",
          },
        ],
        applications: [
          { field: "Machine Learning", description: "Logistic regression, SVM" },
          { field: "Signal Processing", description: "Filter design" },
          { field: "Control Theory", description: "LQR control" },
        ],
      },
    },
    relations: {
      prerequisites: ["optimization-basics", "linear-algebra"],
      nextTopics: ["interior-point-methods"],
      related: ["linear-programming"],
    },
    tags: ["볼록", "최적화", "convex", "optimization"],
  },

  // ===== 13.4 고급 최적화 =====
  {
    id: "kkt-conditions",
    name: {
      ko: "KKT 조건",
      en: "KKT Conditions",
      ja: "KKT条件",
    },
    field: "optimization",
    subfield: "constrained",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "카루시-쿤-터커(KKT) 조건은 부등식 제약이 있는 최적화 문제의 최적성 필요조건입니다. 볼록 문제에서는 충분조건이 됩니다.",
        formulas: [
          {
            latex: "\\nabla f(x^*) + \\sum_i \\mu_i \\nabla g_i(x^*) + \\sum_j \\lambda_j \\nabla h_j(x^*) = 0",
            description: "정상성(Stationarity)",
          },
          {
            latex: "\\mu_i g_i(x^*) = 0, \\quad \\mu_i \\geq 0",
            description: "상보 여유(Complementary slackness)",
          },
        ],
        examples: [
          {
            problem: "min x² s.t. x ≥ 1의 KKT 조건을 구하세요.",
            solution:
              "L = x² - μ(x-1). 정상성: 2x - μ = 0. 상보: μ(x-1) = 0, μ ≥ 0. x = 1, μ = 2가 KKT점.",
          },
        ],
        history: {
          discoveredBy: "카루시, 쿤, 터커",
          year: "1951년",
          background:
            "라그랑주 조건을 부등식 제약으로 일반화했습니다.",
        },
        applications: [
          { field: "기계학습", description: "SVM 이중 문제" },
          { field: "경제학", description: "자원 제약 최적화" },
          { field: "공학", description: "최적 제어" },
        ],
      },
      en: {
        definition:
          "Karush-Kuhn-Tucker (KKT) conditions are necessary optimality conditions for optimization with inequality constraints. They're sufficient for convex problems.",
        formulas: [
          {
            latex: "\\nabla f(x^*) + \\sum_i \\mu_i \\nabla g_i(x^*) + \\sum_j \\lambda_j \\nabla h_j(x^*) = 0",
            description: "Stationarity",
          },
          {
            latex: "\\mu_i g_i(x^*) = 0, \\quad \\mu_i \\geq 0",
            description: "Complementary slackness",
          },
        ],
        examples: [
          {
            problem: "Find KKT conditions for min x² s.t. x ≥ 1.",
            solution:
              "L = x² - μ(x-1). Stationarity: 2x - μ = 0. Complementarity: μ(x-1) = 0, μ ≥ 0. KKT point: x = 1, μ = 2.",
          },
        ],
        history: {
          discoveredBy: "Karush, Kuhn, Tucker",
          year: "1951",
          background:
            "Generalized Lagrange conditions to inequality constraints.",
        },
        applications: [
          { field: "Machine Learning", description: "SVM dual problem" },
          { field: "Economics", description: "Resource-constrained optimization" },
          { field: "Engineering", description: "Optimal control" },
        ],
      },
    },
    relations: {
      prerequisites: ["lagrange-multipliers", "convex-optimization"],
      nextTopics: ["duality-theory", "interior-point"],
      related: ["optimization-basics"],
    },
    tags: ["KKT", "제약최적화", "constraints", "optimization"],
  },
  {
    id: "stochastic-gradient-descent",
    name: {
      ko: "확률적 경사 하강법",
      en: "Stochastic Gradient Descent",
      ja: "確率的勾配降下法",
    },
    field: "optimization",
    subfield: "algorithms",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "확률적 경사 하강법(SGD)은 전체 데이터 대신 무작위 샘플로 그래디언트를 추정합니다. 대규모 데이터에서 효율적입니다.",
        formulas: [
          {
            latex: "x_{n+1} = x_n - \\alpha \\nabla f_i(x_n)",
            description: "SGD 업데이트 (i는 무작위 샘플)",
          },
          {
            latex: "\\mathbb{E}[\\nabla f_i] = \\nabla f",
            description: "불편 추정량 조건",
          },
        ],
        examples: [
          {
            problem: "SGD와 배치 GD의 차이를 설명하세요.",
            solution:
              "배치 GD는 전체 데이터로 정확한 그래디언트 계산 (느림). SGD는 미니배치로 노이즈 있는 추정 (빠름, 탈출 가능성).",
          },
        ],
        applications: [
          { field: "딥러닝", description: "대규모 신경망 학습" },
          { field: "추천 시스템", description: "온라인 학습" },
          { field: "강화학습", description: "정책 그래디언트" },
        ],
      },
      en: {
        definition:
          "Stochastic Gradient Descent (SGD) estimates gradients using random samples instead of full data. Efficient for large-scale data.",
        formulas: [
          {
            latex: "x_{n+1} = x_n - \\alpha \\nabla f_i(x_n)",
            description: "SGD update (i is random sample)",
          },
          {
            latex: "\\mathbb{E}[\\nabla f_i] = \\nabla f",
            description: "Unbiased estimator condition",
          },
        ],
        examples: [
          {
            problem: "Explain the difference between SGD and batch GD.",
            solution:
              "Batch GD computes exact gradient over all data (slow). SGD uses mini-batches for noisy estimates (fast, can escape local minima).",
          },
        ],
        applications: [
          { field: "Deep Learning", description: "Large neural network training" },
          { field: "Recommender Systems", description: "Online learning" },
          { field: "Reinforcement Learning", description: "Policy gradients" },
        ],
      },
    },
    relations: {
      prerequisites: ["gradient-descent"],
      nextTopics: ["adam", "momentum"],
      related: ["backpropagation"],
    },
    tags: ["SGD", "확률적경사하강", "stochastic", "gradient"],
  },
  {
    id: "integer-programming",
    name: {
      ko: "정수 계획법",
      en: "Integer Programming",
      ja: "整数計画法",
    },
    field: "optimization",
    subfield: "discrete",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "정수 계획법은 변수가 정수로 제한된 최적화 문제입니다. NP-난해하지만 분기한정법, 절단평면법으로 풀 수 있습니다.",
        formulas: [
          {
            latex: "\\max c^T x \\quad \\text{s.t.} \\quad Ax \\leq b, x \\in \\mathbb{Z}^n",
            description: "정수 선형 계획 문제",
          },
        ],
        examples: [
          {
            problem: "배낭 문제가 정수 계획 문제임을 보이세요.",
            solution:
              "max Σvᵢxᵢ s.t. Σwᵢxᵢ ≤ W, xᵢ ∈ {0,1}. 각 물건을 넣거나(1) 안넣거나(0).",
          },
        ],
        applications: [
          { field: "운영 연구", description: "스케줄링, 자원 배분" },
          { field: "물류", description: "차량 경로 문제" },
          { field: "통신", description: "주파수 할당" },
        ],
      },
      en: {
        definition:
          "Integer programming has variables restricted to integers. NP-hard, but solvable via branch-and-bound, cutting planes.",
        formulas: [
          {
            latex: "\\max c^T x \\quad \\text{s.t.} \\quad Ax \\leq b, x \\in \\mathbb{Z}^n",
            description: "Integer linear program",
          },
        ],
        examples: [
          {
            problem: "Show knapsack is an integer programming problem.",
            solution:
              "max Σvᵢxᵢ s.t. Σwᵢxᵢ ≤ W, xᵢ ∈ {0,1}. Each item is included (1) or not (0).",
          },
        ],
        applications: [
          { field: "Operations Research", description: "Scheduling, resource allocation" },
          { field: "Logistics", description: "Vehicle routing" },
          { field: "Telecommunications", description: "Frequency assignment" },
        ],
      },
    },
    relations: {
      prerequisites: ["linear-programming"],
      nextTopics: ["branch-and-bound", "cutting-planes"],
      related: ["combinatorial-optimization"],
    },
    tags: ["정수계획", "이산", "integer programming", "IP"],
  },
  {
    id: "newton-optimization",
    name: {
      ko: "뉴턴 최적화",
      en: "Newton's Method for Optimization",
      ja: "ニュートン法（最適化）",
    },
    field: "optimization",
    subfield: "algorithms",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "뉴턴 최적화는 헤시안(2차 미분)을 사용하여 2차 수렴하는 최적화 알고리즘입니다. 경사하강법보다 빠르지만 계산 비용이 높습니다.",
        formulas: [
          {
            latex: "x_{n+1} = x_n - H(x_n)^{-1} \\nabla f(x_n)",
            description: "뉴턴 최적화 업데이트",
          },
          {
            latex: "H(x) = \\nabla^2 f(x)",
            description: "헤시안 행렬",
          },
        ],
        examples: [
          {
            problem: "f(x) = x⁴ - 2x²에 뉴턴법을 x₀ = 2에서 적용하세요.",
            solution:
              "f' = 4x³ - 4x, f'' = 12x² - 4. x₁ = 2 - (24)/(44) ≈ 1.45. 이차 수렴으로 빠르게 극값 접근.",
          },
        ],
        applications: [
          { field: "통계학", description: "최대우도추정" },
          { field: "기계학습", description: "로지스틱 회귀" },
          { field: "공학", description: "구조 최적화" },
        ],
      },
      en: {
        definition:
          "Newton's optimization uses Hessian (second derivatives) for quadratic convergence. Faster than gradient descent but computationally expensive.",
        formulas: [
          {
            latex: "x_{n+1} = x_n - H(x_n)^{-1} \\nabla f(x_n)",
            description: "Newton optimization update",
          },
          {
            latex: "H(x) = \\nabla^2 f(x)",
            description: "Hessian matrix",
          },
        ],
        examples: [
          {
            problem: "Apply Newton's method to f(x) = x⁴ - 2x² at x₀ = 2.",
            solution:
              "f' = 4x³ - 4x, f'' = 12x² - 4. x₁ = 2 - (24)/(44) ≈ 1.45. Quadratic convergence approaches extremum quickly.",
          },
        ],
        applications: [
          { field: "Statistics", description: "Maximum likelihood estimation" },
          { field: "Machine Learning", description: "Logistic regression" },
          { field: "Engineering", description: "Structural optimization" },
        ],
      },
    },
    relations: {
      prerequisites: ["gradient-descent", "hessian"],
      nextTopics: ["quasi-newton", "bfgs"],
      related: ["newton-method"],
    },
    tags: ["뉴턴", "헤시안", "Newton", "Hessian"],
  },
  {
    id: "genetic-algorithm",
    name: {
      ko: "유전 알고리즘",
      en: "Genetic Algorithm",
      ja: "遺伝的アルゴリズム",
    },
    field: "optimization",
    subfield: "metaheuristics",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "유전 알고리즘은 생물 진화를 모방한 최적화 기법입니다. 선택, 교차, 돌연변이 연산으로 해집단을 진화시킵니다.",
        formulas: [
          {
            latex: "P(t+1) = \\text{Select}(\\text{Mutate}(\\text{Crossover}(P(t))))",
            description: "세대 진화",
          },
        ],
        examples: [
          {
            problem: "유전 알고리즘으로 f(x) = -x²의 최댓값을 찾는 과정을 설명하세요.",
            solution:
              "초기 개체군 랜덤 생성. 적합도 = f(x). 높은 적합도 개체 선택. 교차로 자식 생성. 돌연변이로 다양성 유지. 반복하면 x = 0에 수렴.",
          },
        ],
        history: {
          discoveredBy: "존 홀랜드",
          year: "1975년",
          background:
            "다윈의 자연선택 이론을 최적화에 적용했습니다.",
        },
        applications: [
          { field: "공학 설계", description: "형상 최적화" },
          { field: "스케줄링", description: "작업 일정 최적화" },
          { field: "기계학습", description: "신경망 구조 탐색" },
        ],
      },
      en: {
        definition:
          "Genetic algorithms mimic biological evolution for optimization. Selection, crossover, and mutation operations evolve a population of solutions.",
        formulas: [
          {
            latex: "P(t+1) = \\text{Select}(\\text{Mutate}(\\text{Crossover}(P(t))))",
            description: "Generation evolution",
          },
        ],
        examples: [
          {
            problem: "Describe finding max of f(x) = -x² using genetic algorithm.",
            solution:
              "Initialize random population. Fitness = f(x). Select high-fitness individuals. Crossover to create children. Mutate for diversity. Iterate to converge to x = 0.",
          },
        ],
        history: {
          discoveredBy: "John Holland",
          year: "1975",
          background:
            "Applied Darwin's natural selection to optimization.",
        },
        applications: [
          { field: "Engineering Design", description: "Shape optimization" },
          { field: "Scheduling", description: "Job scheduling" },
          { field: "Machine Learning", description: "Neural architecture search" },
        ],
      },
    },
    relations: {
      prerequisites: ["optimization-basics"],
      nextTopics: ["simulated-annealing", "particle-swarm"],
      related: ["evolutionary-computation"],
    },
    tags: ["유전알고리즘", "진화", "genetic", "evolution"],
  },
];
