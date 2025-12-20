import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';

export function meta() {
  return [{ title: 'License - Context' }];
}

export default function LicensePage() {
  const { locale } = useI18n();

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
        {locale === 'ko' ? '라이선스' : 'License'}
      </h1>
      <div className="prose" style={{ color: 'var(--text-secondary)' }}>
        <p>
          {locale === 'ko'
            ? 'Context는 Apache License 2.0 하에 배포됩니다.'
            : 'Context is distributed under the Apache License 2.0.'}
        </p>
      </div>
    </Layout>
  );
}
