import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Layout } from "@/components/Layout";
import { getFeaturedEntries } from "@/data/entries";
import type { MeaningEntry, Language } from "@/data/types";
import { useI18n } from "@/i18n";

// Get pronunciation based on locale
const getPronunciation = (entry: MeaningEntry, locale: Language): string | undefined => {
  switch (locale) {
    case "en": return entry.romanization;
    case "ko": return entry.pronunciation;
  }
};

export default function HomePage() {
  const { locale, t, localePath } = useI18n();
  const featuredEntries = getFeaturedEntries(12);

  const getMetaDescription = () => {
    if (locale() === "ko") return "한국어 학습자를 위한 의미 사전";
    return "Meaning dictionary for Korean learners";
  };

  return (
    <Layout>
      <Title>Context</Title>
      <Meta name="description" content={getMetaDescription()} />

      <div class="mb-8">
        <h1 class="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          {locale() === "ko" ? "한국어 의미 사전" : "Korean Dictionary"}
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {locale() === "ko"
            ? "한국어 단어의 의미를 영어로 설명합니다"
            : "Korean words explained in English"}
        </p>
      </div>

      <div class="space-y-1">
        <For each={featuredEntries}>
          {(entry) => {
            const translation = entry.translations[locale()];
            const pronunciation = getPronunciation(entry, locale());
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
                  <Show when={pronunciation}>
                    <span class="text-sm" style={{ color: "var(--text-tertiary)" }}>
                      {pronunciation}
                    </span>
                  </Show>
                </div>
                <span class="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {translation.word}
                </span>
              </A>
            );
          }}
        </For>
      </div>

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
