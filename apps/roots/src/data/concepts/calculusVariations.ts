import type { MathConcept } from '../types';

export const calculusVariationsConcepts: MathConcept[] = [
  {
    id: 'euler-lagrange-equation',
    name: {
      ko: '오일러-라그랑주 방정식',
      en: 'Euler-Lagrange Equation',
      ja: 'オイラー・ラグランジュ方程式',
    },
    field: 'calculus-of-variations',
    subfield: 'foundations',
    difficulty: 4,
    content: {
      ko: {
        definition: '범함수의 극값을 구하기 위한 필요조건. 변분법의 기본 방정식',
        formulas: ["J[y] = ∫L(x,y,y')dx", "∂L/∂y - d/dx(∂L/∂y') = 0", '자연 경계조건'],
        examples: ['최단 경로 (측지선)', '현수선', '브라키스토크론'],
        applications: ['고전역학', '광학', '최적 제어'],
      },
      en: {
        definition:
          'Necessary condition for extrema of functionals. Fundamental equation of calculus of variations',
        formulas: [
          "J[y] = ∫L(x,y,y')dx",
          "∂L/∂y - d/dx(∂L/∂y') = 0",
          'Natural boundary conditions',
        ],
        examples: ['Shortest path (geodesic)', 'Catenary', 'Brachistochrone'],
        applications: ['Classical mechanics', 'Optics', 'Optimal control'],
      },
      ja: {
        definition: '汎関数の極値を求めるための必要条件。変分法の基本方程式',
        formulas: ["J[y] = ∫L(x,y,y')dx", "∂L/∂y - d/dx(∂L/∂y') = 0", '自然境界条件'],
        examples: ['最短経路（測地線）', '懸垂線', '最速降下線'],
        applications: ['古典力学', '光学', '最適制御'],
      },
    },
    latex: "\\frac{\\partial L}{\\partial y} - \\frac{d}{dx}\\frac{\\partial L}{\\partial y'} = 0",
    relations: {
      prerequisites: ['multivariable-calculus', 'differential-equations'],
      nextTopics: ['hamiltons-principle', 'optimal-control'],
      related: ['lagrangian-mechanics'],
      applications: ['physics', 'engineering'],
    },
    tags: ['오일러라그랑주', 'Euler-Lagrange', '변분', 'variation'],
  },
  {
    id: 'hamiltons-principle',
    name: {
      ko: '해밀턴의 원리',
      en: "Hamilton's Principle",
      ja: 'ハミルトンの原理',
    },
    field: 'calculus-of-variations',
    subfield: 'mechanics',
    difficulty: 4,
    content: {
      ko: {
        definition: '물리계의 실제 경로는 작용을 정류시키는 경로. 고전역학의 변분 원리',
        formulas: ['δS = 0', 'S = ∫L dt = ∫(T - V)dt', 'L = 운동에너지 - 위치에너지'],
        examples: ['자유 입자', '조화 진동자', '행성 운동'],
        applications: ['고전역학', '장이론', '양자역학'],
      },
      en: {
        definition:
          'Actual path of physical system makes action stationary. Variational principle of classical mechanics',
        formulas: ['δS = 0', 'S = ∫L dt = ∫(T - V)dt', 'L = Kinetic - Potential energy'],
        examples: ['Free particle', 'Harmonic oscillator', 'Planetary motion'],
        applications: ['Classical mechanics', 'Field theory', 'Quantum mechanics'],
      },
      ja: {
        definition: '物理系の実際の経路は作用を停留させる経路。古典力学の変分原理',
        formulas: ['δS = 0', 'S = ∫L dt = ∫(T - V)dt', 'L = 運動エネルギー - 位置エネルギー'],
        examples: ['自由粒子', '調和振動子', '惑星運動'],
        applications: ['古典力学', '場の理論', '量子力学'],
      },
    },
    latex: '\\delta S = \\delta \\int L \\, dt = 0',
    relations: {
      prerequisites: ['euler-lagrange-equation', 'newtons-laws'],
      nextTopics: ['hamiltonian-mechanics'],
      related: ['fermats-principle'],
      applications: ['physics', 'field-theory'],
    },
    tags: ['해밀턴', 'Hamilton', '작용', 'action'],
  },
  {
    id: 'brachistochrone',
    name: {
      ko: '브라키스토크론 문제',
      en: 'Brachistochrone Problem',
      ja: '最速降下線問題',
    },
    field: 'calculus-of-variations',
    subfield: 'classic-problems',
    difficulty: 4,
    content: {
      ko: {
        definition: '중력장에서 두 점 사이를 가장 빠르게 이동하는 곡선을 찾는 문제',
        formulas: [
          "T = ∫ds/v = ∫√(1+y'²)/√(2gy) dx",
          '해: 사이클로이드',
          'x = a(θ - sinθ), y = a(1 - cosθ)',
        ],
        examples: ['롤러코스터 설계', '스키 점프대'],
        applications: ['물리학', '최적화', '역사적 중요성'],
      },
      en: {
        definition: 'Finding curve of fastest descent between two points in gravitational field',
        formulas: [
          "T = ∫ds/v = ∫√(1+y'²)/√(2gy) dx",
          'Solution: cycloid',
          'x = a(θ - sinθ), y = a(1 - cosθ)',
        ],
        examples: ['Roller coaster design', 'Ski jump ramps'],
        applications: ['Physics', 'Optimization', 'Historical importance'],
      },
      ja: {
        definition: '重力場で二点間を最も速く移動する曲線を求める問題',
        formulas: [
          "T = ∫ds/v = ∫√(1+y'²)/√(2gy) dx",
          '解: サイクロイド',
          'x = a(θ - sinθ), y = a(1 - cosθ)',
        ],
        examples: ['ジェットコースター設計', 'スキージャンプ台'],
        applications: ['物理学', '最適化', '歴史的重要性'],
      },
    },
    latex: 'x = a(\\theta - \\sin\\theta), \\; y = a(1 - \\cos\\theta)',
    relations: {
      prerequisites: ['euler-lagrange-equation'],
      nextTopics: ['isoperimetric-problem'],
      related: ['cycloid'],
      applications: ['physics', 'optimization'],
    },
    tags: ['브라키스토크론', 'brachistochrone', '사이클로이드', 'cycloid'],
  },
  {
    id: 'isoperimetric-problem',
    name: {
      ko: '등주 문제',
      en: 'Isoperimetric Problem',
      ja: '等周問題',
    },
    field: 'calculus-of-variations',
    subfield: 'classic-problems',
    difficulty: 4,
    content: {
      ko: {
        definition: '주어진 둘레로 최대 넓이를 갖는 도형을 찾는 문제. 원이 해답',
        formulas: ['max A = ∬dA, subject to ∮ds = L', '라그랑주 승수: δ(A - λP) = 0', '해: 원'],
        examples: ['비누방울', '세포 형태', '동물 영역'],
        applications: ['생물학', '건축', '최적화'],
      },
      en: {
        definition: 'Finding shape with maximum area for given perimeter. Circle is the solution',
        formulas: [
          'max A = ∬dA, subject to ∮ds = L',
          'Lagrange multiplier: δ(A - λP) = 0',
          'Solution: circle',
        ],
        examples: ['Soap bubbles', 'Cell shapes', 'Animal territories'],
        applications: ['Biology', 'Architecture', 'Optimization'],
      },
      ja: {
        definition: '与えられた周長で最大面積を持つ図形を求める問題。円が解',
        formulas: ['max A = ∬dA, subject to ∮ds = L', 'ラグランジュ乗数: δ(A - λP) = 0', '解: 円'],
        examples: ['シャボン玉', '細胞の形', '動物の縄張り'],
        applications: ['生物学', '建築', '最適化'],
      },
    },
    latex: '\\frac{A}{P^2} \\leq \\frac{1}{4\\pi}',
    relations: {
      prerequisites: ['euler-lagrange-equation', 'lagrange-multiplier'],
      nextTopics: ['plateau-problem'],
      related: ['geometric-optimization'],
      applications: ['biology', 'design'],
    },
    tags: ['등주', 'isoperimetric', '넓이', 'perimeter'],
  },
  {
    id: 'pontryagin-maximum',
    name: {
      ko: '폰트랴긴 최대 원리',
      en: 'Pontryagin Maximum Principle',
      ja: 'ポントリャーギン最大原理',
    },
    field: 'calculus-of-variations',
    subfield: 'optimal-control',
    difficulty: 5,
    content: {
      ko: {
        definition: '최적 제어 문제의 필요조건. 해밀토니안 최대화',
        formulas: [
          'ẋ = f(x,u), min J = ∫L dt + Φ(x_f)',
          'H = p·f - L',
          '∂H/∂u = 0 또는 경계',
          'ṗ = -∂H/∂x',
        ],
        examples: ['로켓 궤적', '경제 성장 모델', '자원 관리'],
        applications: ['항공우주', '경제학', '로봇공학'],
      },
      en: {
        definition: 'Necessary conditions for optimal control problems. Hamiltonian maximization',
        formulas: [
          'ẋ = f(x,u), min J = ∫L dt + Φ(x_f)',
          'H = p·f - L',
          '∂H/∂u = 0 or boundary',
          'ṗ = -∂H/∂x',
        ],
        examples: ['Rocket trajectories', 'Economic growth models', 'Resource management'],
        applications: ['Aerospace', 'Economics', 'Robotics'],
      },
      ja: {
        definition: '最適制御問題の必要条件。ハミルトニアンの最大化',
        formulas: [
          'ẋ = f(x,u), min J = ∫L dt + Φ(x_f)',
          'H = p·f - L',
          '∂H/∂u = 0 または境界',
          'ṗ = -∂H/∂x',
        ],
        examples: ['ロケット軌道', '経済成長モデル', '資源管理'],
        applications: ['航空宇宙', '経済学', 'ロボット工学'],
      },
    },
    latex: 'H(x^*, u^*, p) \\geq H(x^*, u, p)',
    relations: {
      prerequisites: ['euler-lagrange-equation', 'hamiltons-principle'],
      nextTopics: ['dynamic-programming-or', 'bang-bang-control'],
      related: ['bellman-equation'],
      applications: ['control-theory', 'economics'],
    },
    tags: ['폰트랴긴', 'Pontryagin', '최적제어', 'optimal-control'],
  },
  {
    id: 'direct-methods',
    name: {
      ko: '직접 방법',
      en: 'Direct Methods',
      ja: '直接法',
    },
    field: 'calculus-of-variations',
    subfield: 'methods',
    difficulty: 5,
    content: {
      ko: {
        definition: '범함수의 극값 존재를 함수공간의 컴팩트성과 하반연속성으로 증명',
        formulas: ['J: X → ℝ 하반연속, 강제적', 'inf J 달성됨', '약수렴 + 하반연속성'],
        examples: ['디리클레 원리', '탄성 에너지 최소화', 'PDE 약해 존재'],
        applications: ['편미분방정식', '탄성이론', '기하학'],
      },
      en: {
        definition:
          'Proving existence of extrema using compactness and lower semicontinuity in function spaces',
        formulas: [
          'J: X → ℝ lower semicontinuous, coercive',
          'inf J attained',
          'Weak convergence + lower semicontinuity',
        ],
        examples: ['Dirichlet principle', 'Elastic energy minimization', 'PDE weak solutions'],
        applications: ['PDEs', 'Elasticity theory', 'Geometry'],
      },
      ja: {
        definition: '関数空間のコンパクト性と下半連続性で汎関数の極値の存在を証明',
        formulas: ['J: X → ℝ 下半連続、強制的', 'inf J が達成される', '弱収束 + 下半連続性'],
        examples: ['ディリクレ原理', '弾性エネルギー最小化', 'PDE弱解の存在'],
        applications: ['偏微分方程式', '弾性理論', '幾何学'],
      },
    },
    latex: '\\inf_X J \\text{ is attained}',
    relations: {
      prerequisites: ['weak-convergence', 'functional-analysis'],
      nextTopics: ['gamma-convergence'],
      related: ['sobolev-spaces'],
      applications: ['pde', 'mechanics'],
    },
    tags: ['직접법', 'direct', '변분', 'existence'],
  },
  {
    id: 'fermats-principle',
    name: {
      ko: '페르마의 원리',
      en: "Fermat's Principle",
      ja: 'フェルマーの原理',
    },
    field: 'calculus-of-variations',
    subfield: 'optics',
    difficulty: 3,
    content: {
      ko: {
        definition: '빛은 두 점 사이를 최소 시간 경로로 이동. 광학의 변분 원리',
        formulas: ['δT = δ∫ds/v = 0', 'n = c/v', '광학 경로 길이: ∫n ds'],
        examples: ['반사 법칙', '굴절 법칙 (스넬)', '신기루'],
        applications: ['렌즈 설계', '광섬유', '기하광학'],
      },
      en: {
        definition:
          'Light travels the path of least time between two points. Variational principle of optics',
        formulas: ['δT = δ∫ds/v = 0', 'n = c/v', 'Optical path length: ∫n ds'],
        examples: ['Law of reflection', "Snell's law (refraction)", 'Mirages'],
        applications: ['Lens design', 'Fiber optics', 'Geometrical optics'],
      },
      ja: {
        definition: '光は二点間を最小時間経路で進む。光学の変分原理',
        formulas: ['δT = δ∫ds/v = 0', 'n = c/v', '光路長: ∫n ds'],
        examples: ['反射の法則', 'スネルの法則（屈折）', '蜃気楼'],
        applications: ['レンズ設計', '光ファイバー', '幾何光学'],
      },
    },
    latex: '\\delta \\int n \\, ds = 0',
    relations: {
      prerequisites: ['euler-lagrange-equation'],
      nextTopics: ['hamiltons-principle'],
      related: ['snells-law'],
      applications: ['optics', 'physics'],
    },
    tags: ['페르마', 'Fermat', '광학', 'optics'],
  },
  {
    id: 'noethers-theorem',
    name: {
      ko: '뇌터의 정리',
      en: "Noether's Theorem",
      ja: 'ネーターの定理',
    },
    field: 'calculus-of-variations',
    subfield: 'symmetry',
    difficulty: 5,
    content: {
      ko: {
        definition: '작용의 연속 대칭마다 보존량이 대응. 물리학의 근본 정리',
        formulas: [
          '대칭 ⟹ 보존 법칙',
          '시간 불변 → 에너지 보존',
          '공간 불변 → 운동량 보존',
          '회전 불변 → 각운동량 보존',
        ],
        examples: ['에너지-운동량-각운동량 보존', '게이지 대칭과 전하 보존'],
        applications: ['입자물리학', '일반상대성이론', '장이론'],
      },
      en: {
        definition:
          'Every continuous symmetry of action corresponds to conservation law. Fundamental theorem of physics',
        formulas: [
          'Symmetry ⟹ Conservation law',
          'Time invariance → Energy',
          'Space invariance → Momentum',
          'Rotation invariance → Angular momentum',
        ],
        examples: [
          'Energy-momentum-angular momentum conservation',
          'Gauge symmetry and charge conservation',
        ],
        applications: ['Particle physics', 'General relativity', 'Field theory'],
      },
      ja: {
        definition: '作用の連続対称性ごとに保存量が対応。物理学の根本定理',
        formulas: [
          '対称性 ⟹ 保存則',
          '時間不変 → エネルギー保存',
          '空間不変 → 運動量保存',
          '回転不変 → 角運動量保存',
        ],
        examples: ['エネルギー・運動量・角運動量保存', 'ゲージ対称性と電荷保存'],
        applications: ['素粒子物理', '一般相対性理論', '場の理論'],
      },
    },
    latex: '\\text{Symmetry} \\Leftrightarrow \\text{Conservation Law}',
    relations: {
      prerequisites: ['hamiltons-principle', 'lie-groups'],
      nextTopics: ['gauge-theory'],
      related: ['conservation-laws'],
      applications: ['physics', 'field-theory'],
    },
    tags: ['뇌터', 'Noether', '대칭', 'symmetry'],
  },
];
