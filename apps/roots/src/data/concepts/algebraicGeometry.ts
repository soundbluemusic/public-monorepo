import { MathConcept } from '../types';

export const algebraicGeometryConcepts: MathConcept[] = [
  {
    id: 'algebraic-variety',
    name: {
      ko: '대수적 다양체',
      en: 'Algebraic Variety',
      ja: '代数多様体'
    },
    field: 'algebraic-geometry',
    subfield: 'varieties',
    difficulty: 5,
    content: {
      ko: {
        definition: '다항식 방정식의 해집합. 대수기하학의 기본 연구 대상',
        formulas: ['V(I) = {x ∈ kⁿ : f(x) = 0, ∀f ∈ I}', '아핀 다양체: Aⁿ의 부분집합', '사영 다양체: Pⁿ의 부분집합'],
        examples: ['원: x² + y² = 1', '타원곡선: y² = x³ + ax + b', '곡면: xyz = 1'],
        applications: ['암호학', '정수론', '물리학']
      },
      en: {
        definition: 'Solution set of polynomial equations. Fundamental objects in algebraic geometry',
        formulas: ['V(I) = {x ∈ kⁿ : f(x) = 0, ∀f ∈ I}', 'Affine variety: subset of Aⁿ', 'Projective variety: subset of Pⁿ'],
        examples: ['Circle: x² + y² = 1', 'Elliptic curve: y² = x³ + ax + b', 'Surface: xyz = 1'],
        applications: ['Cryptography', 'Number theory', 'Physics']
      },
      ja: {
        definition: '多項式方程式の解集合。代数幾何学の基本的研究対象',
        formulas: ['V(I) = {x ∈ kⁿ : f(x) = 0, ∀f ∈ I}', 'アフィン多様体: Aⁿの部分集合', '射影多様体: Pⁿの部分集合'],
        examples: ['円: x² + y² = 1', '楕円曲線: y² = x³ + ax + b', '曲面: xyz = 1'],
        applications: ['暗号学', '整数論', '物理学']
      }
    },
    latex: 'V(I) = \\{x \\in k^n : f(x) = 0, \\; \\forall f \\in I\\}',
    relations: {
      prerequisites: ['polynomial-ring', 'ideal'],
      nextTopics: ['scheme', 'sheaf'],
      related: ['manifold'],
      applications: ['cryptography', 'physics']
    },
    tags: ['다양체', 'variety', '대수기하', 'algebraic']
  },
  {
    id: 'projective-space',
    name: {
      ko: '사영 공간',
      en: 'Projective Space',
      ja: '射影空間'
    },
    field: 'algebraic-geometry',
    subfield: 'spaces',
    difficulty: 4,
    content: {
      ko: {
        definition: '벡터공간의 1차원 부분공간들의 집합. "무한점"을 포함하여 기하학 완성',
        formulas: ['Pⁿ = (kⁿ⁺¹ - {0})/~', '[x₀:x₁:...:xₙ] (동차좌표)', 'P¹ = k ∪ {∞}'],
        examples: ['P¹ (사영직선)', 'P² (사영평면)', '무한점에서 만나는 평행선'],
        applications: ['대수기하', '컴퓨터 비전', '원근법']
      },
      en: {
        definition: 'Set of 1-dimensional subspaces of vector space. Completes geometry by including "points at infinity"',
        formulas: ['Pⁿ = (kⁿ⁺¹ - {0})/~', '[x₀:x₁:...:xₙ] (homogeneous coords)', 'P¹ = k ∪ {∞}'],
        examples: ['P¹ (projective line)', 'P² (projective plane)', 'Parallel lines meeting at infinity'],
        applications: ['Algebraic geometry', 'Computer vision', 'Perspective']
      },
      ja: {
        definition: 'ベクトル空間の1次元部分空間の集合。「無限遠点」を含め幾何学を完成',
        formulas: ['Pⁿ = (kⁿ⁺¹ - {0})/~', '[x₀:x₁:...:xₙ] (斉次座標)', 'P¹ = k ∪ {∞}'],
        examples: ['P¹ (射影直線)', 'P² (射影平面)', '無限遠点で交わる平行線'],
        applications: ['代数幾何', 'コンピュータビジョン', '遠近法']
      }
    },
    latex: '\\mathbb{P}^n = (k^{n+1} - \\{0\\})/\\sim',
    relations: {
      prerequisites: ['linear-algebra', 'equivalence-relation'],
      nextTopics: ['algebraic-variety', 'grassmannian'],
      related: ['affine-space'],
      applications: ['computer-graphics', 'geometry']
    },
    tags: ['사영', 'projective', '동차좌표', 'homogeneous']
  },
  {
    id: 'scheme',
    name: {
      ko: '스킴',
      en: 'Scheme',
      ja: 'スキーム'
    },
    field: 'algebraic-geometry',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition: '국소환달린 공간. 대수적 다양체의 일반화로 현대 대수기하의 기초',
        formulas: ['(X, O_X)', 'Spec A: 소 아이디얼의 집합', '구조층: O_X (국소환의 층)'],
        examples: ['Spec ℤ', 'Spec k[x]', 'Proj (사영 스킴)'],
        applications: ['수론', '대수기하', '호몰로지대수']
      },
      en: {
        definition: 'Locally ringed space. Generalization of varieties, foundation of modern algebraic geometry',
        formulas: ['(X, O_X)', 'Spec A: set of prime ideals', 'Structure sheaf: O_X (sheaf of local rings)'],
        examples: ['Spec ℤ', 'Spec k[x]', 'Proj (projective scheme)'],
        applications: ['Number theory', 'Algebraic geometry', 'Homological algebra']
      },
      ja: {
        definition: '局所環付き空間。代数多様体の一般化で現代代数幾何の基礎',
        formulas: ['(X, O_X)', 'Spec A: 素イデアルの集合', '構造層: O_X (局所環の層)'],
        examples: ['Spec ℤ', 'Spec k[x]', 'Proj (射影スキーム)'],
        applications: ['整数論', '代数幾何', 'ホモロジー代数']
      }
    },
    latex: '(X, \\mathcal{O}_X)',
    relations: {
      prerequisites: ['algebraic-variety', 'commutative-algebra', 'sheaf'],
      nextTopics: ['coherent-sheaf', 'morphism'],
      related: ['manifold'],
      applications: ['number-theory', 'moduli']
    },
    tags: ['스킴', 'scheme', 'Spec', 'Grothendieck']
  },
  {
    id: 'sheaf-theory',
    name: {
      ko: '층 이론',
      en: 'Sheaf Theory',
      ja: '層理論'
    },
    field: 'algebraic-geometry',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition: '위상공간의 열린집합에 대수적 데이터를 붙이는 구조',
        formulas: ['전층: F: Open(X)^op → C', '층 조건: 접합 공리', '층화: 전층 → 층', '층 코호몰로지: Hⁿ(X, F)'],
        examples: ['연속함수 층', '미분형식 층', '정칙함수 층 O'],
        applications: ['대수기하', '복소해석', '위상수학']
      },
      en: {
        definition: 'Structure attaching algebraic data to open sets of topological space',
        formulas: ['Presheaf: F: Open(X)^op → C', 'Sheaf condition: gluing axiom', 'Sheafification: presheaf → sheaf', 'Sheaf cohomology: Hⁿ(X, F)'],
        examples: ['Sheaf of continuous functions', 'Sheaf of differential forms', 'Structure sheaf O'],
        applications: ['Algebraic geometry', 'Complex analysis', 'Topology']
      },
      ja: {
        definition: '位相空間の開集合に代数的データを付ける構造',
        formulas: ['前層: F: Open(X)^op → C', '層条件: 貼り合わせ公理', '層化: 前層 → 層', '層コホモロジー: Hⁿ(X, F)'],
        examples: ['連続関数の層', '微分形式の層', '正則関数の層 O'],
        applications: ['代数幾何', '複素解析', '位相数学']
      }
    },
    latex: 'H^n(X, \\mathcal{F})',
    relations: {
      prerequisites: ['topology', 'category-definition'],
      nextTopics: ['scheme', 'derived-category'],
      related: ['cohomology'],
      applications: ['algebraic-geometry', 'complex-analysis']
    },
    tags: ['층', 'sheaf', '코호몰로지', 'cohomology']
  },
  {
    id: 'bezouts-theorem',
    name: {
      ko: '베주 정리',
      en: "Bézout's Theorem",
      ja: 'ベズーの定理'
    },
    field: 'algebraic-geometry',
    subfield: 'intersection',
    difficulty: 4,
    content: {
      ko: {
        definition: '두 사영 곡선의 교점 개수는 차수의 곱 (적절히 세면)',
        formulas: ['deg(C₁) · deg(C₂) = Σ m_p', '중복도 포함, 복소수 체, 무한점 포함'],
        examples: ['직선과 원뿔곡선: 2점', '두 원뿔곡선: 4점'],
        applications: ['교점 이론', '대수기하', '기하학']
      },
      en: {
        definition: 'Number of intersection points of two projective curves equals product of degrees (counted properly)',
        formulas: ['deg(C₁) · deg(C₂) = Σ m_p', 'With multiplicity, over ℂ, including infinity'],
        examples: ['Line and conic: 2 points', 'Two conics: 4 points'],
        applications: ['Intersection theory', 'Algebraic geometry', 'Geometry']
      },
      ja: {
        definition: '二つの射影曲線の交点数は次数の積（適切に数えると）',
        formulas: ['deg(C₁) · deg(C₂) = Σ m_p', '重複度込み、複素数体上、無限遠点含む'],
        examples: ['直線と円錐曲線: 2点', '二つの円錐曲線: 4点'],
        applications: ['交点理論', '代数幾何', '幾何学']
      }
    },
    latex: '\\deg(C_1) \\cdot \\deg(C_2) = \\sum_p m_p',
    relations: {
      prerequisites: ['projective-space', 'polynomial-degree'],
      nextTopics: ['intersection-multiplicity'],
      related: ['fundamental-theorem-algebra'],
      applications: ['intersection-theory']
    },
    tags: ['베주', 'Bézout', '교점', 'intersection']
  },
  {
    id: 'hilbert-nullstellensatz',
    name: {
      ko: '힐베르트 영점정리',
      en: 'Hilbert Nullstellensatz',
      ja: 'ヒルベルトの零点定理'
    },
    field: 'algebraic-geometry',
    subfield: 'foundations',
    difficulty: 5,
    content: {
      ko: {
        definition: '다항식의 아이디얼과 대수적 집합 사이의 대응. 대수기하학의 기초',
        formulas: ['I(V(I)) = √I (근기)', '약한 형태: k 대수폐체, I ≠ k[x] ⟹ V(I) ≠ ∅', 'I, V 사이의 갈루아 대응'],
        examples: ['V(x²) = {0}, I(V(x²)) = (x)'],
        applications: ['대수기하', '가환대수', '정수론']
      },
      en: {
        definition: 'Correspondence between polynomial ideals and algebraic sets. Foundation of algebraic geometry',
        formulas: ['I(V(I)) = √I (radical)', 'Weak form: k alg. closed, I ≠ k[x] ⟹ V(I) ≠ ∅', 'Galois correspondence between I, V'],
        examples: ['V(x²) = {0}, I(V(x²)) = (x)'],
        applications: ['Algebraic geometry', 'Commutative algebra', 'Number theory']
      },
      ja: {
        definition: '多項式のイデアルと代数的集合の対応。代数幾何学の基礎',
        formulas: ['I(V(I)) = √I (根基)', '弱い形: k代数閉体, I ≠ k[x] ⟹ V(I) ≠ ∅', 'I, Vの間のガロア対応'],
        examples: ['V(x²) = {0}, I(V(x²)) = (x)'],
        applications: ['代数幾何', '可換環論', '整数論']
      }
    },
    latex: 'I(V(I)) = \\sqrt{I}',
    relations: {
      prerequisites: ['ideal', 'polynomial-ring'],
      nextTopics: ['algebraic-variety', 'scheme'],
      related: ['fundamental-theorem-algebra'],
      applications: ['algebraic-geometry']
    },
    tags: ['힐베르트', 'Nullstellensatz', '영점', 'radical']
  },
  {
    id: 'riemann-roch',
    name: {
      ko: '리만-로흐 정리',
      en: 'Riemann-Roch Theorem',
      ja: 'リーマン・ロッホの定理'
    },
    field: 'algebraic-geometry',
    subfield: 'curves',
    difficulty: 5,
    content: {
      ko: {
        definition: '대수곡선 위 인자의 선형계 차원을 계산하는 기본 정리',
        formulas: ['ℓ(D) - ℓ(K-D) = deg(D) - g + 1', 'g: 종수, K: 표준인자', 'ℓ(D) = dim L(D)'],
        examples: ['g=0: ℓ(D) = max(0, deg(D)+1)', 'g=1 타원곡선'],
        applications: ['곡선론', '암호학', '코딩이론']
      },
      en: {
        definition: 'Fundamental theorem computing dimension of linear systems of divisors on algebraic curves',
        formulas: ['ℓ(D) - ℓ(K-D) = deg(D) - g + 1', 'g: genus, K: canonical divisor', 'ℓ(D) = dim L(D)'],
        examples: ['g=0: ℓ(D) = max(0, deg(D)+1)', 'g=1 elliptic curve'],
        applications: ['Curve theory', 'Cryptography', 'Coding theory']
      },
      ja: {
        definition: '代数曲線上の因子の線形系の次元を計算する基本定理',
        formulas: ['ℓ(D) - ℓ(K-D) = deg(D) - g + 1', 'g: 種数, K: 標準因子', 'ℓ(D) = dim L(D)'],
        examples: ['g=0: ℓ(D) = max(0, deg(D)+1)', 'g=1 楕円曲線'],
        applications: ['曲線論', '暗号学', '符号理論']
      }
    },
    latex: '\\ell(D) - \\ell(K-D) = \\deg(D) - g + 1',
    relations: {
      prerequisites: ['algebraic-variety', 'divisor'],
      nextTopics: ['grothendieck-riemann-roch'],
      related: ['genus'],
      applications: ['curves', 'coding-theory']
    },
    tags: ['리만로흐', 'Riemann-Roch', '종수', 'genus']
  },
  {
    id: 'elliptic-curves-ag',
    name: {
      ko: '타원곡선 (대수기하)',
      en: 'Elliptic Curves (Algebraic Geometry)',
      ja: '楕円曲線（代数幾何）'
    },
    field: 'algebraic-geometry',
    subfield: 'curves',
    difficulty: 5,
    content: {
      ko: {
        definition: '종수 1의 비특이 사영곡선. 군 구조를 가지며 정수론과 암호학의 핵심',
        formulas: ['y² = x³ + ax + b (바이어슈트라스)', 'Δ = -16(4a³ + 27b²) ≠ 0', '점 덧셈: P + Q + R = O'],
        examples: ['y² = x³ - x', 'y² = x³ - 432'],
        applications: ['암호학', '페르마의 마지막 정리', '정수론']
      },
      en: {
        definition: 'Non-singular projective curve of genus 1. Has group structure, central to number theory and cryptography',
        formulas: ['y² = x³ + ax + b (Weierstrass)', 'Δ = -16(4a³ + 27b²) ≠ 0', 'Point addition: P + Q + R = O'],
        examples: ['y² = x³ - x', 'y² = x³ - 432'],
        applications: ['Cryptography', "Fermat's Last Theorem", 'Number theory']
      },
      ja: {
        definition: '種数1の非特異射影曲線。群構造を持ち整数論と暗号学の中心',
        formulas: ['y² = x³ + ax + b (ワイエルシュトラス)', 'Δ = -16(4a³ + 27b²) ≠ 0', '点の加法: P + Q + R = O'],
        examples: ['y² = x³ - x', 'y² = x³ - 432'],
        applications: ['暗号学', 'フェルマーの最終定理', '整数論']
      }
    },
    latex: 'y^2 = x^3 + ax + b',
    relations: {
      prerequisites: ['algebraic-variety', 'group-theory'],
      nextTopics: ['abelian-variety', 'modular-forms'],
      related: ['elliptic-curve-crypto'],
      applications: ['cryptography', 'number-theory']
    },
    tags: ['타원곡선', 'elliptic', '암호', 'group-law']
  }
];
