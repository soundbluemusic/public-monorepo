/**
 * @fileoverview 홈페이지 컴포넌트 - 미니멀 디자인
 *
 * 홈페이지는 경량 search-index.json만 사용하여 빠른 로딩 제공
 */
import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';
import { preloadSearchIndex } from '@/lib/search';
import type { SearchIndexItem } from '@/lib/search';
import { Meta, Title } from '@solidjs/meta';
import { A } from '@solidjs/router';
import { For, Show, createResource, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';

// 홈페이지용 경량 데이터 로드 (search-index.json 재사용)
async function getFeaturedConcepts(): Promise<SearchIndexItem[]> {
  if (isServer) return [];
  const res = await fetch('/search-index.json');
  const data: SearchIndexItem[] = await res.json();
  return data.slice(0, 12);
}

export default function HomePage() {
  const { locale, t, localePath } = useI18n();

  // 경량 데이터 로드 (176KB search-index 중 12개만)
  const [concepts] = createResource(getFeaturedConcepts);

  // 검색 인덱스 프리로드
  onMount(() => {
    preloadSearchIndex();
  });

  return (
    <Layout>
      <Title>{t('heroTitle')}</Title>
      <Meta name="description" content={t('heroSubtitle')} />

      {/* Header */}
      <div class="mb-8">
        <h1 class="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('heroTitle')}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('heroSubtitle')}</p>
      </div>

      {/* Concept List */}
      <Show when={!concepts.loading && (concepts() ?? []).length > 0}>
        <div class="space-y-1">
          <For each={concepts() ?? []}>
            {(concept) => (
              <A
                href={localePath(`/concept/${concept.id}`)}
                class="flex items-baseline justify-between py-3 -mx-2 px-2 rounded transition-colors"
                style={{ 'border-bottom': '1px solid var(--border-primary)' }}
              >
                <div class="flex items-baseline gap-3">
                  <span class="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                    {concept.name[locale()] || concept.name.en}
                  </span>
                </div>
                <span class="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {concept.field}
                </span>
              </A>
            )}
          </For>
        </div>
      </Show>

      {/* Loading */}
      <Show when={concepts.loading}>
        <div class="space-y-3">
          <For each={Array(6).fill(0)}>
            {() => (
              <div
                class="h-12 rounded animate-pulse"
                style={{ 'background-color': 'var(--bg-secondary)' }}
              />
            )}
          </For>
        </div>
      </Show>

      {/* View All Link */}
      <div class="mt-8 text-center">
        <A
          href={localePath('/browse')}
          class="text-sm transition-colors"
          style={{ color: 'var(--accent-primary)' }}
        >
          {t('viewAll')} →
        </A>
      </div>
    </Layout>
  );
}
