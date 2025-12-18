/**
 * @fileoverview 수학 소분류 정의
 */
import type { MathSubfield } from "./types";

export const subfields: MathSubfield[] = [
  // ============================================
  // 1. 기초 수학 Foundations
  // ============================================
  {
    id: "arithmetic",
    parentField: "foundations",
    name: { ko: "산술", en: "Arithmetic" },
    description: {
      ko: "자연수, 정수, 유리수, 사칙연산, 거듭제곱, 제곱근",
      en: "Natural numbers, integers, rationals, basic operations",
    },
    order: 1,
  },
  {
    id: "fractions-ratios",
    parentField: "foundations",
    name: { ko: "분수와 비율", en: "Fractions & Ratios" },
    description: {
      ko: "분수, 소수, 백분율, 비, 비례",
      en: "Fractions, decimals, percentages, ratios, proportions",
    },
    order: 2,
  },
  {
    id: "number-systems",
    parentField: "foundations",
    name: { ko: "수 체계", en: "Number Systems" },
    description: {
      ko: "이진법, 8진법, 16진법, 복소수",
      en: "Binary, octal, hexadecimal, complex numbers",
    },
    order: 3,
  },

  // ============================================
  // 2. 대수학 Algebra
  // ============================================
  {
    id: "elementary-algebra",
    parentField: "algebra",
    name: { ko: "기초 대수", en: "Elementary Algebra" },
    description: {
      ko: "변수, 다항식, 인수분해, 방정식, 부등식, 연립방정식",
      en: "Variables, polynomials, factoring, equations, inequalities, systems",
    },
    order: 1,
  },
  {
    id: "advanced-algebra",
    parentField: "algebra",
    name: { ko: "고급 대수", en: "Advanced Algebra" },
    description: {
      ko: "지수함수, 로그함수, 수열, 급수, 점화식",
      en: "Exponential, logarithmic functions, sequences, series, recurrence",
    },
    order: 2,
  },
  {
    id: "abstract-algebra",
    parentField: "algebra",
    name: { ko: "추상대수", en: "Abstract Algebra" },
    description: {
      ko: "군론, 환론, 체론, 갈루아 이론",
      en: "Group theory, ring theory, field theory, Galois theory",
    },
    order: 3,
  },
  {
    id: "boolean-algebra",
    parentField: "algebra",
    name: { ko: "부울대수", en: "Boolean Algebra" },
    description: {
      ko: "논리 연산, 논리 게이트, 논리회로",
      en: "Logical operations, logic gates, digital circuits",
    },
    order: 4,
  },
  {
    id: "representation-theory",
    parentField: "algebra",
    name: { ko: "표현론", en: "Representation Theory" },
    description: {
      ko: "군의 표현, 리 대수, 물리학 응용",
      en: "Group representations, Lie algebras, physics applications",
    },
    order: 5,
  },
  {
    id: "homological-algebra",
    parentField: "algebra",
    name: { ko: "호몰로지 대수", en: "Homological Algebra" },
    description: {
      ko: "사슬 복체, 호몰로지, 범주론 응용",
      en: "Chain complexes, homology, category theory applications",
    },
    order: 6,
  },

  // ============================================
  // 3. 기하학 Geometry
  // ============================================
  {
    id: "plane-geometry",
    parentField: "geometry",
    name: { ko: "평면기하", en: "Plane Geometry" },
    description: {
      ko: "점, 선, 면, 각도, 삼각형, 사각형, 원, 합동, 닮음",
      en: "Points, lines, planes, angles, triangles, quadrilaterals, circles, congruence, similarity",
    },
    order: 1,
  },
  {
    id: "solid-geometry",
    parentField: "geometry",
    name: { ko: "입체기하", en: "Solid Geometry" },
    description: {
      ko: "다면체, 원기둥, 원뿔, 구, 부피, 겉넓이",
      en: "Polyhedra, cylinders, cones, spheres, volume, surface area",
    },
    order: 2,
  },
  {
    id: "analytic-geometry",
    parentField: "geometry",
    name: { ko: "해석기하", en: "Analytic Geometry" },
    description: {
      ko: "좌표계, 직선, 원, 원뿔곡선",
      en: "Coordinate systems, lines, circles, conic sections",
    },
    order: 3,
  },
  {
    id: "non-euclidean-geometry",
    parentField: "geometry",
    name: { ko: "비유클리드 기하", en: "Non-Euclidean Geometry" },
    description: {
      ko: "구면기하, 쌍곡기하, 평행선 공준",
      en: "Spherical geometry, hyperbolic geometry, parallel postulate",
    },
    order: 4,
  },
  {
    id: "differential-geometry",
    parentField: "geometry",
    name: { ko: "미분기하", en: "Differential Geometry" },
    description: {
      ko: "곡선론, 곡면론, 다양체",
      en: "Curve theory, surface theory, manifolds",
    },
    order: 5,
  },
  {
    id: "riemannian-geometry",
    parentField: "geometry",
    name: { ko: "리만기하", en: "Riemannian Geometry" },
    description: {
      ko: "리만 계량, 측지선, 곡률, 상대성이론 응용",
      en: "Riemannian metric, geodesics, curvature, relativity applications",
    },
    order: 6,
  },
  {
    id: "symplectic-geometry",
    parentField: "geometry",
    name: { ko: "심플렉틱 기하", en: "Symplectic Geometry" },
    description: {
      ko: "심플렉틱 다양체, 해밀턴 역학, 고전역학 응용",
      en: "Symplectic manifolds, Hamiltonian mechanics, classical mechanics",
    },
    order: 7,
  },
  {
    id: "algebraic-geometry",
    parentField: "geometry",
    name: { ko: "대수기하", en: "Algebraic Geometry" },
    description: {
      ko: "대수적 다양체, 스킴, 정수론 응용",
      en: "Algebraic varieties, schemes, number theory applications",
    },
    order: 8,
  },
  {
    id: "projective-geometry",
    parentField: "geometry",
    name: { ko: "사영기하", en: "Projective Geometry" },
    description: {
      ko: "사영 공간, 동차좌표, 원근법",
      en: "Projective spaces, homogeneous coordinates, perspective",
    },
    order: 9,
  },

  // ============================================
  // 4. 삼각법 Trigonometry
  // ============================================
  {
    id: "basic-trigonometry",
    parentField: "trigonometry",
    name: { ko: "기초 삼각함수", en: "Basic Trigonometry" },
    description: {
      ko: "sin, cos, tan, csc, sec, cot, 단위원, 호도법",
      en: "sin, cos, tan, csc, sec, cot, unit circle, radians",
    },
    order: 1,
  },
  {
    id: "trigonometric-applications",
    parentField: "trigonometry",
    name: { ko: "삼각함수 응용", en: "Trigonometric Applications" },
    description: {
      ko: "그래프, 항등식, 방정식, 사인/코사인 법칙",
      en: "Graphs, identities, equations, law of sines/cosines",
    },
    order: 2,
  },
  {
    id: "inverse-trigonometry",
    parentField: "trigonometry",
    name: { ko: "역삼각함수", en: "Inverse Trigonometry" },
    description: {
      ko: "arcsin, arccos, arctan, 역함수의 정의역과 치역",
      en: "arcsin, arccos, arctan, domain and range of inverse functions",
    },
    order: 3,
  },
  {
    id: "hyperbolic-functions",
    parentField: "trigonometry",
    name: { ko: "쌍곡선함수", en: "Hyperbolic Functions" },
    description: {
      ko: "sinh, cosh, tanh, 쌍곡선 항등식",
      en: "sinh, cosh, tanh, hyperbolic identities",
    },
    order: 4,
  },

  // ============================================
  // 5. 해석학 Analysis
  // ============================================
  {
    id: "limits-continuity",
    parentField: "analysis",
    name: { ko: "극한과 연속", en: "Limits & Continuity" },
    description: {
      ko: "극한의 정의, 연속함수, ε-δ 논법",
      en: "Limit definitions, continuous functions, ε-δ proofs",
    },
    order: 1,
  },
  {
    id: "differentiation",
    parentField: "analysis",
    name: { ko: "미분", en: "Differentiation" },
    description: {
      ko: "도함수, 미분 규칙, 편미분, 응용",
      en: "Derivatives, rules, partial derivatives, applications",
    },
    order: 2,
  },
  {
    id: "integration",
    parentField: "analysis",
    name: { ko: "적분", en: "Integration" },
    description: {
      ko: "부정적분, 정적분, 적분 기법, 다중적분",
      en: "Indefinite, definite integrals, techniques, multiple integrals",
    },
    order: 3,
  },
  {
    id: "differential-equations",
    parentField: "analysis",
    name: { ko: "미분방정식", en: "Differential Equations" },
    description: {
      ko: "상미분방정식(ODE), 편미분방정식(PDE), 해법",
      en: "Ordinary differential equations (ODE), partial differential equations (PDE), solutions",
    },
    order: 4,
  },
  {
    id: "real-analysis",
    parentField: "analysis",
    name: { ko: "실해석학", en: "Real Analysis" },
    description: {
      ko: "수열, 급수, 측도론, 르베그 적분",
      en: "Sequences, series, measure theory, Lebesgue integration",
    },
    order: 5,
  },
  {
    id: "complex-analysis",
    parentField: "analysis",
    name: { ko: "복소해석학", en: "Complex Analysis" },
    description: {
      ko: "해석함수, 코시 정리, 유수정리, 등각사상",
      en: "Analytic functions, Cauchy theorem, residue theorem, conformal mapping",
    },
    order: 6,
  },
  {
    id: "functional-analysis",
    parentField: "analysis",
    name: { ko: "함수해석학", en: "Functional Analysis" },
    description: {
      ko: "바나흐 공간, 힐베르트 공간, 작용소 이론",
      en: "Banach spaces, Hilbert spaces, operator theory",
    },
    order: 7,
  },
  {
    id: "harmonic-analysis",
    parentField: "analysis",
    name: { ko: "조화해석학", en: "Harmonic Analysis" },
    description: {
      ko: "푸리에 급수, 푸리에 변환, 웨이블릿",
      en: "Fourier series, Fourier transform, wavelets",
    },
    order: 8,
  },
  {
    id: "calculus-of-variations",
    parentField: "analysis",
    name: { ko: "변분법", en: "Calculus of Variations" },
    description: {
      ko: "오일러-라그랑주 방정식, 최적화 응용",
      en: "Euler-Lagrange equation, optimization applications",
    },
    order: 9,
  },
  {
    id: "tensor-analysis",
    parentField: "analysis",
    name: { ko: "텐서해석", en: "Tensor Analysis" },
    description: {
      ko: "텐서 대수, 텐서 미적분, 상대성이론, 연속체역학",
      en: "Tensor algebra, tensor calculus, relativity, continuum mechanics",
    },
    order: 10,
  },

  // ============================================
  // 6. 선형대수 Linear Algebra
  // ============================================
  {
    id: "vectors",
    parentField: "linear-algebra",
    name: { ko: "벡터", en: "Vectors" },
    description: {
      ko: "벡터 연산, 내적, 외적, 정사영",
      en: "Vector operations, dot product, cross product, projection",
    },
    order: 1,
  },
  {
    id: "matrices",
    parentField: "linear-algebra",
    name: { ko: "행렬", en: "Matrices" },
    description: {
      ko: "행렬 연산, 행렬식, 역행렬, 고유값",
      en: "Matrix operations, determinants, inverse, eigenvalues",
    },
    order: 2,
  },
  {
    id: "linear-transformations",
    parentField: "linear-algebra",
    name: { ko: "선형변환", en: "Linear Transformations" },
    description: {
      ko: "회전, 크기변환, 전단, 기저변환",
      en: "Rotation, scaling, shearing, change of basis",
    },
    order: 3,
  },
  {
    id: "vector-spaces",
    parentField: "linear-algebra",
    name: { ko: "벡터공간", en: "Vector Spaces" },
    description: {
      ko: "부분공간, 기저, 차원, 직합",
      en: "Subspaces, basis, dimension, direct sum",
    },
    order: 4,
  },
  {
    id: "inner-product-spaces",
    parentField: "linear-algebra",
    name: { ko: "내적공간", en: "Inner Product Spaces" },
    description: {
      ko: "내적, 노름, 직교성, 함수해석학 연결",
      en: "Inner products, norms, orthogonality, functional analysis connection",
    },
    order: 5,
  },

  // ============================================
  // 7. 확률/통계 Probability & Statistics
  // ============================================
  {
    id: "probability-basics",
    parentField: "probability",
    name: { ko: "확률", en: "Probability" },
    description: {
      ko: "기본 확률, 조건부 확률, 분포, 기대값, 분산",
      en: "Basic probability, conditional, distributions, expected value, variance",
    },
    order: 1,
  },
  {
    id: "statistics-basics",
    parentField: "probability",
    name: { ko: "통계", en: "Statistics" },
    description: {
      ko: "기술통계, 추론통계, 가설검정, 회귀분석",
      en: "Descriptive, inferential statistics, hypothesis testing, regression",
    },
    order: 2,
  },
  {
    id: "stochastic-processes",
    parentField: "probability",
    name: { ko: "확률과정", en: "Stochastic Processes" },
    description: {
      ko: "마르코프 체인, 브라운 운동, 포아송 과정",
      en: "Markov chains, Brownian motion, Poisson processes",
    },
    order: 3,
  },
  {
    id: "bayesian-statistics",
    parentField: "probability",
    name: { ko: "베이즈 통계", en: "Bayesian Statistics" },
    description: {
      ko: "베이즈 정리, 사전/사후 확률, MCMC",
      en: "Bayes theorem, prior/posterior probability, MCMC",
    },
    order: 4,
  },
  {
    id: "queueing-theory",
    parentField: "probability",
    name: { ko: "큐잉이론", en: "Queueing Theory" },
    description: {
      ko: "대기행렬 모델, 네트워크 트래픽, 서비스 시스템",
      en: "Queue models, network traffic, service systems",
    },
    order: 5,
  },
  {
    id: "information-theory",
    parentField: "probability",
    name: { ko: "정보이론", en: "Information Theory" },
    description: {
      ko: "엔트로피, 상호정보량, 채널용량, 데이터 압축",
      en: "Entropy, mutual information, channel capacity, data compression",
    },
    order: 6,
  },

  // ============================================
  // 8. 이산수학 Discrete Math
  // ============================================
  {
    id: "logic",
    parentField: "discrete",
    name: { ko: "논리학", en: "Logic" },
    description: {
      ko: "명제, 술어, 증명법",
      en: "Propositions, predicates, proof methods",
    },
    order: 1,
  },
  {
    id: "set-theory",
    parentField: "discrete",
    name: { ko: "집합론", en: "Set Theory" },
    description: {
      ko: "집합 연산, 벤 다이어그램, 공리적 집합론",
      en: "Set operations, Venn diagrams, axiomatic set theory",
    },
    order: 2,
  },
  {
    id: "combinatorics",
    parentField: "discrete",
    name: { ko: "조합론", en: "Combinatorics" },
    description: {
      ko: "순열, 조합, 이항정리, 생성함수",
      en: "Permutations, combinations, binomial theorem, generating functions",
    },
    order: 3,
  },
  {
    id: "graph-theory",
    parentField: "discrete",
    name: { ko: "그래프이론", en: "Graph Theory" },
    description: {
      ko: "그래프, 트리, 최단경로, 네트워크 플로우",
      en: "Graphs, trees, shortest paths, network flow",
    },
    order: 4,
  },
  {
    id: "order-theory",
    parentField: "discrete",
    name: { ko: "순서론", en: "Order Theory" },
    description: {
      ko: "부분순서, 전순서, 격자, 최소/최대 원소",
      en: "Partial orders, total orders, lattices, min/max elements",
    },
    order: 5,
  },
  {
    id: "lattice-theory",
    parentField: "discrete",
    name: { ko: "격자이론", en: "Lattice Theory" },
    description: {
      ko: "격자 구조, 분배 격자, 불 격자, 추상대수 연결",
      en: "Lattice structures, distributive lattices, Boolean lattices, abstract algebra",
    },
    order: 6,
  },

  // ============================================
  // 9. 수론 Number Theory
  // ============================================
  {
    id: "elementary-number-theory",
    parentField: "number-theory",
    name: { ko: "초등 수론", en: "Elementary Number Theory" },
    description: {
      ko: "약수, 합동식, 페르마 소정리, 오일러 정리",
      en: "Divisibility, congruences, Fermat's little theorem, Euler's theorem",
    },
    order: 1,
  },
  {
    id: "algebraic-number-theory",
    parentField: "number-theory",
    name: { ko: "대수적 수론", en: "Algebraic Number Theory" },
    description: {
      ko: "대수적 정수, 이데알, 유수, 클래스 필드론",
      en: "Algebraic integers, ideals, class numbers, class field theory",
    },
    order: 2,
  },
  {
    id: "analytic-number-theory",
    parentField: "number-theory",
    name: { ko: "해석적 수론", en: "Analytic Number Theory" },
    description: {
      ko: "소수 분포, 리만 제타 함수, 리만 가설",
      en: "Prime distribution, Riemann zeta function, Riemann hypothesis",
    },
    order: 3,
  },
  {
    id: "combinatorial-number-theory",
    parentField: "number-theory",
    name: { ko: "조합적 수론", en: "Combinatorial Number Theory" },
    description: {
      ko: "램지 이론, 덧셈 조합론, 분할",
      en: "Ramsey theory, additive combinatorics, partitions",
    },
    order: 4,
  },
  {
    id: "cryptographic-number-theory",
    parentField: "number-theory",
    name: { ko: "암호학 수론", en: "Cryptographic Number Theory" },
    description: {
      ko: "RSA, 타원곡선 암호, 이산로그 문제",
      en: "RSA, elliptic curve cryptography, discrete logarithm problem",
    },
    order: 5,
  },

  // ============================================
  // 10. 위상수학 Topology
  // ============================================
  {
    id: "general-topology",
    parentField: "topology",
    name: { ko: "일반위상", en: "General Topology" },
    description: {
      ko: "열린집합, 연속, 컴팩트, 연결성",
      en: "Open sets, continuity, compactness, connectedness",
    },
    order: 1,
  },
  {
    id: "algebraic-topology",
    parentField: "topology",
    name: { ko: "대수적 위상", en: "Algebraic Topology" },
    description: {
      ko: "기본군, 호몰로지, 호모토피, 특성류",
      en: "Fundamental group, homology, homotopy, characteristic classes",
    },
    order: 2,
  },
  {
    id: "differential-topology",
    parentField: "topology",
    name: { ko: "미분위상", en: "Differential Topology" },
    description: {
      ko: "매끄러운 다양체, 모스 이론, 코보디즘",
      en: "Smooth manifolds, Morse theory, cobordism",
    },
    order: 3,
  },
  {
    id: "knot-theory",
    parentField: "topology",
    name: { ko: "매듭이론", en: "Knot Theory" },
    description: {
      ko: "매듭 불변량, 링크, 브레이드 군",
      en: "Knot invariants, links, braid groups",
    },
    order: 4,
  },

  // ============================================
  // 11. 수리논리/기초론 Mathematical Logic
  // ============================================
  {
    id: "model-theory",
    parentField: "logic",
    name: { ko: "모델이론", en: "Model Theory" },
    description: {
      ko: "구조, 이론, 완전성, 범주성",
      en: "Structures, theories, completeness, categoricity",
    },
    order: 1,
  },
  {
    id: "proof-theory",
    parentField: "logic",
    name: { ko: "증명이론", en: "Proof Theory" },
    description: {
      ko: "형식 체계, 순차 미적분, 정규화",
      en: "Formal systems, sequent calculus, normalization",
    },
    order: 2,
  },
  {
    id: "computability-theory",
    parentField: "logic",
    name: { ko: "계산이론", en: "Computability Theory" },
    description: {
      ko: "튜링기계, 정지문제, 결정가능성, 복잡도",
      en: "Turing machines, halting problem, decidability, complexity",
    },
    order: 3,
  },
  {
    id: "category-theory",
    parentField: "logic",
    name: { ko: "범주론", en: "Category Theory" },
    description: {
      ko: "범주, 함자, 자연변환, 수반",
      en: "Categories, functors, natural transformations, adjoints",
    },
    order: 4,
  },
  {
    id: "axiomatic-set-theory",
    parentField: "logic",
    name: { ko: "공리적 집합론", en: "Axiomatic Set Theory" },
    description: {
      ko: "ZFC, 선택공리, 연속체 가설, 큰 기수",
      en: "ZFC, axiom of choice, continuum hypothesis, large cardinals",
    },
    order: 5,
  },

  // ============================================
  // 12. 동역학/카오스 Dynamics & Chaos
  // ============================================
  {
    id: "dynamical-systems",
    parentField: "dynamics",
    name: { ko: "동역학계", en: "Dynamical Systems" },
    description: {
      ko: "고정점, 안정성, 분기, 위상공간",
      en: "Fixed points, stability, bifurcation, phase space",
    },
    order: 1,
  },
  {
    id: "chaos-theory",
    parentField: "dynamics",
    name: { ko: "카오스이론", en: "Chaos Theory" },
    description: {
      ko: "나비효과, 끌개, 리아푸노프 지수",
      en: "Butterfly effect, attractors, Lyapunov exponents",
    },
    order: 2,
  },
  {
    id: "fractals",
    parentField: "dynamics",
    name: { ko: "프랙탈", en: "Fractals" },
    description: {
      ko: "만델브로 집합, 자기유사성, 프랙탈 차원",
      en: "Mandelbrot set, self-similarity, fractal dimension",
    },
    order: 3,
  },
  {
    id: "ergodic-theory",
    parentField: "dynamics",
    name: { ko: "에르고딕 이론", en: "Ergodic Theory" },
    description: {
      ko: "에르고딕 정리, 측도 보존 변환, 혼합",
      en: "Ergodic theorems, measure-preserving transformations, mixing",
    },
    order: 4,
  },

  // ============================================
  // 13. 최적화 Optimization
  // ============================================
  {
    id: "linear-programming",
    parentField: "optimization",
    name: { ko: "선형계획법", en: "Linear Programming" },
    description: {
      ko: "단체법, 쌍대성, 감도분석",
      en: "Simplex method, duality, sensitivity analysis",
    },
    order: 1,
  },
  {
    id: "nonlinear-optimization",
    parentField: "optimization",
    name: { ko: "비선형최적화", en: "Nonlinear Optimization" },
    description: {
      ko: "경사하강법, 뉴턴법, 제약조건 최적화",
      en: "Gradient descent, Newton's method, constrained optimization",
    },
    order: 2,
  },
  {
    id: "convex-optimization",
    parentField: "optimization",
    name: { ko: "볼록최적화", en: "Convex Optimization" },
    description: {
      ko: "볼록함수, KKT 조건, 내점법, 머신러닝 응용",
      en: "Convex functions, KKT conditions, interior point methods, ML applications",
    },
    order: 3,
  },
  {
    id: "integer-programming",
    parentField: "optimization",
    name: { ko: "정수계획법", en: "Integer Programming" },
    description: {
      ko: "분기한정법, 절단평면법, 혼합정수계획",
      en: "Branch and bound, cutting planes, mixed integer programming",
    },
    order: 4,
  },
  {
    id: "dynamic-programming",
    parentField: "optimization",
    name: { ko: "동적계획법", en: "Dynamic Programming" },
    description: {
      ko: "벨만 방정식, 메모이제이션, 알고리즘 응용",
      en: "Bellman equation, memoization, algorithm applications",
    },
    order: 5,
  },

  // ============================================
  // 14. 수치해석 Numerical Analysis
  // ============================================
  {
    id: "error-analysis",
    parentField: "numerical",
    name: { ko: "오차해석", en: "Error Analysis" },
    description: {
      ko: "반올림 오차, 절단 오차, 조건수",
      en: "Round-off error, truncation error, condition number",
    },
    order: 1,
  },
  {
    id: "interpolation",
    parentField: "numerical",
    name: { ko: "보간법", en: "Interpolation" },
    description: {
      ko: "다항식 보간, 스플라인, 라그랑주 보간",
      en: "Polynomial interpolation, splines, Lagrange interpolation",
    },
    order: 2,
  },
  {
    id: "numerical-integration",
    parentField: "numerical",
    name: { ko: "수치적분", en: "Numerical Integration" },
    description: {
      ko: "사다리꼴 공식, 심프슨 공식, 가우스 구적법",
      en: "Trapezoidal rule, Simpson's rule, Gaussian quadrature",
    },
    order: 3,
  },
  {
    id: "numerical-de",
    parentField: "numerical",
    name: { ko: "수치미분방정식", en: "Numerical Differential Equations" },
    description: {
      ko: "오일러법, 룽게-쿠타, 유한차분법, 유한요소법",
      en: "Euler method, Runge-Kutta, finite difference, finite element",
    },
    order: 4,
  },
  {
    id: "numerical-linear-algebra",
    parentField: "numerical",
    name: { ko: "수치선형대수", en: "Numerical Linear Algebra" },
    description: {
      ko: "LU분해, QR분해, SVD, 반복법",
      en: "LU decomposition, QR decomposition, SVD, iterative methods",
    },
    order: 5,
  },

  // ============================================
  // 15. 응용수학 Applied Math
  // ============================================
  {
    id: "applied-finance",
    parentField: "applied",
    name: { ko: "금융수학", en: "Financial Mathematics" },
    description: {
      ko: "복리, 이동평균, 볼린저, 일목균형표, 피보나치, 블랙숄즈",
      en: "Compound interest, moving averages, Bollinger, Ichimoku, Fibonacci, Black-Scholes",
    },
    order: 1,
  },
  {
    id: "applied-music",
    parentField: "applied",
    name: { ko: "음악수학", en: "Mathematics of Music" },
    description: {
      ko: "주파수비, 12평균율, 박자, 화성학",
      en: "Frequency ratios, 12-tone equal temperament, rhythm, harmony",
    },
    order: 2,
  },
  {
    id: "applied-physics",
    parentField: "applied",
    name: { ko: "물리수학", en: "Mathematical Physics" },
    description: {
      ko: "운동학, 파동, 전자기, 양자역학, 상대성이론",
      en: "Kinematics, waves, electromagnetism, quantum mechanics, relativity",
    },
    order: 3,
  },
  {
    id: "applied-cs",
    parentField: "applied",
    name: { ko: "컴퓨터과학 수학", en: "CS Mathematics" },
    description: {
      ko: "Big-O, 암호학, 컴퓨터 그래픽, 머신러닝, 압축",
      en: "Big-O, cryptography, computer graphics, machine learning, compression",
    },
    order: 4,
  },
  {
    id: "applied-engineering",
    parentField: "applied",
    name: { ko: "공학수학", en: "Engineering Mathematics" },
    description: {
      ko: "구조역학, 신호처리, 제어이론",
      en: "Structural mechanics, signal processing, control theory",
    },
    order: 5,
  },
  {
    id: "applied-biology",
    parentField: "applied",
    name: { ko: "생물/의학수학", en: "Bio/Medical Mathematics" },
    description: {
      ko: "성장모델, 역학, 의료통계, 유전학",
      en: "Growth models, epidemiology, medical statistics, genetics",
    },
    order: 6,
  },
  {
    id: "applied-economics",
    parentField: "applied",
    name: { ko: "경제수학", en: "Mathematical Economics" },
    description: {
      ko: "수요공급, 게임이론, 최적화, 균형이론",
      en: "Supply and demand, game theory, optimization, equilibrium theory",
    },
    order: 7,
  },
  {
    id: "applied-art",
    parentField: "applied",
    name: { ko: "예술/건축수학", en: "Art & Architecture Mathematics" },
    description: {
      ko: "황금비, 원근법, 테셀레이션, 대칭",
      en: "Golden ratio, perspective, tessellation, symmetry",
    },
    order: 8,
  },
  {
    id: "applied-natural-sciences",
    parentField: "applied",
    name: { ko: "자연과학수학", en: "Natural Sciences Mathematics" },
    description: {
      ko: "천문학, 기상학, 지질학, 해양학",
      en: "Astronomy, meteorology, geology, oceanography",
    },
    order: 9,
  },
  {
    id: "applied-daily-life",
    parentField: "applied",
    name: { ko: "일상생활수학", en: "Everyday Mathematics" },
    description: {
      ko: "요리, 쇼핑, 스포츠, 게임",
      en: "Cooking, shopping, sports, games",
    },
    order: 10,
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
