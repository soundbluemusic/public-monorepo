/**
 * @fileoverview 이산수학 개념 데이터
 */
import type { MathConcept } from "../types";

export const discreteConcepts: MathConcept[] = [
  {
    id: "sets",
    name: {
      ko: "집합",
      en: "Sets",
      ja: "集合",
    },
    field: "discrete",
    subfield: "set-theory",
    difficulty: 1,
    content: {
      ko: {
        definition:
          "집합은 명확하게 정의된 서로 다른 원소들의 모임입니다. 수학의 가장 기본적인 개념 중 하나입니다.",
        formulas: [
          {
            latex: "A \\cup B = \\{x : x \\in A \\text{ 또는 } x \\in B\\}",
            description: "합집합",
          },
          {
            latex: "A \\cap B = \\{x : x \\in A \\text{ 그리고 } x \\in B\\}",
            description: "교집합",
          },
          {
            latex: "A - B = \\{x : x \\in A \\text{ 그리고 } x \\notin B\\}",
            description: "차집합",
          },
          {
            latex: "|A \\cup B| = |A| + |B| - |A \\cap B|",
            description: "포함-배제 원리",
          },
        ],
        examples: [
          {
            problem:
              "A = {1, 2, 3}, B = {2, 3, 4}일 때 A ∪ B와 A ∩ B를 구하세요.",
            solution: "A ∪ B = {1, 2, 3, 4}, A ∩ B = {2, 3}",
          },
        ],
        history: {
          discoveredBy: "게오르크 칸토어",
          year: "1874년",
          background:
            "칸토어가 무한집합의 크기를 비교하는 방법을 연구하면서 집합론을 창시했습니다.",
        },
        applications: [
          { field: "데이터베이스", description: "SQL의 UNION, INTERSECT 연산" },
          { field: "프로그래밍", description: "Set 자료구조" },
          { field: "논리학", description: "명제의 진리집합" },
        ],
      },
      en: {
        definition:
          "A set is a collection of distinct, well-defined objects. It's one of the most fundamental concepts in mathematics.",
        formulas: [
          {
            latex: "A \\cup B = \\{x : x \\in A \\text{ or } x \\in B\\}",
            description: "Union",
          },
          {
            latex: "A \\cap B = \\{x : x \\in A \\text{ and } x \\in B\\}",
            description: "Intersection",
          },
          {
            latex: "A - B = \\{x : x \\in A \\text{ and } x \\notin B\\}",
            description: "Difference",
          },
          {
            latex: "|A \\cup B| = |A| + |B| - |A \\cap B|",
            description: "Inclusion-exclusion principle",
          },
        ],
        examples: [
          {
            problem:
              "If A = {1, 2, 3} and B = {2, 3, 4}, find A ∪ B and A ∩ B.",
            solution: "A ∪ B = {1, 2, 3, 4}, A ∩ B = {2, 3}",
          },
        ],
        history: {
          discoveredBy: "Georg Cantor",
          year: "1874",
          background:
            "Cantor founded set theory while studying how to compare sizes of infinite sets.",
        },
        applications: [
          { field: "Databases", description: "SQL UNION, INTERSECT operations" },
          { field: "Programming", description: "Set data structure" },
          { field: "Logic", description: "Truth sets of propositions" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["functions", "relations"],
      related: ["venn-diagrams"],
    },
    tags: ["집합", "이산수학", "set", "discrete math"],
  },
  {
    id: "combinations",
    name: {
      ko: "조합",
      en: "Combinations",
      ja: "組み合わせ",
    },
    field: "discrete",
    subfield: "combinatorics",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "조합은 n개 중에서 r개를 순서 없이 선택하는 경우의 수입니다.",
        formulas: [
          {
            latex: "\\binom{n}{r} = C(n, r) = \\frac{n!}{r!(n-r)!}",
            description: "조합의 공식",
          },
          {
            latex: "\\binom{n}{r} = \\binom{n}{n-r}",
            description: "대칭성",
          },
          {
            latex: "\\binom{n}{r} = \\binom{n-1}{r-1} + \\binom{n-1}{r}",
            description: "파스칼의 항등식",
          },
        ],
        examples: [
          {
            problem: "10명 중에서 3명의 대표를 뽑는 경우의 수를 구하세요.",
            solution: "C(10,3) = 10!/(3!×7!) = (10×9×8)/(3×2×1) = 120",
          },
          {
            problem: "52장의 카드에서 5장을 뽑는 경우의 수는?",
            solution: "C(52,5) = 52!/(5!×47!) = 2,598,960",
          },
        ],
        applications: [
          { field: "확률론", description: "이항분포 계산" },
          { field: "통계학", description: "표본 선택" },
          { field: "암호학", description: "키 조합" },
        ],
      },
      en: {
        definition:
          "A combination is the number of ways to select r items from n items without regard to order.",
        formulas: [
          {
            latex: "\\binom{n}{r} = C(n, r) = \\frac{n!}{r!(n-r)!}",
            description: "Combination formula",
          },
          {
            latex: "\\binom{n}{r} = \\binom{n}{n-r}",
            description: "Symmetry property",
          },
          {
            latex: "\\binom{n}{r} = \\binom{n-1}{r-1} + \\binom{n-1}{r}",
            description: "Pascal's identity",
          },
        ],
        examples: [
          {
            problem: "Find the number of ways to choose 3 representatives from 10 people.",
            solution: "C(10,3) = 10!/(3!×7!) = (10×9×8)/(3×2×1) = 120",
          },
          {
            problem: "How many 5-card hands from a 52-card deck?",
            solution: "C(52,5) = 52!/(5!×47!) = 2,598,960",
          },
        ],
        applications: [
          { field: "Probability", description: "Binomial distribution" },
          { field: "Statistics", description: "Sample selection" },
          { field: "Cryptography", description: "Key combinations" },
        ],
      },
    },
    relations: {
      prerequisites: ["factorial"],
      nextTopics: ["permutations", "binomial-theorem"],
      related: ["pascal-triangle"],
    },
    tags: ["조합", "경우의수", "combinations", "counting"],
  },
  {
    id: "permutations",
    name: {
      ko: "순열",
      en: "Permutations",
      ja: "順列",
    },
    field: "discrete",
    subfield: "combinatorics",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "순열은 n개 중에서 r개를 순서를 고려하여 나열하는 경우의 수입니다.",
        formulas: [
          {
            latex: "P(n, r) = \\frac{n!}{(n-r)!}",
            description: "순열의 공식",
          },
          {
            latex: "n! = n \\times (n-1) \\times \\cdots \\times 2 \\times 1",
            description: "팩토리얼",
          },
          {
            latex: "P(n, r) = n \\times (n-1) \\times \\cdots \\times (n-r+1)",
            description: "순열의 전개",
          },
        ],
        examples: [
          {
            problem: "5명이 일렬로 서는 경우의 수를 구하세요.",
            solution: "P(5,5) = 5! = 5×4×3×2×1 = 120",
          },
          {
            problem: "10명 중 회장, 부회장, 총무를 뽑는 경우의 수는?",
            solution: "P(10,3) = 10×9×8 = 720",
          },
        ],
        applications: [
          { field: "암호학", description: "비밀번호 경우의 수" },
          { field: "스케줄링", description: "작업 순서 배치" },
          { field: "경마", description: "순위 조합" },
        ],
      },
      en: {
        definition:
          "A permutation is the number of ways to arrange r items from n items where order matters.",
        formulas: [
          {
            latex: "P(n, r) = \\frac{n!}{(n-r)!}",
            description: "Permutation formula",
          },
          {
            latex: "n! = n \\times (n-1) \\times \\cdots \\times 2 \\times 1",
            description: "Factorial",
          },
          {
            latex: "P(n, r) = n \\times (n-1) \\times \\cdots \\times (n-r+1)",
            description: "Permutation expanded",
          },
        ],
        examples: [
          {
            problem: "Find the number of ways 5 people can line up.",
            solution: "P(5,5) = 5! = 5×4×3×2×1 = 120",
          },
          {
            problem: "Choose president, VP, secretary from 10 people.",
            solution: "P(10,3) = 10×9×8 = 720",
          },
        ],
        applications: [
          { field: "Cryptography", description: "Password possibilities" },
          { field: "Scheduling", description: "Task ordering" },
          { field: "Racing", description: "Ranking combinations" },
        ],
      },
    },
    relations: {
      prerequisites: ["factorial"],
      nextTopics: ["combinations"],
      related: ["arrangements"],
    },
    tags: ["순열", "경우의수", "permutations", "counting"],
  },
  {
    id: "graph-theory",
    name: {
      ko: "그래프 이론 기초",
      en: "Graph Theory Basics",
      ja: "グラフ理論の基礎",
    },
    field: "discrete",
    subfield: "graph-theory",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "그래프는 정점(vertex)과 간선(edge)으로 이루어진 구조입니다. 관계와 네트워크를 모델링하는 데 사용됩니다.",
        formulas: [
          {
            latex: "\\sum_{v \\in V} \\deg(v) = 2|E|",
            description: "악수 정리 (차수의 합 = 간선 수의 2배)",
          },
          {
            latex: "|V| - |E| + |F| = 2",
            description: "오일러 공식 (평면 그래프)",
          },
        ],
        examples: [
          {
            problem: "5개의 정점이 있고 모든 정점이 연결된 완전 그래프의 간선 수는?",
            solution: "완전 그래프 K₅의 간선 수 = C(5,2) = 10",
          },
        ],
        history: {
          discoveredBy: "레온하르트 오일러",
          year: "1736년",
          background:
            "오일러가 쾨니히스베르크의 다리 문제를 해결하면서 그래프 이론을 시작했습니다.",
        },
        applications: [
          { field: "소셜 네트워크", description: "친구 관계 분석" },
          { field: "네트워크", description: "라우팅 알고리즘" },
          { field: "운영 연구", description: "최단 경로, 최소 신장 트리" },
        ],
      },
      en: {
        definition:
          "A graph is a structure consisting of vertices and edges. It's used to model relationships and networks.",
        formulas: [
          {
            latex: "\\sum_{v \\in V} \\deg(v) = 2|E|",
            description: "Handshaking lemma (sum of degrees = 2 × edges)",
          },
          {
            latex: "|V| - |E| + |F| = 2",
            description: "Euler's formula (planar graphs)",
          },
        ],
        examples: [
          {
            problem: "How many edges in a complete graph with 5 vertices?",
            solution: "Complete graph K₅ has C(5,2) = 10 edges",
          },
        ],
        history: {
          discoveredBy: "Leonhard Euler",
          year: "1736",
          background:
            "Euler founded graph theory by solving the Seven Bridges of Königsberg problem.",
        },
        applications: [
          { field: "Social Networks", description: "Friend relationship analysis" },
          { field: "Networks", description: "Routing algorithms" },
          { field: "Operations Research", description: "Shortest path, MST" },
        ],
      },
    },
    relations: {
      prerequisites: ["sets"],
      nextTopics: ["trees", "graph-algorithms"],
      related: ["relations"],
    },
    tags: ["그래프", "이산수학", "graph", "network"],
  },
  {
    id: "recurrence-relations",
    name: {
      ko: "점화식",
      en: "Recurrence Relations",
      ja: "漸化式",
    },
    field: "discrete",
    subfield: "sequences",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "점화식은 수열의 항을 이전 항들로 정의하는 등식입니다. 재귀적 알고리즘의 복잡도 분석에 핵심적입니다.",
        formulas: [
          {
            latex: "a_n = a_{n-1} + a_{n-2}",
            description: "피보나치 수열의 점화식",
          },
          {
            latex: "T(n) = 2T(n/2) + n",
            description: "병합 정렬의 점화식",
          },
          {
            latex: "a_n = r \\cdot a_{n-1} \\Rightarrow a_n = a_1 \\cdot r^{n-1}",
            description: "등비수열",
          },
        ],
        examples: [
          {
            problem: "a₁ = 1, aₙ = 2aₙ₋₁ + 1일 때 처음 5개 항을 구하세요.",
            solution: "a₁=1, a₂=3, a₃=7, a₄=15, a₅=31 (aₙ = 2ⁿ - 1)",
          },
        ],
        applications: [
          { field: "알고리즘 분석", description: "시간 복잡도 계산" },
          { field: "동적 프로그래밍", description: "최적화 문제" },
          { field: "금융", description: "복리 계산" },
        ],
      },
      en: {
        definition:
          "A recurrence relation defines sequence terms using previous terms. It's essential for analyzing recursive algorithm complexity.",
        formulas: [
          {
            latex: "a_n = a_{n-1} + a_{n-2}",
            description: "Fibonacci recurrence",
          },
          {
            latex: "T(n) = 2T(n/2) + n",
            description: "Merge sort recurrence",
          },
          {
            latex: "a_n = r \\cdot a_{n-1} \\Rightarrow a_n = a_1 \\cdot r^{n-1}",
            description: "Geometric sequence",
          },
        ],
        examples: [
          {
            problem: "If a₁ = 1, aₙ = 2aₙ₋₁ + 1, find the first 5 terms.",
            solution: "a₁=1, a₂=3, a₃=7, a₄=15, a₅=31 (aₙ = 2ⁿ - 1)",
          },
        ],
        applications: [
          { field: "Algorithm Analysis", description: "Time complexity" },
          { field: "Dynamic Programming", description: "Optimization problems" },
          { field: "Finance", description: "Compound interest" },
        ],
      },
    },
    relations: {
      prerequisites: ["sequences"],
      nextTopics: ["generating-functions", "master-theorem"],
      related: ["fibonacci"],
    },
    tags: ["점화식", "재귀", "recurrence", "recursion"],
  },
  {
    id: "modular-arithmetic",
    name: {
      ko: "모듈러 연산",
      en: "Modular Arithmetic",
      ja: "合同算術",
    },
    field: "discrete",
    subfield: "number-theory",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "모듈러 연산은 나눗셈의 나머지를 기반으로 하는 연산 체계입니다. 시계 산술이라고도 합니다.",
        formulas: [
          {
            latex: "a \\equiv b \\pmod{n} \\Leftrightarrow n | (a - b)",
            description: "합동의 정의",
          },
          {
            latex: "(a + b) \\mod n = ((a \\mod n) + (b \\mod n)) \\mod n",
            description: "덧셈의 모듈러 성질",
          },
          {
            latex: "(a \\times b) \\mod n = ((a \\mod n) \\times (b \\mod n)) \\mod n",
            description: "곱셈의 모듈러 성질",
          },
        ],
        examples: [
          {
            problem: "17 mod 5를 구하세요.",
            solution: "17 = 5×3 + 2이므로, 17 mod 5 = 2",
          },
          {
            problem: "2^10 mod 7을 구하세요.",
            solution:
              "2³ ≡ 1 (mod 7)이므로, 2^10 = 2^9 × 2 = (2³)³ × 2 ≡ 1×2 = 2 (mod 7)",
          },
        ],
        applications: [
          { field: "암호학", description: "RSA 암호화" },
          { field: "해시 함수", description: "해시 테이블" },
          { field: "오류 검출", description: "체크섬, ISBN" },
        ],
      },
      en: {
        definition:
          "Modular arithmetic is a system based on remainders from division. Also called clock arithmetic.",
        formulas: [
          {
            latex: "a \\equiv b \\pmod{n} \\Leftrightarrow n | (a - b)",
            description: "Definition of congruence",
          },
          {
            latex: "(a + b) \\mod n = ((a \\mod n) + (b \\mod n)) \\mod n",
            description: "Addition modular property",
          },
          {
            latex: "(a \\times b) \\mod n = ((a \\mod n) \\times (b \\mod n)) \\mod n",
            description: "Multiplication modular property",
          },
        ],
        examples: [
          {
            problem: "Find 17 mod 5.",
            solution: "17 = 5×3 + 2, so 17 mod 5 = 2",
          },
          {
            problem: "Find 2^10 mod 7.",
            solution:
              "Since 2³ ≡ 1 (mod 7), 2^10 = 2^9 × 2 = (2³)³ × 2 ≡ 1×2 = 2 (mod 7)",
          },
        ],
        applications: [
          { field: "Cryptography", description: "RSA encryption" },
          { field: "Hash Functions", description: "Hash tables" },
          { field: "Error Detection", description: "Checksums, ISBN" },
        ],
      },
    },
    relations: {
      prerequisites: ["division"],
      nextTopics: ["chinese-remainder-theorem", "fermats-little-theorem"],
      related: ["number-theory"],
    },
    tags: ["모듈러", "나머지", "modular", "congruence"],
  },
];
