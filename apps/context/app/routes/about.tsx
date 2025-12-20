import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';

export function meta() {
  return [
    { title: 'About - Context' },
    { name: 'description', content: 'About Context Korean Dictionary' },
  ];
}

export default function AboutPage() {
  const { locale, t } = useI18n();

  return (
    <Layout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('aboutTitle')}
        </h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          {t('aboutDescription')}
        </p>
        <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
          <p>
            {locale === 'ko'
              ? 'Context는 한국어 학습자를 위한 의미 중심 사전입니다. 단순한 번역을 넘어 단어의 맥락과 뉘앙스를 이해할 수 있도록 돕습니다.'
              : 'Context is a meaning-focused dictionary for Korean learners. It helps you understand the context and nuances of words beyond simple translation.'}
          </p>
          <p>
            {locale === 'ko'
              ? '모든 콘텐츠는 무료로 제공되며, 오픈소스 기술로 제작되었습니다.'
              : 'All content is provided for free and built with open-source technology.'}
          </p>
        </div>
      </div>
    </Layout>
  );
}
