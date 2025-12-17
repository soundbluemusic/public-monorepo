/**
 * @fileoverview 분야 상세 페이지
 */
import { Show, For } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { useI18n } from "@/i18n";
import { getFieldById } from "@/data/fields";
import { getSubfieldsByParent } from "@/data/subfields";
import { getConceptsByField } from "@/data/concepts";
import { Layout } from "@/components/layout/Layout";
import { ConceptCard } from "@/components/concept/ConceptCard";

export default function FieldPage() {
  const params = useParams<{ fieldId: string }>();
  const { locale, t, localePath } = useI18n();

  const field = () => getFieldById(params.fieldId as any);
  const subfields = () => getSubfieldsByParent(params.fieldId);
  const concepts = () => getConceptsByField(params.fieldId);

  return (
    <Layout>
      <Show
        when={field()}
        fallback={
          <>
            <Title>404 - Suri</Title>
            <div class="text-center py-12">
              <h1
                class="text-2xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Field not found
              </h1>
              <A
                href={localePath("/browse")}
                class="btn btn-primary"
              >
                {t("backToList")}
              </A>
            </div>
          </>
        }
      >
        {(f) => (
          <>
            <Title>
              {f().name[locale()] || f().name.en} - Suri
            </Title>
            <Meta
              name="description"
              content={f().description[locale()] || f().description.en}
            />

            {/* Breadcrumb */}
            <nav class="text-sm mb-6" style={{ color: "var(--text-tertiary)" }}>
              <A href={localePath("/")} class="hover:underline">
                {t("home")}
              </A>
              <span class="mx-2">/</span>
              <A href={localePath("/browse")} class="hover:underline">
                {t("browse")}
              </A>
              <span class="mx-2">/</span>
              <span style={{ color: "var(--text-primary)" }}>
                {f().name[locale()] || f().name.en}
              </span>
            </nav>

            {/* Header */}
            <header class="mb-8">
              <div class="flex items-center gap-4 mb-4">
                <span class="text-4xl">{f().icon}</span>
                <h1
                  class="text-3xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {f().name[locale()] || f().name.en}
                </h1>
              </div>
              <p
                class="text-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                {f().description[locale()] || f().description.en}
              </p>
            </header>

            {/* Subfields */}
            <section>
              <h2
                class="text-xl font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {locale() === "ko" ? "세부 분야" : locale() === "ja" ? "詳細分野" : "Subfields"}
              </h2>

              <Show
                when={subfields().length > 0}
                fallback={
                  <p style={{ color: "var(--text-tertiary)" }}>
                    {locale() === "ko"
                      ? "아직 세부 분야가 없습니다."
                      : locale() === "ja"
                      ? "まだ詳細分野がありません。"
                      : "No subfields available yet."}
                  </p>
                }
              >
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <For each={subfields()}>
                    {(subfield) => (
                      <A
                        href={localePath(`/field/${f().id}/${subfield.id}`)}
                        class="card hover:scale-[1.01] transition-transform"
                      >
                        <h3
                          class="font-medium mb-2"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {subfield.name[locale()] || subfield.name.en}
                        </h3>
                        <p
                          class="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {subfield.description[locale()] || subfield.description.en}
                        </p>
                      </A>
                    )}
                  </For>
                </div>
              </Show>
            </section>

            {/* Concepts in this field */}
            <Show when={concepts().length > 0}>
              <section class="mt-8">
                <h2
                  class="text-xl font-semibold mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  {locale() === "ko" ? "개념 목록" : locale() === "ja" ? "概念一覧" : "Concepts"}
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <For each={concepts()}>
                    {(concept) => <ConceptCard concept={concept} />}
                  </For>
                </div>
              </section>
            </Show>
          </>
        )}
      </Show>
    </Layout>
  );
}
