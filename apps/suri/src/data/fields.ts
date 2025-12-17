/**
 * @fileoverview 수학 18개 대분류 정의
 */
import type { MathFieldInfo, MathField } from "./types";

export const fields: MathFieldInfo[] = [
  {
    id: "foundations",
    name: {
      ko: "기초 수학",
      en: "Foundations",
      ja: "基礎数学",
    },
    description: {
      ko: "산술, 분수, 비율, 수 체계 등 수학의 기본 개념",
      en: "Basic concepts including arithmetic, fractions, ratios, and number systems",
      ja: "算術、分数、比、数体系などの基本概念",
    },
    icon: "📐",
    color: "var(--field-foundations)",
    order: 1,
  },
  {
    id: "algebra",
    name: {
      ko: "대수학",
      en: "Algebra",
      ja: "代数学",
    },
    description: {
      ko: "변수, 방정식, 다항식, 추상대수 등",
      en: "Variables, equations, polynomials, abstract algebra",
      ja: "変数、方程式、多項式、抽象代数など",
    },
    icon: "🔢",
    color: "var(--field-algebra)",
    order: 2,
  },
  {
    id: "geometry",
    name: {
      ko: "기하학",
      en: "Geometry",
      ja: "幾何学",
    },
    description: {
      ko: "평면기하, 입체기하, 해석기하, 미분기하 등",
      en: "Plane, solid, analytic, and differential geometry",
      ja: "平面幾何、立体幾何、解析幾何、微分幾何など",
    },
    icon: "📐",
    color: "var(--field-geometry)",
    order: 3,
  },
  {
    id: "trigonometry",
    name: {
      ko: "삼각법",
      en: "Trigonometry",
      ja: "三角法",
    },
    description: {
      ko: "삼각함수, 역삼각함수, 쌍곡선함수",
      en: "Trigonometric, inverse, and hyperbolic functions",
      ja: "三角関数、逆三角関数、双曲線関数",
    },
    icon: "📊",
    color: "var(--field-trigonometry)",
    order: 4,
  },
  {
    id: "analysis",
    name: {
      ko: "해석학",
      en: "Analysis",
      ja: "解析学",
    },
    description: {
      ko: "극한, 미분, 적분, 미분방정식, 복소해석",
      en: "Limits, differentiation, integration, differential equations",
      ja: "極限、微分、積分、微分方程式、複素解析",
    },
    icon: "∫",
    color: "var(--field-analysis)",
    order: 5,
  },
  {
    id: "linear-algebra",
    name: {
      ko: "선형대수",
      en: "Linear Algebra",
      ja: "線形代数",
    },
    description: {
      ko: "벡터, 행렬, 선형변환, 벡터공간",
      en: "Vectors, matrices, linear transformations, vector spaces",
      ja: "ベクトル、行列、線形変換、ベクトル空間",
    },
    icon: "⊗",
    color: "var(--field-linear-algebra)",
    order: 6,
  },
  {
    id: "probability",
    name: {
      ko: "확률/통계",
      en: "Probability & Statistics",
      ja: "確率・統計",
    },
    description: {
      ko: "확률, 통계, 확률과정, 베이즈 통계",
      en: "Probability, statistics, stochastic processes, Bayesian statistics",
      ja: "確率、統計、確率過程、ベイズ統計",
    },
    icon: "🎲",
    color: "var(--field-probability)",
    order: 7,
  },
  {
    id: "discrete",
    name: {
      ko: "이산수학",
      en: "Discrete Math",
      ja: "離散数学",
    },
    description: {
      ko: "논리학, 집합론, 조합론, 그래프이론",
      en: "Logic, set theory, combinatorics, graph theory",
      ja: "論理学、集合論、組合せ論、グラフ理論",
    },
    icon: "🔗",
    color: "var(--field-discrete)",
    order: 8,
  },
  {
    id: "number-theory",
    name: {
      ko: "수론",
      en: "Number Theory",
      ja: "数論",
    },
    description: {
      ko: "초등수론, 대수적 수론, 해석적 수론, 암호학",
      en: "Elementary, algebraic, analytic number theory, cryptography",
      ja: "初等整数論、代数的整数論、解析的整数論、暗号学",
    },
    icon: "🔢",
    color: "var(--field-number-theory)",
    order: 9,
  },
  {
    id: "topology",
    name: {
      ko: "위상수학",
      en: "Topology",
      ja: "位相数学",
    },
    description: {
      ko: "일반위상, 대수적 위상, 미분위상, 매듭이론",
      en: "General, algebraic, differential topology, knot theory",
      ja: "一般位相、代数的位相、微分位相、結び目理論",
    },
    icon: "🍩",
    color: "var(--field-topology)",
    order: 10,
  },
  {
    id: "logic",
    name: {
      ko: "수리논리",
      en: "Mathematical Logic",
      ja: "数理論理学",
    },
    description: {
      ko: "모델이론, 증명이론, 계산이론, 범주론",
      en: "Model theory, proof theory, computability, category theory",
      ja: "モデル理論、証明論、計算理論、圏論",
    },
    icon: "⊢",
    color: "var(--field-logic)",
    order: 11,
  },
  {
    id: "dynamics",
    name: {
      ko: "동역학/카오스",
      en: "Dynamics & Chaos",
      ja: "力学系・カオス",
    },
    description: {
      ko: "동역학계, 카오스이론, 프랙탈, 에르고딕 이론",
      en: "Dynamical systems, chaos theory, fractals, ergodic theory",
      ja: "力学系、カオス理論、フラクタル、エルゴード理論",
    },
    icon: "🌀",
    color: "var(--field-dynamics)",
    order: 12,
  },
  {
    id: "optimization",
    name: {
      ko: "최적화",
      en: "Optimization",
      ja: "最適化",
    },
    description: {
      ko: "선형계획법, 비선형최적화, 볼록최적화, 동적계획법",
      en: "Linear programming, nonlinear, convex optimization, dynamic programming",
      ja: "線形計画法、非線形最適化、凸最適化、動的計画法",
    },
    icon: "📈",
    color: "var(--field-optimization)",
    order: 13,
  },
  {
    id: "numerical",
    name: {
      ko: "수치해석",
      en: "Numerical Analysis",
      ja: "数値解析",
    },
    description: {
      ko: "오차해석, 보간법, 수치적분, 수치미분방정식",
      en: "Error analysis, interpolation, numerical integration, numerical DE",
      ja: "誤差解析、補間法、数値積分、数値微分方程式",
    },
    icon: "🖥️",
    color: "var(--field-numerical)",
    order: 14,
  },
  {
    id: "applied",
    name: {
      ko: "응용수학",
      en: "Applied Math",
      ja: "応用数学",
    },
    description: {
      ko: "금융, 물리, 컴퓨터과학, 공학, 생물 등 응용 분야",
      en: "Finance, physics, CS, engineering, biology applications",
      ja: "金融、物理、計算機科学、工学、生物などの応用分野",
    },
    icon: "🔬",
    color: "var(--field-applied)",
    order: 15,
  },
  {
    id: "constants",
    name: {
      ko: "수학 상수",
      en: "Constants",
      ja: "数学定数",
    },
    description: {
      ko: "π, e, φ, √2, γ, i 등 수학의 주요 상수",
      en: "Major mathematical constants: π, e, φ, √2, γ, i, etc.",
      ja: "π, e, φ, √2, γ, i などの数学定数",
    },
    icon: "π",
    color: "var(--field-constants)",
    order: 16,
  },
  {
    id: "symbols",
    name: {
      ko: "수학 기호",
      en: "Symbols",
      ja: "数学記号",
    },
    description: {
      ko: "연산, 집합, 논리, 미적분 기호 및 그리스 문자",
      en: "Operation, set, logic, calculus symbols and Greek letters",
      ja: "演算、集合、論理、微積分記号とギリシャ文字",
    },
    icon: "∑",
    color: "var(--field-symbols)",
    order: 17,
  },
  {
    id: "theorems",
    name: {
      ko: "유명 정리",
      en: "Famous Theorems",
      ja: "有名な定理",
    },
    description: {
      ko: "피타고라스, 오일러, 페르마, 괴델 등 중요한 정리들",
      en: "Important theorems: Pythagorean, Euler, Fermat, Gödel, etc.",
      ja: "ピタゴラス、オイラー、フェルマー、ゲーデルなどの重要な定理",
    },
    icon: "🏆",
    color: "var(--field-theorems)",
    order: 18,
  },
];

/** ID로 분야 찾기 */
export function getFieldById(id: MathField): MathFieldInfo | undefined {
  return fields.find((f) => f.id === id);
}

/** 분야 ID 목록 */
export const fieldIds = fields.map((f) => f.id);
