import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { Layout } from "@/components/Layout";

export default function Contribute() {
  return (
    <Layout>
      <Title>기여하기 - 한국어 어휘 데이터베이스</Title>
      <Meta
        name="description"
        content="한국어 어휘 데이터베이스에 기여하는 방법"
      />

      <div class="container-custom py-8">
        {/* 브레드크럼 */}
        <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <A href="/" class="hover:text-primary-600 dark:hover:text-primary-400">
            홈
          </A>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-gray-900 dark:text-white">기여하기</span>
        </nav>

        <div class="max-w-4xl">
          {/* 헤더 */}
          <div class="mb-12">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              기여하기
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              한국어 어휘 데이터베이스를 함께 만들어주세요
            </p>
          </div>

          {/* 기여 방법 */}
          <section class="card p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              기여할 수 있는 방법
            </h2>
            <div class="space-y-6">
              <div class="flex gap-4">
                <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                    새 어휘 추가
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    아직 등록되지 않은 어휘, 신조어, 사투리 등을 추가해주세요.
                    특히 최신 유행어나 특정 지역의 사투리는 큰 도움이 됩니다.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                    오류 수정
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    잘못된 정의, 오타, 부적절한 예문 등을 발견하시면 알려주세요.
                    정확한 정보가 데이터베이스의 가치를 높입니다.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                    개선 제안
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    UI/UX 개선, 새로운 기능, 카테고리 구조 변경 등
                    프로젝트를 발전시킬 아이디어를 공유해주세요.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                    번역/국제화
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    영어, 일본어, 중국어 등 다국어 설명을 추가하여
                    외국인 한국어 학습자들에게 도움을 줄 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 가이드라인 */}
          <section class="card p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              기여 가이드라인
            </h2>
            <div class="space-y-4 text-gray-600 dark:text-gray-400">
              <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                  어휘 추가 시
                </h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>명확하고 객관적인 정의를 작성해주세요</li>
                  <li>최소 2개 이상의 예문을 포함해주세요</li>
                  <li>적절한 카테고리와 태그를 지정해주세요</li>
                  <li>발음이 특이한 경우 발음 표기를 추가해주세요</li>
                </ul>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                  콘텐츠 작성 원칙
                </h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>중립적이고 객관적인 시각을 유지해주세요</li>
                  <li>욕설, 혐오 표현은 학술적 목적으로만 수록합니다</li>
                  <li>출처가 명확한 정보를 우선합니다</li>
                  <li>저작권을 존중해주세요</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 연락처 */}
          <section class="card p-6 md:p-8 mb-8 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-primary-100 dark:border-primary-800">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              문의하기
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              기여 방법에 대해 궁금한 점이 있거나, 직접 기여를 원하시면
              아래 방법으로 연락해주세요.
            </p>
            <div class="flex flex-wrap gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href="mailto:contact@example.com"
                class="btn-secondary"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                이메일
              </a>
            </div>
          </section>

          {/* 감사 인사 */}
          <div class="text-center py-8">
            <p class="text-xl text-gray-600 dark:text-gray-400">
              여러분의 기여가 한국어 어휘 데이터베이스를 더 풍성하게 만듭니다.
            </p>
            <p class="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-2">
              감사합니다! 🙏
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
