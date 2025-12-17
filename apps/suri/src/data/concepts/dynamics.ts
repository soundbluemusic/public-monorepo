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

  // ===== 12.4 끌개와 위상공간 =====
  {
    id: "strange-attractor",
    name: {
      ko: "이상 끌개",
      en: "Strange Attractor",
      ja: "ストレンジアトラクタ",
    },
    field: "dynamics",
    subfield: "chaos",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "이상 끌개는 카오스 시스템에서 궤적이 끌리는 프랙탈 구조입니다. 끌개 위의 궤적은 결정론적이지만 초기조건에 민감합니다.",
        formulas: [
          {
            latex: "\\frac{dx}{dt} = \\sigma(y-x), \\quad \\frac{dy}{dt} = x(\\rho-z)-y, \\quad \\frac{dz}{dt} = xy-\\beta z",
            description: "로렌츠 방정식",
          },
        ],
        examples: [
          {
            problem: "로렌츠 끌개의 특징을 설명하세요.",
            solution:
              "나비 모양의 프랙탈 구조. σ=10, ρ=28, β=8/3에서 두 불안정 고정점 주위를 불규칙하게 순환. 비주기적이지만 유계.",
          },
        ],
        history: {
          discoveredBy: "에드워드 로렌츠",
          year: "1963년",
          background:
            "기상 모델에서 처음 발견되어 카오스 이론의 시작점이 되었습니다.",
        },
        applications: [
          { field: "기상학", description: "대기 모델" },
          { field: "물리학", description: "난류" },
          { field: "예술", description: "카오스 예술" },
        ],
      },
      en: {
        definition:
          "A strange attractor is a fractal structure that trajectories approach in chaotic systems. Trajectories on it are deterministic but sensitive to initial conditions.",
        formulas: [
          {
            latex: "\\frac{dx}{dt} = \\sigma(y-x), \\quad \\frac{dy}{dt} = x(\\rho-z)-y, \\quad \\frac{dz}{dt} = xy-\\beta z",
            description: "Lorenz equations",
          },
        ],
        examples: [
          {
            problem: "Describe the characteristics of the Lorenz attractor.",
            solution:
              "Butterfly-shaped fractal structure. At σ=10, ρ=28, β=8/3, orbits irregularly around two unstable fixed points. Aperiodic but bounded.",
          },
        ],
        history: {
          discoveredBy: "Edward Lorenz",
          year: "1963",
          background:
            "First discovered in a weather model, becoming the starting point of chaos theory.",
        },
        applications: [
          { field: "Meteorology", description: "Atmospheric models" },
          { field: "Physics", description: "Turbulence" },
          { field: "Art", description: "Chaos art" },
        ],
      },
    },
    relations: {
      prerequisites: ["chaos-theory", "dynamical-systems"],
      nextTopics: ["henon-attractor", "rossler-attractor"],
      related: ["fractals"],
    },
    tags: ["이상끌개", "로렌츠", "strange attractor", "Lorenz"],
  },
  {
    id: "phase-space",
    name: {
      ko: "위상공간 (상태공간)",
      en: "Phase Space",
      ja: "位相空間",
    },
    field: "dynamics",
    subfield: "dynamical-systems",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "위상공간(상태공간)은 시스템의 가능한 모든 상태를 점으로 나타낸 공간입니다. 각 차원은 시스템의 변수를 나타내며, 궤적은 시간 발전을 보여줍니다.",
        formulas: [
          {
            latex: "(q_1, \\ldots, q_n, p_1, \\ldots, p_n) \\in \\mathbb{R}^{2n}",
            description: "일반화 좌표와 운동량 (해밀턴 역학)",
          },
        ],
        examples: [
          {
            problem: "단진자의 위상공간을 설명하세요.",
            solution:
              "2차원: (θ, ω). 에너지가 낮으면 타원형 닫힌 궤적(진동), 높으면 열린 궤적(회전). 분리점에서 안장점 구조.",
          },
        ],
        applications: [
          { field: "물리학", description: "해밀턴 역학" },
          { field: "제어 이론", description: "상태 공간 표현" },
          { field: "생물학", description: "개체군 위상 초상화" },
        ],
      },
      en: {
        definition:
          "Phase space (state space) represents all possible states of a system as points. Each dimension represents a variable, and trajectories show time evolution.",
        formulas: [
          {
            latex: "(q_1, \\ldots, q_n, p_1, \\ldots, p_n) \\in \\mathbb{R}^{2n}",
            description: "Generalized coordinates and momenta (Hamiltonian)",
          },
        ],
        examples: [
          {
            problem: "Describe the phase space of a simple pendulum.",
            solution:
              "2D: (θ, ω). Low energy: elliptical closed orbits (oscillation), high energy: open orbits (rotation). Saddle point structure at separatrix.",
          },
        ],
        applications: [
          { field: "Physics", description: "Hamiltonian mechanics" },
          { field: "Control Theory", description: "State space representation" },
          { field: "Biology", description: "Population phase portraits" },
        ],
      },
    },
    relations: {
      prerequisites: ["dynamical-systems"],
      nextTopics: ["phase-portrait", "attractor"],
      related: ["hamiltonian"],
    },
    tags: ["위상공간", "상태공간", "phase space", "state space"],
  },
  {
    id: "lyapunov-exponent",
    name: {
      ko: "리아푸노프 지수",
      en: "Lyapunov Exponent",
      ja: "リャプノフ指数",
    },
    field: "dynamics",
    subfield: "chaos",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "리아푸노프 지수는 인접한 궤적들이 지수적으로 분리되는 속도를 측정합니다. 양수면 카오스, 0이면 주기적, 음수면 끌개로 수렴을 나타냅니다.",
        formulas: [
          {
            latex: "|\\delta(t)| \\approx |\\delta_0| e^{\\lambda t}",
            description: "인접 궤적의 분리",
          },
          {
            latex: "\\lambda = \\lim_{t \\to \\infty} \\frac{1}{t} \\ln \\frac{|\\delta(t)|}{|\\delta_0|}",
            description: "리아푸노프 지수의 정의",
          },
        ],
        examples: [
          {
            problem: "r = 4인 로지스틱 맵의 리아푸노프 지수를 계산하세요.",
            solution:
              "λ = ∫₀¹ ln|4(1-2x)| dx = ln 2 ≈ 0.693 > 0, 따라서 카오스.",
          },
        ],
        applications: [
          { field: "카오스 진단", description: "카오스 여부 판별" },
          { field: "암호학", description: "카오스 암호 보안성" },
          { field: "기상학", description: "예측 가능 시간 추정" },
        ],
      },
      en: {
        definition:
          "Lyapunov exponent measures how fast nearby trajectories separate exponentially. Positive means chaos, zero periodic, negative convergence to attractor.",
        formulas: [
          {
            latex: "|\\delta(t)| \\approx |\\delta_0| e^{\\lambda t}",
            description: "Separation of nearby trajectories",
          },
          {
            latex: "\\lambda = \\lim_{t \\to \\infty} \\frac{1}{t} \\ln \\frac{|\\delta(t)|}{|\\delta_0|}",
            description: "Definition of Lyapunov exponent",
          },
        ],
        examples: [
          {
            problem: "Calculate Lyapunov exponent for logistic map with r = 4.",
            solution:
              "λ = ∫₀¹ ln|4(1-2x)| dx = ln 2 ≈ 0.693 > 0, hence chaotic.",
          },
        ],
        applications: [
          { field: "Chaos Detection", description: "Determining if system is chaotic" },
          { field: "Cryptography", description: "Chaos cipher security" },
          { field: "Meteorology", description: "Estimating predictability horizon" },
        ],
      },
    },
    relations: {
      prerequisites: ["chaos-theory"],
      nextTopics: ["kolmogorov-sinai-entropy"],
      related: ["strange-attractor"],
    },
    tags: ["리아푸노프", "지수", "Lyapunov", "exponent"],
  },
  {
    id: "limit-cycle",
    name: {
      ko: "극한 주기",
      en: "Limit Cycle",
      ja: "リミットサイクル",
    },
    field: "dynamics",
    subfield: "dynamical-systems",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "극한 주기는 위상공간에서 고립된 닫힌 궤적으로, 인근 궤적들이 이 주기 궤도로 끌리거나 밀려납니다. 자기유지적 진동을 나타냅니다.",
        formulas: [
          {
            latex: "\\dot{r} = r(1-r^2), \\quad \\dot{\\theta} = 1",
            description: "극한 주기를 갖는 시스템 예",
          },
        ],
        examples: [
          {
            problem: "반 데어 폴 발진기가 극한 주기를 가짐을 설명하세요.",
            solution:
              "ẍ - μ(1-x²)ẋ + x = 0. μ > 0일 때 원점은 불안정, 모든 궤적은 안정한 극한 주기로 끌립니다.",
          },
        ],
        applications: [
          { field: "전기 공학", description: "발진기 회로" },
          { field: "생물학", description: "심장 박동, 일주기 리듬" },
          { field: "신경과학", description: "뉴런 발화 패턴" },
        ],
      },
      en: {
        definition:
          "A limit cycle is an isolated closed trajectory in phase space that nearby trajectories spiral toward or away from. It represents self-sustained oscillations.",
        formulas: [
          {
            latex: "\\dot{r} = r(1-r^2), \\quad \\dot{\\theta} = 1",
            description: "Example system with limit cycle",
          },
        ],
        examples: [
          {
            problem: "Explain why van der Pol oscillator has a limit cycle.",
            solution:
              "ẍ - μ(1-x²)ẋ + x = 0. For μ > 0, origin is unstable, all trajectories spiral to a stable limit cycle.",
          },
        ],
        applications: [
          { field: "Electrical Engineering", description: "Oscillator circuits" },
          { field: "Biology", description: "Heartbeat, circadian rhythms" },
          { field: "Neuroscience", description: "Neuron firing patterns" },
        ],
      },
    },
    relations: {
      prerequisites: ["fixed-points", "phase-space"],
      nextTopics: ["hopf-bifurcation"],
      related: ["periodic-orbit"],
    },
    tags: ["극한주기", "진동", "limit cycle", "oscillation"],
  },
  {
    id: "mandelbrot-set",
    name: {
      ko: "만델브로 집합",
      en: "Mandelbrot Set",
      ja: "マンデルブロ集合",
    },
    field: "dynamics",
    subfield: "fractals",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "만델브로 집합은 점화식 zₙ₊₁ = zₙ² + c에서 z₀ = 0으로 시작할 때 발산하지 않는 복소수 c의 집합입니다. 프랙탈의 가장 유명한 예입니다.",
        formulas: [
          {
            latex: "M = \\{c \\in \\mathbb{C} : \\sup_n |z_n| < \\infty\\}",
            description: "만델브로 집합의 정의",
          },
          {
            latex: "z_{n+1} = z_n^2 + c, \\quad z_0 = 0",
            description: "점화식",
          },
        ],
        examples: [
          {
            problem: "c = -1이 만델브로 집합에 속함을 보이세요.",
            solution:
              "z: 0 → -1 → 0 → -1 → ... 주기 2로 유계. c = -1 ∈ M.",
          },
          {
            problem: "c = 1이 만델브로 집합에 속하지 않음을 보이세요.",
            solution:
              "z: 0 → 1 → 2 → 5 → 26 → ... 발산. c = 1 ∉ M.",
          },
        ],
        history: {
          discoveredBy: "브누아 만델브로",
          year: "1980년",
          background:
            "컴퓨터로 처음 시각화되어 프랙탈 기하학의 상징이 되었습니다.",
        },
        applications: [
          { field: "컴퓨터 그래픽스", description: "프랙탈 이미지 생성" },
          { field: "수학", description: "복소 동역학 연구" },
          { field: "예술", description: "프랙탈 아트" },
        ],
      },
      en: {
        definition:
          "The Mandelbrot set is the set of complex numbers c for which the iteration zₙ₊₁ = zₙ² + c starting from z₀ = 0 doesn't diverge. The most famous fractal.",
        formulas: [
          {
            latex: "M = \\{c \\in \\mathbb{C} : \\sup_n |z_n| < \\infty\\}",
            description: "Definition of Mandelbrot set",
          },
          {
            latex: "z_{n+1} = z_n^2 + c, \\quad z_0 = 0",
            description: "Iteration formula",
          },
        ],
        examples: [
          {
            problem: "Show c = -1 is in the Mandelbrot set.",
            solution:
              "z: 0 → -1 → 0 → -1 → ... Period 2, bounded. c = -1 ∈ M.",
          },
          {
            problem: "Show c = 1 is not in the Mandelbrot set.",
            solution:
              "z: 0 → 1 → 2 → 5 → 26 → ... Diverges. c = 1 ∉ M.",
          },
        ],
        history: {
          discoveredBy: "Benoit Mandelbrot",
          year: "1980",
          background:
            "First visualized by computer, becoming an icon of fractal geometry.",
        },
        applications: [
          { field: "Computer Graphics", description: "Fractal image generation" },
          { field: "Mathematics", description: "Complex dynamics research" },
          { field: "Art", description: "Fractal art" },
        ],
      },
    },
    relations: {
      prerequisites: ["complex-numbers", "fractals"],
      nextTopics: ["julia-set"],
      related: ["iteration"],
    },
    tags: ["만델브로", "프랙탈", "Mandelbrot", "fractal"],
  },
  {
    id: "julia-set",
    name: {
      ko: "줄리아 집합",
      en: "Julia Set",
      ja: "ジュリア集合",
    },
    field: "dynamics",
    subfield: "fractals",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "줄리아 집합 Jc는 고정된 c에 대해 zₙ₊₁ = zₙ² + c의 반복에서 카오스적 행동을 보이는 초기값 z₀의 집합입니다. c에 따라 연결되거나 먼지 같은 구조를 가집니다.",
        formulas: [
          {
            latex: "J_c = \\partial K_c",
            description: "줄리아 집합은 채워진 줄리아 집합의 경계",
          },
          {
            latex: "c \\in M \\Leftrightarrow J_c \\text{ connected}",
            description: "만델브로 집합과의 관계",
          },
        ],
        examples: [
          {
            problem: "c = 0일 때 줄리아 집합을 설명하세요.",
            solution:
              "zₙ₊₁ = zₙ². |z₀| < 1이면 0으로 수렴, |z₀| > 1이면 발산. J₀ = 단위원.",
          },
        ],
        history: {
          discoveredBy: "가스통 줄리아, 피에르 파투",
          year: "1918년",
          background:
            "줄리아와 파투가 독립적으로 복소 동역학을 연구했습니다.",
        },
        applications: [
          { field: "수학", description: "복소 동역학" },
          { field: "컴퓨터 그래픽스", description: "프랙탈 생성" },
          { field: "물리학", description: "동역학적 시스템 분석" },
        ],
      },
      en: {
        definition:
          "The Julia set Jc is the set of initial values z₀ showing chaotic behavior under iteration zₙ₊₁ = zₙ² + c for fixed c. Connected or dust-like depending on c.",
        formulas: [
          {
            latex: "J_c = \\partial K_c",
            description: "Julia set is boundary of filled Julia set",
          },
          {
            latex: "c \\in M \\Leftrightarrow J_c \\text{ connected}",
            description: "Relationship with Mandelbrot set",
          },
        ],
        examples: [
          {
            problem: "Describe the Julia set for c = 0.",
            solution:
              "zₙ₊₁ = zₙ². |z₀| < 1 converges to 0, |z₀| > 1 diverges. J₀ = unit circle.",
          },
        ],
        history: {
          discoveredBy: "Gaston Julia, Pierre Fatou",
          year: "1918",
          background:
            "Julia and Fatou independently studied complex dynamics.",
        },
        applications: [
          { field: "Mathematics", description: "Complex dynamics" },
          { field: "Computer Graphics", description: "Fractal generation" },
          { field: "Physics", description: "Dynamical systems analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["mandelbrot-set", "complex-numbers"],
      nextTopics: ["fatou-set"],
      related: ["fractals"],
    },
    tags: ["줄리아", "프랙탈", "Julia", "fractal"],
  },
  {
    id: "poincare-map",
    name: {
      ko: "푸앵카레 사상",
      en: "Poincaré Map",
      ja: "ポアンカレ写像",
    },
    field: "dynamics",
    subfield: "dynamical-systems",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "푸앵카레 사상(되돌이 사상)은 연속 동역학계의 궤적이 초곡면을 횡단할 때마다의 점을 기록하여 이산 동역학계로 변환합니다.",
        formulas: [
          {
            latex: "P: \\Sigma \\to \\Sigma, \\quad P(x) = \\phi_{T(x)}(x)",
            description: "푸앵카레 사상의 정의",
          },
        ],
        examples: [
          {
            problem: "주기 궤도를 푸앵카레 사상으로 분석하세요.",
            solution:
              "주기 궤도는 푸앵카레 사상의 고정점에 대응합니다. 고정점의 안정성이 궤도의 안정성을 결정합니다.",
          },
        ],
        history: {
          discoveredBy: "앙리 푸앵카레",
          year: "1890년대",
          background:
            "삼체 문제 연구에서 푸앵카레가 도입했습니다.",
        },
        applications: [
          { field: "천체역학", description: "행성 궤도 분석" },
          { field: "카오스 연구", description: "주기배가, 분기 분석" },
          { field: "물리학", description: "가속기 빔 동역학" },
        ],
      },
      en: {
        definition:
          "A Poincaré map (return map) converts continuous dynamics to discrete by recording where trajectories cross a hypersurface.",
        formulas: [
          {
            latex: "P: \\Sigma \\to \\Sigma, \\quad P(x) = \\phi_{T(x)}(x)",
            description: "Definition of Poincaré map",
          },
        ],
        examples: [
          {
            problem: "Analyze a periodic orbit using Poincaré map.",
            solution:
              "A periodic orbit corresponds to a fixed point of the Poincaré map. The fixed point's stability determines the orbit's stability.",
          },
        ],
        history: {
          discoveredBy: "Henri Poincaré",
          year: "1890s",
          background:
            "Introduced by Poincaré while studying the three-body problem.",
        },
        applications: [
          { field: "Celestial Mechanics", description: "Planetary orbit analysis" },
          { field: "Chaos Research", description: "Period doubling, bifurcation" },
          { field: "Physics", description: "Accelerator beam dynamics" },
        ],
      },
    },
    relations: {
      prerequisites: ["dynamical-systems", "fixed-points"],
      nextTopics: ["symbolic-dynamics"],
      related: ["bifurcation"],
    },
    tags: ["푸앵카레", "되돌이사상", "Poincaré", "return map"],
  },
];
