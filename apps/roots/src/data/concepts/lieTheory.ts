import type { MathConcept } from '../types';

export const lieTheoryConcepts: MathConcept[] = [
  {
    id: 'lie-group',
    name: {
      ko: '리 군',
      en: 'Lie Group',
      ja: 'リー群',
    },
    field: 'algebra',
    subfield: 'lie-theory',
    difficulty: 5,
    content: {
      ko: '매끄러운 다양체 구조를 가진 군입니다. 군 연산이 미분 가능하며, 연속적인 대칭을 표현합니다.',
      en: 'A group with smooth manifold structure. Group operations are differentiable, representing continuous symmetries.',
      ja: '滑らかな多様体構造を持つ群です。群演算は微分可能で、連続的な対称性を表現します。',
    },
    latex:
      'G \\text{ is a Lie group if } \\mu: G \\times G \\to G, \\, \\iota: G \\to G \\text{ are smooth}',
    relations: {
      prerequisites: ['group-theory', 'differentiable-manifold'],
      nextTopics: ['lie-algebra', 'exponential-map-lie'],
      related: ['matrix-groups', 'topological-groups'],
      applications: ['physics', 'differential-equations', 'robotics'],
    },
    tags: ['lie-theory', 'group', 'manifold'],
  },
  {
    id: 'lie-algebra',
    name: {
      ko: '리 대수',
      en: 'Lie Algebra',
      ja: 'リー代数',
    },
    field: 'algebra',
    subfield: 'lie-theory',
    difficulty: 5,
    content: {
      ko: '리 군의 항등원에서의 접공간으로, 리 괄호 연산을 갖습니다. 군의 무한소 구조를 인코딩합니다.',
      en: 'The tangent space at the identity of a Lie group, equipped with Lie bracket. Encodes infinitesimal structure of the group.',
      ja: 'リー群の単位元での接空間で、リー括弧演算を持ちます。群の無限小構造をエンコードします。',
    },
    latex:
      '\\mathfrak{g} = T_eG, \\quad [X,Y] = XY - YX, \\quad [X,[Y,Z]] + [Y,[Z,X]] + [Z,[X,Y]] = 0',
    relations: {
      prerequisites: ['lie-group', 'vector-space'],
      nextTopics: ['structure-constants', 'killing-form'],
      related: ['bracket-operation', 'jacobi-identity'],
      applications: ['quantum-mechanics', 'particle-physics'],
    },
    tags: ['lie-theory', 'algebra', 'infinitesimal'],
  },
  {
    id: 'exponential-map-lie',
    name: {
      ko: '지수 사상',
      en: 'Exponential Map',
      ja: '指数写像',
    },
    field: 'algebra',
    subfield: 'lie-theory',
    difficulty: 5,
    content: {
      ko: '리 대수에서 리 군으로 가는 사상입니다. 무한소 생성자로부터 유한 변환을 생성합니다.',
      en: 'A map from Lie algebra to Lie group. Generates finite transformations from infinitesimal generators.',
      ja: 'リー代数からリー群への写像です。無限小生成子から有限変換を生成します。',
    },
    latex:
      '\\exp: \\mathfrak{g} \\to G, \\quad \\exp(X) = \\sum_{n=0}^{\\infty} \\frac{X^n}{n!} = e^X',
    relations: {
      prerequisites: ['lie-group', 'lie-algebra'],
      nextTopics: ['baker-campbell-hausdorff', 'one-parameter-subgroup'],
      related: ['matrix-exponential', 'adjoint-representation'],
      applications: ['quantum-mechanics', 'control-theory'],
    },
    tags: ['lie-theory', 'exponential', 'mapping'],
  },
  {
    id: 'classical-lie-groups',
    name: {
      ko: '고전 리 군',
      en: 'Classical Lie Groups',
      ja: '古典リー群',
    },
    field: 'algebra',
    subfield: 'lie-theory',
    difficulty: 4,
    content: {
      ko: 'GL(n), SL(n), O(n), SO(n), U(n), SU(n), Sp(n) 등 행렬로 표현되는 기본적인 리 군들입니다.',
      en: 'Fundamental Lie groups represented as matrices: GL(n), SL(n), O(n), SO(n), U(n), SU(n), Sp(n).',
      ja: 'GL(n), SL(n), O(n), SO(n), U(n), SU(n), Sp(n)など行列で表される基本的なリー群です。',
    },
    latex: 'SO(n) = \\{A \\in GL(n,\\mathbb{R}) : A^TA = I, \\det A = 1\\}',
    relations: {
      prerequisites: ['matrix', 'group-theory'],
      nextTopics: ['lie-group', 'compact-lie-groups'],
      related: ['rotation-group', 'unitary-group'],
      applications: ['physics', 'computer-graphics', 'robotics'],
    },
    tags: ['lie-theory', 'matrix-group', 'classical'],
  },
  {
    id: 'adjoint-representation',
    name: {
      ko: '딸림 표현',
      en: 'Adjoint Representation',
      ja: '随伴表現',
    },
    field: 'algebra',
    subfield: 'lie-theory',
    difficulty: 5,
    content: {
      ko: '리 군이 자신의 리 대수에 작용하는 표현입니다. 리 대수의 구조를 연구하는 데 핵심적입니다.',
      en: 'A representation of a Lie group acting on its own Lie algebra. Essential for studying Lie algebra structure.',
      ja: 'リー群が自身のリー代数に作用する表現です。リー代数の構造研究に重要です。',
    },
    latex: '\\text{Ad}_g(X) = gXg^{-1}, \\quad \\text{ad}_X(Y) = [X,Y]',
    relations: {
      prerequisites: ['lie-group', 'lie-algebra', 'group-representation'],
      nextTopics: ['killing-form', 'root-system'],
      related: ['conjugation', 'inner-automorphism'],
      applications: ['gauge-theory', 'representation-theory'],
    },
    tags: ['lie-theory', 'representation', 'adjoint'],
  },
  {
    id: 'killing-form',
    name: {
      ko: '킬링 형식',
      en: 'Killing Form',
      ja: 'キリング形式',
    },
    field: 'algebra',
    subfield: 'lie-theory',
    difficulty: 5,
    content: {
      ko: '리 대수 위의 대칭 쌍선형 형식입니다. 리 대수의 반단순성 판별과 분류에 핵심적입니다.',
      en: 'A symmetric bilinear form on a Lie algebra. Essential for determining semisimplicity and classification.',
      ja: 'リー代数上の対称双線形形式です。半単純性の判定と分類に重要です。',
    },
    latex: 'B(X,Y) = \\text{tr}(\\text{ad}_X \\circ \\text{ad}_Y)',
    relations: {
      prerequisites: ['lie-algebra', 'adjoint-representation'],
      nextTopics: ['cartan-criterion', 'root-system'],
      related: ['semisimple-lie-algebra', 'trace'],
      applications: ['classification', 'structure-theory'],
    },
    tags: ['lie-theory', 'bilinear-form', 'semisimple'],
  },
  {
    id: 'root-system',
    name: {
      ko: '근계',
      en: 'Root System',
      ja: 'ルート系',
    },
    field: 'algebra',
    subfield: 'lie-theory',
    difficulty: 5,
    content: {
      ko: '반단순 리 대수의 구조를 인코딩하는 유한 벡터 집합입니다. 딘킨 다이어그램으로 분류됩니다.',
      en: 'A finite set of vectors encoding the structure of semisimple Lie algebras. Classified by Dynkin diagrams.',
      ja: '半単純リー代数の構造をエンコードする有限ベクトル集合です。ディンキン図形で分類されます。',
    },
    latex:
      '\\Phi \\subset \\mathfrak{h}^*, \\quad \\alpha \\in \\Phi \\Rightarrow -\\alpha \\in \\Phi, \\quad \\langle \\alpha, \\beta^\\vee \\rangle \\in \\mathbb{Z}',
    relations: {
      prerequisites: ['semisimple-lie-algebra', 'cartan-subalgebra'],
      nextTopics: ['weyl-group', 'dynkin-diagram'],
      related: ['simple-roots', 'cartan-matrix'],
      applications: ['representation-theory', 'algebraic-groups'],
    },
    tags: ['lie-theory', 'root', 'classification'],
  },
  {
    id: 'semisimple-lie-algebra',
    name: {
      ko: '반단순 리 대수',
      en: 'Semisimple Lie Algebra',
      ja: '半単純リー代数',
    },
    field: 'algebra',
    subfield: 'lie-theory',
    difficulty: 5,
    content: {
      ko: '가해 이데알이 없는 리 대수입니다. 단순 리 대수들의 직합으로 분해되며, 킬링 형식이 비퇴화입니다.',
      en: 'A Lie algebra with no solvable ideals. Decomposes as direct sum of simple Lie algebras; Killing form is non-degenerate.',
      ja: '可解イデアルを持たないリー代数です。単純リー代数の直和に分解され、キリング形式が非退化です。',
    },
    latex:
      '\\mathfrak{g} = \\mathfrak{g}_1 \\oplus \\cdots \\oplus \\mathfrak{g}_k, \\quad \\mathfrak{g}_i \\text{ simple}',
    relations: {
      prerequisites: ['lie-algebra', 'ideal'],
      nextTopics: ['root-system', 'cartan-decomposition'],
      related: ['simple-lie-algebra', 'radical'],
      applications: ['representation-theory', 'theoretical-physics'],
    },
    tags: ['lie-theory', 'semisimple', 'structure'],
  },
];
