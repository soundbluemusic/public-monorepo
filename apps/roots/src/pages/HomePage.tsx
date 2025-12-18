/**
 * @fileoverview 홈페이지 컴포넌트 - 미니멀 디자인
 */
import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { useI18n } from "@/i18n";
import { allConcepts } from "@/data/concepts";
import { Layout } from "@/components/layout/Layout";

export default function HomePage() {
  const { locale, t, localePath } = useI18n();

  // 추천 개념 (처음 12개)
  const featuredConcepts = () => allConcepts.slice(0, 12);

  return (
    <Layout>
      <Title>{t("heroTitle")}</Title>
      <Meta name="description" content={t("heroSubtitle")} />

      {/* Header */}
      <div class="mb-8">
        <h1 class="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          {t("heroTitle")}
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {t("heroSubtitle")}
        </p>
      </div>

      {/* Concept List */}
      <Show when={featuredConcepts().length > 0}>
        <div class="space-y-1">
          <For each={featuredConcepts()}>
            {(concept) => (
              <A
                href={localePath(`/concept/${concept.id}`)}
                class="flex items-baseline justify-between py-3 -mx-2 px-2 rounded transition-colors"
                style={{ "border-bottom": "1px solid var(--border-primary)" }}
              >
                <div class="flex items-baseline gap-3">
                  <span class="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
                    {concept.name[locale()] || concept.name.en}
                  </span>
                  <Show when={concept.formula}>
                    <span class="text-sm font-mono" style={{ color: "var(--text-tertiary)" }}>
                      {concept.formula}
                    </span>
                  </Show>
                </div>
                <span class="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {concept.field}
                </span>
              </A>
            )}
          </For>
        </div>
      </Show>

      {/* View All Link */}
      <div class="mt-8 text-center">
        <A
          href={localePath("/browse")}
          class="text-sm transition-colors"
          style={{ color: "var(--accent-primary)" }}
        >
          {t("viewAll")} →
        </A>
      </div>
    </Layout>
  );
}
