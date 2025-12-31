/**
 * @fileoverview 알고리즘/자료구조 타입 정의
 *
 * 수학 개념과 알고리즘/자료구조의 관계를 표현하는 타입
 */

import type { DifficultyLevel } from '../types';

// ============================================================================
// 알고리즘/자료구조 카테고리
// ============================================================================

export type AlgorithmCategory =
  | 'sorting' // 정렬
  | 'searching' // 탐색
  | 'graph' // 그래프
  | 'tree' // 트리
  | 'dynamic-programming' // 동적 프로그래밍
  | 'greedy' // 그리디
  | 'divide-conquer' // 분할 정복
  | 'backtracking' // 백트래킹
  | 'string' // 문자열
  | 'math-algorithm' // 수학 알고리즘
  | 'geometry-algorithm' // 기하 알고리즘
  | 'optimization-algorithm' // 최적화 알고리즘
  | 'probabilistic' // 확률적 알고리즘
  | 'cryptographic' // 암호화 알고리즘
  | 'machine-learning'; // 머신러닝

export type DataStructureCategory =
  | 'linear' // 선형 (배열, 리스트, 스택, 큐)
  | 'tree-structure' // 트리 구조
  | 'graph-structure' // 그래프 구조
  | 'hash' // 해시
  | 'heap' // 힙
  | 'advanced'; // 고급 (세그먼트 트리, 펜윅 트리 등)

// ============================================================================
// 알고리즘 타입
// ============================================================================

export interface Algorithm {
  id: string;
  name: { ko: string; en: string };
  category: AlgorithmCategory;
  difficulty: DifficultyLevel;

  /** 간단한 설명 */
  description: { ko: string; en: string };

  /** 시간 복잡도 */
  timeComplexity: {
    best?: string; // O(n)
    average: string;
    worst: string;
  };

  /** 공간 복잡도 */
  spaceComplexity: string;

  /** 이 알고리즘의 수학적 기반 (수학 개념 ID들) */
  mathFoundations: string[];

  /** 필요한 자료구조 */
  dataStructures?: string[];

  /** 선행 알고리즘 */
  prerequisites?: string[];

  /** 관련 알고리즘 */
  related?: string[];

  /** 실제 응용 사례 */
  applications?: string[];

  /** 태그 */
  tags: string[];
}

// ============================================================================
// 자료구조 타입
// ============================================================================

export interface DataStructure {
  id: string;
  name: { ko: string; en: string };
  category: DataStructureCategory;
  difficulty: DifficultyLevel;

  /** 간단한 설명 */
  description: { ko: string; en: string };

  /** 연산별 시간 복잡도 */
  operations: {
    access?: string; // 접근
    search?: string; // 탐색
    insert?: string; // 삽입
    delete?: string; // 삭제
  };

  /** 공간 복잡도 */
  spaceComplexity: string;

  /** 이 자료구조의 수학적 기반 */
  mathFoundations: string[];

  /** 선행 자료구조 */
  prerequisites?: string[];

  /** 관련 자료구조 */
  related?: string[];

  /** 이 자료구조를 사용하는 알고리즘 */
  usedBy?: string[];

  /** 태그 */
  tags: string[];
}

// ============================================================================
// 그래프 시각화용 노드/엣지 타입
// ============================================================================

export type NodeType = 'math' | 'algorithm' | 'data-structure';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: { ko: string; en: string };
  category: string;
  difficulty: DifficultyLevel;
  /** D3 force simulation용 좌표 */
  x?: number;
  y?: number;
  fx?: number | null; // 고정 x
  fy?: number | null; // 고정 y
}

export type EdgeType =
  | 'foundation' // 수학 → 알고리즘/자료구조 (수학적 기반)
  | 'prerequisite' // 선행 관계
  | 'uses' // 알고리즘 → 자료구조 (사용)
  | 'related'; // 관련

export interface GraphEdge {
  source: string;
  target: string;
  type: EdgeType;
  /** 엣지 가중치 (시각화용) */
  weight?: number;
}

export interface ConceptGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ============================================================================
// 카테고리 정보
// ============================================================================

export const algorithmCategories: Record<
  AlgorithmCategory,
  { name: { ko: string; en: string }; icon: string }
> = {
  sorting: { name: { ko: '정렬', en: 'Sorting' }, icon: '📊' },
  searching: { name: { ko: '탐색', en: 'Searching' }, icon: '🔍' },
  graph: { name: { ko: '그래프', en: 'Graph' }, icon: '🕸️' },
  tree: { name: { ko: '트리', en: 'Tree' }, icon: '🌳' },
  'dynamic-programming': { name: { ko: '동적 프로그래밍', en: 'Dynamic Programming' }, icon: '📈' },
  greedy: { name: { ko: '그리디', en: 'Greedy' }, icon: '💰' },
  'divide-conquer': { name: { ko: '분할 정복', en: 'Divide & Conquer' }, icon: '✂️' },
  backtracking: { name: { ko: '백트래킹', en: 'Backtracking' }, icon: '🔙' },
  string: { name: { ko: '문자열', en: 'String' }, icon: '📝' },
  'math-algorithm': { name: { ko: '수학 알고리즘', en: 'Math Algorithm' }, icon: '🔢' },
  'geometry-algorithm': { name: { ko: '기하 알고리즘', en: 'Geometry Algorithm' }, icon: '📐' },
  'optimization-algorithm': { name: { ko: '최적화', en: 'Optimization' }, icon: '⚡' },
  probabilistic: { name: { ko: '확률적', en: 'Probabilistic' }, icon: '🎲' },
  cryptographic: { name: { ko: '암호화', en: 'Cryptographic' }, icon: '🔐' },
  'machine-learning': { name: { ko: '머신러닝', en: 'Machine Learning' }, icon: '🤖' },
};

export const dataStructureCategories: Record<
  DataStructureCategory,
  { name: { ko: string; en: string }; icon: string }
> = {
  linear: { name: { ko: '선형', en: 'Linear' }, icon: '📏' },
  'tree-structure': { name: { ko: '트리', en: 'Tree' }, icon: '🌲' },
  'graph-structure': { name: { ko: '그래프', en: 'Graph' }, icon: '🔗' },
  hash: { name: { ko: '해시', en: 'Hash' }, icon: '#️⃣' },
  heap: { name: { ko: '힙', en: 'Heap' }, icon: '⛰️' },
  advanced: { name: { ko: '고급', en: 'Advanced' }, icon: '🎯' },
};
