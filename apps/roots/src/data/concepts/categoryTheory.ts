import { MathConcept } from '../types';

export const categoryTheoryConcepts: MathConcept[] = [
  {
    id: 'category-definition',
    name: {
      ko: '범주의 정의',
      en: 'Category Definition',
      ja: '圏の定義'
    },
    field: 'category-theory',
    subfield: 'foundations',
    difficulty: 4,
    content: {
      ko: {
        definition: '대상(objects)과 사상(morphisms)으로 구성된 수학적 구조',
        formulas: ['대상: Ob(C)', '사상: Hom(A,B)', '합성: g∘f: A→C (f:A→B, g:B→C)', '항등: id_A: A→A'],
        examples: ['Set (집합과 함수)', 'Grp (군과 준동형)', 'Top (위상공간과 연속함수)'],
        applications: ['대수학 통합', '컴퓨터 과학', '물리학']
      },
      en: {
        definition: 'Mathematical structure consisting of objects and morphisms',
        formulas: ['Objects: Ob(C)', 'Morphisms: Hom(A,B)', 'Composition: g∘f: A→C (f:A→B, g:B→C)', 'Identity: id_A: A→A'],
        examples: ['Set (sets and functions)', 'Grp (groups and homomorphisms)', 'Top (topological spaces and continuous maps)'],
        applications: ['Unifying algebra', 'Computer science', 'Physics']
      },
      ja: {
        definition: '対象と射から成る数学的構造',
        formulas: ['対象: Ob(C)', '射: Hom(A,B)', '合成: g∘f: A→C (f:A→B, g:B→C)', '恒等: id_A: A→A'],
        examples: ['Set (集合と関数)', 'Grp (群と準同型)', 'Top (位相空間と連続写像)'],
        applications: ['代数学の統一', '計算機科学', '物理学']
      }
    },
    latex: 'g \\circ f: A \\to C',
    relations: {
      prerequisites: ['set-theory', 'group-theory'],
      nextTopics: ['functor', 'natural-transformation'],
      related: ['abstract-algebra'],
      applications: ['programming-languages']
    },
    tags: ['범주', 'category', '사상', 'morphism']
  },
  {
    id: 'functor',
    name: {
      ko: '함자',
      en: 'Functor',
      ja: '関手'
    },
    field: 'category-theory',
    subfield: 'mappings',
    difficulty: 4,
    content: {
      ko: {
        definition: '범주 사이의 구조를 보존하는 사상',
        formulas: ['F: C → D', 'F(f∘g) = F(f)∘F(g)', 'F(id_A) = id_{F(A)}'],
        examples: ['망각 함자 (Forgetful)', '자유 함자 (Free)', '홈 함자 Hom(A,-)'],
        applications: ['프로그래밍 (map)', '대수적 위상', '함수형 프로그래밍']
      },
      en: {
        definition: 'Structure-preserving map between categories',
        formulas: ['F: C → D', 'F(f∘g) = F(f)∘F(g)', 'F(id_A) = id_{F(A)}'],
        examples: ['Forgetful functor', 'Free functor', 'Hom functor Hom(A,-)'],
        applications: ['Programming (map)', 'Algebraic topology', 'Functional programming']
      },
      ja: {
        definition: '圏の間の構造を保存する写像',
        formulas: ['F: C → D', 'F(f∘g) = F(f)∘F(g)', 'F(id_A) = id_{F(A)}'],
        examples: ['忘却関手', '自由関手', 'Hom関手 Hom(A,-)'],
        applications: ['プログラミング (map)', '代数的位相', '関数型プログラミング']
      }
    },
    latex: 'F(g \\circ f) = F(g) \\circ F(f)',
    relations: {
      prerequisites: ['category-definition'],
      nextTopics: ['natural-transformation', 'adjunction'],
      related: ['homomorphism'],
      applications: ['haskell', 'scala']
    },
    tags: ['함자', 'functor', '사상', 'mapping']
  },
  {
    id: 'natural-transformation',
    name: {
      ko: '자연 변환',
      en: 'Natural Transformation',
      ja: '自然変換'
    },
    field: 'category-theory',
    subfield: 'mappings',
    difficulty: 5,
    content: {
      ko: {
        definition: '두 함자 사이의 "자연스러운" 사상 모음',
        formulas: ['η: F ⇒ G', '자연성: G(f)∘η_A = η_B∘F(f)', '모든 f:A→B에 대해 다이어그램 가환'],
        examples: ['항등 자연변환', 'η: Id ⇒ List (단위원)', 'det: GL_n ⇒ GL_1'],
        applications: ['모나드', '동형 이론', '언어 의미론']
      },
      en: {
        definition: 'Collection of "natural" morphisms between two functors',
        formulas: ['η: F ⇒ G', 'Naturality: G(f)∘η_A = η_B∘F(f)', 'Diagram commutes for all f:A→B'],
        examples: ['Identity natural transformation', 'η: Id ⇒ List (unit)', 'det: GL_n ⇒ GL_1'],
        applications: ['Monads', 'Equivalence theory', 'Semantics']
      },
      ja: {
        definition: '二つの関手の間の「自然な」射の集まり',
        formulas: ['η: F ⇒ G', '自然性: G(f)∘η_A = η_B∘F(f)', 'すべてのf:A→Bで図式が可換'],
        examples: ['恒等自然変換', 'η: Id ⇒ List (単位)', 'det: GL_n ⇒ GL_1'],
        applications: ['モナド', '同値理論', '意味論']
      }
    },
    latex: 'G(f) \\circ \\eta_A = \\eta_B \\circ F(f)',
    relations: {
      prerequisites: ['functor'],
      nextTopics: ['yoneda-lemma', 'monad'],
      related: ['isomorphism'],
      applications: ['type-theory']
    },
    tags: ['자연변환', 'natural', 'transformation', 'functor']
  },
  {
    id: 'monad-category',
    name: {
      ko: '모나드',
      en: 'Monad',
      ja: 'モナド'
    },
    field: 'category-theory',
    subfield: 'structures',
    difficulty: 5,
    content: {
      ko: {
        definition: '자기함자와 두 자연변환으로 이루어진 삼중쌍',
        formulas: ['(T, η, μ)', 'T: C → C', 'η: Id ⇒ T (unit)', 'μ: T² ⇒ T (join)', '결합법칙, 단위법칙'],
        examples: ['List 모나드', 'Maybe/Option 모나드', 'State 모나드'],
        applications: ['함수형 프로그래밍', '부작용 처리', 'IO']
      },
      en: {
        definition: 'Triple of endofunctor and two natural transformations',
        formulas: ['(T, η, μ)', 'T: C → C', 'η: Id ⇒ T (unit)', 'μ: T² ⇒ T (join)', 'Associativity, unit laws'],
        examples: ['List monad', 'Maybe/Option monad', 'State monad'],
        applications: ['Functional programming', 'Effect handling', 'IO']
      },
      ja: {
        definition: '自己関手と二つの自然変換からなる三つ組',
        formulas: ['(T, η, μ)', 'T: C → C', 'η: Id ⇒ T (単位)', 'μ: T² ⇒ T (結合)', '結合律、単位律'],
        examples: ['Listモナド', 'Maybe/Optionモナド', 'Stateモナド'],
        applications: ['関数型プログラミング', '副作用処理', 'IO']
      }
    },
    latex: '\\mu \\circ T\\mu = \\mu \\circ \\mu T',
    relations: {
      prerequisites: ['functor', 'natural-transformation'],
      nextTopics: ['kleisli-category', 'comonad'],
      related: ['adjunction'],
      applications: ['haskell', 'effect-systems']
    },
    tags: ['모나드', 'monad', '함수형', 'functional']
  },
  {
    id: 'adjunction',
    name: {
      ko: '수반',
      en: 'Adjunction',
      ja: '随伴'
    },
    field: 'category-theory',
    subfield: 'structures',
    difficulty: 5,
    content: {
      ko: {
        definition: '두 함자 사이의 특별한 관계. 범주론의 핵심 개념',
        formulas: ['F ⊣ G', 'Hom_D(F(A), B) ≅ Hom_C(A, G(B))', '자연성: 양 변수에서 자연'],
        examples: ['자유-망각 수반', '곱-대각 수반', '극한-상수함자 수반'],
        applications: ['보편 성질', '자유 대수', '극한/쌍대극한']
      },
      en: {
        definition: 'Special relationship between two functors. Central concept in category theory',
        formulas: ['F ⊣ G', 'Hom_D(F(A), B) ≅ Hom_C(A, G(B))', 'Naturality: natural in both arguments'],
        examples: ['Free-Forgetful adjunction', 'Product-Diagonal adjunction', 'Limit-Constant adjunction'],
        applications: ['Universal properties', 'Free algebras', 'Limits/colimits']
      },
      ja: {
        definition: '二つの関手の間の特別な関係。圏論の中心概念',
        formulas: ['F ⊣ G', 'Hom_D(F(A), B) ≅ Hom_C(A, G(B))', '自然性: 両方の変数で自然'],
        examples: ['自由-忘却随伴', '積-対角随伴', '極限-定数関手随伴'],
        applications: ['普遍性質', '自由代数', '極限/余極限']
      }
    },
    latex: '\\text{Hom}_D(F(A), B) \\cong \\text{Hom}_C(A, G(B))',
    relations: {
      prerequisites: ['functor', 'natural-transformation'],
      nextTopics: ['monad-category'],
      related: ['universal-property'],
      applications: ['algebra', 'logic']
    },
    tags: ['수반', 'adjunction', 'adjoint', 'functor']
  },
  {
    id: 'yoneda-lemma',
    name: {
      ko: '요네다 보조정리',
      en: 'Yoneda Lemma',
      ja: '米田の補題'
    },
    field: 'category-theory',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition: '표현가능 함자와 자연변환 사이의 동형을 밝히는 핵심 정리',
        formulas: ['Nat(Hom(A,-), F) ≅ F(A)', '요네다 임베딩: C → Set^{C^op}', 'y: A ↦ Hom(-,A)'],
        examples: ['모든 자연변환은 원소로 결정', '역변환: η ↦ η_A(id_A)'],
        applications: ['표현가능성 이론', '프리쉬프', '고차 범주']
      },
      en: {
        definition: 'Key lemma establishing isomorphism between representable functors and natural transformations',
        formulas: ['Nat(Hom(A,-), F) ≅ F(A)', 'Yoneda embedding: C → Set^{C^op}', 'y: A ↦ Hom(-,A)'],
        examples: ['Every natural transformation determined by element', 'Inverse: η ↦ η_A(id_A)'],
        applications: ['Representability theory', 'Presheaves', 'Higher categories']
      },
      ja: {
        definition: '表現可能関手と自然変換の間の同型を示す重要な補題',
        formulas: ['Nat(Hom(A,-), F) ≅ F(A)', '米田埋め込み: C → Set^{C^op}', 'y: A ↦ Hom(-,A)'],
        examples: ['すべての自然変換は元で決定される', '逆変換: η ↦ η_A(id_A)'],
        applications: ['表現可能性理論', '前層', '高次圏']
      }
    },
    latex: '\\text{Nat}(\\text{Hom}(A,-), F) \\cong F(A)',
    relations: {
      prerequisites: ['functor', 'natural-transformation'],
      nextTopics: ['representable-functor', 'presheaf'],
      related: ['adjunction'],
      applications: ['topos-theory']
    },
    tags: ['요네다', 'Yoneda', '보조정리', 'lemma']
  },
  {
    id: 'limits-colimits',
    name: {
      ko: '극한과 쌍대극한',
      en: 'Limits and Colimits',
      ja: '極限と余極限'
    },
    field: 'category-theory',
    subfield: 'constructions',
    difficulty: 5,
    content: {
      ko: {
        definition: '범주에서 다이어그램의 "가장 좋은" 근사. 곱, 등화자, 당김 등의 일반화',
        formulas: ['극한: lim F = 보편 뿔', '쌍대극한: colim F = 보편 공뿔', 'Hom(X, lim F) ≅ lim Hom(X, F(-))'],
        examples: ['곱/쌍곱 (Product/Coproduct)', '등화자/쌍등화자', '당김/밀어내기 (Pullback/Pushout)'],
        applications: ['대수적 구성', '호몰로지', '타입 이론']
      },
      en: {
        definition: '"Best" approximations of diagrams in categories. Generalizes products, equalizers, pullbacks',
        formulas: ['Limit: lim F = universal cone', 'Colimit: colim F = universal cocone', 'Hom(X, lim F) ≅ lim Hom(X, F(-))'],
        examples: ['Product/Coproduct', 'Equalizer/Coequalizer', 'Pullback/Pushout'],
        applications: ['Algebraic constructions', 'Homology', 'Type theory']
      },
      ja: {
        definition: '圏における図式の「最良」の近似。積、等化子、引き戻しの一般化',
        formulas: ['極限: lim F = 普遍錐', '余極限: colim F = 普遍余錐', 'Hom(X, lim F) ≅ lim Hom(X, F(-))'],
        examples: ['積/余積', '等化子/余等化子', '引き戻し/押し出し'],
        applications: ['代数的構成', 'ホモロジー', '型理論']
      }
    },
    latex: '\\text{Hom}(X, \\lim F) \\cong \\lim \\text{Hom}(X, F(-))',
    relations: {
      prerequisites: ['category-definition', 'functor'],
      nextTopics: ['kan-extension'],
      related: ['adjunction'],
      applications: ['homological-algebra']
    },
    tags: ['극한', 'limit', 'colimit', 'universal']
  },
  {
    id: 'topos',
    name: {
      ko: '토포스',
      en: 'Topos',
      ja: 'トポス'
    },
    field: 'category-theory',
    subfield: 'advanced',
    difficulty: 5,
    content: {
      ko: {
        definition: '집합의 범주와 유사한 성질을 가진 범주. 논리와 기하의 통합',
        formulas: ['유한 극한 존재', '지수 대상 존재', '부분대상 분류자 Ω 존재'],
        examples: ['Set (집합 범주)', 'Sh(X) (층의 범주)', 'Grph (유방향 그래프)'],
        applications: ['논리학', '대수기하학', '호모토피 타입 이론']
      },
      en: {
        definition: 'Category with properties similar to Set. Unifies logic and geometry',
        formulas: ['Has finite limits', 'Has exponential objects', 'Has subobject classifier Ω'],
        examples: ['Set (category of sets)', 'Sh(X) (sheaves)', 'Grph (directed graphs)'],
        applications: ['Logic', 'Algebraic geometry', 'Homotopy type theory']
      },
      ja: {
        definition: 'Setと類似の性質を持つ圏。論理と幾何の統一',
        formulas: ['有限極限が存在', '指数対象が存在', '部分対象分類子 Ω が存在'],
        examples: ['Set (集合の圏)', 'Sh(X) (層の圏)', 'Grph (有向グラフ)'],
        applications: ['論理学', '代数幾何学', 'ホモトピー型理論']
      }
    },
    latex: '\\Omega: 1 \\to \\Omega',
    relations: {
      prerequisites: ['category-definition', 'limits-colimits'],
      nextTopics: ['higher-topos'],
      related: ['logic', 'set-theory'],
      applications: ['foundations', 'geometry']
    },
    tags: ['토포스', 'topos', '논리', 'logic']
  }
];
