import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';

export function meta() {
  return [{ title: 'Privacy Policy - Context' }];
}

export default function PrivacyPage() {
  const { locale } = useI18n();

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
        {locale === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
      </h1>
      <div className="prose" style={{ color: 'var(--text-secondary)' }}>
        <p>
          {locale === 'ko'
            ? 'Context는 사용자의 개인정보를 수집하지 않습니다. 모든 데이터는 로컬 브라우저에만 저장됩니다.'
            : 'Context does not collect any personal information. All data is stored locally in your browser.'}
        </p>
      </div>
    </Layout>
  );
}
