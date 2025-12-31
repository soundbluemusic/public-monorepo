/**
 * @fileoverview D3.js 기반 개념 관계 그래프 시각화 컴포넌트
 *
 * Canvas 렌더링으로 대규모 그래프 (10만+ 노드) 지원
 * - 인터랙션: 드래그, 줌, 패닝, 호버, 클릭
 * - 노드 타입: 수학, 알고리즘, 자료구조
 * - 엣지 타입: 기반, 선행, 사용, 관련
 */

import * as d3 from 'd3';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ConceptGraph as ConceptGraphData,
  EdgeType,
  GraphNode,
  NodeType,
} from '@/data/algorithms';
import { useI18n } from '@/i18n';

// ============================================================================
// Types
// ============================================================================

interface SimulationNode extends GraphNode {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  source: SimulationNode;
  target: SimulationNode;
  type: EdgeType;
}

interface ConceptGraphProps {
  data: ConceptGraphData;
  width?: number;
  height?: number;
  onNodeClick?: (node: GraphNode) => void;
  onNodeHover?: (node: GraphNode | null) => void;
  highlightedNodeId?: string | null;
}

// ============================================================================
// Constants
// ============================================================================

/** 노드 타입별 색상 */
const NODE_COLORS: Record<NodeType, string> = {
  math: '#3b82f6', // blue-500
  algorithm: '#22c55e', // green-500
  'data-structure': '#f59e0b', // amber-500
};

/** 엣지 타입별 색상 */
const EDGE_COLORS: Record<EdgeType, string> = {
  foundation: '#94a3b8', // slate-400
  prerequisite: '#f97316', // orange-500
  uses: '#8b5cf6', // violet-500
  related: '#64748b', // slate-500
};

/** 난이도별 노드 크기 (반지름) */
const DIFFICULTY_RADIUS: Record<number, number> = {
  1: 8,
  2: 10,
  3: 12,
  4: 14,
  5: 16,
};

/** 노드의 반지름 가져오기 (기본값 포함) */
function getNodeRadius(difficulty: number): number {
  return DIFFICULTY_RADIUS[difficulty] ?? 10;
}

// ============================================================================
// Component
// ============================================================================

