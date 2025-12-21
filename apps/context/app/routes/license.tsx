import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  return [{ title: isKorean ? '라이선스 - Context' : 'License - Context' }];
};

export default function LicensePage() {
  const { t } = useI18n();

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
        {t('licenseTitle')}
      </h1>
      <div className="prose" style={{ color: 'var(--text-secondary)' }}>
        <p>{t('licenseContent')}</p>
      </div>
    </Layout>
  );
}
