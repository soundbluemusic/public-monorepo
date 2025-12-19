import type { MathConcept } from '../types';

export const differentialGeometryConcepts: MathConcept[] = [
  {
    id: 'manifold',
    name: {
      ko: '다양체',
      en: 'Manifold',
      ja: '多様体',
    },
    field: 'differential-geometry',
    subfield: 'foundations',
    difficulty: 4,
    content: {
      ko: {
        definition: '국소적으로 유클리드 공간과 닮은 위상공간. 곡면의 일반화',
        formulas: [
          '좌표계: (U, φ), φ: U → ℝⁿ',
          '전이함수: φ_β ∘ φ_α⁻¹',
          'C^k 다양체: 전이함수가 k번 미분가능',
        ],
        examples: ['ℝⁿ', '구면 S²', '토러스 T²', '사영공간 ℝP^n'],
        applications: ['물리학', '로봇공학', '데이터 분석'],
      },
      en: {
        definition:
          'Topological space locally resembling Euclidean space. Generalization of surfaces',
        formulas: [
          'Charts: (U, φ), φ: U → ℝⁿ',
          'Transition: φ_β ∘ φ_α⁻¹',
          'C^k manifold: transitions k-times differentiable',
        ],
        examples: ['ℝⁿ', 'Sphere S²', 'Torus T²', 'Projective space ℝP^n'],
        applications: ['Physics', 'Robotics', 'Data analysis'],
      },
      ja: {
        definition: '局所的にユークリッド空間に似た位相空間。曲面の一般化',
        formulas: [
          '座標系: (U, φ), φ: U → ℝⁿ',
          '座標変換: φ_β ∘ φ_α⁻¹',
          'C^k多様体: 座標変換がk回微分可能',
        ],
        examples: ['ℝⁿ', '球面 S²', 'トーラス T²', '射影空間 ℝP^n'],
        applications: ['物理学', 'ロボット工学', 'データ分析'],
      },
    },
    latex:
      '\\phi_\\beta \\circ \\phi_\\alpha^{-1}: \\phi_\\alpha(U_\\alpha \\cap U_\\beta) \\to \\phi_\\beta(U_\\alpha \\cap U_\\beta)',
    relations: {
      prerequisites: ['topology', 'multivariable-calculus'],
      nextTopics: ['tangent-space', 'riemannian-metric'],
      related: ['surface'],
      applications: ['general-relativity', 'machine-learning'],
    },
    tags: ['다양체', 'manifold', '미분기하', 'topology'],
  },
  {
    id: 'tangent-space',
    name: {
      ko: '접공간',
      en: 'Tangent Space',
      ja: '接空間',
    },
    field: 'differential-geometry',
    subfield: 'foundations',
    difficulty: 4,
    content: {
      ko: {
        definition: '다양체의 한 점에서 가능한 모든 "방향"들의 벡터공간',
        formulas: ["T_p M = {γ'(0) : γ(0) = p}", '차원: dim T_p M = dim M', '기저: ∂/∂x^i |_p'],
        examples: ['평면의 접공간 = ℝ²', '구면의 접평면'],
        applications: ['벡터장', '미분형식', '물리학'],
      },
      en: {
        definition: 'Vector space of all possible "directions" at a point on manifold',
        formulas: [
          "T_p M = {γ'(0) : γ(0) = p}",
          'Dimension: dim T_p M = dim M',
          'Basis: ∂/∂x^i |_p',
        ],
        examples: ['Tangent space of plane = ℝ²', 'Tangent plane of sphere'],
        applications: ['Vector fields', 'Differential forms', 'Physics'],
      },
      ja: {
        definition: '多様体の一点で可能なすべての「方向」のベクトル空間',
        formulas: ["T_p M = {γ'(0) : γ(0) = p}", '次元: dim T_p M = dim M', '基底: ∂/∂x^i |_p'],
        examples: ['平面の接空間 = ℝ²', '球面の接平面'],
        applications: ['ベクトル場', '微分形式', '物理学'],
      },
    },
    latex: "T_p M = \\{\\gamma'(0) : \\gamma(0) = p\\}",
    relations: {
      prerequisites: ['manifold', 'linear-algebra'],
      nextTopics: ['tangent-bundle', 'vector-field'],
      related: ['derivative'],
      applications: ['mechanics', 'optimization'],
    },
    tags: ['접공간', 'tangent', 'vector', 'manifold'],
  },
  {
    id: 'riemannian-metric',
    name: {
      ko: '리만 계량',
      en: 'Riemannian Metric',
      ja: 'リーマン計量',
    },
    field: 'differential-geometry',
    subfield: 'riemannian',
    difficulty: 5,
    content: {
      ko: {
        definition: '다양체의 각 점에서 접벡터 사이의 내적을 부여하는 구조',
        formulas: [
          'g: T_p M × T_p M → ℝ',
          'ds² = g_{ij} dx^i dx^j',
          '길이: L(γ) = ∫√(g_{ij} γ̇^i γ̇^j) dt',
        ],
        examples: ['유클리드 계량: g_{ij} = δ_{ij}', '구면 계량: ds² = dθ² + sin²θ dφ²'],
        applications: ['일반상대성이론', '측지선', '곡률'],
      },
      en: {
        definition: 'Structure assigning inner product on tangent vectors at each point',
        formulas: [
          'g: T_p M × T_p M → ℝ',
          'ds² = g_{ij} dx^i dx^j',
          'Length: L(γ) = ∫√(g_{ij} γ̇^i γ̇^j) dt',
        ],
        examples: ['Euclidean metric: g_{ij} = δ_{ij}', 'Sphere metric: ds² = dθ² + sin²θ dφ²'],
        applications: ['General relativity', 'Geodesics', 'Curvature'],
      },
      ja: {
        definition: '各点で接ベクトル間の内積を与える構造',
        formulas: [
          'g: T_p M × T_p M → ℝ',
          'ds² = g_{ij} dx^i dx^j',
          '長さ: L(γ) = ∫√(g_{ij} γ̇^i γ̇^j) dt',
        ],
        examples: ['ユークリッド計量: g_{ij} = δ_{ij}', '球面計量: ds² = dθ² + sin²θ dφ²'],
        applications: ['一般相対性理論', '測地線', '曲率'],
      },
    },
    latex: 'ds^2 = g_{ij} dx^i dx^j',
    relations: {
      prerequisites: ['manifold', 'tangent-space', 'inner-product'],
      nextTopics: ['geodesic', 'curvature-tensor'],
      related: ['metric-space'],
      applications: ['physics', 'geometry'],
    },
    tags: ['리만', 'Riemannian', '계량', 'metric'],
  },
  {
    id: 'geodesic',
    name: {
      ko: '측지선',
      en: 'Geodesic',
      ja: '測地線',
    },
    field: 'differential-geometry',
    subfield: 'riemannian',
    difficulty: 4,
    content: {
      ko: {
        definition: '곡면이나 다양체에서 두 점 사이의 최단 경로',
        formulas: [
          '측지선 방정식: d²x^k/dt² + Γ^k_{ij} dx^i/dt dx^j/dt = 0',
          '크리스토펠 기호: Γ^k_{ij}',
        ],
        examples: ['평면의 직선', '구면의 대원', '쌍곡면의 호'],
        applications: ['항공 경로', '일반상대성이론', '컴퓨터 그래픽스'],
      },
      en: {
        definition: 'Shortest path between two points on a surface or manifold',
        formulas: [
          'Geodesic equation: d²x^k/dt² + Γ^k_{ij} dx^i/dt dx^j/dt = 0',
          'Christoffel symbols: Γ^k_{ij}',
        ],
        examples: ['Straight lines on plane', 'Great circles on sphere', 'Arcs on hyperboloid'],
        applications: ['Flight paths', 'General relativity', 'Computer graphics'],
      },
      ja: {
        definition: '曲面や多様体上の2点間の最短経路',
        formulas: [
          '測地線方程式: d²x^k/dt² + Γ^k_{ij} dx^i/dt dx^j/dt = 0',
          'クリストッフェル記号: Γ^k_{ij}',
        ],
        examples: ['平面の直線', '球面の大円', '双曲面の弧'],
        applications: ['航空経路', '一般相対性理論', 'コンピュータグラフィックス'],
      },
    },
    latex: '\\frac{d^2 x^k}{dt^2} + \\Gamma^k_{ij} \\frac{dx^i}{dt} \\frac{dx^j}{dt} = 0',
    relations: {
      prerequisites: ['riemannian-metric'],
      nextTopics: ['exponential-map', 'curvature-tensor'],
      related: ['shortest-path'],
      applications: ['navigation', 'physics'],
    },
    tags: ['측지선', 'geodesic', '최단경로', 'shortest'],
  },
  {
    id: 'curvature-tensor',
    name: {
      ko: '곡률 텐서',
      en: 'Curvature Tensor',
      ja: '曲率テンソル',
    },
    field: 'differential-geometry',
    subfield: 'riemannian',
    difficulty: 5,
    content: {
      ko: {
        definition: '다양체의 곡률을 측정하는 텐서. 공간이 평평한지 휜지 나타냄',
        formulas: [
          '리만 곡률: R^ρ_{σμν}',
          '리치 곡률: R_{μν} = R^ρ_{μρν}',
          '스칼라 곡률: R = g^{μν}R_{μν}',
        ],
        examples: ['평면: R = 0', '구면: R = 2/r²', '쌍곡면: R < 0'],
        applications: ['일반상대성이론', '우주론', '기하학'],
      },
      en: {
        definition: 'Tensor measuring curvature of manifold. Indicates if space is flat or curved',
        formulas: [
          'Riemann curvature: R^ρ_{σμν}',
          'Ricci curvature: R_{μν} = R^ρ_{μρν}',
          'Scalar curvature: R = g^{μν}R_{μν}',
        ],
        examples: ['Plane: R = 0', 'Sphere: R = 2/r²', 'Hyperboloid: R < 0'],
        applications: ['General relativity', 'Cosmology', 'Geometry'],
      },
      ja: {
        definition: '多様体の曲率を測るテンソル。空間が平坦か曲がっているかを示す',
        formulas: [
          'リーマン曲率: R^ρ_{σμν}',
          'リッチ曲率: R_{μν} = R^ρ_{μρν}',
          'スカラー曲率: R = g^{μν}R_{μν}',
        ],
        examples: ['平面: R = 0', '球面: R = 2/r²', '双曲面: R < 0'],
        applications: ['一般相対性理論', '宇宙論', '幾何学'],
      },
    },
    latex:
      'R^\\rho_{\\sigma\\mu\\nu} = \\partial_\\mu \\Gamma^\\rho_{\\nu\\sigma} - \\partial_\\nu \\Gamma^\\rho_{\\mu\\sigma} + \\Gamma^\\rho_{\\mu\\lambda}\\Gamma^\\lambda_{\\nu\\sigma} - \\Gamma^\\rho_{\\nu\\lambda}\\Gamma^\\lambda_{\\mu\\sigma}',
    relations: {
      prerequisites: ['riemannian-metric', 'geodesic'],
      nextTopics: ['einstein-field-equations'],
      related: ['gaussian-curvature'],
      applications: ['general-relativity'],
    },
    tags: ['곡률', 'curvature', '리만', 'Riemann'],
  },
  {
    id: 'differential-forms',
    name: {
      ko: '미분형식',
      en: 'Differential Forms',
      ja: '微分形式',
    },
    field: 'differential-geometry',
    subfield: 'calculus',
    difficulty: 5,
    content: {
      ko: {
        definition: '적분을 좌표에 무관하게 정의할 수 있는 반대칭 텐서장',
        formulas: [
          '0-형식: f',
          '1-형식: ω = f_i dx^i',
          '2-형식: ω = f_{ij} dx^i ∧ dx^j',
          '외미분: d',
        ],
        examples: ['dx, dy, dz', 'x dy - y dx', 'dx ∧ dy'],
        applications: ['스토크스 정리', '전자기학', '드람 코호몰로지'],
      },
      en: {
        definition: 'Antisymmetric tensor fields enabling coordinate-free integration',
        formulas: [
          '0-form: f',
          '1-form: ω = f_i dx^i',
          '2-form: ω = f_{ij} dx^i ∧ dx^j',
          'Exterior derivative: d',
        ],
        examples: ['dx, dy, dz', 'x dy - y dx', 'dx ∧ dy'],
        applications: ['Stokes theorem', 'Electromagnetism', 'de Rham cohomology'],
      },
      ja: {
        definition: '座標に依らず積分を定義できる反対称テンソル場',
        formulas: [
          '0-形式: f',
          '1-形式: ω = f_i dx^i',
          '2-形式: ω = f_{ij} dx^i ∧ dx^j',
          '外微分: d',
        ],
        examples: ['dx, dy, dz', 'x dy - y dx', 'dx ∧ dy'],
        applications: ['ストークスの定理', '電磁気学', 'ド・ラームコホモロジー'],
      },
    },
    latex: 'd\\omega = \\sum_i \\frac{\\partial \\omega}{\\partial x^i} dx^i \\wedge \\omega',
    relations: {
      prerequisites: ['manifold', 'multivariable-calculus'],
      nextTopics: ['de-rham-cohomology', 'stokes-theorem'],
      related: ['vectors', 'integration'],
      applications: ['physics', 'topology'],
    },
    tags: ['미분형식', 'differential', 'forms', 'exterior'],
  },
  {
    id: 'lie-groups',
    name: {
      ko: '리 군',
      en: 'Lie Groups',
      ja: 'リー群',
    },
    field: 'differential-geometry',
    subfield: 'groups',
    difficulty: 5,
    content: {
      ko: {
        definition: '군이면서 동시에 미분 다양체인 구조. 연속적인 대칭을 기술',
        formulas: ['군 연산: (g,h) ↦ gh, g ↦ g⁻¹ 가 매끄러움', '리 대수: T_e G', '[X,Y] = XY - YX'],
        examples: ['GL(n,ℝ)', 'SO(n)', 'SU(n)', 'SL(n,ℝ)'],
        applications: ['물리학 대칭', '미분방정식', '양자역학'],
      },
      en: {
        definition:
          'Structure that is both a group and differentiable manifold. Describes continuous symmetries',
        formulas: [
          'Group ops: (g,h) ↦ gh, g ↦ g⁻¹ are smooth',
          'Lie algebra: T_e G',
          '[X,Y] = XY - YX',
        ],
        examples: ['GL(n,ℝ)', 'SO(n)', 'SU(n)', 'SL(n,ℝ)'],
        applications: ['Physics symmetry', 'Differential equations', 'Quantum mechanics'],
      },
      ja: {
        definition: '群であり同時に微分多様体でもある構造。連続対称性を記述',
        formulas: ['群演算: (g,h) ↦ gh, g ↦ g⁻¹ が滑らか', 'リー代数: T_e G', '[X,Y] = XY - YX'],
        examples: ['GL(n,ℝ)', 'SO(n)', 'SU(n)', 'SL(n,ℝ)'],
        applications: ['物理学の対称性', '微分方程式', '量子力学'],
      },
    },
    latex: '[X, Y] = XY - YX',
    relations: {
      prerequisites: ['group-theory', 'manifold'],
      nextTopics: ['lie-algebra', 'representation-theory'],
      related: ['symmetry'],
      applications: ['particle-physics', 'robotics'],
    },
    tags: ['리군', 'Lie', 'group', 'symmetry'],
  },
  {
    id: 'gaussian-curvature',
    name: {
      ko: '가우스 곡률',
      en: 'Gaussian Curvature',
      ja: 'ガウス曲率',
    },
    field: 'differential-geometry',
    subfield: 'surfaces',
    difficulty: 4,
    content: {
      ko: {
        definition: '곡면의 내재적 곡률. 두 주곡률의 곱',
        formulas: ['K = κ₁ · κ₂', '가우스-보네: ∫∫_S K dA = 2πχ(S)', 'K = (LN - M²)/(EG - F²)'],
        examples: ['평면: K = 0', '구면: K = 1/r²', '안장: K < 0'],
        applications: ['지도 제작', '곡면 분류', '토폴로지'],
      },
      en: {
        definition: 'Intrinsic curvature of surface. Product of principal curvatures',
        formulas: ['K = κ₁ · κ₂', 'Gauss-Bonnet: ∫∫_S K dA = 2πχ(S)', 'K = (LN - M²)/(EG - F²)'],
        examples: ['Plane: K = 0', 'Sphere: K = 1/r²', 'Saddle: K < 0'],
        applications: ['Cartography', 'Surface classification', 'Topology'],
      },
      ja: {
        definition: '曲面の内在的曲率。主曲率の積',
        formulas: ['K = κ₁ · κ₂', 'ガウス・ボンネ: ∫∫_S K dA = 2πχ(S)', 'K = (LN - M²)/(EG - F²)'],
        examples: ['平面: K = 0', '球面: K = 1/r²', '鞍点: K < 0'],
        applications: ['地図製作', '曲面分類', 'トポロジー'],
      },
    },
    latex: 'K = \\kappa_1 \\cdot \\kappa_2',
    relations: {
      prerequisites: ['surface', 'curvature'],
      nextTopics: ['gauss-bonnet-theorem'],
      related: ['mean-curvature'],
      applications: ['computer-graphics', 'physics'],
    },
    tags: ['가우스', 'Gaussian', '곡률', 'curvature'],
  },
];
