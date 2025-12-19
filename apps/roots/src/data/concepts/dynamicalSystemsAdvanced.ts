import type { MathConcept } from '../types';

export const dynamicalSystemsAdvancedConcepts: MathConcept[] = [
  {
    id: 'bifurcation-theory',
    name: {
      ko: '분기 이론',
      en: 'Bifurcation Theory',
      ja: '分岐理論',
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 4,
    content: {
      ko: '매개변수 변화에 따라 동역학계의 질적 성질이 급격히 변하는 현상을 연구합니다. 안장-마디, 호프 분기 등이 있습니다.',
      en: 'Studies phenomena where qualitative properties of dynamical systems change abruptly with parameter variation. Includes saddle-node, Hopf bifurcations.',
      ja: 'パラメータの変化に伴い力学系の定性的性質が急激に変わる現象を研究します。サドル・ノード、ホップ分岐などがあります。',
    },
    latex:
      '\\dot{x} = \\mu - x^2 \\quad \\text{(saddle-node)}, \\quad \\dot{z} = (\\mu + i)z - z|z|^2 \\quad \\text{(Hopf)}',
    relations: {
      prerequisites: ['differential-equations', 'fixed-points'],
      nextTopics: ['chaos-theory', 'catastrophe-theory'],
      related: ['stability-analysis', 'normal-forms'],
      applications: ['population-dynamics', 'climate-models', 'neuroscience'],
    },
    tags: ['dynamical-systems', 'bifurcation', 'qualitative'],
  },
  {
    id: 'chaos-theory',
    name: {
      ko: '카오스 이론',
      en: 'Chaos Theory',
      ja: 'カオス理論',
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 4,
    content: {
      ko: '결정론적 시스템에서 초기 조건에 극도로 민감한 불규칙적 행동을 연구합니다. 로렌츠 방정식, 로지스틱 맵이 대표적 예입니다.',
      en: 'Studies irregular behavior in deterministic systems that is extremely sensitive to initial conditions. Lorenz equations and logistic map are classic examples.',
      ja: '決定論的システムで初期条件に極めて敏感な不規則な挙動を研究します。ローレンツ方程式、ロジスティック写像が代表的です。',
    },
    latex:
      "x_{n+1} = rx_n(1-x_n), \\quad \\lambda = \\lim_{n\\to\\infty} \\frac{1}{n}\\sum_{i=0}^{n-1} \\ln|f'(x_i)| > 0",
    relations: {
      prerequisites: ['bifurcation-theory', 'iterated-maps'],
      nextTopics: ['strange-attractors', 'fractal-dimension'],
      related: ['lyapunov-exponents', 'ergodic-theory'],
      applications: ['weather-prediction', 'cryptography', 'heart-dynamics'],
    },
    tags: ['dynamical-systems', 'chaos', 'sensitivity'],
  },
  {
    id: 'lyapunov-exponents',
    name: {
      ko: '랴푸노프 지수',
      en: 'Lyapunov Exponents',
      ja: 'リャプノフ指数',
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 4,
    content: {
      ko: '인접한 궤도가 분리되는 속도를 측정하는 지수입니다. 양의 리아푸노프 지수는 카오스의 특징입니다.',
      en: 'Exponents measuring the rate at which nearby trajectories separate. Positive Lyapunov exponents characterize chaos.',
      ja: '隣接する軌道が分離する速度を測る指数です。正のリャプノフ指数はカオスの特徴です。',
    },
    latex:
      '\\lambda = \\lim_{t\\to\\infty} \\frac{1}{t} \\ln\\frac{|\\delta x(t)|}{|\\delta x(0)|}',
    relations: {
      prerequisites: ['differential-equations', 'eigenvalue'],
      nextTopics: ['chaos-theory', 'attractor-dimension'],
      related: ['stability-analysis', 'oseledets-theorem'],
      applications: ['chaos-detection', 'predictability-analysis'],
    },
    tags: ['dynamical-systems', 'stability', 'chaos'],
  },
  {
    id: 'strange-attractors',
    name: {
      ko: '이상한 끌개',
      en: 'Strange Attractors',
      ja: 'ストレンジアトラクター',
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 5,
    content: {
      ko: '프랙탈 구조를 가진 카오스적 끌개입니다. 로렌츠 끌개, 헤논 맵 끌개가 대표적이며 자기닮음 구조를 보입니다.',
      en: 'Chaotic attractors with fractal structure. Lorenz and Hénon attractors are classic examples, exhibiting self-similar structure.',
      ja: 'フラクタル構造を持つカオス的アトラクターです。ローレンツ、エノンアトラクターが代表的で自己相似構造を示します。',
    },
    latex: '\\dot{x} = \\sigma(y-x), \\quad \\dot{y} = x(\\rho-z)-y, \\quad \\dot{z} = xy-\\beta z',
    relations: {
      prerequisites: ['chaos-theory', 'fractal'],
      nextTopics: ['fractal-dimension', 'hausdorff-dimension'],
      related: ['lorenz-system', 'henon-map'],
      applications: ['turbulence', 'electronic-circuits'],
    },
    tags: ['dynamical-systems', 'attractor', 'fractal'],
  },
  {
    id: 'hamiltonian-dynamics',
    name: {
      ko: '해밀턴 역학',
      en: 'Hamiltonian Dynamics',
      ja: 'ハミルトン力学',
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 4,
    content: {
      ko: '해밀토니안 함수로 기술되는 보존계의 역학입니다. 위상 공간에서 심플렉틱 구조를 보존하며 가적분계와 카오스를 모두 포함합니다.',
      en: 'Dynamics of conservative systems described by Hamiltonian functions. Preserves symplectic structure in phase space, encompassing both integrable and chaotic systems.',
      ja: 'ハミルトニアン関数で記述される保存系の力学です。位相空間でシンプレクティック構造を保存し、可積分系とカオスを含みます。',
    },
    latex:
      '\\dot{q} = \\frac{\\partial H}{\\partial p}, \\quad \\dot{p} = -\\frac{\\partial H}{\\partial q}',
    relations: {
      prerequisites: ['lagrangian-mechanics', 'symplectic-geometry'],
      nextTopics: ['kam-theory', 'arnold-diffusion'],
      related: ['canonical-transformations', 'poisson-brackets'],
      applications: ['celestial-mechanics', 'plasma-physics', 'molecular-dynamics'],
    },
    tags: ['dynamical-systems', 'hamiltonian', 'symplectic'],
  },
  {
    id: 'ergodic-theory',
    name: {
      ko: '에르고드 이론',
      en: 'Ergodic Theory',
      ja: 'エルゴード理論',
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 5,
    content: {
      ko: '동역학계의 장기적 평균 행동을 측도론적으로 연구합니다. 시간 평균과 공간 평균의 일치가 핵심 개념입니다.',
      en: 'Studies long-term average behavior of dynamical systems using measure theory. The equality of time and space averages is the key concept.',
      ja: '力学系の長期的な平均挙動を測度論的に研究します。時間平均と空間平均の一致が核心概念です。',
    },
    latex: '\\lim_{T\\to\\infty} \\frac{1}{T}\\int_0^T f(\\phi_t(x))\\,dt = \\int f\\,d\\mu',
    relations: {
      prerequisites: ['measure-theory', 'dynamical-systems'],
      nextTopics: ['mixing', 'entropy-dynamical'],
      related: ['birkhoff-theorem', 'invariant-measure'],
      applications: ['statistical-mechanics', 'number-theory'],
    },
    tags: ['dynamical-systems', 'ergodic', 'measure-theory'],
  },
  {
    id: 'center-manifold',
    name: {
      ko: '중심 다양체',
      en: 'Center Manifold',
      ja: '中心多様体',
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 5,
    content: {
      ko: '고정점 근처에서 중립적 방향(영 고유값)에 접하는 불변 다양체입니다. 분기 분석과 차원 축소에 핵심적입니다.',
      en: 'An invariant manifold tangent to neutral directions (zero eigenvalues) near a fixed point. Essential for bifurcation analysis and dimension reduction.',
      ja: '固定点近傍で中立的方向（零固有値）に接する不変多様体です。分岐解析と次元縮約に重要です。',
    },
    latex: 'W^c = \\{x : \\phi_t(x) \\to 0 \\text{ polynomially as } t \\to \\pm\\infty\\}',
    relations: {
      prerequisites: ['stable-manifold', 'eigenvalue'],
      nextTopics: ['normal-forms', 'bifurcation-theory'],
      related: ['invariant-manifolds', 'reduction-principle'],
      applications: ['bifurcation-analysis', 'control-theory'],
    },
    tags: ['dynamical-systems', 'manifold', 'bifurcation'],
  },
  {
    id: 'poincare-map',
    name: {
      ko: '푸앵카레 사상',
      en: 'Poincaré Map',
      ja: 'ポアンカレ写像',
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 4,
    content: {
      ko: '연속 동역학계를 이산 사상으로 축소하는 기법입니다. 주기 궤도 분석과 카오스 연구에 필수적입니다.',
      en: 'A technique reducing continuous dynamical systems to discrete maps. Essential for analyzing periodic orbits and studying chaos.',
      ja: '連続力学系を離散写像に縮約する技法です。周期軌道の解析とカオス研究に必須です。',
    },
    latex: 'P: \\Sigma \\to \\Sigma, \\quad P(x) = \\phi_{\\tau(x)}(x)',
    relations: {
      prerequisites: ['differential-equations', 'periodic-orbits'],
      nextTopics: ['floquet-theory', 'chaos-theory'],
      related: ['section-surface', 'return-map'],
      applications: ['celestial-mechanics', 'circuit-analysis'],
    },
    tags: ['dynamical-systems', 'discrete', 'periodic'],
  },
];
