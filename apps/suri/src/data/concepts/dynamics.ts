/**
 * @fileoverview 동역학계와 카오스 개념 데이터
 */
import type { MathConcept } from "../types";

export const dynamicsConcepts: MathConcept[] = [
  {
    id: "dynamical-systems",
    name: {
      ko: "동역학계",
      en: "Dynamical Systems",
      ja: "力学系",
    },
    field: "dynamics",
    subfield: "dynamical-systems",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "동역학계는 시간에 따라 상태가 변화하는 시스템을 수학적으로 모델링한 것입니다. 미분방정식이나 차분방정식으로 표현됩니다.",
        formulas: [
          {
            latex: "\\frac{dx}{dt} = f(x)",
            description: "연속 동역학계 (자율 시스템)",
          },
          {
            latex: "x_{n+1} = f(x_n)",
            description: "이산 동역학계",
          },
        ],
        examples: [
          {
            problem: "인구 성장 모델 dP/dt = rP를 풀이하세요.",
            solution:
              "변수분리: dP/P = r dt, ln|P| = rt + C, P(t) = P₀e^(rt) (지수 성장)",
          },
        ],
        applications: [
          { field: "물리학", description: "행성 운동, 진자 운동" },
          { field: "생물학", description: "인구 동태, 생태계 모델" },
          { field: "경제학", description: "경기 순환, 시장 동역학" },
        ],
      },
      en: {
        definition:
          "A dynamical system mathematically models how states evolve over time. It's expressed through differential or difference equations.",
        formulas: [
          {
            latex: "\\frac{dx}{dt} = f(x)",
            description: "Continuous dynamical system (autonomous)",
          },
          {
            latex: "x_{n+1} = f(x_n)",
            description: "Discrete dynamical system",
          },
        ],
        examples: [
          {
            problem: "Solve the population growth model dP/dt = rP.",
            solution:
              "Separation: dP/P = r dt, ln|P| = rt + C, P(t) = P₀e^(rt) (exponential growth)",
          },
        ],
        applications: [
          { field: "Physics", description: "Planetary motion, pendulum" },
          { field: "Biology", description: "Population dynamics, ecosystem models" },
          { field: "Economics", description: "Business cycles, market dynamics" },
        ],
      },
    },
    relations: {
      prerequisites: ["differential-equations", "derivative"],
      nextTopics: ["chaos-theory", "fixed-points"],
      related: ["phase-space"],
    },
    tags: ["동역학", "시스템", "dynamical", "system"],
  },
  {
    id: "chaos-theory",
    name: {
      ko: "카오스 이론",
      en: "Chaos Theory",
      ja: "カオス理論",
    },
    field: "dynamics",
    subfield: "chaos",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "카오스는 결정론적 시스템에서 나타나는 비예측적 행동입니다. 초기 조건에 극도로 민감하며(나비 효과), 장기 예측이 불가능합니다.",
        formulas: [
          {
            latex: "x_{n+1} = rx_n(1 - x_n)",
            description: "로지스틱 맵 (카오스의 대표적 예)",
          },
          {
            latex: "\\lambda = \\lim_{n \\to \\infty} \\frac{1}{n} \\sum_{i=0}^{n-1} \\ln|f'(x_i)|",
            description: "리아푸노프 지수",
          },
        ],
        examples: [
          {
            problem: "r = 4인 로지스틱 맵이 카오스적임을 설명하세요.",
            solution:
              "r = 4일 때 리아푸노프 지수가 양수(λ = ln 2)이며, 초기값의 작은 차이가 지수적으로 확대됩니다.",
          },
        ],
        history: {
          discoveredBy: "에드워드 로렌츠",
          year: "1963년",
          background:
            "기상학자 로렌츠가 날씨 모델에서 초기조건 민감성을 발견하며 카오스 이론이 시작되었습니다.",
        },
        applications: [
          { field: "기상학", description: "날씨 예측의 한계" },
          { field: "암호학", description: "카오스 기반 암호" },
          { field: "생태학", description: "개체군 변동" },
        ],
      },
      en: {
        definition:
          "Chaos is unpredictable behavior in deterministic systems. It shows extreme sensitivity to initial conditions (butterfly effect), making long-term prediction impossible.",
        formulas: [
          {
            latex: "x_{n+1} = rx_n(1 - x_n)",
            description: "Logistic map (classic chaos example)",
          },
          {
            latex: "\\lambda = \\lim_{n \\to \\infty} \\frac{1}{n} \\sum_{i=0}^{n-1} \\ln|f'(x_i)|",
            description: "Lyapunov exponent",
          },
        ],
        examples: [
          {
            problem: "Explain why logistic map with r = 4 is chaotic.",
            solution:
              "At r = 4, Lyapunov exponent is positive (λ = ln 2), small differences in initial values grow exponentially.",
          },
        ],
        history: {
          discoveredBy: "Edward Lorenz",
          year: "1963",
          background:
            "Meteorologist Lorenz discovered sensitivity to initial conditions in weather models, initiating chaos theory.",
        },
        applications: [
          { field: "Meteorology", description: "Weather prediction limits" },
          { field: "Cryptography", description: "Chaos-based encryption" },
          { field: "Ecology", description: "Population fluctuations" },
        ],
      },
    },
    relations: {
      prerequisites: ["dynamical-systems"],
      nextTopics: ["fractals", "strange-attractors"],
      related: ["butterfly-effect"],
    },
    tags: ["카오스", "나비효과", "chaos", "butterfly effect"],
  },
  {
    id: "fractals",
    name: {
      ko: "프랙탈",
      en: "Fractals",
      ja: "フラクタル",
    },
    field: "dynamics",
    subfield: "fractals",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "프랙탈은 부분이 전체와 유사한 구조(자기유사성)를 가진 기하학적 도형입니다. 비정수 차원을 가질 수 있습니다.",
        formulas: [
          {
            latex: "D = \\frac{\\log N}{\\log s}",
            description: "프랙탈 차원 (N: 조각 수, s: 배율)",
          },
          {
            latex: "z_{n+1} = z_n^2 + c",
            description: "만델브로 집합의 점화식",
          },
        ],
        examples: [
          {
            problem: "시에르핀스키 삼각형의 차원을 구하세요.",
            solution:
              "매 단계 3조각, 배율 2. D = log(3)/log(2) ≈ 1.585",
          },
          {
            problem: "코흐 눈송이의 차원은?",
            solution:
              "매 단계 4조각, 배율 3. D = log(4)/log(3) ≈ 1.262",
          },
        ],
        history: {
          discoveredBy: "브누아 만델브로",
          year: "1975년",
          background:
            "만델브로가 '프랙탈'이라는 용어를 만들고 이 분야를 체계화했습니다.",
        },
        applications: [
          { field: "컴퓨터 그래픽스", description: "자연 지형 생성" },
          { field: "생물학", description: "혈관, 폐의 구조" },
          { field: "안테나 설계", description: "프랙탈 안테나" },
        ],
      },
      en: {
        definition:
          "Fractals are geometric shapes where parts resemble the whole (self-similarity). They can have non-integer dimensions.",
        formulas: [
          {
            latex: "D = \\frac{\\log N}{\\log s}",
            description: "Fractal dimension (N: pieces, s: scale)",
          },
          {
            latex: "z_{n+1} = z_n^2 + c",
            description: "Mandelbrot set iteration",
          },
        ],
        examples: [
          {
            problem: "Find the dimension of Sierpinski triangle.",
            solution:
              "Each step: 3 pieces, scale 2. D = log(3)/log(2) ≈ 1.585",
          },
          {
            problem: "What is the dimension of Koch snowflake?",
            solution:
              "Each step: 4 pieces, scale 3. D = log(4)/log(3) ≈ 1.262",
          },
        ],
        history: {
          discoveredBy: "Benoit Mandelbrot",
          year: "1975",
          background:
            "Mandelbrot coined the term 'fractal' and systematized the field.",
        },
        applications: [
          { field: "Computer Graphics", description: "Natural terrain generation" },
          { field: "Biology", description: "Blood vessels, lung structure" },
          { field: "Antenna Design", description: "Fractal antennas" },
        ],
      },
    },
    relations: {
      prerequisites: ["complex-numbers", "iteration"],
      nextTopics: ["mandelbrot-set", "julia-sets"],
      related: ["self-similarity"],
    },
    tags: ["프랙탈", "자기유사", "fractal", "self-similar"],
  },
  {
    id: "fixed-points",
    name: {
      ko: "고정점과 안정성",
      en: "Fixed Points and Stability",
      ja: "不動点と安定性",
    },
    field: "dynamics",
    subfield: "dynamical-systems",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "고정점은 동역학계에서 시간이 지나도 변하지 않는 상태입니다. 고정점은 안정(끌개), 불안정, 또는 안장점일 수 있습니다.",
        formulas: [
          {
            latex: "f(x^*) = x^* \\text{ (이산)}, \\quad f(x^*) = 0 \\text{ (연속)}",
            description: "고정점의 조건",
          },
          {
            latex: "|f'(x^*)| < 1 \\text{ : 안정}, \\quad |f'(x^*)| > 1 \\text{ : 불안정}",
            description: "이산 시스템의 안정성",
          },
        ],
        examples: [
          {
            problem: "f(x) = x² - x - 1의 고정점과 안정성을 분석하세요.",
            solution:
              "x = x² - x - 1에서 x² - 2x - 1 = 0, x = 1 ± √2. f'(x) = 2x - 1. |f'(1+√2)| = |1+2√2| > 1 (불안정), |f'(1-√2)| = |1-2√2| < 1 (안정)",
          },
        ],
        applications: [
          { field: "제어 이론", description: "시스템 안정화" },
          { field: "생태학", description: "평형 개체군" },
          { field: "경제학", description: "시장 균형" },
        ],
      },
      en: {
        definition:
          "A fixed point is a state that doesn't change over time in a dynamical system. Fixed points can be stable (attractors), unstable, or saddle points.",
        formulas: [
          {
            latex: "f(x^*) = x^* \\text{ (discrete)}, \\quad f(x^*) = 0 \\text{ (continuous)}",
            description: "Fixed point condition",
          },
          {
            latex: "|f'(x^*)| < 1 \\text{ : stable}, \\quad |f'(x^*)| > 1 \\text{ : unstable}",
            description: "Stability in discrete systems",
          },
        ],
        examples: [
          {
            problem: "Analyze fixed points and stability of f(x) = x² - x - 1.",
            solution:
              "x = x² - x - 1 gives x² - 2x - 1 = 0, x = 1 ± √2. f'(x) = 2x - 1. |f'(1+√2)| = |1+2√2| > 1 (unstable), |f'(1-√2)| = |1-2√2| < 1 (stable)",
          },
        ],
        applications: [
          { field: "Control Theory", description: "System stabilization" },
          { field: "Ecology", description: "Equilibrium populations" },
          { field: "Economics", description: "Market equilibrium" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative", "dynamical-systems"],
      nextTopics: ["bifurcation", "attractors"],
      related: ["equilibrium"],
    },
    tags: ["고정점", "안정성", "fixed point", "stability"],
  },
  {
    id: "bifurcation",
    name: {
      ko: "분기",
      en: "Bifurcation",
      ja: "分岐",
    },
    field: "dynamics",
    subfield: "dynamical-systems",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "분기는 매개변수가 변할 때 동역학계의 질적 행동이 갑자기 변하는 현상입니다. 새로운 고정점이 생기거나 안정성이 바뀝니다.",
        formulas: [
          {
            latex: "x_{n+1} = rx_n(1-x_n)",
            description: "로지스틱 맵 (r에 따라 분기)",
          },
        ],
        examples: [
          {
            problem: "로지스틱 맵의 분기 과정을 설명하세요.",
            solution:
              "r < 1: 소멸, r = 1: 초월분기, 1 < r < 3: 하나의 안정점, r = 3: 주기배가 분기 시작, r ≈ 3.57: 카오스 시작",
          },
        ],
        applications: [
          { field: "물리학", description: "상전이" },
          { field: "생태학", description: "개체군 폭발/붕괴" },
          { field: "공학", description: "시스템 불안정 예측" },
        ],
      },
      en: {
        definition:
          "Bifurcation is when qualitative behavior of a dynamical system suddenly changes as a parameter varies. New fixed points may appear or stability may change.",
        formulas: [
          {
            latex: "x_{n+1} = rx_n(1-x_n)",
            description: "Logistic map (bifurcates with r)",
          },
        ],
        examples: [
          {
            problem: "Describe the bifurcation process in logistic map.",
            solution:
              "r < 1: extinction, r = 1: transcritical, 1 < r < 3: one stable point, r = 3: period doubling begins, r ≈ 3.57: chaos onset",
          },
        ],
        applications: [
          { field: "Physics", description: "Phase transitions" },
          { field: "Ecology", description: "Population boom/crash" },
          { field: "Engineering", description: "System instability prediction" },
        ],
      },
    },
    relations: {
      prerequisites: ["fixed-points", "dynamical-systems"],
      nextTopics: ["chaos-theory"],
      related: ["phase-transition"],
    },
    tags: ["분기", "주기배가", "bifurcation", "period doubling"],
  },
];
