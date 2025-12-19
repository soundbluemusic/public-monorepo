import { Layout } from '@/components/Layout';
import { Meta, Title } from '@solidjs/meta';
import { A } from '@solidjs/router';

export default function NotFound() {
  return (
    <Layout>
      <Title>페이지를 찾을 수 없습니다 - 한국어 어휘 DB</Title>
      <Meta name="robots" content="noindex" />

      <div class="container-custom py-16">
        <div class="max-w-md mx-auto text-center">
          {/* 404 Icon */}
          <div class="text-8xl mb-6">🔍</div>

          {/* Title */}
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            페이지를 찾을 수 없습니다
          </h1>

          {/* Description */}
          <p class="text-gray-600 dark:text-gray-400 mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            <br />
            URL을 확인하시거나 아래 링크를 이용해 주세요.
          </p>

          {/* Actions */}
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <A href="/" class="btn-primary">
              <svg
                aria-hidden="true"
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              홈으로 가기
            </A>
            <A href="/browse" class="btn-secondary">
              <svg
                aria-hidden="true"
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              전체 어휘 보기
            </A>
          </div>

          {/* Helpful Links */}
          <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              도움이 될 수 있는 링크
            </h2>
            <div class="flex flex-wrap gap-4 justify-center text-sm">
              <A href="/about" class="text-primary-600 dark:text-primary-400 hover:underline">
                소개
              </A>
              <A href="/contribute" class="text-primary-600 dark:text-primary-400 hover:underline">
                기여하기
              </A>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
