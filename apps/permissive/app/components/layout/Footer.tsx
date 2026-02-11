import { BaseFooter } from '@soundblue/ui/components';
import { Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n';

export default function Footer() {
  const { t, locale, localePath } = useI18n();

  return (
    <BaseFooter
      appId="permissive"
      locale={locale}
      localePath={localePath}
      links={[
        { label: locale === 'ko' ? '오픈소스' : 'Open source', path: '/built-with' },
        { label: locale === 'ko' ? '사이트맵' : 'Sitemap', path: '/sitemap' },
      ]}
      showAt="always"
      githubLabel={t('ui.github')}
      creditContent={
        <div className="flex items-center gap-1.5">
          <Sparkles size={16} aria-hidden="true" />
          <span>{t('ui.permissiveBy')}</span>
          <a
            href="https://soundbluemusic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--accent-primary) no-underline hover:underline"
          >
            soundbluemusic
          </a>
        </div>
      }
    />
  );
}
