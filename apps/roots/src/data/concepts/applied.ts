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
];
