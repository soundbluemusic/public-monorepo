import type { MathConcept } from '../types';

export const engineeringConcepts: MathConcept[] = [
  {
    id: 'signal-processing',
    name: {
      ko: '신호 처리',
      en: 'Signal Processing',
      ja: '信号処理',
    },
    field: 'applied-engineering',
    subfield: 'signal-systems',
    difficulty: 4,
    content: {
      ko: {
        definition: '신호를 분석, 수정, 합성하는 수학적 기법',
        formulas: ['푸리에 변환: F(ω) = ∫f(t)e^{-iωt}dt', '컨볼루션: (f*g)(t) = ∫f(τ)g(t-τ)dτ'],
        examples: ['오디오 필터링', '이미지 압축'],
        applications: ['통신 시스템', 'MP3 인코딩'],
      },
      en: {
        definition: 'Mathematical techniques to analyze, modify, and synthesize signals',
        formulas: [
          'Fourier Transform: F(ω) = ∫f(t)e^{-iωt}dt',
          'Convolution: (f*g)(t) = ∫f(τ)g(t-τ)dτ',
        ],
        examples: ['Audio filtering', 'Image compression'],
        applications: ['Communication systems', 'MP3 encoding'],
      },
      ja: {
        definition: '信号を解析、修正、合成する数学的手法',
        formulas: ['フーリエ変換: F(ω) = ∫f(t)e^{-iωt}dt', '畳み込み: (f*g)(t) = ∫f(τ)g(t-τ)dτ'],
        examples: ['オーディオフィルタリング', '画像圧縮'],
        applications: ['通信システム', 'MP3エンコーディング'],
      },
    },
    latex: 'F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)e^{-i\\omega t}dt',
    relations: {
      prerequisites: ['fourier-series', 'complex-numbers'],
      nextTopics: ['control-theory'],
      related: ['wave-equation'],
      applications: ['audio-engineering', 'image-processing'],
    },
    tags: ['engineering', 'signals', 'fourier'],
  },
  {
    id: 'control-theory',
    name: {
      ko: '제어 이론',
      en: 'Control Theory',
      ja: '制御理論',
    },
    field: 'applied-engineering',
    subfield: 'signal-systems',
    difficulty: 4,
    content: {
      ko: {
        definition: '동적 시스템의 행동을 조절하기 위한 수학적 프레임워크',
        formulas: ['전달 함수: H(s) = Y(s)/X(s)', 'PID 제어: u(t) = Kp·e + Ki·∫e dt + Kd·de/dt'],
        examples: ['온도 조절기', '자동차 크루즈 컨트롤'],
        applications: ['로봇 공학', '항공기 조종'],
      },
      en: {
        definition: 'Mathematical framework for regulating the behavior of dynamic systems',
        formulas: [
          'Transfer Function: H(s) = Y(s)/X(s)',
          'PID Control: u(t) = Kp·e + Ki·∫e dt + Kd·de/dt',
        ],
        examples: ['Thermostat', 'Car cruise control'],
        applications: ['Robotics', 'Aircraft autopilot'],
      },
      ja: {
        definition: '動的システムの振る舞いを制御するための数学的フレームワーク',
        formulas: ['伝達関数: H(s) = Y(s)/X(s)', 'PID制御: u(t) = Kp·e + Ki·∫e dt + Kd·de/dt'],
        examples: ['サーモスタット', '車のクルーズコントロール'],
        applications: ['ロボット工学', '航空機の自動操縦'],
      },
    },
    latex: 'H(s) = \\frac{Y(s)}{X(s)}',
    relations: {
      prerequisites: ['differential-equations', 'laplace-transform'],
      nextTopics: ['state-space-model'],
      related: ['signal-processing'],
      applications: ['robotics', 'automation'],
    },
    tags: ['engineering', 'control', 'systems'],
  },
  {
    id: 'laplace-transform',
    name: {
      ko: '라플라스 변환',
      en: 'Laplace Transform',
      ja: 'ラプラス変換',
    },
    field: 'applied-engineering',
    subfield: 'signal-systems',
    difficulty: 4,
    content: {
      ko: {
        definition: '시간 영역 함수를 복소 주파수 영역으로 변환하는 적분 변환',
        formulas: ['L{f(t)} = F(s) = ∫₀^∞ f(t)e^{-st}dt', "L{f'(t)} = sF(s) - f(0)"],
        examples: ['L{e^{at}} = 1/(s-a)', 'L{sin(ωt)} = ω/(s²+ω²)'],
        applications: ['회로 해석', '제어 시스템'],
      },
      en: {
        definition:
          'Integral transform converting time-domain functions to complex frequency domain',
        formulas: ['L{f(t)} = F(s) = ∫₀^∞ f(t)e^{-st}dt', "L{f'(t)} = sF(s) - f(0)"],
        examples: ['L{e^{at}} = 1/(s-a)', 'L{sin(ωt)} = ω/(s²+ω²)'],
        applications: ['Circuit analysis', 'Control systems'],
      },
      ja: {
        definition: '時間領域関数を複素周波数領域に変換する積分変換',
        formulas: ['L{f(t)} = F(s) = ∫₀^∞ f(t)e^{-st}dt', "L{f'(t)} = sF(s) - f(0)"],
        examples: ['L{e^{at}} = 1/(s-a)', 'L{sin(ωt)} = ω/(s²+ω²)'],
        applications: ['回路解析', '制御システム'],
      },
    },
    latex: '\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^{\\infty} f(t)e^{-st}dt',
    relations: {
      prerequisites: ['improper-integrals', 'complex-numbers'],
      nextTopics: ['control-theory', 'z-transform'],
      related: ['fourier-transform'],
      applications: ['differential-equations', 'circuit-analysis'],
    },
    tags: ['engineering', 'transform', 'analysis'],
  },
  {
    id: 'z-transform',
    name: {
      ko: 'Z 변환',
      en: 'Z-Transform',
      ja: 'Z変換',
    },
    field: 'applied-engineering',
    subfield: 'signal-systems',
    difficulty: 4,
    content: {
      ko: {
        definition: '이산 신호를 복소 평면으로 변환하는 기법',
        formulas: ['Z{x[n]} = X(z) = Σx[n]z^{-n}', '역변환: x[n] = (1/2πi)∮X(z)z^{n-1}dz'],
        examples: ['Z{δ[n]} = 1', 'Z{u[n]} = z/(z-1)'],
        applications: ['디지털 필터 설계', '이산 제어 시스템'],
      },
      en: {
        definition: 'Technique to transform discrete signals to the complex plane',
        formulas: ['Z{x[n]} = X(z) = Σx[n]z^{-n}', 'Inverse: x[n] = (1/2πi)∮X(z)z^{n-1}dz'],
        examples: ['Z{δ[n]} = 1', 'Z{u[n]} = z/(z-1)'],
        applications: ['Digital filter design', 'Discrete control systems'],
      },
      ja: {
        definition: '離散信号を複素平面に変換する手法',
        formulas: ['Z{x[n]} = X(z) = Σx[n]z^{-n}', '逆変換: x[n] = (1/2πi)∮X(z)z^{n-1}dz'],
        examples: ['Z{δ[n]} = 1', 'Z{u[n]} = z/(z-1)'],
        applications: ['デジタルフィルタ設計', '離散制御システム'],
      },
    },
    latex: 'X(z) = \\sum_{n=-\\infty}^{\\infty} x[n]z^{-n}',
    relations: {
      prerequisites: ['laplace-transform', 'sequences-and-series'],
      nextTopics: ['digital-signal-processing'],
      related: ['fourier-transform'],
      applications: ['digital-filters', 'control-systems'],
    },
    tags: ['engineering', 'discrete', 'transform'],
  },
  {
    id: 'structural-mechanics',
    name: {
      ko: '구조 역학',
      en: 'Structural Mechanics',
      ja: '構造力学',
    },
    field: 'applied-engineering',
    subfield: 'mechanics',
    difficulty: 4,
    content: {
      ko: {
        definition: '하중을 받는 구조물의 응력, 변형, 안정성을 분석하는 학문',
        formulas: ['응력: σ = F/A', '변형률: ε = ΔL/L', '훅의 법칙: σ = Eε'],
        examples: ['보의 처짐 계산', '트러스 해석'],
        applications: ['건물 설계', '교량 공학'],
      },
      en: {
        definition: 'Study of stress, strain, and stability in structures under load',
        formulas: ['Stress: σ = F/A', 'Strain: ε = ΔL/L', "Hooke's Law: σ = Eε"],
        examples: ['Beam deflection calculation', 'Truss analysis'],
        applications: ['Building design', 'Bridge engineering'],
      },
      ja: {
        definition: '荷重を受ける構造物の応力、ひずみ、安定性を解析する学問',
        formulas: ['応力: σ = F/A', 'ひずみ: ε = ΔL/L', 'フックの法則: σ = Eε'],
        examples: ['はりのたわみ計算', 'トラス解析'],
        applications: ['建物設計', '橋梁工学'],
      },
    },
    latex: '\\sigma = E\\epsilon',
    relations: {
      prerequisites: ['vectors', 'differential-equations'],
      nextTopics: ['finite-element-method'],
      related: ['kinematics'],
      applications: ['civil-engineering', 'mechanical-engineering'],
    },
    tags: ['engineering', 'mechanics', 'structures'],
  },
  {
    id: 'finite-element-method',
    name: {
      ko: '유한 요소법',
      en: 'Finite Element Method',
      ja: '有限要素法',
    },
    field: 'applied-engineering',
    subfield: 'numerical-methods',
    difficulty: 5,
    content: {
      ko: {
        definition: '복잡한 편미분방정식을 이산화하여 수치적으로 해결하는 방법',
        formulas: ['[K]{u} = {F}', '요소 강성 행렬: Ke = ∫BᵀDBdV'],
        examples: ['열전달 해석', '응력 분포 계산'],
        applications: ['CAE 소프트웨어', '구조 최적화'],
      },
      en: {
        definition: 'Method to numerically solve complex PDEs by discretization',
        formulas: ['[K]{u} = {F}', 'Element stiffness matrix: Ke = ∫BᵀDBdV'],
        examples: ['Heat transfer analysis', 'Stress distribution calculation'],
        applications: ['CAE software', 'Structural optimization'],
      },
      ja: {
        definition: '複雑な偏微分方程式を離散化して数値的に解く方法',
        formulas: ['[K]{u} = {F}', '要素剛性行列: Ke = ∫BᵀDBdV'],
        examples: ['熱伝達解析', '応力分布計算'],
        applications: ['CAEソフトウェア', '構造最適化'],
      },
    },
    latex: '[K]\\{u\\} = \\{F\\}',
    relations: {
      prerequisites: ['partial-differential-equations', 'linear-algebra'],
      nextTopics: ['computational-fluid-dynamics'],
      related: ['structural-mechanics'],
      applications: ['engineering-simulation', 'physics-modeling'],
    },
    tags: ['engineering', 'numerical', 'simulation'],
  },
  {
    id: 'fluid-dynamics',
    name: {
      ko: '유체 역학',
      en: 'Fluid Dynamics',
      ja: '流体力学',
    },
    field: 'applied-engineering',
    subfield: 'mechanics',
    difficulty: 4,
    content: {
      ko: {
        definition: '유체(액체, 기체)의 운동과 힘을 연구하는 역학 분야',
        formulas: [
          '연속 방정식: ∂ρ/∂t + ∇·(ρv) = 0',
          '나비에-스토크스: ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v',
        ],
        examples: ['파이프 흐름', '항공기 양력'],
        applications: ['항공공학', '기상 예측'],
      },
      en: {
        definition: 'Branch of mechanics studying motion and forces in fluids',
        formulas: ['Continuity: ∂ρ/∂t + ∇·(ρv) = 0', 'Navier-Stokes: ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v'],
        examples: ['Pipe flow', 'Aircraft lift'],
        applications: ['Aerospace engineering', 'Weather prediction'],
      },
      ja: {
        definition: '流体（液体、気体）の運動と力を研究する力学分野',
        formulas: [
          '連続の式: ∂ρ/∂t + ∇·(ρv) = 0',
          'ナビエ-ストークス: ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v',
        ],
        examples: ['パイプ流れ', '航空機の揚力'],
        applications: ['航空工学', '気象予測'],
      },
    },
    latex:
      '\\rho\\left(\\frac{\\partial \\mathbf{v}}{\\partial t} + \\mathbf{v} \\cdot \\nabla\\mathbf{v}\\right) = -\\nabla p + \\mu\\nabla^2\\mathbf{v}',
    relations: {
      prerequisites: ['partial-differential-equations', 'vectors'],
      nextTopics: ['computational-fluid-dynamics'],
      related: ['kinematics'],
      applications: ['aerospace', 'hydraulics'],
    },
    tags: ['engineering', 'fluids', 'mechanics'],
  },
  {
    id: 'thermodynamics-math',
    name: {
      ko: '열역학 수학',
      en: 'Thermodynamics Mathematics',
      ja: '熱力学の数学',
    },
    field: 'applied-engineering',
    subfield: 'thermal-systems',
    difficulty: 4,
    content: {
      ko: {
        definition: '열과 에너지 변환을 기술하는 수학적 프레임워크',
        formulas: ['제1법칙: dU = δQ - δW', '제2법칙: dS ≥ δQ/T', '상태 방정식: PV = nRT'],
        examples: ['카르노 사이클 효율', '엔트로피 계산'],
        applications: ['엔진 설계', '냉동 시스템'],
      },
      en: {
        definition: 'Mathematical framework describing heat and energy conversion',
        formulas: ['1st Law: dU = δQ - δW', '2nd Law: dS ≥ δQ/T', 'Equation of State: PV = nRT'],
        examples: ['Carnot cycle efficiency', 'Entropy calculation'],
        applications: ['Engine design', 'Refrigeration systems'],
      },
      ja: {
        definition: '熱とエネルギー変換を記述する数学的フレームワーク',
        formulas: ['第1法則: dU = δQ - δW', '第2法則: dS ≥ δQ/T', '状態方程式: PV = nRT'],
        examples: ['カルノーサイクル効率', 'エントロピー計算'],
        applications: ['エンジン設計', '冷凍システム'],
      },
    },
    latex: 'dS \\geq \\frac{\\delta Q}{T}',
    relations: {
      prerequisites: ['partial-differential-equations', 'multivariable-calculus'],
      nextTopics: ['statistical-mechanics'],
      related: ['entropy'],
      applications: ['power-generation', 'hvac'],
    },
    tags: ['engineering', 'thermodynamics', 'energy'],
  },
];
