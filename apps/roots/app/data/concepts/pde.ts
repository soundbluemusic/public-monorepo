import type { MathConcept } from '../types';

export const pdeConcepts: MathConcept[] = [
  {
    id: 'heat-equation',
    name: {
      ko: '열 방정식',
      en: 'Heat Equation',
    },
    field: 'partial-differential-equations',
    subfield: 'parabolic',
    difficulty: 4,
    content: {
      ko: {
        definition: '열의 확산을 기술하는 포물선형 편미분방정식',
        formulas: ['∂u/∂t = α∇²u', '1D: ∂u/∂t = α ∂²u/∂x²', '기본해: u = (1/√4παt)exp(-x²/4αt)'],
        examples: ['금속 막대의 열전도', '확산 과정', '브라운 운동'],
        applications: ['열역학', '금융 (Black-Scholes)', '이미지 처리'],
      },
      en: {
        definition: 'Parabolic PDE describing heat diffusion',
        formulas: [
          '∂u/∂t = α∇²u',
          '1D: ∂u/∂t = α ∂²u/∂x²',
          'Fundamental: u = (1/√4παt)exp(-x²/4αt)',
        ],
        examples: ['Heat conduction in rod', 'Diffusion processes', 'Brownian motion'],
        applications: ['Thermodynamics', 'Finance (Black-Scholes)', 'Image processing'],
      },
    },
    latex: '\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u',
    relations: {
      prerequisites: ['partial-derivatives', 'fourier-series'],
      nextTopics: ['black-scholes', 'diffusion-equation'],
      related: ['laplace-equation'],
      applications: ['physics', 'finance'],
    },
    tags: ['열방정식', 'heat', 'parabolic', 'diffusion'],
  },
  {
    id: 'wave-equation-pde',
    name: {
      ko: '파동 방정식',
      en: 'Wave Equation',
    },
    field: 'partial-differential-equations',
    subfield: 'hyperbolic',
    difficulty: 4,
    content: {
      ko: {
        definition: '파동의 전파를 기술하는 쌍곡선형 편미분방정식',
        formulas: [
          '∂²u/∂t² = c²∇²u',
          '1차원 파동 방정식의 달랑베르 해: u = f(x-ct) + g(x+ct)',
          '특성선: x ± ct = const',
        ],
        examples: ['현의 진동', '음파', '전자기파'],
        applications: ['음향학', '광학', '지진학'],
      },
      en: {
        definition: 'Hyperbolic PDE describing wave propagation',
        formulas: [
          '∂²u/∂t² = c²∇²u',
          "1D d'Alembert solution: u = f(x-ct) + g(x+ct)",
          'Characteristics: x ± ct = const',
        ],
        examples: ['String vibration', 'Sound waves', 'EM waves'],
        applications: ['Acoustics', 'Optics', 'Seismology'],
      },
    },
    latex: '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u',
    relations: {
      prerequisites: ['partial-derivatives', 'ode'],
      nextTopics: ['maxwell-equations'],
      related: ['heat-equation'],
      applications: ['physics', 'engineering'],
    },
    tags: ['파동', 'wave', 'hyperbolic', 'propagation'],
  },
  {
    id: 'laplace-equation',
    name: {
      ko: '라플라스 방정식',
      en: 'Laplace Equation',
    },
    field: 'partial-differential-equations',
    subfield: 'elliptic',
    difficulty: 4,
    content: {
      ko: {
        definition: '정상 상태를 기술하는 타원형 편미분방정식. 조화함수를 정의',
        formulas: ['∇²u = 0', '∂²u/∂x² + ∂²u/∂y² = 0', '평균값 성질', '최대값 원리'],
        examples: ['정전기 포텐셜', '정상 열전도', '유체 흐름'],
        applications: ['전자기학', '유체역학', '중력'],
      },
      en: {
        definition: 'Elliptic PDE describing steady state. Defines harmonic functions',
        formulas: ['∇²u = 0', '∂²u/∂x² + ∂²u/∂y² = 0', 'Mean value property', 'Maximum principle'],
        examples: ['Electrostatic potential', 'Steady heat conduction', 'Fluid flow'],
        applications: ['Electromagnetism', 'Fluid mechanics', 'Gravity'],
      },
    },
    latex: '\\nabla^2 u = 0',
    relations: {
      prerequisites: ['partial-derivatives', 'multivariable-calculus'],
      nextTopics: ['poisson-equation', 'harmonic-functions'],
      related: ['heat-equation'],
      applications: ['physics', 'engineering'],
    },
    tags: ['라플라스', 'Laplace', 'elliptic', 'harmonic'],
  },
  {
    id: 'navier-stokes',
    name: {
      ko: '나비에-스토크스 방정식',
      en: 'Navier-Stokes Equations',
    },
    field: 'partial-differential-equations',
    subfield: 'fluid',
    difficulty: 5,
    content: {
      ko: {
        definition: '점성 유체의 운동을 기술하는 비선형 편미분방정식',
        formulas: [
          '밀도와 점성이 일정한 비압축성 유체: ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + f',
          '∇·v = 0 (비압축성)',
          '레이놀즈 수: Re = ρvL/μ',
        ],
        examples: ['공기 흐름', '해류', '혈류'],
        applications: ['항공역학', '기상학', '생체역학'],
      },
      en: {
        definition: 'Nonlinear PDE describing viscous fluid motion',
        formulas: [
          'Incompressible fluid with constant density and viscosity: ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + f',
          '∇·v = 0 (incompressible)',
          'Reynolds: Re = ρvL/μ',
        ],
        examples: ['Air flow', 'Ocean currents', 'Blood flow'],
        applications: ['Aerodynamics', 'Meteorology', 'Biomechanics'],
      },
    },
    latex:
      '\\rho\\left(\\frac{\\partial \\mathbf{v}}{\\partial t} + \\mathbf{v} \\cdot \\nabla\\mathbf{v}\\right) = -\\nabla p + \\mu\\nabla^2\\mathbf{v} + \\mathbf f,\\quad \\nabla\\cdot\\mathbf v=0',
    relations: {
      prerequisites: ['vector-calculus', 'fluid-dynamics'],
      nextTopics: ['turbulence', 'cfd'],
      related: ['euler-equations'],
      applications: ['engineering', 'physics'],
    },
    tags: ['나비에스토크스', 'Navier-Stokes', 'fluid', 'millennium'],
  },
  {
    id: 'separation-of-variables',
    name: {
      ko: '변수 분리법',
      en: 'Separation of Variables',
    },
    field: 'partial-differential-equations',
    subfield: 'methods',
    difficulty: 3,
    content: {
      ko: {
        definition: 'PDE를 여러 ODE로 분해하여 푸는 방법',
        formulas: ['가정: u(x,t) = X(x)T(t)', '각 변수별 ODE로 분리', '고유값 문제 + 급수 해'],
        examples: ['열 방정식', '파동 방정식', '라플라스 방정식'],
        applications: ['물리학', '공학', '경계값 문제'],
      },
      en: {
        definition: 'Method solving PDEs by decomposing into several ODEs',
        formulas: [
          'Assume: u(x,t) = X(x)T(t)',
          'Separate into ODEs per variable',
          'Eigenvalue problem + series solution',
        ],
        examples: ['Heat equation', 'Wave equation', 'Laplace equation'],
        applications: ['Physics', 'Engineering', 'Boundary value problems'],
      },
    },
    latex: 'u(x,t) = X(x)T(t)',
    relations: {
      prerequisites: ['ode', 'fourier-series'],
      nextTopics: ['sturm-liouville'],
      related: ['eigenvalue-problems'],
      applications: ['physics', 'engineering'],
    },
    tags: ['변수분리', 'separation', 'variables', 'method'],
  },
  {
    id: 'greens-function',
    name: {
      ko: '그린 함수',
      en: "Green's Function",
    },
    field: 'partial-differential-equations',
    subfield: 'methods',
    difficulty: 5,
    content: {
      ko: {
        definition: '점 소스에 대한 응답. 선형 미분방정식의 해를 적분으로 표현',
        formulas: [
          'LG(x,ξ) = δ(x-ξ)',
          '해: u(x) = ∫G(x,ξ)f(ξ)dξ',
          '상반정리: 적절한 자기수반 연산자와 경계 조건에서 G(x,ξ) = G(ξ,x)',
        ],
        examples: ['포아송 방정식', '열 방정식', '파동 방정식'],
        applications: ['전자기학', '양자역학', '음향학'],
      },
      en: {
        definition: 'Response to point source. Expresses solution of linear DE as integral',
        formulas: [
          'LG(x,ξ) = δ(x-ξ)',
          'Solution: u(x) = ∫G(x,ξ)f(ξ)dξ',
          'Reciprocity: G(x,ξ) = G(ξ,x) for appropriate self-adjoint operators and boundary conditions',
        ],
        examples: ['Poisson equation', 'Heat equation', 'Wave equation'],
        applications: ['Electromagnetism', 'Quantum mechanics', 'Acoustics'],
      },
    },
    latex: 'u(x) = \\int G(x,\\xi) f(\\xi) \\, d\\xi',
    relations: {
      prerequisites: ['laplace-equation', 'dirac-delta'],
      nextTopics: ['integral-equations'],
      related: ['convolution'],
      applications: ['physics', 'engineering'],
    },
    tags: ['그린', 'Green', '함수', 'function'],
  },
  {
    id: 'finite-difference-method',
    name: {
      ko: '유한 차분법',
      en: 'Finite Difference Method',
    },
    field: 'partial-differential-equations',
    subfield: 'numerical',
    difficulty: 4,
    content: {
      ko: {
        definition: '미분을 차분으로 근사하여 PDE를 수치적으로 푸는 방법',
        formulas: [
          '∂u/∂x ≈ (u_{i+1} - u_{i-1})/(2Δx)',
          '∂²u/∂x² ≈ (u_{i+1} - 2uᵢ + u_{i-1})/(Δx)²',
          '1차원 파동 방정식의 표준 명시적 중심 차분법에서 CFL 조건: cΔt/Δx ≤ 1',
        ],
        examples: ['열 방정식 (명시적/암시적)', '파동 방정식'],
        applications: ['CFD', '기상 예측', '금융'],
      },
      en: {
        definition: 'Numerical method solving PDEs by approximating derivatives with differences',
        formulas: [
          '∂u/∂x ≈ (u_{i+1} - u_{i-1})/(2Δx)',
          '∂²u/∂x² ≈ (u_{i+1} - 2uᵢ + u_{i-1})/(Δx)²',
          'CFL condition for the standard explicit centered scheme for the 1D wave equation: cΔt/Δx ≤ 1',
        ],
        examples: ['Heat equation (explicit/implicit)', 'Wave equation'],
        applications: ['CFD', 'Weather prediction', 'Finance'],
      },
    },
    latex:
      '\\frac{\\partial^2 u}{\\partial x^2} \\approx \\frac{u_{i+1} - 2u_i + u_{i-1}}{(\\Delta x)^2}',
    relations: {
      prerequisites: ['taylor-series', 'linear-algebra'],
      nextTopics: ['finite-element-method', 'stability-analysis'],
      related: ['numerical-integration'],
      applications: ['simulation', 'cfd'],
    },
    tags: ['유한차분', 'finite-difference', 'numerical', 'discretization'],
  },
  {
    id: 'boundary-conditions',
    name: {
      ko: '경계 조건',
      en: 'Boundary Conditions',
    },
    field: 'partial-differential-equations',
    subfield: 'foundations',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '편미분방정식에서 영역의 경계에 부과하는 조건. 적절한 초기 조건 등과 함께 해를 결정하는 데 쓰이지만, 경계 조건만으로 항상 유일성이 보장되지는 않습니다.',
        formulas: ['디리클레: u = g on ∂Ω', '노이만: ∂u/∂n = h on ∂Ω', '로빈: αu + β∂u/∂n = g'],
        examples: ['고정 끝 (Dirichlet)', '단열 (Neumann)', '대류 열전달 (Robin)'],
        applications: ['물리 모델링', '공학', '수치해석'],
      },
      en: {
        definition:
          'Conditions imposed at the boundary of a PDE domain. They help determine a solution with other required conditions, but boundary conditions alone do not always guarantee uniqueness.',
        formulas: ['Dirichlet: u = g on ∂Ω', 'Neumann: ∂u/∂n = h on ∂Ω', 'Robin: αu + β∂u/∂n = g'],
        examples: [
          'Fixed end (Dirichlet)',
          'Insulated (Neumann)',
          'Convective heat transfer (Robin)',
        ],
        applications: ['Physics modeling', 'Engineering', 'Numerical analysis'],
      },
    },
    latex: 'u = g \\text{ on } \\partial\\Omega',
    relations: {
      prerequisites: ['calculus', 'ode'],
      nextTopics: ['well-posedness'],
      related: ['initial-conditions'],
      applications: ['physics', 'engineering'],
    },
    tags: ['경계조건', 'boundary', 'Dirichlet', 'Neumann'],
  },
];
