import { MathConcept } from '../types';

export const homologicalAlgebraConcepts: MathConcept[] = [
  {
    id: 'chain-complex',
    name: {
      ko: '사슬 복합체',
      en: 'Chain Complex',
      ja: '鎖複体'
    },
    field: 'homological-algebra',
    subfield: 'foundations',
    difficulty: 4,
    content: {
      ko: {
        definition: '경계 사상의 합성이 0인 모듈(또는 아벨군)들의 열',
        formulas: ['...→ Cₙ₊₁ →^{∂ₙ₊₁} Cₙ →^{∂ₙ} Cₙ₋₁ →...', '∂ₙ ∘ ∂ₙ₊₁ = 0', 'Hₙ(C) = ker ∂ₙ / im ∂ₙ₊₁'],
        examples: ['단체 복합체', '셀룰러 복합체', '드람 복합체'],
        applications: ['위상수학', '대수기하', '물리학']
      },
      en: {
        definition: 'Sequence of modules (or abelian groups) where composition of boundary maps is zero',
        formulas: ['...→ Cₙ₊₁ →^{∂ₙ₊₁} Cₙ →^{∂ₙ} Cₙ₋₁ →...', '∂ₙ ∘ ∂ₙ₊₁ = 0', 'Hₙ(C) = ker ∂ₙ / im ∂ₙ₊₁'],
        examples: ['Simplicial complex', 'Cellular complex', 'de Rham complex'],
        applications: ['Topology', 'Algebraic geometry', 'Physics']
      },
      ja: {
        definition: '境界写像の合成が0であるモジュール（またはアーベル群）の列',
        formulas: ['...→ Cₙ₊₁ →^{∂ₙ₊₁} Cₙ →^{∂ₙ} Cₙ₋₁ →...', '∂ₙ ∘ ∂ₙ₊₁ = 0', 'Hₙ(C) = ker ∂ₙ / im ∂ₙ₊₁'],
        examples: ['単体複体', '胞体複体', 'ド・ラーム複体'],
        applications: ['位相数学', '代数幾何', '物理学']
      }
    },
    latex: '\\partial_n \\circ \\partial_{n+1} = 0',
    relations: {
      prerequisites: ['module-theory', 'abelian-groups'],
      nextTopics: ['homology', 'exact-sequence'],
      related: ['cohomology'],
      applications: ['topology', 'algebra']
    },
    tags: ['사슬', 'chain', '복합체', 'complex']
  },
  {
    id: 'exact-sequence',
    name: {
      ko: '완전열',
      en: 'Exact Sequence',
      ja: '完全列'
    },
    field: 'homological-algebra',
    subfield: 'foundations',
    difficulty: 4,
    content: {
      ko: {
        definition: '각 위치에서 상(image)이 다음 핵(kernel)과 같은 사상들의 열',
        formulas: ['...→ A →^f B →^g C →...', 'im f = ker g', '단완전열: 0 → A → B → C → 0'],
        examples: ['0 → ℤ →^{×2} ℤ → ℤ/2ℤ → 0', '분할되는 완전열'],
        applications: ['확장 문제', '호몰로지', '대수적 K-이론']
      },
      en: {
        definition: 'Sequence of maps where image at each position equals kernel of next map',
        formulas: ['...→ A →^f B →^g C →...', 'im f = ker g', 'Short exact: 0 → A → B → C → 0'],
        examples: ['0 → ℤ →^{×2} ℤ → ℤ/2ℤ → 0', 'Split exact sequence'],
        applications: ['Extension problems', 'Homology', 'Algebraic K-theory']
      },
      ja: {
        definition: '各位置で像が次の核と等しい写像の列',
        formulas: ['...→ A →^f B →^g C →...', 'im f = ker g', '短完全列: 0 → A → B → C → 0'],
        examples: ['0 → ℤ →^{×2} ℤ → ℤ/2ℤ → 0', '分裂する完全列'],
        applications: ['拡大問題', 'ホモロジー', '代数的K理論']
      }
    },
    latex: '\\text{im } f = \\ker g',
    relations: {
      prerequisites: ['kernel', 'image', 'homomorphism'],
      nextTopics: ['long-exact-sequence', 'snake-lemma'],
      related: ['chain-complex'],
      applications: ['algebra', 'topology']
    },
    tags: ['완전열', 'exact', 'sequence', 'kernel']
  },
  {
    id: 'derived-functor',
    name: {
      ko: '유도 함자',
      en: 'Derived Functor',
      ja: '導来関手'
    },
    field: 'homological-algebra',
    subfield: 'functors',
    difficulty: 5,
    content: {
      ko: {
        definition: '완전하지 않은 함자를 "수정"하여 얻는 함자의 모임',
        formulas: ['Lₙ F (좌유도)', 'Rⁿ F (우유도)', 'Ext, Tor 함자'],
        examples: ['Extⁿ(A,B) = Rⁿ Hom(A,-)(B)', 'Torₙ(A,B) = Lₙ (A⊗-)(B)'],
        applications: ['확장 분류', '호몰로지 대수', '대수기하']
      },
      en: {
        definition: 'Collection of functors obtained by "correcting" non-exact functors',
        formulas: ['Lₙ F (left derived)', 'Rⁿ F (right derived)', 'Ext, Tor functors'],
        examples: ['Extⁿ(A,B) = Rⁿ Hom(A,-)(B)', 'Torₙ(A,B) = Lₙ (A⊗-)(B)'],
        applications: ['Extension classification', 'Homological algebra', 'Algebraic geometry']
      },
      ja: {
        definition: '完全でない関手を「修正」して得られる関手の集まり',
        formulas: ['Lₙ F (左導来)', 'Rⁿ F (右導来)', 'Ext, Tor 関手'],
        examples: ['Extⁿ(A,B) = Rⁿ Hom(A,-)(B)', 'Torₙ(A,B) = Lₙ (A⊗-)(B)'],
        applications: ['拡大の分類', 'ホモロジー代数', '代数幾何']
      }
    },
    latex: 'R^n F, \\; L_n F',
    relations: {
      prerequisites: ['functor', 'exact-sequence', 'resolution'],
      nextTopics: ['spectral-sequence'],
      related: ['ext-functor', 'tor-functor'],
      applications: ['algebraic-geometry', 'representation-theory']
    },
    tags: ['유도', 'derived', '함자', 'functor']
  },
  {
    id: 'ext-functor',
    name: {
      ko: 'Ext 함자',
      en: 'Ext Functor',
      ja: 'Ext関手'
    },
    field: 'homological-algebra',
    subfield: 'functors',
    difficulty: 5,
    content: {
      ko: {
        definition: 'Hom 함자의 우유도 함자. 모듈 확장을 분류',
        formulas: ['Extⁿ(A,B) = Rⁿ Hom(A,-)(B)', 'Ext¹(A,B): 0→B→E→A→0 확장', '긴 완전열'],
        examples: ['Ext¹(ℤ/n, ℤ) = ℤ/n', 'Ext¹(ℤ, ℤ) = 0'],
        applications: ['확장 이론', '코호몰로지', '표현론']
      },
      en: {
        definition: 'Right derived functor of Hom. Classifies module extensions',
        formulas: ['Extⁿ(A,B) = Rⁿ Hom(A,-)(B)', 'Ext¹(A,B): 0→B→E→A→0 extensions', 'Long exact sequence'],
        examples: ['Ext¹(ℤ/n, ℤ) = ℤ/n', 'Ext¹(ℤ, ℤ) = 0'],
        applications: ['Extension theory', 'Cohomology', 'Representation theory']
      },
      ja: {
        definition: 'Hom関手の右導来関手。モジュール拡大を分類',
        formulas: ['Extⁿ(A,B) = Rⁿ Hom(A,-)(B)', 'Ext¹(A,B): 0→B→E→A→0 拡大', '長完全列'],
        examples: ['Ext¹(ℤ/n, ℤ) = ℤ/n', 'Ext¹(ℤ, ℤ) = 0'],
        applications: ['拡大理論', 'コホモロジー', '表現論']
      }
    },
    latex: '\\text{Ext}^n(A,B) = R^n \\text{Hom}(A,-)(B)',
    relations: {
      prerequisites: ['derived-functor', 'hom-functor'],
      nextTopics: ['group-cohomology'],
      related: ['tor-functor'],
      applications: ['cohomology', 'extensions']
    },
    tags: ['Ext', '확장', 'extension', 'derived']
  },
  {
    id: 'tor-functor',
    name: {
      ko: 'Tor 함자',
      en: 'Tor Functor',
      ja: 'Tor関手'
    },
    field: 'homological-algebra',
    subfield: 'functors',
    difficulty: 5,
    content: {
      ko: {
        definition: '텐서곱 함자의 좌유도 함자. 텐서곱의 "비틀림"을 측정',
        formulas: ['Torₙ(A,B) = Lₙ(A⊗-)(B)', 'Tor₁(A,B): 텐서곱의 비자명한 관계', '평탄 모듈: Tor₁(-,F) = 0'],
        examples: ['Tor₁(ℤ/m, ℤ/n) = ℤ/gcd(m,n)', 'Tor(A,B) = 0 if A or B free'],
        applications: ['평탄성', '대수기하', '호몰로지']
      },
      en: {
        definition: 'Left derived functor of tensor product. Measures "torsion" in tensor product',
        formulas: ['Torₙ(A,B) = Lₙ(A⊗-)(B)', 'Tor₁(A,B): nontrivial relations in tensor', 'Flat module: Tor₁(-,F) = 0'],
        examples: ['Tor₁(ℤ/m, ℤ/n) = ℤ/gcd(m,n)', 'Tor(A,B) = 0 if A or B free'],
        applications: ['Flatness', 'Algebraic geometry', 'Homology']
      },
      ja: {
        definition: 'テンソル積関手の左導来関手。テンソル積の「捻れ」を測定',
        formulas: ['Torₙ(A,B) = Lₙ(A⊗-)(B)', 'Tor₁(A,B): テンソルの非自明な関係', '平坦モジュール: Tor₁(-,F) = 0'],
        examples: ['Tor₁(ℤ/m, ℤ/n) = ℤ/gcd(m,n)', 'Tor(A,B) = 0 if A or B free'],
        applications: ['平坦性', '代数幾何', 'ホモロジー']
      }
    },
    latex: '\\text{Tor}_n(A,B) = L_n(A \\otimes -)(B)',
    relations: {
      prerequisites: ['derived-functor', 'tensor-product'],
      nextTopics: ['flatness'],
      related: ['ext-functor'],
      applications: ['flatness', 'homology']
    },
    tags: ['Tor', '비틀림', 'torsion', 'derived']
  },
  {
    id: 'spectral-sequence',
    name: {
      ko: '스펙트럴 수열',
      en: 'Spectral Sequence',
      ja: 'スペクトル系列'
    },
    field: 'homological-algebra',
    subfield: 'advanced',
    difficulty: 5,
    content: {
      ko: {
        definition: '호몰로지를 단계적으로 계산하는 대수적 도구',
        formulas: ['Eᵣ^{p,q} ⟹ Hⁿ', 'dᵣ: Eᵣ^{p,q} → Eᵣ^{p+r,q-r+1}', 'Eᵣ₊₁ = H(Eᵣ, dᵣ)'],
        examples: ['세르 스펙트럴 수열', '그로텐딕 스펙트럴 수열', '레레이 스펙트럴 수열'],
        applications: ['호몰로지 계산', '위상수학', '대수기하']
      },
      en: {
        definition: 'Algebraic tool for computing homology in stages',
        formulas: ['Eᵣ^{p,q} ⟹ Hⁿ', 'dᵣ: Eᵣ^{p,q} → Eᵣ^{p+r,q-r+1}', 'Eᵣ₊₁ = H(Eᵣ, dᵣ)'],
        examples: ['Serre spectral sequence', 'Grothendieck spectral sequence', 'Leray spectral sequence'],
        applications: ['Homology computation', 'Topology', 'Algebraic geometry']
      },
      ja: {
        definition: 'ホモロジーを段階的に計算する代数的ツール',
        formulas: ['Eᵣ^{p,q} ⟹ Hⁿ', 'dᵣ: Eᵣ^{p,q} → Eᵣ^{p+r,q-r+1}', 'Eᵣ₊₁ = H(Eᵣ, dᵣ)'],
        examples: ['セールのスペクトル系列', 'グロタンディークのスペクトル系列', 'ルレーのスペクトル系列'],
        applications: ['ホモロジー計算', '位相数学', '代数幾何']
      }
    },
    latex: 'E_r^{p,q} \\Rightarrow H^{p+q}',
    relations: {
      prerequisites: ['chain-complex', 'derived-functor'],
      nextTopics: ['derived-category'],
      related: ['filtration'],
      applications: ['topology', 'algebraic-geometry']
    },
    tags: ['스펙트럴', 'spectral', '수열', 'sequence']
  },
  {
    id: 'projective-module',
    name: {
      ko: '사영 모듈',
      en: 'Projective Module',
      ja: '射影加群'
    },
    field: 'homological-algebra',
    subfield: 'modules',
    difficulty: 4,
    content: {
      ko: {
        definition: '자유 모듈의 직합인수. 사영 분해의 기본 구성 요소',
        formulas: ['리프팅: P →f A →^π B → 0, ∃g: P → A with πg = f', '동치: 분할되는 전사의 정의역', '동치: Hom(P,-)가 완전'],
        examples: ['자유 모듈', 'ℤ/6 위의 ℤ/2 ⊕ ℤ/3'],
        applications: ['호몰로지', '대수적 K-이론', '표현론']
      },
      en: {
        definition: 'Direct summand of free module. Building block for projective resolutions',
        formulas: ['Lifting: P →f A →^π B → 0, ∃g: P → A with πg = f', 'Equiv: domain of split epimorphism', 'Equiv: Hom(P,-) exact'],
        examples: ['Free modules', 'ℤ/2 ⊕ ℤ/3 over ℤ/6'],
        applications: ['Homology', 'Algebraic K-theory', 'Representation theory']
      },
      ja: {
        definition: '自由モジュールの直和因子。射影分解の基本構成要素',
        formulas: ['リフティング: P →f A →^π B → 0, ∃g: P → A with πg = f', '同値: 分裂全射の定義域', '同値: Hom(P,-)が完全'],
        examples: ['自由モジュール', 'ℤ/6上のℤ/2 ⊕ ℤ/3'],
        applications: ['ホモロジー', '代数的K理論', '表現論']
      }
    },
    latex: '\\text{Hom}(P, -) \\text{ is exact}',
    relations: {
      prerequisites: ['module-theory', 'exact-sequence'],
      nextTopics: ['projective-resolution'],
      related: ['injective-module', 'flat-module'],
      applications: ['resolutions', 'k-theory']
    },
    tags: ['사영', 'projective', '모듈', 'module']
  },
  {
    id: 'injective-module',
    name: {
      ko: '단사 모듈',
      en: 'Injective Module',
      ja: '入射加群'
    },
    field: 'homological-algebra',
    subfield: 'modules',
    difficulty: 4,
    content: {
      ko: {
        definition: '단사 분해의 기본 구성 요소. 사영 모듈의 쌍대',
        formulas: ['확장: 0 → A →^ι B → C, ∃g: B → I with gι = f', '동치: 분할되는 단사의 공역', '동치: Hom(-,I)가 완전', '베어 기준'],
        examples: ['ℚ/ℤ', '나눗셈군'],
        applications: ['호몰로지', '층 이론', '대수기하']
      },
      en: {
        definition: 'Building block for injective resolutions. Dual of projective module',
        formulas: ['Extension: 0 → A →^ι B → C, ∃g: B → I with gι = f', 'Equiv: codomain of split mono', 'Equiv: Hom(-,I) exact', 'Baer criterion'],
        examples: ['ℚ/ℤ', 'Divisible groups'],
        applications: ['Homology', 'Sheaf theory', 'Algebraic geometry']
      },
      ja: {
        definition: '入射分解の基本構成要素。射影モジュールの双対',
        formulas: ['拡張: 0 → A →^ι B → C, ∃g: B → I with gι = f', '同値: 分裂単射の終域', '同値: Hom(-,I)が完全', 'ベーアの基準'],
        examples: ['ℚ/ℤ', '可除群'],
        applications: ['ホモロジー', '層理論', '代数幾何']
      }
    },
    latex: '\\text{Hom}(-, I) \\text{ is exact}',
    relations: {
      prerequisites: ['module-theory', 'exact-sequence'],
      nextTopics: ['injective-resolution'],
      related: ['projective-module'],
      applications: ['sheaves', 'cohomology']
    },
    tags: ['단사', 'injective', '모듈', 'module']
  }
];
