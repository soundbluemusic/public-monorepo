/**
 * @fileoverview 공유 BrowsePage 컴포넌트
 *
 * 영어(/browse)와 한글(/ko/browse) 라우트에서 공유되는 페이지 컴포넌트입니다.
 * 라우트 파일에서는 이 컴포넌트만 import하여 사용합니다.
 */

import { useAutoAnimate } from '@soundblue/ui/hooks';
import { Pagination } from '@soundblue/ui/patterns';
import { Link, useNavigate } from '@tanstack/react-router';
import { lazy, Suspense, useMemo, useState } from 'react';
import { buildConceptGraph, type GraphNode } from '../../data/algorithms';
import { allConcepts, lightConcepts } from '../../data/concepts';
import { fields } from '../../data/fields';
import { getSubfieldsByParent } from '../../data/subfields';
import { useI18n } from '../../i18n';
import { Layout } from '../layout/Layout';
import { BrowseTabs } from './BrowseTabs';
import { ConceptFilters } from './ConceptFilters';
import { LightConceptCard } from './LightConceptCard';
import { useBrowseFilters } from './useBrowseFilters';

// Lazy load ConceptGraph (D3.js ~500KB)
const ConceptGraph = lazy(() => import('../graph').then((m) => ({ default: m.ConceptGraph })));

export function BrowsePage() {
  const { locale, t, localePath } = useI18n();
  const navigate = useNavigate();

  const {
    viewMode,
    filterDifficulty,
    filterField,
    sortBy,
    currentPage,
    setViewMode,
    toggleDifficulty,
    setFilterField,
    setSortBy,
    paginatedConcepts,
    totalPages,
    totalCount,
    handlePageChange,
    resetFilters,
  } = useBrowseFilters();

  const [conceptsGridRef] = useAutoAnimate<HTMLDivElement>();

  // 그래프 데이터 생성 (메모이제이션)
  const graphData = useMemo(() => {
    const mathConceptsForGraph = allConcepts.map((c) => ({
      id: c.id,
      name: c.name,
      difficulty: c.difficulty,
      field: c.field,
    }));
    return buildConceptGraph(mathConceptsForGraph);
  }, []);

  // 그래프 노드 클릭 핸들러
  const handleNodeClick = (node: GraphNode) => {
    if (node.type === 'math') {
      navigate({ to: localePath(`/concept/${node.id}`) });
    }
  };

  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-(--text-primary) mb-6">{t('browse')}</h1>

      {/* 탭 */}
      <BrowseTabs viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* 분야별 보기 */}
      {viewMode === 'fields' && (
        <div id="fields-panel" role="tabpanel" aria-labelledby="fields-tab" className="space-y-8">
          {fields.map((field) => {
            const subfields = getSubfieldsByParent(field.id);
            return (
              <section
                key={field.id}
                className="p-6 rounded-xl bg-(--bg-elevated) border border-(--border-primary)"
              >
                <Link
                  to={localePath(`/field/${field.id}`)}
                  className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity"
                >
                  <span className="text-3xl">{field.icon}</span>
                  <h2 className="text-xl font-semibold text-(--text-primary)">
                    {field.name[locale] || field.name.en}
                  </h2>
                </Link>
                <p className="text-(--text-secondary) mt-2 mb-4">
                  {field.description[locale] || field.description.en}
                </p>

                {subfields.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {subfields.map((subfield) => (
                      <span
                        key={subfield.id}
                        className="px-3 py-1.5 rounded-full text-sm bg-(--bg-tertiary) text-(--text-secondary)"
                      >
                        {subfield.name[locale] || subfield.name.en}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* 전체 개념 보기 */}
      {viewMode === 'concepts' && (
        <div id="concepts-panel" role="tabpanel" aria-labelledby="concepts-tab">
          {/* 필터 */}
          <ConceptFilters
            filterDifficulty={filterDifficulty}
            filterField={filterField}
            sortBy={sortBy}
            onToggleDifficulty={toggleDifficulty}
            onFieldChange={setFilterField}
            onSortChange={setSortBy}
            onReset={resetFilters}
            totalCount={lightConcepts.length}
            filteredCount={totalCount}
          />

          {/* 결과 수 */}
          <div className="mb-4 text-sm text-(--text-tertiary)">
            {totalCount} {locale === 'ko' ? '개의 개념' : 'concepts'}
          </div>

          {/* 개념 그리드 */}
          <div ref={conceptsGridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedConcepts.map((concept) => (
              <LightConceptCard key={concept.id} concept={concept} />
            ))}
          </div>

          {/* 페이지네이션 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* 관계 그래프 보기 */}
      {viewMode === 'graph' && (
        <div id="graph-panel" role="tabpanel" aria-labelledby="graph-tab">
          {/* 그래프 설명 */}
          <div className="mb-4 p-4 rounded-lg bg-(--bg-elevated) border border-(--border-primary)">
            <p className="text-(--text-secondary) text-sm">{t('graphDescription')}</p>
            <div className="flex gap-4 mt-2 text-xs text-(--text-tertiary)">
              <span>{t('nodesCount', { count: graphData.nodes.length })}</span>
              <span>{t('edgesCount', { count: graphData.edges.length })}</span>
            </div>
          </div>

          {/* 그래프 시각화 */}
          <div className="relative rounded-lg border border-(--border-primary)">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-150 bg-(--bg-secondary)">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-(--accent-primary) border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-(--text-secondary)">{t('loading')}</p>
                  </div>
                </div>
              }
            >
              <ConceptGraph
                data={graphData}
                width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 48, 1200) : 800}
                height={600}
                onNodeClick={handleNodeClick}
                onNodeHover={setHoveredNode}
                highlightedNodeId={hoveredNode?.id}
              />
            </Suspense>
          </div>

          {/* 선택된 노드 정보 */}
          {hoveredNode && (
            <div className="mt-4 p-4 rounded-lg bg-(--bg-elevated) border border-(--border-primary)">
              <h3 className="font-medium text-(--text-primary)">
                {hoveredNode.label[locale] || hoveredNode.label.en}
              </h3>
              <p className="text-sm text-(--text-secondary) mt-1">
                {hoveredNode.type === 'math' && t('mathConcepts')}
                {hoveredNode.type === 'algorithm' && t('algorithms')}
                {hoveredNode.type === 'data-structure' && t('dataStructures')}
                {' • '}
                {hoveredNode.category}
              </p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
