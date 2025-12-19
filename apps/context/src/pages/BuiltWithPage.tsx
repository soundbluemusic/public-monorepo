import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';
import { Meta, Title } from '@solidjs/meta';
import { A } from '@solidjs/router';

export default function BuiltWithPage() {
  const { locale, localePath } = useI18n();

  const getTitle = () => {
    return 'Built with ❤️';
  };

  return (
    <Layout>
      <Title>{getTitle()} - Context</Title>
      <Meta name="description" content="Technologies and tools used to build Context" />

      <A
        href={localePath('/')}
        class="text-sm mb-8 inline-block"
        style={{ color: 'var(--text-tertiary)' }}
      >
        ← {locale() === 'ko' ? '홈으로' : 'Back to home'}
      </A>

      <h1 class="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
        Built with ❤️
      </h1>

      <div class="space-y-6" style={{ color: 'var(--text-secondary)' }}>
        <section>
          <h2 class="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            {locale() === 'ko' ? 'AI 어시스턴트' : 'AI Assistant'}
          </h2>
          <p class="leading-relaxed">
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              Claude Code
            </a>
            {locale() === 'ko'
              ? ' - Anthropic의 AI 코딩 어시스턴트로 이 프로젝트의 개발에 활용되었습니다.'
              : ' - AI coding assistant by Anthropic, used in the development of this project.'}
          </p>
        </section>

        <section>
          <h2 class="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            {locale() === 'ko' ? '프레임워크' : 'Framework'}
          </h2>
          <ul class="space-y-2">
            <li>
              <a
                href="https://www.solidjs.com"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium underline"
                style={{ color: 'var(--accent-primary)' }}
              >
                SolidJS
              </a>
              {locale() === 'ko'
                ? ' - 반응형 UI를 위한 JavaScript 라이브러리'
                : ' - Reactive JavaScript library for building user interfaces'}
            </li>
            <li>
              <a
                href="https://start.solidjs.com"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium underline"
                style={{ color: 'var(--accent-primary)' }}
              >
                SolidStart
              </a>
              {locale() === 'ko'
                ? ' - SolidJS 풀스택 프레임워크'
                : ' - Full-stack framework for SolidJS'}
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            {locale() === 'ko' ? '스타일링' : 'Styling'}
          </h2>
          <ul class="space-y-2">
            <li>
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium underline"
                style={{ color: 'var(--accent-primary)' }}
              >
                Tailwind CSS
              </a>
              {locale() === 'ko'
                ? ' - 유틸리티 우선 CSS 프레임워크'
                : ' - Utility-first CSS framework'}
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            {locale() === 'ko' ? '오픈소스' : 'Open Source'}
          </h2>
          <p class="leading-relaxed">
            {locale() === 'ko'
              ? 'Context는 오픈소스 프로젝트입니다. '
              : 'Context is an open source project. '}
            <a
              href="https://github.com/soundbluemusic"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              GitHub
            </a>
          </p>
        </section>
      </div>
    </Layout>
  );
}
