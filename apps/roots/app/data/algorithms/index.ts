/**
 * @fileoverview 알고리즘/자료구조 데이터 모듈
 *
 * 수학 개념과 알고리즘/자료구조의 관계를 관리하는 중앙 모듈
 */

export * from './algorithms';
export * from './data-structures';
export * from './types';

import { algorithms, getAlgorithmById, getAlgorithmsByMathConcept } from './algorithms';
import {
  dataStructures,
  getDataStructureById,
  getDataStructuresByMathConcept,
} from './data-structures';
import type { ConceptGraph, GraphEdge, GraphNode } from './types';

/**
 * 수학 개념 ID들의 목록을 추출 (알고리즘 + 자료구조에서 참조되는 모든 수학 개념)
 */
export function getReferencedMathConcepts(): string[] {
  const mathIds = new Set<string>();

  for (const algo of algorithms) {
    for (const mathId of algo.mathFoundations) {
      mathIds.add(mathId);
    }
  }

  for (const ds of dataStructures) {
    for (const mathId of ds.mathFoundations) {
      mathIds.add(mathId);
    }
  }

  return Array.from(mathIds).sort();
}

/**
 * 특정 수학 개념에 연결된 알고리즘과 자료구조를 함께 조회
 */
export function getRelatedToMathConcept(conceptId: string) {
  return {
    algorithms: getAlgorithmsByMathConcept(conceptId),
    dataStructures: getDataStructuresByMathConcept(conceptId),
  };
}

/**
 * 전체 관계 그래프 생성 (D3 시각화용)
 * 노드: 수학 개념 + 알고리즘 + 자료구조
 * 엣지: foundation (수학→알고/자료), uses (알고→자료), prerequisite (선행 관계)
 */
export function buildConceptGraph(
  mathConcepts: Array<{
    id: string;
    name: { ko: string; en: string };
    difficulty: number;
    field: string;
  }>,
): ConceptGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();

  // 1. 수학 개념 노드 추가
  for (const concept of mathConcepts) {
    if (!nodeIds.has(concept.id)) {
      nodes.push({
        id: concept.id,
        type: 'math',
        label: concept.name,
        category: concept.field,
        difficulty: concept.difficulty as 1 | 2 | 3 | 4 | 5,
      });
      nodeIds.add(concept.id);
    }
  }

  // 2. 알고리즘 노드 및 엣지 추가
  for (const algo of algorithms) {
    if (!nodeIds.has(algo.id)) {
      nodes.push({
        id: algo.id,
        type: 'algorithm',
        label: algo.name,
        category: algo.category,
        difficulty: algo.difficulty,
      });
      nodeIds.add(algo.id);
    }

    // 수학 기반 엣지 (수학 → 알고리즘)
    for (const mathId of algo.mathFoundations) {
      if (nodeIds.has(mathId)) {
        edges.push({
          source: mathId,
          target: algo.id,
          type: 'foundation',
        });
      }
    }

    // 자료구조 사용 엣지 (알고리즘 → 자료구조)
    if (algo.dataStructures) {
      for (const dsId of algo.dataStructures) {
        edges.push({
          source: algo.id,
          target: dsId,
          type: 'uses',
        });
      }
    }

    // 선행 알고리즘 엣지
    if (algo.prerequisites) {
      for (const prereqId of algo.prerequisites) {
        edges.push({
          source: prereqId,
          target: algo.id,
          type: 'prerequisite',
        });
      }
    }
  }

  // 3. 자료구조 노드 및 엣지 추가
  for (const ds of dataStructures) {
    if (!nodeIds.has(ds.id)) {
      nodes.push({
        id: ds.id,
        type: 'data-structure',
        label: ds.name,
        category: ds.category,
        difficulty: ds.difficulty,
      });
      nodeIds.add(ds.id);
    }

    // 수학 기반 엣지 (수학 → 자료구조)
    for (const mathId of ds.mathFoundations) {
      if (nodeIds.has(mathId)) {
        edges.push({
          source: mathId,
          target: ds.id,
          type: 'foundation',
        });
      }
    }

    // 선행 자료구조 엣지
    if (ds.prerequisites) {
      for (const prereqId of ds.prerequisites) {
        edges.push({
          source: prereqId,
          target: ds.id,
          type: 'prerequisite',
        });
      }
    }
  }

  return { nodes, edges };
}

/**
 * 특정 노드를 중심으로 한 서브그래프 추출
 * @param graph 전체 그래프
 * @param centerId 중심 노드 ID
 * @param depth 탐색 깊이 (기본값: 1)
 */
export function extractSubgraph(graph: ConceptGraph, centerId: string, depth = 1): ConceptGraph {
  const includedIds = new Set<string>([centerId]);
  const visitQueue = [{ id: centerId, currentDepth: 0 }];

  // BFS로 연결된 노드 탐색
  while (visitQueue.length > 0) {
    const item = visitQueue.shift();
    if (!item) break;
    const { id, currentDepth } = item;
    if (currentDepth >= depth) continue;

    for (const edge of graph.edges) {
      let neighborId: string | null = null;
      if (edge.source === id) neighborId = edge.target;
      else if (edge.target === id) neighborId = edge.source;

      if (neighborId && !includedIds.has(neighborId)) {
        includedIds.add(neighborId);
        visitQueue.push({ id: neighborId, currentDepth: currentDepth + 1 });
      }
    }
  }

  // 서브그래프 생성
  const subNodes = graph.nodes.filter((n) => includedIds.has(n.id));
  const subEdges = graph.edges.filter(
    (e) => includedIds.has(e.source) && includedIds.has(e.target),
  );

  return { nodes: subNodes, edges: subEdges };
}

// 편의 re-exports
export { getAlgorithmById, getDataStructureById };
