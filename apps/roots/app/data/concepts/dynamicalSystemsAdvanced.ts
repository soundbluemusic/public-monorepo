import type { MathConcept } from '../types';

export const dynamicalSystemsAdvancedConcepts: MathConcept[] = [
  {
    id: 'bifurcation-theory',
    name: {
      ko: '분기 이론',
      en: 'Bifurcation Theory',
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 4,
    content: {
      ko: '매개변수 변화에 따라 동역학계의 질적 성질이 급격히 변하는 현상을 연구합니다. 안장-마디, 호프 분기 등이 있습니다.',
      en: 'Studies phenomena where qualitative properties of dynamical systems change abruptly with parameter variation. Includes saddle-node, Hopf bifurcations.',
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
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 4,
    content: {
      ko: '결정론적 시스템에서 초기 조건에 민감한 불규칙적 행동을 연구합니다. 로지스틱 맵은 매개변수에 따라 카오스를 보이기도 합니다. 랴푸노프 지수의 부호도 궤도와 매개변수에 따라 달라집니다.',
      en: 'Studies irregular behavior in deterministic systems that is sensitive to initial conditions. The logistic map can be chaotic for certain parameter values; the sign of its Lyapunov exponent also depends on the orbit and parameter.',
    },
    latex:
      "x_{n+1} = f(x_n)=rx_n(1-x_n), \\quad \\lambda = \\lim_{n\\to\\infty} \\frac{1}{n}\\sum_{i=0}^{n-1} \\ln|f'(x_i)|",
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
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 4,
    content: {
      ko: '인접한 궤도의 차이가 커지거나 작아지는 평균 지수적 속도를 측정합니다. 양의 지수는 초기 조건에 대한 민감성을 나타낼 수 있지만, 그것만으로 모든 카오스 조건이 보장되지는 않습니다.',
      en: 'Measures the average exponential rate at which nearby trajectories separate or approach. A positive exponent can indicate sensitivity to initial conditions, but alone does not establish every condition for chaos.',
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
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 5,
    content: {
      ko: '복잡한 프랙탈 구조를 보이는 끌개입니다. 특정 매개변수에서 나타나는 로렌츠 끌개와 헤논 끌개는 카오스적 끌개의 대표적인 예입니다.',
      en: 'Attractors with intricate fractal structure. At suitable parameter values, the Lorenz and Hénon attractors are classic chaotic examples.',
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
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 4,
    content: {
      ko: '해밀토니안 함수로 기술되는 보존계의 역학입니다. 위상 공간에서 심플렉틱 구조를 보존하며 가적분계와 카오스를 모두 포함합니다.',
      en: 'Dynamics of conservative systems described by Hamiltonian functions. Preserves symplectic structure in phase space, encompassing both integrable and chaotic systems.',
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
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 5,
    content: {
      ko: '동역학계의 장기적 평균 행동을 측도론적으로 연구합니다. 에르고딕한 확률 보존계에서는 적분 가능한 함수의 시간 평균과 공간 평균이 거의 모든 점에서 일치합니다.',
      en: 'Studies long-term average behavior of dynamical systems using measure theory. For an ergodic probability-preserving system, time and space averages of an integrable function agree almost everywhere.',
    },
    latex:
      '\\lim_{n\\to\\infty} \\frac{1}{n}\\sum_{i=0}^{n-1} f(T^i x) = \\int f\\,d\\mu \\quad (f\\in L^1,\\; T \\text{ ergodic and probability-preserving},\\; \\mu\\text{-a.e. }x)',
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
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 5,
    content: {
      ko: '평형점 근처에서 선형화의 고유값 중 실수부가 0인 일반화 고유공간에 접하는 국소 불변 다양체입니다. 식의 Eλ는 λ에 대응하는 일반화 고유공간입니다. 중심 방향의 해가 반드시 평형점으로 수렴하는 것은 아닙니다.',
      en: 'A locally invariant manifold tangent at an equilibrium to the generalized eigenspaces with eigenvalues of zero real part. Eλ denotes the generalized eigenspace for λ. Its trajectories need not converge to the equilibrium.',
    },
    latex: 'T_0W^c=E^c,\\quad E^c=\\bigoplus_{\\operatorname{Re}\\lambda=0}E_\\lambda',
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
    },
    field: 'analysis',
    subfield: 'dynamical-systems',
    difficulty: 4,
    content: {
      ko: '연속 동역학계를 이산 사상으로 축소하는 기법입니다. 주기 궤도 분석과 카오스 연구에 필수적입니다.',
      en: 'A technique reducing continuous dynamical systems to discrete maps. Essential for analyzing periodic orbits and studying chaos.',
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
