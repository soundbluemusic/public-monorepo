import { MathConcept } from '../types';

export const pdeConcepts: MathConcept[] = [
  {
    id: 'heat-equation',
    name: {
      ko: '열 방정식',
      en: 'Heat Equation',
      ja: '熱方程式'
    },
    field: 'partial-differential-equations',
    subfield: 'parabolic',
    difficulty: 4,
    content: {
      ko: {
        definition: '열의 확산을 기술하는 포물선형 편미분방정식',
        formulas: ['∂u/∂t = α∇²u', '1D: ∂u/∂t = α ∂²u/∂x²', '기본해: u = (1/√4παt)exp(-x²/4αt)'],
        examples: ['금속 막대의 열전도', '확산 과정', '브라운 운동'],
        applications: ['열역학', '금융 (Black-Scholes)', '이미지 처리']
      },
      en: {
        definition: 'Parabolic PDE describing heat diffusion',
        formulas: ['∂u/∂t = α∇²u', '1D: ∂u/∂t = α ∂²u/∂x²', 'Fundamental: u = (1/√4παt)exp(-x²/4αt)'],
        examples: ['Heat conduction in rod', 'Diffusion processes', 'Brownian motion'],
        applications: ['Thermodynamics', 'Finance (Black-Scholes)', 'Image processing']
      },
      ja: {
        definition: '熱の拡散を記述する放物型偏微分方程式',
        formulas: ['∂u/∂t = α∇²u', '1D: ∂u/∂t = α ∂²u/∂x²', '基本解: u = (1/√4παt)exp(-x²/4αt)'],
        examples: ['金属棒の熱伝導', '拡散過程', 'ブラウン運動'],
        applications: ['熱力学', '金融 (ブラック・ショールズ)', '画像処理']
      }
    },
    latex: '\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u',
    relations: {
      prerequisites: ['partial-derivatives', 'fourier-series'],
      nextTopics: ['black-scholes', 'diffusion-equation'],
      related: ['laplace-equation'],
      applications: ['physics', 'finance']
    },
    tags: ['열방정식', 'heat', 'parabolic', 'diffusion']
  },
  {
    id: 'wave-equation-pde',
    name: {
      ko: '파동 방정식',
      en: 'Wave Equation',
      ja: '波動方程式'
    },
    field: 'partial-differential-equations',
    subfield: 'hyperbolic',
    difficulty: 4,
    content: {
      ko: {
        definition: '파동의 전파를 기술하는 쌍곡선형 편미분방정식',
        formulas: ['∂²u/∂t² = c²∇²u', '달랑베르 해: u = f(x-ct) + g(x+ct)', '특성선: x ± ct = const'],
        examples: ['현의 진동', '음파', '전자기파'],
        applications: ['음향학', '광학', '지진학']
      },
      en: {
        definition: 'Hyperbolic PDE describing wave propagation',
        formulas: ['∂²u/∂t² = c²∇²u', "d'Alembert: u = f(x-ct) + g(x+ct)", 'Characteristics: x ± ct = const'],
        examples: ['String vibration', 'Sound waves', 'EM waves'],
        applications: ['Acoustics', 'Optics', 'Seismology']
      },
      ja: {
        definition: '波の伝播を記述する双曲型偏微分方程式',
        formulas: ['∂²u/∂t² = c²∇²u', 'ダランベール解: u = f(x-ct) + g(x+ct)', '特性線: x ± ct = const'],
        examples: ['弦の振動', '音波', '電磁波'],
        applications: ['音響学', '光学', '地震学']
      }
    },
    latex: '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u',
    relations: {
      prerequisites: ['partial-derivatives', 'ode'],
      nextTopics: ['maxwell-equations'],
      related: ['heat-equation'],
      applications: ['physics', 'engineering']
    },
    tags: ['파동', 'wave', 'hyperbolic', 'propagation']
  },
  {
    id: 'laplace-equation',
    name: {
      ko: '라플라스 방정식',
      en: 'Laplace Equation',
      ja: 'ラプラス方程式'
    },
    field: 'partial-differential-equations',
    subfield: 'elliptic',
    difficulty: 4,
    content: {
      ko: {
        definition: '정상 상태를 기술하는 타원형 편미분방정식. 조화함수를 정의',
        formulas: ['∇²u = 0', '∂²u/∂x² + ∂²u/∂y² = 0', '평균값 성질', '최대값 원리'],
        examples: ['정전기 포텐셜', '정상 열전도', '유체 흐름'],
        applications: ['전자기학', '유체역학', '중력']
      },
      en: {
        definition: 'Elliptic PDE describing steady state. Defines harmonic functions',
        formulas: ['∇²u = 0', '∂²u/∂x² + ∂²u/∂y² = 0', 'Mean value property', 'Maximum principle'],
        examples: ['Electrostatic potential', 'Steady heat conduction', 'Fluid flow'],
        applications: ['Electromagnetism', 'Fluid mechanics', 'Gravity']
      },
      ja: {
        definition: '定常状態を記述する楕円型偏微分方程式。調和関数を定義',
        formulas: ['∇²u = 0', '∂²u/∂x² + ∂²u/∂y² = 0', '平均値の性質', '最大値原理'],
        examples: ['静電ポテンシャル', '定常熱伝導', '流体流れ'],
        applications: ['電磁気学', '流体力学', '重力']
      }
    },
    latex: '\\nabla^2 u = 0',
    relations: {
      prerequisites: ['partial-derivatives', 'multivariable-calculus'],
      nextTopics: ['poisson-equation', 'harmonic-functions'],
      related: ['heat-equation'],
      applications: ['physics', 'engineering']
    },
    tags: ['라플라스', 'Laplace', 'elliptic', 'harmonic']
  },
  {
    id: 'navier-stokes',
    name: {
      ko: '나비에-스토크스 방정식',
      en: 'Navier-Stokes Equations',
      ja: 'ナビエ・ストークス方程式'
    },
    field: 'partial-differential-equations',
    subfield: 'fluid',
    difficulty: 5,
    content: {
      ko: {
        definition: '점성 유체의 운동을 기술하는 비선형 편미분방정식',
        formulas: ['ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + f', '∇·v = 0 (비압축성)', '레이놀즈 수: Re = ρvL/μ'],
        examples: ['공기 흐름', '해류', '혈류'],
        applications: ['항공역학', '기상학', '생체역학']
      },
      en: {
        definition: 'Nonlinear PDE describing viscous fluid motion',
        formulas: ['ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + f', '∇·v = 0 (incompressible)', 'Reynolds: Re = ρvL/μ'],
        examples: ['Air flow', 'Ocean currents', 'Blood flow'],
        applications: ['Aerodynamics', 'Meteorology', 'Biomechanics']
      },
      ja: {
        definition: '粘性流体の運動を記述する非線形偏微分方程式',
        formulas: ['ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + f', '∇·v = 0 (非圧縮性)', 'レイノルズ数: Re = ρvL/μ'],
        examples: ['空気の流れ', '海流', '血流'],
        applications: ['空気力学', '気象学', '生体力学']
      }
    },
    latex: '\\rho\\left(\\frac{\\partial \\mathbf{v}}{\\partial t} + \\mathbf{v} \\cdot \\nabla\\mathbf{v}\\right) = -\\nabla p + \\mu\\nabla^2\\mathbf{v}',
    relations: {
      prerequisites: ['vector-calculus', 'fluid-dynamics'],
      nextTopics: ['turbulence', 'cfd'],
      related: ['euler-equations'],
      applications: ['engineering', 'physics']
    },
    tags: ['나비에스토크스', 'Navier-Stokes', 'fluid', 'millennium']
  },
  {
    id: 'separation-of-variables',
    name: {
      ko: '변수 분리법',
      en: 'Separation of Variables',
      ja: '変数分離法'
    },
    field: 'partial-differential-equations',
    subfield: 'methods',
    difficulty: 3,
    content: {
      ko: {
        definition: 'PDE를 여러 ODE로 분해하여 푸는 방법',
        formulas: ['가정: u(x,t) = X(x)T(t)', '각 변수별 ODE로 분리', '고유값 문제 + 급수 해'],
        examples: ['열 방정식', '파동 방정식', '라플라스 방정식'],
        applications: ['물리학', '공학', '경계값 문제']
      },
      en: {
        definition: 'Method solving PDEs by decomposing into several ODEs',
        formulas: ['Assume: u(x,t) = X(x)T(t)', 'Separate into ODEs per variable', 'Eigenvalue problem + series solution'],
        examples: ['Heat equation', 'Wave equation', 'Laplace equation'],
        applications: ['Physics', 'Engineering', 'Boundary value problems']
      },
      ja: {
        definition: 'PDEを複数のODEに分解して解く方法',
        formulas: ['仮定: u(x,t) = X(x)T(t)', '各変数のODEに分離', '固有値問題 + 級数解'],
        examples: ['熱方程式', '波動方程式', 'ラプラス方程式'],
        applications: ['物理学', '工学', '境界値問題']
      }
    },
    latex: 'u(x,t) = X(x)T(t)',
    relations: {
      prerequisites: ['ode', 'fourier-series'],
      nextTopics: ['sturm-liouville'],
      related: ['eigenvalue-problems'],
      applications: ['physics', 'engineering']
    },
    tags: ['변수분리', 'separation', 'variables', 'method']
  },
  {
    id: 'greens-function',
    name: {
      ko: '그린 함수',
      en: "Green's Function",
      ja: 'グリーン関数'
    },
    field: 'partial-differential-equations',
    subfield: 'methods',
    difficulty: 5,
    content: {
      ko: {
        definition: '점 소스에 대한 응답. 선형 미분방정식의 해를 적분으로 표현',
        formulas: ['LG(x,ξ) = δ(x-ξ)', '해: u(x) = ∫G(x,ξ)f(ξ)dξ', '상반정리: G(x,ξ) = G(ξ,x)'],
        examples: ['포아송 방정식', '열 방정식', '파동 방정식'],
        applications: ['전자기학', '양자역학', '음향학']
      },
      en: {
        definition: 'Response to point source. Expresses solution of linear DE as integral',
        formulas: ['LG(x,ξ) = δ(x-ξ)', 'Solution: u(x) = ∫G(x,ξ)f(ξ)dξ', 'Reciprocity: G(x,ξ) = G(ξ,x)'],
        examples: ['Poisson equation', 'Heat equation', 'Wave equation'],
        applications: ['Electromagnetism', 'Quantum mechanics', 'Acoustics']
      },
      ja: {
        definition: '点ソースへの応答。線形微分方程式の解を積分で表現',
        formulas: ['LG(x,ξ) = δ(x-ξ)', '解: u(x) = ∫G(x,ξ)f(ξ)dξ', '相反定理: G(x,ξ) = G(ξ,x)'],
        examples: ['ポアソン方程式', '熱方程式', '波動方程式'],
        applications: ['電磁気学', '量子力学', '音響学']
      }
    },
    latex: 'u(x) = \\int G(x,\\xi) f(\\xi) \\, d\\xi',
    relations: {
      prerequisites: ['laplace-equation', 'dirac-delta'],
      nextTopics: ['integral-equations'],
      related: ['convolution'],
      applications: ['physics', 'engineering']
    },
    tags: ['그린', 'Green', '함수', 'function']
  },
  {
    id: 'finite-difference-method',
    name: {
      ko: '유한 차분법',
      en: 'Finite Difference Method',
      ja: '有限差分法'
    },
    field: 'partial-differential-equations',
    subfield: 'numerical',
    difficulty: 4,
    content: {
      ko: {
        definition: '미분을 차분으로 근사하여 PDE를 수치적으로 푸는 방법',
        formulas: ['∂u/∂x ≈ (u_{i+1} - u_{i-1})/(2Δx)', '∂²u/∂x² ≈ (u_{i+1} - 2uᵢ + u_{i-1})/(Δx)²', 'CFL 조건: cΔt/Δx ≤ 1'],
        examples: ['열 방정식 (명시적/암시적)', '파동 방정식'],
        applications: ['CFD', '기상 예측', '금융']
      },
      en: {
        definition: 'Numerical method solving PDEs by approximating derivatives with differences',
        formulas: ['∂u/∂x ≈ (u_{i+1} - u_{i-1})/(2Δx)', '∂²u/∂x² ≈ (u_{i+1} - 2uᵢ + u_{i-1})/(Δx)²', 'CFL condition: cΔt/Δx ≤ 1'],
        examples: ['Heat equation (explicit/implicit)', 'Wave equation'],
        applications: ['CFD', 'Weather prediction', 'Finance']
      },
      ja: {
        definition: '微分を差分で近似してPDEを数値的に解く方法',
        formulas: ['∂u/∂x ≈ (u_{i+1} - u_{i-1})/(2Δx)', '∂²u/∂x² ≈ (u_{i+1} - 2uᵢ + u_{i-1})/(Δx)²', 'CFL条件: cΔt/Δx ≤ 1'],
        examples: ['熱方程式（陽解法/陰解法）', '波動方程式'],
        applications: ['CFD', '気象予測', '金融']
      }
    },
    latex: '\\frac{\\partial^2 u}{\\partial x^2} \\approx \\frac{u_{i+1} - 2u_i + u_{i-1}}{(\\Delta x)^2}',
    relations: {
      prerequisites: ['taylor-series', 'linear-algebra'],
      nextTopics: ['finite-element-method', 'stability-analysis'],
      related: ['numerical-integration'],
      applications: ['simulation', 'cfd']
    },
    tags: ['유한차분', 'finite-difference', 'numerical', 'discretization']
  },
  {
    id: 'boundary-conditions',
    name: {
      ko: '경계 조건',
      en: 'Boundary Conditions',
      ja: '境界条件'
    },
    field: 'partial-differential-equations',
    subfield: 'foundations',
    difficulty: 3,
    content: {
      ko: {
        definition: 'PDE의 유일한 해를 결정하기 위한 경계에서의 조건',
        formulas: ['디리클레: u = g on ∂Ω', '노이만: ∂u/∂n = h on ∂Ω', '로빈: αu + β∂u/∂n = g'],
        examples: ['고정 끝 (Dirichlet)', '단열 (Neumann)', '복사 (Robin)'],
        applications: ['물리 모델링', '공학', '수치해석']
      },
      en: {
        definition: 'Conditions at boundary to determine unique solution of PDE',
        formulas: ['Dirichlet: u = g on ∂Ω', 'Neumann: ∂u/∂n = h on ∂Ω', 'Robin: αu + β∂u/∂n = g'],
        examples: ['Fixed end (Dirichlet)', 'Insulated (Neumann)', 'Radiating (Robin)'],
        applications: ['Physics modeling', 'Engineering', 'Numerical analysis']
      },
      ja: {
        definition: 'PDEの一意解を決定するための境界での条件',
        formulas: ['ディリクレ: u = g on ∂Ω', 'ノイマン: ∂u/∂n = h on ∂Ω', 'ロビン: αu + β∂u/∂n = g'],
        examples: ['固定端（ディリクレ）', '断熱（ノイマン）', '放射（ロビン）'],
        applications: ['物理モデリング', '工学', '数値解析']
      }
    },
    latex: 'u = g \\text{ on } \\partial\\Omega',
    relations: {
      prerequisites: ['calculus', 'ode'],
      nextTopics: ['well-posedness'],
      related: ['initial-conditions'],
      applications: ['physics', 'engineering']
    },
    tags: ['경계조건', 'boundary', 'Dirichlet', 'Neumann']
  }
];
