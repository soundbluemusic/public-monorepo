/**
 * @fileoverview 대수학 개념 데이터
 */
import type { MathConcept } from "../types";

export const algebraConcepts: MathConcept[] = [
  {
    id: "quadratic-equation",
    name: {
      ko: "이차방정식",
      en: "Quadratic Equation",
      ja: "二次方程式",
    },
    field: "algebra",
    subfield: "elementary-algebra",
    difficulty: 3,
    content: {
      ko: {
        definition: "미지수의 최고차항이 2차인 방정식이다.",
        formulas: [
          {
            latex: "ax^2 + bx + c = 0 \\quad (a \\neq 0)",
            description: "이차방정식의 일반형",
            variables: [
              { symbol: "a", meaning: "이차항의 계수 (0이 아님)" },
              { symbol: "b", meaning: "일차항의 계수" },
              { symbol: "c", meaning: "상수항" },
            ],
          },
          {
            latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
            description: "근의 공식",
          },
          {
            latex: "D = b^2 - 4ac",
            description: "판별식: D>0 두 실근, D=0 중근, D<0 허근",
          },
        ],
        examples: [
          {
            problem: "x² - 5x + 6 = 0을 풀어라.",
            solution: "인수분해: (x-2)(x-3) = 0\n따라서 x = 2 또는 x = 3",
            latex: "x^2 - 5x + 6 = (x-2)(x-3) = 0",
            difficulty: 2,
          },
          {
            problem: "2x² + 3x - 2 = 0을 근의 공식으로 풀어라.",
            solution: "a=2, b=3, c=-2\nD = 9 + 16 = 25\nx = (-3 ± 5) / 4\nx = 1/2 또는 x = -2",
            latex: "x = \\frac{-3 \\pm \\sqrt{25}}{4} = \\frac{1}{2}, -2",
            difficulty: 3,
          },
        ],
        history: {
          background: "바빌로니아인들이 기원전 2000년경에 이미 이차방정식을 풀었다.",
        },
        applications: [
          { field: "물리학", description: "포물선 운동, 자유낙하" },
          { field: "경제학", description: "이윤 최대화, 비용 최소화" },
        ],
      },
      en: {
        definition: "An equation where the highest power of the variable is 2.",
        formulas: [
          {
            latex: "ax^2 + bx + c = 0 \\quad (a \\neq 0)",
            description: "Standard form of quadratic equation",
            variables: [
              { symbol: "a", meaning: "Coefficient of x² (not zero)" },
              { symbol: "b", meaning: "Coefficient of x" },
              { symbol: "c", meaning: "Constant term" },
            ],
          },
          {
            latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
            description: "Quadratic formula",
          },
          {
            latex: "D = b^2 - 4ac",
            description: "Discriminant: D>0 two real roots, D=0 one root, D<0 complex roots",
          },
        ],
        examples: [
          {
            problem: "Solve x² - 5x + 6 = 0.",
            solution: "Factor: (x-2)(x-3) = 0\nSo x = 2 or x = 3",
            latex: "x^2 - 5x + 6 = (x-2)(x-3) = 0",
            difficulty: 2,
          },
          {
            problem: "Solve 2x² + 3x - 2 = 0 using the quadratic formula.",
            solution: "a=2, b=3, c=-2\nD = 9 + 16 = 25\nx = (-3 ± 5) / 4\nx = 1/2 or x = -2",
            latex: "x = \\frac{-3 \\pm \\sqrt{25}}{4} = \\frac{1}{2}, -2",
            difficulty: 3,
          },
        ],
        history: {
          background: "Babylonians solved quadratic equations as early as 2000 BCE.",
        },
        applications: [
          { field: "Physics", description: "Projectile motion, free fall" },
          { field: "Economics", description: "Profit maximization, cost minimization" },
        ],
      },
    },
    relations: {
      prerequisites: ["linear-equation", "square-root"],
      nextTopics: ["polynomial-equation", "quadratic-function"],
      related: ["factoring", "completing-the-square"],
      applications: ["projectile-motion", "optimization"],
    },
    tags: ["algebra", "equation", "quadratic", "fundamental"],
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
            description: "완전제곱식 (덧셈)",
          },
          {
            latex: "a^2 - 2ab + b^2 = (a-b)^2",
            description: "완전제곱식 (뺄셈)",
          },
          {
            latex: "x^2 + (a+b)x + ab = (x+a)(x+b)",
            description: "이차식의 인수분해",
          },
        ],
        examples: [
          {
            problem: "x² - 9를 인수분해하시오.",
            solution: "합차 공식 적용: a² - b² = (a+b)(a-b)\nx² - 9 = x² - 3² = (x+3)(x-3)",
            latex: "x^2 - 9 = (x+3)(x-3)",
            difficulty: 2,
          },
          {
            problem: "x² + 5x + 6을 인수분해하시오.",
            solution: "곱이 6이고 합이 5인 두 수: 2와 3\n따라서 (x+2)(x+3)",
            latex: "x^2 + 5x + 6 = (x+2)(x+3)",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "방정식 풀이", description: "이차방정식을 인수분해로 풀기" },
          { field: "분수 간소화", description: "분수식의 약분" },
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
            description: "Perfect square trinomial (addition)",
          },
          {
            latex: "a^2 - 2ab + b^2 = (a-b)^2",
            description: "Perfect square trinomial (subtraction)",
          },
          {
            latex: "x^2 + (a+b)x + ab = (x+a)(x+b)",
            description: "Factoring quadratic trinomials",
          },
        ],
        examples: [
          {
            problem: "Factor x² - 9.",
            solution: "Using difference of squares: a² - b² = (a+b)(a-b)\nx² - 9 = x² - 3² = (x+3)(x-3)",
            latex: "x^2 - 9 = (x+3)(x-3)",
            difficulty: 2,
          },
          {
            problem: "Factor x² + 5x + 6.",
            solution: "Find two numbers that multiply to 6 and add to 5: 2 and 3\nSo (x+2)(x+3)",
            latex: "x^2 + 5x + 6 = (x+2)(x+3)",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Solving equations", description: "Solving quadratics by factoring" },
          { field: "Simplifying fractions", description: "Reducing algebraic fractions" },
        ],
      },
    },
    relations: {
      prerequisites: ["polynomial", "multiplication"],
      nextTopics: ["quadratic-equation"],
      related: ["expanding", "gcf"],
      applications: [],
    },
    tags: ["algebra", "polynomial", "factoring", "fundamental"],
  },
];
