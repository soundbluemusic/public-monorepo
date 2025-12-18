import { MathConcept } from '../types';

export const representationTheoryConcepts: MathConcept[] = [
  {
    id: 'group-representation',
    name: {
      ko: '군의 표현',
      en: 'Group Representation',
      ja: '群の表現'
    },
    field: 'representation-theory',
    subfield: 'foundations',
    difficulty: 4,
    content: {
      ko: {
        definition: '군을 벡터공간의 가역 선형변환들의 군으로 실현하는 준동형',
        formulas: ['ρ: G → GL(V)', 'ρ(gh) = ρ(g)ρ(h)', '차원 = dim V'],
        examples: ['순환군의 표현', '대칭군 Sₙ의 표현', '자명한 표현'],
        applications: ['양자역학', '화학', '물리학']
      },
      en: {
        definition: 'Homomorphism realizing group as group of invertible linear transformations on vector space',
        formulas: ['ρ: G → GL(V)', 'ρ(gh) = ρ(g)ρ(h)', 'Degree = dim V'],
        examples: ['Cyclic group representations', 'Symmetric group Sₙ', 'Trivial representation'],
        applications: ['Quantum mechanics', 'Chemistry', 'Physics']
      },
      ja: {
        definition: '群をベクトル空間の可逆線形変換の群として実現する準同型',
        formulas: ['ρ: G → GL(V)', 'ρ(gh) = ρ(g)ρ(h)', '次元 = dim V'],
        examples: ['巡回群の表現', '対称群 Sₙ の表現', '自明な表現'],
        applications: ['量子力学', '化学', '物理学']
      }
    },
    latex: '\\rho: G \\to GL(V)',
    relations: {
      prerequisites: ['group-theory', 'linear-algebra'],
      nextTopics: ['irreducible-representation', 'character-theory'],
      related: ['module-theory'],
      applications: ['physics', 'chemistry']
    },
    tags: ['표현', 'representation', '군', 'group']
  },
  {
    id: 'irreducible-representation',
    name: {
      ko: '기약 표현',
      en: 'Irreducible Representation',
      ja: '既約表現'
    },
    field: 'representation-theory',
    subfield: 'foundations',
    difficulty: 4,
    content: {
      ko: {
        definition: '비자명한 진부분 표현을 갖지 않는 표현. 표현론의 기본 구성 요소',
        formulas: ['마슈케 정리: 유한군, char=0이면 완전 가약', '슈어 보조정리: Hom(V,W) = 0 또는 동형'],
        examples: ['1차원 표현', 'S₃의 2차원 기약 표현'],
        applications: ['분류 문제', '양자역학', '입자물리']
      },
      en: {
        definition: 'Representation with no nontrivial proper subrepresentations. Building blocks of representation theory',
        formulas: ['Maschke: finite group, char=0 ⟹ completely reducible', 'Schur lemma: Hom(V,W) = 0 or isomorphism'],
        examples: ['1-dimensional representations', 'S₃ 2-dim irreducible'],
        applications: ['Classification', 'Quantum mechanics', 'Particle physics']
      },
      ja: {
        definition: '非自明な真部分表現を持たない表現。表現論の基本構成要素',
        formulas: ['マシュケの定理: 有限群、char=0なら完全可約', 'シューアの補題: Hom(V,W) = 0 または同型'],
        examples: ['1次元表現', 'S₃の2次元既約表現'],
        applications: ['分類問題', '量子力学', '素粒子物理']
      }
    },
    latex: 'V = V_1 \\oplus V_2 \\oplus \\cdots \\oplus V_k',
    relations: {
      prerequisites: ['group-representation'],
      nextTopics: ['character-theory'],
      related: ['simple-module'],
      applications: ['quantum-mechanics', 'particle-physics']
    },
    tags: ['기약', 'irreducible', '단순', 'simple']
  },
  {
    id: 'character-theory',
    name: {
      ko: '지표 이론',
      en: 'Character Theory',
      ja: '指標論'
    },
    field: 'representation-theory',
    subfield: 'characters',
    difficulty: 4,
    content: {
      ko: {
        definition: '표현의 대각합(트레이스)을 통해 표현을 연구하는 방법',
        formulas: ['χ_V(g) = tr(ρ(g))', '직교성: ⟨χ_V, χ_W⟩ = δ_{V,W}', '지표표', '정규 표현 분해'],
        examples: ['S₃의 지표표', '순환군의 지표'],
        applications: ['표현 분류', '분자 대칭', '번사이드 정리']
      },
      en: {
        definition: 'Study of representations through trace (diagonal sum) of matrices',
        formulas: ['χ_V(g) = tr(ρ(g))', 'Orthogonality: ⟨χ_V, χ_W⟩ = δ_{V,W}', 'Character table', 'Regular rep decomposition'],
        examples: ['Character table of S₃', 'Characters of cyclic groups'],
        applications: ['Representation classification', 'Molecular symmetry', 'Burnside theorem']
      },
      ja: {
        definition: '表現を行列のトレース（対角和）を通して研究する方法',
        formulas: ['χ_V(g) = tr(ρ(g))', '直交性: ⟨χ_V, χ_W⟩ = δ_{V,W}', '指標表', '正則表現の分解'],
        examples: ['S₃の指標表', '巡回群の指標'],
        applications: ['表現の分類', '分子対称性', 'バーンサイドの定理']
      }
    },
    latex: '\\chi_V(g) = \\text{tr}(\\rho(g))',
    relations: {
      prerequisites: ['group-representation', 'trace'],
      nextTopics: ['induced-representation'],
      related: ['harmonic-analysis'],
      applications: ['chemistry', 'physics']
    },
    tags: ['지표', 'character', 'trace', '대각합']
  },
  {
    id: 'young-tableaux',
    name: {
      ko: '영 타블로',
      en: 'Young Tableaux',
      ja: 'ヤング盤'
    },
    field: 'representation-theory',
    subfield: 'symmetric-group',
    difficulty: 5,
    content: {
      ko: {
        definition: '대칭군의 기약 표현을 기술하고 조합론적으로 계산하는 도구',
        formulas: ['영 다이어그램: λ = (λ₁ ≥ λ₂ ≥ ...)', '표준 타블로: 행/열 증가', '훅 길이 공식: dim = n!/∏hook'],
        examples: ['(3,2)에 대한 S₅ 표현', '로빈슨-셴스테드 대응'],
        applications: ['대칭군 표현', '슈어 함수', '양자군']
      },
      en: {
        definition: 'Tool for describing and computing irreducible representations of symmetric group',
        formulas: ['Young diagram: λ = (λ₁ ≥ λ₂ ≥ ...)', 'Standard tableau: rows/cols increasing', 'Hook length: dim = n!/∏hook'],
        examples: ['S₅ rep for (3,2)', 'Robinson-Schensted correspondence'],
        applications: ['Symmetric group reps', 'Schur functions', 'Quantum groups']
      },
      ja: {
        definition: '対称群の既約表現を記述し組合せ的に計算するツール',
        formulas: ['ヤング図形: λ = (λ₁ ≥ λ₂ ≥ ...)', '標準盤: 行/列増加', 'フック長公式: dim = n!/∏hook'],
        examples: ['(3,2)に対するS₅表現', 'ロビンソン・シェンステッド対応'],
        applications: ['対称群の表現', 'シューア関数', '量子群']
      }
    },
    latex: '\\dim V_\\lambda = \\frac{n!}{\\prod_{\\text{boxes}} \\text{hook length}}',
    relations: {
      prerequisites: ['symmetric-group', 'partition-theory'],
      nextTopics: ['schur-functions'],
      related: ['combinatorics'],
      applications: ['algebraic-combinatorics']
    },
    tags: ['영타블로', 'Young', 'tableau', 'symmetric']
  },
  {
    id: 'lie-algebra-representation',
    name: {
      ko: '리 대수의 표현',
      en: 'Lie Algebra Representation',
      ja: 'リー代数の表現'
    },
    field: 'representation-theory',
    subfield: 'lie-theory',
    difficulty: 5,
    content: {
      ko: {
        definition: '리 대수를 벡터공간의 자기준동형으로 실현하는 준동형',
        formulas: ['ρ: 𝔤 → gl(V)', 'ρ([X,Y]) = [ρ(X), ρ(Y)]', '최고 무게 표현'],
        examples: ['sl(2,ℂ)의 유한차원 표현', '수반 표현'],
        applications: ['양자역학', '입자물리학', '미분기하학']
      },
      en: {
        definition: 'Homomorphism realizing Lie algebra as endomorphisms of vector space',
        formulas: ['ρ: 𝔤 → gl(V)', 'ρ([X,Y]) = [ρ(X), ρ(Y)]', 'Highest weight representations'],
        examples: ['Finite-dim reps of sl(2,ℂ)', 'Adjoint representation'],
        applications: ['Quantum mechanics', 'Particle physics', 'Differential geometry']
      },
      ja: {
        definition: 'リー代数をベクトル空間の自己準同型として実現する準同型',
        formulas: ['ρ: 𝔤 → gl(V)', 'ρ([X,Y]) = [ρ(X), ρ(Y)]', '最高ウェイト表現'],
        examples: ['sl(2,ℂ)の有限次元表現', '随伴表現'],
        applications: ['量子力学', '素粒子物理学', '微分幾何学']
      }
    },
    latex: '\\rho([X,Y]) = [\\rho(X), \\rho(Y)]',
    relations: {
      prerequisites: ['lie-groups', 'linear-algebra'],
      nextTopics: ['root-systems', 'weyl-group'],
      related: ['group-representation'],
      applications: ['physics', 'geometry']
    },
    tags: ['리대수', 'Lie', '표현', 'representation']
  },
  {
    id: 'root-systems',
    name: {
      ko: '근계',
      en: 'Root Systems',
      ja: '根系'
    },
    field: 'representation-theory',
    subfield: 'lie-theory',
    difficulty: 5,
    content: {
      ko: {
        definition: '반단순 리 대수의 구조를 기술하는 유한 벡터 집합',
        formulas: ['반사: sα(β) = β - 2⟨α,β⟩/⟨α,α⟩ α', '카르탄 행렬: Aᵢⱼ = 2⟨αᵢ,αⱼ⟩/⟨αᵢ,αᵢ⟩', '딘킨 도표'],
        examples: ['Aₙ (sl(n+1))', 'Bₙ, Cₙ, Dₙ', '예외형: G₂, F₄, E₆, E₇, E₈'],
        applications: ['리 대수 분류', '양자군', '물리학']
      },
      en: {
        definition: 'Finite set of vectors describing structure of semisimple Lie algebras',
        formulas: ['Reflection: sα(β) = β - 2⟨α,β⟩/⟨α,α⟩ α', 'Cartan matrix: Aᵢⱼ = 2⟨αᵢ,αⱼ⟩/⟨αᵢ,αᵢ⟩', 'Dynkin diagrams'],
        examples: ['Aₙ (sl(n+1))', 'Bₙ, Cₙ, Dₙ', 'Exceptional: G₂, F₄, E₆, E₇, E₈'],
        applications: ['Lie algebra classification', 'Quantum groups', 'Physics']
      },
      ja: {
        definition: '半単純リー代数の構造を記述する有限ベクトル集合',
        formulas: ['反射: sα(β) = β - 2⟨α,β⟩/⟨α,α⟩ α', 'カルタン行列: Aᵢⱼ = 2⟨αᵢ,αⱼ⟩/⟨αᵢ,αᵢ⟩', 'ディンキン図形'],
        examples: ['Aₙ (sl(n+1))', 'Bₙ, Cₙ, Dₙ', '例外型: G₂, F₄, E₆, E₇, E₈'],
        applications: ['リー代数の分類', '量子群', '物理学']
      }
    },
    latex: 's_\\alpha(\\beta) = \\beta - \\frac{2\\langle\\alpha,\\beta\\rangle}{\\langle\\alpha,\\alpha\\rangle}\\alpha',
    relations: {
      prerequisites: ['lie-algebra-representation', 'linear-algebra'],
      nextTopics: ['weyl-group', 'highest-weight'],
      related: ['cartan-subalgebra'],
      applications: ['classification', 'physics']
    },
    tags: ['근계', 'root', 'Dynkin', 'Cartan']
  },
  {
    id: 'tensor-product-rep',
    name: {
      ko: '텐서곱 표현',
      en: 'Tensor Product Representation',
      ja: 'テンソル積表現'
    },
    field: 'representation-theory',
    subfield: 'constructions',
    difficulty: 4,
    content: {
      ko: {
        definition: '두 표현의 텐서곱으로 새로운 표현을 구성하는 방법',
        formulas: ['V ⊗ W', 'g(v ⊗ w) = gv ⊗ gw', 'χ_{V⊗W}(g) = χ_V(g)χ_W(g)', '클렙쉬-고르단 분해'],
        examples: ['SU(2)의 스핀 결합', '양자 얽힘 상태'],
        applications: ['양자역학', '입자물리', '양자정보']
      },
      en: {
        definition: 'Constructing new representations from tensor product of two representations',
        formulas: ['V ⊗ W', 'g(v ⊗ w) = gv ⊗ gw', 'χ_{V⊗W}(g) = χ_V(g)χ_W(g)', 'Clebsch-Gordan decomposition'],
        examples: ['SU(2) spin coupling', 'Quantum entangled states'],
        applications: ['Quantum mechanics', 'Particle physics', 'Quantum information']
      },
      ja: {
        definition: '二つの表現のテンソル積から新しい表現を構成する方法',
        formulas: ['V ⊗ W', 'g(v ⊗ w) = gv ⊗ gw', 'χ_{V⊗W}(g) = χ_V(g)χ_W(g)', 'クレブシュ・ゴルダン分解'],
        examples: ['SU(2)のスピン結合', '量子もつれ状態'],
        applications: ['量子力学', '素粒子物理', '量子情報']
      }
    },
    latex: '\\chi_{V \\otimes W}(g) = \\chi_V(g) \\chi_W(g)',
    relations: {
      prerequisites: ['group-representation', 'tensor-product'],
      nextTopics: ['clebsch-gordan'],
      related: ['character-theory'],
      applications: ['quantum-physics']
    },
    tags: ['텐서곱', 'tensor', '표현', 'product']
  },
  {
    id: 'induced-representation',
    name: {
      ko: '유도 표현',
      en: 'Induced Representation',
      ja: '誘導表現'
    },
    field: 'representation-theory',
    subfield: 'constructions',
    difficulty: 5,
    content: {
      ko: {
        definition: '부분군의 표현에서 전체 군의 표현을 구성하는 방법',
        formulas: ['Ind_H^G V = ℂ[G] ⊗_{ℂ[H]} V', '프로베니우스 상호성: ⟨Ind V, W⟩_G = ⟨V, Res W⟩_H', 'dim Ind V = [G:H] dim V'],
        examples: ['순환군에서 대칭군으로 유도', '정규 표현 = Ind_1^G 1'],
        applications: ['표현 구성', '맥키 정리', '해석적 정수론']
      },
      en: {
        definition: 'Constructing representation of group from representation of subgroup',
        formulas: ['Ind_H^G V = ℂ[G] ⊗_{ℂ[H]} V', 'Frobenius reciprocity: ⟨Ind V, W⟩_G = ⟨V, Res W⟩_H', 'dim Ind V = [G:H] dim V'],
        examples: ['Inducing from cyclic to symmetric', 'Regular rep = Ind_1^G 1'],
        applications: ['Representation construction', 'Mackey theory', 'Analytic number theory']
      },
      ja: {
        definition: '部分群の表現から全体の群の表現を構成する方法',
        formulas: ['Ind_H^G V = ℂ[G] ⊗_{ℂ[H]} V', 'フロベニウス相互律: ⟨Ind V, W⟩_G = ⟨V, Res W⟩_H', 'dim Ind V = [G:H] dim V'],
        examples: ['巡回群から対称群への誘導', '正則表現 = Ind_1^G 1'],
        applications: ['表現構成', 'マッキー理論', '解析的整数論']
      }
    },
    latex: '\\text{Ind}_H^G V = \\mathbb{C}[G] \\otimes_{\\mathbb{C}[H]} V',
    relations: {
      prerequisites: ['group-representation', 'tensor-product'],
      nextTopics: ['mackey-theory'],
      related: ['restriction'],
      applications: ['number-theory', 'physics']
    },
    tags: ['유도', 'induced', 'Frobenius', 'induction']
  }
];
