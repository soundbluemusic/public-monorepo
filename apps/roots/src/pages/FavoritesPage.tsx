import { ConceptCard } from '@/components/concept/ConceptCard';
/**
 * @fileoverview 즐겨찾기 페이지
 */
import { Layout } from '@/components/layout/Layout';
import type { MathConcept } from '@/data/types';
import { useI18n } from '@/i18n';
import { getConceptById } from '@/lib/concepts';
import { favorites } from '@/lib/db';
import { Meta, Title } from '@solidjs/meta';
import { For, Show, createSignal, onMount } from 'solid-js';

export default function FavoritesPage() {
  const { locale, t } = useI18n();

  const [favoriteConcepts, setFavoriteConcepts] = createSignal<MathConcept[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);

  // 즐겨찾기 로드
  onMount(async () => {
    try {
      const favs = await favorites.getAll();
      const concepts = await Promise.all(favs.map((f) => getConceptById(f.conceptId)));
      setFavoriteConcepts(concepts.filter((c): c is MathConcept => c !== undefined));
    } catch (e) {
      console.error('Failed to load favorites:', e);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Layout>
      <Title>{t('favorites')} - Suri</Title>
      <Meta name="description" content="Your favorite math concepts" />

      <h1 class="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        {t('favorites')}
      </h1>

      <Show
        when={!isLoading()}
        fallback={
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={[1, 2, 3]}>
              {() => (
                <div
                  class="h-32 rounded-xl animate-pulse"
                  style={{ 'background-color': 'var(--bg-secondary)' }}
                />
              )}
            </For>
          </div>
        }
      >
        <Show
          when={favoriteConcepts().length > 0}
          fallback={
            <div class="text-center py-12" style={{ color: 'var(--text-tertiary)' }}>
              <p class="text-xl mb-2">
                {locale() === 'ko' ? '아직 즐겨찾기한 개념이 없습니다' : 'No favorite concepts yet'}
              </p>
              <p class="text-sm">
                {locale() === 'ko'
                  ? '개념 페이지에서 ♡ 버튼을 눌러 추가하세요'
                  : 'Click the ♡ button on concept pages to add favorites'}
              </p>
            </div>
          }
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={favoriteConcepts()}>{(concept) => <ConceptCard concept={concept} />}</For>
          </div>
        </Show>
      </Show>
    </Layout>
  );
}
