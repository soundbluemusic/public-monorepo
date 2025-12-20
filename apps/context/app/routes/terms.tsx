import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';

export function meta() {
  return [{ title: 'Terms of Service - Context' }];
}

export default function TermsPage() {
  const { locale } = useI18n();

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
        {locale === 'ko' ? '이용약관' : 'Terms of Service'}
      </h1>
      <div className="prose" style={{ color: 'var(--text-secondary)' }}>
        <p>
          {locale === 'ko'
            ? 'Context는 무료로 제공되는 교육 목적의 서비스입니다. 콘텐츠는 참고용이며 정확성을 보장하지 않습니다.'
            : 'Context is a free educational service. Content is for reference only and accuracy is not guaranteed.'}
        </p>
      </div>
    </Layout>
  );
}
