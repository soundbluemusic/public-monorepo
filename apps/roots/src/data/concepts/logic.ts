/**
 * @fileoverview 수리논리학 개념 데이터
 */
import type { MathConcept } from '../types';

export const logicConcepts: MathConcept[] = [
  {
    id: 'propositional-logic',
    name: {
      ko: '명제 논리',
      en: 'Propositional Logic',
    },
    field: 'logic',
    subfield: 'propositional',
    difficulty: 2,
    content: {
      ko: {
        definition:
          '명제 논리는 참 또는 거짓 값을 가지는 명제들과 논리 연결사(AND, OR, NOT 등)를 다루는 형식 체계입니다.',
        formulas: [
          {
            latex: '\\neg p',
            description: '부정 (NOT)',
          },
          {
            latex: 'p \\land q',
            description: '논리곱 (AND)',
          },
          {
            latex: 'p \\lor q',
            description: '논리합 (OR)',
          },
          {
            latex: 'p \\to q \\equiv \\neg p \\lor q',
            description: '조건문 (IF-THEN)',
          },
          {
            latex: 'p \\leftrightarrow q \\equiv (p \\to q) \\land (q \\to p)',
            description: '쌍조건문 (IFF)',
          },
        ],
        examples: [
          {
            problem: "p = '비가 온다', q = '땅이 젖는다'일 때 p → q의 의미는?",
            solution: "'비가 오면 땅이 젖는다'. 비가 오지 않으면 결과와 관계없이 참입니다.",
          },
        ],
        applications: [
          { field: '컴퓨터 과학', description: '불리언 대수, 회로 설계' },
          { field: '수학', description: '증명 기초' },
          { field: 'AI', description: '지식 표현' },
        ],
      },
      en: {
        definition:
          'Propositional logic is a formal system dealing with propositions (true/false) and logical connectives (AND, OR, NOT, etc.).',
        formulas: [
          {
            latex: '\\neg p',
            description: 'Negation (NOT)',
          },
          {
            latex: 'p \\land q',
            description: 'Conjunction (AND)',
          },
          {
            latex: 'p \\lor q',
            description: 'Disjunction (OR)',
          },
          {
            latex: 'p \\to q \\equiv \\neg p \\lor q',
            description: 'Implication (IF-THEN)',
          },
          {
            latex: 'p \\leftrightarrow q \\equiv (p \\to q) \\land (q \\to p)',
            description: 'Biconditional (IFF)',
          },
        ],
        examples: [
          {
            problem: "If p = 'It rains', q = 'Ground is wet', what does p → q mean?",
            solution:
              "'If it rains, the ground is wet'. True when it doesn't rain regardless of q.",
          },
        ],
        applications: [
          { field: 'Computer Science', description: 'Boolean algebra, circuit design' },
          { field: 'Mathematics', description: 'Proof foundations' },
          { field: 'AI', description: 'Knowledge representation' },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ['predicate-logic', 'boolean-algebra'],
      related: ['sets'],
    },
    tags: ['명제', '논리', 'propositional', 'logic'],
  },
  {
    id: 'predicate-logic',
    name: {
      ko: '술어 논리',
      en: 'Predicate Logic',
    },
    field: 'logic',
    subfield: 'predicate',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '술어 논리(1차 논리)는 명제 논리를 확장하여 변수, 양화사(∀, ∃), 술어를 포함합니다. 수학적 명제를 정확히 표현할 수 있습니다.',
        formulas: [
          {
            latex: '\\forall x \\, P(x)',
            description: '전칭 양화사 (모든 x에 대해)',
          },
          {
            latex: '\\exists x \\, P(x)',
            description: '존재 양화사 (어떤 x가 존재하여)',
          },
          {
            latex: '\\neg (\\forall x \\, P(x)) \\equiv \\exists x \\, \\neg P(x)',
            description: '양화사 부정',
          },
        ],
        examples: [
          {
            problem: "'모든 인간은 죽는다'를 술어 논리로 표현하세요.",
            solution: '∀x (Human(x) → Mortal(x))',
          },
          {
            problem: "'모든 자연수에는 더 큰 소수가 있다'를 표현하세요.",
            solution: '∀n ∃p (Prime(p) ∧ p > n)',
          },
        ],
        applications: [
          { field: '수학', description: '공리계, 정리 증명' },
          { field: 'AI', description: '자동 정리 증명, 지식 베이스' },
          { field: '데이터베이스', description: 'SQL 쿼리의 이론적 기반' },
        ],
      },
      en: {
        definition:
          'Predicate logic (first-order logic) extends propositional logic with variables, quantifiers (∀, ∃), and predicates. It can express mathematical statements precisely.',
        formulas: [
          {
            latex: '\\forall x \\, P(x)',
            description: 'Universal quantifier (for all x)',
          },
          {
            latex: '\\exists x \\, P(x)',
            description: 'Existential quantifier (there exists x)',
          },
          {
            latex: '\\neg (\\forall x \\, P(x)) \\equiv \\exists x \\, \\neg P(x)',
            description: 'Quantifier negation',
          },
        ],
        examples: [
          {
            problem: "Express 'All humans are mortal' in predicate logic.",
            solution: '∀x (Human(x) → Mortal(x))',
          },
          {
            problem: "Express 'For every natural number, there's a larger prime'.",
            solution: '∀n ∃p (Prime(p) ∧ p > n)',
          },
        ],
        applications: [
          { field: 'Mathematics', description: 'Axiomatic systems, theorem proving' },
          { field: 'AI', description: 'Automated theorem proving, knowledge bases' },
          { field: 'Databases', description: 'Theoretical foundation of SQL' },
        ],
      },
    },
    relations: {
      prerequisites: ['propositional-logic'],
      nextTopics: ['proof-theory', 'model-theory'],
      related: ['sets'],
    },
    tags: ['술어', '양화사', 'predicate', 'quantifier'],
  },
  {
    id: 'proof-methods',
    name: {
      ko: '증명 방법',
      en: 'Proof Methods',
    },
    field: 'logic',
    subfield: 'proof-theory',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '수학적 증명은 공리와 이미 증명된 정리로부터 논리적으로 결론을 도출하는 과정입니다. 직접 증명, 귀류법, 수학적 귀납법 등이 있습니다.',
        formulas: [
          {
            latex: 'P \\to Q \\text{ (직접 증명)}',
            description: 'P가 참이면 Q가 참임을 보임',
          },
          {
            latex: '\\neg Q \\to \\neg P \\text{ (대우 증명)}',
            description: 'Q의 부정에서 P의 부정을 도출',
          },
          {
            latex: '\\neg P \\to \\text{모순} \\Rightarrow P \\text{ (귀류법)}',
            description: 'P의 부정이 모순을 유도하면 P는 참',
          },
        ],
        examples: [
          {
            problem: '√2가 무리수임을 귀류법으로 증명하세요.',
            solution:
              '√2 = a/b (기약분수)라 가정. 2 = a²/b²이므로 a² = 2b². a는 짝수, a = 2k라 하면 4k² = 2b², b² = 2k². b도 짝수. 이는 기약분수 가정에 모순.',
          },
        ],
        applications: [
          { field: '수학', description: '정리 증명' },
          { field: '컴퓨터 과학', description: '알고리즘 정확성 증명' },
          { field: '형식 검증', description: '소프트웨어 검증' },
        ],
      },
      en: {
        definition:
          'Mathematical proof is the process of deriving conclusions logically from axioms and proven theorems. Methods include direct proof, contradiction, and induction.',
        formulas: [
          {
            latex: 'P \\to Q \\text{ (direct proof)}',
            description: 'Assume P true, show Q true',
          },
          {
            latex: '\\neg Q \\to \\neg P \\text{ (contrapositive)}',
            description: 'Derive ¬P from ¬Q',
          },
          {
            latex:
              '\\neg P \\to \\text{contradiction} \\Rightarrow P \\text{ (proof by contradiction)}',
            description: 'If ¬P leads to contradiction, P is true',
          },
        ],
        examples: [
          {
            problem: 'Prove √2 is irrational by contradiction.',
            solution:
              'Assume √2 = a/b in lowest terms. 2 = a²/b², so a² = 2b². a is even, let a = 2k. Then 4k² = 2b², b² = 2k². b is also even. Contradicts lowest terms.',
          },
        ],
        applications: [
          { field: 'Mathematics', description: 'Theorem proving' },
          { field: 'Computer Science', description: 'Algorithm correctness' },
          { field: 'Formal Verification', description: 'Software verification' },
        ],
      },
    },
    relations: {
      prerequisites: ['propositional-logic'],
      nextTopics: ['mathematical-induction'],
      related: ['sets'],
    },
    tags: ['증명', '귀류법', 'proof', 'contradiction'],
  },
  {
    id: 'mathematical-induction',
    name: {
      ko: '수학적 귀납법',
      en: 'Mathematical Induction',
    },
    field: 'logic',
    subfield: 'proof-theory',
    difficulty: 3,
    content: {
      ko: {
        definition:
          '수학적 귀납법은 자연수에 대한 명제를 증명하는 방법입니다. 기초 단계(n=1)와 귀납 단계(n=k → n=k+1)로 구성됩니다.',
        formulas: [
          {
            latex:
              'P(1) \\land (\\forall k \\, (P(k) \\to P(k+1))) \\Rightarrow \\forall n \\, P(n)',
            description: '수학적 귀납법의 원리',
          },
        ],
        examples: [
          {
            problem: '1 + 2 + ... + n = n(n+1)/2임을 귀납법으로 증명하세요.',
            solution:
              '기초: n=1일 때 1 = 1×2/2 ✓. 귀납: 1+...+k = k(k+1)/2 가정. 1+...+k+(k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2 ✓',
          },
        ],
        history: {
          discoveredBy: '파스칼, 페르마',
          year: '17세기',
          background:
            '귀납법의 원리는 자연수의 정의에 내재되어 있으며, 명시적으로 사용된 것은 17세기부터입니다.',
        },
        applications: [
          { field: '수학', description: '급수 공식, 부등식 증명' },
          { field: '컴퓨터 과학', description: '재귀 알고리즘 분석' },
          { field: '형식 언어', description: '문법 성질 증명' },
        ],
      },
      en: {
        definition:
          'Mathematical induction proves statements about natural numbers. It consists of base case (n=1) and inductive step (n=k → n=k+1).',
        formulas: [
          {
            latex:
              'P(1) \\land (\\forall k \\, (P(k) \\to P(k+1))) \\Rightarrow \\forall n \\, P(n)',
            description: 'Principle of mathematical induction',
          },
        ],
        examples: [
          {
            problem: 'Prove 1 + 2 + ... + n = n(n+1)/2 by induction.',
            solution:
              'Base: n=1, 1 = 1×2/2 ✓. Inductive: Assume for k. Then 1+...+k+(k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2 ✓',
          },
        ],
        history: {
          discoveredBy: 'Pascal, Fermat',
          year: '17th century',
          background:
            'The principle is inherent in natural number definition, explicitly used from 17th century.',
        },
        applications: [
          { field: 'Mathematics', description: 'Series formulas, inequality proofs' },
          { field: 'Computer Science', description: 'Recursive algorithm analysis' },
          { field: 'Formal Languages', description: 'Grammar property proofs' },
        ],
      },
    },
    relations: {
      prerequisites: ['natural-numbers', 'proof-methods'],
      nextTopics: ['strong-induction', 'structural-induction'],
      related: ['recursion'],
    },
    tags: ['귀납법', '증명', 'induction', 'proof'],
  },
  {
    id: 'godels-incompleteness',
    name: {
      ko: '괴델의 불완전성 정리',
      en: "Gödel's Incompleteness Theorems",
    },
    field: 'logic',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition:
          '괴델의 불완전성 정리는 충분히 강력한 수학 체계에서는 증명도 반증도 할 수 없는 참인 명제가 존재함을 보여줍니다.',
        formulas: [
          {
            latex: '\\text{Con}(F) \\to \\exists G \\, (F \\nvdash G \\land F \\nvdash \\neg G)',
            description: '제1 불완전성 정리 (비형식적)',
          },
          {
            latex: '\\text{Con}(F) \\to F \\nvdash \\text{Con}(F)',
            description: '제2 불완전성 정리',
          },
        ],
        examples: [
          {
            problem: '괴델 문장의 아이디어를 설명하세요.',
            solution:
              "'이 문장은 증명될 수 없다'를 형식화. 만약 증명 가능하면 거짓인 것이 증명됨(모순). 증명 불가능하면 참이지만 증명 불가.",
          },
        ],
        history: {
          discoveredBy: '쿠르트 괴델',
          year: '1931년',
          background:
            '힐베르트 프로그램에 대한 응답으로, 수학의 완전한 형식화가 불가능함을 보였습니다.',
        },
        applications: [
          { field: '수학기초론', description: '형식 체계의 한계' },
          { field: '컴퓨터 과학', description: '정지 문제, 계산가능성' },
          { field: '철학', description: '진리와 증명의 관계' },
        ],
      },
      en: {
        definition:
          "Gödel's incompleteness theorems show that in any sufficiently powerful mathematical system, there exist true statements that cannot be proved or disproved.",
        formulas: [
          {
            latex: '\\text{Con}(F) \\to \\exists G \\, (F \\nvdash G \\land F \\nvdash \\neg G)',
            description: 'First incompleteness theorem (informal)',
          },
          {
            latex: '\\text{Con}(F) \\to F \\nvdash \\text{Con}(F)',
            description: 'Second incompleteness theorem',
          },
        ],
        examples: [
          {
            problem: 'Explain the idea of Gödel sentence.',
            solution:
              "Formalize 'This statement is unprovable'. If provable, proves a false statement (contradiction). If unprovable, it's true but unprovable.",
          },
        ],
        history: {
          discoveredBy: 'Kurt Gödel',
          year: '1931',
          background:
            "Response to Hilbert's program, showing complete formalization of mathematics is impossible.",
        },
        applications: [
          { field: 'Foundations', description: 'Limits of formal systems' },
          { field: 'Computer Science', description: 'Halting problem, computability' },
          { field: 'Philosophy', description: 'Truth vs. provability' },
        ],
      },
    },
    relations: {
      prerequisites: ['predicate-logic', 'proof-theory'],
      nextTopics: ['computability'],
      related: ['halting-problem'],
    },
    tags: ['괴델', '불완전성', 'Gödel', 'incompleteness'],
  },
];
