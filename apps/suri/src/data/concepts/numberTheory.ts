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

  // ===== 9.4 추가 정수론 (Additional Number Theory) =====
  {
    id: "eulers-theorem",
    name: {
      ko: "오일러 정리",
      en: "Euler's Theorem",
      ja: "オイラーの定理",
    },
    field: "number-theory",
    subfield: "modular-theory",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "오일러 정리는 페르마 소정리의 일반화입니다. a와 n이 서로소이면, a^φ(n) ≡ 1 (mod n)입니다.",
        formulas: [
          {
            latex: "a^{\\phi(n)} \\equiv 1 \\pmod{n}",
            description: "오일러 정리",
          },
          {
            latex: "\\phi(n) = n \\prod_{p|n} \\left(1 - \\frac{1}{p}\\right)",
            description: "오일러 피 함수",
          },
          {
            latex: "\\phi(p) = p - 1 \\text{ (p가 소수일 때)}",
            description: "소수의 오일러 피 함수",
          },
        ],
        examples: [
          {
            problem: "φ(12)를 구하세요.",
            solution:
              "12 = 2² × 3이므로, φ(12) = 12(1-1/2)(1-1/3) = 12 × 1/2 × 2/3 = 4",
          },
          {
            problem: "7^100 mod 10을 구하세요.",
            solution:
              "gcd(7, 10) = 1, φ(10) = 4이므로 7^4 ≡ 1 (mod 10)\n100 = 4×25이므로, 7^100 = (7^4)^25 ≡ 1 (mod 10)",
          },
        ],
        history: {
          discoveredBy: "레온하르트 오일러",
          year: "1763년",
          background:
            "페르마 소정리를 일반 정수로 확장한 중요한 정리입니다.",
        },
        applications: [
          { field: "암호학", description: "RSA 암호화의 핵심" },
          { field: "수론", description: "모듈러 역원 계산" },
        ],
      },
      en: {
        definition:
          "Euler's theorem generalizes Fermat's Little Theorem. If a and n are coprime, then a^φ(n) ≡ 1 (mod n).",
        formulas: [
          {
            latex: "a^{\\phi(n)} \\equiv 1 \\pmod{n}",
            description: "Euler's theorem",
          },
          {
            latex: "\\phi(n) = n \\prod_{p|n} \\left(1 - \\frac{1}{p}\\right)",
            description: "Euler's totient function",
          },
        ],
        examples: [
          {
            problem: "Find φ(12).",
            solution:
              "12 = 2² × 3, so φ(12) = 12(1-1/2)(1-1/3) = 12 × 1/2 × 2/3 = 4",
          },
        ],
        history: {
          discoveredBy: "Leonhard Euler",
          year: "1763",
          background:
            "Extended Fermat's Little Theorem to general integers.",
        },
        applications: [
          { field: "Cryptography", description: "Core of RSA encryption" },
          { field: "Number Theory", description: "Computing modular inverse" },
        ],
      },
    },
    relations: {
      prerequisites: ["fermats-little-theorem", "gcd-lcm"],
      nextTopics: ["rsa"],
      related: ["chinese-remainder-theorem"],
    },
    tags: ["오일러정리", "오일러피함수", "Euler theorem", "totient"],
  },
  {
    id: "chinese-remainder-theorem",
    name: {
      ko: "중국인 나머지 정리",
      en: "Chinese Remainder Theorem",
      ja: "中国剰余定理",
    },
    field: "number-theory",
    subfield: "modular-theory",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "중국인 나머지 정리(CRT)는 서로소인 모듈러들에 대한 연립 합동식의 유일한 해가 존재함을 보장합니다.",
        formulas: [
          {
            latex: "x \\equiv a_1 \\pmod{m_1}, \\quad x \\equiv a_2 \\pmod{m_2}",
            description: "연립 합동식",
          },
          {
            latex: "\\gcd(m_1, m_2) = 1 \\Rightarrow \\text{해가 } m_1 m_2 \\text{ mod 내에서 유일}",
            description: "해의 유일성",
          },
        ],
        examples: [
          {
            problem: "x ≡ 2 (mod 3), x ≡ 3 (mod 5)를 풀이하세요.",
            solution:
              "x = 3k + 2. 3k + 2 ≡ 3 (mod 5) → 3k ≡ 1 (mod 5) → k ≡ 2 (mod 5).\nx = 3(5j + 2) + 2 = 15j + 8. x ≡ 8 (mod 15)",
          },
        ],
        history: {
          discoveredBy: "손자 (중국 수학자)",
          year: "3세기경",
          background:
            "손자산경에 처음 등장한 문제로, 동양 수학의 중요한 업적입니다.",
        },
        applications: [
          { field: "암호학", description: "RSA의 효율적 계산" },
          { field: "컴퓨터 과학", description: "큰 수 연산 최적화" },
          { field: "달력", description: "간지 계산" },
        ],
      },
      en: {
        definition:
          "The Chinese Remainder Theorem (CRT) guarantees a unique solution to simultaneous congruences with coprime moduli.",
        formulas: [
          {
            latex: "x \\equiv a_1 \\pmod{m_1}, \\quad x \\equiv a_2 \\pmod{m_2}",
            description: "System of congruences",
          },
          {
            latex: "\\gcd(m_1, m_2) = 1 \\Rightarrow \\text{unique solution mod } m_1 m_2",
            description: "Uniqueness of solution",
          },
        ],
        examples: [
          {
            problem: "Solve x ≡ 2 (mod 3), x ≡ 3 (mod 5).",
            solution: "x ≡ 8 (mod 15)",
          },
        ],
        history: {
          discoveredBy: "Sun Tzu (Chinese mathematician)",
          year: "c. 3rd century",
          background:
            "First appeared in Sun Tzu Suan Ching, important achievement in Eastern mathematics.",
        },
        applications: [
          { field: "Cryptography", description: "Efficient RSA computation" },
          { field: "Computer Science", description: "Large number optimization" },
          { field: "Calendars", description: "Sexagenary cycle calculation" },
        ],
      },
    },
    relations: {
      prerequisites: ["modular-arithmetic", "gcd-lcm"],
      nextTopics: ["rsa"],
      related: ["eulers-theorem"],
    },
    tags: ["중국인나머지정리", "CRT", "Chinese Remainder Theorem"],
  },
  {
    id: "quadratic-residue",
    name: {
      ko: "이차잉여",
      en: "Quadratic Residue",
      ja: "平方剰余",
    },
    field: "number-theory",
    subfield: "modular-theory",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "a가 mod n의 이차잉여이면, x² ≡ a (mod n)인 x가 존재합니다. 르장드르 기호로 판별합니다.",
        formulas: [
          {
            latex: "\\left(\\frac{a}{p}\\right) = \\begin{cases} 1 & \\text{이차잉여} \\\\ -1 & \\text{이차비잉여} \\\\ 0 & p|a \\end{cases}",
            description: "르장드르 기호",
          },
          {
            latex: "\\left(\\frac{a}{p}\\right) = a^{(p-1)/2} \\pmod{p}",
            description: "오일러 판정법",
          },
        ],
        examples: [
          {
            problem: "2가 mod 7의 이차잉여인지 판별하세요.",
            solution:
              "2^((7-1)/2) = 2³ = 8 ≡ 1 (mod 7)이므로 이차잉여입니다.\n실제로 3² = 9 ≡ 2 (mod 7)",
          },
        ],
        applications: [
          { field: "암호학", description: "이차잉여 기반 암호" },
          { field: "수론", description: "이차 상호법칙" },
        ],
      },
      en: {
        definition:
          "a is a quadratic residue mod n if x² ≡ a (mod n) has a solution. Determined by the Legendre symbol.",
        formulas: [
          {
            latex: "\\left(\\frac{a}{p}\\right) = a^{(p-1)/2} \\pmod{p}",
            description: "Euler's criterion",
          },
        ],
        examples: [
          {
            problem: "Is 2 a quadratic residue mod 7?",
            solution:
              "2^((7-1)/2) = 2³ = 8 ≡ 1 (mod 7), so yes.\n3² = 9 ≡ 2 (mod 7)",
          },
        ],
        applications: [
          { field: "Cryptography", description: "Quadratic residue-based encryption" },
          { field: "Number Theory", description: "Quadratic reciprocity" },
        ],
      },
    },
    relations: {
      prerequisites: ["modular-arithmetic", "eulers-theorem"],
      nextTopics: ["quadratic-reciprocity"],
      related: ["legendre-symbol"],
    },
    tags: ["이차잉여", "르장드르", "quadratic residue", "Legendre"],
  },
  {
    id: "perfect-numbers",
    name: {
      ko: "완전수",
      en: "Perfect Numbers",
      ja: "完全数",
    },
    field: "number-theory",
    subfield: "classical",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "완전수는 자신을 제외한 약수들의 합이 자기 자신과 같은 양의 정수입니다. 예: 6 = 1+2+3",
        formulas: [
          {
            latex: "\\sigma(n) - n = n \\Leftrightarrow \\sigma(n) = 2n",
            description: "완전수의 정의 (σ는 약수 합 함수)",
          },
          {
            latex: "2^{p-1}(2^p - 1) \\text{ (}2^p - 1\\text{이 소수일 때)}",
            description: "짝수 완전수의 형태 (유클리드-오일러)",
          },
        ],
        examples: [
          {
            problem: "28이 완전수임을 확인하세요.",
            solution:
              "28의 약수: 1, 2, 4, 7, 14, 28. 1+2+4+7+14 = 28 ✓",
          },
          {
            problem: "가장 작은 4개의 완전수를 나열하세요.",
            solution: "6, 28, 496, 8128",
          },
        ],
        history: {
          discoveredBy: "고대 그리스",
          year: "기원전",
          background:
            "피타고라스학파가 완전수를 신비로운 수로 여겼습니다.",
        },
        applications: [
          { field: "수론", description: "메르센 소수와의 연결" },
          { field: "수학사", description: "고대부터 연구된 주제" },
        ],
      },
      en: {
        definition:
          "A perfect number equals the sum of its proper divisors. Example: 6 = 1+2+3",
        formulas: [
          {
            latex: "\\sigma(n) = 2n",
            description: "Perfect number definition (σ is divisor sum)",
          },
          {
            latex: "2^{p-1}(2^p - 1) \\text{ (when }2^p - 1\\text{ is prime)}",
            description: "Even perfect number form (Euclid-Euler)",
          },
        ],
        examples: [
          {
            problem: "Verify 28 is perfect.",
            solution: "Divisors: 1, 2, 4, 7, 14, 28. Sum 1+2+4+7+14 = 28 ✓",
          },
        ],
        history: {
          discoveredBy: "Ancient Greeks",
          year: "Antiquity",
          background:
            "Pythagoreans considered perfect numbers mystical.",
        },
        applications: [
          { field: "Number Theory", description: "Connection to Mersenne primes" },
          { field: "Math History", description: "Studied since antiquity" },
        ],
      },
    },
    relations: {
      prerequisites: ["prime-numbers"],
      nextTopics: ["mersenne-primes"],
      related: ["divisors"],
    },
    tags: ["완전수", "약수합", "perfect number", "divisor sum"],
  },
  {
    id: "prime-factorization",
    name: {
      ko: "소인수분해",
      en: "Prime Factorization",
      ja: "素因数分解",
    },
    field: "number-theory",
    subfield: "primes",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "모든 양의 정수는 소수들의 곱으로 유일하게 표현됩니다. 이것이 산술의 기본 정리입니다.",
        formulas: [
          {
            latex: "n = p_1^{a_1} \\cdot p_2^{a_2} \\cdots p_k^{a_k}",
            description: "표준 소인수분해",
          },
          {
            latex: "\\tau(n) = (a_1 + 1)(a_2 + 1) \\cdots (a_k + 1)",
            description: "약수의 개수",
          },
          {
            latex: "\\sigma(n) = \\prod_{i=1}^{k} \\frac{p_i^{a_i+1} - 1}{p_i - 1}",
            description: "약수의 합",
          },
        ],
        examples: [
          {
            problem: "360을 소인수분해하고 약수의 개수를 구하세요.",
            solution:
              "360 = 2³ × 3² × 5¹\n약수 개수 = (3+1)(2+1)(1+1) = 4×3×2 = 24개",
          },
        ],
        history: {
          discoveredBy: "유클리드",
          year: "기원전 300년경",
          background:
            "유클리드 원론에서 산술의 기본 정리가 증명되었습니다.",
        },
        applications: [
          { field: "암호학", description: "RSA는 소인수분해의 어려움에 기반" },
          { field: "수학", description: "GCD, LCM 계산" },
        ],
      },
      en: {
        definition:
          "Every positive integer can be uniquely expressed as a product of primes. This is the Fundamental Theorem of Arithmetic.",
        formulas: [
          {
            latex: "n = p_1^{a_1} \\cdot p_2^{a_2} \\cdots p_k^{a_k}",
            description: "Canonical prime factorization",
          },
          {
            latex: "\\tau(n) = (a_1 + 1)(a_2 + 1) \\cdots (a_k + 1)",
            description: "Number of divisors",
          },
        ],
        examples: [
          {
            problem: "Factor 360 and find its number of divisors.",
            solution: "360 = 2³ × 3² × 5¹\nDivisors = (3+1)(2+1)(1+1) = 24",
          },
        ],
        history: {
          discoveredBy: "Euclid",
          year: "c. 300 BCE",
          background:
            "Fundamental Theorem of Arithmetic proved in Euclid's Elements.",
        },
        applications: [
          { field: "Cryptography", description: "RSA relies on factorization difficulty" },
          { field: "Mathematics", description: "Computing GCD, LCM" },
        ],
      },
    },
    relations: {
      prerequisites: ["prime-numbers"],
      nextTopics: ["gcd-lcm", "eulers-theorem"],
      related: ["divisibility"],
    },
    tags: ["소인수분해", "산술기본정리", "prime factorization", "FTA"],
  },
  {
    id: "sieve-of-eratosthenes",
    name: {
      ko: "에라토스테네스의 체",
      en: "Sieve of Eratosthenes",
      ja: "エラトステネスの篩",
    },
    field: "number-theory",
    subfield: "primes",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "에라토스테네스의 체는 주어진 범위 내의 모든 소수를 효율적으로 찾는 알고리즘입니다. 합성수를 체로 걸러냅니다.",
        formulas: [
          {
            latex: "O(n \\log \\log n)",
            description: "시간 복잡도",
          },
          {
            latex: "\\sqrt{n} \\text{까지만 체크}",
            description: "최적화",
          },
        ],
        examples: [
          {
            problem: "30 이하의 소수를 에라토스테네스의 체로 구하세요.",
            solution:
              "2의 배수 제거: 4,6,8... 남음: 2,3,5,7,9,11...\n3의 배수 제거: 9,15,21,27... 남음: 2,3,5,7,11,13...\n5의 배수 제거: 25... 결과: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29",
          },
        ],
        history: {
          discoveredBy: "에라토스테네스",
          year: "기원전 3세기",
          background:
            "에라토스테네스가 알렉산드리아 도서관장 시절 고안했습니다.",
        },
        applications: [
          { field: "알고리즘", description: "소수 생성" },
          { field: "암호학", description: "소수 테이블 생성" },
          { field: "수학", description: "소수 연구" },
        ],
      },
      en: {
        definition:
          "The Sieve of Eratosthenes is an efficient algorithm to find all primes up to a given limit by filtering out composites.",
        formulas: [
          {
            latex: "O(n \\log \\log n)",
            description: "Time complexity",
          },
        ],
        examples: [
          {
            problem: "Find primes up to 30 using the sieve.",
            solution:
              "Remove multiples of 2: 4,6,8...\nRemove multiples of 3: 9,15...\nRemove multiples of 5: 25\nResult: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29",
          },
        ],
        history: {
          discoveredBy: "Eratosthenes",
          year: "3rd century BCE",
          background:
            "Devised while Eratosthenes was librarian at Alexandria.",
        },
        applications: [
          { field: "Algorithms", description: "Prime generation" },
          { field: "Cryptography", description: "Prime table creation" },
          { field: "Mathematics", description: "Prime research" },
        ],
      },
    },
    relations: {
      prerequisites: ["prime-numbers"],
      nextTopics: ["primality-testing"],
      related: ["miller-rabin"],
    },
    tags: ["에라토스테네스", "소수찾기", "sieve", "Eratosthenes"],
  },
];
