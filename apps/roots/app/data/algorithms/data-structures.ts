/**
 * @fileoverview 자료구조 데이터
 *
 * 수학 개념과의 관계를 포함한 주요 자료구조 정의
 */

import type { DataStructure } from './types';

export const dataStructures: DataStructure[] = [
  // ============================================================================
  // 선형 자료구조
  // ============================================================================
  {
    id: 'array',
    name: { ko: '배열', en: 'Array' },
    category: 'linear',
    difficulty: 1,
    description: {
      ko: '연속된 메모리 공간에 동일한 타입의 요소를 저장하는 자료구조',
      en: 'A data structure that stores elements of the same type in contiguous memory',
    },
    operations: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['sequence', 'index-notation'],
    tags: ['linear', 'basic', 'random-access'],
  },
  {
    id: 'linked-list',
    name: { ko: '연결 리스트', en: 'Linked List' },
    category: 'linear',
    difficulty: 2,
    description: {
      ko: '노드들이 포인터로 연결된 선형 자료구조',
      en: 'A linear data structure where nodes are connected by pointers',
    },
    operations: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['sequence', 'graph-theory'],
    prerequisites: ['array'],
    tags: ['linear', 'dynamic'],
  },
  {
    id: 'stack',
    name: { ko: '스택', en: 'Stack' },
    category: 'linear',
    difficulty: 1,
    description: {
      ko: 'LIFO(후입선출) 원칙을 따르는 자료구조',
      en: 'A LIFO (Last In, First Out) data structure',
    },
    operations: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['sequence'],
    usedBy: ['dfs', 'backtracking-algo'],
    tags: ['linear', 'lifo'],
  },
  {
    id: 'queue',
    name: { ko: '큐', en: 'Queue' },
    category: 'linear',
    difficulty: 1,
    description: {
      ko: 'FIFO(선입선출) 원칙을 따르는 자료구조',
      en: 'A FIFO (First In, First Out) data structure',
    },
    operations: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['sequence'],
    usedBy: ['bfs'],
    tags: ['linear', 'fifo'],
  },

  // ============================================================================
  // 트리 구조
  // ============================================================================
  {
    id: 'binary-tree',
    name: { ko: '이진 트리', en: 'Binary Tree' },
    category: 'tree-structure',
    difficulty: 2,
    description: {
      ko: '각 노드가 최대 2개의 자식을 가지는 트리',
      en: 'A tree where each node has at most two children',
    },
    operations: { search: 'O(n)', insert: 'O(n)', delete: 'O(n)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['graph-theory', 'recursion', 'binary-number'],
    tags: ['tree', 'hierarchical'],
  },
  {
    id: 'bst',
    name: { ko: '이진 탐색 트리', en: 'Binary Search Tree' },
    category: 'tree-structure',
    difficulty: 2,
    description: {
      ko: '왼쪽 자식 < 부모 < 오른쪽 자식 규칙을 따르는 이진 트리',
      en: 'A binary tree following left < parent < right rule',
    },
    operations: { search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['inequality', 'logarithm', 'recursion'],
    prerequisites: ['binary-tree'],
    usedBy: ['binary-search'],
    tags: ['tree', 'sorted', 'search'],
  },
  {
    id: 'avl-tree',
    name: { ko: 'AVL 트리', en: 'AVL Tree' },
    category: 'tree-structure',
    difficulty: 3,
    description: {
      ko: '높이 균형을 유지하는 자가 균형 이진 탐색 트리',
      en: 'A self-balancing BST maintaining height balance',
    },
    operations: { search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['logarithm', 'recursion', 'balance-factor'],
    prerequisites: ['bst'],
    tags: ['tree', 'balanced', 'self-balancing'],
  },
  {
    id: 'heap-structure',
    name: { ko: '힙', en: 'Heap' },
    category: 'heap',
    difficulty: 2,
    description: {
      ko: '부모가 자식보다 크거나(최대힙) 작은(최소힙) 완전 이진 트리',
      en: 'A complete binary tree where parent >= children (max) or parent <= children (min)',
    },
    operations: { access: 'O(1)', insert: 'O(log n)', delete: 'O(log n)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['inequality', 'logarithm', 'complete-binary-tree'],
    usedBy: ['heap-sort', 'dijkstra', 'prim'],
    tags: ['tree', 'priority'],
  },

  // ============================================================================
  // 그래프 구조
  // ============================================================================
  {
    id: 'graph-structure',
    name: { ko: '그래프', en: 'Graph' },
    category: 'graph-structure',
    difficulty: 2,
    description: {
      ko: '정점과 간선으로 이루어진 비선형 자료구조',
      en: 'A non-linear structure consisting of vertices and edges',
    },
    operations: { search: 'O(V+E)' },
    spaceComplexity: 'O(V+E)',
    mathFoundations: ['graph-theory', 'set-theory', 'matrix'],
    usedBy: ['bfs', 'dfs', 'dijkstra', 'bellman-ford', 'floyd-warshall'],
    tags: ['graph', 'network'],
  },

  // ============================================================================
  // 해시
  // ============================================================================
  {
    id: 'hash-table',
    name: { ko: '해시 테이블', en: 'Hash Table' },
    category: 'hash',
    difficulty: 2,
    description: {
      ko: '키를 해시 함수로 인덱스에 매핑하는 자료구조',
      en: 'A structure that maps keys to indices using a hash function',
    },
    operations: { access: 'O(1)', search: 'O(1)', insert: 'O(1)', delete: 'O(1)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['modular-arithmetic', 'function', 'probability'],
    tags: ['hash', 'key-value', 'constant-time'],
  },

  // ============================================================================
  // 고급 자료구조
  // ============================================================================
  {
    id: 'segment-tree',
    name: { ko: '세그먼트 트리', en: 'Segment Tree' },
    category: 'advanced',
    difficulty: 4,
    description: {
      ko: '구간 쿼리를 효율적으로 처리하는 트리 구조',
      en: 'A tree for efficient range query operations',
    },
    operations: { search: 'O(log n)', insert: 'O(log n)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['interval', 'recursion', 'logarithm', 'divide-and-conquer'],
    prerequisites: ['binary-tree'],
    tags: ['tree', 'range-query', 'advanced'],
  },
  {
    id: 'trie',
    name: { ko: '트라이', en: 'Trie' },
    category: 'advanced',
    difficulty: 3,
    description: {
      ko: '문자열을 저장하고 검색하는 트리 구조',
      en: 'A tree structure for storing and searching strings',
    },
    operations: { search: 'O(m)', insert: 'O(m)' },
    spaceComplexity: 'O(n*m)',
    mathFoundations: ['tree-theory', 'string-theory'],
    tags: ['tree', 'string', 'prefix'],
  },
  {
    id: 'union-find',
    name: { ko: '유니온 파인드', en: 'Union-Find' },
    category: 'advanced',
    difficulty: 3,
    description: {
      ko: '서로소 집합을 효율적으로 관리하는 자료구조',
      en: 'A structure for efficiently managing disjoint sets',
    },
    operations: { search: 'O(α(n))', insert: 'O(α(n))' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['set-theory', 'equivalence-relation', 'tree-theory'],
    usedBy: ['kruskal'],
    tags: ['set', 'disjoint', 'connected-components'],
  },
];

/** ID로 자료구조 찾기 */
export function getDataStructureById(id: string): DataStructure | undefined {
  return dataStructures.find((ds) => ds.id === id);
}

/** 카테고리로 자료구조 필터링 */
export function getDataStructuresByCategory(category: string): DataStructure[] {
  return dataStructures.filter((ds) => ds.category === category);
}

/** 수학 개념 ID로 관련 자료구조 찾기 */
export function getDataStructuresByMathConcept(conceptId: string): DataStructure[] {
  return dataStructures.filter((ds) => ds.mathFoundations.includes(conceptId));
}
