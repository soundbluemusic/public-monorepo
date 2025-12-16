import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { Layout } from "@/components/Layout";
import { categories } from "@/data/categories";
import { vocabEntries } from "@/data/entries";

export default function About() {
  const stats = {
    categories: categories.length,
    subcategories: categories.reduce((acc, c) => acc + c.subcategories.length, 0),
    entries: vocabEntries.length,
  };

  return (
    <Layout>
      <Title>소개 - 한국어 어휘 데이터베이스</Title>
      <Meta
        name="description"
        content="한국어 어휘 데이터베이스 프로젝트에 대한 소개"
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
          <span class="text-gray-900 dark:text-white">소개</span>
        </nav>

        <div class="max-w-4xl">
          {/* 헤더 */}
          <div class="mb-12">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              한국어 어휘 데이터베이스
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              한글의 모든 어휘를 체계적으로 정리한 종합 레퍼런스
            </p>
          </div>

          {/* 프로젝트 소개 */}
          <section class="card p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              프로젝트 소개
            </h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                한국어 어휘 데이터베이스는 한글과 한국어의 모든 어휘를 체계적으로 분류하고 정리한
                종합 데이터베이스입니다. 표준어는 물론 신조어, 사투리, 콩글리시, 인터넷 용어까지
                한국어 사용자가 접할 수 있는 모든 형태의 언어 자료를 수집하고 있습니다.
              </p>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                이 프로젝트는 한국어 학습자, 언어 연구자, 콘텐츠 제작자, 그리고 한국어에 관심 있는
                모든 분들을 위해 만들어졌습니다. 단순한 사전을 넘어, 살아있는 한국어의 다양한
                모습을 담고자 합니다.
              </p>
            </div>
          </section>

          {/* 데이터 범위 */}
          <section class="card p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              데이터 범위
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">기본 언어 요소</h3>
                <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 한글 자음, 모음, 음절 구조</li>
                  <li>• 형태소 (어근, 접사, 조사, 어미)</li>
                  <li>• 표준어 단어 (명사, 동사, 형용사 등)</li>
                </ul>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">현대 언어</h3>
                <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 신조어, 유행어, 밈 용어</li>
                  <li>• 인터넷 용어, 초성 약어</li>
                  <li>• 콩글리시, 외래어</li>
                </ul>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">지역/세대 언어</h3>
                <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 지역별 사투리 (경상, 전라, 충청, 제주 등)</li>
                  <li>• 어르신 언어, 고어, 전통 표현</li>
                  <li>• 일본어 영향 표현 (한본어)</li>
                </ul>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">문법/표기</h3>
                <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 띄어쓰기 규칙, 흔한 오타</li>
                  <li>• 문장부호, 특수기호 사용법</li>
                  <li>• 이모지, 이모티콘, 카오모지</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 현재 상태 */}
          <section class="card p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              현재 현황
            </h2>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {stats.categories}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">대분류</div>
              </div>
              <div class="text-center p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
                <div class="text-3xl font-bold text-accent-600 dark:text-accent-400">
                  {stats.subcategories}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">하위분류</div>
              </div>
              <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div class="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.entries}+
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">어휘 항목</div>
              </div>
            </div>
          </section>

          {/* 기술 스택 */}
          <section class="card p-6 md:p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              기술 스택
            </h2>
            <div class="flex flex-wrap gap-3">
              <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                SolidStart
              </span>
              <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                TypeScript
              </span>
              <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                Tailwind CSS
              </span>
              <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                PWA
              </span>
              <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                100% SSG
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
              모든 페이지는 빌드 시 정적으로 생성되어 빠른 로딩 속도와 SEO 최적화를 제공합니다.
              PWA 지원으로 오프라인에서도 사용 가능합니다.
            </p>
          </section>

          {/* CTA */}
          <div class="text-center py-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              함께 만들어가요
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              새로운 어휘, 오류 수정, 개선 제안 모두 환영합니다!
            </p>
            <A href="/contribute" class="btn-primary">
              기여하기
            </A>
          </div>
        </div>
      </div>
    </Layout>
  );
}