export function ConceptGraph({
  data,
  width = 800,
  height = 600,
  onNodeClick,
  onNodeHover,
  highlightedNodeId,
}: ConceptGraphProps) {
  const { locale } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [hoveredNode, setHoveredNode] = useState<SimulationNode | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);

  // Refs for simulation data (to avoid re-renders)
  const nodesRef = useRef<SimulationNode[]>([]);
  const linksRef = useRef<SimulationLink[]>([]);
  const simulationRef = useRef<d3.Simulation<SimulationNode, SimulationLink> | null>(null);

  // Initialize simulation data
  useEffect(() => {
    // Clone nodes with positions
    nodesRef.current = data.nodes.map((node) => ({
      ...node,
      x: node.x ?? Math.random() * width,
      y: node.y ?? Math.random() * height,
    }));

    // Create node map for link resolution
    const nodeMap = new Map(nodesRef.current.map((n) => [n.id, n]));

    // Clone edges with resolved source/target
    linksRef.current = data.edges
      .map((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) return null;
        return { source, target, type: edge.type };
      })
      .filter((link): link is SimulationLink => link !== null);
  }, [data, width, height]);

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nodes = nodesRef.current;
    const links = linksRef.current;

    // Clear canvas
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply zoom transform
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    // Draw edges
    ctx.lineWidth = 1 / transform.k;
    for (const link of links) {
      ctx.beginPath();
      ctx.strokeStyle = EDGE_COLORS[link.type];
      ctx.globalAlpha = hoveredNode
        ? link.source.id === hoveredNode.id || link.target.id === hoveredNode.id
          ? 0.8
          : 0.1
        : 0.4;
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.stroke();
    }

    // Draw nodes
    ctx.globalAlpha = 1;
    for (const node of nodes) {
      const radius = getNodeRadius(node.difficulty) / transform.k;
      const isHighlighted = highlightedNodeId === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const isConnected =
        hoveredNode &&
        links.some(
          (l) =>
            (l.source.id === hoveredNode.id && l.target.id === node.id) ||
            (l.target.id === hoveredNode.id && l.source.id === node.id),
        );

      // Node fill
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = NODE_COLORS[node.type];
      ctx.globalAlpha = hoveredNode ? (isHovered || isConnected ? 1 : 0.2) : 1;
      ctx.fill();

      // Highlight ring
      if (isHighlighted || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 3 / transform.k, 0, 2 * Math.PI);
        ctx.strokeStyle = isHovered ? '#fff' : '#fbbf24';
        ctx.lineWidth = 2 / transform.k;
        ctx.stroke();
      }
    }

    // Draw labels for zoomed in view or hovered nodes
    if (transform.k > 1.5 || hoveredNode) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#f8fafc';
      ctx.font = `${12 / transform.k}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (const node of nodes) {
        const shouldShowLabel =
          transform.k > 1.5 ||
          node.id === hoveredNode?.id ||
          (hoveredNode &&
            links.some(
              (l) =>
                (l.source.id === hoveredNode.id && l.target.id === node.id) ||
                (l.target.id === hoveredNode.id && l.source.id === node.id),
            ));

        if (shouldShowLabel) {
          const radius = getNodeRadius(node.difficulty) / transform.k;
          const label = node.label[locale] || node.label.en;
          ctx.fillText(label, node.x, node.y + radius + 4 / transform.k);
        }
      }
    }

    ctx.restore();
  }, [transform, hoveredNode, highlightedNodeId, width, height, locale]);

  // Setup D3 simulation and interactions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const nodes = nodesRef.current;
    const links = linksRef.current;

    // Create simulation
    const simulation = d3
      .forceSimulation<SimulationNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimulationNode, SimulationLink>(links)
          .id((d) => d.id)
          .distance(100),
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide<SimulationNode>().radius((d) => getNodeRadius(d.difficulty) + 5),
      )
      .on('tick', draw);

    simulationRef.current = simulation;

    // Zoom behavior
    const zoom = d3
      .zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.1, 10])
      .on('zoom', (event: d3.D3ZoomEvent<HTMLCanvasElement, unknown>) => {
        setTransform(event.transform);
      });

    // Drag behavior
    const dragSubject = (event: d3.D3DragEvent<HTMLCanvasElement, unknown, SimulationNode>) => {
      const [x, y] = transform.invert([event.x, event.y]);
      for (const node of nodes) {
        const dx = x - node.x;
        const dy = y - node.y;
        const radius = getNodeRadius(node.difficulty);
        if (dx * dx + dy * dy < radius * radius) {
          return node;
        }
      }
      return undefined;
    };

    const drag = d3
      .drag<HTMLCanvasElement, unknown, SimulationNode | undefined>()
      .subject(dragSubject)
      .on('start', (event) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        if (event.subject) {
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }
      })
      .on('drag', (event) => {
        if (event.subject) {
          const [x, y] = transform.invert([event.x, event.y]);
          event.subject.fx = x;
          event.subject.fy = y;
        }
      })
      .on('end', (event) => {
        if (!event.active) simulation.alphaTarget(0);
        if (event.subject) {
          event.subject.fx = null;
          event.subject.fy = null;
        }
      });

    // Apply behaviors
    const selection = d3.select(canvas);
    // D3 타입 호환성을 위해 unknown 사용
    selection.call(
      zoom as unknown as (
        selection: d3.Selection<HTMLCanvasElement, unknown, null, undefined>,
      ) => void,
    );
    selection.call(
      drag as unknown as (
        selection: d3.Selection<HTMLCanvasElement, unknown, null, undefined>,
      ) => void,
    );

    // Mouse move for hover detection
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const [tx, ty] = transform.invert([x, y]);

      let found: SimulationNode | null = null;
      for (const node of nodes) {
        const dx = tx - node.x;
        const dy = ty - node.y;
        const radius = getNodeRadius(node.difficulty);
        if (dx * dx + dy * dy < radius * radius) {
          found = node;
          break;
        }
      }

      setHoveredNode(found);
      onNodeHover?.(found);

      // Update tooltip position
      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${event.clientX - rect.left + 10}px`;
        tooltipRef.current.style.top = `${event.clientY - rect.top + 10}px`;
      }
    };

    // Click handler
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const [tx, ty] = transform.invert([x, y]);

      for (const node of nodes) {
        const dx = tx - node.x;
        const dy = ty - node.y;
        const radius = getNodeRadius(node.difficulty);
        if (dx * dx + dy * dy < radius * radius) {
          onNodeClick?.(node);
          break;
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    // Initial draw
    draw();

    return () => {
      simulation.stop();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- data는 외부에서 안정적으로 전달됨
  }, [width, height, transform, draw, onNodeClick, onNodeHover]);

  // Redraw on state changes
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="bg-(--bg-secondary) rounded-lg cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />

      {/* Tooltip */}
      {hoveredNode && (
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none z-10 px-3 py-2 rounded-lg bg-(--bg-elevated) border border-(--border-primary) shadow-lg"
        >
          <div className="font-medium text-(--text-primary)">
            {hoveredNode.label[locale] || hoveredNode.label.en}
          </div>
          <div className="text-xs text-(--text-secondary) mt-1">
            <NodeTypeLabel type={hoveredNode.type} />
            <span className="mx-1">•</span>
            <DifficultyDots level={hoveredNode.difficulty} />
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-(--bg-elevated)/90 border border-(--border-primary) text-xs">
        <div className="font-medium mb-2 text-(--text-primary)">범례</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.math }} />
            <span className="text-(--text-secondary)">수학 개념</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: NODE_COLORS.algorithm }}
            />
            <span className="text-(--text-secondary)">알고리즘</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: NODE_COLORS['data-structure'] }}
            />
            <span className="text-(--text-secondary)">자료구조</span>
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 text-xs text-(--text-tertiary)">
        드래그: 이동 • 스크롤: 줌 • 클릭: 상세보기
      </div>
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function NodeTypeLabel({ type }: { type: NodeType }) {
  const labels: Record<NodeType, string> = {
    math: '수학',
    algorithm: '알고리즘',
    'data-structure': '자료구조',
  };
  return <span>{labels[type]}</span>;
}

function DifficultyDots({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i <= level ? 'bg-amber-400' : 'bg-slate-600'}`}
        />
      ))}
    </span>
  );
}
