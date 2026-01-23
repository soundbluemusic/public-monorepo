import { FamilySites } from '@soundblue/ui/components';
import { Link } from '@tanstack/react-router';
import { Github, Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n';

export default function Footer() {
  const { t, locale, localePath } = useI18n();

  return (
    <footer className="py-8 mt-auto bg-(--bg-secondary) border-t border-(--border-primary)">
      <div className="max-w-4xl mx-auto px-4">
        {/* Footer Links */}
        <nav
          aria-label="Footer links"
          className="flex items-center justify-center gap-6 mb-4 text-sm text-(--text-secondary)"
        >
          <Link
            to={localePath('/built-with')}
            className="no-underline hover:underline text-inherit"
          >
            {locale === 'ko' ? '오픈소스' : 'Open source'}
          </Link>
          <Link to={localePath('/sitemap')} className="no-underline hover:underline text-inherit">
            {locale === 'ko' ? '사이트맵' : 'Sitemap'}
          </Link>
        </nav>

        {/* More from Us */}
        <div className="flex justify-center mb-4">
          <FamilySites currentAppId="permissive" variant="footer" locale={locale} />
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-(--text-tertiary)">
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
          <a
            href="https://github.com/soundbluemusic/public-monorepo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-(--accent-primary) no-underline hover:underline"
          >
            <Github size={16} aria-hidden="true" />
            {t('ui.github')}
          </a>
        </div>
      </div>
    </footer>
  );
}
