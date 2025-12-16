import { Title, Meta } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { Layout } from "@/components/Layout";
import { getCategoryById } from "@/data/categories";
import { getEntriesByCategory } from "@/data/entries";
import { useI18n } from "@/i18n";
import type { TargetLanguage } from "@/data/types";

export default function CategoryPage() {
  const params = useParams();
  const { locale, t, localePath } = useI18n();

  const category = createMemo(() => params.categoryId ? getCategoryById(params.categoryId) : undefined);
  const entries = createMemo(() => params.categoryId ? getEntriesByCategory(params.categoryId) : []);

  const getTargetLang = (): TargetLanguage => {
    return locale() === "ko" ? "en" : (locale() as TargetLanguage);
  };

  return (
    <Layout>
      <Show
        when={category()}
        fallback={
          <div class="text-center py-16">
            <p style={{ color: "var(--text-secondary)" }}>
              {locale() === "ko" ? "카테고리를 찾을 수 없습니다" : locale() === "ja" ? "カテゴリーが見つかりません" : "Category not found"}
            </p>
            <A href={localePath("/browse")} class="text-sm mt-4 inline-block" style={{ color: "var(--text-tertiary)" }}>
              ← {t("browse")}
            </A>
          </div>
        }
      >
        <Title>{category()!.name[locale()]} - Context</Title>
        <Meta name="description" content={category()!.description[locale()]} />

        <A href={localePath("/browse")} class="text-sm mb-6 inline-block" style={{ color: "var(--text-tertiary)" }}>
          ← {t("browse")}
        </A>

        <div class="mb-6">
          <h1 class="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            {category()!.name[locale()]}
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {category()!.description[locale()]}
          </p>
          <p class="text-sm mt-2" style={{ color: "var(--text-tertiary)" }}>
            {entries().length} {locale() === "ko" ? "단어" : locale() === "ja" ? "単語" : "words"}
          </p>
        </div>

        <Show
          when={entries().length > 0}
          fallback={
            <p class="text-center py-8" style={{ color: "var(--text-tertiary)" }}>
              {locale() === "ko" ? "등록된 단어가 없습니다" : locale() === "ja" ? "登録された単語がありません" : "No words available"}
            </p>
          }
        >
          <div class="space-y-1">
            <For each={entries()}>
              {(entry) => {
                const translation = entry.translations[getTargetLang()];
                return (
                  <A
                    href={localePath(`/entry/${entry.id}`)}
                    class="flex items-baseline justify-between py-3 -mx-2 px-2 rounded transition-colors"
                    style={{ "border-bottom": "1px solid var(--border-primary)" }}
                  >
                    <div class="flex items-baseline gap-3">
                      <span class="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
                        {entry.korean}
                      </span>
                      <span class="text-sm" style={{ color: "var(--text-tertiary)" }}>
                        {entry.romanization}
                      </span>
                    </div>
                    <span class="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {translation.word}
                    </span>
                  </A>
                );
              }}
            </For>
          </div>
        </Show>
      </Show>
    </Layout>
  );
}
