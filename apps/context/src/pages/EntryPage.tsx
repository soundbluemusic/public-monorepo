import { Title, Meta } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { Layout } from "@/components/Layout";
import { getCategoryById } from "@/data/categories";
import { getEntryById, getEntriesByCategory } from "@/data/entries";
import type { MeaningEntry, Language } from "@/data/types";
import { useI18n } from "@/i18n";

// Get pronunciation based on locale
const getPronunciation = (entry: MeaningEntry, locale: Language): string | undefined => {
  switch (locale) {
    case "en": return entry.romanization;
    case "ja": return entry.translations.ja.reading;
    case "ko": return entry.pronunciation;
  }
};

export default function EntryPage() {
  const params = useParams();
  const { locale, t, localePath } = useI18n();

  const entry = createMemo(() => params.entryId ? getEntryById(params.entryId) : undefined);
  const category = createMemo(() => {
    const e = entry();
    return e ? getCategoryById(e.categoryId) : undefined;
  });

  const translation = createMemo(() => {
    const e = entry();
    if (!e) return null;
    return e.translations[locale()];
  });

  const pronunciation = createMemo(() => {
    const e = entry();
    if (!e) return undefined;
    return getPronunciation(e, locale());
  });

  const relatedEntries = createMemo(() => {
    const e = entry();
    if (!e) return [];
    return getEntriesByCategory(e.categoryId).filter((r) => r.id !== e.id).slice(0, 5);
  });

  return (
    <Layout>
      <Show
        when={entry()}
        fallback={
          <div class="text-center py-16">
            <p style={{ color: "var(--text-secondary)" }}>
              {locale() === "ko" ? "단어를 찾을 수 없습니다" : locale() === "ja" ? "単語が見つかりません" : "Word not found"}
            </p>
            <A href={localePath("/")} class="text-sm mt-4 inline-block" style={{ color: "var(--text-tertiary)" }}>
              ← {t("home")}
            </A>
          </div>
        }
      >
        <Title>{entry()!.korean} - Context</Title>
        <Meta name="description" content={translation()?.explanation || ""} />

        <A href={localePath("/")} class="text-sm mb-8 inline-block" style={{ color: "var(--text-tertiary)" }}>
          ← {t("backToList")}
        </A>

        <div class="mb-8">
          <h1 class="text-4xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            {entry()!.korean}
          </h1>
          <Show when={pronunciation()}>
            <p class="text-lg" style={{ color: "var(--text-tertiary)" }}>
              {pronunciation()}
            </p>
          </Show>
          <Show when={locale() === "ja" && entry()!.hanja}>
            <p class="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
              {entry()!.hanja}
            </p>
          </Show>
        </div>

        <Show when={translation()}>
          <div class="mb-8 pb-8" style={{ "border-bottom": "1px solid var(--border-primary)" }}>
            <p class="text-sm uppercase tracking-wide mb-2" style={{ color: "var(--text-tertiary)" }}>
              {locale() === "ko" ? "한국어" : locale() === "en" ? "English" : "日本語"}
            </p>
            <h2 class="text-2xl font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              {translation()!.word}
            </h2>
            <Show when={translation()!.reading}>
              <p class="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                {translation()!.reading}
              </p>
            </Show>
            <p class="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {translation()!.explanation}
            </p>
          </div>
        </Show>

        <Show when={translation()?.examples && translation()!.examples!.length > 0}>
          <div class="mb-8 pb-8" style={{ "border-bottom": "1px solid var(--border-primary)" }}>
            <p class="text-sm uppercase tracking-wide mb-3" style={{ color: "var(--text-tertiary)" }}>
              {t("examples")}
            </p>
            <ul class="space-y-2">
              <For each={translation()!.examples}>
                {(example) => (
                  <li
                    class="pl-4"
                    style={{
                      color: "var(--text-secondary)",
                      "border-left": "2px solid var(--border-primary)"
                    }}
                  >
                    {example}
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Show>

        <div class="mb-8 pb-8" style={{ "border-bottom": "1px solid var(--border-primary)" }}>
          <div class="flex flex-wrap gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span>{t(entry()!.partOfSpeech)}</span>
            <span>•</span>
            <span>{t(entry()!.difficulty)}</span>
            <Show when={category()}>
              <span>•</span>
              <A href={localePath(`/category/${category()!.id}`)} style={{ color: "var(--accent-primary)" }}>
                {category()!.name[locale()]}
              </A>
            </Show>
          </div>
        </div>

        <Show when={relatedEntries().length > 0}>
          <div>
            <p class="text-sm uppercase tracking-wide mb-3" style={{ color: "var(--text-tertiary)" }}>
              {t("relatedWords")}
            </p>
            <div class="space-y-1">
              <For each={relatedEntries()}>
                {(related) => {
                  const relatedPronunciation = getPronunciation(related, locale());
                  return (
                    <A
                      href={localePath(`/entry/${related.id}`)}
                      class="flex items-baseline justify-between py-2 transition-colors"
                    >
                      <div class="flex items-baseline gap-2">
                        <span style={{ color: "var(--text-primary)" }}>{related.korean}</span>
                        <Show when={relatedPronunciation}>
                          <span class="text-sm" style={{ color: "var(--text-tertiary)" }}>{relatedPronunciation}</span>
                        </Show>
                      </div>
                      <span class="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {related.translations[locale()].word}
                      </span>
                    </A>
                  );
                }}
              </For>
            </div>
          </div>
        </Show>
      </Show>
    </Layout>
  );
}
