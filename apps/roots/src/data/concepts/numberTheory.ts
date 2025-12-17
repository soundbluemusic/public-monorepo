/**
 * @fileoverview 수론 개념 데이터
 */
import type { MathConcept } from "../types";

export const numberTheoryConcepts: MathConcept[] = [
  {
    id: "prime-numbers",
    name: {
      ko: "소수",
      en: "Prime Numbers",
      ja: "素数",
    },
    field: "number-theory",
    subfield: "primes",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "소수는 1과 자기 자신만을 약수로 가지는 1보다 큰 자연수입니다. 모든 자연수는 소수의 곱으로 유일하게 표현됩니다.",
        formulas: [
          {
            latex: "\\pi(x) \\sim \\frac{x}{\\ln x}",
            description: "소수 계수 함수의 점근 추정 (소수 정리)",
          },
        ],
        examples: [
          {
            problem: "100 이하의 소수를 나열하세요.",
            solution:
              "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97 (25개)",
          },
          {
            problem: "91이 소수인지 판별하세요.",
            solution: "91 = 7 × 13이므로 소수가 아닙니다.",
          },
        ],
        history: {
          discoveredBy: "유클리드",
          year: "기원전 300년경",
          background:
            "유클리드는 소수가 무한히 많음을 증명했습니다. 이것은 역사상 가장 우아한 증명 중 하나입니다.",
        },
        applications: [
          { field: "암호학", description: "RSA 암호화의 기반" },
          { field: "해시 함수", description: "충돌 방지" },
          { field: "난수 생성", description: "선형 합동 생성기" },
        ],
      },
      en: {
        definition:
          "A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. Every natural number can be uniquely expressed as a product of primes.",
        formulas: [
          {
            latex: "\\pi(x) \\sim \\frac{x}{\\ln x}",
            description: "Prime counting function estimate (Prime Number Theorem)",
          },
        ],
        examples: [
          {
            problem: "List all primes up to 100.",
            solution:
              "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97 (25 primes)",
          },
          {
            problem: "Is 91 prime?",
            solution: "91 = 7 × 13, so it's not prime.",
          },
        ],
        history: {
          discoveredBy: "Euclid",
          year: "c. 300 BCE",
          background:
            "Euclid proved there are infinitely many primes. This is one of the most elegant proofs in history.",
        },
        applications: [
          { field: "Cryptography", description: "Foundation of RSA" },
          { field: "Hash Functions", description: "Collision avoidance" },
          { field: "Random Numbers", description: "Linear congruential generators" },
        ],
      },
    },
    relations: {
      prerequisites: ["division", "factors"],
      nextTopics: ["fundamental-theorem-arithmetic", "gcd-lcm"],
      related: ["composite-numbers"],
    },
    tags: ["소수", "정수론", "prime", "number theory"],
  },
  {
    id: "gcd-lcm",
    name: {
      ko: "최대공약수와 최소공배수",
      en: "GCD and LCM",
      ja: "最大公約数と最小公倍数",
    },
    field: "number-theory",
    subfield: "divisibility",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "최대공약수(GCD)는 두 수의 공통 약수 중 가장 큰 것이고, 최소공배수(LCM)는 공통 배수 중 가장 작은 것입니다.",
        formulas: [
          {
            latex: "\\gcd(a, b) \\times \\text{lcm}(a, b) = a \\times b",
            description: "GCD와 LCM의 관계",
          },
          {
            latex: "\\gcd(a, b) = \\gcd(b, a \\mod b)",
            description: "유클리드 호제법",
          },
        ],
        examples: [
          {
            problem: "gcd(48, 18)을 유클리드 호제법으로 구하세요.",
            solution:
              "gcd(48, 18) = gcd(18, 12) = gcd(12, 6) = gcd(6, 0) = 6",
          },
          {
            problem: "lcm(12, 18)을 구하세요.",
            solution:
              "gcd(12, 18) = 6이므로, lcm = (12 × 18) / 6 = 36",
          },
        ],
        history: {
          discoveredBy: "유클리드",
          year: "기원전 300년경",
          background:
            "유클리드의 원론에 나오는 알고리즘으로, 가장 오래된 알고리즘 중 하나입니다.",
        },
        applications: [
          { field: "분수 계산", description: "분수의 약분과 통분" },
          { field: "암호학", description: "RSA의 키 생성" },
          { field: "스케줄링", description: "주기적 이벤트 동기화" },
        ],
      },
      en: {
        definition:
          "GCD (Greatest Common Divisor) is the largest common divisor of two numbers. LCM (Least Common Multiple) is the smallest common multiple.",
        formulas: [
          {
            latex: "\\gcd(a, b) \\times \\text{lcm}(a, b) = a \\times b",
            description: "Relationship between GCD and LCM",
          },
          {
            latex: "\\gcd(a, b) = \\gcd(b, a \\mod b)",
            description: "Euclidean algorithm",
          },
        ],
        examples: [
          {
            problem: "Find gcd(48, 18) using Euclidean algorithm.",
            solution:
              "gcd(48, 18) = gcd(18, 12) = gcd(12, 6) = gcd(6, 0) = 6",
          },
          {
            problem: "Find lcm(12, 18).",
            solution:
              "gcd(12, 18) = 6, so lcm = (12 × 18) / 6 = 36",
          },
        ],
        history: {
          discoveredBy: "Euclid",
          year: "c. 300 BCE",
          background:
            "Algorithm from Euclid's Elements, one of the oldest algorithms known.",
        },
        applications: [
          { field: "Fraction Arithmetic", description: "Simplifying and adding fractions" },
          { field: "Cryptography", description: "RSA key generation" },
          { field: "Scheduling", description: "Periodic event synchronization" },
        ],
      },
    },
    relations: {
      prerequisites: ["division", "prime-numbers"],
      nextTopics: ["modular-arithmetic", "diophantine-equations"],
      related: ["euclidean-algorithm"],
    },
    tags: ["최대공약수", "최소공배수", "GCD", "LCM"],
  },
  {
    id: "fermats-little-theorem",
    name: {
      ko: "페르마의 소정리",
      en: "Fermat's Little Theorem",
      ja: "フェルマーの小定理",
    },
    field: "number-theory",
    subfield: "modular-theory",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "p가 소수이고 a가 p로 나누어지지 않으면, a^(p-1) ≡ 1 (mod p)입니다.",
        formulas: [
          {
            latex: "a^{p-1} \\equiv 1 \\pmod{p}",
            description: "페르마의 소정리",
          },
          {
            latex: "a^p \\equiv a \\pmod{p}",
            description: "페르마의 소정리 (변형)",
          },
        ],
        examples: [
          {
            problem: "2^10 mod 11을 페르마의 소정리로 구하세요.",
            solution:
              "11은 소수이고 gcd(2,11)=1이므로, 2^10 ≡ 1 (mod 11)",
          },
          {
            problem: "3^100 mod 7을 구하세요.",
            solution:
              "3^6 ≡ 1 (mod 7), 100 = 6×16 + 4이므로, 3^100 ≡ 3^4 = 81 ≡ 4 (mod 7)",
          },
        ],
        history: {
          discoveredBy: "피에르 드 페르마",
          year: "1640년",
          background:
            "페르마가 메르센에게 보낸 편지에서 처음 언급했으며, 오일러가 증명했습니다.",
        },
        applications: [
          { field: "암호학", description: "RSA 암호화, 소수 판정" },
          { field: "알고리즘", description: "빠른 거듭제곱 연산" },
        ],
      },
      en: {
        definition:
          "If p is prime and a is not divisible by p, then a^(p-1) ≡ 1 (mod p).",
        formulas: [
          {
            latex: "a^{p-1} \\equiv 1 \\pmod{p}",
            description: "Fermat's Little Theorem",
          },
          {
            latex: "a^p \\equiv a \\pmod{p}",
            description: "Fermat's Little Theorem (variant)",
          },
        ],
        examples: [
          {
            problem: "Find 2^10 mod 11 using Fermat's Little Theorem.",
            solution:
              "11 is prime and gcd(2,11)=1, so 2^10 ≡ 1 (mod 11)",
          },
          {
            problem: "Find 3^100 mod 7.",
            solution:
              "3^6 ≡ 1 (mod 7), 100 = 6×16 + 4, so 3^100 ≡ 3^4 = 81 ≡ 4 (mod 7)",
          },
        ],
        history: {
          discoveredBy: "Pierre de Fermat",
          year: "1640",
          background:
            "First mentioned in a letter to Mersenne; proved by Euler.",
        },
        applications: [
          { field: "Cryptography", description: "RSA, primality testing" },
          { field: "Algorithms", description: "Fast exponentiation" },
        ],
      },
    },
    relations: {
      prerequisites: ["modular-arithmetic", "prime-numbers"],
      nextTopics: ["eulers-theorem", "rsa"],
      related: ["chinese-remainder-theorem"],
    },
    tags: ["페르마", "소정리", "Fermat", "little theorem"],
  },
  {
    id: "fibonacci",
    name: {
      ko: "피보나치 수열",
      en: "Fibonacci Sequence",
      ja: "フィボナッチ数列",
    },
    field: "number-theory",
    subfield: "sequences",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "피보나치 수열은 앞의 두 항의 합이 다음 항이 되는 수열입니다. F(1)=1, F(2)=1, F(n)=F(n-1)+F(n-2).",
        formulas: [
          {
            latex: "F_n = F_{n-1} + F_{n-2}",
            description: "피보나치 점화식",
          },
          {
            latex: "F_n = \\frac{\\phi^n - \\psi^n}{\\sqrt{5}}",
            description: "비네 공식 (φ = 황금비)",
          },
          {
            latex: "\\lim_{n \\to \\infty} \\frac{F_{n+1}}{F_n} = \\phi = \\frac{1+\\sqrt{5}}{2}",
            description: "황금비로의 수렴",
          },
        ],
        examples: [
          {
            problem: "피보나치 수열의 처음 10개 항을 나열하세요.",
            solution: "1, 1, 2, 3, 5, 8, 13, 21, 34, 55",
          },
        ],
        history: {
          discoveredBy: "레오나르도 피보나치",
          year: "1202년",
          background:
            "피보나치가 토끼 번식 문제를 설명하면서 이 수열을 소개했습니다.",
        },
        applications: [
          { field: "자연", description: "해바라기 씨앗 배열, 조개껍질 나선" },
          { field: "금융", description: "피보나치 되돌림" },
          { field: "알고리즘", description: "피보나치 힙, 동적 프로그래밍 예제" },
        ],
      },
      en: {
        definition:
          "The Fibonacci sequence is where each term is the sum of the two preceding terms. F(1)=1, F(2)=1, F(n)=F(n-1)+F(n-2).",
        formulas: [
          {
            latex: "F_n = F_{n-1} + F_{n-2}",
            description: "Fibonacci recurrence",
          },
          {
            latex: "F_n = \\frac{\\phi^n - \\psi^n}{\\sqrt{5}}",
            description: "Binet's formula (φ = golden ratio)",
          },
          {
            latex: "\\lim_{n \\to \\infty} \\frac{F_{n+1}}{F_n} = \\phi = \\frac{1+\\sqrt{5}}{2}",
            description: "Convergence to golden ratio",
          },
        ],
        examples: [
          {
            problem: "List the first 10 Fibonacci numbers.",
            solution: "1, 1, 2, 3, 5, 8, 13, 21, 34, 55",
          },
        ],
        history: {
          discoveredBy: "Leonardo Fibonacci",
          year: "1202",
          background:
            "Fibonacci introduced this sequence while explaining rabbit breeding.",
        },
        applications: [
          { field: "Nature", description: "Sunflower seeds, shell spirals" },
          { field: "Finance", description: "Fibonacci retracement" },
          { field: "Algorithms", description: "Fibonacci heap, DP example" },
        ],
      },
    },
    relations: {
      prerequisites: ["sequences"],
      nextTopics: ["golden-ratio", "recurrence-relations"],
      related: ["lucas-numbers"],
    },
    tags: ["피보나치", "수열", "Fibonacci", "sequence"],
  },
  {
    id: "diophantine-equations",
    name: {
      ko: "디오판토스 방정식",
      en: "Diophantine Equations",
      ja: "ディオファントス方程式",
    },
    field: "number-theory",
    subfield: "equations",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "디오판토스 방정식은 정수 해만을 찾는 다항 방정식입니다. 해의 존재 여부와 모든 해를 찾는 것이 주요 문제입니다.",
        formulas: [
          {
            latex: "ax + by = c",
            description: "일차 디오판토스 방정식",
          },
          {
            latex: "\\gcd(a,b) | c \\text{이면 해가 존재}",
            description: "해의 존재 조건",
          },
          {
            latex: "x^n + y^n = z^n",
            description: "페르마의 마지막 정리 (n≥3일 때 정수해 없음)",
          },
        ],
        examples: [
          {
            problem: "3x + 5y = 1의 정수 해를 찾으세요.",
            solution:
              "확장 유클리드: 3(2) + 5(-1) = 1, 따라서 x=2, y=-1. 일반해: x=2+5t, y=-1-3t",
          },
        ],
        history: {
          discoveredBy: "디오판토스",
          year: "3세기경",
          background:
            "알렉산드리아의 디오판토스가 그의 저서 '산술'에서 이러한 문제들을 다루었습니다.",
        },
        applications: [
          { field: "암호학", description: "RSA의 확장 유클리드 알고리즘" },
          { field: "조합론", description: "동전 교환 문제" },
        ],
      },
      en: {
        definition:
          "Diophantine equations are polynomial equations seeking integer solutions. Key problems are existence and finding all solutions.",
        formulas: [
          {
            latex: "ax + by = c",
            description: "Linear Diophantine equation",
          },
          {
            latex: "\\gcd(a,b) | c \\text{ implies solution exists}",
            description: "Existence condition",
          },
          {
            latex: "x^n + y^n = z^n",
            description: "Fermat's Last Theorem (no integer solutions for n≥3)",
          },
        ],
        examples: [
          {
            problem: "Find integer solutions to 3x + 5y = 1.",
            solution:
              "Extended Euclidean: 3(2) + 5(-1) = 1, so x=2, y=-1. General: x=2+5t, y=-1-3t",
          },
        ],
        history: {
          discoveredBy: "Diophantus",
          year: "c. 3rd century",
          background:
            "Diophantus of Alexandria studied these problems in his work 'Arithmetica'.",
        },
        applications: [
          { field: "Cryptography", description: "Extended Euclidean in RSA" },
          { field: "Combinatorics", description: "Coin change problem" },
        ],
      },
    },
    relations: {
      prerequisites: ["gcd-lcm", "modular-arithmetic"],
      nextTopics: ["fermats-last-theorem"],
      related: ["linear-algebra"],
    },
    tags: ["디오판토스", "정수론", "Diophantine", "integer equations"],
  },
];
