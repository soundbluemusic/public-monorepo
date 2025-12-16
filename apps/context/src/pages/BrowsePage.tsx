import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For, createSignal, createMemo } from "solid-js";
import { Layout } from "@/components/Layout";
import { categories } from "@/data/categories";
import { meaningEntries } from "@/data/entries";
import { useI18n } from "@/i18n";

export default function BrowsePage() {
  const { locale, t, localePath } = useI18n();
  const [filter, setFilter] = createSignal<string>("all");

  const filteredEntries = createMemo(() => {
    let entries = [...meaningEntries];
    if (filter() !== "all") {
      entries = entries.filter((e) => e.categoryId === filter());
    }
    return entries.sort((a, b) => a.korean.localeCompare(b.korean, "ko"));
  });

  return (
    <Layout>
      <Title>{t("browse")} - Context</Title>
      <Meta name="description" content="Browse Korean words" />

      <div class="mb-6">
        <h1 class="text-2xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          {t("browse")}
        </h1>

        <div class="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            class="px-3 py-1.5 text-sm rounded-full transition-colors"
            style={{
              "background-color": filter() === "all" ? "var(--accent-primary)" : "var(--bg-tertiary)",
              color: filter() === "all" ? "var(--bg-primary)" : "var(--text-secondary)"
            }}
          >
            {locale() === "ko" ? "전체" : locale() === "ja" ? "全て" : "All"}
          </button>
          <For each={categories}>
            {(cat) => (
              <button
                onClick={() => setFilter(cat.id)}
                class="px-3 py-1.5 text-sm rounded-full transition-colors"
                style={{
                  "background-color": filter() === cat.id ? "var(--accent-primary)" : "var(--bg-tertiary)",
                  color: filter() === cat.id ? "var(--bg-primary)" : "var(--text-secondary)"
                }}
              >
                {cat.name[locale()]}
              </button>
            )}
          </For>
        </div>
      </div>

      <p class="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
        {filteredEntries().length} {locale() === "ko" ? "단어" : locale() === "ja" ? "単語" : "words"}
      </p>

      <div class="space-y-1">
        <For each={filteredEntries()}>
          {(entry) => {
            const translation = entry.translations[locale()];
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
    </Layout>
  );
}
