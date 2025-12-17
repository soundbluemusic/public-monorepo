/**
 * @fileoverview 대수학 개념 데이터
 * 2.1 기초 대수: 변수와 식, 일차방정식, 연립방정식, 부등식, 다항식, 인수분해
 * 2.2 고급 대수: 이차방정식, 복소수, 지수/로그, 수열, 급수
 * 2.3 추상대수: 군, 환, 체, 벡터공간, 갈루아이론
 * 2.4 부울 대수: 논리연산, 불 함수, 논리게이트
 * 2.5 표현론: 군표현, 리대수, 대칭성
 * 2.6 호몰로지 대수: 체인 복합체, 호몰로지 이론
 */
import type { MathConcept } from "../types";

export const algebraConcepts: MathConcept[] = [
  // ========================================
  // 2.1 기초 대수 (Elementary Algebra)
  // ========================================
  {
    id: "variables-expressions",
    name: {
      ko: "변수와 식",
      en: "Variables and Expressions",
      ja: "変数と式",
    },
    field: "algebra",
    subfield: "elementary-algebra",
    difficulty: 1,
    content: {
      ko: {
        definition: "변수는 값이 변할 수 있는 문자이고, 식은 수, 변수, 연산 기호로 이루어진 수학적 표현이다.",
        formulas: [
          {
            latex: "3x + 2y - 5",
            description: "대수식의 예",
          },
          {
            latex: "\\text{항} = \\text{계수} \\times \\text{변수}",
            description: "항의 구성",
          },
        ],
        examples: [
          {
            problem: "x = 3일 때, 2x + 5의 값을 구하시오.",
            solution: "2(3) + 5 = 6 + 5 = 11",
            difficulty: 1,
          },
          {
            problem: "3x + 2x - x를 간단히 하시오.",
            solution: "동류항끼리 계산: (3 + 2 - 1)x = 4x",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "프로그래밍", description: "변수 사용" },
          { field: "물리학", description: "공식 표현" },
        ],
      },
      en: {
        definition: "Variables are letters representing changeable values, and expressions are mathematical phrases with numbers, variables, and operations.",
        formulas: [
          {
            latex: "3x + 2y - 5",
            description: "Example of algebraic expression",
          },
          {
            latex: "\\text{term} = \\text{coefficient} \\times \\text{variable}",
            description: "Structure of a term",
          },
        ],
        examples: [
          {
            problem: "Find the value of 2x + 5 when x = 3.",
            solution: "2(3) + 5 = 6 + 5 = 11",
            difficulty: 1,
          },
          {
            problem: "Simplify 3x + 2x - x.",
            solution: "Combine like terms: (3 + 2 - 1)x = 4x",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "Programming", description: "Using variables" },
          { field: "Physics", description: "Expressing formulas" },
        ],
      },
    },
    relations: {
      prerequisites: ["arithmetic-operations"],
      nextTopics: ["linear-equation", "polynomial"],
      related: ["substitution"],
      applications: [],
    },
    tags: ["algebra", "variable", "expression", "fundamental"],
  },
  {
    id: "linear-equation",
    name: {
      ko: "일차방정식",
      en: "Linear Equation",
      ja: "一次方程式",
    },
    field: "algebra",
    subfield: "elementary-algebra",
    difficulty: 2,
    content: {
      ko: {
        definition: "미지수의 최고 차수가 1인 방정식이다.",
        formulas: [
          {
            latex: "ax + b = 0 \\quad (a \\neq 0)",
            description: "일차방정식의 일반형",
          },
          {
            latex: "x = -\\frac{b}{a}",
            description: "일차방정식의 해",
          },
        ],
        examples: [
          {
            problem: "3x - 6 = 0을 풀어라.",
            solution: "3x = 6\nx = 2",
            difficulty: 1,
          },
          {
            problem: "2(x + 3) = 5x - 9를 풀어라.",
            solution: "2x + 6 = 5x - 9\n6 + 9 = 5x - 2x\n15 = 3x\nx = 5",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "경제", description: "손익분기점 계산" },
          { field: "물리", description: "등속 운동" },
        ],
      },
      en: {
        definition: "An equation where the highest power of the variable is 1.",
        formulas: [
          {
            latex: "ax + b = 0 \\quad (a \\neq 0)",
            description: "General form of linear equation",
          },
          {
            latex: "x = -\\frac{b}{a}",
            description: "Solution of linear equation",
          },
        ],
        examples: [
          {
            problem: "Solve 3x - 6 = 0.",
            solution: "3x = 6\nx = 2",
            difficulty: 1,
          },
          {
            problem: "Solve 2(x + 3) = 5x - 9.",
            solution: "2x + 6 = 5x - 9\n6 + 9 = 5x - 2x\n15 = 3x\nx = 5",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Economics", description: "Break-even point calculation" },
          { field: "Physics", description: "Uniform motion" },
        ],
      },
    },
    relations: {
      prerequisites: ["variables-expressions"],
      nextTopics: ["system-of-equations", "quadratic-equation"],
      related: ["linear-function"],
      applications: [],
    },
    tags: ["algebra", "equation", "linear", "fundamental"],
  },
  {
    id: "system-of-equations",
    name: {
      ko: "연립방정식",
      en: "System of Equations",
      ja: "連立方程式",
    },
    field: "algebra",
    subfield: "elementary-algebra",
    difficulty: 2,
    content: {
      ko: {
        definition: "두 개 이상의 방정식을 동시에 만족하는 미지수의 값을 구하는 것이다.",
        formulas: [
          {
            latex: "\\begin{cases} ax + by = c \\\\ dx + ey = f \\end{cases}",
            description: "2원 1차 연립방정식",
          },
          {
            latex: "x = \\frac{ce - bf}{ae - bd}, \\quad y = \\frac{af - cd}{ae - bd}",
            description: "크래머 공식",
          },
        ],
        examples: [
          {
            problem: "x + y = 5, x - y = 1을 풀어라.",
            solution: "두 식을 더하면: 2x = 6, x = 3\nx = 3을 대입: 3 + y = 5, y = 2\n해: (3, 2)",
            difficulty: 2,
          },
          {
            problem: "2x + 3y = 12, x - y = 1을 대입법으로 풀어라.",
            solution: "x = y + 1\n2(y+1) + 3y = 12\n5y + 2 = 12\ny = 2, x = 3",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "경제", description: "수요-공급 균형" },
          { field: "공학", description: "회로 분석" },
        ],
      },
      en: {
        definition: "Finding values that satisfy two or more equations simultaneously.",
        formulas: [
          {
            latex: "\\begin{cases} ax + by = c \\\\ dx + ey = f \\end{cases}",
            description: "System of two linear equations",
          },
          {
            latex: "x = \\frac{ce - bf}{ae - bd}, \\quad y = \\frac{af - cd}{ae - bd}",
            description: "Cramer's rule",
          },
        ],
        examples: [
          {
            problem: "Solve x + y = 5, x - y = 1.",
            solution: "Add equations: 2x = 6, x = 3\nSubstitute: 3 + y = 5, y = 2\nSolution: (3, 2)",
            difficulty: 2,
          },
          {
            problem: "Solve 2x + 3y = 12, x - y = 1 by substitution.",
            solution: "x = y + 1\n2(y+1) + 3y = 12\n5y + 2 = 12\ny = 2, x = 3",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Economics", description: "Supply-demand equilibrium" },
          { field: "Engineering", description: "Circuit analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["linear-equation"],
      nextTopics: ["matrix-equations", "linear-algebra"],
      related: ["determinant", "gaussian-elimination"],
      applications: [],
    },
    tags: ["algebra", "equation", "system", "fundamental"],
  },
  {
    id: "inequalities",
    name: {
      ko: "부등식",
      en: "Inequalities",
      ja: "不等式",
    },
    field: "algebra",
    subfield: "elementary-algebra",
    difficulty: 2,
    content: {
      ko: {
        definition: "두 수나 식의 대소 관계를 나타내는 식이다.",
        formulas: [
          {
            latex: "a < b, \\quad a > b, \\quad a \\leq b, \\quad a \\geq b",
            description: "부등호의 종류",
          },
          {
            latex: "a < b \\Rightarrow a + c < b + c",
            description: "덧셈 성질",
          },
          {
            latex: "a < b, c > 0 \\Rightarrow ac < bc",
            description: "양수 곱셈",
          },
          {
            latex: "a < b, c < 0 \\Rightarrow ac > bc",
            description: "음수 곱셈 (부등호 방향 바뀜)",
          },
        ],
        examples: [
          {
            problem: "2x - 3 > 5를 풀어라.",
            solution: "2x > 8\nx > 4",
            difficulty: 1,
          },
          {
            problem: "-3x + 6 ≤ 12를 풀어라.",
            solution: "-3x ≤ 6\nx ≥ -2 (음수로 나누면 부등호 방향 바뀜)",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "최적화", description: "제약 조건 표현" },
          { field: "통계", description: "신뢰구간" },
        ],
      },
      en: {
        definition: "Expressions showing the relationship between two quantities.",
        formulas: [
          {
            latex: "a < b, \\quad a > b, \\quad a \\leq b, \\quad a \\geq b",
            description: "Types of inequality signs",
          },
          {
            latex: "a < b \\Rightarrow a + c < b + c",
            description: "Addition property",
          },
          {
            latex: "a < b, c > 0 \\Rightarrow ac < bc",
            description: "Positive multiplication",
          },
          {
            latex: "a < b, c < 0 \\Rightarrow ac > bc",
            description: "Negative multiplication (sign flips)",
          },
        ],
        examples: [
          {
            problem: "Solve 2x - 3 > 5.",
            solution: "2x > 8\nx > 4",
            difficulty: 1,
          },
          {
            problem: "Solve -3x + 6 ≤ 12.",
            solution: "-3x ≤ 6\nx ≥ -2 (sign flips when dividing by negative)",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Optimization", description: "Expressing constraints" },
          { field: "Statistics", description: "Confidence intervals" },
        ],
      },
    },
    relations: {
      prerequisites: ["linear-equation"],
      nextTopics: ["absolute-value-inequality", "quadratic-inequality"],
      related: ["linear-programming"],
      applications: [],
    },
    tags: ["algebra", "inequality", "fundamental"],
  },
  {
    id: "polynomial",
    name: {
      ko: "다항식",
      en: "Polynomial",
      ja: "多項式",
    },
    field: "algebra",
    subfield: "elementary-algebra",
    difficulty: 2,
    content: {
      ko: {
        definition: "변수의 거듭제곱과 계수의 합으로 이루어진 식이다.",
        formulas: [
          {
            latex: "P(x) = a_nx^n + a_{n-1}x^{n-1} + \\cdots + a_1x + a_0",
            description: "n차 다항식의 일반형",
          },
          {
            latex: "(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k}b^k",
            description: "이항정리",
          },
        ],
        examples: [
          {
            problem: "(x + 2)(x² - x + 3)을 전개하시오.",
            solution: "= x³ - x² + 3x + 2x² - 2x + 6\n= x³ + x² + x + 6",
            difficulty: 2,
          },
          {
            problem: "(a + b)³을 전개하시오.",
            solution: "= a³ + 3a²b + 3ab² + b³",
            latex: "(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "근사", description: "테일러 급수" },
          { field: "신호처리", description: "필터 설계" },
        ],
      },
      en: {
        definition: "An expression consisting of variables raised to powers and coefficients.",
        formulas: [
          {
            latex: "P(x) = a_nx^n + a_{n-1}x^{n-1} + \\cdots + a_1x + a_0",
            description: "General form of degree n polynomial",
          },
          {
            latex: "(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k}b^k",
            description: "Binomial theorem",
          },
        ],
        examples: [
          {
            problem: "Expand (x + 2)(x² - x + 3).",
            solution: "= x³ - x² + 3x + 2x² - 2x + 6\n= x³ + x² + x + 6",
            difficulty: 2,
          },
          {
            problem: "Expand (a + b)³.",
            solution: "= a³ + 3a²b + 3ab² + b³",
            latex: "(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Approximation", description: "Taylor series" },
          { field: "Signal Processing", description: "Filter design" },
        ],
      },
    },
    relations: {
      prerequisites: ["variables-expressions", "exponentiation"],
      nextTopics: ["factoring", "polynomial-division"],
      related: ["binomial-theorem"],
      applications: [],
    },
    tags: ["algebra", "polynomial", "fundamental"],
  },
  {
    id: "factoring",
    name: {
      ko: "인수분해",
      en: "Factoring",
      ja: "因数分解",
    },
    field: "algebra",
    subfield: "elementary-algebra",
    difficulty: 2,
    content: {
      ko: {
        definition: "다항식을 두 개 이상의 다항식의 곱으로 나타내는 것이다.",
        formulas: [
          {
            latex: "a^2 - b^2 = (a+b)(a-b)",
            description: "합차 공식",
          },
          {
            latex: "a^2 + 2ab + b^2 = (a+b)^2",
            description: "완전제곱식",
          },
          {
            latex: "a^3 + b^3 = (a+b)(a^2 - ab + b^2)",
            description: "세제곱의 합",
          },
          {
            latex: "a^3 - b^3 = (a-b)(a^2 + ab + b^2)",
            description: "세제곱의 차",
          },
        ],
        examples: [
          {
            problem: "x² - 9를 인수분해하시오.",
            solution: "합차 공식: x² - 3² = (x+3)(x-3)",
            latex: "x^2 - 9 = (x+3)(x-3)",
            difficulty: 2,
          },
          {
            problem: "x³ - 8을 인수분해하시오.",
            solution: "세제곱의 차: x³ - 2³ = (x-2)(x² + 2x + 4)",
            latex: "x^3 - 8 = (x-2)(x^2 + 2x + 4)",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "방정식", description: "방정식 풀이" },
          { field: "적분", description: "부분분수 분해" },
        ],
      },
      en: {
        definition: "Expressing a polynomial as a product of two or more polynomials.",
        formulas: [
          {
            latex: "a^2 - b^2 = (a+b)(a-b)",
            description: "Difference of squares",
          },
          {
            latex: "a^2 + 2ab + b^2 = (a+b)^2",
            description: "Perfect square trinomial",
          },
          {
            latex: "a^3 + b^3 = (a+b)(a^2 - ab + b^2)",
            description: "Sum of cubes",
          },
          {
            latex: "a^3 - b^3 = (a-b)(a^2 + ab + b^2)",
            description: "Difference of cubes",
          },
        ],
        examples: [
          {
            problem: "Factor x² - 9.",
            solution: "Difference of squares: x² - 3² = (x+3)(x-3)",
            latex: "x^2 - 9 = (x+3)(x-3)",
            difficulty: 2,
          },
          {
            problem: "Factor x³ - 8.",
            solution: "Difference of cubes: x³ - 2³ = (x-2)(x² + 2x + 4)",
            latex: "x^3 - 8 = (x-2)(x^2 + 2x + 4)",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Equations", description: "Solving equations" },
          { field: "Integration", description: "Partial fraction decomposition" },
        ],
      },
    },
    relations: {
      prerequisites: ["polynomial"],
      nextTopics: ["quadratic-equation"],
      related: ["gcf", "grouping"],
      applications: [],
    },
    tags: ["algebra", "polynomial", "factoring", "fundamental"],
  },

  // ========================================
  // 2.2 고급 대수 (Advanced Algebra)
  // ========================================
  {
    id: "quadratic-equation",
    name: {
      ko: "이차방정식",
      en: "Quadratic Equation",
      ja: "二次方程式",
    },
    field: "algebra",
    subfield: "advanced-algebra",
    difficulty: 3,
    content: {
      ko: {
        definition: "미지수의 최고차항이 2차인 방정식이다.",
        formulas: [
          {
            latex: "ax^2 + bx + c = 0 \\quad (a \\neq 0)",
            description: "이차방정식의 일반형",
          },
          {
            latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
            description: "근의 공식",
          },
          {
            latex: "D = b^2 - 4ac",
            description: "판별식",
          },
        ],
        examples: [
          {
            problem: "x² - 5x + 6 = 0을 풀어라.",
            solution: "인수분해: (x-2)(x-3) = 0\nx = 2 또는 x = 3",
            difficulty: 2,
          },
          {
            problem: "x² + 2x + 5 = 0의 근을 구하라.",
            solution: "D = 4 - 20 = -16 < 0\nx = (-2 ± 4i)/2 = -1 ± 2i (복소수 근)",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "물리학", description: "포물선 운동" },
          { field: "공학", description: "최적화 문제" },
        ],
      },
      en: {
        definition: "An equation where the highest power of the variable is 2.",
        formulas: [
          {
            latex: "ax^2 + bx + c = 0 \\quad (a \\neq 0)",
            description: "Standard form",
          },
          {
            latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
            description: "Quadratic formula",
          },
          {
            latex: "D = b^2 - 4ac",
            description: "Discriminant",
          },
        ],
        examples: [
          {
            problem: "Solve x² - 5x + 6 = 0.",
            solution: "Factor: (x-2)(x-3) = 0\nx = 2 or x = 3",
            difficulty: 2,
          },
          {
            problem: "Find roots of x² + 2x + 5 = 0.",
            solution: "D = 4 - 20 = -16 < 0\nx = (-2 ± 4i)/2 = -1 ± 2i (complex roots)",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Physics", description: "Projectile motion" },
          { field: "Engineering", description: "Optimization problems" },
        ],
      },
    },
    relations: {
      prerequisites: ["linear-equation", "square-root"],
      nextTopics: ["polynomial-equation", "quadratic-function"],
      related: ["factoring", "completing-the-square"],
      applications: [],
    },
    tags: ["algebra", "equation", "quadratic"],
  },
  {
    id: "complex-numbers-algebra",
    name: {
      ko: "복소수 연산",
      en: "Complex Number Operations",
      ja: "複素数演算",
    },
    field: "algebra",
    subfield: "advanced-algebra",
    difficulty: 3,
    content: {
      ko: {
        definition: "복소수에 대한 대수적 연산을 다룬다.",
        formulas: [
          {
            latex: "z = a + bi, \\quad \\bar{z} = a - bi",
            description: "복소수와 켤레복소수",
          },
          {
            latex: "z \\cdot \\bar{z} = a^2 + b^2 = |z|^2",
            description: "복소수와 켤레의 곱",
          },
          {
            latex: "\\frac{1}{z} = \\frac{\\bar{z}}{|z|^2}",
            description: "복소수의 역수",
          },
        ],
        examples: [
          {
            problem: "(2 + 3i) / (1 - i)를 계산하시오.",
            solution: "분모의 켤레를 곱함:\n= (2+3i)(1+i) / (1-i)(1+i)\n= (2+2i+3i-3) / 2\n= (-1+5i) / 2",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "전기공학", description: "임피던스 계산" },
          { field: "신호처리", description: "푸리에 변환" },
        ],
      },
      en: {
        definition: "Algebraic operations on complex numbers.",
        formulas: [
          {
            latex: "z = a + bi, \\quad \\bar{z} = a - bi",
            description: "Complex number and conjugate",
          },
          {
            latex: "z \\cdot \\bar{z} = a^2 + b^2 = |z|^2",
            description: "Product with conjugate",
          },
          {
            latex: "\\frac{1}{z} = \\frac{\\bar{z}}{|z|^2}",
            description: "Reciprocal of complex number",
          },
        ],
        examples: [
          {
            problem: "Calculate (2 + 3i) / (1 - i).",
            solution: "Multiply by conjugate:\n= (2+3i)(1+i) / (1-i)(1+i)\n= (2+2i+3i-3) / 2\n= (-1+5i) / 2",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Electrical Engineering", description: "Impedance calculations" },
          { field: "Signal Processing", description: "Fourier transform" },
        ],
      },
    },
    relations: {
      prerequisites: ["complex-numbers"],
      nextTopics: ["polar-form", "euler-formula"],
      related: ["quadratic-equation"],
      applications: [],
    },
    tags: ["algebra", "complex", "advanced"],
  },
  {
    id: "exponential-logarithm",
    name: {
      ko: "지수와 로그",
      en: "Exponentials and Logarithms",
      ja: "指数と対数",
    },
    field: "algebra",
    subfield: "advanced-algebra",
    difficulty: 3,
    content: {
      ko: {
        definition: "지수함수와 그 역함수인 로그함수의 성질과 연산이다.",
        formulas: [
          {
            latex: "y = a^x \\iff x = \\log_a y",
            description: "지수와 로그의 관계",
          },
          {
            latex: "\\log_a(xy) = \\log_a x + \\log_a y",
            description: "로그의 곱셈 법칙",
          },
          {
            latex: "\\log_a(x^n) = n \\log_a x",
            description: "로그의 거듭제곱 법칙",
          },
          {
            latex: "\\log_a b = \\frac{\\log_c b}{\\log_c a}",
            description: "밑 변환 공식",
          },
        ],
        examples: [
          {
            problem: "log₂ 32를 구하시오.",
            solution: "2^x = 32 = 2^5\nx = 5",
            difficulty: 2,
          },
          {
            problem: "log₃ 27 + log₃ 9를 계산하시오.",
            solution: "= log₃(27 × 9) = log₃ 243 = log₃ 3^5 = 5",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "금융", description: "복리 계산" },
          { field: "과학", description: "pH, 지진 규모" },
        ],
      },
      en: {
        definition: "Properties and operations of exponential functions and their inverse, logarithms.",
        formulas: [
          {
            latex: "y = a^x \\iff x = \\log_a y",
            description: "Relationship between exponents and logarithms",
          },
          {
            latex: "\\log_a(xy) = \\log_a x + \\log_a y",
            description: "Product rule for logarithms",
          },
          {
            latex: "\\log_a(x^n) = n \\log_a x",
            description: "Power rule for logarithms",
          },
          {
            latex: "\\log_a b = \\frac{\\log_c b}{\\log_c a}",
            description: "Change of base formula",
          },
        ],
        examples: [
          {
            problem: "Find log₂ 32.",
            solution: "2^x = 32 = 2^5\nx = 5",
            difficulty: 2,
          },
          {
            problem: "Calculate log₃ 27 + log₃ 9.",
            solution: "= log₃(27 × 9) = log₃ 243 = log₃ 3^5 = 5",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Finance", description: "Compound interest" },
          { field: "Science", description: "pH, earthquake magnitude" },
        ],
      },
    },
    relations: {
      prerequisites: ["exponentiation"],
      nextTopics: ["exponential-function", "logarithmic-function"],
      related: ["natural-logarithm", "euler-number"],
      applications: [],
    },
    tags: ["algebra", "exponential", "logarithm", "advanced"],
  },
  {
    id: "sequences",
    name: {
      ko: "수열",
      en: "Sequences",
      ja: "数列",
    },
    field: "algebra",
    subfield: "advanced-algebra",
    difficulty: 3,
    content: {
      ko: {
        definition: "일정한 규칙에 따라 나열된 수의 열이다.",
        formulas: [
          {
            latex: "a_n = a_1 + (n-1)d",
            description: "등차수열의 일반항",
          },
          {
            latex: "S_n = \\frac{n(a_1 + a_n)}{2}",
            description: "등차수열의 합",
          },
          {
            latex: "a_n = a_1 \\cdot r^{n-1}",
            description: "등비수열의 일반항",
          },
          {
            latex: "S_n = a_1 \\frac{r^n - 1}{r - 1}",
            description: "등비수열의 합 (r ≠ 1)",
          },
        ],
        examples: [
          {
            problem: "첫째항 2, 공차 3인 등차수열의 10번째 항을 구하시오.",
            solution: "a₁₀ = 2 + (10-1)×3 = 2 + 27 = 29",
            difficulty: 2,
          },
          {
            problem: "첫째항 3, 공비 2인 등비수열의 합 S₅를 구하시오.",
            solution: "S₅ = 3 × (2^5 - 1)/(2-1) = 3 × 31 = 93",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "금융", description: "적금, 대출 상환" },
          { field: "컴퓨터", description: "알고리즘 복잡도" },
        ],
      },
      en: {
        definition: "An ordered list of numbers following a specific pattern.",
        formulas: [
          {
            latex: "a_n = a_1 + (n-1)d",
            description: "nth term of arithmetic sequence",
          },
          {
            latex: "S_n = \\frac{n(a_1 + a_n)}{2}",
            description: "Sum of arithmetic sequence",
          },
          {
            latex: "a_n = a_1 \\cdot r^{n-1}",
            description: "nth term of geometric sequence",
          },
          {
            latex: "S_n = a_1 \\frac{r^n - 1}{r - 1}",
            description: "Sum of geometric sequence (r ≠ 1)",
          },
        ],
        examples: [
          {
            problem: "Find the 10th term of arithmetic sequence with a₁ = 2, d = 3.",
            solution: "a₁₀ = 2 + (10-1)×3 = 2 + 27 = 29",
            difficulty: 2,
          },
          {
            problem: "Find S₅ for geometric sequence with a₁ = 3, r = 2.",
            solution: "S₅ = 3 × (2^5 - 1)/(2-1) = 3 × 31 = 93",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Finance", description: "Savings, loan repayment" },
          { field: "Computing", description: "Algorithm complexity" },
        ],
      },
    },
    relations: {
      prerequisites: ["arithmetic-operations", "exponentiation"],
      nextTopics: ["series", "recurrence-relations"],
      related: ["mathematical-induction"],
      applications: [],
    },
    tags: ["algebra", "sequence", "series", "advanced"],
  },
  {
    id: "series",
    name: {
      ko: "급수",
      en: "Series",
      ja: "級数",
    },
    field: "algebra",
    subfield: "advanced-algebra",
    difficulty: 4,
    content: {
      ko: {
        definition: "수열의 항들을 더한 것으로, 유한급수와 무한급수가 있다.",
        formulas: [
          {
            latex: "\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}",
            description: "자연수의 합",
          },
          {
            latex: "\\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}",
            description: "제곱의 합",
          },
          {
            latex: "\\sum_{k=0}^{\\infty} ar^k = \\frac{a}{1-r} \\quad (|r| < 1)",
            description: "무한등비급수의 합",
          },
        ],
        examples: [
          {
            problem: "1 + 1/2 + 1/4 + 1/8 + ...의 합을 구하시오.",
            solution: "첫째항 a = 1, 공비 r = 1/2\nS = 1/(1-1/2) = 2",
            difficulty: 3,
          },
          {
            problem: "Σ(k=1 to 100) k를 구하시오.",
            solution: "= 100 × 101 / 2 = 5050",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "물리학", description: "무한급수 근사" },
          { field: "금융", description: "영구연금 가치" },
        ],
      },
      en: {
        definition: "The sum of terms in a sequence, either finite or infinite.",
        formulas: [
          {
            latex: "\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}",
            description: "Sum of natural numbers",
          },
          {
            latex: "\\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}",
            description: "Sum of squares",
          },
          {
            latex: "\\sum_{k=0}^{\\infty} ar^k = \\frac{a}{1-r} \\quad (|r| < 1)",
            description: "Sum of infinite geometric series",
          },
        ],
        examples: [
          {
            problem: "Find the sum of 1 + 1/2 + 1/4 + 1/8 + ...",
            solution: "First term a = 1, ratio r = 1/2\nS = 1/(1-1/2) = 2",
            difficulty: 3,
          },
          {
            problem: "Find Σ(k=1 to 100) k.",
            solution: "= 100 × 101 / 2 = 5050",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Physics", description: "Infinite series approximations" },
          { field: "Finance", description: "Perpetuity valuation" },
        ],
      },
    },
    relations: {
      prerequisites: ["sequences"],
      nextTopics: ["convergence", "taylor-series"],
      related: ["limits"],
      applications: [],
    },
    tags: ["algebra", "series", "infinite", "advanced"],
  },

  // ========================================
  // 2.3 추상대수 (Abstract Algebra)
  // ========================================
  {
    id: "group-theory",
    name: {
      ko: "군론",
      en: "Group Theory",
      ja: "群論",
    },
    field: "algebra",
    subfield: "abstract-algebra",
    difficulty: 5,
    content: {
      ko: {
        definition: "집합과 이항연산이 특정 공리를 만족하는 대수적 구조이다.",
        formulas: [
          {
            latex: "(G, \\cdot) \\text{ is a group if:}",
            description: "군의 정의",
          },
          {
            latex: "\\text{1. 결합법칙: } (a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)",
            description: "결합법칙",
          },
          {
            latex: "\\text{2. 항등원: } \\exists e, \\forall a: e \\cdot a = a \\cdot e = a",
            description: "항등원 존재",
          },
          {
            latex: "\\text{3. 역원: } \\forall a, \\exists a^{-1}: a \\cdot a^{-1} = e",
            description: "역원 존재",
          },
        ],
        examples: [
          {
            problem: "(ℤ, +)가 군임을 보이시오.",
            solution: "1. 결합법칙: (a+b)+c = a+(b+c) ✓\n2. 항등원: 0 (a+0 = a) ✓\n3. 역원: -a (a+(-a) = 0) ✓",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "암호학", description: "타원곡선 암호" },
          { field: "물리학", description: "대칭성 분석" },
        ],
      },
      en: {
        definition: "An algebraic structure with a set and binary operation satisfying specific axioms.",
        formulas: [
          {
            latex: "(G, \\cdot) \\text{ is a group if:}",
            description: "Definition of a group",
          },
          {
            latex: "\\text{1. Associativity: } (a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)",
            description: "Associative law",
          },
          {
            latex: "\\text{2. Identity: } \\exists e, \\forall a: e \\cdot a = a \\cdot e = a",
            description: "Identity element exists",
          },
          {
            latex: "\\text{3. Inverse: } \\forall a, \\exists a^{-1}: a \\cdot a^{-1} = e",
            description: "Inverse element exists",
          },
        ],
        examples: [
          {
            problem: "Show that (ℤ, +) is a group.",
            solution: "1. Associativity: (a+b)+c = a+(b+c) ✓\n2. Identity: 0 (a+0 = a) ✓\n3. Inverse: -a (a+(-a) = 0) ✓",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "Cryptography", description: "Elliptic curve cryptography" },
          { field: "Physics", description: "Symmetry analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["set-theory", "binary-operations"],
      nextTopics: ["ring-theory", "subgroups", "homomorphisms"],
      related: ["symmetry", "permutations"],
      applications: [],
    },
    tags: ["algebra", "abstract", "group", "advanced"],
  },
  {
    id: "ring-theory",
    name: {
      ko: "환론",
      en: "Ring Theory",
      ja: "環論",
    },
    field: "algebra",
    subfield: "abstract-algebra",
    difficulty: 5,
    content: {
      ko: {
        definition: "두 개의 이항연산(덧셈과 곱셈)을 갖는 대수적 구조로, 덧셈에 대해 아벨군이고 곱셈에 대해 결합법칙이 성립한다.",
        formulas: [
          {
            latex: "(R, +, \\cdot) \\text{ is a ring if:}",
            description: "환의 정의",
          },
          {
            latex: "\\text{1. } (R, +) \\text{ is an abelian group}",
            description: "덧셈에 대해 아벨군",
          },
          {
            latex: "\\text{2. } (a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)",
            description: "곱셈의 결합법칙",
          },
          {
            latex: "\\text{3. } a \\cdot (b + c) = a \\cdot b + a \\cdot c",
            description: "분배법칙",
          },
        ],
        examples: [
          {
            problem: "(ℤ, +, ×)가 환임을 보이시오.",
            solution: "1. (ℤ, +)는 아벨군 ✓\n2. 곱셈의 결합법칙 성립 ✓\n3. 분배법칙 성립 ✓",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "정수론", description: "나머지 산술" },
          { field: "암호학", description: "다항식 환" },
        ],
      },
      en: {
        definition: "An algebraic structure with two binary operations (addition and multiplication) where addition forms an abelian group and multiplication is associative.",
        formulas: [
          {
            latex: "(R, +, \\cdot) \\text{ is a ring if:}",
            description: "Definition of a ring",
          },
          {
            latex: "\\text{1. } (R, +) \\text{ is an abelian group}",
            description: "Abelian group under addition",
          },
          {
            latex: "\\text{2. } (a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)",
            description: "Associativity of multiplication",
          },
          {
            latex: "\\text{3. } a \\cdot (b + c) = a \\cdot b + a \\cdot c",
            description: "Distributive law",
          },
        ],
        examples: [
          {
            problem: "Show that (ℤ, +, ×) is a ring.",
            solution: "1. (ℤ, +) is an abelian group ✓\n2. Multiplication is associative ✓\n3. Distributive law holds ✓",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "Number Theory", description: "Modular arithmetic" },
          { field: "Cryptography", description: "Polynomial rings" },
        ],
      },
    },
    relations: {
      prerequisites: ["group-theory"],
      nextTopics: ["field-theory", "ideals"],
      related: ["polynomial-rings", "integral-domains"],
      applications: [],
    },
    tags: ["algebra", "abstract", "ring", "advanced"],
  },
  {
    id: "field-theory",
    name: {
      ko: "체론",
      en: "Field Theory",
      ja: "体論",
    },
    field: "algebra",
    subfield: "abstract-algebra",
    difficulty: 5,
    content: {
      ko: {
        definition: "덧셈과 곱셈에 대해 모두 아벨군을 이루고, 0이 아닌 모든 원소가 곱셈의 역원을 갖는 환이다.",
        formulas: [
          {
            latex: "(F, +, \\cdot) \\text{ is a field if:}",
            description: "체의 정의",
          },
          {
            latex: "\\text{1. } (F, +, \\cdot) \\text{ is a commutative ring}",
            description: "가환환",
          },
          {
            latex: "\\text{2. } \\forall a \\neq 0, \\exists a^{-1}: a \\cdot a^{-1} = 1",
            description: "0이 아닌 원소의 곱셈 역원",
          },
        ],
        examples: [
          {
            problem: "ℚ, ℝ, ℂ가 체임을 설명하시오.",
            solution: "모두 덧셈/곱셈에서 아벨군이고, 0이 아닌 원소의 역원이 존재함",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "암호학", description: "유한체 (AES)" },
          { field: "코딩이론", description: "오류 정정 코드" },
        ],
      },
      en: {
        definition: "A ring where both addition and multiplication form abelian groups, and every non-zero element has a multiplicative inverse.",
        formulas: [
          {
            latex: "(F, +, \\cdot) \\text{ is a field if:}",
            description: "Definition of a field",
          },
          {
            latex: "\\text{1. } (F, +, \\cdot) \\text{ is a commutative ring}",
            description: "Commutative ring",
          },
          {
            latex: "\\text{2. } \\forall a \\neq 0, \\exists a^{-1}: a \\cdot a^{-1} = 1",
            description: "Multiplicative inverse for non-zero elements",
          },
        ],
        examples: [
          {
            problem: "Explain why ℚ, ℝ, ℂ are fields.",
            solution: "All form abelian groups under addition/multiplication, and every non-zero element has an inverse",
            difficulty: 4,
          },
        ],
        applications: [
          { field: "Cryptography", description: "Finite fields (AES)" },
          { field: "Coding Theory", description: "Error-correcting codes" },
        ],
      },
    },
    relations: {
      prerequisites: ["ring-theory"],
      nextTopics: ["galois-theory", "field-extensions"],
      related: ["vector-spaces"],
      applications: [],
    },
    tags: ["algebra", "abstract", "field", "advanced"],
  },
  {
    id: "galois-theory",
    name: {
      ko: "갈루아 이론",
      en: "Galois Theory",
      ja: "ガロア理論",
    },
    field: "algebra",
    subfield: "abstract-algebra",
    difficulty: 5,
    content: {
      ko: {
        definition: "체의 확대와 자기동형군 사이의 관계를 연구하며, 다항방정식의 근의 공식 존재 여부를 결정한다.",
        formulas: [
          {
            latex: "\\text{Gal}(E/F) = \\{\\sigma: E \\to E | \\sigma|_F = \\text{id}\\}",
            description: "갈루아 군",
          },
          {
            latex: "[E:F] = |\\text{Gal}(E/F)|",
            description: "갈루아 확대에서의 관계",
          },
        ],
        examples: [
          {
            problem: "5차 이상의 일반적인 다항방정식이 근의 공식으로 풀 수 없는 이유를 설명하시오.",
            solution: "갈루아 군이 가해군(solvable group)이 아니기 때문. S₅는 가해군이 아님.",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "정수론", description: "대수적 정수론" },
          { field: "기하학", description: "작도 문제" },
        ],
      },
      en: {
        definition: "Studies the relationship between field extensions and automorphism groups, determining solvability of polynomial equations by radicals.",
        formulas: [
          {
            latex: "\\text{Gal}(E/F) = \\{\\sigma: E \\to E | \\sigma|_F = \\text{id}\\}",
            description: "Galois group",
          },
          {
            latex: "[E:F] = |\\text{Gal}(E/F)|",
            description: "Relation for Galois extensions",
          },
        ],
        examples: [
          {
            problem: "Explain why general polynomials of degree 5+ cannot be solved by radicals.",
            solution: "The Galois group is not solvable. S₅ is not a solvable group.",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "Number Theory", description: "Algebraic number theory" },
          { field: "Geometry", description: "Compass and straightedge constructions" },
        ],
      },
    },
    relations: {
      prerequisites: ["group-theory", "field-theory"],
      nextTopics: ["algebraic-number-theory"],
      related: ["polynomial-roots", "solvable-groups"],
      applications: [],
    },
    tags: ["algebra", "abstract", "galois", "advanced"],
  },

  // ========================================
  // 2.4 부울 대수 (Boolean Algebra)
  // ========================================
  {
    id: "boolean-operations",
    name: {
      ko: "논리 연산",
      en: "Boolean Operations",
      ja: "論理演算",
    },
    field: "algebra",
    subfield: "boolean-algebra",
    difficulty: 2,
    content: {
      ko: {
        definition: "참(1)과 거짓(0) 두 값에 대한 논리적 연산이다.",
        formulas: [
          {
            latex: "A \\land B \\text{ (AND)}",
            description: "논리곱: 둘 다 참일 때만 참",
          },
          {
            latex: "A \\lor B \\text{ (OR)}",
            description: "논리합: 하나라도 참이면 참",
          },
          {
            latex: "\\neg A \\text{ (NOT)}",
            description: "논리부정: 참↔거짓 반전",
          },
          {
            latex: "A \\oplus B \\text{ (XOR)}",
            description: "배타적 논리합: 둘이 다를 때 참",
          },
        ],
        examples: [
          {
            problem: "A = 1, B = 0일 때, A AND B, A OR B를 구하시오.",
            solution: "A AND B = 1 ∧ 0 = 0\nA OR B = 1 ∨ 0 = 1",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "컴퓨터", description: "디지털 회로" },
          { field: "프로그래밍", description: "조건문" },
        ],
      },
      en: {
        definition: "Logical operations on two values: true (1) and false (0).",
        formulas: [
          {
            latex: "A \\land B \\text{ (AND)}",
            description: "Conjunction: true only if both are true",
          },
          {
            latex: "A \\lor B \\text{ (OR)}",
            description: "Disjunction: true if at least one is true",
          },
          {
            latex: "\\neg A \\text{ (NOT)}",
            description: "Negation: inverts true↔false",
          },
          {
            latex: "A \\oplus B \\text{ (XOR)}",
            description: "Exclusive or: true when inputs differ",
          },
        ],
        examples: [
          {
            problem: "If A = 1, B = 0, find A AND B, A OR B.",
            solution: "A AND B = 1 ∧ 0 = 0\nA OR B = 1 ∨ 0 = 1",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "Computing", description: "Digital circuits" },
          { field: "Programming", description: "Conditional statements" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["boolean-functions", "logic-gates"],
      related: ["propositional-logic"],
      applications: [],
    },
    tags: ["algebra", "boolean", "logic"],
  },
  {
    id: "boolean-functions",
    name: {
      ko: "불 함수",
      en: "Boolean Functions",
      ja: "ブール関数",
    },
    field: "algebra",
    subfield: "boolean-algebra",
    difficulty: 3,
    content: {
      ko: {
        definition: "불 변수들의 조합으로 불 값을 출력하는 함수이다.",
        formulas: [
          {
            latex: "f(x_1, ..., x_n) \\to \\{0, 1\\}",
            description: "불 함수의 정의",
          },
          {
            latex: "\\text{DNF: } \\bigvee_i \\bigwedge_j x_{ij}",
            description: "논리합 표준형",
          },
          {
            latex: "\\text{CNF: } \\bigwedge_i \\bigvee_j x_{ij}",
            description: "논리곱 표준형",
          },
        ],
        examples: [
          {
            problem: "f(A,B) = A'B + AB'를 간소화하시오.",
            solution: "= A XOR B",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "회로설계", description: "논리 회로 최소화" },
          { field: "SAT", description: "만족가능성 문제" },
        ],
      },
      en: {
        definition: "Functions that output boolean values from combinations of boolean variables.",
        formulas: [
          {
            latex: "f(x_1, ..., x_n) \\to \\{0, 1\\}",
            description: "Definition of boolean function",
          },
          {
            latex: "\\text{DNF: } \\bigvee_i \\bigwedge_j x_{ij}",
            description: "Disjunctive normal form",
          },
          {
            latex: "\\text{CNF: } \\bigwedge_i \\bigvee_j x_{ij}",
            description: "Conjunctive normal form",
          },
        ],
        examples: [
          {
            problem: "Simplify f(A,B) = A'B + AB'.",
            solution: "= A XOR B",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Circuit Design", description: "Logic circuit minimization" },
          { field: "SAT", description: "Satisfiability problems" },
        ],
      },
    },
    relations: {
      prerequisites: ["boolean-operations"],
      nextTopics: ["karnaugh-maps", "quine-mccluskey"],
      related: ["truth-tables"],
      applications: [],
    },
    tags: ["algebra", "boolean", "function"],
  },
  {
    id: "logic-gates",
    name: {
      ko: "논리 게이트",
      en: "Logic Gates",
      ja: "論理ゲート",
    },
    field: "algebra",
    subfield: "boolean-algebra",
    difficulty: 2,
    content: {
      ko: {
        definition: "불 연산을 물리적으로 구현한 전자 회로 소자이다.",
        formulas: [
          {
            latex: "\\text{AND gate: } Y = A \\cdot B",
            description: "AND 게이트",
          },
          {
            latex: "\\text{OR gate: } Y = A + B",
            description: "OR 게이트",
          },
          {
            latex: "\\text{NOT gate: } Y = \\overline{A}",
            description: "NOT 게이트 (인버터)",
          },
          {
            latex: "\\text{NAND gate: } Y = \\overline{A \\cdot B}",
            description: "NAND 게이트 (만능 게이트)",
          },
        ],
        examples: [
          {
            problem: "NAND 게이트만으로 NOT 게이트를 구현하시오.",
            solution: "NOT A = NAND(A, A) = (A·A)' = A'",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "CPU", description: "프로세서 설계" },
          { field: "메모리", description: "플립플롭, 래치" },
        ],
      },
      en: {
        definition: "Electronic circuit components that physically implement boolean operations.",
        formulas: [
          {
            latex: "\\text{AND gate: } Y = A \\cdot B",
            description: "AND gate",
          },
          {
            latex: "\\text{OR gate: } Y = A + B",
            description: "OR gate",
          },
          {
            latex: "\\text{NOT gate: } Y = \\overline{A}",
            description: "NOT gate (inverter)",
          },
          {
            latex: "\\text{NAND gate: } Y = \\overline{A \\cdot B}",
            description: "NAND gate (universal gate)",
          },
        ],
        examples: [
          {
            problem: "Implement NOT gate using only NAND gates.",
            solution: "NOT A = NAND(A, A) = (A·A)' = A'",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "CPU", description: "Processor design" },
          { field: "Memory", description: "Flip-flops, latches" },
        ],
      },
    },
    relations: {
      prerequisites: ["boolean-operations"],
      nextTopics: ["digital-circuits", "combinational-logic"],
      related: ["boolean-functions"],
      applications: [],
    },
    tags: ["algebra", "boolean", "circuit"],
  },

  // ========================================
  // 2.5 표현론 (Representation Theory)
  // ========================================
  {
    id: "group-representation",
    name: {
      ko: "군 표현론",
      en: "Group Representation",
      ja: "群の表現論",
    },
    field: "algebra",
    subfield: "representation-theory",
    difficulty: 5,
    content: {
      ko: {
        definition: "군을 벡터 공간 위의 선형 변환(행렬)으로 나타내는 이론이다.",
        formulas: [
          {
            latex: "\\rho: G \\to GL(V)",
            description: "표현: 군에서 일반선형군으로의 준동형",
          },
          {
            latex: "\\chi(g) = \\text{tr}(\\rho(g))",
            description: "지표 (character): 표현의 대각합",
          },
        ],
        examples: [
          {
            problem: "S₃의 2차원 표현을 구하시오.",
            solution: "순환 (123)과 전치 (12)의 행렬 표현으로 생성",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "물리학", description: "양자역학의 대칭성" },
          { field: "화학", description: "분자 대칭과 스펙트럼" },
        ],
      },
      en: {
        definition: "Theory of representing groups as linear transformations (matrices) on vector spaces.",
        formulas: [
          {
            latex: "\\rho: G \\to GL(V)",
            description: "Representation: homomorphism to general linear group",
          },
          {
            latex: "\\chi(g) = \\text{tr}(\\rho(g))",
            description: "Character: trace of the representation",
          },
        ],
        examples: [
          {
            problem: "Find a 2-dimensional representation of S₃.",
            solution: "Generate from matrices representing cycle (123) and transposition (12)",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "Physics", description: "Symmetry in quantum mechanics" },
          { field: "Chemistry", description: "Molecular symmetry and spectra" },
        ],
      },
    },
    relations: {
      prerequisites: ["group-theory", "linear-algebra-basics"],
      nextTopics: ["character-theory", "lie-algebras"],
      related: ["symmetry"],
      applications: [],
    },
    tags: ["algebra", "representation", "advanced"],
  },
  {
    id: "lie-algebras",
    name: {
      ko: "리 대수",
      en: "Lie Algebras",
      ja: "リー代数",
    },
    field: "algebra",
    subfield: "representation-theory",
    difficulty: 5,
    content: {
      ko: {
        definition: "리 군의 접공간에 해당하는 대수적 구조로, 리 괄호 연산을 갖는다.",
        formulas: [
          {
            latex: "[X, Y] = XY - YX",
            description: "리 괄호 (교환자)",
          },
          {
            latex: "[X, [Y, Z]] + [Y, [Z, X]] + [Z, [X, Y]] = 0",
            description: "야코비 항등식",
          },
        ],
        examples: [
          {
            problem: "sl(2, ℂ)의 기저와 리 괄호 관계를 설명하시오.",
            solution: "기저: E, F, H\n[H,E] = 2E, [H,F] = -2F, [E,F] = H",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "물리학", description: "입자물리 게이지 이론" },
          { field: "미분방정식", description: "대칭 분석" },
        ],
      },
      en: {
        definition: "Algebraic structure corresponding to tangent space of Lie groups, with Lie bracket operation.",
        formulas: [
          {
            latex: "[X, Y] = XY - YX",
            description: "Lie bracket (commutator)",
          },
          {
            latex: "[X, [Y, Z]] + [Y, [Z, X]] + [Z, [X, Y]] = 0",
            description: "Jacobi identity",
          },
        ],
        examples: [
          {
            problem: "Describe the basis and Lie bracket relations for sl(2, ℂ).",
            solution: "Basis: E, F, H\n[H,E] = 2E, [H,F] = -2F, [E,F] = H",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "Physics", description: "Gauge theories in particle physics" },
          { field: "Differential Equations", description: "Symmetry analysis" },
        ],
      },
    },
    relations: {
      prerequisites: ["group-representation"],
      nextTopics: ["root-systems", "classification-lie-algebras"],
      related: ["lie-groups", "differential-geometry"],
      applications: [],
    },
    tags: ["algebra", "lie", "advanced"],
  },

  // ========================================
  // 2.6 호몰로지 대수 (Homological Algebra)
  // ========================================
  {
    id: "chain-complexes",
    name: {
      ko: "사슬 복합체",
      en: "Chain Complexes",
      ja: "鎖複体",
    },
    field: "algebra",
    subfield: "homological-algebra",
    difficulty: 5,
    content: {
      ko: {
        definition: "모듈(또는 아벨군)의 열과 경계 연산자로 이루어진 구조이다.",
        formulas: [
          {
            latex: "\\cdots \\xrightarrow{d_{n+1}} C_n \\xrightarrow{d_n} C_{n-1} \\xrightarrow{d_{n-1}} \\cdots",
            description: "사슬 복합체",
          },
          {
            latex: "d_n \\circ d_{n+1} = 0",
            description: "경계의 경계는 0",
          },
        ],
        examples: [
          {
            problem: "단체 복합체의 사슬 복합체를 설명하시오.",
            solution: "n-단체의 자유 아벨군으로 Cₙ을 구성하고, 경계 연산자로 면을 교대합으로 연결",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "위상수학", description: "호몰로지 계산" },
          { field: "대수기하", description: "층 코호몰로지" },
        ],
      },
      en: {
        definition: "A structure of modules (or abelian groups) with boundary operators.",
        formulas: [
          {
            latex: "\\cdots \\xrightarrow{d_{n+1}} C_n \\xrightarrow{d_n} C_{n-1} \\xrightarrow{d_{n-1}} \\cdots",
            description: "Chain complex",
          },
          {
            latex: "d_n \\circ d_{n+1} = 0",
            description: "Boundary of boundary is zero",
          },
        ],
        examples: [
          {
            problem: "Describe the chain complex of a simplicial complex.",
            solution: "Form Cₙ from free abelian groups of n-simplices, connect by boundary operator as alternating sum of faces",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "Topology", description: "Homology computation" },
          { field: "Algebraic Geometry", description: "Sheaf cohomology" },
        ],
      },
    },
    relations: {
      prerequisites: ["group-theory", "ring-theory"],
      nextTopics: ["homology-theory", "exact-sequences"],
      related: ["algebraic-topology"],
      applications: [],
    },
    tags: ["algebra", "homological", "advanced"],
  },
  {
    id: "homology-theory",
    name: {
      ko: "호몰로지 이론",
      en: "Homology Theory",
      ja: "ホモロジー理論",
    },
    field: "algebra",
    subfield: "homological-algebra",
    difficulty: 5,
    content: {
      ko: {
        definition: "사슬 복합체의 순환(cycle)과 경계(boundary)의 몫으로 정의되는 대수적 불변량이다.",
        formulas: [
          {
            latex: "H_n = \\text{Ker}(d_n) / \\text{Im}(d_{n+1})",
            description: "n차 호몰로지 군",
          },
          {
            latex: "H_n = Z_n / B_n",
            description: "순환/경계의 몫",
          },
        ],
        examples: [
          {
            problem: "원(S¹)의 호몰로지 군을 계산하시오.",
            solution: "H₀(S¹) = ℤ, H₁(S¹) = ℤ, Hₙ(S¹) = 0 (n ≥ 2)",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "위상수학", description: "공간의 구멍 개수 파악" },
          { field: "데이터 과학", description: "위상적 데이터 분석 (TDA)" },
        ],
      },
      en: {
        definition: "Algebraic invariants defined as quotient of cycles and boundaries in chain complexes.",
        formulas: [
          {
            latex: "H_n = \\text{Ker}(d_n) / \\text{Im}(d_{n+1})",
            description: "nth homology group",
          },
          {
            latex: "H_n = Z_n / B_n",
            description: "Cycles modulo boundaries",
          },
        ],
        examples: [
          {
            problem: "Compute the homology groups of the circle S¹.",
            solution: "H₀(S¹) = ℤ, H₁(S¹) = ℤ, Hₙ(S¹) = 0 (n ≥ 2)",
            difficulty: 5,
          },
        ],
        applications: [
          { field: "Topology", description: "Counting holes in spaces" },
          { field: "Data Science", description: "Topological data analysis (TDA)" },
        ],
      },
    },
    relations: {
      prerequisites: ["chain-complexes"],
      nextTopics: ["cohomology", "ext-tor-functors"],
      related: ["betti-numbers", "euler-characteristic"],
      applications: [],
    },
    tags: ["algebra", "homological", "topology", "advanced"],
  },
];
