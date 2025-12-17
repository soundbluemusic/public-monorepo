/**
 * @fileoverview 수리논리학 개념 데이터
 */
import type { MathConcept } from "../types";

export const logicConcepts: MathConcept[] = [
  {
    id: "propositional-logic",
    name: {
      ko: "명제 논리",
      en: "Propositional Logic",
      ja: "命題論理",
    },
    field: "logic",
    subfield: "propositional",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "명제 논리는 참 또는 거짓 값을 가지는 명제들과 논리 연결사(AND, OR, NOT 등)를 다루는 형식 체계입니다.",
        formulas: [
          {
            latex: "\\neg p",
            description: "부정 (NOT)",
          },
          {
            latex: "p \\land q",
            description: "논리곱 (AND)",
          },
          {
            latex: "p \\lor q",
            description: "논리합 (OR)",
          },
          {
            latex: "p \\to q \\equiv \\neg p \\lor q",
            description: "조건문 (IF-THEN)",
          },
          {
            latex: "p \\leftrightarrow q \\equiv (p \\to q) \\land (q \\to p)",
            description: "쌍조건문 (IFF)",
          },
        ],
        examples: [
          {
            problem: "p = '비가 온다', q = '땅이 젖는다'일 때 p → q의 의미는?",
            solution: "'비가 오면 땅이 젖는다'. 비가 오지 않으면 결과와 관계없이 참입니다.",
          },
        ],
        applications: [
          { field: "컴퓨터 과학", description: "불리언 대수, 회로 설계" },
          { field: "수학", description: "증명 기초" },
          { field: "AI", description: "지식 표현" },
        ],
      },
      en: {
        definition:
          "Propositional logic is a formal system dealing with propositions (true/false) and logical connectives (AND, OR, NOT, etc.).",
        formulas: [
          {
            latex: "\\neg p",
            description: "Negation (NOT)",
          },
          {
            latex: "p \\land q",
            description: "Conjunction (AND)",
          },
          {
            latex: "p \\lor q",
            description: "Disjunction (OR)",
          },
          {
            latex: "p \\to q \\equiv \\neg p \\lor q",
            description: "Implication (IF-THEN)",
          },
          {
            latex: "p \\leftrightarrow q \\equiv (p \\to q) \\land (q \\to p)",
            description: "Biconditional (IFF)",
          },
        ],
        examples: [
          {
            problem: "If p = 'It rains', q = 'Ground is wet', what does p → q mean?",
            solution: "'If it rains, the ground is wet'. True when it doesn't rain regardless of q.",
          },
        ],
        applications: [
          { field: "Computer Science", description: "Boolean algebra, circuit design" },
          { field: "Mathematics", description: "Proof foundations" },
          { field: "AI", description: "Knowledge representation" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["predicate-logic", "boolean-algebra"],
      related: ["sets"],
    },
    tags: ["명제", "논리", "propositional", "logic"],
  },
  {
    id: "predicate-logic",
    name: {
      ko: "술어 논리",
      en: "Predicate Logic",
      ja: "述語論理",
    },
    field: "logic",
    subfield: "predicate",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "술어 논리(1차 논리)는 명제 논리를 확장하여 변수, 양화사(∀, ∃), 술어를 포함합니다. 수학적 명제를 정확히 표현할 수 있습니다.",
        formulas: [
          {
            latex: "\\forall x \\, P(x)",
            description: "전칭 양화사 (모든 x에 대해)",
          },
          {
            latex: "\\exists x \\, P(x)",
            description: "존재 양화사 (어떤 x가 존재하여)",
          },
          {
            latex: "\\neg (\\forall x \\, P(x)) \\equiv \\exists x \\, \\neg P(x)",
            description: "양화사 부정",
          },
        ],
        examples: [
          {
            problem: "'모든 인간은 죽는다'를 술어 논리로 표현하세요.",
            solution: "∀x (Human(x) → Mortal(x))",
          },
          {
            problem: "'모든 자연수에는 더 큰 소수가 있다'를 표현하세요.",
            solution: "∀n ∃p (Prime(p) ∧ p > n)",
          },
        ],
        applications: [
          { field: "수학", description: "공리계, 정리 증명" },
          { field: "AI", description: "자동 정리 증명, 지식 베이스" },
          { field: "데이터베이스", description: "SQL 쿼리의 이론적 기반" },
        ],
      },
      en: {
        definition:
          "Predicate logic (first-order logic) extends propositional logic with variables, quantifiers (∀, ∃), and predicates. It can express mathematical statements precisely.",
        formulas: [
          {
            latex: "\\forall x \\, P(x)",
            description: "Universal quantifier (for all x)",
          },
          {
            latex: "\\exists x \\, P(x)",
            description: "Existential quantifier (there exists x)",
          },
          {
            latex: "\\neg (\\forall x \\, P(x)) \\equiv \\exists x \\, \\neg P(x)",
            description: "Quantifier negation",
          },
        ],
        examples: [
          {
            problem: "Express 'All humans are mortal' in predicate logic.",
            solution: "∀x (Human(x) → Mortal(x))",
          },
          {
            problem: "Express 'For every natural number, there's a larger prime'.",
            solution: "∀n ∃p (Prime(p) ∧ p > n)",
          },
        ],
        applications: [
          { field: "Mathematics", description: "Axiomatic systems, theorem proving" },
          { field: "AI", description: "Automated theorem proving, knowledge bases" },
          { field: "Databases", description: "Theoretical foundation of SQL" },
        ],
      },
    },
    relations: {
      prerequisites: ["propositional-logic"],
      nextTopics: ["proof-theory", "model-theory"],
      related: ["sets"],
    },
    tags: ["술어", "양화사", "predicate", "quantifier"],
  },
  {
    id: "proof-methods",
    name: {
      ko: "증명 방법",
      en: "Proof Methods",
      ja: "証明方法",
    },
    field: "logic",
    subfield: "proof-theory",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "수학적 증명은 공리와 이미 증명된 정리로부터 논리적으로 결론을 도출하는 과정입니다. 직접 증명, 귀류법, 수학적 귀납법 등이 있습니다.",
        formulas: [
          {
            latex: "P \\to Q \\text{ (직접 증명)}",
            description: "P가 참이면 Q가 참임을 보임",
          },
          {
            latex: "\\neg Q \\to \\neg P \\text{ (대우 증명)}",
            description: "Q의 부정에서 P의 부정을 도출",
          },
          {
            latex: "\\neg P \\to \\text{모순} \\Rightarrow P \\text{ (귀류법)}",
            description: "P의 부정이 모순을 유도하면 P는 참",
          },
        ],
        examples: [
          {
            problem: "√2가 무리수임을 귀류법으로 증명하세요.",
            solution:
              "√2 = a/b (기약분수)라 가정. 2 = a²/b²이므로 a² = 2b². a는 짝수, a = 2k라 하면 4k² = 2b², b² = 2k². b도 짝수. 이는 기약분수 가정에 모순.",
          },
        ],
        applications: [
          { field: "수학", description: "정리 증명" },
          { field: "컴퓨터 과학", description: "알고리즘 정확성 증명" },
          { field: "형식 검증", description: "소프트웨어 검증" },
        ],
      },
      en: {
        definition:
          "Mathematical proof is the process of deriving conclusions logically from axioms and proven theorems. Methods include direct proof, contradiction, and induction.",
        formulas: [
          {
            latex: "P \\to Q \\text{ (direct proof)}",
            description: "Assume P true, show Q true",
          },
          {
            latex: "\\neg Q \\to \\neg P \\text{ (contrapositive)}",
            description: "Derive ¬P from ¬Q",
          },
          {
            latex: "\\neg P \\to \\text{contradiction} \\Rightarrow P \\text{ (proof by contradiction)}",
            description: "If ¬P leads to contradiction, P is true",
          },
        ],
        examples: [
          {
            problem: "Prove √2 is irrational by contradiction.",
            solution:
              "Assume √2 = a/b in lowest terms. 2 = a²/b², so a² = 2b². a is even, let a = 2k. Then 4k² = 2b², b² = 2k². b is also even. Contradicts lowest terms.",
          },
        ],
        applications: [
          { field: "Mathematics", description: "Theorem proving" },
          { field: "Computer Science", description: "Algorithm correctness" },
          { field: "Formal Verification", description: "Software verification" },
        ],
      },
    },
    relations: {
      prerequisites: ["propositional-logic"],
      nextTopics: ["mathematical-induction"],
      related: ["sets"],
    },
    tags: ["증명", "귀류법", "proof", "contradiction"],
  },
  {
    id: "mathematical-induction",
    name: {
      ko: "수학적 귀납법",
      en: "Mathematical Induction",
      ja: "数学的帰納法",
    },
    field: "logic",
    subfield: "proof-theory",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "수학적 귀납법은 자연수에 대한 명제를 증명하는 방법입니다. 기초 단계(n=1)와 귀납 단계(n=k → n=k+1)로 구성됩니다.",
        formulas: [
          {
            latex: "P(1) \\land (\\forall k \\, (P(k) \\to P(k+1))) \\Rightarrow \\forall n \\, P(n)",
            description: "수학적 귀납법의 원리",
          },
        ],
        examples: [
          {
            problem: "1 + 2 + ... + n = n(n+1)/2임을 귀납법으로 증명하세요.",
            solution:
              "기초: n=1일 때 1 = 1×2/2 ✓. 귀납: 1+...+k = k(k+1)/2 가정. 1+...+k+(k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2 ✓",
          },
        ],
        history: {
          discoveredBy: "파스칼, 페르마",
          year: "17세기",
          background:
            "귀납법의 원리는 자연수의 정의에 내재되어 있으며, 명시적으로 사용된 것은 17세기부터입니다.",
        },
        applications: [
          { field: "수학", description: "급수 공식, 부등식 증명" },
          { field: "컴퓨터 과학", description: "재귀 알고리즘 분석" },
          { field: "형식 언어", description: "문법 성질 증명" },
        ],
      },
      en: {
        definition:
          "Mathematical induction proves statements about natural numbers. It consists of base case (n=1) and inductive step (n=k → n=k+1).",
        formulas: [
          {
            latex: "P(1) \\land (\\forall k \\, (P(k) \\to P(k+1))) \\Rightarrow \\forall n \\, P(n)",
            description: "Principle of mathematical induction",
          },
        ],
        examples: [
          {
            problem: "Prove 1 + 2 + ... + n = n(n+1)/2 by induction.",
            solution:
              "Base: n=1, 1 = 1×2/2 ✓. Inductive: Assume for k. Then 1+...+k+(k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2 ✓",
          },
        ],
        history: {
          discoveredBy: "Pascal, Fermat",
          year: "17th century",
          background:
            "The principle is inherent in natural number definition, explicitly used from 17th century.",
        },
        applications: [
          { field: "Mathematics", description: "Series formulas, inequality proofs" },
          { field: "Computer Science", description: "Recursive algorithm analysis" },
          { field: "Formal Languages", description: "Grammar property proofs" },
        ],
      },
    },
    relations: {
      prerequisites: ["natural-numbers", "proof-methods"],
      nextTopics: ["strong-induction", "structural-induction"],
      related: ["recursion"],
    },
    tags: ["귀납법", "증명", "induction", "proof"],
  },
  {
    id: "godels-incompleteness",
    name: {
      ko: "괴델의 불완전성 정리",
      en: "Gödel's Incompleteness Theorems",
      ja: "ゲーデルの不完全性定理",
    },
    field: "logic",
    subfield: "foundations",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "괴델의 불완전성 정리는 충분히 강력한 수학 체계에서는 증명도 반증도 할 수 없는 참인 명제가 존재함을 보여줍니다.",
        formulas: [
          {
            latex: "\\text{Con}(F) \\to \\exists G \\, (F \\nvdash G \\land F \\nvdash \\neg G)",
            description: "제1 불완전성 정리 (비형식적)",
          },
          {
            latex: "\\text{Con}(F) \\to F \\nvdash \\text{Con}(F)",
            description: "제2 불완전성 정리",
          },
        ],
        examples: [
          {
            problem: "괴델 문장의 아이디어를 설명하세요.",
            solution:
              "'이 문장은 증명될 수 없다'를 형식화. 만약 증명 가능하면 거짓인 것이 증명됨(모순). 증명 불가능하면 참이지만 증명 불가.",
          },
        ],
        history: {
          discoveredBy: "쿠르트 괴델",
          year: "1931년",
          background:
            "힐베르트 프로그램에 대한 응답으로, 수학의 완전한 형식화가 불가능함을 보였습니다.",
        },
        applications: [
          { field: "수학기초론", description: "형식 체계의 한계" },
          { field: "컴퓨터 과학", description: "정지 문제, 계산가능성" },
          { field: "철학", description: "진리와 증명의 관계" },
        ],
      },
      en: {
        definition:
          "Gödel's incompleteness theorems show that in any sufficiently powerful mathematical system, there exist true statements that cannot be proved or disproved.",
        formulas: [
          {
            latex: "\\text{Con}(F) \\to \\exists G \\, (F \\nvdash G \\land F \\nvdash \\neg G)",
            description: "First incompleteness theorem (informal)",
          },
          {
            latex: "\\text{Con}(F) \\to F \\nvdash \\text{Con}(F)",
            description: "Second incompleteness theorem",
          },
        ],
        examples: [
          {
            problem: "Explain the idea of Gödel sentence.",
            solution:
              "Formalize 'This statement is unprovable'. If provable, proves a false statement (contradiction). If unprovable, it's true but unprovable.",
          },
        ],
        history: {
          discoveredBy: "Kurt Gödel",
          year: "1931",
          background:
            "Response to Hilbert's program, showing complete formalization of mathematics is impossible.",
        },
        applications: [
          { field: "Foundations", description: "Limits of formal systems" },
          { field: "Computer Science", description: "Halting problem, computability" },
          { field: "Philosophy", description: "Truth vs. provability" },
        ],
      },
    },
    relations: {
      prerequisites: ["predicate-logic", "proof-theory"],
      nextTopics: ["computability"],
      related: ["halting-problem"],
    },
    tags: ["괴델", "불완전성", "Gödel", "incompleteness"],
  },

  // ===== 11.4 집합론과 기초 =====
  {
    id: "set-theory-foundations",
    name: {
      ko: "집합론 기초",
      en: "Set Theory Foundations",
      ja: "集合論の基礎",
    },
    field: "logic",
    subfield: "foundations",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "공리적 집합론(ZFC)은 현대 수학의 기초입니다. 집합의 존재와 연산을 공리로 규정하여 러셀의 역설 같은 모순을 피합니다.",
        formulas: [
          {
            latex: "\\forall x \\forall y (\\forall z (z \\in x \\leftrightarrow z \\in y) \\to x = y)",
            description: "외연 공리 (집합은 원소로 결정)",
          },
          {
            latex: "\\forall x \\exists y \\forall z (z \\in y \\leftrightarrow z \\in x \\land \\phi(z))",
            description: "분리 공리 (부분집합 존재)",
          },
          {
            latex: "\\forall x \\exists y \\forall z (z \\in y \\leftrightarrow z \\subseteq x)",
            description: "멱집합 공리",
          },
        ],
        examples: [
          {
            problem: "러셀의 역설을 설명하고 ZFC가 어떻게 피하는지 설명하세요.",
            solution:
              "R = {x : x ∉ x}에서 R ∈ R ⟺ R ∉ R (모순). ZFC는 분리공리로 기존 집합의 부분집합만 형성 가능하게 하여 이를 방지합니다.",
          },
        ],
        history: {
          discoveredBy: "체르멜로, 프렝켈",
          year: "1908-1922년",
          background:
            "체르멜로가 선택공리를 제시하고, 프렝켈이 치환공리를 추가했습니다.",
        },
        applications: [
          { field: "수학기초론", description: "수학의 공리적 토대" },
          { field: "컴퓨터 과학", description: "타입 이론" },
          { field: "철학", description: "존재론, 무한 개념" },
        ],
      },
      en: {
        definition:
          "Axiomatic set theory (ZFC) forms the foundation of modern mathematics. It defines set existence and operations axiomatically to avoid paradoxes like Russell's.",
        formulas: [
          {
            latex: "\\forall x \\forall y (\\forall z (z \\in x \\leftrightarrow z \\in y) \\to x = y)",
            description: "Axiom of Extensionality",
          },
          {
            latex: "\\forall x \\exists y \\forall z (z \\in y \\leftrightarrow z \\in x \\land \\phi(z))",
            description: "Axiom Schema of Separation",
          },
          {
            latex: "\\forall x \\exists y \\forall z (z \\in y \\leftrightarrow z \\subseteq x)",
            description: "Axiom of Power Set",
          },
        ],
        examples: [
          {
            problem: "Explain Russell's paradox and how ZFC avoids it.",
            solution:
              "R = {x : x ∉ x} leads to R ∈ R ⟺ R ∉ R (contradiction). ZFC's Separation only allows forming subsets of existing sets, preventing this.",
          },
        ],
        history: {
          discoveredBy: "Zermelo, Fraenkel",
          year: "1908-1922",
          background:
            "Zermelo introduced the Axiom of Choice; Fraenkel added Replacement.",
        },
        applications: [
          { field: "Foundations", description: "Axiomatic basis of mathematics" },
          { field: "Computer Science", description: "Type theory" },
          { field: "Philosophy", description: "Ontology, concept of infinity" },
        ],
      },
    },
    relations: {
      prerequisites: ["predicate-logic"],
      nextTopics: ["ordinals", "cardinals"],
      related: ["sets"],
    },
    tags: ["집합론", "ZFC", "공리", "set theory", "axiom"],
  },
  {
    id: "boolean-algebra-logic",
    name: {
      ko: "불리언 대수",
      en: "Boolean Algebra",
      ja: "ブール代数",
    },
    field: "logic",
    subfield: "propositional",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "불리언 대수는 0과 1(또는 거짓/참)에 대한 논리 연산 체계입니다. AND, OR, NOT 연산이 정의되며 디지털 회로의 기초입니다.",
        formulas: [
          {
            latex: "x \\land (y \\lor z) = (x \\land y) \\lor (x \\land z)",
            description: "분배법칙",
          },
          {
            latex: "\\neg(x \\land y) = \\neg x \\lor \\neg y",
            description: "드모르간 법칙",
          },
          {
            latex: "x \\lor \\neg x = 1, \\quad x \\land \\neg x = 0",
            description: "보원 법칙",
          },
        ],
        examples: [
          {
            problem: "불리언 식 x ∧ (x ∨ y)를 간소화하세요.",
            solution:
              "x ∧ (x ∨ y) = (x ∧ x) ∨ (x ∧ y) = x ∨ (x ∧ y) = x (흡수법칙)",
          },
        ],
        history: {
          discoveredBy: "조지 불",
          year: "1854년",
          background:
            "불이 '사고의 법칙'에서 논리를 대수적으로 다루는 체계를 제시했습니다.",
        },
        applications: [
          { field: "디지털 회로", description: "논리 게이트 설계" },
          { field: "프로그래밍", description: "조건문, 비트 연산" },
          { field: "데이터베이스", description: "쿼리 조건" },
        ],
      },
      en: {
        definition:
          "Boolean algebra is a logical operation system on 0 and 1 (false/true). Defines AND, OR, NOT operations and forms the basis of digital circuits.",
        formulas: [
          {
            latex: "x \\land (y \\lor z) = (x \\land y) \\lor (x \\land z)",
            description: "Distributive law",
          },
          {
            latex: "\\neg(x \\land y) = \\neg x \\lor \\neg y",
            description: "De Morgan's law",
          },
          {
            latex: "x \\lor \\neg x = 1, \\quad x \\land \\neg x = 0",
            description: "Complement laws",
          },
        ],
        examples: [
          {
            problem: "Simplify the Boolean expression x ∧ (x ∨ y).",
            solution:
              "x ∧ (x ∨ y) = (x ∧ x) ∨ (x ∧ y) = x ∨ (x ∧ y) = x (absorption law)",
          },
        ],
        history: {
          discoveredBy: "George Boole",
          year: "1854",
          background:
            "Boole presented an algebraic treatment of logic in 'Laws of Thought'.",
        },
        applications: [
          { field: "Digital Circuits", description: "Logic gate design" },
          { field: "Programming", description: "Conditionals, bit operations" },
          { field: "Databases", description: "Query conditions" },
        ],
      },
    },
    relations: {
      prerequisites: ["propositional-logic"],
      nextTopics: ["karnaugh-maps", "circuit-design"],
      related: ["sets"],
    },
    tags: ["불리언", "논리회로", "Boolean", "logic gates"],
  },
  {
    id: "model-theory",
    name: {
      ko: "모델 이론",
      en: "Model Theory",
      ja: "モデル理論",
    },
    field: "logic",
    subfield: "model-theory",
    difficulty: 5,
    content: {
      ko: {
        definition:
          "모델 이론은 형식 언어와 그것이 해석되는 구조(모델) 사이의 관계를 연구합니다. 어떤 이론이 참이 되는 구조를 분석합니다.",
        formulas: [
          {
            latex: "\\mathcal{M} \\models \\phi",
            description: "모델 M이 문장 φ를 만족",
          },
          {
            latex: "\\text{Th}(\\mathcal{M}) = \\{\\phi : \\mathcal{M} \\models \\phi\\}",
            description: "구조 M의 이론",
          },
        ],
        examples: [
          {
            problem: "실수체 (ℝ, +, ×, 0, 1, <)가 산술의 어떤 이론을 만족하는지 설명하세요.",
            solution:
              "실수체는 실폐체(RCF)의 모델입니다. 타르스키가 RCF의 완전성과 결정가능성을 증명했습니다.",
          },
        ],
        applications: [
          { field: "대수학", description: "대수적 구조 분류" },
          { field: "수학기초론", description: "완전성, 범주성 연구" },
          { field: "컴퓨터 과학", description: "형식 검증" },
        ],
      },
      en: {
        definition:
          "Model theory studies the relationship between formal languages and structures (models) that interpret them. It analyzes structures where theories hold true.",
        formulas: [
          {
            latex: "\\mathcal{M} \\models \\phi",
            description: "Model M satisfies sentence φ",
          },
          {
            latex: "\\text{Th}(\\mathcal{M}) = \\{\\phi : \\mathcal{M} \\models \\phi\\}",
            description: "Theory of structure M",
          },
        ],
        examples: [
          {
            problem: "Explain what theory the real field (ℝ, +, ×, 0, 1, <) satisfies.",
            solution:
              "Real field is a model of the theory of Real Closed Fields (RCF). Tarski proved RCF is complete and decidable.",
          },
        ],
        applications: [
          { field: "Algebra", description: "Classification of algebraic structures" },
          { field: "Foundations", description: "Completeness, categoricity" },
          { field: "Computer Science", description: "Formal verification" },
        ],
      },
    },
    relations: {
      prerequisites: ["predicate-logic", "set-theory-foundations"],
      nextTopics: ["ultraproducts", "types"],
      related: ["proof-methods"],
    },
    tags: ["모델이론", "구조", "model theory", "structure"],
  },
  {
    id: "decidability",
    name: {
      ko: "결정가능성",
      en: "Decidability",
      ja: "決定可能性",
    },
    field: "logic",
    subfield: "computability",
    difficulty: 4,
    content: {
      ko: {
        definition:
          "이론이 결정가능하다는 것은 그 이론의 임의의 문장이 참인지 거짓인지 판별하는 알고리즘이 존재한다는 것입니다. 프레스버거 산술은 결정가능하지만 페아노 산술은 결정불가능합니다.",
        formulas: [
          {
            latex: "T \\text{ decidable} \\Leftrightarrow \\exists \\text{ algorithm } A: A(\\phi) = \\begin{cases} 1 & T \\vdash \\phi \\\\ 0 & T \\nvdash \\phi \\end{cases}",
            description: "결정가능성의 정의",
          },
        ],
        examples: [
          {
            problem: "정지 문제가 결정불가능함을 설명하세요.",
            solution:
              "프로그램 P와 입력 I에 대해 P(I)가 정지하는지 판별하는 알고리즘이 없습니다. 귀류법으로 증명: 그런 알고리즘 H가 존재하면 자기참조적 모순 발생.",
          },
        ],
        history: {
          discoveredBy: "앨런 튜링, 알론조 처치",
          year: "1936년",
          background:
            "튜링과 처치가 독립적으로 결정불가능한 문제의 존재를 증명했습니다.",
        },
        applications: [
          { field: "컴퓨터 과학", description: "계산 한계" },
          { field: "소프트웨어 공학", description: "프로그램 검증의 한계" },
          { field: "인공지능", description: "자동 추론의 한계" },
        ],
      },
      en: {
        definition:
          "A theory is decidable if there's an algorithm to determine whether any sentence is true or false. Presburger arithmetic is decidable, but Peano arithmetic is undecidable.",
        formulas: [
          {
            latex: "T \\text{ decidable} \\Leftrightarrow \\exists \\text{ algorithm } A: A(\\phi) = \\begin{cases} 1 & T \\vdash \\phi \\\\ 0 & T \\nvdash \\phi \\end{cases}",
            description: "Definition of decidability",
          },
        ],
        examples: [
          {
            problem: "Explain why the halting problem is undecidable.",
            solution:
              "No algorithm can determine if program P halts on input I. Proof by contradiction: if such H exists, construct self-referential paradox.",
          },
        ],
        history: {
          discoveredBy: "Alan Turing, Alonzo Church",
          year: "1936",
          background:
            "Turing and Church independently proved existence of undecidable problems.",
        },
        applications: [
          { field: "Computer Science", description: "Limits of computation" },
          { field: "Software Engineering", description: "Limits of program verification" },
          { field: "AI", description: "Limits of automated reasoning" },
        ],
      },
    },
    relations: {
      prerequisites: ["predicate-logic", "godels-incompleteness"],
      nextTopics: ["computability-theory", "complexity-theory"],
      related: ["halting-problem"],
    },
    tags: ["결정가능성", "튜링", "decidability", "Turing"],
  },
  {
    id: "strong-induction",
    name: {
      ko: "강한 귀납법",
      en: "Strong Induction",
      ja: "強帰納法",
    },
    field: "logic",
    subfield: "proof-theory",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "강한 귀납법(완전 귀납법)에서는 n보다 작은 모든 경우가 성립한다고 가정하고 n인 경우를 증명합니다. 일반 귀납법보다 강력한 가정을 사용합니다.",
        formulas: [
          {
            latex: "P(0) \\land (\\forall n \\, ((\\forall k < n \\, P(k)) \\to P(n))) \\Rightarrow \\forall n \\, P(n)",
            description: "강한 귀납법의 원리",
          },
        ],
        examples: [
          {
            problem: "모든 n ≥ 2인 자연수는 소수의 곱으로 나타낼 수 있음을 강한 귀납법으로 증명하세요.",
            solution:
              "n이 소수면 완료. 합성수면 n = ab (1 < a, b < n). 귀납 가정에 의해 a, b가 소수 곱. 따라서 n도 소수 곱.",
          },
        ],
        applications: [
          { field: "수학", description: "존재 증명" },
          { field: "컴퓨터 과학", description: "재귀 알고리즘 분석" },
          { field: "조합론", description: "분할 정리 증명" },
        ],
      },
      en: {
        definition:
          "Strong induction assumes all cases less than n hold and proves case n. It uses a stronger hypothesis than simple induction.",
        formulas: [
          {
            latex: "P(0) \\land (\\forall n \\, ((\\forall k < n \\, P(k)) \\to P(n))) \\Rightarrow \\forall n \\, P(n)",
            description: "Principle of strong induction",
          },
        ],
        examples: [
          {
            problem: "Prove every n ≥ 2 can be written as product of primes using strong induction.",
            solution:
              "If n is prime, done. If composite, n = ab (1 < a, b < n). By induction hypothesis, a, b are prime products. So n is too.",
          },
        ],
        applications: [
          { field: "Mathematics", description: "Existence proofs" },
          { field: "Computer Science", description: "Recursive algorithm analysis" },
          { field: "Combinatorics", description: "Partition theorem proofs" },
        ],
      },
    },
    relations: {
      prerequisites: ["mathematical-induction"],
      nextTopics: ["structural-induction", "transfinite-induction"],
      related: ["well-ordering"],
    },
    tags: ["강한귀납법", "완전귀납법", "strong induction", "complete induction"],
  },
  {
    id: "truth-tables",
    name: {
      ko: "진리표",
      en: "Truth Tables",
      ja: "真理値表",
    },
    field: "logic",
    subfield: "propositional",
    difficulty: 1,
    content: {
      ko: {
        definition:
          "진리표는 명제의 모든 가능한 진릿값 조합에 대해 복합 명제의 진릿값을 보여주는 표입니다. 논리식의 타당성, 충족가능성을 판별합니다.",
        formulas: [
          {
            latex: "\\begin{array}{cc|c} p & q & p \\to q \\\\ T & T & T \\\\ T & F & F \\\\ F & T & T \\\\ F & F & T \\end{array}",
            description: "조건문의 진리표",
          },
        ],
        examples: [
          {
            problem: "p ∨ ¬p가 항진명제임을 진리표로 보이세요.",
            solution:
              "p=T일 때 T∨F=T, p=F일 때 F∨T=T. 모든 경우 참이므로 항진명제.",
          },
        ],
        applications: [
          { field: "논리학", description: "논리식 검증" },
          { field: "회로 설계", description: "조합 회로 분석" },
          { field: "프로그래밍", description: "조건문 분석" },
        ],
      },
      en: {
        definition:
          "A truth table shows the truth value of compound propositions for all possible combinations of component truth values. Used to determine validity and satisfiability.",
        formulas: [
          {
            latex: "\\begin{array}{cc|c} p & q & p \\to q \\\\ T & T & T \\\\ T & F & F \\\\ F & T & T \\\\ F & F & T \\end{array}",
            description: "Truth table for implication",
          },
        ],
        examples: [
          {
            problem: "Show p ∨ ¬p is a tautology using a truth table.",
            solution:
              "p=T: T∨F=T, p=F: F∨T=T. True in all cases, so it's a tautology.",
          },
        ],
        applications: [
          { field: "Logic", description: "Verifying logical formulas" },
          { field: "Circuit Design", description: "Combinational circuit analysis" },
          { field: "Programming", description: "Conditional statement analysis" },
        ],
      },
    },
    relations: {
      prerequisites: [],
      nextTopics: ["propositional-logic", "boolean-algebra-logic"],
      related: ["tautology"],
    },
    tags: ["진리표", "논리", "truth table", "logic"],
  },
];
