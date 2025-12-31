/**
 * @fileoverview 알고리즘 데이터
 *
 * 수학 개념과의 관계를 포함한 주요 알고리즘 정의
 */

import type { Algorithm } from './types';

export const algorithms: Algorithm[] = [
  // ============================================================================
  // 정렬 알고리즘
  // ============================================================================
  {
    id: 'bubble-sort',
    name: { ko: '버블 정렬', en: 'Bubble Sort' },
    category: 'sorting',
    difficulty: 1,
    description: {
      ko: '인접한 두 원소를 비교하여 정렬하는 알고리즘',
      en: 'Sorts by comparing adjacent elements',
    },
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    mathFoundations: ['inequality', 'sequence'],
    tags: ['sorting', 'comparison', 'in-place'],
  },
  {
    id: 'merge-sort',
    name: { ko: '병합 정렬', en: 'Merge Sort' },
    category: 'sorting',
    difficulty: 2,
    description: {
      ko: '분할 정복을 사용한 안정 정렬 알고리즘',
      en: 'A stable sorting algorithm using divide and conquer',
    },
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['recursion', 'logarithm', 'divide-and-conquer'],
    dataStructures: ['array'],
    tags: ['sorting', 'divide-conquer', 'stable'],
  },
  {
    id: 'quick-sort',
    name: { ko: '퀵 정렬', en: 'Quick Sort' },
    category: 'sorting',
    difficulty: 2,
    description: {
      ko: '피벗을 기준으로 분할하여 정렬하는 알고리즘',
      en: 'Sorts by partitioning around a pivot',
    },
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    mathFoundations: ['recursion', 'logarithm', 'probability', 'divide-and-conquer'],
    dataStructures: ['array'],
    tags: ['sorting', 'divide-conquer', 'in-place'],
  },
  {
    id: 'heap-sort',
    name: { ko: '힙 정렬', en: 'Heap Sort' },
    category: 'sorting',
    difficulty: 2,
    description: {
      ko: '힙 자료구조를 사용한 비교 기반 정렬',
      en: 'A comparison-based sort using heap data structure',
    },
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    mathFoundations: ['complete-binary-tree', 'logarithm', 'inequality'],
    dataStructures: ['heap-structure'],
    tags: ['sorting', 'heap', 'in-place'],
  },

  // ============================================================================
  // 탐색 알고리즘
  // ============================================================================
  {
    id: 'binary-search',
    name: { ko: '이진 탐색', en: 'Binary Search' },
    category: 'searching',
    difficulty: 1,
    description: {
      ko: '정렬된 배열에서 중간값 비교로 탐색 범위를 절반씩 줄이는 알고리즘',
      en: 'Halves search range by comparing with middle element',
    },
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    mathFoundations: ['logarithm', 'inequality', 'divide-and-conquer'],
    dataStructures: ['array', 'bst'],
    tags: ['searching', 'divide-conquer', 'sorted'],
  },
  {
    id: 'bfs',
    name: { ko: '너비 우선 탐색', en: 'Breadth-First Search' },
    category: 'graph',
    difficulty: 2,
    description: {
      ko: '가까운 노드부터 탐색하는 그래프 탐색 알고리즘',
      en: 'Graph traversal exploring neighbors first',
    },
    timeComplexity: { average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    mathFoundations: ['graph-theory', 'queue-theory'],
    dataStructures: ['queue', 'graph-structure'],
    tags: ['graph', 'traversal', 'shortest-path'],
  },
  {
    id: 'dfs',
    name: { ko: '깊이 우선 탐색', en: 'Depth-First Search' },
    category: 'graph',
    difficulty: 2,
    description: {
      ko: '한 경로를 끝까지 탐색 후 되돌아오는 그래프 탐색',
      en: 'Graph traversal exploring depth before breadth',
    },
    timeComplexity: { average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    mathFoundations: ['graph-theory', 'recursion', 'stack-theory'],
    dataStructures: ['stack', 'graph-structure'],
    tags: ['graph', 'traversal', 'recursive'],
  },

  // ============================================================================
  // 최단 경로 알고리즘
  // ============================================================================
  {
    id: 'dijkstra',
    name: { ko: '다익스트라', en: "Dijkstra's Algorithm" },
    category: 'graph',
    difficulty: 3,
    description: {
      ko: '음이 아닌 가중치 그래프에서 최단 경로를 찾는 알고리즘',
      en: 'Finds shortest path in non-negative weighted graphs',
    },
    timeComplexity: { average: 'O((V+E) log V)', worst: 'O((V+E) log V)' },
    spaceComplexity: 'O(V)',
    mathFoundations: ['graph-theory', 'greedy-method', 'inequality', 'priority-queue'],
    dataStructures: ['heap-structure', 'graph-structure'],
    prerequisites: ['bfs'],
    tags: ['graph', 'shortest-path', 'greedy'],
  },
  {
    id: 'bellman-ford',
    name: { ko: '벨만-포드', en: 'Bellman-Ford' },
    category: 'graph',
    difficulty: 3,
    description: {
      ko: '음의 가중치도 처리할 수 있는 최단 경로 알고리즘',
      en: 'Shortest path algorithm handling negative weights',
    },
    timeComplexity: { average: 'O(VE)', worst: 'O(VE)' },
    spaceComplexity: 'O(V)',
    mathFoundations: ['graph-theory', 'relaxation', 'dynamic-programming'],
    dataStructures: ['graph-structure'],
    tags: ['graph', 'shortest-path', 'negative-weight'],
  },
  {
    id: 'floyd-warshall',
    name: { ko: '플로이드-워셜', en: 'Floyd-Warshall' },
    category: 'graph',
    difficulty: 3,
    description: {
      ko: '모든 쌍 최단 경로를 찾는 알고리즘',
      en: 'Finds shortest paths between all pairs of vertices',
    },
    timeComplexity: { average: 'O(V³)', worst: 'O(V³)' },
    spaceComplexity: 'O(V²)',
    mathFoundations: ['matrix', 'dynamic-programming', 'graph-theory'],
    dataStructures: ['graph-structure'],
    tags: ['graph', 'shortest-path', 'all-pairs'],
  },

  // ============================================================================
  // 동적 프로그래밍
  // ============================================================================
  {
    id: 'fibonacci-dp',
    name: { ko: '피보나치 (DP)', en: 'Fibonacci (DP)' },
    category: 'dynamic-programming',
    difficulty: 1,
    description: {
      ko: '메모이제이션을 사용한 피보나치 수열 계산',
      en: 'Fibonacci calculation using memoization',
    },
    timeComplexity: { average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['fibonacci', 'recurrence-relation', 'sequence'],
    tags: ['dp', 'memoization', 'basic'],
  },
  {
    id: 'lcs',
    name: { ko: '최장 공통 부분 수열', en: 'Longest Common Subsequence' },
    category: 'dynamic-programming',
    difficulty: 3,
    description: {
      ko: '두 수열의 가장 긴 공통 부분 수열을 찾는 알고리즘',
      en: 'Finds the longest subsequence common to two sequences',
    },
    timeComplexity: { average: 'O(mn)', worst: 'O(mn)' },
    spaceComplexity: 'O(mn)',
    mathFoundations: ['sequence', 'recurrence-relation', 'matrix'],
    tags: ['dp', 'string', 'subsequence'],
  },
  {
    id: 'knapsack',
    name: { ko: '배낭 문제', en: 'Knapsack Problem' },
    category: 'dynamic-programming',
    difficulty: 3,
    description: {
      ko: '제한된 용량에서 최대 가치를 찾는 최적화 문제',
      en: 'Optimization problem to maximize value within capacity',
    },
    timeComplexity: { average: 'O(nW)', worst: 'O(nW)' },
    spaceComplexity: 'O(nW)',
    mathFoundations: ['optimization', 'recurrence-relation', 'inequality'],
    tags: ['dp', 'optimization', 'classic'],
  },

  // ============================================================================
  // 분할 정복
  // ============================================================================
  {
    id: 'fft',
    name: { ko: '고속 푸리에 변환', en: 'Fast Fourier Transform' },
    category: 'divide-conquer',
    difficulty: 4,
    description: {
      ko: '다항식 곱셈을 O(n log n)에 수행하는 알고리즘',
      en: 'Computes polynomial multiplication in O(n log n)',
    },
    timeComplexity: { average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['complex-number', 'polynomial', 'roots-of-unity', 'divide-and-conquer'],
    tags: ['divide-conquer', 'polynomial', 'signal-processing'],
  },
  {
    id: 'strassen',
    name: { ko: '슈트라센 알고리즘', en: 'Strassen Algorithm' },
    category: 'divide-conquer',
    difficulty: 4,
    description: {
      ko: '행렬 곱셈을 O(n^2.807)에 수행하는 알고리즘',
      en: 'Matrix multiplication in O(n^2.807)',
    },
    timeComplexity: { average: 'O(n^2.807)', worst: 'O(n^2.807)' },
    spaceComplexity: 'O(n²)',
    mathFoundations: ['matrix', 'linear-algebra', 'divide-and-conquer'],
    tags: ['divide-conquer', 'matrix', 'multiplication'],
  },

  // ============================================================================
  // 수학 알고리즘
  // ============================================================================
  {
    id: 'euclidean-gcd',
    name: { ko: '유클리드 호제법', en: 'Euclidean Algorithm' },
    category: 'math-algorithm',
    difficulty: 1,
    description: {
      ko: '두 수의 최대공약수를 구하는 알고리즘',
      en: 'Finds the greatest common divisor of two numbers',
    },
    timeComplexity: { average: 'O(log min(a,b))', worst: 'O(log min(a,b))' },
    spaceComplexity: 'O(1)',
    mathFoundations: ['divisibility', 'modular-arithmetic', 'number-theory'],
    tags: ['math', 'gcd', 'number-theory'],
  },
  {
    id: 'sieve-eratosthenes',
    name: { ko: '에라토스테네스의 체', en: 'Sieve of Eratosthenes' },
    category: 'math-algorithm',
    difficulty: 1,
    description: {
      ko: 'n 이하의 모든 소수를 찾는 알고리즘',
      en: 'Finds all primes up to n',
    },
    timeComplexity: { average: 'O(n log log n)', worst: 'O(n log log n)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['prime-number', 'divisibility', 'number-theory'],
    tags: ['math', 'prime', 'number-theory'],
  },
  {
    id: 'miller-rabin',
    name: { ko: '밀러-라빈 소수 판별법', en: 'Miller-Rabin Primality Test' },
    category: 'math-algorithm',
    difficulty: 4,
    description: {
      ko: '확률적 소수 판별 알고리즘',
      en: 'Probabilistic primality testing algorithm',
    },
    timeComplexity: { average: 'O(k log³ n)', worst: 'O(k log³ n)' },
    spaceComplexity: 'O(1)',
    mathFoundations: ['prime-number', 'modular-arithmetic', 'probability', 'fermat-little-theorem'],
    tags: ['math', 'prime', 'probabilistic'],
  },

  // ============================================================================
  // 머신러닝 알고리즘
  // ============================================================================
  {
    id: 'gradient-descent',
    name: { ko: '경사 하강법', en: 'Gradient Descent' },
    category: 'machine-learning',
    difficulty: 3,
    description: {
      ko: '함수의 최솟값을 찾기 위해 기울기 방향으로 이동하는 최적화 알고리즘',
      en: 'Optimization algorithm moving in the direction of steepest descent',
    },
    timeComplexity: { average: 'O(n*iterations)', worst: 'O(n*iterations)' },
    spaceComplexity: 'O(n)',
    mathFoundations: ['derivative', 'gradient', 'partial-derivative', 'optimization'],
    tags: ['ml', 'optimization', 'iterative'],
  },
  {
    id: 'linear-regression',
    name: { ko: '선형 회귀', en: 'Linear Regression' },
    category: 'machine-learning',
    difficulty: 2,
    description: {
      ko: '데이터에 가장 잘 맞는 직선을 찾는 알고리즘',
      en: 'Finds the best-fitting line for data',
    },
    timeComplexity: { average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    mathFoundations: ['linear-equation', 'least-squares', 'matrix', 'statistics'],
    tags: ['ml', 'regression', 'supervised'],
  },
  {
    id: 'k-means',
    name: { ko: 'K-평균 클러스터링', en: 'K-Means Clustering' },
    category: 'machine-learning',
    difficulty: 2,
    description: {
      ko: '데이터를 K개의 클러스터로 분류하는 알고리즘',
      en: 'Partitions data into K clusters',
    },
    timeComplexity: { average: 'O(nkt)', worst: 'O(nkt)' },
    spaceComplexity: 'O(n+k)',
    mathFoundations: ['distance', 'mean', 'euclidean-distance', 'optimization'],
    tags: ['ml', 'clustering', 'unsupervised'],
  },
];

/** ID로 알고리즘 찾기 */
export function getAlgorithmById(id: string): Algorithm | undefined {
  return algorithms.find((a) => a.id === id);
}

/** 카테고리로 알고리즘 필터링 */
export function getAlgorithmsByCategory(category: string): Algorithm[] {
  return algorithms.filter((a) => a.category === category);
}

/** 수학 개념 ID로 관련 알고리즘 찾기 */
export function getAlgorithmsByMathConcept(conceptId: string): Algorithm[] {
  return algorithms.filter((a) => a.mathFoundations.includes(conceptId));
}
