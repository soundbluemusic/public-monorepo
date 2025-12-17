/**
 * @fileoverview 응용수학 개념 데이터
 */
import type { MathConcept } from "../types";

export const appliedConcepts: MathConcept[] = [
  {
    id: "fourier-series",
    name: {
      ko: "푸리에 급수",
      en: "Fourier Series",
      ja: "フーリエ級数",
    },
    field: "applied",
    subfield: "fourier-analysis",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "푸리에 급수는 주기 함수를 사인과 코사인의 무한 급수로 표현하는 방법입니다. 모든 주기 함수는 진동 성분으로 분해될 수 있습니다.",
        formulas: [
          {
            latex: "f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} (a_n \\cos nx + b_n \\sin nx)",
            description: "푸리에 급수",
          },
          {
            latex: "a_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\cos(nx) dx",
            description: "푸리에 계수 (코사인)",
          },
          {
            latex: "b_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\sin(nx) dx",
            description: "푸리에 계수 (사인)",
          },
        ],
        examples: [
          {
            problem: "f(x) = x (-π < x < π)의 푸리에 급수를 구하세요.",
            solution:
              "a_n = 0 (기함수), b_n = 2(-1)^(n+1)/n. f(x) = 2(sin x - sin 2x/2 + sin 3x/3 - ...)",
          },
        ],
        history: {
          discoveredBy: "조제프 푸리에",
          year: "1822년",
          background:
            "푸리에가 열전도 방정식을 풀기 위해 개발했습니다.",
        },
        applications: [
          { field: "신호 처리", description: "주파수 분석" },
          { field: "음향학", description: "음파 분석, 음성 인식" },
          { field: "이미지 처리", description: "JPEG 압축" },
        ],
      },
      en: {
        definition:
          "Fourier series represents periodic functions as infinite sums of sines and cosines. Any periodic function can be decomposed into oscillatory components.",
        formulas: [
          {
            latex: "f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} (a_n \\cos nx + b_n \\sin nx)",
            description: "Fourier series",
          },
          {
            latex: "a_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\cos(nx) dx",
            description: "Fourier coefficient (cosine)",
          },
          {
            latex: "b_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\sin(nx) dx",
            description: "Fourier coefficient (sine)",
          },
        ],
        examples: [
          {
            problem: "Find the Fourier series of f(x) = x for -π < x < π.",
            solution:
              "a_n = 0 (odd function), b_n = 2(-1)^(n+1)/n. f(x) = 2(sin x - sin 2x/2 + sin 3x/3 - ...)",
          },
        ],
        history: {
          discoveredBy: "Joseph Fourier",
          year: "1822",
          background:
            "Fourier developed this to solve the heat equation.",
        },
        applications: [
          { field: "Signal Processing", description: "Frequency analysis" },
          { field: "Acoustics", description: "Sound analysis, speech recognition" },
          { field: "Image Processing", description: "JPEG compression" },
        ],
      },
    },
    relations: {
      prerequisites: ["integral", "trigonometry"],
      nextTopics: ["fourier-transform", "discrete-fourier"],
      related: ["harmonic-analysis"],
    },
    tags: ["푸리에", "급수", "Fourier", "series"],
  },
  {
    id: "differential-equations",
    name: {
      ko: "미분방정식",
      en: "Differential Equations",
      ja: "微分方程式",
    },
    field: "applied",
    subfield: "differential-eq",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "미분방정식은 미지 함수와 그 도함수들 사이의 관계를 나타내는 방정식입니다. 물리 현상을 모델링하는 기본 도구입니다.",
        formulas: [
          {
            latex: "\\frac{dy}{dx} = f(x, y)",
            description: "1계 미분방정식",
          },
          {
            latex: "\\frac{d^2y}{dx^2} + p\\frac{dy}{dx} + qy = 0",
            description: "2계 선형 제차 미분방정식",
          },
          {
            latex: "y = Ce^{rx}",
            description: "지수형 해의 형태",
          },
        ],
        examples: [
          {
            problem: "dy/dx = 2y를 푸세요.",
            solution:
              "변수분리: dy/y = 2dx, ln|y| = 2x + C, y = Ae^(2x)",
          },
          {
            problem: "y'' + y = 0을 푸세요.",
            solution:
              "특성방정식: r² + 1 = 0, r = ±i. 일반해: y = c₁cos x + c₂sin x",
          },
        ],
        applications: [
          { field: "물리학", description: "뉴턴 역학, 전자기학" },
          { field: "생물학", description: "개체군 성장, 감염병 모델" },
          { field: "경제학", description: "성장 모델" },
        ],
      },
      en: {
        definition:
          "A differential equation relates an unknown function to its derivatives. It's a fundamental tool for modeling physical phenomena.",
        formulas: [
          {
            latex: "\\frac{dy}{dx} = f(x, y)",
            description: "First-order differential equation",
          },
          {
            latex: "\\frac{d^2y}{dx^2} + p\\frac{dy}{dx} + qy = 0",
            description: "Second-order linear homogeneous",
          },
          {
            latex: "y = Ce^{rx}",
            description: "Exponential solution form",
          },
        ],
        examples: [
          {
            problem: "Solve dy/dx = 2y.",
            solution:
              "Separation: dy/y = 2dx, ln|y| = 2x + C, y = Ae^(2x)",
          },
          {
            problem: "Solve y'' + y = 0.",
            solution:
              "Characteristic: r² + 1 = 0, r = ±i. General: y = c₁cos x + c₂sin x",
          },
        ],
        applications: [
          { field: "Physics", description: "Newtonian mechanics, electromagnetism" },
          { field: "Biology", description: "Population growth, epidemiology" },
          { field: "Economics", description: "Growth models" },
        ],
      },
    },
    relations: {
      prerequisites: ["derivative", "integral"],
      nextTopics: ["partial-de", "numerical-ode"],
      related: ["dynamical-systems"],
    },
    tags: ["미분방정식", "ODE", "differential equation"],
  },
  {
    id: "complex-analysis-basics",
    name: {
      ko: "복소해석학 기초",
      en: "Complex Analysis Basics",
      ja: "複素解析の基礎",
    },
    field: "applied",
    subfield: "complex-analysis",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "복소해석학은 복소수 함수의 미적분을 다룹니다. 해석함수는 미분 가능하고 아름다운 성질을 가집니다.",
        formulas: [
          {
            latex: "e^{i\\theta} = \\cos\\theta + i\\sin\\theta",
            description: "오일러 공식",
          },
          {
            latex: "\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}, \\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}",
            description: "코시-리만 방정식",
          },
          {
            latex: "\\oint_C f(z) dz = 0",
            description: "코시 적분 정리 (단순 연결)",
          },
        ],
        examples: [
          {
            problem: "오일러 공식으로 e^(iπ)를 계산하세요.",
            solution:
              "e^(iπ) = cos π + i sin π = -1 + 0i = -1",
          },
        ],
        history: {
          discoveredBy: "레온하르트 오일러, 오귀스탱 루이 코시",
          year: "18-19세기",
          background:
            "오일러가 공식을 발견했고, 코시가 복소함수 이론을 체계화했습니다.",
        },
        applications: [
          { field: "전자공학", description: "교류 회로 분석" },
          { field: "유체역학", description: "2D 유동" },
          { field: "양자역학", description: "파동함수" },
        ],
      },
      en: {
        definition:
          "Complex analysis studies calculus of complex-valued functions. Analytic functions are differentiable and have beautiful properties.",
        formulas: [
          {
            latex: "e^{i\\theta} = \\cos\\theta + i\\sin\\theta",
            description: "Euler's formula",
          },
          {
            latex: "\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}, \\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}",
            description: "Cauchy-Riemann equations",
          },
          {
            latex: "\\oint_C f(z) dz = 0",
            description: "Cauchy's integral theorem (simply connected)",
          },
        ],
        examples: [
          {
            problem: "Calculate e^(iπ) using Euler's formula.",
            solution:
              "e^(iπ) = cos π + i sin π = -1 + 0i = -1",
          },
        ],
        history: {
          discoveredBy: "Leonhard Euler, Augustin-Louis Cauchy",
          year: "18th-19th century",
          background:
            "Euler discovered the formula; Cauchy systematized complex function theory.",
        },
        applications: [
          { field: "Electrical Engineering", description: "AC circuit analysis" },
          { field: "Fluid Dynamics", description: "2D flow" },
          { field: "Quantum Mechanics", description: "Wave functions" },
        ],
      },
    },
    relations: {
      prerequisites: ["complex-numbers", "derivative", "integral"],
      nextTopics: ["residue-calculus", "conformal-mapping"],
      related: ["fourier-transform"],
    },
    tags: ["복소해석", "오일러", "complex analysis", "Euler"],
  },
  {
    id: "game-theory",
    name: {
      ko: "게임 이론",
      en: "Game Theory",
      ja: "ゲーム理論",
    },
    field: "applied",
    subfield: "game-theory",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "게임 이론은 전략적 상호작용을 수학적으로 분석합니다. 플레이어들이 합리적으로 행동할 때의 결과를 예측합니다.",
        formulas: [
          {
            latex: "u_i(s^*_i, s^*_{-i}) \\geq u_i(s_i, s^*_{-i})",
            description: "내쉬 균형 조건",
          },
        ],
        examples: [
          {
            problem: "죄수의 딜레마에서 내쉬 균형을 찾으세요.",
            solution:
              "두 죄수가 모두 배신하는 것이 내쉬 균형입니다. 어느 쪽도 일방적으로 전략을 바꿔 이득을 볼 수 없습니다.",
          },
        ],
        history: {
          discoveredBy: "존 폰 노이만, 존 내쉬",
          year: "1928년, 1950년",
          background:
            "폰 노이만이 기초를 세웠고, 내쉬가 균형 개념을 일반화했습니다.",
        },
        applications: [
          { field: "경제학", description: "시장 경쟁, 경매" },
          { field: "정치학", description: "투표, 협상" },
          { field: "생물학", description: "진화적 안정 전략" },
        ],
      },
      en: {
        definition:
          "Game theory mathematically analyzes strategic interactions. It predicts outcomes when players act rationally.",
        formulas: [
          {
            latex: "u_i(s^*_i, s^*_{-i}) \\geq u_i(s_i, s^*_{-i})",
            description: "Nash equilibrium condition",
          },
        ],
        examples: [
          {
            problem: "Find the Nash equilibrium in the Prisoner's Dilemma.",
            solution:
              "Both prisoners defecting is the Nash equilibrium. Neither can improve by unilaterally changing strategy.",
          },
        ],
        history: {
          discoveredBy: "John von Neumann, John Nash",
          year: "1928, 1950",
          background:
            "Von Neumann laid foundations; Nash generalized the equilibrium concept.",
        },
        applications: [
          { field: "Economics", description: "Market competition, auctions" },
          { field: "Political Science", description: "Voting, negotiation" },
          { field: "Biology", description: "Evolutionarily stable strategies" },
        ],
      },
    },
    relations: {
      prerequisites: ["probability-basics", "optimization-basics"],
      nextTopics: ["mechanism-design", "cooperative-games"],
      related: ["decision-theory"],
    },
    tags: ["게임이론", "내쉬균형", "game theory", "Nash equilibrium"],
  },
  {
    id: "cryptography-math",
    name: {
      ko: "암호학의 수학",
      en: "Mathematics of Cryptography",
      ja: "暗号の数学",
    },
    field: "applied",
    subfield: "cryptography",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "암호학은 정보를 안전하게 통신하기 위한 수학적 기법입니다. 수론, 대수학, 복잡도 이론에 기반합니다.",
        formulas: [
          {
            latex: "c = m^e \\mod n, \\quad m = c^d \\mod n",
            description: "RSA 암호화/복호화",
          },
          {
            latex: "ed \\equiv 1 \\pmod{\\phi(n)}",
            description: "RSA 키 관계",
          },
        ],
        examples: [
          {
            problem: "p=3, q=11, e=3일 때 RSA로 m=5를 암호화하세요.",
            solution:
              "n = 33, c = 5³ mod 33 = 125 mod 33 = 26",
          },
        ],
        applications: [
          { field: "인터넷 보안", description: "HTTPS, TLS" },
          { field: "전자상거래", description: "결제 보안" },
          { field: "블록체인", description: "디지털 서명" },
        ],
      },
      en: {
        definition:
          "Cryptography uses mathematical techniques for secure communication. It's based on number theory, algebra, and complexity theory.",
        formulas: [
          {
            latex: "c = m^e \\mod n, \\quad m = c^d \\mod n",
            description: "RSA encryption/decryption",
          },
          {
            latex: "ed \\equiv 1 \\pmod{\\phi(n)}",
            description: "RSA key relationship",
          },
        ],
        examples: [
          {
            problem: "Encrypt m=5 using RSA with p=3, q=11, e=3.",
            solution:
              "n = 33, c = 5³ mod 33 = 125 mod 33 = 26",
          },
        ],
        applications: [
          { field: "Internet Security", description: "HTTPS, TLS" },
          { field: "E-commerce", description: "Payment security" },
          { field: "Blockchain", description: "Digital signatures" },
        ],
      },
    },
    relations: {
      prerequisites: ["modular-arithmetic", "prime-numbers", "fermats-little-theorem"],
      nextTopics: ["elliptic-curve-crypto", "quantum-crypto"],
      related: ["number-theory"],
    },
    tags: ["암호학", "RSA", "cryptography", "security"],
  },

  // ===== 15.4 고급 응용수학 =====
  {
    id: "laplace-transform",
    name: {
      ko: "라플라스 변환",
      en: "Laplace Transform",
      ja: "ラプラス変換",
    },
    field: "applied",
    subfield: "transforms",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "라플라스 변환은 미분방정식을 대수방정식으로 변환하여 푸는 적분 변환입니다. 제어 이론과 신호 처리에 필수적입니다.",
        formulas: [
          {
            latex: "\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^{\\infty} f(t) e^{-st} dt",
            description: "라플라스 변환 정의",
          },
          {
            latex: "\\mathcal{L}\\{f'(t)\\} = sF(s) - f(0)",
            description: "미분의 라플라스 변환",
          },
          {
            latex: "\\mathcal{L}^{-1}\\{F(s)\\} = f(t)",
            description: "역라플라스 변환",
          },
        ],
        examples: [
          {
            problem: "y' + 2y = e^(-t), y(0) = 1을 라플라스 변환으로 푸세요.",
            solution:
              "L{y} = Y. sY - 1 + 2Y = 1/(s+1). Y = (s+2)/((s+1)(s+2)) = 1/(s+1). y(t) = e^(-t)",
          },
        ],
        history: {
          discoveredBy: "피에르시몽 라플라스",
          year: "1785년",
          background:
            "확률론 연구에서 처음 도입되었습니다.",
        },
        applications: [
          { field: "제어 이론", description: "전달함수 분석" },
          { field: "전기공학", description: "회로 분석" },
          { field: "기계공학", description: "진동 분석" },
        ],
      },
      en: {
        definition:
          "Laplace transform converts differential equations to algebraic equations. Essential in control theory and signal processing.",
        formulas: [
          {
            latex: "\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^{\\infty} f(t) e^{-st} dt",
            description: "Laplace transform definition",
          },
          {
            latex: "\\mathcal{L}\\{f'(t)\\} = sF(s) - f(0)",
            description: "Laplace transform of derivative",
          },
          {
            latex: "\\mathcal{L}^{-1}\\{F(s)\\} = f(t)",
            description: "Inverse Laplace transform",
          },
        ],
        examples: [
          {
            problem: "Solve y' + 2y = e^(-t), y(0) = 1 using Laplace transform.",
            solution:
              "L{y} = Y. sY - 1 + 2Y = 1/(s+1). Y = (s+2)/((s+1)(s+2)) = 1/(s+1). y(t) = e^(-t)",
          },
        ],
        history: {
          discoveredBy: "Pierre-Simon Laplace",
          year: "1785",
          background:
            "First introduced in probability theory research.",
        },
        applications: [
          { field: "Control Theory", description: "Transfer function analysis" },
          { field: "Electrical Engineering", description: "Circuit analysis" },
          { field: "Mechanical Engineering", description: "Vibration analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["integral", "complex-numbers"],
      nextTopics: ["transfer-function", "z-transform"],
      related: ["fourier-transform"],
    },
    tags: ["라플라스", "변환", "Laplace", "transform"],
  },
  {
    id: "information-theory",
    name: {
      ko: "정보 이론",
      en: "Information Theory",
      ja: "情報理論",
    },
    field: "applied",
    subfield: "information",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "정보 이론은 정보의 정량화, 저장, 전송을 다룹니다. 엔트로피는 불확실성의 측도이며 데이터 압축의 이론적 한계를 결정합니다.",
        formulas: [
          {
            latex: "H(X) = -\\sum_{i} p_i \\log_2 p_i",
            description: "샤논 엔트로피",
          },
          {
            latex: "I(X;Y) = H(X) - H(X|Y)",
            description: "상호 정보량",
          },
          {
            latex: "C = \\max_{p(x)} I(X;Y)",
            description: "채널 용량",
          },
        ],
        examples: [
          {
            problem: "공정한 동전의 엔트로피를 계산하세요.",
            solution:
              "H = -(0.5 log₂ 0.5 + 0.5 log₂ 0.5) = -(-0.5 - 0.5) = 1 비트",
          },
        ],
        history: {
          discoveredBy: "클로드 섀넌",
          year: "1948년",
          background:
            "섀넌이 '통신의 수학적 이론'에서 정보 이론을 창시했습니다.",
        },
        applications: [
          { field: "통신", description: "데이터 압축, 오류 수정" },
          { field: "기계학습", description: "결정 트리, 특징 선택" },
          { field: "암호학", description: "완전 비밀" },
        ],
      },
      en: {
        definition:
          "Information theory quantifies, stores, and transmits information. Entropy measures uncertainty and determines theoretical limits of data compression.",
        formulas: [
          {
            latex: "H(X) = -\\sum_{i} p_i \\log_2 p_i",
            description: "Shannon entropy",
          },
          {
            latex: "I(X;Y) = H(X) - H(X|Y)",
            description: "Mutual information",
          },
          {
            latex: "C = \\max_{p(x)} I(X;Y)",
            description: "Channel capacity",
          },
        ],
        examples: [
          {
            problem: "Calculate entropy of a fair coin.",
            solution:
              "H = -(0.5 log₂ 0.5 + 0.5 log₂ 0.5) = -(-0.5 - 0.5) = 1 bit",
          },
        ],
        history: {
          discoveredBy: "Claude Shannon",
          year: "1948",
          background:
            "Shannon founded information theory in 'A Mathematical Theory of Communication'.",
        },
        applications: [
          { field: "Communications", description: "Data compression, error correction" },
          { field: "Machine Learning", description: "Decision trees, feature selection" },
          { field: "Cryptography", description: "Perfect secrecy" },
        ],
      },
    },
    relations: {
      prerequisites: ["probability-basics", "logarithm"],
      nextTopics: ["coding-theory", "channel-coding"],
      related: ["entropy"],
    },
    tags: ["정보이론", "엔트로피", "information", "entropy"],
  },
  {
    id: "machine-learning-math",
    name: {
      ko: "기계학습의 수학",
      en: "Mathematics of Machine Learning",
      ja: "機械学習の数学",
    },
    field: "applied",
    subfield: "machine-learning",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "기계학습은 데이터에서 패턴을 학습하는 알고리즘입니다. 선형대수, 확률, 최적화, 미적분학이 핵심 수학적 기반입니다.",
        formulas: [
          {
            latex: "\\hat{y} = \\sigma(w^T x + b)",
            description: "로지스틱 회귀",
          },
          {
            latex: "\\mathcal{L} = -\\sum_i [y_i \\log \\hat{y}_i + (1-y_i) \\log(1-\\hat{y}_i)]",
            description: "교차 엔트로피 손실",
          },
          {
            latex: "w := w - \\alpha \\nabla_w \\mathcal{L}",
            description: "경사 하강법 업데이트",
          },
        ],
        examples: [
          {
            problem: "편향-분산 트레이드오프를 설명하세요.",
            solution:
              "오차 = 편향² + 분산 + 노이즈. 단순 모델: 높은 편향, 낮은 분산. 복잡 모델: 낮은 편향, 높은 분산. 적절한 복잡도 필요.",
          },
        ],
        applications: [
          { field: "컴퓨터 비전", description: "이미지 분류, 객체 탐지" },
          { field: "자연어 처리", description: "번역, 감성 분석" },
          { field: "추천 시스템", description: "개인화 추천" },
        ],
      },
      en: {
        definition:
          "Machine learning algorithms learn patterns from data. Linear algebra, probability, optimization, and calculus are core mathematical foundations.",
        formulas: [
          {
            latex: "\\hat{y} = \\sigma(w^T x + b)",
            description: "Logistic regression",
          },
          {
            latex: "\\mathcal{L} = -\\sum_i [y_i \\log \\hat{y}_i + (1-y_i) \\log(1-\\hat{y}_i)]",
            description: "Cross-entropy loss",
          },
          {
            latex: "w := w - \\alpha \\nabla_w \\mathcal{L}",
            description: "Gradient descent update",
          },
        ],
        examples: [
          {
            problem: "Explain the bias-variance tradeoff.",
            solution:
              "Error = Bias² + Variance + Noise. Simple models: high bias, low variance. Complex models: low bias, high variance. Need appropriate complexity.",
          },
        ],
        applications: [
          { field: "Computer Vision", description: "Image classification, object detection" },
          { field: "NLP", description: "Translation, sentiment analysis" },
          { field: "Recommender Systems", description: "Personalized recommendations" },
        ],
      },
    },
    relations: {
      prerequisites: ["linear-algebra", "probability-basics", "gradient-descent"],
      nextTopics: ["neural-networks", "deep-learning"],
      related: ["statistics"],
    },
    tags: ["기계학습", "딥러닝", "machine learning", "deep learning"],
  },
  {
    id: "signal-processing",
    name: {
      ko: "신호 처리",
      en: "Signal Processing",
      ja: "信号処理",
    },
    field: "applied",
    subfield: "signal",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "신호 처리는 신호를 분석, 변형, 합성하는 수학적 방법입니다. 필터링, 샘플링, 압축 등을 다룹니다.",
        formulas: [
          {
            latex: "(f * g)(t) = \\int_{-\\infty}^{\\infty} f(\\tau) g(t - \\tau) d\\tau",
            description: "컨볼루션",
          },
          {
            latex: "f_s > 2 f_{\\max}",
            description: "나이퀴스트 샘플링 정리",
          },
        ],
        examples: [
          {
            problem: "앨리어싱 현상을 설명하세요.",
            solution:
              "샘플링 주파수가 신호 주파수의 2배 미만이면 고주파가 저주파로 잘못 나타납니다. 나이퀴스트 정리 위반 결과.",
          },
        ],
        applications: [
          { field: "오디오", description: "음성 압축, 이퀄라이저" },
          { field: "이미지", description: "필터, 압축" },
          { field: "통신", description: "변조, 복조" },
        ],
      },
      en: {
        definition:
          "Signal processing analyzes, modifies, and synthesizes signals. Includes filtering, sampling, and compression.",
        formulas: [
          {
            latex: "(f * g)(t) = \\int_{-\\infty}^{\\infty} f(\\tau) g(t - \\tau) d\\tau",
            description: "Convolution",
          },
          {
            latex: "f_s > 2 f_{\\max}",
            description: "Nyquist sampling theorem",
          },
        ],
        examples: [
          {
            problem: "Explain aliasing.",
            solution:
              "When sampling frequency is less than twice the signal frequency, high frequencies appear as low frequencies. Result of violating Nyquist theorem.",
          },
        ],
        applications: [
          { field: "Audio", description: "Voice compression, equalizers" },
          { field: "Image", description: "Filters, compression" },
          { field: "Communications", description: "Modulation, demodulation" },
        ],
      },
    },
    relations: {
      prerequisites: ["fourier-series", "complex-analysis-basics"],
      nextTopics: ["fft", "digital-filters"],
      related: ["convolution"],
    },
    tags: ["신호처리", "필터링", "signal processing", "filter"],
  },
  {
    id: "graph-theory-applied",
    name: {
      ko: "그래프 이론 응용",
      en: "Applied Graph Theory",
      ja: "応用グラフ理論",
    },
    field: "applied",
    subfield: "networks",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "그래프 이론은 정점과 간선으로 이루어진 구조를 연구합니다. 네트워크, 최단 경로, 연결성 문제에 적용됩니다.",
        formulas: [
          {
            latex: "\\sum_{v \\in V} \\deg(v) = 2|E|",
            description: "차수 합 정리",
          },
          {
            latex: "d(u, v) = \\min \\text{ path length}",
            description: "최단 거리",
          },
        ],
        examples: [
          {
            problem: "쾨니히스베르크 다리 문제를 설명하세요.",
            solution:
              "7개 다리를 모두 한 번씩만 건너는 경로가 있는가? 오일러: 홀수 차수 정점이 3개 이상이면 불가능. 이 그래프는 홀수 차수 4개 → 불가능.",
          },
        ],
        history: {
          discoveredBy: "레온하르트 오일러",
          year: "1736년",
          background:
            "오일러가 쾨니히스베르크 다리 문제를 풀면서 그래프 이론을 창시했습니다.",
        },
        applications: [
          { field: "소셜 네트워크", description: "영향력 분석, 커뮤니티 탐지" },
          { field: "물류", description: "최단 경로, TSP" },
          { field: "컴퓨터 네트워크", description: "라우팅, 토폴로지" },
        ],
      },
      en: {
        definition:
          "Graph theory studies structures of vertices and edges. Applied to networks, shortest paths, and connectivity problems.",
        formulas: [
          {
            latex: "\\sum_{v \\in V} \\deg(v) = 2|E|",
            description: "Handshaking lemma",
          },
          {
            latex: "d(u, v) = \\min \\text{ path length}",
            description: "Shortest distance",
          },
        ],
        examples: [
          {
            problem: "Explain the Königsberg bridge problem.",
            solution:
              "Can you cross all 7 bridges exactly once? Euler: impossible if more than 2 odd-degree vertices. This graph has 4 odd-degree → impossible.",
          },
        ],
        history: {
          discoveredBy: "Leonhard Euler",
          year: "1736",
          background:
            "Euler founded graph theory by solving the Königsberg bridge problem.",
        },
        applications: [
          { field: "Social Networks", description: "Influence analysis, community detection" },
          { field: "Logistics", description: "Shortest paths, TSP" },
          { field: "Computer Networks", description: "Routing, topology" },
        ],
      },
    },
    relations: {
      prerequisites: ["sets", "combinatorics"],
      nextTopics: ["network-flow", "graph-algorithms"],
      related: ["euler-characteristic"],
    },
    tags: ["그래프", "네트워크", "graph theory", "networks"],
  },
];
