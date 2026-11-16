import type { MathConcept } from '../types';

export const graphTheoryAdvancedConcepts: MathConcept[] = [
  {
    id: 'graph-coloring',
    name: {
      ko: '그래프 색칠',
      en: 'Graph Coloring',
    },
    field: 'discrete-mathematics',
    subfield: 'graph-theory',
    difficulty: 3,
    content: {
      ko: '인접한 정점이 같은 색을 갖지 않도록 정점에 색을 배정하는 문제입니다. 색상수는 필요한 최소 색의 개수입니다.',
      en: 'The problem of assigning colors to vertices such that no adjacent vertices share the same color. The chromatic number is the minimum number of colors needed.',
    },
    latex: '\\chi(G) = \\min\\{k : G \\text{ is } k\\text{-colorable}\\}',
    relations: {
      prerequisites: ['graph', 'vertex-edge'],
      nextTopics: ['four-color-theorem', 'chromatic-polynomial'],
      related: ['planar-graph', 'np-complete'],
      applications: ['scheduling', 'register-allocation', 'map-coloring'],
    },
    tags: ['graph-theory', 'combinatorics', 'np-hard'],
  },
  {
    id: 'planar-graph',
    name: {
      ko: '평면 그래프',
      en: 'Planar Graph',
    },
    field: 'discrete-mathematics',
    subfield: 'graph-theory',
    difficulty: 3,
    content: {
      ko: '변이 교차하지 않게 평면에 그릴 수 있는 그래프입니다. 연결된 평면 표현에서는 V-E+F=2입니다. K₅와 K₃,₃의 세분을 부분 그래프로 포함하지 않습니다.',
      en: 'A graph drawable in the plane without edge crossings. For a connected plane embedding V-E+F=2. It contains no subdivision of K₅ or K₃,₃.',
    },
    latex: 'V-E+F=2\\ \\text{(connected)};\\quad E\\leq 3V-6\\ \\text{(simple, }V\\geq3\\text{)}',
    relations: {
      prerequisites: ['graph', 'euler-formula'],
      nextTopics: ['kuratowski-theorem', 'four-color-theorem'],
      related: ['graph-embedding', 'genus'],
      applications: ['circuit-layout', 'geographic-maps'],
    },
    tags: ['graph-theory', 'topology', 'euler'],
  },
  {
    id: 'network-flow',
    name: {
      ko: '네트워크 흐름',
      en: 'Network Flow',
    },
    field: 'discrete-mathematics',
    subfield: 'graph-theory',
    difficulty: 4,
    content: {
      ko: '방향 그래프에서 소스에서 싱크로 흐르는 최대 흐름을 찾는 문제입니다. 최대흐름-최소절단 정리가 핵심 결과입니다.',
      en: 'The problem of finding maximum flow from source to sink in a directed graph. The max-flow min-cut theorem is the key result.',
    },
    latex:
      '\\max |f| = \\min_{S-T\\text{ cut}} c(S,T),\\quad \\sum_{v:(u,v)\\in E}f(u,v)=\\sum_{v:(v,u)\\in E}f(v,u)\\quad(u\\notin\\{s,t\\})',
    relations: {
      prerequisites: ['directed-graph', 'graph-algorithms'],
      nextTopics: ['ford-fulkerson', 'bipartite-matching'],
      related: ['linear-programming', 'min-cost-flow'],
      applications: ['transportation', 'assignment', 'image-segmentation'],
    },
    tags: ['graph-theory', 'optimization', 'algorithms'],
  },
  {
    id: 'spectral-graph-theory',
    name: {
      ko: '스펙트럼 그래프 이론',
      en: 'Spectral Graph Theory',
    },
    field: 'discrete-mathematics',
    subfield: 'graph-theory',
    difficulty: 4,
    content: {
      ko: '그래프의 인접행렬이나 라플라시안 행렬의 고유값을 연구합니다. 정점이 둘 이상인 유한 무방향 그래프에서 두 번째로 작은 라플라시안 고유값이 양수일 필요충분조건은 그래프가 연결되어 있는 것입니다.',
      en: 'Studies eigenvalues of adjacency or Laplacian matrices. For a finite undirected graph with at least two vertices, the second-smallest Laplacian eigenvalue is positive if and only if the graph is connected.',
    },
    latex:
      'L = D - A, \\quad 0 = \\lambda_1 \\le \\lambda_2 \\le \\cdots, \\quad \\lambda_2 > 0 \\Leftrightarrow G \\text{ connected}',
    relations: {
      prerequisites: ['eigenvalue', 'graph', 'laplacian-matrix'],
      nextTopics: ['cheeger-inequality', 'graph-partitioning'],
      related: ['random-walks', 'expander-graphs'],
      applications: ['clustering', 'community-detection', 'pagerank'],
    },
    tags: ['graph-theory', 'linear-algebra', 'spectral'],
  },
  {
    id: 'random-graphs',
    name: {
      ko: '랜덤 그래프',
      en: 'Random Graphs',
    },
    field: 'discrete-mathematics',
    subfield: 'graph-theory',
    difficulty: 4,
    content: {
      ko: '확률적으로 생성되는 그래프를 연구합니다. Erdős-Rényi 모델 G(n,p)는 각 정점 쌍의 간선을 서로 독립적으로 확률 p로 넣습니다. n이 커질 때 연결성의 임계 규모는 ln(n)/n입니다.',
      en: 'Studies probabilistically generated graphs. The Erdős-Rényi model G(n,p) includes each possible edge independently with probability p. As n grows, ln(n)/n is the connectivity threshold scale.',
    },
    latex:
      'G(n,p): \\Pr[\\text{edge } (i,j)] = p, \\quad \\text{connectivity threshold scale: } \\frac{\\ln n}{n} \\quad (n\\to\\infty)',
    relations: {
      prerequisites: ['probability', 'graph'],
      nextTopics: ['small-world-networks', 'scale-free-networks'],
      related: ['percolation-theory', 'probabilistic-method'],
      applications: ['social-networks', 'epidemiology', 'internet-modeling'],
    },
    tags: ['graph-theory', 'probability', 'complex-networks'],
  },
  {
    id: 'matching-theory',
    name: {
      ko: '매칭 이론',
      en: 'Matching Theory',
    },
    field: 'discrete-mathematics',
    subfield: 'graph-theory',
    difficulty: 3,
    content: {
      ko: '그래프에서 정점을 공유하지 않는 간선의 집합인 매칭을 다룹니다. 유한 이분 그래프에서 Hall의 조건은 한쪽 X의 모든 정점을 짝지을 수 있는 필요충분조건입니다. 양쪽의 정점 수가 같으면 완전 매칭이 됩니다.',
      en: 'A matching is a set of edges with no shared vertices. Hall’s condition characterizes matchings covering X in finite bipartite graphs. If both sides have equal size, such a matching is perfect.',
    },
    latex:
      '|N(S)|\\geq |S|\\ \\text{for all }S\\subseteq X\\ \\Longleftrightarrow\\ \\text{a matching covers }X',
    relations: {
      prerequisites: ['bipartite-graph', 'graph'],
      nextTopics: ['hungarian-algorithm', 'stable-matching'],
      related: ['network-flow', 'vertex-cover'],
      applications: ['job-assignment', 'kidney-exchange', 'marriage-problem'],
    },
    tags: ['graph-theory', 'combinatorics', 'optimization'],
  },
  {
    id: 'tree-algorithms',
    name: {
      ko: '트리 알고리즘',
      en: 'Tree Algorithms',
    },
    field: 'discrete-mathematics',
    subfield: 'graph-theory',
    difficulty: 3,
    content: {
      ko: '트리 구조에서의 알고리즘입니다. 최소 신장 트리(Kruskal, Prim), 최소 공통 조상(LCA), 트리 DP 등이 포함됩니다.',
      en: 'Algorithms on tree structures. Includes minimum spanning tree (Kruskal, Prim), lowest common ancestor (LCA), and tree DP.',
    },
    latex: '\\text{MST: } \\min \\sum_{e \\in T} w(e), \\quad |E(T)| = |V| - 1',
    relations: {
      prerequisites: ['tree', 'graph-algorithms'],
      nextTopics: ['heavy-light-decomposition', 'centroid-decomposition'],
      related: ['greedy-algorithm', 'dynamic-programming'],
      applications: ['network-design', 'clustering', 'phylogenetics'],
    },
    tags: ['graph-theory', 'algorithms', 'tree'],
  },
  {
    id: 'graph-isomorphism',
    name: {
      ko: '그래프 동형',
      en: 'Graph Isomorphism',
    },
    field: 'discrete-mathematics',
    subfield: 'graph-theory',
    difficulty: 4,
    content: {
      ko: '두 그래프의 정점 사이에 간선 관계를 보존하는 일대일 대응이 있는지 판별하는 문제입니다. 복잡도 클래스 NP에 속합니다.',
      en: 'The problem of determining whether there is a bijection between two graphs that preserves adjacency. It belongs to complexity class NP.',
    },
    latex:
      'G_1 \\cong G_2 \\Leftrightarrow \\exists \\phi: V_1 \\to V_2 \\text{ bijective}, \\; \\forall u,v \\in V_1:\\; ((u,v) \\in E_1 \\Leftrightarrow (\\phi(u),\\phi(v)) \\in E_2)',
    relations: {
      prerequisites: ['graph', 'bijection'],
      nextTopics: ['weisfeiler-lehman', 'babai-algorithm'],
      related: ['group-theory', 'complexity-theory'],
      applications: ['chemical-structure', 'pattern-recognition'],
    },
    tags: ['graph-theory', 'complexity', 'algorithms'],
  },
];
