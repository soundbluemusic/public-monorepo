/**
 * @fileoverview 기하학 개념 데이터
 */
import type { MathConcept } from "../types";

export const geometryConcepts: MathConcept[] = [
  {
    id: "pythagorean-theorem",
    name: {
      ko: "피타고라스 정리",
      en: "Pythagorean Theorem",
      ja: "ピタゴラスの定理",
    },
    field: "geometry",
    subfield: "plane-geometry",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "직각삼각형에서 빗변의 제곱은 다른 두 변의 제곱의 합과 같다.",
        formulas: [
          {
            latex: "a^2 + b^2 = c^2",
            description: "직각삼각형의 세 변 사이의 관계",
            variables: [
              { symbol: "a", meaning: "직각을 이루는 한 변 (밑변)" },
              { symbol: "b", meaning: "직각을 이루는 다른 변 (높이)" },
              { symbol: "c", meaning: "빗변 (직각의 대변, 가장 긴 변)" },
            ],
          },
        ],
        examples: [
          {
            problem: "밑변이 3, 높이가 4인 직각삼각형의 빗변의 길이를 구하시오.",
            solution:
              "c² = 3² + 4² = 9 + 16 = 25\n따라서 c = √25 = 5\n\n빗변의 길이는 5입니다.",
            latex: "c = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5",
            difficulty: 2,
          },
          {
            problem:
              "빗변이 13, 한 변이 5인 직각삼각형의 나머지 한 변의 길이를 구하시오.",
            solution:
              "5² + b² = 13²\n25 + b² = 169\nb² = 144\nb = 12\n\n나머지 변의 길이는 12입니다.",
            latex: "b = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12",
            difficulty: 3,
          },
        ],
        history: {
          discoveredBy: "피타고라스 (Pythagoras)",
          year: "기원전 6세기",
          background:
            "고대 그리스의 수학자 피타고라스가 증명한 것으로 알려져 있으나, 바빌로니아와 인도에서는 이보다 훨씬 이전에 이 관계를 알고 있었다.",
        },
        applications: [
          {
            field: "건축",
            description: "직각을 확인하고 대각선 거리를 계산하는 데 사용",
          },
          {
            field: "측량",
            description: "두 지점 사이의 직선 거리 계산",
          },
          {
            field: "컴퓨터 그래픽",
            description: "2D/3D 공간에서 거리 계산",
            conceptLink: "distance-formula",
          },
        ],
      },
      en: {
        definition:
          "In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.",
        formulas: [
          {
            latex: "a^2 + b^2 = c^2",
            description: "Relationship between the three sides of a right triangle",
            variables: [
              { symbol: "a", meaning: "One leg of the right triangle" },
              { symbol: "b", meaning: "The other leg of the right triangle" },
              { symbol: "c", meaning: "Hypotenuse (the longest side, opposite the right angle)" },
            ],
          },
        ],
        examples: [
          {
            problem:
              "Find the hypotenuse of a right triangle with legs of length 3 and 4.",
            solution:
              "c² = 3² + 4² = 9 + 16 = 25\nTherefore c = √25 = 5\n\nThe hypotenuse is 5.",
            latex: "c = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5",
            difficulty: 2,
          },
          {
            problem:
              "Find the missing leg of a right triangle with hypotenuse 13 and one leg 5.",
            solution:
              "5² + b² = 13²\n25 + b² = 169\nb² = 144\nb = 12\n\nThe missing leg is 12.",
            latex: "b = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12",
            difficulty: 3,
          },
        ],
        history: {
          discoveredBy: "Pythagoras",
          year: "6th century BCE",
          background:
            "While attributed to the Greek mathematician Pythagoras, this relationship was known to Babylonians and Indians long before.",
        },
        applications: [
          {
            field: "Architecture",
            description: "Verifying right angles and calculating diagonal distances",
          },
          {
            field: "Surveying",
            description: "Calculating straight-line distances between points",
          },
          {
            field: "Computer Graphics",
            description: "Distance calculation in 2D/3D space",
            conceptLink: "distance-formula",
          },
        ],
      },
    },
    relations: {
      prerequisites: ["right-triangle", "square-root"],
      nextTopics: ["distance-formula", "trigonometry-basics", "law-of-cosines"],
      related: ["similar-triangles", "euclidean-geometry"],
      applications: ["architecture", "surveying", "computer-graphics"],
    },
    tags: ["geometry", "triangle", "theorem", "fundamental"],
  },
  {
    id: "triangle-area",
    name: {
      ko: "삼각형의 넓이",
      en: "Area of Triangle",
      ja: "三角形の面積",
    },
    field: "geometry",
    subfield: "plane-geometry",
    difficulty: 2,
    content: {
      ko: {
        definition: "삼각형의 넓이는 밑변과 높이의 곱의 절반이다.",
        formulas: [
          {
            latex: "A = \\frac{1}{2} \\times b \\times h",
            description: "기본 공식: 밑변 × 높이 ÷ 2",
            variables: [
              { symbol: "A", meaning: "삼각형의 넓이" },
              { symbol: "b", meaning: "밑변의 길이" },
              { symbol: "h", meaning: "밑변에 대한 높이" },
            ],
          },
          {
            latex: "A = \\frac{1}{2}ab\\sin C",
            description: "두 변과 끼인각을 이용한 공식",
            variables: [
              { symbol: "a, b", meaning: "두 변의 길이" },
              { symbol: "C", meaning: "두 변 사이의 끼인각" },
            ],
          },
        ],
        examples: [
          {
            problem: "밑변이 6cm, 높이가 4cm인 삼각형의 넓이를 구하시오.",
            solution: "A = ½ × 6 × 4 = 12cm²",
            latex: "A = \\frac{1}{2} \\times 6 \\times 4 = 12\\text{cm}^2",
            difficulty: 1,
          },
          {
            problem:
              "두 변의 길이가 각각 5cm, 8cm이고 끼인각이 30°인 삼각형의 넓이를 구하시오.",
            solution:
              "A = ½ × 5 × 8 × sin30° = ½ × 5 × 8 × 0.5 = 10cm²",
            latex: "A = \\frac{1}{2} \\times 5 \\times 8 \\times \\sin 30° = 10\\text{cm}^2",
            difficulty: 3,
          },
        ],
      },
      en: {
        definition:
          "The area of a triangle is half the product of its base and height.",
        formulas: [
          {
            latex: "A = \\frac{1}{2} \\times b \\times h",
            description: "Basic formula: base × height ÷ 2",
            variables: [
              { symbol: "A", meaning: "Area of the triangle" },
              { symbol: "b", meaning: "Length of the base" },
              { symbol: "h", meaning: "Height perpendicular to the base" },
            ],
          },
          {
            latex: "A = \\frac{1}{2}ab\\sin C",
            description: "Formula using two sides and included angle",
            variables: [
              { symbol: "a, b", meaning: "Lengths of two sides" },
              { symbol: "C", meaning: "Angle between the two sides" },
            ],
          },
        ],
        examples: [
          {
            problem: "Find the area of a triangle with base 6cm and height 4cm.",
            solution: "A = ½ × 6 × 4 = 12cm²",
            latex: "A = \\frac{1}{2} \\times 6 \\times 4 = 12\\text{cm}^2",
            difficulty: 1,
          },
          {
            problem:
              "Find the area of a triangle with sides 5cm and 8cm, and included angle 30°.",
            solution:
              "A = ½ × 5 × 8 × sin30° = ½ × 5 × 8 × 0.5 = 10cm²",
            latex: "A = \\frac{1}{2} \\times 5 \\times 8 \\times \\sin 30° = 10\\text{cm}^2",
            difficulty: 3,
          },
        ],
      },
    },
    relations: {
      prerequisites: ["triangle-basics"],
      nextTopics: ["herons-formula", "polygon-area"],
      related: ["pythagorean-theorem", "trigonometry-basics"],
      applications: ["architecture", "land-surveying"],
    },
    tags: ["geometry", "triangle", "area", "fundamental"],
  },
];
