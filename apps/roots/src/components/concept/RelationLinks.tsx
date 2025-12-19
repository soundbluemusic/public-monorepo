/**
 * @fileoverview 연관 문서 링크 컴포넌트
 * 클라이언트 사이드에서 concept-names.json을 fetch하여 이름 표시
 */
import type { ConceptRelations } from '@/data/types';
import { useI18n } from '@/i18n';
import { A } from '@solidjs/router';
import { For, Show, createResource } from 'solid-js';
import { isServer } from 'solid-js/web';

type ConceptNames = Record<string, { ko: string; en: string }>;

// 클라이언트에서만 concept-names.json fetch
async function loadConceptNames(): Promise<ConceptNames> {
  if (isServer) return {};
  try {
    const res = await fetch('/concept-names.json');
    return res.json();
  } catch {
    return {};
  }
}

interface RelationLinksProps {
  relations: ConceptRelations;
}

interface RelationSectionProps {
  title: string;
  icon: string;
  ids: string[];
  type: 'prerequisite' | 'next' | 'related' | 'application';
  names: ConceptNames;
}

function RelationSection(props: RelationSectionProps) {
  const { locale, localePath } = useI18n();

  const typeStyles = {
    prerequisite: { prefix: '→', color: 'var(--color-warning)' },
    next: { prefix: '←', color: 'var(--color-success)' },
    related: { prefix: '↔', color: 'var(--accent-primary)' },
    application: { prefix: '⚡', color: 'var(--math-highlight)' },
  };

  const style = typeStyles[props.type];

  return (
    <Show when={props.ids.length > 0}>
      <div class="mb-4">
        <h4
          class="text-sm font-medium mb-2 flex items-center gap-2"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <span>{props.icon}</span>
          {props.title}
        </h4>
        <div class="flex flex-wrap gap-2">
          <For each={props.ids}>
            {(id) => {
              const conceptName = props.names[id];
              const name = conceptName ? conceptName[locale()] || conceptName.en : id;

              return (
                <A
                  href={localePath(`/concept/${id}`)}
                  class="relation-link"
                  style={{
                    'background-color': 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
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
 * 클라이언트 사이드에서 이름을 로드하여 hydration 데이터 최소화
 */
export function RelationLinks(props: RelationLinksProps) {
  const { locale } = useI18n();

  // 클라이언트에서만 이름 로드
  const [names] = createResource(loadConceptNames);

  const hasAnyRelations = () => {
    const r = props.relations;
    return (
      r.prerequisites.length > 0 ||
      r.nextTopics.length > 0 ||
      r.related.length > 0 ||
      (r.applications?.length ?? 0) > 0
    );
  };

  const titles = () => ({
    prerequisites: locale() === 'ko' ? '선행 개념' : 'Prerequisites',
    nextTopics: locale() === 'ko' ? '후행 개념' : 'Next Topics',
    related: locale() === 'ko' ? '관련 개념' : 'Related',
    applications: locale() === 'ko' ? '응용 분야' : 'Applications',
  });

  return (
    <Show when={hasAnyRelations()}>
      <div
        class="rounded-lg p-4"
        style={{
          'background-color': 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <h3
          class="text-lg font-semibold mb-4 flex items-center gap-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <span>🔗</span>
          {locale() === 'ko' ? '연관 문서' : 'Related Documents'}
        </h3>

        <Show when={names()} fallback={<div class="text-text-tertiary text-sm">Loading...</div>}>
          {(loadedNames) => (
            <>
              <RelationSection
                title={titles().prerequisites}
                icon="→"
                ids={props.relations.prerequisites}
                type="prerequisite"
                names={loadedNames()}
              />

              <RelationSection
                title={titles().nextTopics}
                icon="←"
                ids={props.relations.nextTopics}
                type="next"
                names={loadedNames()}
              />

              <RelationSection
                title={titles().related}
                icon="↔"
                ids={props.relations.related}
                type="related"
                names={loadedNames()}
              />

              <RelationSection
                title={titles().applications}
                icon="⚡"
                ids={props.relations.applications ?? []}
                type="application"
                names={loadedNames()}
              />
            </>
          )}
        </Show>
      </div>
    </Show>
  );
}
