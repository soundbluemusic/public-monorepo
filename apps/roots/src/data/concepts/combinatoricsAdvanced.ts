import { MathConcept } from '../types';

export const combinatoricsAdvancedConcepts: MathConcept[] = [
  {
    id: 'generating-functions',
    name: {
      ko: '생성함수',
      en: 'Generating Functions',
      ja: '母関数'
    },
    field: 'combinatorics',
    subfield: 'enumeration',
    difficulty: 4,
    content: {
      ko: {
        definition: '수열을 다항식 또는 멱급수의 계수로 인코딩하여 조합 문제를 해결하는 도구',
        formulas: ['OGF: G(x) = Σaₙxⁿ', 'EGF: E(x) = Σaₙxⁿ/n!', '피보나치: G(x) = x/(1-x-x²)'],
        examples: ['분할수', '카탈란 수', '스털링 수'],
        applications: ['점화식 해결', '조합 항등식', '확률론']
      },
      en: {
        definition: 'Tool encoding sequences as coefficients of polynomials or power series to solve combinatorial problems',
        formulas: ['OGF: G(x) = Σaₙxⁿ', 'EGF: E(x) = Σaₙxⁿ/n!', 'Fibonacci: G(x) = x/(1-x-x²)'],
        examples: ['Partition numbers', 'Catalan numbers', 'Stirling numbers'],
        applications: ['Solving recurrences', 'Combinatorial identities', 'Probability']
      },
      ja: {
        definition: '数列を多項式や冪級数の係数としてエンコードし組合せ問題を解くツール',
        formulas: ['OGF: G(x) = Σaₙxⁿ', 'EGF: E(x) = Σaₙxⁿ/n!', 'フィボナッチ: G(x) = x/(1-x-x²)'],
        examples: ['分割数', 'カタラン数', 'スターリング数'],
        applications: ['漸化式の解法', '組合せ恒等式', '確率論']
      }
    },
    latex: 'G(x) = \\sum_{n=0}^{\\infty} a_n x^n',
    relations: {
      prerequisites: ['sequences-and-series', 'taylor-series'],
      nextTopics: ['analytic-combinatorics'],
      related: ['recurrence-relations'],
      applications: ['enumeration', 'probability']
    },
    tags: ['생성함수', 'generating', 'enumeration', 'series']
  },
  {
    id: 'catalan-numbers',
    name: {
      ko: '카탈란 수',
      en: 'Catalan Numbers',
      ja: 'カタラン数'
    },
    field: 'combinatorics',
    subfield: 'enumeration',
    difficulty: 3,
    content: {
      ko: {
        definition: '다양한 조합 구조의 개수를 세는 수열. Cₙ = (2n)!/((n+1)!n!)',
        formulas: ['Cₙ = C(2n,n)/(n+1)', 'Cₙ = ΣCᵢCₙ₋₁₋ᵢ', 'G(x) = (1-√(1-4x))/(2x)'],
        examples: ['괄호 배열', '이진 트리', '격자 경로', '볼록 다각형 삼각분할'],
        applications: ['알고리즘', '파싱', '기하학']
      },
      en: {
        definition: 'Sequence counting various combinatorial structures. Cₙ = (2n)!/((n+1)!n!)',
        formulas: ['Cₙ = C(2n,n)/(n+1)', 'Cₙ = ΣCᵢCₙ₋₁₋ᵢ', 'G(x) = (1-√(1-4x))/(2x)'],
        examples: ['Parenthesizations', 'Binary trees', 'Lattice paths', 'Polygon triangulations'],
        applications: ['Algorithms', 'Parsing', 'Geometry']
      },
      ja: {
        definition: '様々な組合せ構造の数を数える数列。Cₙ = (2n)!/((n+1)!n!)',
        formulas: ['Cₙ = C(2n,n)/(n+1)', 'Cₙ = ΣCᵢCₙ₋₁₋ᵢ', 'G(x) = (1-√(1-4x))/(2x)'],
        examples: ['括弧の配列', '二分木', '格子経路', '凸多角形の三角形分割'],
        applications: ['アルゴリズム', '構文解析', '幾何学']
      }
    },
    latex: 'C_n = \\frac{1}{n+1}\\binom{2n}{n}',
    relations: {
      prerequisites: ['binomial-coefficient', 'recursion'],
      nextTopics: ['generating-functions'],
      related: ['fibonacci-sequence'],
      applications: ['computer-science', 'combinatorics']
    },
    tags: ['카탈란', 'Catalan', '열거', 'enumeration']
  },
  {
    id: 'stirling-numbers',
    name: {
      ko: '스털링 수',
      en: 'Stirling Numbers',
      ja: 'スターリング数'
    },
    field: 'combinatorics',
    subfield: 'enumeration',
    difficulty: 4,
    content: {
      ko: {
        definition: '순열과 집합 분할을 세는 두 종류의 조합수',
        formulas: ['제1종 s(n,k): n개를 k개 순환으로 배열', '제2종 S(n,k): n개를 k개 부분집합으로 분할', 'S(n,k) = kS(n-1,k) + S(n-1,k-1)'],
        examples: ['s(4,2) = 11', 'S(4,2) = 7', '벨 수: Bₙ = ΣS(n,k)'],
        applications: ['분할', '다항식', '확률론']
      },
      en: {
        definition: 'Two types of combinatorial numbers counting permutations and set partitions',
        formulas: ['First kind s(n,k): n elements into k cycles', 'Second kind S(n,k): n into k subsets', 'S(n,k) = kS(n-1,k) + S(n-1,k-1)'],
        examples: ['s(4,2) = 11', 'S(4,2) = 7', 'Bell number: Bₙ = ΣS(n,k)'],
        applications: ['Partitions', 'Polynomials', 'Probability']
      },
      ja: {
        definition: '順列と集合分割を数える2種類の組合せ数',
        formulas: ['第1種 s(n,k): n個をk個の巡回に配列', '第2種 S(n,k): n個をk個の部分集合に分割', 'S(n,k) = kS(n-1,k) + S(n-1,k-1)'],
        examples: ['s(4,2) = 11', 'S(4,2) = 7', 'ベル数: Bₙ = ΣS(n,k)'],
        applications: ['分割', '多項式', '確率論']
      }
    },
    latex: 'S(n,k) = k \\cdot S(n-1,k) + S(n-1,k-1)',
    relations: {
      prerequisites: ['permutations', 'partitions'],
      nextTopics: ['bell-numbers'],
      related: ['binomial-coefficient'],
      applications: ['set-partitions', 'polynomials']
    },
    tags: ['스털링', 'Stirling', '분할', 'partition']
  },
  {
    id: 'polya-enumeration',
    name: {
      ko: '폴리아 열거 정리',
      en: 'Pólya Enumeration Theorem',
      ja: 'ポリアの計数定理'
    },
    field: 'combinatorics',
    subfield: 'enumeration',
    difficulty: 5,
    content: {
      ko: {
        definition: '대칭성을 고려하여 구별 불가능한 구조의 개수를 세는 정리',
        formulas: ['|X/G| = (1/|G|) Σ |X^g|', '순환 지표: Z(G)', '색칠 수: PG(c₁,c₂,...,cₖ)'],
        examples: ['목걸이 색칠', '정다면체 색칠', '그래프 동형'],
        applications: ['화학', '그래프 이론', '분자 구조']
      },
      en: {
        definition: 'Theorem counting indistinguishable structures considering symmetry',
        formulas: ['|X/G| = (1/|G|) Σ |X^g|', 'Cycle index: Z(G)', 'Colorings: PG(c₁,c₂,...,cₖ)'],
        examples: ['Necklace coloring', 'Polyhedra coloring', 'Graph isomorphism'],
        applications: ['Chemistry', 'Graph theory', 'Molecular structures']
      },
      ja: {
        definition: '対称性を考慮して区別不能な構造の数を数える定理',
        formulas: ['|X/G| = (1/|G|) Σ |X^g|', '巡回指標: Z(G)', '彩色数: PG(c₁,c₂,...,cₖ)'],
        examples: ['ネックレスの彩色', '正多面体の彩色', 'グラフ同型'],
        applications: ['化学', 'グラフ理論', '分子構造']
      }
    },
    latex: '|X/G| = \\frac{1}{|G|} \\sum_{g \\in G} |X^g|',
    relations: {
      prerequisites: ['group-theory', 'group-actions'],
      nextTopics: ['burnside-lemma'],
      related: ['symmetry'],
      applications: ['chemistry', 'graph-theory']
    },
    tags: ['폴리아', 'Pólya', '대칭', 'symmetry']
  },
  {
    id: 'ramsey-theory',
    name: {
      ko: '램지 이론',
      en: 'Ramsey Theory',
      ja: 'ラムゼー理論'
    },
    field: 'combinatorics',
    subfield: 'extremal',
    difficulty: 5,
    content: {
      ko: {
        definition: '충분히 큰 구조에서는 규칙적인 부분구조가 반드시 존재함을 연구',
        formulas: ['R(r,s): 최소 n where Kₙ 2색칠에 Kr 또는 Ks 단색 존재', 'R(3,3) = 6', 'R(4,4) = 18'],
        examples: ['파티 문제', '반데르바르덴 정리', '헤일스-주엣 정리'],
        applications: ['조합론', '컴퓨터과학', '논리학']
      },
      en: {
        definition: 'Study of conditions guaranteeing regular substructures in large enough structures',
        formulas: ['R(r,s): min n where Kₙ 2-coloring has mono Kr or Ks', 'R(3,3) = 6', 'R(4,4) = 18'],
        examples: ['Party problem', 'Van der Waerden theorem', 'Hales-Jewett theorem'],
        applications: ['Combinatorics', 'Computer science', 'Logic']
      },
      ja: {
        definition: '十分大きな構造では規則的な部分構造が必ず存在することを研究',
        formulas: ['R(r,s): 最小n where Kₙ 2色塗りにKrまたはKs単色存在', 'R(3,3) = 6', 'R(4,4) = 18'],
        examples: ['パーティー問題', 'ファン・デル・ヴェルデンの定理', 'ヘイルズ・ジュエットの定理'],
        applications: ['組合せ論', '計算機科学', '論理学']
      }
    },
    latex: 'R(r,s) = \\min\\{n : K_n \\to K_r \\text{ or } K_s\\}',
    relations: {
      prerequisites: ['graph-theory', 'pigeonhole-principle'],
      nextTopics: ['extremal-graph-theory'],
      related: ['probabilistic-method'],
      applications: ['theoretical-cs', 'logic']
    },
    tags: ['램지', 'Ramsey', '극값', 'extremal']
  },
  {
    id: 'partition-theory',
    name: {
      ko: '분할 이론',
      en: 'Partition Theory',
      ja: '分割理論'
    },
    field: 'combinatorics',
    subfield: 'enumeration',
    difficulty: 4,
    content: {
      ko: {
        definition: '양의 정수를 양의 정수들의 합으로 나타내는 방법을 연구',
        formulas: ['p(n): n의 분할수', 'Σp(n)xⁿ = ∏1/(1-xᵏ)', '오일러 항등식', '하디-라마누잔 점근식'],
        examples: ['p(5) = 7: 5=4+1=3+2=3+1+1=...', '영 다이어그램'],
        applications: ['정수론', '표현론', '물리학']
      },
      en: {
        definition: 'Study of ways to represent positive integers as sums of positive integers',
        formulas: ['p(n): partition number of n', 'Σp(n)xⁿ = ∏1/(1-xᵏ)', 'Euler identities', 'Hardy-Ramanujan asymptotic'],
        examples: ['p(5) = 7: 5=4+1=3+2=3+1+1=...', 'Young diagrams'],
        applications: ['Number theory', 'Representation theory', 'Physics']
      },
      ja: {
        definition: '正の整数を正の整数の和として表す方法を研究',
        formulas: ['p(n): nの分割数', 'Σp(n)xⁿ = ∏1/(1-xᵏ)', 'オイラー恒等式', 'ハーディ・ラマヌジャン漸近式'],
        examples: ['p(5) = 7: 5=4+1=3+2=3+1+1=...', 'ヤング図形'],
        applications: ['整数論', '表現論', '物理学']
      }
    },
    latex: '\\sum_{n=0}^{\\infty} p(n)x^n = \\prod_{k=1}^{\\infty} \\frac{1}{1-x^k}',
    relations: {
      prerequisites: ['generating-functions', 'number-theory'],
      nextTopics: ['young-tableaux'],
      related: ['modular-forms'],
      applications: ['representation-theory', 'physics']
    },
    tags: ['분할', 'partition', '정수', 'integer']
  },
  {
    id: 'mobius-inversion',
    name: {
      ko: '뫼비우스 반전',
      en: 'Möbius Inversion',
      ja: 'メビウス反転'
    },
    field: 'combinatorics',
    subfield: 'enumeration',
    difficulty: 4,
    content: {
      ko: {
        definition: '포셋(부분순서집합)에서 함수들 사이의 반전 공식',
        formulas: ['g(n) = Σf(d) ⟹ f(n) = Σμ(n/d)g(d)', '뫼비우스 함수: μ(1)=1, μ(소수곱)=(-1)^k', '포셋: g = f*ζ ⟹ f = g*μ'],
        examples: ['오일러 토션트 함수', '포함-배제 원리'],
        applications: ['정수론', '조합론', '암호학']
      },
      en: {
        definition: 'Inversion formula between functions on posets (partially ordered sets)',
        formulas: ['g(n) = Σf(d) ⟹ f(n) = Σμ(n/d)g(d)', 'Möbius function: μ(1)=1, μ(squarefree)=(-1)^k', 'Poset: g = f*ζ ⟹ f = g*μ'],
        examples: ['Euler totient function', 'Inclusion-exclusion principle'],
        applications: ['Number theory', 'Combinatorics', 'Cryptography']
      },
      ja: {
        definition: 'ポセット（半順序集合）上の関数間の反転公式',
        formulas: ['g(n) = Σf(d) ⟹ f(n) = Σμ(n/d)g(d)', 'メビウス関数: μ(1)=1, μ(無平方)=(-1)^k', 'ポセット: g = f*ζ ⟹ f = g*μ'],
        examples: ['オイラーのトーシェント関数', '包除原理'],
        applications: ['整数論', '組合せ論', '暗号学']
      }
    },
    latex: 'f(n) = \\sum_{d|n} \\mu(n/d) g(d)',
    relations: {
      prerequisites: ['divisibility', 'poset'],
      nextTopics: ['analytic-number-theory'],
      related: ['inclusion-exclusion'],
      applications: ['number-theory', 'combinatorics']
    },
    tags: ['뫼비우스', 'Möbius', '반전', 'inversion']
  },
  {
    id: 'probabilistic-method',
    name: {
      ko: '확률적 방법',
      en: 'Probabilistic Method',
      ja: '確率的方法'
    },
    field: 'combinatorics',
    subfield: 'techniques',
    difficulty: 5,
    content: {
      ko: {
        definition: '확률 논증을 사용하여 조합 구조의 존재를 증명하는 방법',
        formulas: ['P(A) > 0 ⟹ A 원소 존재', '기댓값 논증: E[X] > 0 ⟹ X > 0인 경우 존재', '로바스 국소 보조정리'],
        examples: ['램지 수 하계', '색칠 수', '완전 매칭'],
        applications: ['그래프 이론', '조합 최적화', '알고리즘']
      },
      en: {
        definition: 'Method using probabilistic arguments to prove existence of combinatorial structures',
        formulas: ['P(A) > 0 ⟹ element of A exists', 'Expectation: E[X] > 0 ⟹ case with X > 0 exists', 'Lovász Local Lemma'],
        examples: ['Ramsey number bounds', 'Chromatic numbers', 'Perfect matchings'],
        applications: ['Graph theory', 'Combinatorial optimization', 'Algorithms']
      },
      ja: {
        definition: '確率的議論を使って組合せ構造の存在を証明する方法',
        formulas: ['P(A) > 0 ⟹ Aの元が存在', '期待値論証: E[X] > 0 ⟹ X > 0の場合が存在', 'ロバスの局所補題'],
        examples: ['ラムゼー数の下界', '彩色数', '完全マッチング'],
        applications: ['グラフ理論', '組合せ最適化', 'アルゴリズム']
      }
    },
    latex: 'P(A) > 0 \\Rightarrow \\exists x \\in A',
    relations: {
      prerequisites: ['probability', 'expectation'],
      nextTopics: ['derandomization'],
      related: ['ramsey-theory'],
      applications: ['existence-proofs', 'algorithms']
    },
    tags: ['확률적방법', 'probabilistic', 'Erdős', 'existence']
  }
];
