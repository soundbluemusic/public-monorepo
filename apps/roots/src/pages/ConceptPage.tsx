/**
 * @fileoverview 개념 상세 페이지
 */
import { RelationLinks } from '@/components/concept/RelationLinks';
import { Layout } from '@/components/layout/Layout';
import { ExampleList } from '@/components/math/Example';
import { FormulaList } from '@/components/math/Formula';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { getFieldById } from '@/data/fields';
import { getSubfieldById } from '@/data/subfields';
import { useI18n } from '@/i18n';
import { getConceptById } from '@/lib/concepts';
import { favorites } from '@/lib/db';
import { Meta, Title } from '@solidjs/meta';
import { A, useParams } from '@solidjs/router';
import { For, Show, createResource, createSignal, onMount } from 'solid-js';

export default function ConceptPage() {
  const params = useParams<{ conceptId: string }>();
  const { locale, t, localePath } = useI18n();

  // 개념 데이터 비동기 로드
  const [concept] = createResource(
    () => params.conceptId,
    (id) => getConceptById(id),
  );

  const field = () => {
    const c = concept();
    return c ? getFieldById(c.field) : undefined;
  };
  const subfield = () => {
    const c = concept();
    return c ? getSubfieldById(c.subfield) : undefined;
  };

  // 즐겨찾기 상태
  const [isFavorite, setIsFavorite] = createSignal(false);

  onMount(async () => {
    const conceptId = params.conceptId;
    const exists = await favorites.isFavorite(conceptId);
    setIsFavorite(exists);
  });

  const toggleFavorite = async () => {
    const conceptId = params.conceptId;
    if (isFavorite()) {
      await favorites.remove(conceptId);
      setIsFavorite(false);
    } else {
      await favorites.add(conceptId);
      setIsFavorite(true);
    }
  };

  const name = () => {
    const c = concept();
    return c ? c.name[locale()] || c.name.en : '';
  };

  const content = () => {
    const c = concept();
    if (!c) return null;
    const raw = c.content[locale()] || c.content.en;
    // 문자열이면 정의만 있는 간단한 ConceptContent로 변환
    if (typeof raw === 'string') {
      return { definition: raw, examples: [] };
    }
    return raw;
  };

  return (
    <Layout>
      <Show
        when={!concept.loading && concept()}
        fallback={
          <Show
            when={concept.loading}
            fallback={
              <>
                <Title>404 - Suri</Title>
                <div class="text-center py-12">
                  <h1 class="text-2xl font-bold mb-4 text-text-primary">
                    {locale() === 'ko' ? '개념을 찾을 수 없습니다' : 'Concept not found'}
                  </h1>
                  <A href={localePath('/browse')} class="btn btn-primary">
                    {t('backToList')}
                  </A>
                </div>
              </>
            }
          >
            <div class="space-y-4 animate-pulse">
              <div class="h-8 w-48 rounded bg-bg-secondary" />
              <div class="h-12 w-64 rounded bg-bg-secondary" />
              <div class="h-32 w-full rounded bg-bg-secondary" />
            </div>
          </Show>
        }
      >
        {(c) => (
          <>
            <Title>{name()} - Suri</Title>
            <Meta name="description" content={content()?.definition} />

            {/* Breadcrumb */}
            <nav class="text-sm mb-6 text-text-tertiary">
              <A href={localePath('/')} class="hover:underline">
                {t('home')}
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
                  <h1 class="text-3xl font-bold text-text-primary">{name()}</h1>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleFavorite}
                    class="p-2 rounded-lg transition-all hover:scale-110 bg-bg-secondary border border-border-primary"
                    aria-label={isFavorite() ? 'Remove from favorites' : 'Add to favorites'}
                    title={
                      locale() === 'ko'
                        ? isFavorite()
                          ? '즐겨찾기 해제'
                          : '즐겨찾기 추가'
                        : isFavorite()
                          ? 'Remove from favorites'
                          : 'Add to favorites'
                    }
                  >
                    <span class="text-xl">{isFavorite() ? '❤️' : '🤍'}</span>
                  </button>
                  <DifficultyBadge level={c().difficulty} size="lg" />
                </div>
              </div>

              {/* English name if viewing in Korean/Japanese */}
              <Show when={locale() !== 'en' && c().name.en !== name()}>
                <p class="text-lg mb-2 text-text-tertiary">{c().name.en}</p>
              </Show>
            </header>

            <div class="space-y-8">
              {/* 정의 Definition */}
              <section>
                <h2 class="text-xl font-semibold mb-3 flex items-center gap-2 text-text-primary">
                  <span>📖</span>
                  {t('definition')}
                </h2>
                <p class="text-lg leading-relaxed text-text-secondary">{content()?.definition}</p>
              </section>

              {/* 공식 Formulas */}
              <Show when={(content()?.formulas?.length ?? 0) > 0}>
                <section>
                  <FormulaList formulas={content()?.formulas ?? []} title={t('formulas')} />
                </section>
              </Show>

              {/* 예제 Examples */}
              <Show when={(content()?.examples?.length ?? 0) > 0}>
                <section>
                  <ExampleList examples={content()?.examples} title={t('examples')} />
                </section>
              </Show>

              {/* 역사 History */}
              <Show when={content()?.history}>
                <section>
                  <h2 class="text-xl font-semibold mb-3 flex items-center gap-2 text-text-primary">
                    <span>📜</span>
                    {t('history')}
                  </h2>
                  <div class="rounded-lg p-4 bg-bg-secondary border border-border-primary">
                    <Show when={content()?.history?.discoveredBy}>
                      <p class="text-text-secondary">
                        <strong class="text-text-primary">
                          {locale() === 'ko' ? '발견자' : 'Discovered by'}:
                        </strong>{' '}
                        {content()?.history?.discoveredBy}
                        <Show when={content()?.history?.year}> ({content()?.history?.year})</Show>
                      </p>
                    </Show>
                    <Show when={content()?.history?.background}>
                      <p class="mt-2 text-text-tertiary">{content()?.history?.background}</p>
                    </Show>
                  </div>
                </section>
              </Show>

              {/* 응용 분야 Applications */}
              <Show when={(content()?.applications?.length ?? 0) > 0}>
                <section>
                  <h2 class="text-xl font-semibold mb-3 flex items-center gap-2 text-text-primary">
                    <span>⚡</span>
                    {t('applications')}
                  </h2>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <For each={content()?.applications}>
                      {(app) => (
                        <div class="rounded-lg p-3 bg-bg-secondary border border-border-primary">
                          {typeof app === 'string' ? (
                            <p class="text-text-primary">{app}</p>
                          ) : (
                            <>
                              <h4 class="font-medium mb-1 text-text-primary">{app.field}</h4>
                              <p class="text-sm text-text-tertiary">{app.description}</p>
                            </>
                          )}
                        </div>
                      )}
                    </For>
                  </div>
                </section>
              </Show>

              {/* 연관 문서 Relations */}
              <section>
                <RelationLinks relations={c().relations} />
              </section>

              {/* 태그 Tags */}
              <Show when={c().tags.length > 0}>
                <section>
                  <div class="flex flex-wrap gap-2">
                    <For each={c().tags}>
                      {(tag) => (
                        <span class="px-2 py-1 text-xs rounded-full bg-bg-tertiary text-text-tertiary">
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
