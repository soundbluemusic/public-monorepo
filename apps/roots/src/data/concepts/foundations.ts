/**
 * @fileoverview 기초 수학 개념 데이터
 */
import type { MathConcept } from "../types";

export const foundationsConcepts: MathConcept[] = [
  {
    id: "natural-numbers",
    name: {
      ko: "자연수",
      en: "Natural Numbers",
      ja: "自然数",
    },
    field: "foundations",
    subfield: "arithmetic",
    difficulty: 1,
    content: {
      ko: {
        definition: "1, 2, 3, 4, ... 처럼 물건을 셀 때 사용하는 양의 정수이다.",
        formulas: [
          {
            latex: "\\mathbb{N} = \\{1, 2, 3, 4, 5, ...\\}",
            description: "자연수의 집합 표기",
          },
        ],
        examples: [
          {
            problem: "다음 중 자연수를 모두 고르시오: -3, 0, 5, 2.5, 100",
            solution: "5와 100이 자연수입니다.\n-3은 음수, 0은 자연수가 아님, 2.5는 소수입니다.",
            difficulty: 1,
          },
          {
            problem: "1부터 10까지 자연수의 합을 구하시오.",
            solution: "1+2+3+4+5+6+7+8+9+10 = 55\n\n또는 공식 사용: n(n+1)/2 = 10×11/2 = 55",
            latex: "\\sum_{k=1}^{10} k = \\frac{10 \\times 11}{2} = 55",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "일상생활", description: "물건 개수 세기" },
          { field: "컴퓨터", description: "배열 인덱스, 반복 횟수" },
        ],
      },
      en: {
        definition: "Positive integers used for counting: 1, 2, 3, 4, ...",
        formulas: [
          {
            latex: "\\mathbb{N} = \\{1, 2, 3, 4, 5, ...\\}",
            description: "Set notation for natural numbers",
          },
        ],
        examples: [
          {
            problem: "Select all natural numbers: -3, 0, 5, 2.5, 100",
            solution: "5 and 100 are natural numbers.\n-3 is negative, 0 is not a natural number, 2.5 is decimal.",
            difficulty: 1,
          },
          {
            problem: "Find the sum of natural numbers from 1 to 10.",
            solution: "1+2+3+4+5+6+7+8+9+10 = 55\n\nOr using formula: n(n+1)/2 = 10×11/2 = 55",
            latex: "\\sum_{k=1}^{10} k = \\frac{10 \\times 11}{2} = 55",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Daily life", description: "Counting objects" },
          { field: "Computing", description: "Array indices, loop counts" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["integers", "arithmetic-operations"],
      related: ["whole-numbers", "counting"],
      applications: [],
    },
    tags: ["number", "fundamental", "counting"],
  },
  {
    id: "fractions",
    name: {
      ko: "분수",
      en: "Fractions",
      ja: "分数",
    },
    field: "foundations",
    subfield: "fractions-ratios",
    difficulty: 1,
    content: {
      ko: {
        definition: "전체를 똑같이 나눈 것 중 일부를 나타내는 수이다.",
        formulas: [
          {
            latex: "\\frac{a}{b}",
            description: "분수의 기본 형태",
            variables: [
              { symbol: "a", meaning: "분자 (나눈 것 중 취한 부분)" },
              { symbol: "b", meaning: "분모 (전체를 나눈 수, b≠0)" },
            ],
          },
          {
            latex: "\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}",
            description: "분수의 덧셈",
          },
          {
            latex: "\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}",
            description: "분수의 곱셈",
          },
        ],
        examples: [
          {
            problem: "1/2 + 1/3을 계산하시오.",
            solution: "통분: 1/2 = 3/6, 1/3 = 2/6\n따라서 3/6 + 2/6 = 5/6",
            latex: "\\frac{1}{2} + \\frac{1}{3} = \\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}",
            difficulty: 1,
          },
          {
            problem: "2/3 × 3/4를 계산하시오.",
            solution: "분자끼리, 분모끼리 곱합니다.\n2×3 = 6, 3×4 = 12\n6/12 = 1/2 (약분)",
            latex: "\\frac{2}{3} \\times \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "요리", description: "재료 비율 계산" },
          { field: "음악", description: "박자와 음표 길이" },
        ],
      },
      en: {
        definition: "A number representing part of a whole divided into equal parts.",
        formulas: [
          {
            latex: "\\frac{a}{b}",
            description: "Basic fraction form",
            variables: [
              { symbol: "a", meaning: "Numerator (parts taken)" },
              { symbol: "b", meaning: "Denominator (total parts, b≠0)" },
            ],
          },
          {
            latex: "\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}",
            description: "Fraction addition",
          },
          {
            latex: "\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}",
            description: "Fraction multiplication",
          },
        ],
        examples: [
          {
            problem: "Calculate 1/2 + 1/3.",
            solution: "Common denominator: 1/2 = 3/6, 1/3 = 2/6\nSo 3/6 + 2/6 = 5/6",
            latex: "\\frac{1}{2} + \\frac{1}{3} = \\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}",
            difficulty: 1,
          },
          {
            problem: "Calculate 2/3 × 3/4.",
            solution: "Multiply numerators and denominators.\n2×3 = 6, 3×4 = 12\n6/12 = 1/2 (simplified)",
            latex: "\\frac{2}{3} \\times \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "Cooking", description: "Recipe proportions" },
          { field: "Music", description: "Time signatures and note durations" },
        ],
      },
    },
    relations: {
      prerequisites: ["natural-numbers"],
      nextTopics: ["decimals", "ratios", "percentages"],
      related: ["division"],
      applications: [],
    },
    tags: ["number", "fundamental", "fraction"],
  },
];
