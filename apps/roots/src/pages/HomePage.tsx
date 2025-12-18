/**
 * @fileoverview 홈페이지 컴포넌트 - 미니멀 디자인
 */
import { Layout } from '@/components/layout/Layout';
import type { MathConcept } from '@/data/types';
import { useI18n } from '@/i18n';
import { getAllConcepts, preloadConcepts } from '@/lib/concepts';
import { Meta, Title } from '@solidjs/meta';
import { A } from '@solidjs/router';
import { For, Show, createResource, onMount } from 'solid-js';

export default function HomePage() {
  const { locale, t, localePath } = useI18n();

  // 개념 데이터 비동기 로드
  const [concepts] = createResource(getAllConcepts);

  // 프리로드
  onMount(() => {
    preloadConcepts();
  });

  // 추천 개념 (처음 12개)
  const featuredConcepts = () => (concepts() ?? []).slice(0, 12);

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
      <Show when={!concepts.loading && featuredConcepts().length > 0}>
        <div class="space-y-1">
          <For each={featuredConcepts()}>
            {(concept: MathConcept) => (
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
