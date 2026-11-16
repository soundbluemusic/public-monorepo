/**
 * @fileoverview 추상대수학 개념 데이터
 */
import type { MathConcept } from '../types';

export const abstractAlgebraConcepts: MathConcept[] = [
  {
    id: 'group-theory',
    name: {
      ko: '군론',
      en: 'Group Theory',
    },
    field: 'abstract-algebra',
    subfield: 'groups',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '군(Group)은 이항연산이 정의된 집합으로, 결합법칙, 항등원의 존재, 역원의 존재를 만족합니다. 대칭성을 수학적으로 다루는 기본 구조입니다.',
        formulas: [
          {
            latex: '(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)',
            description: '결합법칙',
          },
          {
            latex: '\\exists e : a \\cdot e = e \\cdot a = a',
            description: '항등원의 존재',
          },
          {
            latex: '\\forall a, \\exists a^{-1} : a \\cdot a^{-1} = a^{-1} \\cdot a = e',
            description: '역원의 존재',
          },
          {
            latex: 'a \\cdot b = b \\cdot a',
            description: '교환법칙 (아벨군의 경우)',
          },
        ],
        examples: [
          {
            problem: '(ℤ, +)가 군임을 보이세요.',
            solution:
              '결합법칙: (a+b)+c = a+(b+c) ✓. 항등원: 0 (a+0=a) ✓. 역원: -a (a+(-a)=0) ✓. 또한 교환법칙도 성립하므로 아벨군입니다.',
          },
          {
            problem: 'S₃ (3개 원소의 순열군)의 위수는?',
            solution: '3개 원소를 배열하는 방법의 수 = 3! = 6. S₃는 위수 6인 비아벨군입니다.',
          },
        ],
        history: {
          discoveredBy: '에바리스트 갈루아',
          year: '1830년대',
          background:
            '갈루아가 방정식의 해를 연구하면서 군 개념을 도입했습니다. 아벨도 독립적으로 비슷한 아이디어를 발전시켰습니다.',
        },
        applications: [
          { field: '물리학', description: '대칭성과 보존법칙' },
          { field: '암호학', description: '타원곡선, Diffie-Hellman' },
          { field: '화학', description: '분자 대칭성, 결정학' },
        ],
      },
      en: {
        definition:
          "A group is a set with a binary operation satisfying associativity, existence of identity, and existence of inverses. It's the fundamental structure for studying symmetry mathematically.",
        formulas: [
          {
            latex: '(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)',
            description: 'Associativity',
          },
          {
            latex: '\\exists e : a \\cdot e = e \\cdot a = a',
            description: 'Existence of identity',
          },
          {
            latex: '\\forall a, \\exists a^{-1} : a \\cdot a^{-1} = a^{-1} \\cdot a = e',
            description: 'Existence of inverse',
          },
          {
            latex: 'a \\cdot b = b \\cdot a',
            description: 'Commutativity (for abelian groups)',
          },
        ],
        examples: [
          {
            problem: 'Show (ℤ, +) is a group.',
            solution:
              "Associativity: (a+b)+c = a+(b+c) ✓. Identity: 0 (a+0=a) ✓. Inverse: -a (a+(-a)=0) ✓. Also commutative, so it's abelian.",
          },
          {
            problem: 'What is the order of S₃ (symmetric group on 3 elements)?',
            solution:
              'Number of ways to arrange 3 elements = 3! = 6. S₃ is a non-abelian group of order 6.',
          },
        ],
        history: {
          discoveredBy: 'Évariste Galois',
          year: '1830s',
          background:
            'Galois introduced group concept while studying polynomial equations. Abel independently developed similar ideas.',
        },
        applications: [
          { field: 'Physics', description: 'Symmetry and conservation laws' },
          { field: 'Cryptography', description: 'Elliptic curves, Diffie-Hellman' },
          { field: 'Chemistry', description: 'Molecular symmetry, crystallography' },
        ],
      },
    },
    relations: {
      prerequisites: ['sets', 'binary-operations'],
      nextTopics: ['rings', 'homomorphism'],
      related: ['symmetry'],
    },
    tags: ['군', '대칭', 'group', 'symmetry'],
  },
  {
    id: 'rings',
    name: {
      ko: '환',
      en: 'Rings',
    },
    field: 'abstract-algebra',
    subfield: 'rings',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '환(Ring)은 두 개의 이항연산(덧셈, 곱셈)이 정의된 집합입니다. 덧셈에 대해 아벨군이고, 곱셈은 결합법칙을 만족하며, 분배법칙이 성립합니다.',
        formulas: [
          {
            latex: '(R, +) \\text{ is an abelian group}',
            description: '덧셈에 대한 아벨군',
          },
          {
            latex: '(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)',
            description: '곱셈의 결합법칙',
          },
          {
            latex: 'a(b + c) = ab + ac, \\quad (a + b)c = ac + bc',
            description: '분배법칙',
          },
        ],
        examples: [
          {
            problem: '(ℤ, +, ×)가 환임을 보이세요.',
            solution:
              '(ℤ, +)는 아벨군. 곱셈은 결합적. 분배법칙 성립. 항등원 1 존재. 따라서 단위원을 가진 가환환입니다.',
          },
          {
            problem: '2×2 행렬의 환 M₂(ℝ)의 특성은?',
            solution:
              '단위원 I 존재. 곱셈이 비가환 (AB ≠ BA 일반적). 영인자 존재 (AB = 0이지만 A,B ≠ 0인 경우).',
          },
        ],
        applications: [
          { field: '수론', description: '정수환, 대수적 정수론' },
          { field: '다항식', description: '다항식환' },
          { field: '암호학', description: '유한환, 격자 기반 암호' },
        ],
      },
      en: {
        definition:
          "A ring is a set with two binary operations (addition, multiplication). It's an abelian group under addition, multiplication is associative, and distributive laws hold.",
        formulas: [
          {
            latex: '(R, +) \\text{ is an abelian group}',
            description: 'Abelian group under addition',
          },
          {
            latex: '(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)',
            description: 'Associativity of multiplication',
          },
          {
            latex: 'a(b + c) = ab + ac, \\quad (a + b)c = ac + bc',
            description: 'Distributive laws',
          },
        ],
        examples: [
          {
            problem: 'Show (ℤ, +, ×) is a ring.',
            solution:
              "(ℤ, +) is abelian group. Multiplication is associative. Distributive laws hold. Has identity 1. It's a commutative ring with unity.",
          },
          {
            problem: 'What are properties of matrix ring M₂(ℝ)?',
            solution:
              'Has identity I. Multiplication non-commutative (AB ≠ BA generally). Has zero divisors (AB = 0 but A,B ≠ 0 possible).',
          },
        ],
        applications: [
          { field: 'Number Theory', description: 'Ring of integers, algebraic number theory' },
          { field: 'Polynomials', description: 'Polynomial rings' },
          { field: 'Cryptography', description: 'Finite rings, lattice-based crypto' },
        ],
      },
    },
    relations: {
      prerequisites: ['group-theory'],
      nextTopics: ['fields', 'ideals'],
      related: ['integers'],
    },
    tags: ['환', '대수구조', 'ring', 'algebraic structure'],
  },
  {
    id: 'fields',
    name: {
      ko: '체',
      en: 'Fields',
    },
    field: 'abstract-algebra',
    subfield: 'fields',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '체(Field)는 0 ≠ 1인 단위원을 가진 가환환이며, 0이 아닌 모든 원소가 곱셈에 대한 역원을 가집니다. 0으로 나누는 것은 정의되지 않습니다.',
        formulas: [
          {
            latex: '(F, +, \\cdot) \\text{ is a commutative ring with unity}',
            description: '단위원을 가진 가환환 (0 ≠ 1)',
          },
          {
            latex: '\\forall a \\neq 0, \\exists a^{-1} : a \\cdot a^{-1} = 1',
            description: '0이 아닌 원소의 곱셈 역원 존재',
          },
          {
            latex: '\\text{char}(F) = 0 \\text{ or prime } p',
            description: '체의 표수',
          },
        ],
        examples: [
          {
            problem: '유한체 𝔽₅ = {0, 1, 2, 3, 4}의 연산을 설명하세요.',
            solution:
              'mod 5로 덧셈과 곱셈. 예: 3 + 4 = 2, 3 × 4 = 2. 역원: 2⁻¹ = 3 (2×3 = 6 ≡ 1). 5개 원소, 표수 5.',
          },
          {
            problem: 'ℚ(√2)가 체임을 보이세요.',
            solution:
              'ℚ(√2) = {a + b√2 : a,b ∈ ℚ}. 덧셈과 곱셈에 닫혀 있고, a+b√2 ≠ 0일 때 (a+b√2)⁻¹ = (a-b√2)/(a²-2b²)로 역원이 존재합니다.',
          },
        ],
        history: {
          discoveredBy: '레오폴드 크로네커, 리하르트 데데킨트',
          year: '19세기',
          background: '대수방정식 연구와 대수적 수론의 발전 과정에서 체 개념이 정립되었습니다.',
        },
        applications: [
          { field: '암호학', description: '유한체 기반 암호 (AES, ECC)' },
          { field: '코딩 이론', description: '오류 정정 코드' },
          { field: '대수기하학', description: '대수적 다양체' },
        ],
      },
      en: {
        definition:
          'A field is a commutative ring with unity 0 ≠ 1 in which every nonzero element has a multiplicative inverse. Division by zero is undefined.',
        formulas: [
          {
            latex: '(F, +, \\cdot) \\text{ is a commutative ring with unity}',
            description: 'Commutative ring with unity (0 ≠ 1)',
          },
          {
            latex: '\\forall a \\neq 0, \\exists a^{-1} : a \\cdot a^{-1} = 1',
            description: 'Multiplicative inverse for non-zero elements',
          },
          {
            latex: '\\text{char}(F) = 0 \\text{ or prime } p',
            description: 'Characteristic of field',
          },
        ],
        examples: [
          {
            problem: 'Describe operations in finite field 𝔽₅ = {0, 1, 2, 3, 4}.',
            solution:
              'Addition and multiplication mod 5. E.g., 3 + 4 = 2, 3 × 4 = 2. Inverse: 2⁻¹ = 3 (2×3 = 6 ≡ 1). 5 elements, characteristic 5.',
          },
          {
            problem: 'Show ℚ(√2) is a field.',
            solution:
              'ℚ(√2) = {a + b√2 : a,b ∈ ℚ}. It is closed under addition and multiplication; when a+b√2 ≠ 0, its inverse is (a-b√2)/(a²-2b²).',
          },
        ],
        history: {
          discoveredBy: 'Leopold Kronecker, Richard Dedekind',
          year: '19th century',
          background:
            'Field concept emerged from studying algebraic equations and developing algebraic number theory.',
        },
        applications: [
          { field: 'Cryptography', description: 'Finite field crypto (AES, ECC)' },
          { field: 'Coding Theory', description: 'Error-correcting codes' },
          { field: 'Algebraic Geometry', description: 'Algebraic varieties' },
        ],
      },
    },
    relations: {
      prerequisites: ['rings'],
      nextTopics: ['galois-theory', 'field-extensions'],
      related: ['vector-space'],
    },
    tags: ['체', '유한체', 'field', 'finite field'],
  },
  {
    id: 'homomorphism',
    name: {
      ko: '준동형사상',
      en: 'Homomorphism',
    },
    field: 'abstract-algebra',
    subfield: 'morphisms',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '준동형사상은 대수구조 사이의 연산을 보존하는 함수입니다. 군, 환, 체 등의 구조를 비교하고 분류하는 핵심 도구입니다.',
        formulas: [
          {
            latex: '\\phi(a \\cdot b) = \\phi(a) \\cdot \\phi(b)',
            description: '군 준동형의 정의',
          },
          {
            latex: '\\phi(a + b) = \\phi(a) + \\phi(b), \\quad \\phi(ab) = \\phi(a)\\phi(b)',
            description: '환 준동형의 정의',
          },
          {
            latex: '\\ker(\\phi) = \\{a : \\phi(a) = e\\}',
            description: '핵 (kernel)',
          },
          {
            latex: '\\text{im}(\\phi) = \\{\\phi(a) : a \\in G\\}',
            description: '상 (image)',
          },
        ],
        examples: [
          {
            problem: 'exp: (ℝ, +) → (ℝ⁺, ×)가 준동형임을 보이세요.',
            solution:
              'exp(a + b) = e^(a+b) = e^a × e^b = exp(a) × exp(b). 덧셈을 곱셈으로 보존합니다.',
          },
          {
            problem: 'φ: ℤ → ℤₙ, φ(a) = a mod n의 핵은?',
            solution: 'ker(φ) = {a ∈ ℤ : a ≡ 0 (mod n)} = nℤ. n의 배수 전체입니다.',
          },
        ],
        applications: [
          { field: '대수학', description: '구조 분류, 동형정리' },
          { field: '암호학', description: '군 기반 프로토콜' },
          { field: '물리학', description: '대칭군 표현' },
        ],
      },
      en: {
        definition:
          "A homomorphism is a function between algebraic structures that preserves operations. It's the key tool for comparing and classifying groups, rings, fields, etc.",
        formulas: [
          {
            latex: '\\phi(a \\cdot b) = \\phi(a) \\cdot \\phi(b)',
            description: 'Group homomorphism definition',
          },
          {
            latex: '\\phi(a + b) = \\phi(a) + \\phi(b), \\quad \\phi(ab) = \\phi(a)\\phi(b)',
            description: 'Ring homomorphism definition',
          },
          {
            latex: '\\ker(\\phi) = \\{a : \\phi(a) = e\\}',
            description: 'Kernel',
          },
          {
            latex: '\\text{im}(\\phi) = \\{\\phi(a) : a \\in G\\}',
            description: 'Image',
          },
        ],
        examples: [
          {
            problem: 'Show exp: (ℝ, +) → (ℝ⁺, ×) is a homomorphism.',
            solution:
              'exp(a + b) = e^(a+b) = e^a × e^b = exp(a) × exp(b). Preserves addition to multiplication.',
          },
          {
            problem: 'What is the kernel of φ: ℤ → ℤₙ, φ(a) = a mod n?',
            solution: 'ker(φ) = {a ∈ ℤ : a ≡ 0 (mod n)} = nℤ. All multiples of n.',
          },
        ],
        applications: [
          { field: 'Algebra', description: 'Structure classification, isomorphism theorems' },
          { field: 'Cryptography', description: 'Group-based protocols' },
          { field: 'Physics', description: 'Symmetry group representations' },
        ],
      },
    },
    relations: {
      prerequisites: ['group-theory', 'functions'],
      nextTopics: ['isomorphism', 'kernel-image'],
      related: ['category-theory'],
    },
    tags: ['준동형', '핵', 'homomorphism', 'kernel'],
  },
  {
    id: 'isomorphism',
    name: {
      ko: '동형사상',
      en: 'Isomorphism',
    },
    field: 'abstract-algebra',
    subfield: 'morphisms',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '동형사상은 전단사 준동형입니다. 두 구조가 동형이면 대수적으로 동일한 것으로 봅니다. 구조의 본질적 동일성을 나타냅니다.',
        formulas: [
          {
            latex:
              '\\phi: G \\to H \\text{ isomorphism} \\Leftrightarrow \\phi \\text{ bijective homomorphism}',
            description: '동형사상의 정의',
          },
          {
            latex: 'G \\cong H',
            description: 'G와 H가 동형',
          },
          {
            latex: 'G / \\ker(\\phi) \\cong \\text{im}(\\phi)',
            description: '제1동형정리',
          },
        ],
        examples: [
          {
            problem: '(ℤ, +)와 (2ℤ, +)가 동형임을 보이세요.',
            solution:
              'φ(n) = 2n. 전단사: φ(n) = φ(m) ⇒ n = m, 모든 2k에 대해 φ(k) = 2k. 준동형: φ(n+m) = 2(n+m) = 2n + 2m = φ(n) + φ(m).',
          },
          {
            problem: '위수 2인 모든 군이 동형임을 보이세요.',
            solution:
              '위수 2인 군은 {e, a}이고 a² = e. ℤ₂ = {0, 1}와 φ(e) = 0, φ(a) = 1로 동형. 구조가 유일합니다.',
          },
        ],
        history: {
          discoveredBy: '에미 뇌터',
          year: '1920년대',
          background: '뇌터가 동형정리를 일반화하고 현대 대수학의 기초를 놓았습니다.',
        },
        applications: [
          { field: '대수학', description: '구조 분류' },
          { field: '그래프 이론', description: '그래프 동형' },
          { field: '컴퓨터 과학', description: '자료구조 동등성' },
        ],
      },
      en: {
        definition:
          'An isomorphism is a bijective homomorphism. If two structures are isomorphic, they are algebraically identical. It represents essential structural sameness.',
        formulas: [
          {
            latex:
              '\\phi: G \\to H \\text{ isomorphism} \\Leftrightarrow \\phi \\text{ bijective homomorphism}',
            description: 'Definition of isomorphism',
          },
          {
            latex: 'G \\cong H',
            description: 'G and H are isomorphic',
          },
          {
            latex: 'G / \\ker(\\phi) \\cong \\text{im}(\\phi)',
            description: 'First Isomorphism Theorem',
          },
        ],
        examples: [
          {
            problem: 'Show (ℤ, +) and (2ℤ, +) are isomorphic.',
            solution:
              'φ(n) = 2n. Bijective: φ(n) = φ(m) ⇒ n = m, every 2k has preimage k. Homomorphism: φ(n+m) = 2(n+m) = 2n + 2m = φ(n) + φ(m).',
          },
          {
            problem: 'Show all groups of order 2 are isomorphic.',
            solution:
              'Order 2 group is {e, a} with a² = e. Map to ℤ₂ = {0, 1} by φ(e) = 0, φ(a) = 1. Structure is unique.',
          },
        ],
        history: {
          discoveredBy: 'Emmy Noether',
          year: '1920s',
          background:
            'Noether generalized isomorphism theorems and laid foundations of modern algebra.',
        },
        applications: [
          { field: 'Algebra', description: 'Structure classification' },
          { field: 'Graph Theory', description: 'Graph isomorphism' },
          { field: 'Computer Science', description: 'Data structure equivalence' },
        ],
      },
    },
    relations: {
      prerequisites: ['homomorphism'],
      nextTopics: ['quotient-groups', 'galois-theory'],
      related: ['bijection'],
    },
    tags: ['동형', '전단사', 'isomorphism', 'bijection'],
  },
];
