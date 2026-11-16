import type { MathConcept } from '../types';

export const algebraicTopologyConcepts: MathConcept[] = [
  {
    id: 'fundamental-group',
    name: {
      ko: '기본군',
      en: 'Fundamental Group',
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 4,
    content: {
      ko: '공간의 루프들을 호모토피 동치류로 분류한 군입니다. 공간의 1차원적 구멍 구조를 인코딩합니다.',
      en: 'A group classifying loops in a space up to homotopy equivalence. Encodes 1-dimensional hole structure of spaces.',
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
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 5,
    content: {
      ko: '공간의 n차원 구멍을 측정하는 아벨 군입니다. 경계가 없는 사이클과 경계인 사이클의 몫으로 정의됩니다.',
      en: 'Abelian groups measuring n-dimensional holes in a space. Defined as quotient of cycles without boundary by boundaries.',
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
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 5,
    content: {
      ko: '호몰로지와 관련된 쌍대 개념이며 계수환에 따라 컵곱을 정의할 수 있습니다. 체 K를 계수로 쓰면 코호몰로지는 같은 체 계수 호몰로지의 쌍대입니다.',
      en: 'Cohomology is related to the dual of homology and has a cup product for suitable coefficient rings. Over a field K, it is dual to homology with coefficients in K.',
    },
    latex:
      'H^n(X;K)\\cong\\operatorname{Hom}_K(H_n(X;K),K),\\quad \\smile:H^p(X;K)\\times H^q(X;K)\\to H^{p+q}(X;K)\\quad(K\\text{ a field})',
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
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 5,
    content: {
      ko: 'n≥1일 때 기준점을 보존하는 n차원 구에서 공간으로의 사상을 기준점을 보존하는 호모토피로 분류한 군입니다. n≥2일 때 아벨 군이 됩니다.',
      en: 'For n≥1, groups of based maps from n-spheres to a space, up to based homotopy. They are abelian for n≥2.',
    },
    latex:
      '\\pi_n(X, x_0) = [(S^n, s_0), (X, x_0)], \\quad \\pi_n(S^n) \\cong \\mathbb{Z} \\quad (n\\geq 1)',
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
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 4,
    content: {
      ko: '각 점에 균등 피복 근방이 있는 연속 전사입니다. 경로 연결, 국소 경로 연결, 반국소 단일 연결인 공간에서는 연결된 기준점 있는 피복의 동형류가 기본군의 부분군에 대응합니다. 기준점을 무시하면 부분군의 켤레류에 대응합니다.',
      en: 'A continuous surjection with evenly covered neighborhoods. For a path-connected, locally path-connected, semilocally simply connected base, based isomorphism classes of connected coverings correspond to subgroups of its fundamental group; unbased classes correspond to conjugacy classes.',
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
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 4,
    content: {
      ko: '각 사상의 상이 다음 사상의 핵과 같은 군 준동형의 열입니다. 짧은 완전열과 긴 완전열이 중요합니다.',
      en: 'A sequence of group homomorphisms where image equals kernel at each step. Short and long exact sequences are important.',
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
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 4,
    content: {
      ko: '셀을 차원별로 부착하여 만든 위상 공간입니다. 대수적 위상수학에서 공간을 다루는 표준적 방법입니다.',
      en: 'A topological space built by attaching cells dimension by dimension. Standard approach for handling spaces in algebraic topology.',
    },
    latex:
      'X = X^0 \\subset X^1 \\subset X^2 \\subset \\cdots, \\quad X^n = X^{n-1} \\cup_\\phi \\bigsqcup_\\alpha D^n_\\alpha',
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
    },
    field: 'topology',
    subfield: 'algebraic-topology',
    difficulty: 3,
    content: {
      ko: '유한 CW 복합체 등에서 정의되는 위상적 불변량으로, 베티 수의 교대합입니다. 다면체의 표면에서는 V-E+F로 계산됩니다.',
      en: 'A topological invariant defined for spaces such as finite CW complexes, given by the alternating sum of Betti numbers. For a polyhedral surface, it is V-E+F.',
    },
    latex:
      '\\chi(X) = \\sum_{n\\geq 0} (-1)^n b_n, \\quad b_n=\\dim_{\\mathbb Q} H_n(X;\\mathbb Q) \\quad (X \\text{ finite CW})',
    relations: {
      prerequisites: ['homology-group', 'betti-numbers'],
      nextTopics: ['gauss-bonnet', 'lefschetz-fixed-point'],
      related: ['genus', 'polyhedra'],
      applications: ['surface-classification', 'graph-theory'],
    },
    tags: ['topology', 'invariant', 'euler'],
  },
];
