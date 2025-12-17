/**
 * @fileoverview 개념 상세 페이지
 */
import { Show, For } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { useI18n } from "@/i18n";
import { Layout } from "@/components/layout/Layout";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { FormulaList } from "@/components/math/Formula";
import { ExampleList } from "@/components/math/Example";
import { RelationLinks } from "@/components/concept/RelationLinks";
import { getConceptById, getConceptsByField, conceptsMap } from "@/data/concepts";
import { getFieldById } from "@/data/fields";
import { getSubfieldById } from "@/data/subfields";

export default function ConceptPage() {
  const params = useParams<{ conceptId: string }>();
  const { locale, t, localePath } = useI18n();

  const concept = () => getConceptById(params.conceptId);
  const field = () => concept() && getFieldById(concept()!.field);
  const subfield = () => concept() && getSubfieldById(concept()!.subfield);

  const name = () => {
    const c = concept();
    return c ? c.name[locale()] || c.name.en : "";
  };

  const content = () => {
    const c = concept();
    return c ? c.content[locale()] || c.content.en : null;
  };

  const getConcept = (id: string) => conceptsMap.get(id);

  return (
    <Layout>
      <Show
        when={concept()}
        fallback={
          <>
            <Title>404 - Suri</Title>
            <div class="text-center py-12">
              <h1
                class="text-2xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {locale() === "ko"
                  ? "개념을 찾을 수 없습니다"
                  : "Concept not found"}
              </h1>
              <A href={localePath("/browse")} class="btn btn-primary">
                {t("backToList")}
              </A>
            </div>
          </>
        }
      >
        {(c) => (
          <>
            <Title>{name()} - Suri</Title>
            <Meta name="description" content={content()?.definition} />

            {/* Breadcrumb */}
            <nav class="text-sm mb-6" style={{ color: "var(--text-tertiary)" }}>
              <A href={localePath("/")} class="hover:underline">
                {t("home")}
              </A>
              <span class="mx-2">/</span>
              <A href={localePath(`/field/${c().field}`)} class="hover:underline">
                {field()?.name[locale()] || field()?.name.en}
              </A>
              <Show when={subfield()}>
                <span class="mx-2">/</span>
                <span>{subfield()?.name[locale()] || subfield()?.name.en}</span>
              </Show>
            </nav>

            {/* Header */}
            <header class="mb-8">
              <div class="flex items-start justify-between gap-4 mb-4">
                <div class="flex items-center gap-3">
                  <span class="text-3xl">{field()?.icon}</span>
                  <h1
                    class="text-3xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {name()}
                  </h1>
                </div>
                <DifficultyBadge level={c().difficulty} size="lg" />
              </div>

              {/* English name if viewing in Korean/Japanese */}
              <Show when={locale() !== "en" && c().name.en !== name()}>
                <p
                  class="text-lg mb-2"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {c().name.en}
                </p>
              </Show>
            </header>

            <div class="space-y-8">
              {/* 정의 Definition */}
              <section>
                <h2
                  class="text-xl font-semibold mb-3 flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span>📖</span>
                  {t("definition")}
                </h2>
                <p
                  class="text-lg leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {content()?.definition}
                </p>
              </section>

              {/* 공식 Formulas */}
              <Show when={content()?.formulas && content()!.formulas!.length > 0}>
                <section>
                  <FormulaList
                    formulas={content()!.formulas!}
                    title={t("formulas")}
                  />
                </section>
              </Show>

              {/* 예제 Examples */}
              <Show when={content()?.examples && content()!.examples.length > 0}>
                <section>
                  <ExampleList
                    examples={content()!.examples}
                    title={t("examples")}
                  />
                </section>
              </Show>

              {/* 역사 History */}
              <Show when={content()?.history}>
                <section>
                  <h2
                    class="text-xl font-semibold mb-3 flex items-center gap-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <span>📜</span>
                    {t("history")}
                  </h2>
                  <div
                    class="rounded-lg p-4"
                    style={{
                      "background-color": "var(--bg-secondary)",
                      border: "1px solid var(--border-primary)",
                    }}
                  >
                    <Show when={content()!.history!.discoveredBy}>
                      <p style={{ color: "var(--text-secondary)" }}>
                        <strong style={{ color: "var(--text-primary)" }}>
                          {locale() === "ko" ? "발견자" : "Discovered by"}:
                        </strong>{" "}
                        {content()!.history!.discoveredBy}
                        <Show when={content()!.history!.year}>
                          {" "}
                          ({content()!.history!.year})
                        </Show>
                      </p>
                    </Show>
                    <Show when={content()!.history!.background}>
                      <p
                        class="mt-2"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {content()!.history!.background}
                      </p>
                    </Show>
                  </div>
                </section>
              </Show>

              {/* 응용 분야 Applications */}
              <Show
                when={content()?.applications && content()!.applications!.length > 0}
              >
                <section>
                  <h2
                    class="text-xl font-semibold mb-3 flex items-center gap-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <span>⚡</span>
                    {t("applications")}
                  </h2>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <For each={content()!.applications}>
                      {(app) => (
                        <div
                          class="rounded-lg p-3"
                          style={{
                            "background-color": "var(--bg-secondary)",
                            border: "1px solid var(--border-primary)",
                          }}
                        >
                          <h4
                            class="font-medium mb-1"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {app.field}
                          </h4>
                          <p
                            class="text-sm"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {app.description}
                          </p>
                        </div>
                      )}
                    </For>
                  </div>
                </section>
              </Show>

              {/* 연관 문서 Relations */}
              <section>
                <RelationLinks
                  relations={c().relations}
                  getConcept={getConcept}
                />
              </section>

              {/* 태그 Tags */}
              <Show when={c().tags.length > 0}>
                <section>
                  <div class="flex flex-wrap gap-2">
                    <For each={c().tags}>
                      {(tag) => (
                        <span
                          class="px-2 py-1 text-xs rounded-full"
                          style={{
                            "background-color": "var(--bg-tertiary)",
                            color: "var(--text-tertiary)",
                          }}
                        >
                          #{tag}
                        </span>
                      )}
                    </For>
                  </div>
                </section>
              </Show>
            </div>
          </>
        )}
      </Show>
    </Layout>
  );
}
