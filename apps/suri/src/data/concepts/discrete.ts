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

  // ===== 8.4 불 대수와 논리 (Boolean Algebra and Logic) =====
  {
    id: "boolean-algebra",
    name: {
      ko: "불 대수",
      en: "Boolean Algebra",
      ja: "ブール代数",
    },
    field: "discrete",
    subfield: "logic",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "불 대수는 참(1)과 거짓(0) 두 값으로 이루어진 대수 체계입니다. AND, OR, NOT 연산을 기본으로 합니다.",
        formulas: [
          {
            latex: "A \\land B, \\quad A \\lor B, \\quad \\lnot A",
            description: "기본 연산 (AND, OR, NOT)",
          },
          {
            latex: "A \\land (B \\lor C) = (A \\land B) \\lor (A \\land C)",
            description: "분배법칙",
          },
          {
            latex: "\\lnot(A \\land B) = \\lnot A \\lor \\lnot B",
            description: "드모르간의 법칙",
          },
        ],
        examples: [
          {
            problem: "드모르간 법칙을 사용하여 NOT(A AND B)를 간단히 하세요.",
            solution: "NOT(A AND B) = NOT A OR NOT B",
          },
        ],
        history: {
          discoveredBy: "조지 불",
          year: "1847년",
          background:
            "불이 '논리의 수학적 분석'에서 기호 논리학의 기초를 세웠습니다.",
        },
        applications: [
          { field: "디지털 회로", description: "논리 게이트 설계" },
          { field: "프로그래밍", description: "조건문, 부울 표현식" },
          { field: "데이터베이스", description: "쿼리 조건" },
        ],
      },
      en: {
        definition:
          "Boolean algebra is an algebraic system with two values: true (1) and false (0). Based on AND, OR, NOT operations.",
        formulas: [
          {
            latex: "A \\land B, \\quad A \\lor B, \\quad \\lnot A",
            description: "Basic operations (AND, OR, NOT)",
          },
          {
            latex: "\\lnot(A \\land B) = \\lnot A \\lor \\lnot B",
            description: "De Morgan's law",
          },
        ],
        examples: [
          {
            problem: "Simplify NOT(A AND B) using De Morgan's law.",
            solution: "NOT(A AND B) = NOT A OR NOT B",
          },
        ],
        history: {
          discoveredBy: "George Boole",
          year: "1847",
          background:
            "Boole founded symbolic logic in 'The Mathematical Analysis of Logic'.",
        },
        applications: [
          { field: "Digital Circuits", description: "Logic gate design" },
          { field: "Programming", description: "Conditionals, boolean expressions" },
          { field: "Databases", description: "Query conditions" },
        ],
      },
    },
    relations: {
      prerequisites: ["sets"],
      nextTopics: ["logic-gates", "propositional-logic"],
      related: ["truth-tables"],
    },
    tags: ["불대수", "논리", "Boolean algebra", "logic"],
  },
  {
    id: "propositional-logic",
    name: {
      ko: "명제 논리",
      en: "Propositional Logic",
      ja: "命題論理",
    },
    field: "discrete",
    subfield: "logic",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "명제 논리는 참 또는 거짓인 문장(명제)과 그 논리적 연결을 다룹니다. 수학적 증명의 기초입니다.",
        formulas: [
          {
            latex: "P \\Rightarrow Q \\equiv \\lnot P \\lor Q",
            description: "조건문의 동치",
          },
          {
            latex: "P \\Leftrightarrow Q \\equiv (P \\Rightarrow Q) \\land (Q \\Rightarrow P)",
            description: "쌍조건문의 동치",
          },
          {
            latex: "(P \\Rightarrow Q) \\equiv (\\lnot Q \\Rightarrow \\lnot P)",
            description: "대우",
          },
        ],
        examples: [
          {
            problem: "'비가 오면 땅이 젖는다'의 대우를 쓰세요.",
            solution: "'땅이 젖지 않으면 비가 오지 않는다'",
          },
        ],
        applications: [
          { field: "수학", description: "정리 증명" },
          { field: "인공지능", description: "지식 표현, 추론" },
          { field: "프로그래밍", description: "조건 분기" },
        ],
      },
      en: {
        definition:
          "Propositional logic deals with statements (propositions) that are true or false and their logical connections. Foundation of mathematical proofs.",
        formulas: [
          {
            latex: "P \\Rightarrow Q \\equiv \\lnot P \\lor Q",
            description: "Implication equivalence",
          },
          {
            latex: "(P \\Rightarrow Q) \\equiv (\\lnot Q \\Rightarrow \\lnot P)",
            description: "Contrapositive",
          },
        ],
        examples: [
          {
            problem: "Write the contrapositive of 'If it rains, the ground is wet'.",
            solution: "'If the ground is not wet, it did not rain'",
          },
        ],
        applications: [
          { field: "Mathematics", description: "Theorem proving" },
          { field: "AI", description: "Knowledge representation, inference" },
          { field: "Programming", description: "Conditional branching" },
        ],
      },
    },
    relations: {
      prerequisites: ["boolean-algebra"],
      nextTopics: ["predicate-logic", "proof-techniques"],
      related: ["truth-tables"],
    },
    tags: ["명제논리", "논리학", "propositional logic", "logic"],
  },

  // ===== 8.5 추가 그래프 이론 (Advanced Graph Theory) =====
  {
    id: "trees",
    name: {
      ko: "트리",
      en: "Trees",
      ja: "木",
    },
    field: "discrete",
    subfield: "graph-theory",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "트리는 사이클이 없는 연결 그래프입니다. n개의 정점을 가진 트리는 정확히 n-1개의 간선을 가집니다.",
        formulas: [
          {
            latex: "|E| = |V| - 1",
            description: "트리의 간선 수",
          },
          {
            latex: "\\text{케일리 공식: } n^{n-2}",
            description: "n개 정점의 레이블 트리 개수",
          },
        ],
        examples: [
          {
            problem: "5개의 정점을 가진 트리의 간선 수와 레이블 트리 개수를 구하세요.",
            solution: "간선 수: 5-1 = 4개. 레이블 트리 수: 5^3 = 125개",
          },
        ],
        applications: [
          { field: "자료구조", description: "이진 탐색 트리, 힙" },
          { field: "네트워크", description: "스패닝 트리" },
          { field: "계층 구조", description: "파일 시스템, 조직도" },
        ],
      },
      en: {
        definition:
          "A tree is a connected graph with no cycles. A tree with n vertices has exactly n-1 edges.",
        formulas: [
          {
            latex: "|E| = |V| - 1",
            description: "Number of edges in a tree",
          },
          {
            latex: "\\text{Cayley's formula: } n^{n-2}",
            description: "Number of labeled trees on n vertices",
          },
        ],
        examples: [
          {
            problem: "Find the number of edges and labeled trees for 5 vertices.",
            solution: "Edges: 5-1 = 4. Labeled trees: 5^3 = 125",
          },
        ],
        applications: [
          { field: "Data Structures", description: "BST, heap" },
          { field: "Networks", description: "Spanning tree" },
          { field: "Hierarchy", description: "File systems, org charts" },
        ],
      },
    },
    relations: {
      prerequisites: ["graph-theory"],
      nextTopics: ["binary-tree", "spanning-tree"],
      related: ["forest"],
    },
    tags: ["트리", "그래프", "tree", "graph"],
  },
  {
    id: "graph-coloring",
    name: {
      ko: "그래프 색칠",
      en: "Graph Coloring",
      ja: "グラフ彩色",
    },
    field: "discrete",
    subfield: "graph-theory",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "그래프 색칠은 인접한 정점이 같은 색을 갖지 않도록 정점에 색을 배정하는 것입니다. 색채수(chromatic number)는 필요한 최소 색의 수입니다.",
        formulas: [
          {
            latex: "\\chi(G) \\leq \\Delta(G) + 1",
            description: "최대 차수 + 1 색이면 충분",
          },
          {
            latex: "\\chi(K_n) = n",
            description: "완전 그래프의 색채수",
          },
        ],
        examples: [
          {
            problem: "4정점 사이클 C₄의 색채수를 구하세요.",
            solution: "이분 그래프이므로 χ(C₄) = 2",
          },
        ],
        history: {
          discoveredBy: "프랜시스 거스리",
          year: "1852년",
          background:
            "4색 문제(평면 지도를 4색으로 칠할 수 있는가)로 시작되었습니다.",
        },
        applications: [
          { field: "스케줄링", description: "시간표 작성" },
          { field: "주파수 할당", description: "무선 통신" },
          { field: "컴파일러", description: "레지스터 할당" },
        ],
      },
      en: {
        definition:
          "Graph coloring assigns colors to vertices so adjacent vertices have different colors. Chromatic number is the minimum colors needed.",
        formulas: [
          {
            latex: "\\chi(G) \\leq \\Delta(G) + 1",
            description: "Max degree + 1 colors suffice",
          },
          {
            latex: "\\chi(K_n) = n",
            description: "Chromatic number of complete graph",
          },
        ],
        examples: [
          {
            problem: "Find the chromatic number of cycle C₄.",
            solution: "Since C₄ is bipartite, χ(C₄) = 2",
          },
        ],
        history: {
          discoveredBy: "Francis Guthrie",
          year: "1852",
          background:
            "Started with the four color problem (can any map be colored with 4 colors?).",
        },
        applications: [
          { field: "Scheduling", description: "Timetable creation" },
          { field: "Frequency Assignment", description: "Wireless communication" },
          { field: "Compilers", description: "Register allocation" },
        ],
      },
    },
    relations: {
      prerequisites: ["graph-theory"],
      nextTopics: ["planar-graphs", "four-color-theorem"],
      related: ["chromatic-polynomial"],
    },
    tags: ["그래프색칠", "색채수", "graph coloring", "chromatic"],
  },
  {
    id: "dijkstra-algorithm",
    name: {
      ko: "다익스트라 알고리즘",
      en: "Dijkstra's Algorithm",
      ja: "ダイクストラ法",
    },
    field: "discrete",
    subfield: "graph-theory",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "다익스트라 알고리즘은 가중 그래프에서 한 정점에서 다른 모든 정점까지의 최단 경로를 찾는 알고리즘입니다.",
        formulas: [
          {
            latex: "d[v] = \\min(d[v], d[u] + w(u, v))",
            description: "거리 갱신 (이완)",
          },
          {
            latex: "O((V + E) \\log V)",
            description: "우선순위 큐 사용 시 시간 복잡도",
          },
        ],
        examples: [
          {
            problem: "A-B(4), A-C(1), C-B(2), C-D(5), B-D(1)에서 A에서 D까지 최단 경로를 구하세요.",
            solution:
              "A→C(1)→B(3)→D(4)가 최단 경로. A→C→D(6)보다 짧음.",
          },
        ],
        history: {
          discoveredBy: "에츠허르 다익스트라",
          year: "1956년",
          background:
            "다익스트라가 ARMAC 컴퓨터의 네트워크 최적화를 위해 고안했습니다.",
        },
        applications: [
          { field: "내비게이션", description: "경로 탐색" },
          { field: "네트워크", description: "라우팅 프로토콜 (OSPF)" },
          { field: "게임", description: "AI 이동 경로" },
        ],
      },
      en: {
        definition:
          "Dijkstra's algorithm finds shortest paths from one vertex to all others in a weighted graph.",
        formulas: [
          {
            latex: "d[v] = \\min(d[v], d[u] + w(u, v))",
            description: "Distance update (relaxation)",
          },
          {
            latex: "O((V + E) \\log V)",
            description: "Time complexity with priority queue",
          },
        ],
        examples: [
          {
            problem: "Find shortest A→D in graph: A-B(4), A-C(1), C-B(2), C-D(5), B-D(1).",
            solution: "A→C(1)→B(3)→D(4) is shortest. A→C→D(6) is longer.",
          },
        ],
        history: {
          discoveredBy: "Edsger Dijkstra",
          year: "1956",
          background:
            "Dijkstra designed it for network optimization on the ARMAC computer.",
        },
        applications: [
          { field: "Navigation", description: "Route finding" },
          { field: "Networks", description: "Routing protocols (OSPF)" },
          { field: "Games", description: "AI pathfinding" },
        ],
      },
    },
    relations: {
      prerequisites: ["graph-theory"],
      nextTopics: ["bellman-ford", "a-star"],
      related: ["shortest-path"],
    },
    tags: ["다익스트라", "최단경로", "Dijkstra", "shortest path"],
  },

  // ===== 8.6 오토마타와 형식 언어 (Automata and Formal Languages) =====
  {
    id: "finite-automata",
    name: {
      ko: "유한 오토마타",
      en: "Finite Automata",
      ja: "有限オートマトン",
    },
    field: "discrete",
    subfield: "automata",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "유한 오토마타(FA)는 유한개의 상태를 가지고 입력에 따라 상태를 전이하는 추상적 기계입니다. 정규 언어를 인식합니다.",
        formulas: [
          {
            latex: "M = (Q, \\Sigma, \\delta, q_0, F)",
            description: "FA의 5-튜플 정의",
          },
        ],
        examples: [
          {
            problem: "0으로 시작하고 끝나는 이진 문자열을 인식하는 DFA를 설명하세요.",
            solution:
              "상태: {시작, 0본적있음, 0아닌것본적있음, 수락}. 0으로 시작해서 마지막이 0이면 수락.",
          },
        ],
        applications: [
          { field: "컴파일러", description: "어휘 분석기" },
          { field: "텍스트 처리", description: "정규표현식 매칭" },
          { field: "하드웨어", description: "순차 논리 회로" },
        ],
      },
      en: {
        definition:
          "A finite automaton (FA) is an abstract machine with finite states that transitions based on input. It recognizes regular languages.",
        formulas: [
          {
            latex: "M = (Q, \\Sigma, \\delta, q_0, F)",
            description: "5-tuple definition of FA",
          },
        ],
        examples: [
          {
            problem: "Describe a DFA recognizing binary strings starting and ending with 0.",
            solution:
              "States: {start, seen0, seenNon0, accept}. Accept if starts with 0 and last char is 0.",
          },
        ],
        applications: [
          { field: "Compilers", description: "Lexical analyzers" },
          { field: "Text Processing", description: "Regex matching" },
          { field: "Hardware", description: "Sequential logic circuits" },
        ],
      },
    },
    relations: {
      prerequisites: ["sets"],
      nextTopics: ["regular-expressions", "context-free-grammar"],
      related: ["turing-machine"],
    },
    tags: ["오토마타", "유한상태기계", "finite automata", "DFA"],
  },
  {
    id: "regular-expressions",
    name: {
      ko: "정규표현식",
      en: "Regular Expressions",
      ja: "正規表現",
    },
    field: "discrete",
    subfield: "automata",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "정규표현식은 문자열 패턴을 기술하는 형식 언어입니다. 유한 오토마타와 동등한 표현력을 가집니다.",
        formulas: [
          {
            latex: "a | b \\text{ (선택)}, \\quad ab \\text{ (연결)}, \\quad a^* \\text{ (클로저)}",
            description: "기본 연산",
          },
          {
            latex: "a+ \\equiv aa^*, \\quad a? \\equiv (\\epsilon | a)",
            description: "파생 표기법",
          },
        ],
        examples: [
          {
            problem: "모음(a, e, i, o, u)으로 시작하는 단어를 매칭하는 정규식을 쓰세요.",
            solution: "^[aeiou].*  또는 (a|e|i|o|u).*",
          },
        ],
        applications: [
          { field: "텍스트 편집", description: "찾기와 바꾸기" },
          { field: "유효성 검사", description: "이메일, 전화번호 형식" },
          { field: "로그 분석", description: "패턴 추출" },
        ],
      },
      en: {
        definition:
          "Regular expressions are a formal language for describing string patterns. They have equivalent power to finite automata.",
        formulas: [
          {
            latex: "a | b \\text{ (union)}, \\quad ab \\text{ (concat)}, \\quad a^* \\text{ (closure)}",
            description: "Basic operations",
          },
        ],
        examples: [
          {
            problem: "Write regex matching words starting with vowels (a, e, i, o, u).",
            solution: "^[aeiou].*  or (a|e|i|o|u).*",
          },
        ],
        applications: [
          { field: "Text Editing", description: "Find and replace" },
          { field: "Validation", description: "Email, phone format" },
          { field: "Log Analysis", description: "Pattern extraction" },
        ],
      },
    },
    relations: {
      prerequisites: ["sets"],
      nextTopics: ["finite-automata"],
      related: ["formal-language"],
    },
    tags: ["정규표현식", "패턴매칭", "regex", "regular expression"],
  },
  {
    id: "big-o-notation",
    name: {
      ko: "점근적 표기법 (Big-O)",
      en: "Big-O Notation",
      ja: "ビッグオー記法",
    },
    field: "discrete",
    subfield: "complexity",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "Big-O 표기법은 알고리즘의 시간/공간 복잡도를 나타내는 점근적 상한을 표현합니다.",
        formulas: [
          {
            latex: "f(n) = O(g(n)) \\Leftrightarrow \\exists c, n_0: f(n) \\leq c \\cdot g(n), \\forall n \\geq n_0",
            description: "Big-O의 정의",
          },
          {
            latex: "O(1) < O(\\log n) < O(n) < O(n \\log n) < O(n^2) < O(2^n)",
            description: "일반적인 복잡도 순서",
          },
        ],
        examples: [
          {
            problem: "3n² + 5n + 10의 Big-O를 구하세요.",
            solution:
              "최고차항이 n²이므로 O(n²). 상수와 낮은 차수 항은 무시됩니다.",
          },
        ],
        applications: [
          { field: "알고리즘 분석", description: "효율성 비교" },
          { field: "시스템 설계", description: "확장성 예측" },
          { field: "면접", description: "코딩 테스트" },
        ],
      },
      en: {
        definition:
          "Big-O notation expresses asymptotic upper bounds on algorithm time/space complexity.",
        formulas: [
          {
            latex: "f(n) = O(g(n)) \\Leftrightarrow \\exists c, n_0: f(n) \\leq c \\cdot g(n), \\forall n \\geq n_0",
            description: "Big-O definition",
          },
          {
            latex: "O(1) < O(\\log n) < O(n) < O(n \\log n) < O(n^2) < O(2^n)",
            description: "Common complexity ordering",
          },
        ],
        examples: [
          {
            problem: "Find Big-O of 3n² + 5n + 10.",
            solution:
              "Dominant term is n², so O(n²). Constants and lower terms are ignored.",
          },
        ],
        applications: [
          { field: "Algorithm Analysis", description: "Efficiency comparison" },
          { field: "System Design", description: "Scalability prediction" },
          { field: "Interviews", description: "Coding tests" },
        ],
      },
    },
    relations: {
      prerequisites: ["limit"],
      nextTopics: ["recurrence-relations", "master-theorem"],
      related: ["omega-theta-notation"],
    },
    tags: ["빅오", "시간복잡도", "Big-O", "complexity"],
  },
];
