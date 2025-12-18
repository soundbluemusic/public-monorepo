import { MathConcept } from '../types';

export const functionalAnalysisConcepts: MathConcept[] = [
  {
    id: 'banach-space',
    name: {
      ko: '바나흐 공간',
      en: 'Banach Space',
      ja: 'バナッハ空間'
    },
    field: 'functional-analysis',
    subfield: 'spaces',
    difficulty: 4,
    content: {
      ko: {
        definition: '완비 노름공간. 모든 코시 수열이 수렴하는 노름 벡터공간',
        formulas: ['||x|| ≥ 0, ||x|| = 0 ⟺ x = 0', '||αx|| = |α| ||x||', '||x + y|| ≤ ||x|| + ||y||', '완비성: 코시 수열 수렴'],
        examples: ['ℝⁿ, Cⁿ (유한차원)', 'Lᵖ(Ω), C([a,b])', 'ℓᵖ (수열 공간)'],
        applications: ['미분방정식', '양자역학', '최적화']
      },
      en: {
        definition: 'Complete normed space. Normed vector space where every Cauchy sequence converges',
        formulas: ['||x|| ≥ 0, ||x|| = 0 ⟺ x = 0', '||αx|| = |α| ||x||', '||x + y|| ≤ ||x|| + ||y||', 'Completeness: Cauchy sequences converge'],
        examples: ['ℝⁿ, Cⁿ (finite dim)', 'Lᵖ(Ω), C([a,b])', 'ℓᵖ (sequence spaces)'],
        applications: ['Differential equations', 'Quantum mechanics', 'Optimization']
      },
      ja: {
        definition: '完備ノルム空間。すべてのコーシー列が収束するノルムベクトル空間',
        formulas: ['||x|| ≥ 0, ||x|| = 0 ⟺ x = 0', '||αx|| = |α| ||x||', '||x + y|| ≤ ||x|| + ||y||', '完備性: コーシー列が収束'],
        examples: ['ℝⁿ, Cⁿ (有限次元)', 'Lᵖ(Ω), C([a,b])', 'ℓᵖ (数列空間)'],
        applications: ['微分方程式', '量子力学', '最適化']
      }
    },
    latex: '\\|x + y\\| \\leq \\|x\\| + \\|y\\|',
    relations: {
      prerequisites: ['normed-space', 'cauchy-sequence'],
      nextTopics: ['hilbert-space', 'bounded-operators'],
      related: ['metric-space'],
      applications: ['pde', 'optimization']
    },
    tags: ['바나흐', 'Banach', '완비', 'normed']
  },
  {
    id: 'hilbert-space',
    name: {
      ko: '힐베르트 공간',
      en: 'Hilbert Space',
      ja: 'ヒルベルト空間'
    },
    field: 'functional-analysis',
    subfield: 'spaces',
    difficulty: 4,
    content: {
      ko: {
        definition: '내적이 정의된 완비 공간. 유한차원 유클리드 공간의 무한차원 일반화',
        formulas: ['⟨x, y⟩ = ⟨y, x⟩̄ (켤레 대칭)', '⟨x, x⟩ ≥ 0', '||x|| = √⟨x, x⟩', '정규직교기저: ⟨eᵢ, eⱼ⟩ = δᵢⱼ'],
        examples: ['L²(ℝ)', 'ℓ²', '양자 상태 공간'],
        applications: ['양자역학', '푸리에 해석', '신호처리']
      },
      en: {
        definition: 'Complete space with inner product. Infinite-dimensional generalization of Euclidean space',
        formulas: ['⟨x, y⟩ = ⟨y, x⟩̄ (conjugate symmetry)', '⟨x, x⟩ ≥ 0', '||x|| = √⟨x, x⟩', 'Orthonormal basis: ⟨eᵢ, eⱼ⟩ = δᵢⱼ'],
        examples: ['L²(ℝ)', 'ℓ²', 'Quantum state space'],
        applications: ['Quantum mechanics', 'Fourier analysis', 'Signal processing']
      },
      ja: {
        definition: '内積が定義された完備空間。有限次元ユークリッド空間の無限次元一般化',
        formulas: ['⟨x, y⟩ = ⟨y, x⟩̄ (共役対称)', '⟨x, x⟩ ≥ 0', '||x|| = √⟨x, x⟩', '正規直交基底: ⟨eᵢ, eⱼ⟩ = δᵢⱼ'],
        examples: ['L²(ℝ)', 'ℓ²', '量子状態空間'],
        applications: ['量子力学', 'フーリエ解析', '信号処理']
      }
    },
    latex: '\\|x\\| = \\sqrt{\\langle x, x \\rangle}',
    relations: {
      prerequisites: ['inner-product', 'banach-space'],
      nextTopics: ['spectral-theorem', 'self-adjoint'],
      related: ['euclidean-space'],
      applications: ['quantum-mechanics', 'signal-processing']
    },
    tags: ['힐베르트', 'Hilbert', '내적', 'inner-product']
  },
  {
    id: 'bounded-linear-operator',
    name: {
      ko: '유계 선형 작용소',
      en: 'Bounded Linear Operator',
      ja: '有界線形作用素'
    },
    field: 'functional-analysis',
    subfield: 'operators',
    difficulty: 4,
    content: {
      ko: {
        definition: '노름이 유한인 선형 작용소. B(X,Y)는 X에서 Y로의 유계 작용소들의 바나흐 공간',
        formulas: ['||T|| = sup{||Tx|| : ||x|| ≤ 1}', '||Tx|| ≤ ||T|| ||x||', '유계 ⟺ 연속'],
        examples: ['적분 작용소', '미분 작용소 (비유계)', '행렬 (유한차원)'],
        applications: ['미분방정식', '양자역학', '근사이론']
      },
      en: {
        definition: 'Linear operator with finite norm. B(X,Y) is Banach space of bounded operators from X to Y',
        formulas: ['||T|| = sup{||Tx|| : ||x|| ≤ 1}', '||Tx|| ≤ ||T|| ||x||', 'Bounded ⟺ Continuous'],
        examples: ['Integral operator', 'Differentiation (unbounded)', 'Matrix (finite dim)'],
        applications: ['Differential equations', 'Quantum mechanics', 'Approximation theory']
      },
      ja: {
        definition: 'ノルムが有限の線形作用素。B(X,Y)はXからYへの有界作用素のバナッハ空間',
        formulas: ['||T|| = sup{||Tx|| : ||x|| ≤ 1}', '||Tx|| ≤ ||T|| ||x||', '有界 ⟺ 連続'],
        examples: ['積分作用素', '微分作用素（非有界）', '行列（有限次元）'],
        applications: ['微分方程式', '量子力学', '近似理論']
      }
    },
    latex: '\\|T\\| = \\sup\\{\\|Tx\\| : \\|x\\| \\leq 1\\}',
    relations: {
      prerequisites: ['linear-map', 'banach-space'],
      nextTopics: ['spectral-theory', 'compact-operator'],
      related: ['matrix'],
      applications: ['operator-theory']
    },
    tags: ['작용소', 'operator', '유계', 'bounded']
  },
  {
    id: 'spectral-theorem',
    name: {
      ko: '스펙트럼 정리',
      en: 'Spectral Theorem',
      ja: 'スペクトル定理'
    },
    field: 'functional-analysis',
    subfield: 'spectral-theory',
    difficulty: 5,
    content: {
      ko: {
        definition: '자기수반(에르미트) 작용소는 고유값과 고유벡터로 대각화 가능',
        formulas: ['T = ∫λ dE_λ (스펙트럼 분해)', '유한차원: T = Σλᵢ Pᵢ', 'σ(T) ⊂ ℝ (자기수반)'],
        examples: ['대칭 행렬', '양자 관측 가능량', '슈튀름-리우빌 문제'],
        applications: ['양자역학', '미분방정식', '진동 해석']
      },
      en: {
        definition: 'Self-adjoint (Hermitian) operators can be diagonalized via eigenvalues and eigenvectors',
        formulas: ['T = ∫λ dE_λ (spectral decomposition)', 'Finite dim: T = Σλᵢ Pᵢ', 'σ(T) ⊂ ℝ (self-adjoint)'],
        examples: ['Symmetric matrices', 'Quantum observables', 'Sturm-Liouville problems'],
        applications: ['Quantum mechanics', 'Differential equations', 'Vibration analysis']
      },
      ja: {
        definition: '自己共役（エルミート）作用素は固有値と固有ベクトルで対角化可能',
        formulas: ['T = ∫λ dE_λ (スペクトル分解)', '有限次元: T = Σλᵢ Pᵢ', 'σ(T) ⊂ ℝ (自己共役)'],
        examples: ['対称行列', '量子オブザーバブル', 'シュトゥルム・リウビル問題'],
        applications: ['量子力学', '微分方程式', '振動解析']
      }
    },
    latex: 'T = \\int \\lambda \\, dE_\\lambda',
    relations: {
      prerequisites: ['hilbert-space', 'eigenvalues'],
      nextTopics: ['functional-calculus'],
      related: ['eigenvalue-decomposition'],
      applications: ['quantum-mechanics', 'pde']
    },
    tags: ['스펙트럼', 'spectral', '자기수반', 'self-adjoint']
  },
  {
    id: 'hahn-banach-theorem',
    name: {
      ko: '한-바나흐 정리',
      en: 'Hahn-Banach Theorem',
      ja: 'ハーン・バナッハの定理'
    },
    field: 'functional-analysis',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition: '부분공간에서 정의된 유계 선형 범함수를 전체 공간으로 노름 보존 확장',
        formulas: ['f: M → ℝ 유계 선형 ⟹ ∃F: X → ℝ 확장', '||F|| = ||f||', '분리 버전: 볼록집합 분리'],
        examples: ['이중공간 구성', '점 평가 확장'],
        applications: ['최적화', '경제학', '이론 해석']
      },
      en: {
        definition: 'Bounded linear functional on subspace can be extended to whole space preserving norm',
        formulas: ['f: M → ℝ bounded linear ⟹ ∃F: X → ℝ extension', '||F|| = ||f||', 'Separation version: separating convex sets'],
        examples: ['Dual space construction', 'Point evaluation extension'],
        applications: ['Optimization', 'Economics', 'Theoretical analysis']
      },
      ja: {
        definition: '部分空間上の有界線形汎関数をノルム保存で全空間に拡張可能',
        formulas: ['f: M → ℝ 有界線形 ⟹ ∃F: X → ℝ 拡張', '||F|| = ||f||', '分離版: 凸集合の分離'],
        examples: ['双対空間の構成', '点評価の拡張'],
        applications: ['最適化', '経済学', '理論解析']
      }
    },
    latex: '\\|F\\| = \\|f\\|',
    relations: {
      prerequisites: ['banach-space', 'zorns-lemma'],
      nextTopics: ['dual-space', 'reflexive-space'],
      related: ['separation-theorem'],
      applications: ['optimization', 'duality']
    },
    tags: ['한바나흐', 'Hahn-Banach', '확장', 'extension']
  },
  {
    id: 'open-mapping-theorem',
    name: {
      ko: '열린 사상 정리',
      en: 'Open Mapping Theorem',
      ja: '開写像定理'
    },
    field: 'functional-analysis',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition: '바나흐 공간 사이의 전사 유계 선형 작용소는 열린 집합을 열린 집합으로 보냄',
        formulas: ['T: X → Y 전사, 유계, 선형 ⟹ T(열린집합) = 열린집합', '역사상 정리: T 전단사 ⟹ T⁻¹ 유계'],
        examples: ['역행렬의 유계성', '미분방정식 해의 존재성'],
        applications: ['작용소 이론', '미분방정식']
      },
      en: {
        definition: 'Surjective bounded linear operator between Banach spaces maps open sets to open sets',
        formulas: ['T: X → Y surjective, bounded, linear ⟹ T(open) = open', 'Inverse mapping: T bijective ⟹ T⁻¹ bounded'],
        examples: ['Boundedness of inverse', 'Existence of PDE solutions'],
        applications: ['Operator theory', 'Differential equations']
      },
      ja: {
        definition: 'バナッハ空間間の全射有界線形作用素は開集合を開集合に写す',
        formulas: ['T: X → Y 全射、有界、線形 ⟹ T(開集合) = 開集合', '逆写像定理: T 全単射 ⟹ T⁻¹ 有界'],
        examples: ['逆行列の有界性', '微分方程式解の存在性'],
        applications: ['作用素論', '微分方程式']
      }
    },
    latex: 'T(\\text{open}) = \\text{open}',
    relations: {
      prerequisites: ['banach-space', 'bounded-linear-operator'],
      nextTopics: ['closed-graph-theorem'],
      related: ['inverse-function-theorem'],
      applications: ['operator-theory']
    },
    tags: ['열린사상', 'open-mapping', '바나흐', 'surjective']
  },
  {
    id: 'compact-operator',
    name: {
      ko: '컴팩트 작용소',
      en: 'Compact Operator',
      ja: 'コンパクト作用素'
    },
    field: 'functional-analysis',
    subfield: 'operators',
    difficulty: 5,
    content: {
      ko: {
        definition: '유계 집합을 상대적으로 컴팩트한 집합으로 보내는 작용소',
        formulas: ['T: X → Y, T(단위구)가 상대적 컴팩트', '유한계수 작용소의 노름 극한', 'σ(T) \\ {0}는 고립된 고유값'],
        examples: ['적분 작용소 (연속 핵)', '볼테라 작용소', '유한계수 작용소'],
        applications: ['적분방정식', '프레드홀름 이론', '스펙트럼 이론']
      },
      en: {
        definition: 'Operator mapping bounded sets to relatively compact sets',
        formulas: ['T: X → Y, T(unit ball) relatively compact', 'Norm limit of finite-rank operators', 'σ(T) \\ {0} isolated eigenvalues'],
        examples: ['Integral operator (continuous kernel)', 'Volterra operator', 'Finite-rank operators'],
        applications: ['Integral equations', 'Fredholm theory', 'Spectral theory']
      },
      ja: {
        definition: '有界集合を相対コンパクト集合に写す作用素',
        formulas: ['T: X → Y, T(単位球)が相対コンパクト', '有限階作用素のノルム極限', 'σ(T) \\ {0}は孤立固有値'],
        examples: ['積分作用素（連続核）', 'ボルテラ作用素', '有限階作用素'],
        applications: ['積分方程式', 'フレドホルム理論', 'スペクトル理論']
      }
    },
    latex: 'T(B_X) \\text{ relatively compact}',
    relations: {
      prerequisites: ['bounded-linear-operator', 'compactness'],
      nextTopics: ['fredholm-theory', 'spectral-theorem'],
      related: ['finite-rank'],
      applications: ['integral-equations']
    },
    tags: ['컴팩트', 'compact', '작용소', 'operator']
  },
  {
    id: 'weak-convergence',
    name: {
      ko: '약수렴',
      en: 'Weak Convergence',
      ja: '弱収束'
    },
    field: 'functional-analysis',
    subfield: 'convergence',
    difficulty: 4,
    content: {
      ko: {
        definition: '모든 연속 선형 범함수에 대해 수렴하는 수열. 노름 수렴보다 약함',
        formulas: ['xₙ ⇀ x ⟺ ∀f ∈ X*, f(xₙ) → f(x)', '약*수렴: fₙ ⇀* f ⟺ ∀x, fₙ(x) → f(x)', '노름 수렴 ⟹ 약수렴'],
        examples: ['L²에서의 약수렴', '힐베르트 공간의 직교수열'],
        applications: ['변분법', '편미분방정식', '최적화']
      },
      en: {
        definition: 'Convergence with respect to all continuous linear functionals. Weaker than norm convergence',
        formulas: ['xₙ ⇀ x ⟺ ∀f ∈ X*, f(xₙ) → f(x)', 'Weak*: fₙ ⇀* f ⟺ ∀x, fₙ(x) → f(x)', 'Norm convergence ⟹ Weak convergence'],
        examples: ['Weak convergence in L²', 'Orthogonal sequences in Hilbert space'],
        applications: ['Calculus of variations', 'PDEs', 'Optimization']
      },
      ja: {
        definition: 'すべての連続線形汎関数に関して収束する列。ノルム収束より弱い',
        formulas: ['xₙ ⇀ x ⟺ ∀f ∈ X*, f(xₙ) → f(x)', '弱*収束: fₙ ⇀* f ⟺ ∀x, fₙ(x) → f(x)', 'ノルム収束 ⟹ 弱収束'],
        examples: ['L²での弱収束', 'ヒルベルト空間の直交列'],
        applications: ['変分法', '偏微分方程式', '最適化']
      }
    },
    latex: 'x_n \\rightharpoonup x \\Leftrightarrow \\forall f \\in X^*, \\; f(x_n) \\to f(x)',
    relations: {
      prerequisites: ['dual-space', 'banach-space'],
      nextTopics: ['weak-compactness'],
      related: ['norm-convergence'],
      applications: ['pde', 'variational-methods']
    },
    tags: ['약수렴', 'weak', 'convergence', 'dual']
  }
];
