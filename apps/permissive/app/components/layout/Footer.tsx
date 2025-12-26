import { Github, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { useI18n } from '../../i18n';

export default function Footer() {
  const { t, locale, localePath } = useI18n();

  return (
    <footer className="py-8 mt-auto bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Footer Links */}
        <nav className="flex items-center justify-center gap-6 mb-4 text-sm text-[var(--text-secondary)]">
          <Link to={localePath('/sitemap')} className="no-underline hover:underline text-inherit">
            {locale === 'ko' ? '사이트맵' : 'Sitemap'}
          </Link>
        </nav>

        <div className="flex items-center justify-center gap-4 text-sm text-[var(--text-tertiary)]">
          <div className="flex items-center gap-1.5">
            <Sparkles size={16} aria-hidden="true" />
            <span>{t('ui.permissiveBy')}</span>
            <a
              href="https://soundbluemusic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-primary)] no-underline hover:underline"
            >
              soundbluemusic
            </a>
          </div>
          <a
            href="https://github.com/soundbluemusic/public-monorepo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[var(--accent-primary)] no-underline hover:underline"
          >
            <Github size={16} aria-hidden="true" />
            {t('ui.github')}
          </a>
        </div>
      </div>
    </footer>
  );
}
