import DocsLayout from '@/components/layout/DocsLayout';
import { getLibraryById } from '@/data';
import { useI18n } from '@/i18n';
import { Meta, Title } from '@solidjs/meta';
import { A, useParams } from '@solidjs/router';
import { For, Show } from 'solid-js';

export default function LibraryDetailPage() {
  const params = useParams();
  const { locale } = useI18n();
  const isKo = () => locale() === 'ko';

  const lib = () => getLibraryById(params.libId ?? '');

  return (
    <>
      <Show
        when={lib()}
        fallback={
          <>
            <Title>
              {isKo() ? '라이브러리를 찾을 수 없습니다' : 'Library Not Found'} - Permissive
            </Title>
            <DocsLayout>
              <div class="text-center py-16">
                <div class="text-6xl mb-4">📦</div>
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {isKo() ? '라이브러리를 찾을 수 없습니다' : 'Library Not Found'}
                </h1>
                <p class="text-slate-600 dark:text-slate-400 mb-6">
                  {isKo()
                    ? '요청하신 라이브러리 정보가 없습니다.'
                    : 'The requested library information is not available.'}
                </p>
                <A
                  href="/libraries"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {isKo() ? '← 라이브러리 목록으로' : '← Back to Libraries'}
                </A>
              </div>
            </DocsLayout>
          </>
        }
      >
        <Title>{lib()?.name} - Libraries - Permissive</Title>
        <Meta name="description" content={isKo() ? lib()?.descriptionKo : lib()?.description} />

        <DocsLayout>
          {/* Breadcrumb */}
          <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
            <A href="/" class="hover:text-primary-500">
              Home
            </A>
            <span>/</span>
            <A href="/libraries" class="hover:text-primary-500">
              Libraries
            </A>
            <span>/</span>
            <span class="text-slate-900 dark:text-white">{lib()?.name}</span>
          </nav>

          {/* Header */}
          <div class="mb-8">
            <div class="flex flex-wrap items-center gap-3 mb-4">
              <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium">
                {lib()?.category}
              </span>
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
                {lib()?.license}
              </span>
              <span class="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm font-medium">
                <svg class="w-4 h-4" fill="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {lib()?.stars}
              </span>
              <Show when={lib()?.usedHere}>
                <span class="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium">
                  {isKo() ? '이 사이트에서 사용 중' : 'Used in this site'}
                </span>
              </Show>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">{lib()?.name}</h1>
            <p class="text-lg text-slate-600 dark:text-slate-400">
              {isKo() ? lib()?.descriptionKo : lib()?.description}
            </p>
          </div>

          {/* Features */}
          <Show when={lib()?.features}>
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                {isKo() ? '주요 기능' : 'Key Features'}
              </h2>
              <ul class="grid sm:grid-cols-2 gap-3">
                <For each={isKo() ? lib()?.featuresKo : lib()?.features}>
                  {(feature) => (
                    <li class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <svg
                        aria-hidden="true"
                        class="w-5 h-5 text-green-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span class="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  )}
                </For>
              </ul>
            </section>
          </Show>

          {/* Alternatives */}
          <Show when={(lib()?.alternatives?.length ?? 0) > 0}>
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                {isKo() ? '대안' : 'Alternatives'}
              </h2>
              <div class="flex flex-wrap gap-2">
                <For each={lib()?.alternatives}>
                  {(alt) => (
                    <span class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm">
                      {alt}
                    </span>
                  )}
                </For>
              </div>
            </section>
          </Show>

          {/* Links */}
          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <a
              href={lib()?.github}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <Show when={lib()?.npm}>
              <a
                href={`https://www.npmjs.com/package/${lib()?.npm}`}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
              >
                <svg class="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
                </svg>
                npm
              </a>
            </Show>
            <A
              href="/libraries"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {isKo() ? '← 목록으로' : '← Back to List'}
            </A>
          </div>
        </DocsLayout>
      </Show>
    </>
  );
}
