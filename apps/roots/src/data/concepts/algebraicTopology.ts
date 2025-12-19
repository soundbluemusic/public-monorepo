import type { MathConcept } from '../types';

export const algebraicTopologyConcepts: MathConcept[] = [
  {
    id: 'fundamental-group',
    name: {
      ko: '기본군',
      en: 'Fundamental Group',
      ja: '基本群',
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 4,
    content: {
      ko: '공간의 루프들을 호모토피 동치류로 분류한 군입니다. 공간의 1차원적 구멍 구조를 인코딩합니다.',
      en: 'A group classifying loops in a space up to homotopy equivalence. Encodes 1-dimensional hole structure of spaces.',
      ja: '空間のループをホモトピー同値類で分類した群です。空間の1次元的な穴の構造をエンコードします。',
    },
    latex: '\\pi_1(X, x_0) = \\{[\\gamma] : \\gamma: [0,1] \\to X, \\gamma(0)=\\gamma(1)=x_0\\}',
    relations: {
      prerequisites: ['homotopy', 'group-theory'],
      nextTopics: ['covering-space', 'higher-homotopy'],
      related: ['path-connected', 'simply-connected'],
      applications: ['knot-theory', 'surface-classification'],
    },
    tags: ['topology', 'algebraic-topology', 'homotopy'],
  },
  {
    id: 'homology-group',
    name: {
      ko: '호몰로지 군',
      en: 'Homology Group',
      ja: 'ホモロジー群',
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 5,
    content: {
      ko: '공간의 n차원 구멍을 측정하는 아벨 군입니다. 경계가 없는 사이클과 경계인 사이클의 몫으로 정의됩니다.',
      en: 'Abelian groups measuring n-dimensional holes in a space. Defined as quotient of cycles without boundary by boundaries.',
      ja: '空間のn次元の穴を測るアーベル群です。境界のないサイクルと境界であるサイクルの商として定義されます。',
    },
    latex: 'H_n(X) = \\ker \\partial_n / \\text{im } \\partial_{n+1} = Z_n / B_n',
    relations: {
      prerequisites: ['chain-complex', 'group-theory'],
      nextTopics: ['cohomology', 'exact-sequence'],
      related: ['euler-characteristic', 'betti-numbers'],
      applications: ['data-analysis', 'image-processing', 'robotics'],
    },
    tags: ['topology', 'algebraic-topology', 'homology'],
  },
  {
    id: 'cohomology-group',
    name: {
      ko: '코호몰로지 군',
      en: 'Cohomology Group',
      ja: 'コホモロジー群',
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 5,
    content: {
      ko: '호몰로지의 쌍대 개념으로, 곱 구조(컵곱)를 가집니다. 미분 형식과 드람 코호몰로지와 연결됩니다.',
      en: 'Dual notion of homology with product structure (cup product). Connected to differential forms and de Rham cohomology.',
      ja: 'ホモロジーの双対概念で、積構造（カップ積）を持ちます。微分形式とドラームコホモロジーに関連します。',
    },
    latex: 'H^n(X; R) = \\text{Hom}(H_n(X), R), \\quad \\smile: H^p \\times H^q \\to H^{p+q}',
    relations: {
      prerequisites: ['homology-group', 'dual-space'],
      nextTopics: ['cup-product', 'de-rham-cohomology'],
      related: ['poincare-duality', 'characteristic-classes'],
      applications: ['algebraic-geometry', 'physics'],
    },
    tags: ['topology', 'algebraic-topology', 'cohomology'],
  },
  {
    id: 'homotopy-groups',
    name: {
      ko: '호모토피 군',
      en: 'Homotopy Groups',
      ja: 'ホモトピー群',
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 5,
    content: {
      ko: 'n차원 구의 공간으로의 사상을 호모토피 동치류로 분류한 군입니다. n≥2일 때 아벨 군이 됩니다.',
      en: 'Groups classifying maps from n-spheres to spaces up to homotopy. Abelian for n≥2.',
      ja: 'n次元球面から空間への写像をホモトピー同値類で分類した群です。n≥2でアーベル群になります。',
    },
    latex: '\\pi_n(X, x_0) = [(S^n, s_0), (X, x_0)], \\quad \\pi_n(S^n) \\cong \\mathbb{Z}',
    relations: {
      prerequisites: ['fundamental-group', 'spheres'],
      nextTopics: ['fibration', 'exact-homotopy-sequence'],
      related: ['whitehead-theorem', 'hurewicz-theorem'],
      applications: ['obstruction-theory', 'stable-homotopy'],
    },
    tags: ['topology', 'algebraic-topology', 'homotopy'],
  },
  {
    id: 'covering-space',
    name: {
      ko: '피복 공간',
      en: 'Covering Space',
      ja: '被覆空間',
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 4,
    content: {
      ko: '각 점의 균등 피복 근방이 존재하는 연속 전사입니다. 기본군의 부분군과 일대일 대응합니다.',
      en: 'A continuous surjection with evenly covered neighborhoods at each point. In bijection with subgroups of the fundamental group.',
      ja: '各点の均等被覆近傍が存在する連続全射です。基本群の部分群と一対一対応します。',
    },
    latex:
      'p: \\tilde{X} \\to X, \\quad p^{-1}(U) = \\bigsqcup_\\alpha V_\\alpha, \\quad p|_{V_\\alpha}: V_\\alpha \\xrightarrow{\\sim} U',
    relations: {
      prerequisites: ['fundamental-group', 'continuous-function'],
      nextTopics: ['deck-transformations', 'universal-cover'],
      related: ['lifting-property', 'galois-correspondence'],
      applications: ['riemann-surfaces', 'knot-theory'],
    },
    tags: ['topology', 'algebraic-topology', 'covering'],
  },
  {
    id: 'exact-sequence',
    name: {
      ko: '완전 열',
      en: 'Exact Sequence',
      ja: '完全列',
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 4,
    content: {
      ko: '각 사상의 상이 다음 사상의 핵과 같은 군 준동형의 열입니다. 짧은 완전열과 긴 완전열이 중요합니다.',
      en: 'A sequence of group homomorphisms where image equals kernel at each step. Short and long exact sequences are important.',
      ja: '各写像の像が次の写像の核と等しい群準同型の列です。短い完全列と長い完全列が重要です。',
    },
    latex: '0 \\to A \\xrightarrow{f} B \\xrightarrow{g} C \\to 0, \\quad \\text{im } f = \\ker g',
    relations: {
      prerequisites: ['group-homomorphism', 'kernel-image'],
      nextTopics: ['snake-lemma', 'long-exact-sequence'],
      related: ['split-exact', 'five-lemma'],
      applications: ['homological-algebra', 'k-theory'],
    },
    tags: ['algebra', 'algebraic-topology', 'exact'],
  },
  {
    id: 'cw-complex',
    name: {
      ko: 'CW 복합체',
      en: 'CW Complex',
      ja: 'CW複体',
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 4,
    content: {
      ko: '셀을 차원별로 부착하여 만든 위상 공간입니다. 대수적 위상수학에서 공간을 다루는 표준적 방법입니다.',
      en: 'A topological space built by attaching cells dimension by dimension. Standard approach for handling spaces in algebraic topology.',
      ja: 'セルを次元ごとに貼り付けて作る位相空間です。代数的位相数学で空間を扱う標準的方法です。',
    },
    latex:
      'X = X^0 \\subset X^1 \\subset X^2 \\subset \\cdots, \\quad X^n = X^{n-1} \\cup_\\phi e^n',
    relations: {
      prerequisites: ['topology', 'cell'],
      nextTopics: ['cellular-homology', 'whitehead-theorem'],
      related: ['simplicial-complex', 'attaching-map'],
      applications: ['homotopy-theory', 'classification'],
    },
    tags: ['topology', 'algebraic-topology', 'cell-complex'],
  },
  {
    id: 'euler-characteristic',
    name: {
      ko: '오일러 지표',
      en: 'Euler Characteristic',
      ja: 'オイラー標数',
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 3,
    content: {
      ko: '공간의 위상적 불변량으로, 베티 수의 교대합입니다. 다면체에서는 V-E+F로 계산됩니다.',
      en: 'A topological invariant of spaces, alternating sum of Betti numbers. For polyhedra, computed as V-E+F.',
      ja: '空間の位相不変量で、ベッチ数の交代和です。多面体ではV-E+Fで計算されます。',
    },
    latex:
      '\\chi(X) = \\sum_{n=0}^{\\infty} (-1)^n b_n = \\sum_{n=0}^{\\infty} (-1)^n \\dim H_n(X)',
    relations: {
      prerequisites: ['homology-group', 'betti-numbers'],
      nextTopics: ['gauss-bonnet', 'lefschetz-fixed-point'],
      related: ['genus', 'polyhedra'],
      applications: ['surface-classification', 'graph-theory'],
    },
    tags: ['topology', 'invariant', 'euler'],
  },
];
