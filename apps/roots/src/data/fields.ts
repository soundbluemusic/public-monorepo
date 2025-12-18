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
    },
    description: {
      ko: "산술, 분수, 비율, 수 체계 등 수학의 기본 개념",
      en: "Basic concepts including arithmetic, fractions, ratios, and number systems",
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
    },
    description: {
      ko: "변수, 방정식, 다항식, 추상대수 등",
      en: "Variables, equations, polynomials, abstract algebra",
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
    },
    description: {
      ko: "평면기하, 입체기하, 해석기하, 미분기하 등",
      en: "Plane, solid, analytic, and differential geometry",
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
    },
    description: {
      ko: "삼각함수, 역삼각함수, 쌍곡선함수",
      en: "Trigonometric, inverse, and hyperbolic functions",
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
    },
    description: {
      ko: "극한, 미분, 적분, 미분방정식, 복소해석",
      en: "Limits, differentiation, integration, differential equations",
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
    },
    description: {
      ko: "벡터, 행렬, 선형변환, 벡터공간",
      en: "Vectors, matrices, linear transformations, vector spaces",
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
    },
    description: {
      ko: "확률, 통계, 확률과정, 베이즈 통계",
      en: "Probability, statistics, stochastic processes, Bayesian statistics",
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
    },
    description: {
      ko: "논리학, 집합론, 조합론, 그래프이론",
      en: "Logic, set theory, combinatorics, graph theory",
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
    },
    description: {
      ko: "초등수론, 대수적 수론, 해석적 수론, 암호학",
      en: "Elementary, algebraic, analytic number theory, cryptography",
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
    },
    description: {
      ko: "일반위상, 대수적 위상, 미분위상, 매듭이론",
      en: "General, algebraic, differential topology, knot theory",
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
    },
    description: {
      ko: "모델이론, 증명이론, 계산이론, 범주론",
      en: "Model theory, proof theory, computability, category theory",
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
    },
    description: {
      ko: "동역학계, 카오스이론, 프랙탈, 에르고딕 이론",
      en: "Dynamical systems, chaos theory, fractals, ergodic theory",
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
    },
    description: {
      ko: "선형계획법, 비선형최적화, 볼록최적화, 동적계획법",
      en: "Linear programming, nonlinear, convex optimization, dynamic programming",
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
    },
    description: {
      ko: "오차해석, 보간법, 수치적분, 수치미분방정식",
      en: "Error analysis, interpolation, numerical integration, numerical DE",
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
    },
    description: {
      ko: "금융, 물리, 컴퓨터과학, 공학, 생물 등 응용 분야",
      en: "Finance, physics, CS, engineering, biology applications",
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
    },
    description: {
      ko: "π, e, φ, √2, γ, i 등 수학의 주요 상수",
      en: "Major mathematical constants: π, e, φ, √2, γ, i, etc.",
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
    },
    description: {
      ko: "연산, 집합, 논리, 미적분 기호 및 그리스 문자",
      en: "Operation, set, logic, calculus symbols and Greek letters",
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
    },
    description: {
      ko: "피타고라스, 오일러, 페르마, 괴델 등 중요한 정리들",
      en: "Important theorems: Pythagorean, Euler, Fermat, Gödel, etc.",
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
