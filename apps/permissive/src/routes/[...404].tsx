import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import DocsLayout from "@/components/layout/DocsLayout";
import { useI18n } from "@/i18n";

export default function NotFound() {
  const { locale } = useI18n();
  const isKo = () => locale() === "ko";

  return (
    <>
      <Title>{isKo() ? "페이지를 찾을 수 없습니다" : "Page Not Found"} - Permissive</Title>
      <Meta name="robots" content="noindex" />

      <DocsLayout>
        <div class="max-w-md mx-auto text-center py-12">
          {/* 404 Illustration */}
          <div class="text-8xl mb-6">🔍</div>

          {/* Title */}
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {isKo() ? "페이지를 찾을 수 없습니다" : "Page Not Found"}
          </h1>

          {/* Description */}
          <p class="text-slate-600 dark:text-slate-400 mb-8">
            {isKo()
              ? "요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다."
              : "The page you're looking for doesn't exist or has been moved."}
          </p>

          {/* Actions */}
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <A
              href="/"
              class="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {isKo() ? "홈으로 가기" : "Go Home"}
            </A>
          </div>

          {/* Helpful Links */}
          <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h2 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
              {isKo() ? "이런 페이지는 어떠세요?" : "Try these pages instead"}
            </h2>
            <div class="flex flex-wrap gap-4 justify-center">
              <A
                href="/web-api"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span>🌐</span>
                <span>Web API</span>
              </A>
              <A
                href="/libraries"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span>📦</span>
                <span>Libraries</span>
              </A>
            </div>
          </div>
        </div>
      </DocsLayout>
    </>
  );
}
