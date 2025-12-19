/**
 * @fileoverview 물리수학 개념 데이터
 */
import type { MathConcept } from '../types';

export const physicsConcepts: MathConcept[] = [
  {
    id: 'kinematics',
    name: {
      ko: '운동학',
      en: 'Kinematics',
      ja: '運動学',
    },
    field: 'applied-physics',
    subfield: 'mechanics',
    difficulty: 2,
    content: {
      ko: {
        definition:
          '운동학은 힘을 고려하지 않고 물체의 운동(위치, 속도, 가속도)을 기술하는 역학의 분야입니다.',
        formulas: [
          {
            latex: 'v = v_0 + at',
            description: '속도-시간 관계',
          },
          {
            latex: 'x = x_0 + v_0 t + \\frac{1}{2}at^2',
            description: '위치-시간 관계',
          },
          {
            latex: 'v^2 = v_0^2 + 2a(x - x_0)',
            description: '속도-위치 관계',
          },
          {
            latex: 'v = \\frac{dx}{dt}, \\quad a = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}',
            description: '미분 형태',
          },
        ],
        examples: [
          {
            problem: '10m/s로 던진 공이 중력(-10m/s²)으로 몇 초 후 최고점?',
            solution: 'v = v₀ + at → 0 = 10 - 10t → t = 1초',
          },
          {
            problem: '정지 상태에서 5m/s²로 가속하여 3초 후 이동 거리는?',
            solution: 'x = ½at² = ½(5)(9) = 22.5m',
          },
        ],
        applications: [
          { field: '교통', description: '차량 제동 거리 계산' },
          { field: '스포츠', description: '공의 궤적 예측' },
          { field: '애니메이션', description: '물리 기반 움직임' },
        ],
      },
      en: {
        definition:
          'Kinematics describes motion (position, velocity, acceleration) without considering forces.',
        formulas: [
          {
            latex: 'v = v_0 + at',
            description: 'Velocity-time relation',
          },
          {
            latex: 'x = x_0 + v_0 t + \\frac{1}{2}at^2',
            description: 'Position-time relation',
          },
          {
            latex: 'v^2 = v_0^2 + 2a(x - x_0)',
            description: 'Velocity-position relation',
          },
          {
            latex: 'v = \\frac{dx}{dt}, \\quad a = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}',
            description: 'Differential forms',
          },
        ],
        examples: [
          {
            problem: 'Ball thrown up at 10m/s, gravity -10m/s². Time to peak?',
            solution: 'v = v₀ + at → 0 = 10 - 10t → t = 1s',
          },
          {
            problem: 'From rest, accelerate at 5m/s² for 3s. Distance?',
            solution: 'x = ½at² = ½(5)(9) = 22.5m',
          },
        ],
        applications: [
          { field: 'Traffic', description: 'Braking distance calculation' },
          { field: 'Sports', description: 'Ball trajectory prediction' },
          { field: 'Animation', description: 'Physics-based movement' },
        ],
      },
    },
    relations: {
      prerequisites: ['derivative', 'integral'],
      nextTopics: ['dynamics', 'projectile-motion'],
      related: ['differential-equations'],
    },
    tags: ['운동학', '역학', 'kinematics', 'motion'],
  },
  {
    id: 'wave-equation',
    name: {
      ko: '파동 방정식',
      en: 'Wave Equation',
      ja: '波動方程式',
    },
    field: 'applied-physics',
    subfield: 'waves',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '파동 방정식은 파동의 전파를 기술하는 편미분방정식입니다. 소리, 빛, 물결 등 다양한 파동에 적용됩니다.',
        formulas: [
          {
            latex: '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u',
            description: '일반 파동 방정식',
          },
          {
            latex:
              '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2}',
            description: '1차원 파동 방정식',
          },
          {
            latex: 'u(x,t) = f(x - ct) + g(x + ct)',
            description: '일반해 (달랑베르)',
          },
          {
            latex: 'u(x,t) = A\\sin(kx - \\omega t)',
            description: '정현파 해',
          },
        ],
        examples: [
          {
            problem: '파속 340m/s인 소리의 파동 방정식은?',
            solution: '∂²u/∂t² = 340² ∂²u/∂x² = 115,600 ∂²u/∂x²',
          },
          {
            problem: '파장 λ=2m, 주기 T=0.5s인 파동의 속도는?',
            solution: 'c = λ/T = 2/0.5 = 4m/s',
          },
        ],
        history: {
          discoveredBy: '장 르 롱 달랑베르',
          year: '1746년',
          background: '현의 진동 문제를 연구하면서 유도됨',
        },
        applications: [
          { field: '음향학', description: '소리 전파 모델링' },
          { field: '지진학', description: '지진파 분석' },
          { field: '전자기학', description: '전자기파' },
        ],
      },
      en: {
        definition:
          'Wave equation is a PDE describing wave propagation. Applies to sound, light, water waves, etc.',
        formulas: [
          {
            latex: '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u',
            description: 'General wave equation',
          },
          {
            latex:
              '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2}',
            description: '1D wave equation',
          },
          {
            latex: 'u(x,t) = f(x - ct) + g(x + ct)',
            description: "General solution (d'Alembert)",
          },
          {
            latex: 'u(x,t) = A\\sin(kx - \\omega t)',
            description: 'Sinusoidal solution',
          },
        ],
        examples: [
          {
            problem: 'Wave equation for sound at 340m/s?',
            solution: '∂²u/∂t² = 340² ∂²u/∂x² = 115,600 ∂²u/∂x²',
          },
          {
            problem: 'Wave with λ=2m, T=0.5s. Speed?',
            solution: 'c = λ/T = 2/0.5 = 4m/s',
          },
        ],
        history: {
          discoveredBy: "Jean le Rond d'Alembert",
          year: '1746',
          background: 'Derived while studying vibrating strings',
        },
        applications: [
          { field: 'Acoustics', description: 'Sound propagation modeling' },
          { field: 'Seismology', description: 'Seismic wave analysis' },
          { field: 'Electromagnetism', description: 'EM waves' },
        ],
      },
    },
    relations: {
      prerequisites: ['partial-derivative', 'differential-equations'],
      nextTopics: ['schrodinger-equation', 'maxwell-equations'],
      related: ['fourier-series'],
    },
    tags: ['파동', '편미분방정식', 'wave equation', 'PDE'],
  },
  {
    id: 'maxwell-equations',
    name: {
      ko: '맥스웰 방정식',
      en: "Maxwell's Equations",
      ja: 'マクスウェル方程式',
    },
    field: 'applied-physics',
    subfield: 'electromagnetism',
    difficulty: 5,
    content: {
      ko: {
        definition:
          '맥스웰 방정식은 전기장과 자기장의 관계를 기술하는 4개의 방정식입니다. 전자기학의 근본 법칙입니다.',
        formulas: [
          {
            latex: '\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}',
            description: '가우스 법칙 (전기)',
          },
          {
            latex: '\\nabla \\cdot \\vec{B} = 0',
            description: '가우스 법칙 (자기) - 자기 홀극 없음',
          },
          {
            latex: '\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}',
            description: '패러데이 법칙 - 전자기 유도',
          },
          {
            latex:
              '\\nabla \\times \\vec{B} = \\mu_0 \\vec{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\vec{E}}{\\partial t}',
            description: '앙페르-맥스웰 법칙',
          },
        ],
        examples: [
          {
            problem: '맥스웰 방정식에서 전자기파의 속도를 유도하세요.',
            solution: 'c = 1/√(μ₀ε₀) ≈ 3×10⁸ m/s (빛의 속도!)',
          },
        ],
        history: {
          discoveredBy: '제임스 클러크 맥스웰',
          year: '1865년',
          background: '여러 실험 법칙을 통합하고 변위전류를 추가하여 빛이 전자기파임을 예측',
        },
        applications: [
          { field: '통신', description: '전파, 안테나 설계' },
          { field: '광학', description: '빛의 전파' },
          { field: '전기공학', description: '회로, 모터 설계' },
        ],
      },
      en: {
        definition:
          "Maxwell's equations are 4 equations describing electric and magnetic fields. Fundamental laws of electromagnetism.",
        formulas: [
          {
            latex: '\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}',
            description: "Gauss's law (electric)",
          },
          {
            latex: '\\nabla \\cdot \\vec{B} = 0',
            description: "Gauss's law (magnetic) - no monopoles",
          },
          {
            latex: '\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}',
            description: "Faraday's law - induction",
          },
          {
            latex:
              '\\nabla \\times \\vec{B} = \\mu_0 \\vec{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\vec{E}}{\\partial t}',
            description: 'Ampère-Maxwell law',
          },
        ],
        examples: [
          {
            problem: "Derive speed of EM waves from Maxwell's equations.",
            solution: 'c = 1/√(μ₀ε₀) ≈ 3×10⁸ m/s (speed of light!)',
          },
        ],
        history: {
          discoveredBy: 'James Clerk Maxwell',
          year: '1865',
          background:
            'Unified experimental laws, added displacement current, predicted light is EM wave',
        },
        applications: [
          { field: 'Communications', description: 'Radio waves, antenna design' },
          { field: 'Optics', description: 'Light propagation' },
          { field: 'Electrical Engineering', description: 'Circuits, motor design' },
        ],
      },
    },
    relations: {
      prerequisites: ['nabla-operator', 'vector-calculus', 'partial-derivative'],
      nextTopics: ['electromagnetic-waves', 'special-relativity'],
      related: ['wave-equation', 'stokes-theorem'],
    },
    tags: ['맥스웰', '전자기학', 'Maxwell', 'electromagnetism'],
  },
  {
    id: 'schrodinger-equation',
    name: {
      ko: '슈뢰딩거 방정식',
      en: 'Schrödinger Equation',
      ja: 'シュレーディンガー方程式',
    },
    field: 'applied-physics',
    subfield: 'quantum',
    difficulty: 5,
    content: {
      ko: {
        definition:
          '슈뢰딩거 방정식은 양자역학에서 파동함수의 시간 변화를 기술합니다. 입자의 양자 상태를 예측합니다.',
        formulas: [
          {
            latex: 'i\\hbar \\frac{\\partial \\Psi}{\\partial t} = \\hat{H}\\Psi',
            description: '시간 의존 슈뢰딩거 방정식',
          },
          {
            latex: '\\hat{H}\\psi = E\\psi',
            description: '시간 독립 슈뢰딩거 방정식',
          },
          {
            latex: '\\hat{H} = -\\frac{\\hbar^2}{2m}\\nabla^2 + V',
            description: '해밀토니안 연산자',
          },
          {
            latex: '|\\Psi(x,t)|^2 = \\text{확률 밀도}',
            description: '파동함수의 해석',
          },
        ],
        examples: [
          {
            problem: '무한 우물(길이 L)에서 에너지 준위는?',
            solution: 'Eₙ = n²π²ℏ²/(2mL²), n = 1, 2, 3, ...',
          },
        ],
        history: {
          discoveredBy: '에르빈 슈뢰딩거',
          year: '1926년',
          background: '드브로이의 물질파 개념을 수학적으로 정립하여 1933년 노벨물리학상 수상',
        },
        applications: [
          { field: '화학', description: '분자 구조, 화학 결합' },
          { field: '반도체', description: '전자 밴드 구조' },
          { field: '나노기술', description: '양자 점, 터널링' },
        ],
      },
      en: {
        definition:
          'Schrödinger equation describes time evolution of wave function in quantum mechanics. Predicts quantum states.',
        formulas: [
          {
            latex: 'i\\hbar \\frac{\\partial \\Psi}{\\partial t} = \\hat{H}\\Psi',
            description: 'Time-dependent Schrödinger equation',
          },
          {
            latex: '\\hat{H}\\psi = E\\psi',
            description: 'Time-independent Schrödinger equation',
          },
          {
            latex: '\\hat{H} = -\\frac{\\hbar^2}{2m}\\nabla^2 + V',
            description: 'Hamiltonian operator',
          },
          {
            latex: '|\\Psi(x,t)|^2 = \\text{probability density}',
            description: 'Wave function interpretation',
          },
        ],
        examples: [
          {
            problem: 'Energy levels in infinite well (length L)?',
            solution: 'Eₙ = n²π²ℏ²/(2mL²), n = 1, 2, 3, ...',
          },
        ],
        history: {
          discoveredBy: 'Erwin Schrödinger',
          year: '1926',
          background:
            "Mathematically formulated de Broglie's matter wave concept; 1933 Nobel Prize",
        },
        applications: [
          { field: 'Chemistry', description: 'Molecular structure, bonds' },
          { field: 'Semiconductors', description: 'Electron band structure' },
          { field: 'Nanotechnology', description: 'Quantum dots, tunneling' },
        ],
      },
    },
    relations: {
      prerequisites: ['complex-numbers', 'partial-differential-equation', 'linear-algebra'],
      nextTopics: ['quantum-harmonic-oscillator', 'hydrogen-atom'],
      related: ['wave-equation', 'heisenberg-uncertainty'],
    },
    tags: ['슈뢰딩거', '양자역학', 'Schrödinger', 'quantum'],
  },
  {
    id: 'special-relativity-math',
    name: {
      ko: '특수상대성이론 수학',
      en: 'Special Relativity Mathematics',
      ja: '特殊相対性理論の数学',
    },
    field: 'applied-physics',
    subfield: 'relativity',
    difficulty: 5,
    content: {
      ko: {
        definition:
          '특수상대성이론은 빛의 속도가 일정하다는 원리에서 시간과 공간의 관계를 수학적으로 기술합니다.',
        formulas: [
          {
            latex: '\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}',
            description: '로렌츠 인자',
          },
          {
            latex: "t' = \\gamma\\left(t - \\frac{vx}{c^2}\\right)",
            description: '로렌츠 변환 (시간)',
          },
          {
            latex: "x' = \\gamma(x - vt)",
            description: '로렌츠 변환 (공간)',
          },
          {
            latex: 'E = mc^2',
            description: '질량-에너지 등가',
          },
          {
            latex: 'E^2 = (pc)^2 + (mc^2)^2',
            description: '에너지-운동량 관계',
          },
        ],
        examples: [
          {
            problem: 'v = 0.6c일 때 로렌츠 인자 γ는?',
            solution: 'γ = 1/√(1-0.36) = 1/√0.64 = 1/0.8 = 1.25',
          },
          {
            problem: '1kg의 질량이 완전히 에너지로 변환되면?',
            solution: 'E = mc² = 1 × (3×10⁸)² = 9×10¹⁶ J',
          },
        ],
        history: {
          discoveredBy: '알베르트 아인슈타인',
          year: '1905년',
          background: '기적의 해에 발표된 4편의 논문 중 하나로 물리학을 혁명적으로 바꿈',
        },
        applications: [
          { field: 'GPS', description: '위성 시계 보정' },
          { field: '입자 가속기', description: '고에너지 입자 물리' },
          { field: '핵 에너지', description: 'E=mc² 응용' },
        ],
      },
      en: {
        definition:
          'Special relativity mathematically describes space-time from the principle that light speed is constant.',
        formulas: [
          {
            latex: '\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}',
            description: 'Lorentz factor',
          },
          {
            latex: "t' = \\gamma\\left(t - \\frac{vx}{c^2}\\right)",
            description: 'Lorentz transformation (time)',
          },
          {
            latex: "x' = \\gamma(x - vt)",
            description: 'Lorentz transformation (space)',
          },
          {
            latex: 'E = mc^2',
            description: 'Mass-energy equivalence',
          },
          {
            latex: 'E^2 = (pc)^2 + (mc^2)^2',
            description: 'Energy-momentum relation',
          },
        ],
        examples: [
          {
            problem: 'Lorentz factor γ at v = 0.6c?',
            solution: 'γ = 1/√(1-0.36) = 1/√0.64 = 1/0.8 = 1.25',
          },
          {
            problem: '1kg mass fully converted to energy?',
            solution: 'E = mc² = 1 × (3×10⁸)² = 9×10¹⁶ J',
          },
        ],
        history: {
          discoveredBy: 'Albert Einstein',
          year: '1905',
          background: 'One of four papers in his miracle year that revolutionized physics',
        },
        applications: [
          { field: 'GPS', description: 'Satellite clock correction' },
          { field: 'Particle Accelerators', description: 'High-energy physics' },
          { field: 'Nuclear Energy', description: 'E=mc² applications' },
        ],
      },
    },
    relations: {
      prerequisites: ['kinematics', 'lorentz-transformation'],
      nextTopics: ['general-relativity', 'four-vectors'],
      related: ['maxwell-equations'],
    },
    tags: ['상대성', '로렌츠', 'relativity', 'Einstein'],
  },
  {
    id: 'newtons-laws',
    name: {
      ko: '뉴턴의 운동 법칙',
      en: "Newton's Laws of Motion",
      ja: 'ニュートンの運動法則',
    },
    field: 'applied-physics',
    subfield: 'mechanics',
    difficulty: 2,
    content: {
      ko: {
        definition:
          '뉴턴의 세 가지 운동 법칙은 힘과 운동의 관계를 정의합니다. 고전역학의 근본 원리입니다.',
        formulas: [
          {
            latex: '\\vec{F} = 0 \\Rightarrow \\vec{v} = \\text{const}',
            description: '제1법칙: 관성의 법칙',
          },
          {
            latex: '\\vec{F} = m\\vec{a} = m\\frac{d\\vec{v}}{dt}',
            description: '제2법칙: 가속도의 법칙',
          },
          {
            latex: '\\vec{F}_{12} = -\\vec{F}_{21}',
            description: '제3법칙: 작용-반작용',
          },
        ],
        examples: [
          {
            problem: '5kg 물체에 10N 힘을 가하면 가속도는?',
            solution: 'a = F/m = 10/5 = 2 m/s²',
          },
          {
            problem: '지구가 사과를 당기는 힘과 사과가 지구를 당기는 힘은?',
            solution: '제3법칙에 의해 크기가 같고 방향이 반대 (F = mg)',
          },
        ],
        history: {
          discoveredBy: '아이작 뉴턴',
          year: '1687년',
          background: '프린키피아에서 발표하여 과학 혁명을 완성',
        },
        applications: [
          { field: '기계공학', description: '구조 분석, 동역학' },
          { field: '항공우주', description: '궤도 역학' },
          { field: '로봇공학', description: '로봇 움직임 제어' },
        ],
      },
      en: {
        definition:
          "Newton's three laws define the relationship between force and motion. Foundation of classical mechanics.",
        formulas: [
          {
            latex: '\\vec{F} = 0 \\Rightarrow \\vec{v} = \\text{const}',
            description: '1st law: Law of inertia',
          },
          {
            latex: '\\vec{F} = m\\vec{a} = m\\frac{d\\vec{v}}{dt}',
            description: '2nd law: F = ma',
          },
          {
            latex: '\\vec{F}_{12} = -\\vec{F}_{21}',
            description: '3rd law: Action-reaction',
          },
        ],
        examples: [
          {
            problem: '10N force on 5kg mass. Acceleration?',
            solution: 'a = F/m = 10/5 = 2 m/s²',
          },
          {
            problem: 'Force of Earth on apple vs apple on Earth?',
            solution: 'By 3rd law, equal magnitude, opposite direction (F = mg)',
          },
        ],
        history: {
          discoveredBy: 'Isaac Newton',
          year: '1687',
          background: 'Published in Principia, completing the Scientific Revolution',
        },
        applications: [
          { field: 'Mechanical Engineering', description: 'Structural analysis' },
          { field: 'Aerospace', description: 'Orbital mechanics' },
          { field: 'Robotics', description: 'Robot motion control' },
        ],
      },
    },
    relations: {
      prerequisites: ['kinematics', 'derivative'],
      nextTopics: ['work-energy', 'momentum'],
      related: ['differential-equations'],
    },
    tags: ['뉴턴', '역학', 'Newton', 'mechanics'],
  },
];
