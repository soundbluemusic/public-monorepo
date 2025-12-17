/**
 * @fileoverview 즐겨찾기 페이지
 */
import { createSignal, createEffect, Show, For, onMount } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import { useI18n } from "@/i18n";
import { Layout } from "@/components/layout/Layout";
import { ConceptCard } from "@/components/concept/ConceptCard";
import { favorites } from "@/lib/db";
import { getConceptById } from "@/data/concepts";
import type { MathConcept } from "@/data/types";

export default function FavoritesPage() {
  const { locale, t } = useI18n();

  const [favoriteConcepts, setFavoriteConcepts] = createSignal<MathConcept[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);

  // 즐겨찾기 로드
  onMount(async () => {
    try {
      const favs = await favorites.getAll();
      const concepts = favs
        .map((f) => getConceptById(f.conceptId))
        .filter((c): c is MathConcept => c !== undefined);
      setFavoriteConcepts(concepts);
    } catch (e) {
      console.error("Failed to load favorites:", e);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Layout>
      <Title>{t("favorites")} - Suri</Title>
      <Meta name="description" content="Your favorite math concepts" />

      <h1
        class="text-3xl font-bold mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        {t("favorites")}
      </h1>

      <Show
        when={!isLoading()}
        fallback={
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(() => (
              <div class="skeleton h-32 rounded-xl" />
            ))}
          </div>
        }
      >
        <Show
          when={favoriteConcepts().length > 0}
          fallback={
            <div
              class="text-center py-12"
              style={{ color: "var(--text-tertiary)" }}
            >
              <p class="text-xl mb-2">
                {locale() === "ko"
                  ? "아직 즐겨찾기한 개념이 없습니다"
                  : locale() === "ja"
                  ? "お気に入りの概念がまだありません"
                  : "No favorite concepts yet"}
              </p>
              <p class="text-sm">
                {locale() === "ko"
                  ? "개념 페이지에서 ♡ 버튼을 눌러 추가하세요"
                  : locale() === "ja"
                  ? "概念ページで♡ボタンを押して追加してください"
                  : "Click the ♡ button on concept pages to add favorites"}
              </p>
            </div>
          }
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={favoriteConcepts()}>
              {(concept) => <ConceptCard concept={concept} />}
            </For>
          </div>
        </Show>
      </Show>
    </Layout>
  );
}
