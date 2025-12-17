/**
 * @fileoverview 기초 수학 개념 데이터
 * 1.1 산술: 자연수, 정수, 유리수, 무리수, 실수, 사칙연산, 거듭제곱, 제곱근, 소수, GCD/LCM
 * 1.2 분수와 비율: 분수, 소수, 백분율, 비, 비례
 * 1.3 수 체계: 이진법, 8진법, 16진법, 복소수
 */
import type { MathConcept } from "../types";

export const foundationsConcepts: MathConcept[] = [
  // ========================================
  // 1.1 산술 (Arithmetic)
  // ========================================
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
          {
            latex: "\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}",
            description: "1부터 n까지 자연수의 합",
          },
        ],
        examples: [
          {
            problem: "다음 중 자연수를 모두 고르시오: -3, 0, 5, 2.5, 100",
            solution:
              "5와 100이 자연수입니다.\n-3은 음수, 0은 자연수가 아님, 2.5는 소수입니다.",
            difficulty: 1,
          },
          {
            problem: "1부터 10까지 자연수의 합을 구하시오.",
            solution:
              "1+2+3+4+5+6+7+8+9+10 = 55\n\n또는 공식 사용: n(n+1)/2 = 10×11/2 = 55",
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
          {
            latex: "\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}",
            description: "Sum of natural numbers from 1 to n",
          },
        ],
        examples: [
          {
            problem: "Select all natural numbers: -3, 0, 5, 2.5, 100",
            solution:
              "5 and 100 are natural numbers.\n-3 is negative, 0 is not a natural number, 2.5 is decimal.",
            difficulty: 1,
          },
          {
            problem: "Find the sum of natural numbers from 1 to 10.",
            solution:
              "1+2+3+4+5+6+7+8+9+10 = 55\n\nOr using formula: n(n+1)/2 = 10×11/2 = 55",
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
    tags: ["number", "fundamental", "counting", "arithmetic"],
  },
  {
    id: "integers",
    name: {
      ko: "정수",
      en: "Integers",
      ja: "整数",
    },
    field: "foundations",
    subfield: "arithmetic",
    difficulty: 1,
    content: {
      ko: {
        definition:
          "양의 정수(자연수), 0, 음의 정수를 모두 포함하는 수의 집합이다.",
        formulas: [
          {
            latex: "\\mathbb{Z} = \\{..., -3, -2, -1, 0, 1, 2, 3, ...\\}",
            description: "정수의 집합 표기",
          },
          {
            latex: "\\mathbb{Z} = \\mathbb{Z}^- \\cup \\{0\\} \\cup \\mathbb{Z}^+",
            description: "정수 = 음의 정수 ∪ {0} ∪ 양의 정수",
          },
        ],
        examples: [
          {
            problem: "(-7) + 3을 계산하시오.",
            solution: "(-7) + 3 = -4\n수직선에서 -7에서 오른쪽으로 3칸 이동",
            difficulty: 1,
          },
          {
            problem: "(-4) × (-5)를 계산하시오.",
            solution:
              "음수 × 음수 = 양수\n(-4) × (-5) = 20",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "온도", description: "영하 온도 표현" },
          { field: "금융", description: "수입과 지출, 이익과 손실" },
        ],
      },
      en: {
        definition:
          "The set of numbers including positive integers, zero, and negative integers.",
        formulas: [
          {
            latex: "\\mathbb{Z} = \\{..., -3, -2, -1, 0, 1, 2, 3, ...\\}",
            description: "Set notation for integers",
          },
          {
            latex:
              "\\mathbb{Z} = \\mathbb{Z}^- \\cup \\{0\\} \\cup \\mathbb{Z}^+",
            description: "Integers = negative integers ∪ {0} ∪ positive integers",
          },
        ],
        examples: [
          {
            problem: "Calculate (-7) + 3.",
            solution:
              "(-7) + 3 = -4\nOn number line, move 3 steps right from -7",
            difficulty: 1,
          },
          {
            problem: "Calculate (-4) × (-5).",
            solution: "Negative × negative = positive\n(-4) × (-5) = 20",
            difficulty: 1,
          },
        ],
        applications: [
          { field: "Temperature", description: "Expressing below-zero temperatures" },
          { field: "Finance", description: "Income and expenses, profit and loss" },
        ],
      },
    },
    relations: {
      prerequisites: ["natural-numbers"],
      nextTopics: ["rational-numbers", "arithmetic-operations"],
      related: ["absolute-value", "number-line"],
      applications: [],
    },
    tags: ["number", "fundamental", "integer", "arithmetic"],
  },
  {
    id: "rational-numbers",
    name: {
      ko: "유리수",
      en: "Rational Numbers",
      ja: "有理数",
    },
    field: "foundations",
    subfield: "arithmetic",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "두 정수의 비(분수)로 나타낼 수 있는 수이다. 유한소수 또는 순환소수로 표현된다.",
        formulas: [
          {
            latex: "\\mathbb{Q} = \\left\\{ \\frac{p}{q} : p, q \\in \\mathbb{Z}, q \\neq 0 \\right\\}",
            description: "유리수의 정의",
          },
        ],
        examples: [
          {
            problem: "3/4이 유리수인지 확인하시오.",
            solution:
              "3/4 = 0.75 (유한소수)\n두 정수 3과 4의 비이므로 유리수입니다.",
            difficulty: 1,
          },
          {
            problem: "1/3을 소수로 나타내시오.",
            solution:
              "1/3 = 0.333... = 0.\\overline{3} (순환소수)\n순환소수도 유리수입니다.",
            latex: "\\frac{1}{3} = 0.\\overline{3}",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "측정", description: "정밀한 측정값 표현" },
          { field: "확률", description: "확률값 표현" },
        ],
      },
      en: {
        definition:
          "Numbers that can be expressed as a ratio of two integers. They are represented as terminating or repeating decimals.",
        formulas: [
          {
            latex:
              "\\mathbb{Q} = \\left\\{ \\frac{p}{q} : p, q \\in \\mathbb{Z}, q \\neq 0 \\right\\}",
            description: "Definition of rational numbers",
          },
        ],
        examples: [
          {
            problem: "Verify that 3/4 is a rational number.",
            solution:
              "3/4 = 0.75 (terminating decimal)\nIt's a ratio of integers 3 and 4, so it's rational.",
            difficulty: 1,
          },
          {
            problem: "Express 1/3 as a decimal.",
            solution:
              "1/3 = 0.333... = 0.\\overline{3} (repeating decimal)\nRepeating decimals are also rational.",
            latex: "\\frac{1}{3} = 0.\\overline{3}",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Measurement", description: "Precise measurement values" },
          { field: "Probability", description: "Expressing probability values" },
        ],
      },
    },
    relations: {
      prerequisites: ["integers", "fractions"],
      nextTopics: ["irrational-numbers", "real-numbers"],
      related: ["decimals", "repeating-decimals"],
      applications: [],
    },
    tags: ["number", "fraction", "rational", "arithmetic"],
  },
  {
    id: "irrational-numbers",
    name: {
      ko: "무리수",
      en: "Irrational Numbers",
      ja: "無理数",
    },
    field: "foundations",
    subfield: "arithmetic",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "두 정수의 비로 나타낼 수 없는 실수이다. 순환하지 않는 무한소수로 표현된다.",
        formulas: [
          {
            latex: "\\sqrt{2} = 1.41421356...",
            description: "대표적인 무리수",
          },
          {
            latex: "\\pi = 3.14159265...",
            description: "원주율",
          },
          {
            latex: "e = 2.71828182...",
            description: "자연상수",
          },
        ],
        examples: [
          {
            problem: "√2가 무리수임을 설명하시오.",
            solution:
              "√2 = 1.41421356...로 순환하지 않는 무한소수입니다.\n귀류법으로 √2가 유리수가 아님을 증명할 수 있습니다.",
            difficulty: 3,
          },
          {
            problem: "다음 중 무리수를 고르시오: √4, √5, π, 22/7",
            solution:
              "√5와 π가 무리수입니다.\n√4 = 2 (정수), 22/7은 유리수입니다.",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "기하학", description: "원의 둘레와 넓이 계산" },
          { field: "건축", description: "황금비 설계" },
        ],
      },
      en: {
        definition:
          "Real numbers that cannot be expressed as a ratio of two integers. Represented as non-repeating infinite decimals.",
        formulas: [
          {
            latex: "\\sqrt{2} = 1.41421356...",
            description: "A typical irrational number",
          },
          {
            latex: "\\pi = 3.14159265...",
            description: "Pi",
          },
          {
            latex: "e = 2.71828182...",
            description: "Euler's number",
          },
        ],
        examples: [
          {
            problem: "Explain why √2 is irrational.",
            solution:
              "√2 = 1.41421356... is a non-repeating infinite decimal.\nWe can prove √2 is not rational by contradiction.",
            difficulty: 3,
          },
          {
            problem: "Select irrational numbers: √4, √5, π, 22/7",
            solution:
              "√5 and π are irrational.\n√4 = 2 (integer), 22/7 is rational.",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Geometry", description: "Circle circumference and area" },
          { field: "Architecture", description: "Golden ratio design" },
        ],
      },
    },
    relations: {
      prerequisites: ["rational-numbers"],
      nextTopics: ["real-numbers"],
      related: ["pi", "euler-number", "golden-ratio", "square-root"],
      applications: [],
    },
    tags: ["number", "irrational", "infinite-decimal", "arithmetic"],
  },
  {
    id: "real-numbers",
    name: {
      ko: "실수",
      en: "Real Numbers",
      ja: "実数",
    },
    field: "foundations",
    subfield: "arithmetic",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "유리수와 무리수를 모두 포함하는 수 체계이다. 수직선 위의 모든 점에 대응한다.",
        formulas: [
          {
            latex: "\\mathbb{R} = \\mathbb{Q} \\cup \\mathbb{I}",
            description: "실수 = 유리수 ∪ 무리수",
          },
          {
            latex: "\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}",
            description: "수 체계의 포함 관계",
          },
        ],
        examples: [
          {
            problem: "다음 수들을 분류하시오: -5, 2/3, √7, 0, π",
            solution:
              "-5: 정수\n2/3: 유리수\n√7: 무리수\n0: 정수\nπ: 무리수\n모두 실수입니다.",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "물리학", description: "연속적인 물리량 측정" },
          { field: "공학", description: "정밀 계산" },
        ],
      },
      en: {
        definition:
          "The number system including both rational and irrational numbers. Corresponds to all points on the number line.",
        formulas: [
          {
            latex: "\\mathbb{R} = \\mathbb{Q} \\cup \\mathbb{I}",
            description: "Real numbers = Rational ∪ Irrational",
          },
          {
            latex:
              "\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}",
            description: "Number system hierarchy",
          },
        ],
        examples: [
          {
            problem: "Classify these numbers: -5, 2/3, √7, 0, π",
            solution:
              "-5: integer\n2/3: rational\n√7: irrational\n0: integer\nπ: irrational\nAll are real numbers.",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Physics", description: "Continuous physical measurements" },
          { field: "Engineering", description: "Precision calculations" },
        ],
      },
    },
    relations: {
      prerequisites: ["rational-numbers", "irrational-numbers"],
      nextTopics: ["complex-numbers"],
      related: ["number-line", "absolute-value"],
      applications: [],
    },
    tags: ["number", "real", "fundamental", "arithmetic"],
  },
  {
    id: "arithmetic-operations",
    name: {
      ko: "사칙연산",
      en: "Four Basic Operations",
      ja: "四則演算",
    },
    field: "foundations",
    subfield: "arithmetic",
    difficulty: 1,
    content: {
      ko: {
        definition:
          "덧셈, 뺄셈, 곱셈, 나눗셈의 네 가지 기본 연산이다.",
        formulas: [
          {
            latex: "a + b",
            description: "덧셈 (addition)",
          },
          {
            latex: "a - b",
            description: "뺄셈 (subtraction)",
          },
          {
            latex: "a \\times b = ab",
            description: "곱셈 (multiplication)",
          },
          {
            latex: "a \\div b = \\frac{a}{b}",
            description: "나눗셈 (division, b ≠ 0)",
          },
        ],
        examples: [
          {
            problem: "15 + 27을 계산하시오.",
            solution: "15 + 27 = 42",
            difficulty: 1,
          },
          {
            problem: "연산 순서에 따라 계산: 3 + 4 × 2",
            solution:
              "곱셈을 먼저 계산: 4 × 2 = 8\n그 다음 덧셈: 3 + 8 = 11\n(괄호 → 거듭제곱 → 곱셈/나눗셈 → 덧셈/뺄셈)",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "일상", description: "계산, 돈 계산" },
          { field: "과학", description: "모든 수학적 계산의 기초" },
        ],
      },
      en: {
        definition:
          "The four basic operations: addition, subtraction, multiplication, and division.",
        formulas: [
          {
            latex: "a + b",
            description: "Addition",
          },
          {
            latex: "a - b",
            description: "Subtraction",
          },
          {
            latex: "a \\times b = ab",
            description: "Multiplication",
          },
          {
            latex: "a \\div b = \\frac{a}{b}",
            description: "Division (b ≠ 0)",
          },
        ],
        examples: [
          {
            problem: "Calculate 15 + 27.",
            solution: "15 + 27 = 42",
            difficulty: 1,
          },
          {
            problem: "Calculate following order of operations: 3 + 4 × 2",
            solution:
              "Multiplication first: 4 × 2 = 8\nThen addition: 3 + 8 = 11\n(Parentheses → Exponents → Multiplication/Division → Addition/Subtraction)",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Daily life", description: "Calculations, money" },
          { field: "Science", description: "Foundation of all mathematical calculations" },
        ],
      },
    },
    relations: {
      prerequisites: ["natural-numbers"],
      nextTopics: ["exponentiation", "order-of-operations"],
      related: ["commutative-property", "associative-property"],
      applications: [],
    },
    tags: ["operation", "fundamental", "arithmetic"],
  },
  {
    id: "exponentiation",
    name: {
      ko: "거듭제곱",
      en: "Exponentiation",
      ja: "累乗",
    },
    field: "foundations",
    subfield: "arithmetic",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "같은 수를 여러 번 곱하는 연산이다. a^n은 a를 n번 곱한 것을 의미한다.",
        formulas: [
          {
            latex: "a^n = \\underbrace{a \\times a \\times \\cdots \\times a}_{n\\text{개}}",
            description: "거듭제곱의 정의",
            variables: [
              { symbol: "a", meaning: "밑 (base)" },
              { symbol: "n", meaning: "지수 (exponent)" },
            ],
          },
          {
            latex: "a^m \\times a^n = a^{m+n}",
            description: "같은 밑의 곱",
          },
          {
            latex: "\\frac{a^m}{a^n} = a^{m-n}",
            description: "같은 밑의 나눗셈",
          },
          {
            latex: "(a^m)^n = a^{mn}",
            description: "거듭제곱의 거듭제곱",
          },
          {
            latex: "a^0 = 1 \\quad (a \\neq 0)",
            description: "0승",
          },
          {
            latex: "a^{-n} = \\frac{1}{a^n}",
            description: "음의 지수",
          },
        ],
        examples: [
          {
            problem: "2^5를 계산하시오.",
            solution: "2^5 = 2 × 2 × 2 × 2 × 2 = 32",
            latex: "2^5 = 32",
            difficulty: 1,
          },
          {
            problem: "3^4 × 3^2를 간단히 하시오.",
            solution: "지수법칙: a^m × a^n = a^{m+n}\n3^4 × 3^2 = 3^{4+2} = 3^6 = 729",
            latex: "3^4 \\times 3^2 = 3^6 = 729",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "컴퓨터", description: "2의 거듭제곱 (메모리 크기)" },
          { field: "금융", description: "복리 계산" },
        ],
      },
      en: {
        definition:
          "The operation of multiplying a number by itself multiple times. a^n means a multiplied by itself n times.",
        formulas: [
          {
            latex:
              "a^n = \\underbrace{a \\times a \\times \\cdots \\times a}_{n\\text{ times}}",
            description: "Definition of exponentiation",
            variables: [
              { symbol: "a", meaning: "base" },
              { symbol: "n", meaning: "exponent" },
            ],
          },
          {
            latex: "a^m \\times a^n = a^{m+n}",
            description: "Product of same base",
          },
          {
            latex: "\\frac{a^m}{a^n} = a^{m-n}",
            description: "Quotient of same base",
          },
          {
            latex: "(a^m)^n = a^{mn}",
            description: "Power of a power",
          },
          {
            latex: "a^0 = 1 \\quad (a \\neq 0)",
            description: "Zero exponent",
          },
          {
            latex: "a^{-n} = \\frac{1}{a^n}",
            description: "Negative exponent",
          },
        ],
        examples: [
          {
            problem: "Calculate 2^5.",
            solution: "2^5 = 2 × 2 × 2 × 2 × 2 = 32",
            latex: "2^5 = 32",
            difficulty: 1,
          },
          {
            problem: "Simplify 3^4 × 3^2.",
            solution:
              "Exponent rule: a^m × a^n = a^{m+n}\n3^4 × 3^2 = 3^{4+2} = 3^6 = 729",
            latex: "3^4 \\times 3^2 = 3^6 = 729",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Computing", description: "Powers of 2 (memory sizes)" },
          { field: "Finance", description: "Compound interest" },
        ],
      },
    },
    relations: {
      prerequisites: ["arithmetic-operations"],
      nextTopics: ["square-root", "logarithm"],
      related: ["scientific-notation"],
      applications: [],
    },
    tags: ["operation", "power", "exponent", "arithmetic"],
  },
  {
    id: "square-root",
    name: {
      ko: "제곱근",
      en: "Square Root",
      ja: "平方根",
    },
    field: "foundations",
    subfield: "arithmetic",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "어떤 수를 제곱하여 a가 되는 수를 a의 제곱근이라 한다. √a로 표기한다.",
        formulas: [
          {
            latex: "\\sqrt{a} = b \\iff b^2 = a \\quad (a \\geq 0, b \\geq 0)",
            description: "제곱근의 정의",
          },
          {
            latex: "\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}",
            description: "제곱근의 곱",
          },
          {
            latex: "\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}",
            description: "제곱근의 나눗셈",
          },
          {
            latex: "\\sqrt{a^2} = |a|",
            description: "제곱의 제곱근",
          },
        ],
        examples: [
          {
            problem: "√49를 구하시오.",
            solution: "7² = 49이므로 √49 = 7",
            difficulty: 1,
          },
          {
            problem: "√18을 간단히 하시오.",
            solution: "√18 = √(9×2) = √9 × √2 = 3√2",
            latex: "\\sqrt{18} = \\sqrt{9 \\times 2} = 3\\sqrt{2}",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "기하학", description: "피타고라스 정리에서 빗변 계산" },
          { field: "물리학", description: "속력, 에너지 계산" },
        ],
      },
      en: {
        definition:
          "The square root of a is a number that, when squared, equals a. Denoted as √a.",
        formulas: [
          {
            latex: "\\sqrt{a} = b \\iff b^2 = a \\quad (a \\geq 0, b \\geq 0)",
            description: "Definition of square root",
          },
          {
            latex: "\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}",
            description: "Product of square roots",
          },
          {
            latex: "\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}",
            description: "Quotient of square roots",
          },
          {
            latex: "\\sqrt{a^2} = |a|",
            description: "Square root of a square",
          },
        ],
        examples: [
          {
            problem: "Find √49.",
            solution: "7² = 49, so √49 = 7",
            difficulty: 1,
          },
          {
            problem: "Simplify √18.",
            solution: "√18 = √(9×2) = √9 × √2 = 3√2",
            latex: "\\sqrt{18} = \\sqrt{9 \\times 2} = 3\\sqrt{2}",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Geometry", description: "Hypotenuse in Pythagorean theorem" },
          { field: "Physics", description: "Speed, energy calculations" },
        ],
      },
    },
    relations: {
      prerequisites: ["exponentiation"],
      nextTopics: ["nth-root", "irrational-numbers"],
      related: ["pythagorean-theorem"],
      applications: [],
    },
    tags: ["operation", "root", "radical", "arithmetic"],
  },
  {
    id: "prime-numbers",
    name: {
      ko: "소수",
      en: "Prime Numbers",
      ja: "素数",
    },
    field: "foundations",
    subfield: "arithmetic",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "1과 자기 자신만을 약수로 가지는 1보다 큰 자연수이다.",
        formulas: [
          {
            latex: "p \\in \\mathbb{P} \\iff p > 1 \\text{ and } \\forall a,b \\in \\mathbb{N}: p = ab \\Rightarrow a=1 \\text{ or } b=1",
            description: "소수의 정의",
          },
        ],
        examples: [
          {
            problem: "1부터 20까지의 소수를 모두 나열하시오.",
            solution: "2, 3, 5, 7, 11, 13, 17, 19\n(1은 소수가 아님)",
            difficulty: 1,
          },
          {
            problem: "91이 소수인지 판별하시오.",
            solution:
              "91 = 7 × 13\n7과 13 이외의 약수가 있으므로 소수가 아닙니다 (합성수).",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "암호학", description: "RSA 암호화" },
          { field: "수론", description: "산술의 기본 정리" },
        ],
      },
      en: {
        definition:
          "A natural number greater than 1 whose only divisors are 1 and itself.",
        formulas: [
          {
            latex:
              "p \\in \\mathbb{P} \\iff p > 1 \\text{ and } \\forall a,b \\in \\mathbb{N}: p = ab \\Rightarrow a=1 \\text{ or } b=1",
            description: "Definition of prime numbers",
          },
        ],
        examples: [
          {
            problem: "List all prime numbers from 1 to 20.",
            solution: "2, 3, 5, 7, 11, 13, 17, 19\n(1 is not prime)",
            difficulty: 1,
          },
          {
            problem: "Determine if 91 is prime.",
            solution:
              "91 = 7 × 13\nHas divisors other than 1 and itself, so not prime (composite).",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Cryptography", description: "RSA encryption" },
          { field: "Number Theory", description: "Fundamental theorem of arithmetic" },
        ],
      },
    },
    relations: {
      prerequisites: ["natural-numbers"],
      nextTopics: ["prime-factorization", "gcd-lcm"],
      related: ["composite-numbers", "sieve-of-eratosthenes"],
      applications: [],
    },
    tags: ["number", "prime", "divisibility", "arithmetic"],
  },
  {
    id: "gcd-lcm",
    name: {
      ko: "최대공약수와 최소공배수",
      en: "GCD and LCM",
      ja: "最大公約数と最小公倍数",
    },
    field: "foundations",
    subfield: "arithmetic",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "GCD(최대공약수): 두 수의 공통 약수 중 가장 큰 수.\nLCM(최소공배수): 두 수의 공통 배수 중 가장 작은 수.",
        formulas: [
          {
            latex: "\\gcd(a, b) = \\max\\{d : d | a \\text{ and } d | b\\}",
            description: "최대공약수의 정의",
          },
          {
            latex: "\\text{lcm}(a, b) = \\min\\{m > 0 : a | m \\text{ and } b | m\\}",
            description: "최소공배수의 정의",
          },
          {
            latex: "\\gcd(a, b) \\times \\text{lcm}(a, b) = a \\times b",
            description: "GCD와 LCM의 관계",
          },
        ],
        examples: [
          {
            problem: "12와 18의 GCD와 LCM을 구하시오.",
            solution:
              "12 = 2² × 3\n18 = 2 × 3²\nGCD = 2 × 3 = 6\nLCM = 2² × 3² = 36\n검산: 6 × 36 = 216 = 12 × 18 ✓",
            difficulty: 2,
          },
          {
            problem: "유클리드 호제법으로 gcd(48, 18)을 구하시오.",
            solution:
              "48 = 18 × 2 + 12\n18 = 12 × 1 + 6\n12 = 6 × 2 + 0\n따라서 gcd(48, 18) = 6",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "분수", description: "통분과 약분" },
          { field: "스케줄링", description: "주기적 이벤트 계산" },
        ],
      },
      en: {
        definition:
          "GCD (Greatest Common Divisor): The largest number that divides both numbers.\nLCM (Least Common Multiple): The smallest positive number divisible by both.",
        formulas: [
          {
            latex: "\\gcd(a, b) = \\max\\{d : d | a \\text{ and } d | b\\}",
            description: "Definition of GCD",
          },
          {
            latex:
              "\\text{lcm}(a, b) = \\min\\{m > 0 : a | m \\text{ and } b | m\\}",
            description: "Definition of LCM",
          },
          {
            latex: "\\gcd(a, b) \\times \\text{lcm}(a, b) = a \\times b",
            description: "Relationship between GCD and LCM",
          },
        ],
        examples: [
          {
            problem: "Find GCD and LCM of 12 and 18.",
            solution:
              "12 = 2² × 3\n18 = 2 × 3²\nGCD = 2 × 3 = 6\nLCM = 2² × 3² = 36\nCheck: 6 × 36 = 216 = 12 × 18 ✓",
            difficulty: 2,
          },
          {
            problem: "Find gcd(48, 18) using Euclidean algorithm.",
            solution:
              "48 = 18 × 2 + 12\n18 = 12 × 1 + 6\n12 = 6 × 2 + 0\nTherefore gcd(48, 18) = 6",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Fractions", description: "Finding common denominators, simplifying" },
          { field: "Scheduling", description: "Calculating periodic events" },
        ],
      },
    },
    relations: {
      prerequisites: ["prime-numbers", "prime-factorization"],
      nextTopics: ["euclidean-algorithm", "modular-arithmetic"],
      related: ["divisibility"],
      applications: [],
    },
    tags: ["number", "divisor", "multiple", "arithmetic"],
  },

  // ========================================
  // 1.2 분수와 비율 (Fractions and Ratios)
  // ========================================
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
          {
            latex: "\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{ad}{bc}",
            description: "분수의 나눗셈",
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
          {
            latex: "\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{ad}{bc}",
            description: "Fraction division",
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
      prerequisites: ["natural-numbers", "arithmetic-operations"],
      nextTopics: ["decimals", "ratios", "percentages"],
      related: ["rational-numbers"],
      applications: [],
    },
    tags: ["number", "fraction", "fundamental", "fractions-ratios"],
  },
  {
    id: "decimals",
    name: {
      ko: "소수 (小數)",
      en: "Decimals",
      ja: "小数",
    },
    field: "foundations",
    subfield: "fractions-ratios",
    difficulty: 1,
    content: {
      ko: {
        definition:
          "소수점을 사용하여 1보다 작은 부분을 나타내는 수 표기법이다.",
        formulas: [
          {
            latex: "0.abc = \\frac{a}{10} + \\frac{b}{100} + \\frac{c}{1000}",
            description: "소수의 자릿값",
          },
          {
            latex: "\\frac{1}{4} = 0.25",
            description: "분수를 소수로 변환",
          },
        ],
        examples: [
          {
            problem: "3/8을 소수로 나타내시오.",
            solution: "3 ÷ 8 = 0.375",
            difficulty: 1,
          },
          {
            problem: "0.125를 분수로 나타내시오.",
            solution: "0.125 = 125/1000 = 1/8 (약분)",
            latex: "0.125 = \\frac{125}{1000} = \\frac{1}{8}",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "금융", description: "화폐 단위, 이자율" },
          { field: "과학", description: "정밀 측정값" },
        ],
      },
      en: {
        definition:
          "A number notation using decimal point to represent parts smaller than one.",
        formulas: [
          {
            latex: "0.abc = \\frac{a}{10} + \\frac{b}{100} + \\frac{c}{1000}",
            description: "Decimal place values",
          },
          {
            latex: "\\frac{1}{4} = 0.25",
            description: "Converting fraction to decimal",
          },
        ],
        examples: [
          {
            problem: "Express 3/8 as a decimal.",
            solution: "3 ÷ 8 = 0.375",
            difficulty: 1,
          },
          {
            problem: "Express 0.125 as a fraction.",
            solution: "0.125 = 125/1000 = 1/8 (simplified)",
            latex: "0.125 = \\frac{125}{1000} = \\frac{1}{8}",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Finance", description: "Currency units, interest rates" },
          { field: "Science", description: "Precise measurements" },
        ],
      },
    },
    relations: {
      prerequisites: ["fractions"],
      nextTopics: ["percentages", "scientific-notation"],
      related: ["rational-numbers", "place-value"],
      applications: [],
    },
    tags: ["number", "decimal", "notation", "fractions-ratios"],
  },
  {
    id: "percentages",
    name: {
      ko: "백분율",
      en: "Percentages",
      ja: "百分率",
    },
    field: "foundations",
    subfield: "fractions-ratios",
    difficulty: 1,
    content: {
      ko: {
        definition:
          "전체를 100으로 했을 때의 비율을 나타내는 방법이다. '%' 기호를 사용한다.",
        formulas: [
          {
            latex: "x\\% = \\frac{x}{100}",
            description: "백분율의 정의",
          },
          {
            latex: "\\text{백분율} = \\frac{\\text{부분}}{\\text{전체}} \\times 100\\%",
            description: "백분율 계산",
          },
        ],
        examples: [
          {
            problem: "80명 중 20명이 합격했다. 합격률은?",
            solution: "(20/80) × 100% = 25%",
            difficulty: 1,
          },
          {
            problem: "원가 10,000원인 상품을 20% 할인하면?",
            solution: "할인액 = 10,000 × 0.20 = 2,000원\n판매가 = 10,000 - 2,000 = 8,000원",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "금융", description: "이자율, 수익률" },
          { field: "통계", description: "비율 표현" },
        ],
      },
      en: {
        definition:
          "A way to express a ratio with the whole as 100. Uses the '%' symbol.",
        formulas: [
          {
            latex: "x\\% = \\frac{x}{100}",
            description: "Definition of percentage",
          },
          {
            latex:
              "\\text{Percentage} = \\frac{\\text{Part}}{\\text{Whole}} \\times 100\\%",
            description: "Percentage calculation",
          },
        ],
        examples: [
          {
            problem: "20 out of 80 people passed. What's the pass rate?",
            solution: "(20/80) × 100% = 25%",
            difficulty: 1,
          },
          {
            problem: "An item costs $100. After 20% discount?",
            solution:
              "Discount = 100 × 0.20 = $20\nSale price = 100 - 20 = $80",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Finance", description: "Interest rates, returns" },
          { field: "Statistics", description: "Expressing ratios" },
        ],
      },
    },
    relations: {
      prerequisites: ["fractions", "decimals"],
      nextTopics: ["ratios", "proportions"],
      related: ["statistics-basics"],
      applications: [],
    },
    tags: ["number", "percentage", "ratio", "fractions-ratios"],
  },
  {
    id: "ratios",
    name: {
      ko: "비",
      en: "Ratios",
      ja: "比",
    },
    field: "foundations",
    subfield: "fractions-ratios",
    difficulty: 1,
    content: {
      ko: {
        definition:
          "두 수의 관계를 나타내는 방법으로, a:b 또는 a/b로 표기한다.",
        formulas: [
          {
            latex: "a : b = \\frac{a}{b}",
            description: "비의 표기",
          },
          {
            latex: "a : b = ka : kb \\quad (k \\neq 0)",
            description: "비의 성질 (같은 수를 곱해도 비는 같다)",
          },
        ],
        examples: [
          {
            problem: "남학생 15명, 여학생 20명일 때 남녀 비율은?",
            solution: "15:20 = 3:4 (5로 나눔)",
            difficulty: 1,
          },
          {
            problem: "시멘트와 모래를 1:3 비율로 섞을 때, 시멘트 5kg이면 모래는?",
            solution: "1:3 = 5:x\nx = 5 × 3 = 15kg",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "요리", description: "레시피 재료 비율" },
          { field: "건축", description: "혼합비" },
        ],
      },
      en: {
        definition:
          "A way to express the relationship between two numbers, written as a:b or a/b.",
        formulas: [
          {
            latex: "a : b = \\frac{a}{b}",
            description: "Ratio notation",
          },
          {
            latex: "a : b = ka : kb \\quad (k \\neq 0)",
            description: "Ratio property (multiplying by same number keeps ratio equal)",
          },
        ],
        examples: [
          {
            problem: "15 boys and 20 girls. What's the ratio of boys to girls?",
            solution: "15:20 = 3:4 (divided by 5)",
            difficulty: 1,
          },
          {
            problem: "Cement and sand mixed 1:3. If cement is 5kg, how much sand?",
            solution: "1:3 = 5:x\nx = 5 × 3 = 15kg",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Cooking", description: "Recipe ingredient ratios" },
          { field: "Construction", description: "Mixing ratios" },
        ],
      },
    },
    relations: {
      prerequisites: ["fractions"],
      nextTopics: ["proportions", "percentages"],
      related: ["scaling", "similarity"],
      applications: [],
    },
    tags: ["ratio", "comparison", "fundamental", "fractions-ratios"],
  },
  {
    id: "proportions",
    name: {
      ko: "비례",
      en: "Proportions",
      ja: "比例",
    },
    field: "foundations",
    subfield: "fractions-ratios",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "두 비가 같을 때 비례한다고 하며, 비례식으로 나타낸다.",
        formulas: [
          {
            latex: "a : b = c : d \\iff ad = bc",
            description: "비례식의 성질 (내항의 곱 = 외항의 곱)",
          },
          {
            latex: "y = kx",
            description: "정비례 (k: 비례상수)",
          },
          {
            latex: "y = \\frac{k}{x}",
            description: "반비례",
          },
        ],
        examples: [
          {
            problem: "2:3 = x:12일 때 x를 구하시오.",
            solution: "내항의 곱 = 외항의 곱\n3 × x = 2 × 12\n3x = 24\nx = 8",
            difficulty: 2,
          },
          {
            problem: "y가 x에 정비례하고 x=2일 때 y=6이면, x=5일 때 y는?",
            solution: "y = kx, 6 = k×2, k = 3\ny = 3x\nx=5일 때, y = 3×5 = 15",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "물리학", description: "훅의 법칙, 옴의 법칙" },
          { field: "지도", description: "축척 계산" },
        ],
      },
      en: {
        definition:
          "When two ratios are equal, they are proportional, expressed as a proportion.",
        formulas: [
          {
            latex: "a : b = c : d \\iff ad = bc",
            description: "Cross multiplication property",
          },
          {
            latex: "y = kx",
            description: "Direct proportion (k: constant of proportionality)",
          },
          {
            latex: "y = \\frac{k}{x}",
            description: "Inverse proportion",
          },
        ],
        examples: [
          {
            problem: "If 2:3 = x:12, find x.",
            solution:
              "Cross multiply\n3 × x = 2 × 12\n3x = 24\nx = 8",
            difficulty: 2,
          },
          {
            problem:
              "y is directly proportional to x. If y=6 when x=2, find y when x=5.",
            solution: "y = kx, 6 = k×2, k = 3\ny = 3x\nWhen x=5, y = 3×5 = 15",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Physics", description: "Hooke's law, Ohm's law" },
          { field: "Maps", description: "Scale calculations" },
        ],
      },
    },
    relations: {
      prerequisites: ["ratios"],
      nextTopics: ["linear-functions", "variation"],
      related: ["scaling", "similarity"],
      applications: [],
    },
    tags: ["proportion", "ratio", "relationship", "fractions-ratios"],
  },

  // ========================================
  // 1.3 수 체계 (Number Systems)
  // ========================================
  {
    id: "binary-system",
    name: {
      ko: "이진법",
      en: "Binary System",
      ja: "二進法",
    },
    field: "foundations",
    subfield: "number-systems",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "0과 1 두 개의 숫자만 사용하는 수 체계이다. 컴퓨터의 기본 연산 체계이다.",
        formulas: [
          {
            latex: "(1011)_2 = 1 \\times 2^3 + 0 \\times 2^2 + 1 \\times 2^1 + 1 \\times 2^0 = 11_{10}",
            description: "이진수를 십진수로 변환",
          },
        ],
        examples: [
          {
            problem: "이진수 1101을 십진수로 변환하시오.",
            solution:
              "1×2³ + 1×2² + 0×2¹ + 1×2⁰\n= 8 + 4 + 0 + 1 = 13",
            difficulty: 2,
          },
          {
            problem: "십진수 25를 이진수로 변환하시오.",
            solution:
              "25 ÷ 2 = 12 ... 1\n12 ÷ 2 = 6 ... 0\n6 ÷ 2 = 3 ... 0\n3 ÷ 2 = 1 ... 1\n1 ÷ 2 = 0 ... 1\n아래에서 위로 읽으면: 11001",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "컴퓨터", description: "디지털 회로, 데이터 저장" },
          { field: "통신", description: "디지털 신호" },
        ],
      },
      en: {
        definition:
          "A number system using only two digits: 0 and 1. The fundamental system for computer operations.",
        formulas: [
          {
            latex:
              "(1011)_2 = 1 \\times 2^3 + 0 \\times 2^2 + 1 \\times 2^1 + 1 \\times 2^0 = 11_{10}",
            description: "Converting binary to decimal",
          },
        ],
        examples: [
          {
            problem: "Convert binary 1101 to decimal.",
            solution: "1×2³ + 1×2² + 0×2¹ + 1×2⁰\n= 8 + 4 + 0 + 1 = 13",
            difficulty: 2,
          },
          {
            problem: "Convert decimal 25 to binary.",
            solution:
              "25 ÷ 2 = 12 ... 1\n12 ÷ 2 = 6 ... 0\n6 ÷ 2 = 3 ... 0\n3 ÷ 2 = 1 ... 1\n1 ÷ 2 = 0 ... 1\nRead bottom to top: 11001",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Computing", description: "Digital circuits, data storage" },
          { field: "Communications", description: "Digital signals" },
        ],
      },
    },
    relations: {
      prerequisites: ["natural-numbers", "exponentiation"],
      nextTopics: ["octal-system", "hexadecimal-system"],
      related: ["boolean-algebra", "bit-operations"],
      applications: [],
    },
    tags: ["number-system", "binary", "computer", "number-systems"],
  },
  {
    id: "octal-system",
    name: {
      ko: "8진법",
      en: "Octal System",
      ja: "八進法",
    },
    field: "foundations",
    subfield: "number-systems",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "0부터 7까지 8개의 숫자를 사용하는 수 체계이다.",
        formulas: [
          {
            latex: "(175)_8 = 1 \\times 8^2 + 7 \\times 8^1 + 5 \\times 8^0 = 125_{10}",
            description: "8진수를 10진수로 변환",
          },
        ],
        examples: [
          {
            problem: "8진수 73을 10진수로 변환하시오.",
            solution: "7×8¹ + 3×8⁰ = 56 + 3 = 59",
            difficulty: 2,
          },
          {
            problem: "10진수 100을 8진수로 변환하시오.",
            solution:
              "100 ÷ 8 = 12 ... 4\n12 ÷ 8 = 1 ... 4\n1 ÷ 8 = 0 ... 1\n결과: 144₈",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Unix", description: "파일 권한 (chmod)" },
          { field: "프로그래밍", description: "문자 이스케이프 시퀀스" },
        ],
      },
      en: {
        definition: "A number system using 8 digits from 0 to 7.",
        formulas: [
          {
            latex:
              "(175)_8 = 1 \\times 8^2 + 7 \\times 8^1 + 5 \\times 8^0 = 125_{10}",
            description: "Converting octal to decimal",
          },
        ],
        examples: [
          {
            problem: "Convert octal 73 to decimal.",
            solution: "7×8¹ + 3×8⁰ = 56 + 3 = 59",
            difficulty: 2,
          },
          {
            problem: "Convert decimal 100 to octal.",
            solution:
              "100 ÷ 8 = 12 ... 4\n12 ÷ 8 = 1 ... 4\n1 ÷ 8 = 0 ... 1\nResult: 144₈",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Unix", description: "File permissions (chmod)" },
          { field: "Programming", description: "Character escape sequences" },
        ],
      },
    },
    relations: {
      prerequisites: ["binary-system"],
      nextTopics: ["hexadecimal-system"],
      related: ["number-base-conversion"],
      applications: [],
    },
    tags: ["number-system", "octal", "computer", "number-systems"],
  },
  {
    id: "hexadecimal-system",
    name: {
      ko: "16진법",
      en: "Hexadecimal System",
      ja: "十六進法",
    },
    field: "foundations",
    subfield: "number-systems",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "0-9와 A-F(10-15)를 사용하는 16개의 숫자 체계이다. 컴퓨터에서 널리 사용된다.",
        formulas: [
          {
            latex: "(2F)_{16} = 2 \\times 16^1 + 15 \\times 16^0 = 32 + 15 = 47_{10}",
            description: "16진수를 10진수로 변환",
          },
        ],
        examples: [
          {
            problem: "16진수 A5를 10진수로 변환하시오.",
            solution: "A(10)×16¹ + 5×16⁰ = 160 + 5 = 165",
            difficulty: 2,
          },
          {
            problem: "10진수 255를 16진수로 변환하시오.",
            solution: "255 ÷ 16 = 15 ... 15\n15 = F, 15 = F\n결과: FF₁₆",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "웹", description: "색상 코드 (#FF0000)" },
          { field: "프로그래밍", description: "메모리 주소, 바이트 표현" },
        ],
      },
      en: {
        definition:
          "A 16-digit number system using 0-9 and A-F (10-15). Widely used in computing.",
        formulas: [
          {
            latex:
              "(2F)_{16} = 2 \\times 16^1 + 15 \\times 16^0 = 32 + 15 = 47_{10}",
            description: "Converting hexadecimal to decimal",
          },
        ],
        examples: [
          {
            problem: "Convert hexadecimal A5 to decimal.",
            solution: "A(10)×16¹ + 5×16⁰ = 160 + 5 = 165",
            difficulty: 2,
          },
          {
            problem: "Convert decimal 255 to hexadecimal.",
            solution: "255 ÷ 16 = 15 ... 15\n15 = F, 15 = F\nResult: FF₁₆",
            difficulty: 2,
          },
        ],
        applications: [
          { field: "Web", description: "Color codes (#FF0000)" },
          { field: "Programming", description: "Memory addresses, byte representation" },
        ],
      },
    },
    relations: {
      prerequisites: ["binary-system"],
      nextTopics: ["bit-manipulation"],
      related: ["color-theory", "memory-addressing"],
      applications: [],
    },
    tags: ["number-system", "hexadecimal", "computer", "number-systems"],
  },
  {
    id: "complex-numbers",
    name: {
      ko: "복소수",
      en: "Complex Numbers",
      ja: "複素数",
    },
    field: "foundations",
    subfield: "number-systems",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "실수부와 허수부로 이루어진 수이다. a + bi 형태로 표현한다 (i² = -1).",
        formulas: [
          {
            latex: "z = a + bi",
            description: "복소수의 표준형",
            variables: [
              { symbol: "a", meaning: "실수부 (Real part)" },
              { symbol: "b", meaning: "허수부 (Imaginary part)" },
              { symbol: "i", meaning: "허수단위 (i² = -1)" },
            ],
          },
          {
            latex: "i^2 = -1",
            description: "허수단위의 정의",
          },
          {
            latex: "|z| = \\sqrt{a^2 + b^2}",
            description: "복소수의 절댓값 (크기)",
          },
          {
            latex: "\\bar{z} = a - bi",
            description: "켤레복소수",
          },
          {
            latex: "(a + bi)(c + di) = (ac - bd) + (ad + bc)i",
            description: "복소수의 곱셈",
          },
        ],
        examples: [
          {
            problem: "(3 + 2i) + (1 - 4i)를 계산하시오.",
            solution:
              "실수부끼리, 허수부끼리 더합니다.\n(3+1) + (2-4)i = 4 - 2i",
            difficulty: 2,
          },
          {
            problem: "(2 + i)(3 - 2i)를 계산하시오.",
            solution:
              "= 6 - 4i + 3i - 2i²\n= 6 - i - 2(-1)\n= 6 - i + 2\n= 8 - i",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "전기공학", description: "교류 회로 분석" },
          { field: "양자역학", description: "파동함수" },
        ],
      },
      en: {
        definition:
          "Numbers with real and imaginary parts. Expressed as a + bi (i² = -1).",
        formulas: [
          {
            latex: "z = a + bi",
            description: "Standard form of complex number",
            variables: [
              { symbol: "a", meaning: "Real part" },
              { symbol: "b", meaning: "Imaginary part" },
              { symbol: "i", meaning: "Imaginary unit (i² = -1)" },
            ],
          },
          {
            latex: "i^2 = -1",
            description: "Definition of imaginary unit",
          },
          {
            latex: "|z| = \\sqrt{a^2 + b^2}",
            description: "Absolute value (magnitude) of complex number",
          },
          {
            latex: "\\bar{z} = a - bi",
            description: "Complex conjugate",
          },
          {
            latex: "(a + bi)(c + di) = (ac - bd) + (ad + bc)i",
            description: "Complex multiplication",
          },
        ],
        examples: [
          {
            problem: "Calculate (3 + 2i) + (1 - 4i).",
            solution:
              "Add real parts and imaginary parts separately.\n(3+1) + (2-4)i = 4 - 2i",
            difficulty: 2,
          },
          {
            problem: "Calculate (2 + i)(3 - 2i).",
            solution:
              "= 6 - 4i + 3i - 2i²\n= 6 - i - 2(-1)\n= 6 - i + 2\n= 8 - i",
            difficulty: 3,
          },
        ],
        applications: [
          { field: "Electrical Engineering", description: "AC circuit analysis" },
          { field: "Quantum Mechanics", description: "Wave functions" },
        ],
      },
    },
    relations: {
      prerequisites: ["real-numbers", "square-root"],
      nextTopics: ["complex-plane", "polar-form", "euler-formula"],
      related: ["quadratic-equations", "fundamental-theorem-algebra"],
      applications: [],
    },
    tags: ["number", "complex", "imaginary", "number-systems"],
  },
];
