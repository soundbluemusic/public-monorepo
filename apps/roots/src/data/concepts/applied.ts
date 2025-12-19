/**
 * @fileoverview 응용수학 개념 데이터
 */
import type { MathConcept } from '../types';

export const appliedConcepts: MathConcept[] = [
  {
    id: 'fourier-series',
    name: {
      ko: '푸리에 급수',
      en: 'Fourier Series',
      ja: 'フーリエ級数',
    },
    field: 'applied',
    subfield: 'fourier-analysis',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '푸리에 급수는 주기 함수를 사인과 코사인의 무한 급수로 표현하는 방법입니다. 모든 주기 함수는 진동 성분으로 분해될 수 있습니다.',
        formulas: [
          {
            latex: 'f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} (a_n \\cos nx + b_n \\sin nx)',
            description: '푸리에 급수',
          },
          {
            latex: 'a_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\cos(nx) dx',
            description: '푸리에 계수 (코사인)',
          },
          {
            latex: 'b_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\sin(nx) dx',
            description: '푸리에 계수 (사인)',
          },
        ],
        examples: [
          {
            problem: 'f(x) = x (-π < x < π)의 푸리에 급수를 구하세요.',
            solution:
              'a_n = 0 (기함수), b_n = 2(-1)^(n+1)/n. f(x) = 2(sin x - sin 2x/2 + sin 3x/3 - ...)',
          },
        ],
        history: {
          discoveredBy: '조제프 푸리에',
          year: '1822년',
          background: '푸리에가 열전도 방정식을 풀기 위해 개발했습니다.',
        },
        applications: [
          { field: '신호 처리', description: '주파수 분석' },
          { field: '음향학', description: '음파 분석, 음성 인식' },
          { field: '이미지 처리', description: 'JPEG 압축' },
        ],
      },
      en: {
        definition:
          'Fourier series represents periodic functions as infinite sums of sines and cosines. Any periodic function can be decomposed into oscillatory components.',
        formulas: [
          {
            latex: 'f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} (a_n \\cos nx + b_n \\sin nx)',
            description: 'Fourier series',
          },
          {
            latex: 'a_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\cos(nx) dx',
            description: 'Fourier coefficient (cosine)',
          },
          {
            latex: 'b_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\sin(nx) dx',
            description: 'Fourier coefficient (sine)',
          },
        ],
        examples: [
          {
            problem: 'Find the Fourier series of f(x) = x for -π < x < π.',
            solution:
              'a_n = 0 (odd function), b_n = 2(-1)^(n+1)/n. f(x) = 2(sin x - sin 2x/2 + sin 3x/3 - ...)',
          },
        ],
        history: {
          discoveredBy: 'Joseph Fourier',
          year: '1822',
          background: 'Fourier developed this to solve the heat equation.',
        },
        applications: [
          { field: 'Signal Processing', description: 'Frequency analysis' },
          { field: 'Acoustics', description: 'Sound analysis, speech recognition' },
          { field: 'Image Processing', description: 'JPEG compression' },
        ],
      },
    },
    relations: {
      prerequisites: ['integral', 'trigonometry'],
      nextTopics: ['fourier-transform', 'discrete-fourier'],
      related: ['harmonic-analysis'],
    },
    tags: ['푸리에', '급수', 'Fourier', 'series'],
  },
  {
    id: 'differential-equations',
    name: {
      ko: '미분방정식',
      en: 'Differential Equations',
      ja: '微分方程式',
    },
    field: 'applied',
    subfield: 'differential-eq',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '미분방정식은 미지 함수와 그 도함수들 사이의 관계를 나타내는 방정식입니다. 물리 현상을 모델링하는 기본 도구입니다.',
        formulas: [
          {
            latex: '\\frac{dy}{dx} = f(x, y)',
            description: '1계 미분방정식',
          },
          {
            latex: '\\frac{d^2y}{dx^2} + p\\frac{dy}{dx} + qy = 0',
            description: '2계 선형 제차 미분방정식',
          },
          {
            latex: 'y = Ce^{rx}',
            description: '지수형 해의 형태',
          },
        ],
        examples: [
          {
            problem: 'dy/dx = 2y를 푸세요.',
            solution: '변수분리: dy/y = 2dx, ln|y| = 2x + C, y = Ae^(2x)',
          },
          {
            problem: "y'' + y = 0을 푸세요.",
            solution: '특성방정식: r² + 1 = 0, r = ±i. 일반해: y = c₁cos x + c₂sin x',
          },
        ],
        applications: [
          { field: '물리학', description: '뉴턴 역학, 전자기학' },
          { field: '생물학', description: '개체군 성장, 감염병 모델' },
          { field: '경제학', description: '성장 모델' },
        ],
      },
      en: {
        definition:
          "A differential equation relates an unknown function to its derivatives. It's a fundamental tool for modeling physical phenomena.",
        formulas: [
          {
            latex: '\\frac{dy}{dx} = f(x, y)',
            description: 'First-order differential equation',
          },
          {
            latex: '\\frac{d^2y}{dx^2} + p\\frac{dy}{dx} + qy = 0',
            description: 'Second-order linear homogeneous',
          },
          {
            latex: 'y = Ce^{rx}',
            description: 'Exponential solution form',
          },
        ],
        examples: [
          {
            problem: 'Solve dy/dx = 2y.',
            solution: 'Separation: dy/y = 2dx, ln|y| = 2x + C, y = Ae^(2x)',
          },
          {
            problem: "Solve y'' + y = 0.",
            solution: 'Characteristic: r² + 1 = 0, r = ±i. General: y = c₁cos x + c₂sin x',
          },
        ],
        applications: [
          { field: 'Physics', description: 'Newtonian mechanics, electromagnetism' },
          { field: 'Biology', description: 'Population growth, epidemiology' },
          { field: 'Economics', description: 'Growth models' },
        ],
      },
    },
    relations: {
      prerequisites: ['derivative', 'integral'],
      nextTopics: ['partial-de', 'numerical-ode'],
      related: ['dynamical-systems'],
    },
    tags: ['미분방정식', 'ODE', 'differential equation'],
  },
  {
    id: 'complex-analysis-basics',
    name: {
      ko: '복소해석학 기초',
      en: 'Complex Analysis Basics',
      ja: '複素解析の基礎',
    },
    field: 'applied',
    subfield: 'complex-analysis',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '복소해석학은 복소수 함수의 미적분을 다룹니다. 해석함수는 미분 가능하고 아름다운 성질을 가집니다.',
        formulas: [
          {
            latex: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta',
            description: '오일러 공식',
          },
          {
            latex:
              '\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}, \\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}',
            description: '코시-리만 방정식',
          },
          {
            latex: '\\oint_C f(z) dz = 0',
            description: '코시 적분 정리 (단순 연결)',
          },
        ],
        examples: [
          {
            problem: '오일러 공식으로 e^(iπ)를 계산하세요.',
            solution: 'e^(iπ) = cos π + i sin π = -1 + 0i = -1',
          },
        ],
        history: {
          discoveredBy: '레온하르트 오일러, 오귀스탱 루이 코시',
          year: '18-19세기',
          background: '오일러가 공식을 발견했고, 코시가 복소함수 이론을 체계화했습니다.',
        },
        applications: [
          { field: '전자공학', description: '교류 회로 분석' },
          { field: '유체역학', description: '2D 유동' },
          { field: '양자역학', description: '파동함수' },
        ],
      },
      en: {
        definition:
          'Complex analysis studies calculus of complex-valued functions. Analytic functions are differentiable and have beautiful properties.',
        formulas: [
          {
            latex: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta',
            description: "Euler's formula",
          },
          {
            latex:
              '\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}, \\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}',
            description: 'Cauchy-Riemann equations',
          },
          {
            latex: '\\oint_C f(z) dz = 0',
            description: "Cauchy's integral theorem (simply connected)",
          },
        ],
        examples: [
          {
            problem: "Calculate e^(iπ) using Euler's formula.",
            solution: 'e^(iπ) = cos π + i sin π = -1 + 0i = -1',
          },
        ],
        history: {
          discoveredBy: 'Leonhard Euler, Augustin-Louis Cauchy',
          year: '18th-19th century',
          background: 'Euler discovered the formula; Cauchy systematized complex function theory.',
        },
        applications: [
          { field: 'Electrical Engineering', description: 'AC circuit analysis' },
          { field: 'Fluid Dynamics', description: '2D flow' },
          { field: 'Quantum Mechanics', description: 'Wave functions' },
        ],
      },
    },
    relations: {
      prerequisites: ['complex-numbers', 'derivative', 'integral'],
      nextTopics: ['residue-calculus', 'conformal-mapping'],
      related: ['fourier-transform'],
    },
    tags: ['복소해석', '오일러', 'complex analysis', 'Euler'],
  },
  {
    id: 'game-theory',
    name: {
      ko: '게임 이론',
      en: 'Game Theory',
      ja: 'ゲーム理論',
    },
    field: 'applied',
    subfield: 'game-theory',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '게임 이론은 전략적 상호작용을 수학적으로 분석합니다. 플레이어들이 합리적으로 행동할 때의 결과를 예측합니다.',
        formulas: [
          {
            latex: 'u_i(s^*_i, s^*_{-i}) \\geq u_i(s_i, s^*_{-i})',
            description: '내쉬 균형 조건',
          },
        ],
        examples: [
          {
            problem: '죄수의 딜레마에서 내쉬 균형을 찾으세요.',
            solution:
              '두 죄수가 모두 배신하는 것이 내쉬 균형입니다. 어느 쪽도 일방적으로 전략을 바꿔 이득을 볼 수 없습니다.',
          },
        ],
        history: {
          discoveredBy: '존 폰 노이만, 존 내쉬',
          year: '1928년, 1950년',
          background: '폰 노이만이 기초를 세웠고, 내쉬가 균형 개념을 일반화했습니다.',
        },
        applications: [
          { field: '경제학', description: '시장 경쟁, 경매' },
          { field: '정치학', description: '투표, 협상' },
          { field: '생물학', description: '진화적 안정 전략' },
        ],
      },
      en: {
        definition:
          'Game theory mathematically analyzes strategic interactions. It predicts outcomes when players act rationally.',
        formulas: [
          {
            latex: 'u_i(s^*_i, s^*_{-i}) \\geq u_i(s_i, s^*_{-i})',
            description: 'Nash equilibrium condition',
          },
        ],
        examples: [
          {
            problem: "Find the Nash equilibrium in the Prisoner's Dilemma.",
            solution:
              'Both prisoners defecting is the Nash equilibrium. Neither can improve by unilaterally changing strategy.',
          },
        ],
        history: {
          discoveredBy: 'John von Neumann, John Nash',
          year: '1928, 1950',
          background: 'Von Neumann laid foundations; Nash generalized the equilibrium concept.',
        },
        applications: [
          { field: 'Economics', description: 'Market competition, auctions' },
          { field: 'Political Science', description: 'Voting, negotiation' },
          { field: 'Biology', description: 'Evolutionarily stable strategies' },
        ],
      },
    },
    relations: {
      prerequisites: ['probability-basics', 'optimization-basics'],
      nextTopics: ['mechanism-design', 'cooperative-games'],
      related: ['decision-theory'],
    },
    tags: ['게임이론', '내쉬균형', 'game theory', 'Nash equilibrium'],
  },
  {
    id: 'cryptography-math',
    name: {
      ko: '암호학의 수학',
      en: 'Mathematics of Cryptography',
      ja: '暗号の数学',
    },
    field: 'applied',
    subfield: 'cryptography',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '암호학은 정보를 안전하게 통신하기 위한 수학적 기법입니다. 수론, 대수학, 복잡도 이론에 기반합니다.',
        formulas: [
          {
            latex: 'c = m^e \\mod n, \\quad m = c^d \\mod n',
            description: 'RSA 암호화/복호화',
          },
          {
            latex: 'ed \\equiv 1 \\pmod{\\phi(n)}',
            description: 'RSA 키 관계',
          },
        ],
        examples: [
          {
            problem: 'p=3, q=11, e=3일 때 RSA로 m=5를 암호화하세요.',
            solution: 'n = 33, c = 5³ mod 33 = 125 mod 33 = 26',
          },
        ],
        applications: [
          { field: '인터넷 보안', description: 'HTTPS, TLS' },
          { field: '전자상거래', description: '결제 보안' },
          { field: '블록체인', description: '디지털 서명' },
        ],
      },
      en: {
        definition:
          "Cryptography uses mathematical techniques for secure communication. It's based on number theory, algebra, and complexity theory.",
        formulas: [
          {
            latex: 'c = m^e \\mod n, \\quad m = c^d \\mod n',
            description: 'RSA encryption/decryption',
          },
          {
            latex: 'ed \\equiv 1 \\pmod{\\phi(n)}',
            description: 'RSA key relationship',
          },
        ],
        examples: [
          {
            problem: 'Encrypt m=5 using RSA with p=3, q=11, e=3.',
            solution: 'n = 33, c = 5³ mod 33 = 125 mod 33 = 26',
          },
        ],
        applications: [
          { field: 'Internet Security', description: 'HTTPS, TLS' },
          { field: 'E-commerce', description: 'Payment security' },
          { field: 'Blockchain', description: 'Digital signatures' },
        ],
      },
    },
    relations: {
      prerequisites: ['modular-arithmetic', 'prime-numbers', 'fermats-little-theorem'],
      nextTopics: ['elliptic-curve-crypto', 'quantum-crypto'],
      related: ['number-theory'],
    },
    tags: ['암호학', 'RSA', 'cryptography', 'security'],
  },
  {
    id: 'laplace-transform',
    name: {
      ko: '라플라스 변환',
      en: 'Laplace Transform',
      ja: 'ラプラス変換',
    },
    field: 'applied',
    subfield: 'transforms',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '시간 영역의 함수를 주파수 영역으로 변환하여 미분방정식을 대수방정식으로 바꿉니다.',
        formulas: [
          {
            latex: '\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^{\\infty} f(t) e^{-st} dt',
            description: '라플라스 변환 정의',
          },
          {
            latex: "\\mathcal{L}\\{f'(t)\\} = sF(s) - f(0)",
            description: '미분의 라플라스 변환',
          },
          {
            latex: '\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s-a}',
            description: '지수함수의 변환',
          },
        ],
        examples: [
          {
            problem: "y' + 2y = 0, y(0) = 3을 라플라스 변환으로 푸시오.",
            solution: 'sY - 3 + 2Y = 0\nY(s+2) = 3\nY = 3/(s+2)\ny(t) = 3e^(-2t)',
            difficulty: 4,
          },
        ],
        applications: [
          { field: '제어공학', description: '전달함수 분석' },
          { field: '전자공학', description: '회로 분석' },
          { field: '기계공학', description: '진동 분석' },
        ],
      },
      en: {
        definition:
          'Transforms time-domain functions to frequency domain, converting differential equations to algebraic equations.',
        formulas: [
          {
            latex: '\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^{\\infty} f(t) e^{-st} dt',
            description: 'Laplace transform definition',
          },
          {
            latex: "\\mathcal{L}\\{f'(t)\\} = sF(s) - f(0)",
            description: 'Transform of derivative',
          },
          {
            latex: '\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s-a}',
            description: 'Exponential transform',
          },
        ],
        examples: [
          {
            problem: "Solve y' + 2y = 0, y(0) = 3 using Laplace transform.",
            solution: 'sY - 3 + 2Y = 0\nY(s+2) = 3\nY = 3/(s+2)\ny(t) = 3e^(-2t)',
            difficulty: 4,
          },
        ],
        applications: [
          { field: 'Control Engineering', description: 'Transfer function analysis' },
          { field: 'Electronics', description: 'Circuit analysis' },
          { field: 'Mechanical Engineering', description: 'Vibration analysis' },
        ],
      },
    },
    relations: {
      prerequisites: ['integral', 'differential-equations'],
      nextTopics: ['z-transform'],
      related: ['fourier-transform'],
    },
    tags: ['라플라스', '변환', 'Laplace', 'transform'],
  },
  {
    id: 'gradient-descent',
    name: {
      ko: '경사하강법',
      en: 'Gradient Descent',
      ja: '勾配降下法',
    },
    field: 'applied',
    subfield: 'optimization',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '함수의 최솟값을 찾기 위해 기울기(그래디언트)의 반대 방향으로 반복적으로 이동하는 최적화 알고리즘입니다.',
        formulas: [
          {
            latex: 'x_{n+1} = x_n - \\alpha \\nabla f(x_n)',
            description: '경사하강법 업데이트 규칙',
          },
          {
            latex: '\\alpha',
            description: '학습률 (step size)',
          },
        ],
        examples: [
          {
            problem: 'f(x) = x²를 경사하강법으로 최소화하시오 (x₀=5, α=0.1).',
            solution: "f'(x) = 2x\nx₁ = 5 - 0.1(10) = 4\nx₂ = 4 - 0.1(8) = 3.2\n... (0으로 수렴)",
            difficulty: 3,
          },
        ],
        applications: [
          { field: '머신러닝', description: '신경망 학습' },
          { field: '통계학', description: '최대우도추정' },
          { field: '경제학', description: '비용 최소화' },
        ],
      },
      en: {
        definition:
          'An optimization algorithm that iteratively moves in the opposite direction of the gradient to find the minimum.',
        formulas: [
          {
            latex: 'x_{n+1} = x_n - \\alpha \\nabla f(x_n)',
            description: 'Gradient descent update rule',
          },
          {
            latex: '\\alpha',
            description: 'Learning rate (step size)',
          },
        ],
        examples: [
          {
            problem: 'Minimize f(x) = x² using gradient descent (x₀=5, α=0.1).',
            solution:
              "f'(x) = 2x\nx₁ = 5 - 0.1(10) = 4\nx₂ = 4 - 0.1(8) = 3.2\n... (converges to 0)",
            difficulty: 3,
          },
        ],
        applications: [
          { field: 'Machine Learning', description: 'Neural network training' },
          { field: 'Statistics', description: 'Maximum likelihood estimation' },
          { field: 'Economics', description: 'Cost minimization' },
        ],
      },
    },
    relations: {
      prerequisites: ['partial-derivative', 'vectors-basics'],
      nextTopics: ['stochastic-gradient-descent', 'adam-optimizer'],
      related: ['newton-method'],
    },
    tags: ['경사하강법', '최적화', 'gradient descent', 'optimization'],
  },
  {
    id: 'newton-method',
    name: {
      ko: '뉴턴-랩슨 방법',
      en: 'Newton-Raphson Method',
      ja: 'ニュートン法',
    },
    field: 'applied',
    subfield: 'numerical',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '방정식의 근을 반복적으로 근사하는 수치적 방법입니다. 접선을 이용해 더 나은 근사값을 찾습니다.',
        formulas: [
          {
            latex: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",
            description: '뉴턴-랩슨 반복 공식',
          },
        ],
        examples: [
          {
            problem: '√2를 뉴턴법으로 구하시오 (x₀=1).',
            solution:
              "f(x) = x² - 2, f'(x) = 2x\nx₁ = 1 - (-1/2) = 1.5\nx₂ = 1.5 - 0.25/3 = 1.4167\nx₃ ≈ 1.4142...",
            difficulty: 3,
          },
        ],
        history: {
          discoveredBy: '아이작 뉴턴, 조지프 랩슨',
          year: '17세기',
          background: '뉴턴이 다항식의 근을 구하기 위해 개발했습니다.',
        },
        applications: [
          { field: '수치해석', description: '방정식의 근 찾기' },
          { field: '최적화', description: '함수 최적화' },
          { field: '컴퓨터 그래픽', description: '광선 추적' },
        ],
      },
      en: {
        definition:
          'A numerical method to iteratively approximate roots of equations using tangent lines.',
        formulas: [
          {
            latex: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",
            description: 'Newton-Raphson iteration formula',
          },
        ],
        examples: [
          {
            problem: "Find √2 using Newton's method (x₀=1).",
            solution:
              "f(x) = x² - 2, f'(x) = 2x\nx₁ = 1 - (-1/2) = 1.5\nx₂ = 1.5 - 0.25/3 = 1.4167\nx₃ ≈ 1.4142...",
            difficulty: 3,
          },
        ],
        history: {
          discoveredBy: 'Isaac Newton, Joseph Raphson',
          year: '17th century',
          background: 'Newton developed it to find roots of polynomials.',
        },
        applications: [
          { field: 'Numerical Analysis', description: 'Root finding' },
          { field: 'Optimization', description: 'Function optimization' },
          { field: 'Computer Graphics', description: 'Ray tracing' },
        ],
      },
    },
    relations: {
      prerequisites: ['derivative', 'limit'],
      nextTopics: ['secant-method'],
      related: ['bisection-method'],
    },
    tags: ['뉴턴법', '수치해석', 'Newton', 'numerical'],
  },
  {
    id: 'linear-programming',
    name: {
      ko: '선형계획법',
      en: 'Linear Programming',
      ja: '線形計画法',
    },
    field: 'applied',
    subfield: 'optimization',
    difficulty: 4,
    content: {
      ko: {
        definition: '선형 제약조건 하에서 선형 목적함수를 최적화하는 수학적 방법입니다.',
        formulas: [
          {
            latex: '\\max/\\min \\quad c^T x',
            description: '목적함수',
          },
          {
            latex: 'Ax \\leq b, \\quad x \\geq 0',
            description: '제약조건',
          },
        ],
        examples: [
          {
            problem: 'max 3x + 2y, subject to x + y ≤ 4, x ≤ 2, x, y ≥ 0',
            solution:
              '꼭짓점: (0,0), (2,0), (2,2), (0,4)\n목적함수값: 0, 6, 10, 8\n최적해: (2,2), 최댓값: 10',
            difficulty: 3,
          },
        ],
        history: {
          discoveredBy: '조지 단치그',
          year: '1947년',
          background: '단치그가 심플렉스 알고리즘을 개발했습니다.',
        },
        applications: [
          { field: '물류', description: '수송 문제, 배치 최적화' },
          { field: '생산', description: '자원 배분' },
          { field: '금융', description: '포트폴리오 최적화' },
        ],
      },
      en: {
        definition:
          'A mathematical method to optimize a linear objective function subject to linear constraints.',
        formulas: [
          {
            latex: '\\max/\\min \\quad c^T x',
            description: 'Objective function',
          },
          {
            latex: 'Ax \\leq b, \\quad x \\geq 0',
            description: 'Constraints',
          },
        ],
        examples: [
          {
            problem: 'max 3x + 2y, subject to x + y ≤ 4, x ≤ 2, x, y ≥ 0',
            solution:
              'Vertices: (0,0), (2,0), (2,2), (0,4)\nObjective values: 0, 6, 10, 8\nOptimal: (2,2), max = 10',
            difficulty: 3,
          },
        ],
        history: {
          discoveredBy: 'George Dantzig',
          year: '1947',
          background: 'Dantzig developed the simplex algorithm.',
        },
        applications: [
          { field: 'Logistics', description: 'Transportation, allocation' },
          { field: 'Manufacturing', description: 'Resource allocation' },
          { field: 'Finance', description: 'Portfolio optimization' },
        ],
      },
    },
    relations: {
      prerequisites: ['linear-equation', 'inequality'],
      nextTopics: ['integer-programming'],
      related: ['simplex-method'],
    },
    tags: ['선형계획', '최적화', 'linear programming', 'optimization'],
  },
];
