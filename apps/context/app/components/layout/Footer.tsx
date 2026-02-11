import { useSettingsStore } from '@soundblue/features/settings';
import { BaseFooter } from '@soundblue/ui/components';
import { Link } from '@tanstack/react-router';
import { useI18n } from '@/i18n';

export function Footer() {
  const { locale, t, localePath } = useI18n();
  const { sidebarCollapsed } = useSettingsStore();

  return (
    <BaseFooter
      appId="context"
      locale={locale}
      localePath={localePath}
      links={[
        { label: t('privacy'), path: '/privacy' },
        { label: t('terms'), path: '/terms' },
        { label: t('license'), path: '/license' },
      ]}
      sidebarCollapsed={sidebarCollapsed}
      showAt="md"
      githubLabel={t('footerGitHub')}
      creditContent={
        <p className="text-center text-sm mb-2 text-(--text-tertiary)">
          {t('footerCredits')}{' '}
          <Link
            to={localePath('/built-with')}
            className="text-(--accent-primary) underline decoration-1 underline-offset-2 hover:decoration-2"
          >
            {t('footerBuiltWith')}
          </Link>
        </p>
      }
    />
  );
}
