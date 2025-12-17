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

  // ===== 16.4 추가 수학 상수 =====
  {
    id: "avogadro-constant",
    name: {
      ko: "아보가드로 수",
      en: "Avogadro's Number",
      ja: "アボガドロ定数",
    },
    field: "constants",
    subfield: "physics",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "아보가드로 수 NA는 1몰에 포함된 입자의 수입니다. 화학에서 물질의 양을 세는 기본 단위입니다.",
        formulas: [
          {
            latex: "N_A = 6.022 \\times 10^{23} \\text{ mol}^{-1}",
            description: "아보가드로 수",
          },
          {
            latex: "n = \\frac{N}{N_A}",
            description: "물질의 양(몰)",
          },
        ],
        examples: [
          {
            problem: "물 1몰에 포함된 분자 수는?",
            solution: "6.022 × 10²³개의 H₂O 분자가 포함되어 있습니다.",
          },
        ],
        history: {
          discoveredBy: "아메데오 아보가드로, 장 페렝",
          year: "1811년 (개념), 1909년 (측정)",
          background:
            "아보가드로가 분자 가설을 제안했고, 페렝이 정확히 측정했습니다.",
        },
        applications: [
          { field: "화학", description: "몰 계산, 화학량론" },
          { field: "물리학", description: "기체 법칙" },
          { field: "재료 과학", description: "원자 개수 계산" },
        ],
      },
      en: {
        definition:
          "Avogadro's number NA is the number of particles in one mole. It's the fundamental unit for counting matter in chemistry.",
        formulas: [
          {
            latex: "N_A = 6.022 \\times 10^{23} \\text{ mol}^{-1}",
            description: "Avogadro's number",
          },
          {
            latex: "n = \\frac{N}{N_A}",
            description: "Amount of substance (moles)",
          },
        ],
        examples: [
          {
            problem: "How many molecules in 1 mole of water?",
            solution: "6.022 × 10²³ H₂O molecules.",
          },
        ],
        history: {
          discoveredBy: "Amedeo Avogadro, Jean Perrin",
          year: "1811 (concept), 1909 (measurement)",
          background:
            "Avogadro proposed the molecular hypothesis; Perrin measured it precisely.",
        },
        applications: [
          { field: "Chemistry", description: "Mole calculations, stoichiometry" },
          { field: "Physics", description: "Gas laws" },
          { field: "Materials Science", description: "Atom counting" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["molar-mass", "ideal-gas-law"],
      related: ["boltzmann-constant"],
    },
    tags: ["아보가드로", "몰", "Avogadro", "mole"],
  },
  {
    id: "catalan-constant",
    name: {
      ko: "카탈란 상수",
      en: "Catalan's Constant",
      ja: "カタランの定数",
    },
    field: "constants",
    subfield: "advanced",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "카탈란 상수 G는 교대 급수에서 나타나는 상수입니다. 조합론, 쌍곡선 기하학에서 등장합니다.",
        formulas: [
          {
            latex: "G = \\sum_{n=0}^{\\infty} \\frac{(-1)^n}{(2n+1)^2} = 1 - \\frac{1}{9} + \\frac{1}{25} - \\frac{1}{49} + ...",
            description: "카탈란 상수의 정의",
          },
          {
            latex: "G \\approx 0.9159655941772...",
            description: "카탈란 상수의 값",
          },
        ],
        examples: [
          {
            problem: "카탈란 상수가 나타나는 적분을 하나 제시하세요.",
            solution:
              "∫₀¹ arctan(x)/x dx = G",
          },
        ],
        history: {
          discoveredBy: "외젠 카탈란",
          year: "1865년",
          background:
            "카탈란이 급수 연구 중 발견했습니다. 무리수인지 아직 미해결.",
        },
        applications: [
          { field: "해석학", description: "특수 급수, 적분" },
          { field: "조합론", description: "격자 경로 문제" },
          { field: "물리학", description: "양자장론" },
        ],
      },
      en: {
        definition:
          "Catalan's constant G appears in alternating series. Found in combinatorics and hyperbolic geometry.",
        formulas: [
          {
            latex: "G = \\sum_{n=0}^{\\infty} \\frac{(-1)^n}{(2n+1)^2} = 1 - \\frac{1}{9} + \\frac{1}{25} - \\frac{1}{49} + ...",
            description: "Definition of Catalan's constant",
          },
          {
            latex: "G \\approx 0.9159655941772...",
            description: "Value of Catalan's constant",
          },
        ],
        examples: [
          {
            problem: "Give an integral involving Catalan's constant.",
            solution:
              "∫₀¹ arctan(x)/x dx = G",
          },
        ],
        history: {
          discoveredBy: "Eugène Catalan",
          year: "1865",
          background:
            "Catalan discovered it while studying series. Whether it's irrational is still open.",
        },
        applications: [
          { field: "Analysis", description: "Special series, integrals" },
          { field: "Combinatorics", description: "Lattice path problems" },
          { field: "Physics", description: "Quantum field theory" },
        ],
      },
    },
    relations: {
      prerequisites: ["series"],
      nextTopics: ["beta-function"],
      related: ["pi-constant", "zeta-function"],
    },
    tags: ["카탈란", "상수", "Catalan", "constant"],
  },
  {
    id: "planck-constant",
    name: {
      ko: "플랑크 상수",
      en: "Planck Constant",
      ja: "プランク定数",
    },
    field: "constants",
    subfield: "physics",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "플랑크 상수 h는 양자역학의 기본 상수로, 에너지와 진동수의 관계를 나타냅니다. 양자 현상의 크기를 결정합니다.",
        formulas: [
          {
            latex: "h = 6.626 \\times 10^{-34} \\text{ J·s}",
            description: "플랑크 상수",
          },
          {
            latex: "E = hf",
            description: "광자 에너지",
          },
          {
            latex: "\\hbar = \\frac{h}{2\\pi}",
            description: "환산 플랑크 상수",
          },
        ],
        examples: [
          {
            problem: "파장 500nm 빛의 광자 에너지를 구하세요.",
            solution:
              "f = c/λ = 3×10⁸ / 5×10⁻⁷ = 6×10¹⁴ Hz. E = hf ≈ 4×10⁻¹⁹ J ≈ 2.5 eV",
          },
        ],
        history: {
          discoveredBy: "막스 플랑크",
          year: "1900년",
          background:
            "플랑크가 흑체 복사 문제를 해결하면서 양자역학의 시작을 알렸습니다.",
        },
        applications: [
          { field: "양자역학", description: "불확정성 원리" },
          { field: "분광학", description: "원자 스펙트럼" },
          { field: "전자공학", description: "반도체, LED" },
        ],
      },
      en: {
        definition:
          "Planck constant h is the fundamental constant of quantum mechanics, relating energy and frequency. It sets the scale of quantum phenomena.",
        formulas: [
          {
            latex: "h = 6.626 \\times 10^{-34} \\text{ J·s}",
            description: "Planck constant",
          },
          {
            latex: "E = hf",
            description: "Photon energy",
          },
          {
            latex: "\\hbar = \\frac{h}{2\\pi}",
            description: "Reduced Planck constant",
          },
        ],
        examples: [
          {
            problem: "Find photon energy for 500nm light.",
            solution:
              "f = c/λ = 3×10⁸ / 5×10⁻⁷ = 6×10¹⁴ Hz. E = hf ≈ 4×10⁻¹⁹ J ≈ 2.5 eV",
          },
        ],
        history: {
          discoveredBy: "Max Planck",
          year: "1900",
          background:
            "Planck introduced it to solve the black body problem, starting quantum mechanics.",
        },
        applications: [
          { field: "Quantum Mechanics", description: "Uncertainty principle" },
          { field: "Spectroscopy", description: "Atomic spectra" },
          { field: "Electronics", description: "Semiconductors, LEDs" },
        ],
      },
    },
    relations: {
      prerequisites: ["waves"],
      nextTopics: ["quantum-mechanics", "uncertainty-principle"],
      related: ["speed-of-light"],
    },
    tags: ["플랑크", "양자", "Planck", "quantum"],
  },
  {
    id: "speed-of-light",
    name: {
      ko: "빛의 속력",
      en: "Speed of Light",
      ja: "光速",
    },
    field: "constants",
    subfield: "physics",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "빛의 속력 c는 진공에서 전자기파의 속력입니다. 특수상대론에서 속력의 상한이며, 정확히 정의된 값입니다.",
        formulas: [
          {
            latex: "c = 299,792,458 \\text{ m/s}",
            description: "빛의 속력 (정의값)",
          },
          {
            latex: "E = mc^2",
            description: "질량-에너지 등가",
          },
          {
            latex: "c = \\frac{1}{\\sqrt{\\epsilon_0 \\mu_0}}",
            description: "전자기 상수와의 관계",
          },
        ],
        examples: [
          {
            problem: "빛이 지구에서 달까지 가는 데 걸리는 시간은? (거리: 384,400 km)",
            solution:
              "t = d/c = 3.844×10⁸ / 3×10⁸ ≈ 1.28초",
          },
        ],
        history: {
          discoveredBy: "올레 뢰머 (최초 측정), 알베르트 아인슈타인 (이론적 중요성)",
          year: "1676년, 1905년",
          background:
            "뢰머가 목성 위성 관측으로 유한함을 발견, 아인슈타인이 상대론에서 핵심 역할을 부여.",
        },
        applications: [
          { field: "상대론", description: "시공간 구조" },
          { field: "통신", description: "광섬유, 위성 통신" },
          { field: "천문학", description: "거리 측정 (광년)" },
        ],
      },
      en: {
        definition:
          "The speed of light c is the speed of electromagnetic waves in vacuum. It's the upper limit of speed in special relativity, defined exactly.",
        formulas: [
          {
            latex: "c = 299,792,458 \\text{ m/s}",
            description: "Speed of light (defined value)",
          },
          {
            latex: "E = mc^2",
            description: "Mass-energy equivalence",
          },
          {
            latex: "c = \\frac{1}{\\sqrt{\\epsilon_0 \\mu_0}}",
            description: "Relation to electromagnetic constants",
          },
        ],
        examples: [
          {
            problem: "How long for light to reach Moon from Earth? (384,400 km)",
            solution:
              "t = d/c = 3.844×10⁸ / 3×10⁸ ≈ 1.28 seconds",
          },
        ],
        history: {
          discoveredBy: "Ole Rømer (first measurement), Albert Einstein (theoretical significance)",
          year: "1676, 1905",
          background:
            "Rømer discovered it was finite; Einstein gave it central role in relativity.",
        },
        applications: [
          { field: "Relativity", description: "Spacetime structure" },
          { field: "Communications", description: "Fiber optics, satellite" },
          { field: "Astronomy", description: "Distance measurement (light-years)" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["special-relativity"],
      related: ["planck-constant"],
    },
    tags: ["빛", "속력", "light", "speed"],
  },
];
