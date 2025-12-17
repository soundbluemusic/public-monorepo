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
    name: { ko: "산술", en: "Arithmetic", ja: "算術" },
    description: {
      ko: "자연수, 정수, 유리수, 사칙연산, 거듭제곱, 제곱근",
      en: "Natural numbers, integers, rationals, basic operations",
      ja: "自然数、整数、有理数、四則演算",
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
      ko: "변수, 다항식, 인수분해, 방정식, 부등식",
      en: "Variables, polynomials, factoring, equations, inequalities",
      ja: "変数、多項式、因数分解、方程式、不等式",
    },
    order: 1,
  },
  {
    id: "advanced-algebra",
    parentField: "algebra",
    name: { ko: "고급 대수", en: "Advanced Algebra", ja: "上級代数" },
    description: {
      ko: "지수함수, 로그함수, 수열, 급수",
      en: "Exponential, logarithmic functions, sequences, series",
      ja: "指数関数、対数関数、数列、級数",
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

  // ============================================
  // 3. 기하학 Geometry
  // ============================================
  {
    id: "plane-geometry",
    parentField: "geometry",
    name: { ko: "평면기하", en: "Plane Geometry", ja: "平面幾何" },
    description: {
      ko: "점, 선, 면, 각도, 삼각형, 사각형, 원",
      en: "Points, lines, planes, angles, triangles, quadrilaterals, circles",
      ja: "点、線、面、角度、三角形、四角形、円",
    },
    order: 1,
  },
  {
    id: "solid-geometry",
    parentField: "geometry",
    name: { ko: "입체기하", en: "Solid Geometry", ja: "立体幾何" },
    description: {
      ko: "다면체, 원기둥, 원뿔, 구, 부피",
      en: "Polyhedra, cylinders, cones, spheres, volume",
      ja: "多面体、円柱、円錐、球、体積",
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

  // ============================================
  // 4. 삼각법 Trigonometry
  // ============================================
  {
    id: "basic-trigonometry",
    parentField: "trigonometry",
    name: { ko: "기초 삼각함수", en: "Basic Trigonometry", ja: "基礎三角関数" },
    description: {
      ko: "sin, cos, tan, 단위원, 호도법",
      en: "sin, cos, tan, unit circle, radians",
      ja: "sin, cos, tan, 単位円、弧度法",
    },
    order: 1,
  },
  {
    id: "trigonometric-applications",
    parentField: "trigonometry",
    name: { ko: "삼각함수 응용", en: "Trigonometric Applications", ja: "三角関数応用" },
    description: {
      ko: "그래프, 항등식, 방정식, 법칙",
      en: "Graphs, identities, equations, laws",
      ja: "グラフ、恒等式、方程式、法則",
    },
    order: 2,
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

  // ============================================
  // 7. 확률/통계 Probability & Statistics
  // ============================================
  {
    id: "probability-basics",
    parentField: "probability",
    name: { ko: "확률", en: "Probability", ja: "確率" },
    description: {
      ko: "기본 확률, 조건부 확률, 분포, 기대값",
      en: "Basic probability, conditional, distributions, expected value",
      ja: "基本確率、条件付き確率、分布、期待値",
    },
    order: 1,
  },
  {
    id: "statistics-basics",
    parentField: "probability",
    name: { ko: "통계", en: "Statistics", ja: "統計" },
    description: {
      ko: "기술통계, 추론통계, 가설검정, 회귀분석",
      en: "Descriptive, inferential statistics, hypothesis testing, regression",
      ja: "記述統計、推測統計、仮説検定、回帰分析",
    },
    order: 2,
  },

  // ============================================
  // 8. 이산수학 Discrete Math
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
      ko: "집합 연산, 벤 다이어그램",
      en: "Set operations, Venn diagrams",
      ja: "集合演算、ベン図",
    },
    order: 2,
  },
  {
    id: "combinatorics",
    parentField: "discrete",
    name: { ko: "조합론", en: "Combinatorics", ja: "組合せ論" },
    description: {
      ko: "순열, 조합, 이항정리",
      en: "Permutations, combinations, binomial theorem",
      ja: "順列、組合せ、二項定理",
    },
    order: 3,
  },
  {
    id: "graph-theory",
    parentField: "discrete",
    name: { ko: "그래프이론", en: "Graph Theory", ja: "グラフ理論" },
    description: {
      ko: "그래프, 트리, 최단경로",
      en: "Graphs, trees, shortest paths",
      ja: "グラフ、木、最短経路",
    },
    order: 4,
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
