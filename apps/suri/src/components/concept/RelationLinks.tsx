/**
 * @fileoverview 연관 문서 링크 컴포넌트
 */
import { Show, For } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "@/i18n";
import type { ConceptRelations, MathConcept } from "@/data/types";

interface RelationLinksProps {
  relations: ConceptRelations;
  /** 개념 ID로 개념 찾기 함수 */
  getConcept: (id: string) => MathConcept | undefined;
}

interface RelationSectionProps {
  title: string;
  icon: string;
  ids: string[];
  type: "prerequisite" | "next" | "related" | "application";
  getConcept: (id: string) => MathConcept | undefined;
}

function RelationSection(props: RelationSectionProps) {
  const { locale, localePath } = useI18n();

  const typeStyles = {
    prerequisite: { prefix: "→", color: "var(--color-warning)" },
    next: { prefix: "←", color: "var(--color-success)" },
    related: { prefix: "↔", color: "var(--accent-primary)" },
    application: { prefix: "⚡", color: "var(--math-highlight)" },
  };

  const style = typeStyles[props.type];

  return (
    <Show when={props.ids.length > 0}>
      <div class="mb-4">
        <h4
          class="text-sm font-medium mb-2 flex items-center gap-2"
          style={{ color: "var(--text-tertiary)" }}
        >
          <span>{props.icon}</span>
          {props.title}
        </h4>
        <div class="flex flex-wrap gap-2">
          <For each={props.ids}>
            {(id) => {
              const concept = props.getConcept(id);
              const name = concept
                ? concept.name[locale()] || concept.name.en
                : id;

              return (
                <A
                  href={localePath(`/concept/${id}`)}
                  class="relation-link"
                  style={{
                    "background-color": "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span style={{ color: style.color }}>{style.prefix}</span>
                  <span>{name}</span>
                </A>
              );
            }}
          </For>
        </div>
      </div>
    </Show>
  );
}

/**
 * 연관 문서 링크 섹션
 *
 * @example
 * ```tsx
 * <RelationLinks
 *   relations={concept.relations}
 *   getConcept={(id) => conceptsMap.get(id)}
 * />
 * ```
 */
export function RelationLinks(props: RelationLinksProps) {
  const { locale } = useI18n();

  const hasAnyRelations = () => {
    const r = props.relations;
    return (
      r.prerequisites.length > 0 ||
      r.nextTopics.length > 0 ||
      r.related.length > 0 ||
      r.applications.length > 0
    );
  };

  const titles = () => ({
    prerequisites: locale() === "ko" ? "선행 개념" : locale() === "ja" ? "前提知識" : "Prerequisites",
    nextTopics: locale() === "ko" ? "후행 개념" : locale() === "ja" ? "次のトピック" : "Next Topics",
    related: locale() === "ko" ? "관련 개념" : locale() === "ja" ? "関連" : "Related",
    applications: locale() === "ko" ? "응용 분야" : locale() === "ja" ? "応用分野" : "Applications",
  });

  return (
    <Show when={hasAnyRelations()}>
      <div
        class="rounded-lg p-4"
        style={{
          "background-color": "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
        }}
      >
        <h3
          class="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: "var(--text-primary)" }}
        >
          <span>🔗</span>
          {locale() === "ko" ? "연관 문서" : locale() === "ja" ? "関連ドキュメント" : "Related Documents"}
        </h3>

        <RelationSection
          title={titles().prerequisites}
          icon="→"
          ids={props.relations.prerequisites}
          type="prerequisite"
          getConcept={props.getConcept}
        />

        <RelationSection
          title={titles().nextTopics}
          icon="←"
          ids={props.relations.nextTopics}
          type="next"
          getConcept={props.getConcept}
        />

        <RelationSection
          title={titles().related}
          icon="↔"
          ids={props.relations.related}
          type="related"
          getConcept={props.getConcept}
        />

        <RelationSection
          title={titles().applications}
          icon="⚡"
          ids={props.relations.applications}
          type="application"
          getConcept={props.getConcept}
        />
      </div>
    </Show>
  );
}
