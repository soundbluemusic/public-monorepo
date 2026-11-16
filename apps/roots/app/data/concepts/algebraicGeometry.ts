import type { MathConcept } from '../types';

export const algebraicGeometryConcepts: MathConcept[] = [
  {
    id: 'algebraic-variety',
    name: {
      ko: '대수적 다양체',
      en: 'Algebraic Variety',
    },
    field: 'algebraic-geometry',
    subfield: 'varieties',
    difficulty: 5,
    content: {
      ko: {
        definition: '다항식 방정식의 해집합. 대수기하학의 기본 연구 대상',
        formulas: [
          'V(I) = {x ∈ kⁿ : f(x) = 0, ∀f ∈ I}',
          '아핀 다양체: Aⁿ의 부분집합',
          '사영 다양체: Pⁿ의 부분집합',
        ],
        examples: ['원: x² + y² = 1', '타원곡선: y² = x³ + ax + b', '곡면: xyz = 1'],
        applications: ['암호학', '정수론', '물리학'],
      },
      en: {
        definition:
          'Solution set of polynomial equations. Fundamental objects in algebraic geometry',
        formulas: [
          'V(I) = {x ∈ kⁿ : f(x) = 0, ∀f ∈ I}',
          'Affine variety: subset of Aⁿ',
          'Projective variety: subset of Pⁿ',
        ],
        examples: ['Circle: x² + y² = 1', 'Elliptic curve: y² = x³ + ax + b', 'Surface: xyz = 1'],
        applications: ['Cryptography', 'Number theory', 'Physics'],
      },
    },
    latex: 'V(I) = \\{x \\in k^n : f(x) = 0, \\; \\forall f \\in I\\}',
    relations: {
      prerequisites: ['polynomial-ring', 'ideal'],
      nextTopics: ['scheme', 'sheaf'],
      related: ['manifold'],
      applications: ['cryptography', 'physics'],
    },
    tags: ['다양체', 'variety', '대수기하', 'algebraic'],
  },
  {
    id: 'projective-space',
    name: {
      ko: '사영 공간',
      en: 'Projective Space',
    },
    field: 'algebraic-geometry',
    subfield: 'spaces',
    difficulty: 4,
    content: {
      ko: {
        definition: '벡터공간의 1차원 부분공간들의 집합. "무한점"을 포함하여 기하학 완성',
        formulas: ['Pⁿ = (kⁿ⁺¹ - {0})/~', '[x₀:x₁:...:xₙ] (동차좌표)', 'P¹ = k ∪ {∞}'],
        examples: ['P¹ (사영직선)', 'P² (사영평면)', '무한점에서 만나는 평행선'],
        applications: ['대수기하', '컴퓨터 비전', '원근법'],
      },
      en: {
        definition:
          'Set of 1-dimensional subspaces of vector space. Completes geometry by including "points at infinity"',
        formulas: ['Pⁿ = (kⁿ⁺¹ - {0})/~', '[x₀:x₁:...:xₙ] (homogeneous coords)', 'P¹ = k ∪ {∞}'],
        examples: [
          'P¹ (projective line)',
          'P² (projective plane)',
          'Parallel lines meeting at infinity',
        ],
        applications: ['Algebraic geometry', 'Computer vision', 'Perspective'],
      },
    },
    latex: '\\mathbb{P}^n = (k^{n+1} - \\{0\\})/\\sim',
    relations: {
      prerequisites: ['linear-algebra', 'equivalence-relation'],
      nextTopics: ['algebraic-variety', 'grassmannian'],
      related: ['affine-space'],
      applications: ['computer-graphics', 'geometry'],
    },
    tags: ['사영', 'projective', '동차좌표', 'homogeneous'],
  },
  {
    id: 'scheme',
    name: {
      ko: '스킴',
      en: 'Scheme',
    },
    field: 'algebraic-geometry',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition:
          '각 점이 어떤 아핀 스킴과 국소환달린 공간으로서 동형인 열린 근방을 갖는 국소환달린 공간입니다.',
        formulas: [
          '(X, O_X)',
          'Spec A: 소 아이디얼의 집합',
          '구조층: O_X (각 점에서의 줄기가 국소환)',
        ],
        examples: ['Spec ℤ', 'Spec k[x]', 'Proj (사영 스킴)'],
        applications: ['수론', '대수기하', '호몰로지대수'],
      },
      en: {
        definition:
          'A locally ringed space in which every point has an open neighborhood isomorphic, as a locally ringed space, to an affine scheme.',
        formulas: [
          '(X, O_X)',
          'Spec A: set of prime ideals',
          'Structure sheaf: O_X (each stalk is a local ring)',
        ],
        examples: ['Spec ℤ', 'Spec k[x]', 'Proj (projective scheme)'],
        applications: ['Number theory', 'Algebraic geometry', 'Homological algebra'],
      },
    },
    latex: '(X, \\mathcal{O}_X)',
    relations: {
      prerequisites: ['algebraic-variety', 'commutative-algebra', 'sheaf'],
      nextTopics: ['coherent-sheaf', 'morphism'],
      related: ['manifold'],
      applications: ['number-theory', 'moduli'],
    },
    tags: ['스킴', 'scheme', 'Spec', 'Grothendieck'],
  },
  {
    id: 'sheaf-theory',
    name: {
      ko: '층 이론',
      en: 'Sheaf Theory',
    },
    field: 'algebraic-geometry',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition: '위상공간의 열린집합에 대수적 데이터를 붙이는 구조',
        formulas: [
          '전층: F: Open(X)^op → C',
          '층 조건: 접합 공리',
          '층화: 전층 → 층',
          '층 코호몰로지: Hⁿ(X, F)',
        ],
        examples: ['연속함수 층', '미분형식 층', '정칙함수 층 O'],
        applications: ['대수기하', '복소해석', '위상수학'],
      },
      en: {
        definition: 'Structure attaching algebraic data to open sets of topological space',
        formulas: [
          'Presheaf: F: Open(X)^op → C',
          'Sheaf condition: gluing axiom',
          'Sheafification: presheaf → sheaf',
          'Sheaf cohomology: Hⁿ(X, F)',
        ],
        examples: [
          'Sheaf of continuous functions',
          'Sheaf of differential forms',
          'Structure sheaf O',
        ],
        applications: ['Algebraic geometry', 'Complex analysis', 'Topology'],
      },
    },
    latex: 'H^n(X, \\mathcal{F})',
    relations: {
      prerequisites: ['topology', 'category-definition'],
      nextTopics: ['scheme', 'derived-category'],
      related: ['cohomology'],
      applications: ['algebraic-geometry', 'complex-analysis'],
    },
    tags: ['층', 'sheaf', '코호몰로지', 'cohomology'],
  },
  {
    id: 'bezouts-theorem',
    name: {
      ko: '베주 정리',
      en: "Bézout's Theorem",
    },
    field: 'algebraic-geometry',
    subfield: 'intersection',
    difficulty: 4,
    content: {
      ko: {
        definition:
          '공통 곡선 성분이 없는 두 복소 사영 평면 곡선의 교점은 중복도를 포함해 세면 차수의 곱입니다.',
        formulas: [
          'deg(C₁) · deg(C₂) = Σ m_p',
          '복소 사영 평면에서 공통 성분이 없어야 하며 중복도와 무한점을 포함',
        ],
        examples: [
          '공통 성분이 없는 직선과 원뿔곡선: 중복도를 포함해 2',
          '공통 성분이 없는 두 원뿔곡선: 중복도를 포함해 4',
        ],
        applications: ['교점 이론', '대수기하', '기하학'],
      },
      en: {
        definition:
          'Two complex projective plane curves without a common component intersect in a number of points, counted with multiplicity, equal to the product of their degrees.',
        formulas: [
          'deg(C₁) · deg(C₂) = Σ m_p',
          'Over the complex projective plane, no common component; count multiplicities and points at infinity',
        ],
        examples: [
          'A line and a conic with no common component: 2 intersections counting multiplicity',
          'Two conics with no common component: 4 intersections counting multiplicity',
        ],
        applications: ['Intersection theory', 'Algebraic geometry', 'Geometry'],
      },
    },
    latex: '\\deg(C_1) \\cdot \\deg(C_2) = \\sum_p m_p',
    relations: {
      prerequisites: ['projective-space', 'polynomial-degree'],
      nextTopics: ['intersection-multiplicity'],
      related: ['fundamental-theorem-algebra'],
      applications: ['intersection-theory'],
    },
    tags: ['베주', 'Bézout', '교점', 'intersection'],
  },
  {
    id: 'hilbert-nullstellensatz',
    name: {
      ko: '힐베르트 영점정리',
      en: 'Hilbert Nullstellensatz',
    },
    field: 'algebraic-geometry',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition:
          '대수적으로 닫힌 체 위에서 다항식의 아이디얼과 대수적 집합을 연결하는 정리. 대수기하학의 기초',
        formulas: [
          'I(V(I)) = √I (근기)',
          '약한 형태: k 대수폐체, I ≠ k[x] ⟹ V(I) ≠ ∅',
          'I, V 사이의 갈루아 대응',
        ],
        examples: ['V(x²) = {0}, I(V(x²)) = (x)'],
        applications: ['대수기하', '가환대수', '정수론'],
      },
      en: {
        definition:
          'A theorem connecting polynomial ideals and algebraic sets over an algebraically closed field. A foundation of algebraic geometry',
        formulas: [
          'I(V(I)) = √I (radical)',
          'Weak form: k alg. closed, I ≠ k[x] ⟹ V(I) ≠ ∅',
          'Galois correspondence between I, V',
        ],
        examples: ['V(x²) = {0}, I(V(x²)) = (x)'],
        applications: ['Algebraic geometry', 'Commutative algebra', 'Number theory'],
      },
    },
    latex:
      'I(V(I)) = \\sqrt{I}, \\quad I\\subseteq k[x_1,\\ldots,x_n],\\quad k\\text{ algebraically closed}',
    relations: {
      prerequisites: ['ideal', 'polynomial-ring'],
      nextTopics: ['algebraic-variety', 'scheme'],
      related: ['fundamental-theorem-algebra'],
      applications: ['algebraic-geometry'],
    },
    tags: ['힐베르트', 'Nullstellensatz', '영점', 'radical'],
  },
  {
    id: 'riemann-roch',
    name: {
      ko: '리만-로흐 정리',
      en: 'Riemann-Roch Theorem',
    },
    field: 'algebraic-geometry',
    subfield: 'curves',
    difficulty: 5,
    content: {
      ko: {
        definition: '매끄러운 사영 대수곡선 위 인자에 관한 기본 정리',
        formulas: ['ℓ(D) - ℓ(K-D) = deg(D) - g + 1', 'g: 종수, K: 표준인자', 'ℓ(D) = dim L(D)'],
        examples: ['P¹: ℓ(D) = max(0, deg(D)+1)', 'g=1 타원곡선'],
        applications: ['곡선론', '암호학', '코딩이론'],
      },
      en: {
        definition: 'Fundamental theorem for divisors on smooth projective algebraic curves',
        formulas: [
          'ℓ(D) - ℓ(K-D) = deg(D) - g + 1',
          'g: genus, K: canonical divisor',
          'ℓ(D) = dim L(D)',
        ],
        examples: ['P¹: ℓ(D) = max(0, deg(D)+1)', 'g=1 elliptic curve'],
        applications: ['Curve theory', 'Cryptography', 'Coding theory'],
      },
    },
    latex: '\\ell(D) - \\ell(K-D) = \\deg(D) - g + 1',
    relations: {
      prerequisites: ['algebraic-variety', 'divisor'],
      nextTopics: ['grothendieck-riemann-roch'],
      related: ['genus'],
      applications: ['curves', 'coding-theory'],
    },
    tags: ['리만로흐', 'Riemann-Roch', '종수', 'genus'],
  },
  {
    id: 'elliptic-curves-ag',
    name: {
      ko: '타원곡선 (대수기하)',
      en: 'Elliptic Curves (Algebraic Geometry)',
    },
    field: 'algebraic-geometry',
    subfield: 'curves',
    difficulty: 5,
    content: {
      ko: {
        definition:
          '종수 1인 매끄럽고 사영적인 곡선에 기준 체 위의 점을 하나 지정한 것. 이 점을 항등원으로 군 구조를 가짐',
        formulas: [
          'y² = x³ + ax + b (체의 특성이 2와 3이 아닐 때의 짧은 바이어슈트라스 형태)',
          'Δ = -16(4a³ + 27b²) ≠ 0',
          '점 덧셈: 한 직선이 만나는 세 점 P, Q, R에 대해 P + Q + R = O (중복도 포함)',
        ],
        examples: ['y² = x³ - x', 'y² = x³ - 432'],
        applications: ['암호학', '페르마의 마지막 정리', '정수론'],
      },
      en: {
        definition:
          'A smooth projective curve of genus 1 with a specified point over the base field, which serves as the identity for its group law',
        formulas: [
          'y² = x³ + ax + b (short Weierstrass form in characteristic other than 2 and 3)',
          'Δ = -16(4a³ + 27b²) ≠ 0',
          'Point addition: P + Q + R = O for three collinear intersection points, counted with multiplicity',
        ],
        examples: ['y² = x³ - x', 'y² = x³ - 432'],
        applications: ['Cryptography', "Fermat's Last Theorem", 'Number theory'],
      },
    },
    latex: 'y^2 = x^3 + ax + b,\\quad 4a^3 + 27b^2 \\ne 0,\\quad \\operatorname{char}(k) \\ne 2,3',
    relations: {
      prerequisites: ['algebraic-variety', 'group-theory'],
      nextTopics: ['abelian-variety', 'modular-forms'],
      related: ['elliptic-curve-crypto'],
      applications: ['cryptography', 'number-theory'],
    },
    tags: ['타원곡선', 'elliptic', '암호', 'group-law'],
  },
];
