import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import DocsLayout from "@/components/layout/DocsLayout";
import { useI18n } from "@/i18n";

export default function Home() {
  const { locale } = useI18n();

  return (
    <>
      <Title>Permissive - {locale() === "ko" ? "무료 웹개발 도구 모음" : "Free Web Dev Tools"}</Title>
      <Meta
        name="description"
        content={locale() === "ko"
          ? "웹표준 API와 MIT 라이센스 라이브러리를 한눈에"
          : "Web Standard APIs and MIT licensed libraries at a glance"
        }
      />

      <DocsLayout>
        {/* Hero */}
        <div class="text-center py-12 sm:py-20">
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {locale() === "ko" ? "무료 웹개발 도구 모음" : "Free Web Dev Tools"}
          </h1>
          <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {locale() === "ko"
              ? "웹표준 API와 MIT 라이센스 라이브러리를 한눈에 보세요"
              : "Web Standard APIs and MIT licensed libraries at a glance"
            }
          </p>
        </div>

        {/* Two Main Cards */}
        <div class="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Web API Card */}
          <A
            href="/web-api"
            class="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div class="text-5xl mb-4">🌐</div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Web API
            </h2>
            <p class="text-slate-600 dark:text-slate-400 mb-4">
              {locale() === "ko"
                ? "브라우저 내장 API. 설치 없이 무료로 사용"
                : "Browser built-in APIs. Free to use, no installation"
              }
            </p>
            <div class="flex items-center text-sm text-primary-600 dark:text-primary-400 font-medium">
              {locale() === "ko" ? "둘러보기" : "Browse"}
              <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </A>

          {/* Libraries Card */}
          <A
            href="/libraries"
            class="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div class="text-5xl mb-4">📦</div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Libraries
            </h2>
            <p class="text-slate-600 dark:text-slate-400 mb-4">
              {locale() === "ko"
                ? "MIT 라이센스 오픈소스. 상업적 사용 가능"
                : "MIT licensed open source. Free for commercial use"
              }
            </p>
            <div class="flex items-center text-sm text-primary-600 dark:text-primary-400 font-medium">
              {locale() === "ko" ? "둘러보기" : "Browse"}
              <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </A>
        </div>

        {/* Built with section */}
        <div class="mt-16 text-center">
          <p class="text-sm text-slate-400 dark:text-slate-500 mb-4">
            {locale() === "ko" ? "이 사이트도 여기 있는 도구로 만들었어요" : "This site is built with tools listed here"}
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <span class="px-3 py-1.5 rounded-full text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Solid.js
            </span>
            <span class="px-3 py-1.5 rounded-full text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Tailwind CSS
            </span>
            <span class="px-3 py-1.5 rounded-full text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              TypeScript
            </span>
          </div>
        </div>
      </DocsLayout>
    </>
  );
}
