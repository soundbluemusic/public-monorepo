/**
 * @fileoverview 수학 소분류 정의 - 완전한 구조
 */
import type { MathSubfield } from "./types";

export const subfields: MathSubfield[] = [
  // ============================================
  // 1. 기초 수학 Foundations
  // ============================================
  {
    id: "arithmetic",
    parentField: "foundations",
    name: { ko: "산술", en: "Arithmetic", ja: "算術" },
    description: {
      ko: "자연수, 정수, 유리수, 무리수, 실수, 사칙연산, 거듭제곱, 제곱근, 소수, GCD/LCM",
      en: "Natural numbers, integers, rationals, irrationals, reals, operations, powers, roots, primes, GCD/LCM",
      ja: "自然数、整数、有理数、無理数、実数、四則演算、べき乗、平方根、素数、GCD/LCM",
    },
    order: 1,
  },
  {
    id: "fractions-ratios",
    parentField: "foundations",
    name: { ko: "분수와 비율", en: "Fractions & Ratios", ja: "分数と比" },
    description: {
      ko: "분수, 소수, 백분율, 비, 비례",
      en: "Fractions, decimals, percentages, ratios, proportions",
      ja: "分数、小数、百分率、比、比例",
    },
    order: 2,
  },
  {
    id: "number-systems",
    parentField: "foundations",
    name: { ko: "수 체계", en: "Number Systems", ja: "数体系" },
    description: {
      ko: "이진법, 8진법, 16진법, 복소수",
      en: "Binary, octal, hexadecimal, complex numbers",
      ja: "二進法、八進法、十六進法、複素数",
    },
    order: 3,
  },

  // ============================================
  // 2. 대수학 Algebra
  // ============================================
  {
    id: "elementary-algebra",
    parentField: "algebra",
    name: { ko: "기초 대수", en: "Elementary Algebra", ja: "初等代数" },
    description: {
      ko: "변수, 다항식, 인수분해, 방정식, 부등식, 연립방정식",
      en: "Variables, polynomials, factoring, equations, inequalities, systems",
      ja: "変数、多項式、因数分解、方程式、不等式、連立方程式",
    },
    order: 1,
  },
  {
    id: "advanced-algebra",
    parentField: "algebra",
    name: { ko: "고급 대수", en: "Advanced Algebra", ja: "上級代数" },
    description: {
      ko: "지수함수, 로그함수, 수열, 급수, 점화식",
      en: "Exponential, logarithmic functions, sequences, series, recurrences",
      ja: "指数関数、対数関数、数列、級数、漸化式",
    },
    order: 2,
  },
  {
    id: "abstract-algebra",
    parentField: "algebra",
    name: { ko: "추상대수", en: "Abstract Algebra", ja: "抽象代数" },
    description: {
      ko: "군론, 환론, 체론, 갈루아 이론",
      en: "Group theory, ring theory, field theory, Galois theory",
      ja: "群論、環論、体論、ガロア理論",
    },
    order: 3,
  },
  {
    id: "boolean-algebra",
    parentField: "algebra",
    name: { ko: "부울대수", en: "Boolean Algebra", ja: "ブール代数" },
    description: {
      ko: "논리연산, 논리회로, 드모르간 법칙",
      en: "Logical operations, logic circuits, De Morgan's laws",
      ja: "論理演算、論理回路、ド・モルガンの法則",
    },
    order: 4,
  },
  {
    id: "representation-theory",
    parentField: "algebra",
    name: { ko: "표현론", en: "Representation Theory", ja: "表現論" },
    description: {
      ko: "군의 표현, 캐릭터 이론",
      en: "Group representations, character theory",
      ja: "群の表現、指標理論",
    },
    order: 5,
  },
  {
    id: "homological-algebra",
    parentField: "algebra",
    name: { ko: "호몰로지 대수", en: "Homological Algebra", ja: "ホモロジー代数" },
    description: {
      ko: "사슬 복합체, Ext, Tor",
      en: "Chain complexes, Ext, Tor functors",
      ja: "鎖複体、Ext、Tor",
    },
    order: 6,
  },

  // ============================================
  // 3. 기하학 Geometry
  // ============================================
  {
    id: "plane-geometry",
    parentField: "geometry",
    name: { ko: "평면기하", en: "Plane Geometry", ja: "平面幾何" },
    description: {
      ko: "점/선/면, 각도, 삼각형, 사각형, 원, 합동/닮음",
      en: "Points/lines/planes, angles, triangles, quadrilaterals, circles, congruence/similarity",
      ja: "点/線/面、角度、三角形、四角形、円、合同/相似",
    },
    order: 1,
  },
  {
    id: "solid-geometry",
    parentField: "geometry",
    name: { ko: "입체기하", en: "Solid Geometry", ja: "立体幾何" },
    description: {
      ko: "다면체, 원기둥, 원뿔, 구, 부피, 겉넓이",
      en: "Polyhedra, cylinders, cones, spheres, volume, surface area",
      ja: "多面体、円柱、円錐、球、体積、表面積",
    },
    order: 2,
  },
  {
    id: "analytic-geometry",
    parentField: "geometry",
    name: { ko: "해석기하", en: "Analytic Geometry", ja: "解析幾何" },
    description: {
      ko: "좌표계, 직선, 원, 원뿔곡선",
      en: "Coordinate systems, lines, circles, conic sections",
      ja: "座標系、直線、円、円錐曲線",
    },
    order: 3,
  },
  {
    id: "non-euclidean",
    parentField: "geometry",
    name: { ko: "비유클리드 기하", en: "Non-Euclidean Geometry", ja: "非ユークリッド幾何" },
    description: {
      ko: "구면기하, 쌍곡기하",
      en: "Spherical geometry, hyperbolic geometry",
      ja: "球面幾何、双曲幾何",
    },
    order: 4,
  },
  {
    id: "differential-geometry",
    parentField: "geometry",
    name: { ko: "미분기하", en: "Differential Geometry", ja: "微分幾何" },
    description: {
      ko: "곡선론, 곡면론, 다양체",
      en: "Curve theory, surface theory, manifolds",
      ja: "曲線論、曲面論、多様体",
    },
    order: 5,
  },
  {
    id: "riemannian-geometry",
    parentField: "geometry",
    name: { ko: "리만기하", en: "Riemannian Geometry", ja: "リーマン幾何" },
    description: {
      ko: "리만 계량, 측지선, 곡률",
      en: "Riemannian metric, geodesics, curvature",
      ja: "リーマン計量、測地線、曲率",
    },
    order: 6,
  },
  {
    id: "symplectic-geometry",
    parentField: "geometry",
    name: { ko: "심플렉틱 기하", en: "Symplectic Geometry", ja: "シンプレクティック幾何" },
    description: {
      ko: "심플렉틱 다양체, 해밀턴 역학",
      en: "Symplectic manifolds, Hamiltonian mechanics",
      ja: "シンプレクティック多様体、ハミルトン力学",
    },
    order: 7,
  },
  {
    id: "algebraic-geometry",
    parentField: "geometry",
    name: { ko: "대수기하", en: "Algebraic Geometry", ja: "代数幾何" },
    description: {
      ko: "대수적 다양체, 스킴",
      en: "Algebraic varieties, schemes",
      ja: "代数多様体、スキーム",
    },
    order: 8,
  },
  {
    id: "projective-geometry",
    parentField: "geometry",
    name: { ko: "사영기하", en: "Projective Geometry", ja: "射影幾何" },
    description: {
      ko: "사영 평면, 무한원점, 원근법",
      en: "Projective plane, points at infinity, perspective",
      ja: "射影平面、無限遠点、遠近法",
    },
    order: 9,
  },

  // ============================================
  // 4. 삼각법 Trigonometry
  // ============================================
  {
    id: "basic-trig",
    parentField: "trigonometry",
    name: { ko: "기초 삼각함수", en: "Basic Trigonometry", ja: "基礎三角関数" },
    description: {
      ko: "sin, cos, tan, csc, sec, cot, 단위원, 호도법",
      en: "sin, cos, tan, csc, sec, cot, unit circle, radians",
      ja: "sin, cos, tan, csc, sec, cot, 単位円、弧度法",
    },
    order: 1,
  },
  {
    id: "trig-applications",
    parentField: "trigonometry",
    name: { ko: "삼각함수 응용", en: "Trigonometric Applications", ja: "三角関数応用" },
    description: {
      ko: "그래프, 항등식, 방정식, 법칙",
      en: "Graphs, identities, equations, laws",
      ja: "グラフ、恒等式、方程式、法則",
    },
    order: 2,
  },
  {
    id: "inverse-trig",
    parentField: "trigonometry",
    name: { ko: "역삼각함수", en: "Inverse Trigonometry", ja: "逆三角関数" },
    description: {
      ko: "arcsin, arccos, arctan",
      en: "arcsin, arccos, arctan",
      ja: "arcsin, arccos, arctan",
    },
    order: 3,
  },
  {
    id: "hyperbolic-trig",
    parentField: "trigonometry",
    name: { ko: "쌍곡선함수", en: "Hyperbolic Functions", ja: "双曲線関数" },
    description: {
      ko: "sinh, cosh, tanh",
      en: "sinh, cosh, tanh",
      ja: "sinh, cosh, tanh",
    },
    order: 4,
  },

  // ============================================
  // 5. 해석학 Analysis
  // ============================================
  {
    id: "limits-continuity",
    parentField: "analysis",
    name: { ko: "극한과 연속", en: "Limits & Continuity", ja: "極限と連続" },
    description: {
      ko: "극한의 정의, 연속함수, ε-δ 논법",
      en: "Limit definitions, continuous functions, ε-δ proofs",
      ja: "極限の定義、連続関数、ε-δ論法",
    },
    order: 1,
  },
  {
    id: "differentiation",
    parentField: "analysis",
    name: { ko: "미분", en: "Differentiation", ja: "微分" },
    description: {
      ko: "도함수, 미분 규칙, 편미분, 응용",
      en: "Derivatives, rules, partial derivatives, applications",
      ja: "導関数、微分法則、偏微分、応用",
    },
    order: 2,
  },
  {
    id: "integration",
    parentField: "analysis",
    name: { ko: "적분", en: "Integration", ja: "積分" },
    description: {
      ko: "부정적분, 정적분, 적분 기법, 다중적분",
      en: "Indefinite, definite integrals, techniques, multiple integrals",
      ja: "不定積分、定積分、積分技法、重積分",
    },
    order: 3,
  },
  {
    id: "differential-equations",
    parentField: "analysis",
    name: { ko: "미분방정식", en: "Differential Equations", ja: "微分方程式" },
    description: {
      ko: "상미분방정식(ODE), 편미분방정식(PDE)",
      en: "Ordinary DEs (ODE), Partial DEs (PDE)",
      ja: "常微分方程式、偏微分方程式",
    },
    order: 4,
  },
  {
    id: "real-analysis",
    parentField: "analysis",
    name: { ko: "실해석학", en: "Real Analysis", ja: "実解析" },
    description: {
      ko: "수열, 급수, 측도론",
      en: "Sequences, series, measure theory",
      ja: "数列、級数、測度論",
    },
    order: 5,
  },
  {
    id: "complex-analysis",
    parentField: "analysis",
    name: { ko: "복소해석학", en: "Complex Analysis", ja: "複素解析" },
    description: {
      ko: "해석함수, 유수정리, 등각사상",
      en: "Analytic functions, residue theorem, conformal mappings",
      ja: "解析関数、留数定理、等角写像",
    },
    order: 6,
  },
  {
    id: "functional-analysis",
    parentField: "analysis",
    name: { ko: "함수해석학", en: "Functional Analysis", ja: "関数解析" },
    description: {
      ko: "바나흐 공간, 힐베르트 공간",
      en: "Banach spaces, Hilbert spaces",
      ja: "バナッハ空間、ヒルベルト空間",
    },
    order: 7,
  },
  {
    id: "harmonic-analysis",
    parentField: "analysis",
    name: { ko: "조화해석학", en: "Harmonic Analysis", ja: "調和解析" },
    description: {
      ko: "푸리에 해석, 푸리에 변환",
      en: "Fourier analysis, Fourier transform",
      ja: "フーリエ解析、フーリエ変換",
    },
    order: 8,
  },
  {
    id: "calculus-variations",
    parentField: "analysis",
    name: { ko: "변분법", en: "Calculus of Variations", ja: "変分法" },
    description: {
      ko: "오일러-라그랑주 방정식, 최적화",
      en: "Euler-Lagrange equations, optimization",
      ja: "オイラー・ラグランジュ方程式、最適化",
    },
    order: 9,
  },
  {
    id: "tensor-analysis",
    parentField: "analysis",
    name: { ko: "텐서해석", en: "Tensor Analysis", ja: "テンソル解析" },
    description: {
      ko: "텐서, 상대성이론, 연속체역학",
      en: "Tensors, relativity, continuum mechanics",
      ja: "テンソル、相対性理論、連続体力学",
    },
    order: 10,
  },

  // ============================================
  // 6. 선형대수 Linear Algebra
  // ============================================
  {
    id: "vectors",
    parentField: "linear-algebra",
    name: { ko: "벡터", en: "Vectors", ja: "ベクトル" },
    description: {
      ko: "벡터 연산, 내적, 외적, 정사영",
      en: "Vector operations, dot product, cross product, projection",
      ja: "ベクトル演算、内積、外積、射影",
    },
    order: 1,
  },
  {
    id: "matrices",
    parentField: "linear-algebra",
    name: { ko: "행렬", en: "Matrices", ja: "行列" },
    description: {
      ko: "행렬 연산, 행렬식, 역행렬, 고유값",
      en: "Matrix operations, determinants, inverse, eigenvalues",
      ja: "行列演算、行列式、逆行列、固有値",
    },
    order: 2,
  },
  {
    id: "linear-transformations",
    parentField: "linear-algebra",
    name: { ko: "선형변환", en: "Linear Transformations", ja: "線形変換" },
    description: {
      ko: "회전, 크기변환, 기저변환",
      en: "Rotation, scaling, change of basis",
      ja: "回転、拡大縮小、基底変換",
    },
    order: 3,
  },
  {
    id: "vector-spaces",
    parentField: "linear-algebra",
    name: { ko: "벡터공간", en: "Vector Spaces", ja: "ベクトル空間" },
    description: {
      ko: "부분공간, 기저, 차원",
      en: "Subspaces, basis, dimension",
      ja: "部分空間、基底、次元",
    },
    order: 4,
  },
  {
    id: "inner-product-spaces",
    parentField: "linear-algebra",
    name: { ko: "내적공간", en: "Inner Product Spaces", ja: "内積空間" },
    description: {
      ko: "내적, 직교성, 그람-슈미트",
      en: "Inner products, orthogonality, Gram-Schmidt",
      ja: "内積、直交性、グラム・シュミット",
    },
    order: 5,
  },

  // ============================================
  // 7. 확률/통계 Probability & Statistics
  // ============================================
  {
    id: "probability-theory",
    parentField: "probability",
    name: { ko: "확률", en: "Probability", ja: "確率" },
    description: {
      ko: "기본, 조건부, 분포, 기대값, 분산",
      en: "Basic, conditional, distributions, expected value, variance",
      ja: "基本、条件付き、分布、期待値、分散",
    },
    order: 1,
  },
  {
    id: "statistics",
    parentField: "probability",
    name: { ko: "통계", en: "Statistics", ja: "統計" },
    description: {
      ko: "기술통계, 추론통계, 가설검정, 회귀분석",
      en: "Descriptive, inferential, hypothesis testing, regression",
      ja: "記述統計、推測統計、仮説検定、回帰分析",
    },
    order: 2,
  },
  {
    id: "stochastic-processes",
    parentField: "probability",
    name: { ko: "확률과정", en: "Stochastic Processes", ja: "確率過程" },
    description: {
      ko: "마르코프 연쇄, 브라운 운동",
      en: "Markov chains, Brownian motion",
      ja: "マルコフ連鎖、ブラウン運動",
    },
    order: 3,
  },
  {
    id: "bayesian-statistics",
    parentField: "probability",
    name: { ko: "베이즈 통계", en: "Bayesian Statistics", ja: "ベイズ統計" },
    description: {
      ko: "사전확률, 사후확률, 베이즈 추론",
      en: "Prior, posterior, Bayesian inference",
      ja: "事前確率、事後確率、ベイズ推論",
    },
    order: 4,
  },
  {
    id: "queueing-theory",
    parentField: "probability",
    name: { ko: "큐잉이론", en: "Queueing Theory", ja: "待ち行列理論" },
    description: {
      ko: "대기열 모델, 네트워크",
      en: "Queue models, networks",
      ja: "待ち行列モデル、ネットワーク",
    },
    order: 5,
  },
  {
    id: "information-theory",
    parentField: "probability",
    name: { ko: "정보이론", en: "Information Theory", ja: "情報理論" },
    description: {
      ko: "엔트로피, 채널용량, 부호화",
      en: "Entropy, channel capacity, coding",
      ja: "エントロピー、チャネル容量、符号化",
    },
    order: 6,
  },

  // ============================================
  // 8. 이산수학 Discrete Mathematics
  // ============================================
  {
    id: "logic",
    parentField: "discrete",
    name: { ko: "논리학", en: "Logic", ja: "論理学" },
    description: {
      ko: "명제, 술어, 증명법",
      en: "Propositions, predicates, proof methods",
      ja: "命題、述語、証明法",
    },
    order: 1,
  },
  {
    id: "set-theory",
    parentField: "discrete",
    name: { ko: "집합론", en: "Set Theory", ja: "集合論" },
    description: {
      ko: "집합 연산, 벤 다이어그램, 공리적 집합론",
      en: "Set operations, Venn diagrams, axiomatic set theory",
      ja: "集合演算、ベン図、公理的集合論",
    },
    order: 2,
  },
  {
    id: "combinatorics",
    parentField: "discrete",
    name: { ko: "조합론", en: "Combinatorics", ja: "組合せ論" },
    description: {
      ko: "순열, 조합, 이항정리, 생성함수",
      en: "Permutations, combinations, binomial theorem, generating functions",
      ja: "順列、組合せ、二項定理、母関数",
    },
    order: 3,
  },
  {
    id: "graph-theory",
    parentField: "discrete",
    name: { ko: "그래프이론", en: "Graph Theory", ja: "グラフ理論" },
    description: {
      ko: "그래프, 트리, 최단경로, 네트워크 플로우",
      en: "Graphs, trees, shortest paths, network flow",
      ja: "グラフ、木、最短経路、ネットワークフロー",
    },
    order: 4,
  },
  {
    id: "order-theory",
    parentField: "discrete",
    name: { ko: "순서론", en: "Order Theory", ja: "順序論" },
    description: {
      ko: "부분순서, 격자",
      en: "Partial orders, lattices",
      ja: "半順序、束",
    },
    order: 5,
  },
  {
    id: "lattice-theory",
    parentField: "discrete",
    name: { ko: "격자이론", en: "Lattice Theory", ja: "束論" },
    description: {
      ko: "격자, 분배격자, 불 대수",
      en: "Lattices, distributive lattices, Boolean algebras",
      ja: "束、分配束、ブール代数",
    },
    order: 6,
  },

  // ============================================
  // 9. 수론 Number Theory
  // ============================================
  {
    id: "elementary-number-theory",
    parentField: "number-theory",
    name: { ko: "초등 수론", en: "Elementary Number Theory", ja: "初等整数論" },
    description: {
      ko: "약수, 합동식, 페르마 소정리",
      en: "Divisibility, congruences, Fermat's little theorem",
      ja: "約数、合同式、フェルマーの小定理",
    },
    order: 1,
  },
  {
    id: "algebraic-number-theory",
    parentField: "number-theory",
    name: { ko: "대수적 수론", en: "Algebraic Number Theory", ja: "代数的整数論" },
    description: {
      ko: "대수적 정수, 이데알",
      en: "Algebraic integers, ideals",
      ja: "代数的整数、イデアル",
    },
    order: 2,
  },
  {
    id: "analytic-number-theory",
    parentField: "number-theory",
    name: { ko: "해석적 수론", en: "Analytic Number Theory", ja: "解析的整数論" },
    description: {
      ko: "소수 분포, 리만 가설",
      en: "Prime distribution, Riemann hypothesis",
      ja: "素数の分布、リーマン予想",
    },
    order: 3,
  },
  {
    id: "combinatorial-number-theory",
    parentField: "number-theory",
    name: { ko: "조합적 수론", en: "Combinatorial Number Theory", ja: "組合せ論的整数論" },
    description: {
      ko: "덧셈 조합론, 에르되시-짐머만",
      en: "Additive combinatorics, Erdős problems",
      ja: "加法的組合せ論、エルデシュ問題",
    },
    order: 4,
  },
  {
    id: "cryptographic-number-theory",
    parentField: "number-theory",
    name: { ko: "암호학 수론", en: "Cryptographic Number Theory", ja: "暗号論的整数論" },
    description: {
      ko: "RSA, 타원곡선 암호",
      en: "RSA, elliptic curve cryptography",
      ja: "RSA、楕円曲線暗号",
    },
    order: 5,
  },

  // ============================================
  // 10. 위상수학 Topology
  // ============================================
  {
    id: "general-topology",
    parentField: "topology",
    name: { ko: "일반위상", en: "General Topology", ja: "一般位相" },
    description: {
      ko: "열린집합, 연속, 컴팩트",
      en: "Open sets, continuity, compactness",
      ja: "開集合、連続、コンパクト",
    },
    order: 1,
  },
  {
    id: "algebraic-topology",
    parentField: "topology",
    name: { ko: "대수적 위상", en: "Algebraic Topology", ja: "代数的位相" },
    description: {
      ko: "기본군, 호몰로지, 호모토피",
      en: "Fundamental group, homology, homotopy",
      ja: "基本群、ホモロジー、ホモトピー",
    },
    order: 2,
  },
  {
    id: "differential-topology",
    parentField: "topology",
    name: { ko: "미분위상", en: "Differential Topology", ja: "微分位相" },
    description: {
      ko: "다양체, 미분구조",
      en: "Manifolds, differential structures",
      ja: "多様体、微分構造",
    },
    order: 3,
  },
  {
    id: "knot-theory",
    parentField: "topology",
    name: { ko: "매듭이론", en: "Knot Theory", ja: "結び目理論" },
    description: {
      ko: "매듭, 링크, 불변량",
      en: "Knots, links, invariants",
      ja: "結び目、絡み目、不変量",
    },
    order: 4,
  },

  // ============================================
  // 11. 수리논리/기초론 Logic & Foundations
  // ============================================
  {
    id: "model-theory",
    parentField: "logic",
    name: { ko: "모델이론", en: "Model Theory", ja: "モデル理論" },
    description: {
      ko: "구조, 이론, 완전성",
      en: "Structures, theories, completeness",
      ja: "構造、理論、完全性",
    },
    order: 1,
  },
  {
    id: "proof-theory",
    parentField: "logic",
    name: { ko: "증명이론", en: "Proof Theory", ja: "証明論" },
    description: {
      ko: "형식체계, 컷제거",
      en: "Formal systems, cut elimination",
      ja: "形式体系、カット除去",
    },
    order: 2,
  },
  {
    id: "computability",
    parentField: "logic",
    name: { ko: "계산이론", en: "Computability Theory", ja: "計算理論" },
    description: {
      ko: "튜링기계, 정지문제, 결정가능성",
      en: "Turing machines, halting problem, decidability",
      ja: "チューリング機械、停止問題、決定可能性",
    },
    order: 3,
  },
  {
    id: "category-theory",
    parentField: "logic",
    name: { ko: "범주론", en: "Category Theory", ja: "圏論" },
    description: {
      ko: "범주, 함자, 자연변환",
      en: "Categories, functors, natural transformations",
      ja: "圏、関手、自然変換",
    },
    order: 4,
  },
  {
    id: "axiomatic-set-theory",
    parentField: "logic",
    name: { ko: "공리적 집합론", en: "Axiomatic Set Theory", ja: "公理的集合論" },
    description: {
      ko: "ZFC, 선택공리, 연속체 가설",
      en: "ZFC, axiom of choice, continuum hypothesis",
      ja: "ZFC、選択公理、連続体仮説",
    },
    order: 5,
  },

  // ============================================
  // 12. 동역학/카오스 Dynamics & Chaos
  // ============================================
  {
    id: "dynamical-systems",
    parentField: "dynamics",
    name: { ko: "동역학계", en: "Dynamical Systems", ja: "力学系" },
    description: {
      ko: "고정점, 안정성, 분기",
      en: "Fixed points, stability, bifurcation",
      ja: "固定点、安定性、分岐",
    },
    order: 1,
  },
  {
    id: "chaos-theory",
    parentField: "dynamics",
    name: { ko: "카오스이론", en: "Chaos Theory", ja: "カオス理論" },
    description: {
      ko: "나비효과, 끌개, 리아푸노프 지수",
      en: "Butterfly effect, attractors, Lyapunov exponents",
      ja: "バタフライ効果、アトラクタ、リアプノフ指数",
    },
    order: 2,
  },
  {
    id: "fractals",
    parentField: "dynamics",
    name: { ko: "프랙탈", en: "Fractals", ja: "フラクタル" },
    description: {
      ko: "만델브로, 자기유사성, 프랙탈 차원",
      en: "Mandelbrot set, self-similarity, fractal dimension",
      ja: "マンデルブロ集合、自己相似性、フラクタル次元",
    },
    order: 3,
  },
  {
    id: "ergodic-theory",
    parentField: "dynamics",
    name: { ko: "에르고딕 이론", en: "Ergodic Theory", ja: "エルゴード理論" },
    description: {
      ko: "에르고딕 정리, 측도 보존",
      en: "Ergodic theorem, measure preservation",
      ja: "エルゴード定理、測度保存",
    },
    order: 4,
  },

  // ============================================
  // 13. 최적화 Optimization
  // ============================================
  {
    id: "linear-programming",
    parentField: "optimization",
    name: { ko: "선형계획법", en: "Linear Programming", ja: "線形計画法" },
    description: {
      ko: "심플렉스법, 쌍대성",
      en: "Simplex method, duality",
      ja: "シンプレックス法、双対性",
    },
    order: 1,
  },
  {
    id: "nonlinear-optimization",
    parentField: "optimization",
    name: { ko: "비선형최적화", en: "Nonlinear Optimization", ja: "非線形最適化" },
    description: {
      ko: "경사하강법, 뉴턴법",
      en: "Gradient descent, Newton's method",
      ja: "勾配降下法、ニュートン法",
    },
    order: 2,
  },
  {
    id: "convex-optimization",
    parentField: "optimization",
    name: { ko: "볼록최적화", en: "Convex Optimization", ja: "凸最適化" },
    description: {
      ko: "볼록함수, KKT 조건",
      en: "Convex functions, KKT conditions",
      ja: "凸関数、KKT条件",
    },
    order: 3,
  },
  {
    id: "integer-programming",
    parentField: "optimization",
    name: { ko: "정수계획법", en: "Integer Programming", ja: "整数計画法" },
    description: {
      ko: "분기한정법, 절단평면",
      en: "Branch and bound, cutting planes",
      ja: "分枝限定法、切除平面",
    },
    order: 4,
  },
  {
    id: "dynamic-programming",
    parentField: "optimization",
    name: { ko: "동적계획법", en: "Dynamic Programming", ja: "動的計画法" },
    description: {
      ko: "벨만 방정식, 최적 부분구조",
      en: "Bellman equation, optimal substructure",
      ja: "ベルマン方程式、最適部分構造",
    },
    order: 5,
  },

  // ============================================
  // 14. 수치해석 Numerical Analysis
  // ============================================
  {
    id: "error-analysis",
    parentField: "numerical",
    name: { ko: "오차해석", en: "Error Analysis", ja: "誤差解析" },
    description: {
      ko: "반올림 오차, 절단 오차, 안정성",
      en: "Rounding error, truncation error, stability",
      ja: "丸め誤差、打ち切り誤差、安定性",
    },
    order: 1,
  },
  {
    id: "interpolation",
    parentField: "numerical",
    name: { ko: "보간법", en: "Interpolation", ja: "補間法" },
    description: {
      ko: "라그랑주, 뉴턴, 스플라인",
      en: "Lagrange, Newton, spline interpolation",
      ja: "ラグランジュ、ニュートン、スプライン",
    },
    order: 2,
  },
  {
    id: "numerical-integration",
    parentField: "numerical",
    name: { ko: "수치적분", en: "Numerical Integration", ja: "数値積分" },
    description: {
      ko: "사다리꼴, 심프슨, 가우스",
      en: "Trapezoidal, Simpson's, Gaussian quadrature",
      ja: "台形則、シンプソン則、ガウス求積",
    },
    order: 3,
  },
  {
    id: "numerical-de",
    parentField: "numerical",
    name: { ko: "수치 미분방정식", en: "Numerical DEs", ja: "数値微分方程式" },
    description: {
      ko: "오일러법, 룽게-쿠타",
      en: "Euler method, Runge-Kutta",
      ja: "オイラー法、ルンゲ・クッタ",
    },
    order: 4,
  },
  {
    id: "numerical-linear-algebra",
    parentField: "numerical",
    name: { ko: "수치 선형대수", en: "Numerical Linear Algebra", ja: "数値線形代数" },
    description: {
      ko: "LU분해, QR분해, SVD",
      en: "LU decomposition, QR decomposition, SVD",
      ja: "LU分解、QR分解、SVD",
    },
    order: 5,
  },

  // ============================================
  // 15. 응용수학 Applied Mathematics
  // ============================================
  {
    id: "finance-math",
    parentField: "applied",
    name: { ko: "금융수학", en: "Financial Mathematics", ja: "金融数学" },
    description: {
      ko: "복리, 이동평균, 볼린저, 일목균형표, 피보나치, 블랙숄즈",
      en: "Compound interest, moving averages, Bollinger, Ichimoku, Fibonacci, Black-Scholes",
      ja: "複利、移動平均、ボリンジャー、一目均衡表、フィボナッチ、ブラック・ショールズ",
    },
    order: 1,
  },
  {
    id: "music-math",
    parentField: "applied",
    name: { ko: "음악수학", en: "Mathematics of Music", ja: "音楽の数学" },
    description: {
      ko: "주파수비, 12평균율, 박자, 화성학",
      en: "Frequency ratios, 12-TET, rhythm, harmony",
      ja: "周波数比、12平均律、拍子、和声学",
    },
    order: 2,
  },
  {
    id: "physics-math",
    parentField: "applied",
    name: { ko: "물리수학", en: "Mathematical Physics", ja: "物理数学" },
    description: {
      ko: "운동학, 파동, 전자기, 양자, 상대성",
      en: "Kinematics, waves, electromagnetism, quantum, relativity",
      ja: "運動学、波動、電磁気、量子、相対性",
    },
    order: 3,
  },
  {
    id: "cs-math",
    parentField: "applied",
    name: { ko: "컴퓨터과학 수학", en: "CS Mathematics", ja: "CS数学" },
    description: {
      ko: "Big-O, 암호학, 그래픽, ML, 압축",
      en: "Big-O, cryptography, graphics, ML, compression",
      ja: "Big-O、暗号、グラフィックス、ML、圧縮",
    },
    order: 4,
  },
  {
    id: "engineering-math",
    parentField: "applied",
    name: { ko: "공학수학", en: "Engineering Mathematics", ja: "工学数学" },
    description: {
      ko: "구조역학, 신호처리, 제어이론",
      en: "Structural mechanics, signal processing, control theory",
      ja: "構造力学、信号処理、制御理論",
    },
    order: 5,
  },
  {
    id: "biomed-math",
    parentField: "applied",
    name: { ko: "생물/의학 수학", en: "Biomedical Mathematics", ja: "生物医学数学" },
    description: {
      ko: "성장모델, 역학, 의료통계",
      en: "Growth models, epidemiology, medical statistics",
      ja: "成長モデル、疫学、医療統計",
    },
    order: 6,
  },
  {
    id: "economics-math",
    parentField: "applied",
    name: { ko: "경제학 수학", en: "Mathematical Economics", ja: "数理経済学" },
    description: {
      ko: "수요공급, 게임이론, 최적화",
      en: "Supply/demand, game theory, optimization",
      ja: "需要供給、ゲーム理論、最適化",
    },
    order: 7,
  },
  {
    id: "art-math",
    parentField: "applied",
    name: { ko: "예술/건축 수학", en: "Art & Architecture Math", ja: "芸術建築数学" },
    description: {
      ko: "황금비, 원근법, 테셀레이션",
      en: "Golden ratio, perspective, tessellation",
      ja: "黄金比、遠近法、テセレーション",
    },
    order: 8,
  },
  {
    id: "natural-sciences-math",
    parentField: "applied",
    name: { ko: "자연과학 수학", en: "Natural Sciences Math", ja: "自然科学数学" },
    description: {
      ko: "천문, 기상, 지질",
      en: "Astronomy, meteorology, geology",
      ja: "天文、気象、地質",
    },
    order: 9,
  },
  {
    id: "daily-life-math",
    parentField: "applied",
    name: { ko: "일상생활 수학", en: "Everyday Mathematics", ja: "日常の数学" },
    description: {
      ko: "요리, 쇼핑, 스포츠, 게임",
      en: "Cooking, shopping, sports, games",
      ja: "料理、買い物、スポーツ、ゲーム",
    },
    order: 10,
  },

  // ============================================
  // 16. 수학 상수 Constants
  // ============================================
  {
    id: "fundamental-constants",
    parentField: "constants",
    name: { ko: "기본 상수", en: "Fundamental Constants", ja: "基本定数" },
    description: {
      ko: "π, e, φ, √2, γ, i",
      en: "π, e, φ, √2, γ, i",
      ja: "π, e, φ, √2, γ, i",
    },
    order: 1,
  },
  {
    id: "physics-constants",
    parentField: "constants",
    name: { ko: "물리 상수", en: "Physical Constants", ja: "物理定数" },
    description: {
      ko: "δ, ε₀, ℏ, c, G",
      en: "δ, ε₀, ℏ, c, G",
      ja: "δ, ε₀, ℏ, c, G",
    },
    order: 2,
  },

  // ============================================
  // 17. 수학 기호 Symbols
  // ============================================
  {
    id: "arithmetic-symbols",
    parentField: "symbols",
    name: { ko: "연산 기호", en: "Arithmetic Symbols", ja: "演算記号" },
    description: {
      ko: "+, −, ×, ÷, =, ≠, <, >, ≤, ≥",
      en: "+, −, ×, ÷, =, ≠, <, >, ≤, ≥",
      ja: "+, −, ×, ÷, =, ≠, <, >, ≤, ≥",
    },
    order: 1,
  },
  {
    id: "set-symbols",
    parentField: "symbols",
    name: { ko: "집합 기호", en: "Set Symbols", ja: "集合記号" },
    description: {
      ko: "∈, ∉, ⊂, ⊃, ∪, ∩, ∅",
      en: "∈, ∉, ⊂, ⊃, ∪, ∩, ∅",
      ja: "∈, ∉, ⊂, ⊃, ∪, ∩, ∅",
    },
    order: 2,
  },
  {
    id: "logic-symbols",
    parentField: "symbols",
    name: { ko: "논리 기호", en: "Logic Symbols", ja: "論理記号" },
    description: {
      ko: "∧, ∨, ¬, →, ↔, ∀, ∃",
      en: "∧, ∨, ¬, →, ↔, ∀, ∃",
      ja: "∧, ∨, ¬, →, ↔, ∀, ∃",
    },
    order: 3,
  },
  {
    id: "greek-letters",
    parentField: "symbols",
    name: { ko: "그리스 문자", en: "Greek Letters", ja: "ギリシャ文字" },
    description: {
      ko: "α, β, γ, δ, ε, θ, λ, μ, π, σ, φ, ω",
      en: "α, β, γ, δ, ε, θ, λ, μ, π, σ, φ, ω",
      ja: "α, β, γ, δ, ε, θ, λ, μ, π, σ, φ, ω",
    },
    order: 4,
  },
  {
    id: "calculus-symbols",
    parentField: "symbols",
    name: { ko: "미적분 기호", en: "Calculus Symbols", ja: "微積分記号" },
    description: {
      ko: "∂, ∫, ∮, ∞, lim, ∇, Σ, Π",
      en: "∂, ∫, ∮, ∞, lim, ∇, Σ, Π",
      ja: "∂, ∫, ∮, ∞, lim, ∇, Σ, Π",
    },
    order: 5,
  },

  // ============================================
  // 18. 유명 정리 Famous Theorems
  // ============================================
  {
    id: "calculus-theorems",
    parentField: "theorems",
    name: { ko: "미적분 정리", en: "Calculus Theorems", ja: "微積分の定理" },
    description: {
      ko: "미적분기본정리, 평균값정리, 테일러정리",
      en: "FTC, Mean Value, Taylor's theorem",
      ja: "微積分学の基本定理、平均値定理、テイラー定理",
    },
    order: 1,
  },
  {
    id: "algebra-theorems",
    parentField: "theorems",
    name: { ko: "대수 정리", en: "Algebra Theorems", ja: "代数の定理" },
    description: {
      ko: "대수학기본정리, 갈루아정리",
      en: "FTA, Galois theory",
      ja: "代数学の基本定理、ガロア理論",
    },
    order: 2,
  },
  {
    id: "number-theory-theorems",
    parentField: "theorems",
    name: { ko: "수론 정리", en: "Number Theory Theorems", ja: "整数論の定理" },
    description: {
      ko: "페르마정리, 오일러정리, 중국인나머지정리",
      en: "Fermat's theorems, Euler's theorem, CRT",
      ja: "フェルマーの定理、オイラーの定理、中国剰余定理",
    },
    order: 3,
  },
  {
    id: "geometry-theorems",
    parentField: "theorems",
    name: { ko: "기하 정리", en: "Geometry Theorems", ja: "幾何の定理" },
    description: {
      ko: "피타고라스정리, 스토크스정리",
      en: "Pythagorean theorem, Stokes' theorem",
      ja: "ピタゴラスの定理、ストークスの定理",
    },
    order: 4,
  },
  {
    id: "probability-theorems",
    parentField: "theorems",
    name: { ko: "확률 정리", en: "Probability Theorems", ja: "確率の定理" },
    description: {
      ko: "중심극한정리, 큰수의법칙",
      en: "CLT, Law of Large Numbers",
      ja: "中心極限定理、大数の法則",
    },
    order: 5,
  },
  {
    id: "logic-theorems",
    parentField: "theorems",
    name: { ko: "논리 정리", en: "Logic Theorems", ja: "論理の定理" },
    description: {
      ko: "괴델불완전성정리, 정지문제",
      en: "Gödel incompleteness, Halting problem",
      ja: "ゲーデル不完全性定理、停止問題",
    },
    order: 6,
  },
  {
    id: "applied-theorems",
    parentField: "theorems",
    name: { ko: "응용 정리", en: "Applied Theorems", ja: "応用の定理" },
    description: {
      ko: "내쉬균형, 노이만-모겐슈테른",
      en: "Nash equilibrium, von Neumann-Morgenstern",
      ja: "ナッシュ均衡、フォン・ノイマン＝モルゲンシュテルン",
    },
    order: 7,
  },
];

/** 부모 분야로 소분류 찾기 */
export function getSubfieldsByParent(parentField: string): MathSubfield[] {
  return subfields.filter((s) => s.parentField === parentField).sort((a, b) => a.order - b.order);
}

/** ID로 소분류 찾기 */
export function getSubfieldById(id: string): MathSubfield | undefined {
  return subfields.find((s) => s.id === id);
}
