/**
 * @fileoverview 수학 상수 데이터
 */
import type { MathConcept } from "../types";

export const constantsConcepts: MathConcept[] = [
  {
    id: "pi-constant",
    name: {
      ko: "원주율 π",
      en: "Pi (π)",
      ja: "円周率 π",
    },
    field: "constants",
    subfield: "fundamental",
    difficulty: 1,
    content: {
      ko: {
        definition:
          "π(파이)는 원의 지름에 대한 둘레의 비율입니다. 무리수이며 초월수입니다. 수학에서 가장 중요한 상수 중 하나입니다.",
        formulas: [
          {
            latex: "\\pi = \\frac{C}{d} \\approx 3.14159265358979...",
            description: "원주율의 정의",
          },
          {
            latex: "A = \\pi r^2",
            description: "원의 넓이",
          },
          {
            latex: "e^{i\\pi} + 1 = 0",
            description: "오일러 등식",
          },
          {
            latex: "\\frac{\\pi}{4} = 1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + ...",
            description: "라이프니츠 급수",
          },
        ],
        examples: [
          {
            problem: "반지름이 5인 원의 넓이와 둘레를 구하세요.",
            solution: "넓이 = π × 5² = 25π ≈ 78.54, 둘레 = 2π × 5 = 10π ≈ 31.42",
          },
        ],
        history: {
          discoveredBy: "고대 문명 (이집트, 바빌로니아)",
          year: "기원전 2000년경",
          background:
            "고대부터 근사값이 알려졌으며, 아르키메데스가 체계적으로 계산했습니다.",
        },
        applications: [
          { field: "기하학", description: "원, 구, 원기둥 계산" },
          { field: "물리학", description: "파동, 진동, 회전" },
          { field: "통계학", description: "정규분포" },
        ],
      },
      en: {
        definition:
          "π (pi) is the ratio of a circle's circumference to its diameter. It's irrational and transcendental, one of mathematics' most important constants.",
        formulas: [
          {
            latex: "\\pi = \\frac{C}{d} \\approx 3.14159265358979...",
            description: "Definition of pi",
          },
          {
            latex: "A = \\pi r^2",
            description: "Area of a circle",
          },
          {
            latex: "e^{i\\pi} + 1 = 0",
            description: "Euler's identity",
          },
          {
            latex: "\\frac{\\pi}{4} = 1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + ...",
            description: "Leibniz series",
          },
        ],
        examples: [
          {
            problem: "Find the area and circumference of a circle with radius 5.",
            solution: "Area = π × 5² = 25π ≈ 78.54, Circumference = 2π × 5 = 10π ≈ 31.42",
          },
        ],
        history: {
          discoveredBy: "Ancient civilizations (Egypt, Babylon)",
          year: "c. 2000 BCE",
          background:
            "Approximations known since antiquity; Archimedes systematically calculated it.",
        },
        applications: [
          { field: "Geometry", description: "Circles, spheres, cylinders" },
          { field: "Physics", description: "Waves, oscillations, rotation" },
          { field: "Statistics", description: "Normal distribution" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["radians", "circle-area"],
      related: ["e-constant", "euler-identity"],
    },
    tags: ["파이", "원주율", "pi", "constant"],
  },
  {
    id: "e-constant",
    name: {
      ko: "자연상수 e",
      en: "Euler's Number (e)",
      ja: "ネイピア数 e",
    },
    field: "constants",
    subfield: "fundamental",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "e는 자연로그의 밑으로, 연속 복리에서 자연스럽게 나타나는 수입니다. 미적분학에서 핵심적인 역할을 합니다.",
        formulas: [
          {
            latex: "e = \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n \\approx 2.71828...",
            description: "e의 극한 정의",
          },
          {
            latex: "e = \\sum_{n=0}^{\\infty} \\frac{1}{n!} = 1 + 1 + \\frac{1}{2} + \\frac{1}{6} + ...",
            description: "e의 급수 정의",
          },
          {
            latex: "\\frac{d}{dx} e^x = e^x",
            description: "자기 자신이 도함수인 성질",
          },
        ],
        examples: [
          {
            problem: "100원을 연이율 100%로 연속 복리 1년 예치하면?",
            solution: "100 × e¹ ≈ 100 × 2.718 = 271.8원",
          },
        ],
        history: {
          discoveredBy: "레온하르트 오일러",
          year: "1727년",
          background:
            "야코프 베르누이가 복리 문제에서 발견했고, 오일러가 체계화했습니다.",
        },
        applications: [
          { field: "금융", description: "연속 복리, 성장 모델" },
          { field: "물리학", description: "방사성 붕괴, 열역학" },
          { field: "확률론", description: "포아송 분포" },
        ],
      },
      en: {
        definition:
          "e is the base of natural logarithm, appearing naturally in continuous compound interest. It plays a central role in calculus.",
        formulas: [
          {
            latex: "e = \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n \\approx 2.71828...",
            description: "Limit definition of e",
          },
          {
            latex: "e = \\sum_{n=0}^{\\infty} \\frac{1}{n!} = 1 + 1 + \\frac{1}{2} + \\frac{1}{6} + ...",
            description: "Series definition of e",
          },
          {
            latex: "\\frac{d}{dx} e^x = e^x",
            description: "Self-derivative property",
          },
        ],
        examples: [
          {
            problem: "Deposit $100 at 100% annual rate compounded continuously for 1 year.",
            solution: "100 × e¹ ≈ 100 × 2.718 = $271.80",
          },
        ],
        history: {
          discoveredBy: "Leonhard Euler",
          year: "1727",
          background:
            "Jacob Bernoulli found it in compound interest; Euler systematized it.",
        },
        applications: [
          { field: "Finance", description: "Continuous compounding, growth models" },
          { field: "Physics", description: "Radioactive decay, thermodynamics" },
          { field: "Probability", description: "Poisson distribution" },
        ],
      },
    },
    relations: {
      prerequisites: ["limits"],
      nextTopics: ["natural-log", "exponential-function"],
      related: ["pi-constant", "euler-identity"],
    },
    tags: ["자연상수", "오일러", "e", "Euler"],
  },
  {
    id: "golden-ratio",
    name: {
      ko: "황금비 φ",
      en: "Golden Ratio (φ)",
      ja: "黄金比 φ",
    },
    field: "constants",
    subfield: "fundamental",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "황금비 φ(파이)는 전체 대 큰 부분의 비가 큰 부분 대 작은 부분의 비와 같을 때의 비율입니다.",
        formulas: [
          {
            latex: "\\phi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.6180339...",
            description: "황금비의 값",
          },
          {
            latex: "\\phi^2 = \\phi + 1",
            description: "황금비의 성질",
          },
          {
            latex: "\\frac{1}{\\phi} = \\phi - 1",
            description: "황금비의 역수",
          },
          {
            latex: "\\lim_{n \\to \\infty} \\frac{F_{n+1}}{F_n} = \\phi",
            description: "피보나치 수열과의 관계",
          },
        ],
        examples: [
          {
            problem: "1:φ 비율의 직사각형에서 정사각형을 제거하면?",
            solution:
              "남은 직사각형도 1:φ 비율입니다. 이것이 황금 나선을 만듭니다.",
          },
        ],
        history: {
          discoveredBy: "고대 그리스 (피타고라스 학파)",
          year: "기원전 6세기경",
          background:
            "유클리드가 '외중비'로 정의했고, 르네상스 시대에 '황금'이라 불리기 시작했습니다.",
        },
        applications: [
          { field: "예술", description: "구도, 비율" },
          { field: "건축", description: "파르테논 신전" },
          { field: "자연", description: "해바라기, 조개껍질" },
        ],
      },
      en: {
        definition:
          "The golden ratio φ (phi) is when the ratio of whole to larger part equals the ratio of larger to smaller part.",
        formulas: [
          {
            latex: "\\phi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.6180339...",
            description: "Value of golden ratio",
          },
          {
            latex: "\\phi^2 = \\phi + 1",
            description: "Golden ratio property",
          },
          {
            latex: "\\frac{1}{\\phi} = \\phi - 1",
            description: "Reciprocal of golden ratio",
          },
          {
            latex: "\\lim_{n \\to \\infty} \\frac{F_{n+1}}{F_n} = \\phi",
            description: "Relation to Fibonacci",
          },
        ],
        examples: [
          {
            problem: "Remove a square from a 1:φ rectangle. What remains?",
            solution:
              "The remaining rectangle is also 1:φ ratio. This creates the golden spiral.",
          },
        ],
        history: {
          discoveredBy: "Ancient Greeks (Pythagoreans)",
          year: "c. 6th century BCE",
          background:
            "Euclid defined it as 'extreme and mean ratio'; called 'golden' since Renaissance.",
        },
        applications: [
          { field: "Art", description: "Composition, proportions" },
          { field: "Architecture", description: "Parthenon" },
          { field: "Nature", description: "Sunflowers, shells" },
        ],
      },
    },
    relations: {
      prerequisites: ["quadratic-equation"],
      nextTopics: ["fibonacci"],
      related: ["silver-ratio"],
    },
    tags: ["황금비", "피보나치", "golden ratio", "phi"],
  },
  {
    id: "imaginary-unit",
    name: {
      ko: "허수 단위 i",
      en: "Imaginary Unit (i)",
      ja: "虚数単位 i",
    },
    field: "constants",
    subfield: "fundamental",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "i는 i² = -1을 만족하는 허수 단위입니다. 복소수의 기본이 되며, 수학과 공학에서 필수적입니다.",
        formulas: [
          {
            latex: "i = \\sqrt{-1}, \\quad i^2 = -1",
            description: "허수 단위의 정의",
          },
          {
            latex: "i^0 = 1, i^1 = i, i^2 = -1, i^3 = -i, i^4 = 1",
            description: "i의 거듭제곱 주기",
          },
          {
            latex: "z = a + bi",
            description: "복소수의 일반형",
          },
        ],
        examples: [
          {
            problem: "i^100을 계산하세요.",
            solution: "100 = 4 × 25이므로 i^100 = (i^4)^25 = 1^25 = 1",
          },
          {
            problem: "(2 + 3i)(1 - i)를 계산하세요.",
            solution:
              "2 - 2i + 3i - 3i² = 2 + i + 3 = 5 + i",
          },
        ],
        history: {
          discoveredBy: "제롤라모 카르다노",
          year: "1545년",
          background:
            "3차 방정식을 풀면서 도입되었고, 오일러와 가우스가 체계화했습니다.",
        },
        applications: [
          { field: "전기공학", description: "교류 회로, 임피던스" },
          { field: "양자역학", description: "파동함수" },
          { field: "신호 처리", description: "푸리에 변환" },
        ],
      },
      en: {
        definition:
          "i is the imaginary unit satisfying i² = -1. It's fundamental to complex numbers and essential in math and engineering.",
        formulas: [
          {
            latex: "i = \\sqrt{-1}, \\quad i^2 = -1",
            description: "Definition of imaginary unit",
          },
          {
            latex: "i^0 = 1, i^1 = i, i^2 = -1, i^3 = -i, i^4 = 1",
            description: "Powers of i cycle",
          },
          {
            latex: "z = a + bi",
            description: "General form of complex number",
          },
        ],
        examples: [
          {
            problem: "Calculate i^100.",
            solution: "100 = 4 × 25, so i^100 = (i^4)^25 = 1^25 = 1",
          },
          {
            problem: "Calculate (2 + 3i)(1 - i).",
            solution:
              "2 - 2i + 3i - 3i² = 2 + i + 3 = 5 + i",
          },
        ],
        history: {
          discoveredBy: "Gerolamo Cardano",
          year: "1545",
          background:
            "Introduced while solving cubic equations; Euler and Gauss systematized it.",
        },
        applications: [
          { field: "Electrical Engineering", description: "AC circuits, impedance" },
          { field: "Quantum Mechanics", description: "Wave functions" },
          { field: "Signal Processing", description: "Fourier transform" },
        ],
      },
    },
    relations: {
      prerequisites: ["negative-numbers"],
      nextTopics: ["complex-numbers", "complex-plane"],
      related: ["euler-identity"],
    },
    tags: ["허수", "복소수", "imaginary", "complex"],
  },
  {
    id: "euler-mascheroni",
    name: {
      ko: "오일러-마스케로니 상수 γ",
      en: "Euler-Mascheroni Constant (γ)",
      ja: "オイラー・マスケローニ定数 γ",
    },
    field: "constants",
    subfield: "advanced",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "오일러-마스케로니 상수 γ는 조화급수와 자연로그의 차이의 극한입니다. 무리수인지조차 아직 증명되지 않았습니다.",
        formulas: [
          {
            latex: "\\gamma = \\lim_{n \\to \\infty} \\left( \\sum_{k=1}^{n} \\frac{1}{k} - \\ln n \\right) \\approx 0.5772...",
            description: "오일러-마스케로니 상수의 정의",
          },
          {
            latex: "\\gamma = \\int_1^{\\infty} \\left( \\frac{1}{\\lfloor x \\rfloor} - \\frac{1}{x} \\right) dx",
            description: "적분 표현",
          },
        ],
        examples: [
          {
            problem: "조화급수 H_100과 ln(100)의 차이를 추정하세요.",
            solution:
              "H_100 ≈ 5.187, ln(100) ≈ 4.605. 차이 ≈ 0.582 ≈ γ",
          },
        ],
        history: {
          discoveredBy: "레온하르트 오일러",
          year: "1735년",
          background:
            "오일러가 조화급수를 연구하면서 발견했습니다.",
        },
        applications: [
          { field: "수론", description: "소수 분포" },
          { field: "해석학", description: "감마 함수" },
          { field: "확률론", description: "극값 분포" },
        ],
      },
      en: {
        definition:
          "The Euler-Mascheroni constant γ is the limit of the difference between harmonic series and natural log. Whether it's irrational is still unknown.",
        formulas: [
          {
            latex: "\\gamma = \\lim_{n \\to \\infty} \\left( \\sum_{k=1}^{n} \\frac{1}{k} - \\ln n \\right) \\approx 0.5772...",
            description: "Definition of Euler-Mascheroni constant",
          },
          {
            latex: "\\gamma = \\int_1^{\\infty} \\left( \\frac{1}{\\lfloor x \\rfloor} - \\frac{1}{x} \\right) dx",
            description: "Integral representation",
          },
        ],
        examples: [
          {
            problem: "Estimate the difference between H_100 and ln(100).",
            solution:
              "H_100 ≈ 5.187, ln(100) ≈ 4.605. Difference ≈ 0.582 ≈ γ",
          },
        ],
        history: {
          discoveredBy: "Leonhard Euler",
          year: "1735",
          background:
            "Euler discovered it while studying the harmonic series.",
        },
        applications: [
          { field: "Number Theory", description: "Prime distribution" },
          { field: "Analysis", description: "Gamma function" },
          { field: "Probability", description: "Extreme value distributions" },
        ],
      },
    },
    relations: {
      prerequisites: ["limits", "harmonic-series"],
      nextTopics: ["gamma-function", "zeta-function"],
      related: ["e-constant"],
    },
    tags: ["오일러", "감마", "Euler-Mascheroni", "constant"],
  },
];
