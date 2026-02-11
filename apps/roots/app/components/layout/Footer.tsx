import { BaseFooter } from '@soundblue/ui/components';
import { useI18n } from '@/i18n';

interface FooterProps {
  sidebarCollapsed: boolean;
}

export function Footer({ sidebarCollapsed }: FooterProps) {
  const { locale, t, localePath } = useI18n();

  return (
    <BaseFooter
      appId="roots"
      locale={locale}
      localePath={localePath}
      links={[
        { label: t('about'), path: '/about' },
        { label: locale === 'ko' ? '오픈소스' : 'Open source', path: '/built-with' },
        { label: t('sitemap'), path: '/sitemap' },
      ]}
      sidebarCollapsed={sidebarCollapsed}
      showAt="lg"
      githubLabel={t('github')}
      creditContent={<p>{t('footerText')}</p>}
    />
  );
}
