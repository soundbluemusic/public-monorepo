import type { MathConcept } from '../types';

export const setTheoryConcepts: MathConcept[] = [
  {
    id: 'zfc-axioms',
    name: {
      ko: 'ZFC 공리계',
      en: 'ZFC Axioms',
    },
    field: 'set-theory',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition: '현대 수학의 표준 기초인 체르멜로-프렝켈 집합론과 선택 공리',
        formulas: [
          '외연 공리: A=B ⟺ ∀x(x∈A ↔ x∈B)',
          '쌍 공리: ∀a∀b∃c(c={a,b})',
          '합집합 공리: ∀A∃B(B=∪A)',
          '멱집합 공리: ∀A∃B(B=P(A))',
          '무한 공리: 귀납적 집합 존재',
          '분리 공리꼴: 기존 집합에서 조건을 만족하는 원소를 모은 부분집합이 존재',
          '치환 공리꼴',
          '정칙성/기초 공리',
          '선택 공리(AC)',
        ],
        examples: ['자연수 구성', '실수의 존재'],
        applications: ['수학 기초론', '논리학', '무한 연구'],
      },
      en: {
        definition:
          'Zermelo-Fraenkel set theory with Choice - standard foundation of modern mathematics',
        formulas: [
          'Extensionality: A=B ⟺ ∀x(x∈A ↔ x∈B)',
          'Pairing: ∀a∀b∃c(c={a,b})',
          'Union: ∀A∃B(B=∪A)',
          'Power set: ∀A∃B(B=P(A))',
          'Infinity: inductive set exists',
          'Separation schema: elements of a set satisfying a formula form a set',
          'Replacement schema',
          'Regularity/Foundation',
          'Axiom of Choice (AC)',
        ],
        examples: ['Natural number construction', 'Existence of reals'],
        applications: ['Foundations', 'Logic', 'Study of infinity'],
      },
    },
    latex: 'A = B \\Leftrightarrow \\forall x(x \\in A \\leftrightarrow x \\in B)',
    relations: {
      prerequisites: ['logic', 'set-basics'],
      nextTopics: ['ordinals', 'cardinals'],
      related: ['godel-incompleteness'],
      applications: ['mathematics-foundations'],
    },
    tags: ['ZFC', '공리', 'axioms', 'foundations'],
  },
  {
    id: 'ordinal-numbers',
    name: {
      ko: '서수',
      en: 'Ordinal Numbers',
    },
    field: 'set-theory',
    subfield: 'ordinals',
    difficulty: 5,
    content: {
      ko: {
        definition: '정렬순서의 순서형을 나타내는 수. 무한 집합의 위치 개념 확장',
        formulas: [
          '0 = ∅',
          'α+1 = α ∪ {α} (후속서수)',
          'ω = {0,1,2,...} (최초 극한서수)',
          'α < β ⟺ α ∈ β',
        ],
        examples: ['ω+1, ω+2, ...', 'ω·2 = ω+ω', 'ω², ω^ω', 'ε₀ = ω^ω^ω^...'],
        applications: ['초한귀납법', '집합론', '증명론'],
      },
      en: {
        definition:
          'Numbers representing order types of well-orderings. Extension of position concept to infinite sets',
        formulas: [
          '0 = ∅',
          'α+1 = α ∪ {α} (successor)',
          'ω = {0,1,2,...} (first limit ordinal)',
          'α < β ⟺ α ∈ β',
        ],
        examples: ['ω+1, ω+2, ...', 'ω·2 = ω+ω', 'ω², ω^ω', 'ε₀ = ω^ω^ω^...'],
        applications: ['Transfinite induction', 'Set theory', 'Proof theory'],
      },
    },
    latex: '\\omega = \\{0, 1, 2, ...\\}',
    relations: {
      prerequisites: ['zfc-axioms', 'well-ordering'],
      nextTopics: ['cardinals', 'epsilon-numbers'],
      related: ['natural-numbers'],
      applications: ['induction', 'recursion'],
    },
    tags: ['서수', 'ordinal', '초한', 'transfinite'],
  },
  {
    id: 'cardinal-numbers',
    name: {
      ko: '기수',
      en: 'Cardinal Numbers',
    },
    field: 'set-theory',
    subfield: 'cardinals',
    difficulty: 5,
    content: {
      ko: {
        definition: '집합의 크기를 나타내는 수. 무한 집합의 크기 비교 가능',
        formulas: [
          '|A| = |B| ⟺ 전단사 존재',
          '|A| ≤ |B| ⟺ 단사 존재',
          'ℵ₀ = |ℕ| (가산 무한)',
          'c = |ℝ| = 2^ℵ₀',
          '칸토어 정리: |A| < |P(A)|',
        ],
        examples: ['ℵ₀, ℵ₁, ℵ₂, ...', '|ℕ| < |ℝ|'],
        applications: ['무한 비교', '집합론', '기초론'],
      },
      en: {
        definition: 'Numbers representing size of sets. Enables comparison of infinite set sizes',
        formulas: [
          '|A| = |B| ⟺ bijection exists',
          '|A| ≤ |B| ⟺ injection exists',
          'ℵ₀ = |ℕ| (countable infinity)',
          'c = |ℝ| = 2^ℵ₀',
          'Cantor: |A| < |P(A)|',
        ],
        examples: ['ℵ₀, ℵ₁, ℵ₂, ...', '|ℕ| < |ℝ|'],
        applications: ['Infinity comparison', 'Set theory', 'Foundations'],
      },
    },
    latex: '|A| < |\\mathcal{P}(A)|',
    relations: {
      prerequisites: ['bijection', 'ordinal-numbers'],
      nextTopics: ['cardinal-arithmetic'],
      related: ['countability'],
      applications: ['set-theory', 'logic'],
    },
    tags: ['기수', 'cardinal', 'aleph', 'infinity'],
  },
  {
    id: 'axiom-of-choice',
    name: {
      ko: '선택 공리',
      en: 'Axiom of Choice',
    },
    field: 'set-theory',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition: '공집합이 아닌 집합들의 모임에서 각 집합의 원소를 하나씩 선택하는 함수가 존재',
        formulas: [
          '∀𝒜(∅∉𝒜 → ∃f:𝒜→∪𝒜, ∀A∈𝒜(f(A)∈A))',
          '동치: 정렬 가능 정리',
          '동치: 초른의 보조정리',
        ],
        examples: ['양말 선택 문제', '무한 집합의 선택'],
        applications: ['대수학', '해석학', '위상수학'],
      },
      en: {
        definition:
          'For any collection of non-empty sets, there exists a function selecting one element from each',
        formulas: [
          '∀𝒜(∅∉𝒜 → ∃f:𝒜→∪𝒜, ∀A∈𝒜(f(A)∈A))',
          'Equivalent: Well-ordering theorem',
          "Equivalent: Zorn's lemma",
        ],
        examples: ['Sock selection problem', 'Infinite set selection'],
        applications: ['Algebra', 'Analysis', 'Topology'],
      },
    },
    latex:
      '\\forall \\mathcal{A}(\\emptyset \\notin \\mathcal{A} \\rightarrow \\exists f: \\mathcal{A} \\to \\bigcup\\mathcal{A}, \\ \\forall A \\in \\mathcal{A} \\ (f(A) \\in A))',
    relations: {
      prerequisites: ['zfc-axioms'],
      nextTopics: ['zorns-lemma', 'well-ordering-theorem'],
      related: ['banach-tarski'],
      applications: ['algebra', 'analysis'],
    },
    tags: ['선택공리', 'AC', 'choice', 'axiom'],
  },
  {
    id: 'zorns-lemma',
    name: {
      ko: '초른의 보조정리',
      en: "Zorn's Lemma",
    },
    field: 'set-theory',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition: '모든 사슬이 상계를 가지는 부분순서집합은 극대원소를 갖는다',
        formulas: ['(P,≤) 부분순서, 모든 사슬 C⊆P에 대해 ∃상계 → ∃극대원소'],
        examples: ['벡터공간의 기저 존재', '이상의 극대이상 존재', '필터의 극대필터(초필터)'],
        applications: ['대수학', '해석학', '함수해석'],
      },
      en: {
        definition:
          'A partially ordered set where every chain has an upper bound contains a maximal element',
        formulas: ['(P,≤) poset, every chain C⊆P has upper bound → ∃maximal element'],
        examples: ['Existence of vector space basis', 'Maximal ideals', 'Ultrafilters'],
        applications: ['Algebra', 'Analysis', 'Functional analysis'],
      },
    },
    latex: '\\text{Every chain has upper bound} \\Rightarrow \\exists \\text{ maximal element}',
    relations: {
      prerequisites: ['partial-order', 'axiom-of-choice'],
      nextTopics: ['hamel-basis', 'hahn-banach'],
      related: ['well-ordering-theorem'],
      applications: ['algebra', 'functional-analysis'],
    },
    tags: ['초른', 'Zorn', '극대원소', 'maximal'],
  },
  {
    id: 'cantors-theorem',
    name: {
      ko: '칸토어 정리',
      en: "Cantor's Theorem",
    },
    field: 'set-theory',
    subfield: 'cardinals',
    difficulty: 4,
    content: {
      ko: {
        definition: '집합의 기수는 항상 그 멱집합의 기수보다 작다',
        formulas: ['|A| < |P(A)|', '증명: 대각선 논법', '결과: 무한 기수의 무한 계층'],
        examples: ['|ℕ| < |P(ℕ)| = |ℝ|', '|ℝ| < |P(ℝ)|'],
        applications: ['무한의 계층', '기수 이론', '대각선 논법'],
      },
      en: {
        definition: 'Cardinality of a set is always strictly less than its power set',
        formulas: [
          '|A| < |P(A)|',
          'Proof: Diagonal argument',
          'Result: Infinite hierarchy of infinite cardinals',
        ],
        examples: ['|ℕ| < |P(ℕ)| = |ℝ|', '|ℝ| < |P(ℝ)|'],
        applications: ['Hierarchy of infinity', 'Cardinal theory', 'Diagonal argument'],
      },
    },
    latex: '|A| < |\\mathcal{P}(A)|',
    relations: {
      prerequisites: ['bijection', 'power-set'],
      nextTopics: ['cardinal-numbers'],
      related: ['russells-paradox'],
      applications: ['set-theory', 'logic'],
    },
    tags: ['칸토어', 'Cantor', '대각선', 'diagonal'],
  },
  {
    id: 'well-ordering-theorem',
    name: {
      ko: '정렬 가능 정리',
      en: 'Well-Ordering Theorem',
    },
    field: 'set-theory',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition: '모든 집합은 정렬순서를 가질 수 있다. 선택 공리와 동치',
        formulas: [
          '∀A∃≤ ((A,≤)는 정렬집합)',
          '정렬: 공집합이 아닌 모든 부분집합이 최소 원소를 가짐',
        ],
        examples: ['ℕ의 자연스러운 정렬', 'ℝ의 정렬 (비구성적)'],
        applications: ['초한귀납법', '서수 이론', '집합론'],
      },
      en: {
        definition: 'Every set can be well-ordered. Equivalent to Axiom of Choice',
        formulas: [
          '∀A∃≤((A,≤) is well-ordered)',
          'Well-order: every nonempty subset has a least element',
        ],
        examples: ['Natural ordering of ℕ', 'Well-ordering of ℝ (non-constructive)'],
        applications: ['Transfinite induction', 'Ordinal theory', 'Set theory'],
      },
    },
    latex: '\\forall A \\exists \\leq \\text{ such that } (A, \\leq) \\text{ is well-ordered}',
    relations: {
      prerequisites: ['partial-order', 'axiom-of-choice'],
      nextTopics: ['ordinal-numbers', 'transfinite-induction'],
      related: ['zorns-lemma'],
      applications: ['induction', 'set-theory'],
    },
    tags: ['정렬', 'well-ordering', '선택공리', 'equivalence'],
  },
];
