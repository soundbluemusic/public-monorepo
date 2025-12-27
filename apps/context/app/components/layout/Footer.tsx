import { useI18n } from '@/i18n';
import { Github } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
  const { t, localePath } = useI18n();

  return (
    <footer className="hidden md:block mt-auto py-8 bg-(--bg-secondary) border-t border-(--border-primary)">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="flex items-center justify-center gap-6 mb-4 text-sm text-(--text-secondary)">
          <Link to={localePath('/privacy')} className="hover:text-(--text-primary) hover:underline">
            {t('privacy')}
          </Link>
          <Link to={localePath('/terms')} className="hover:text-(--text-primary) hover:underline">
            {t('terms')}
          </Link>
          <Link to={localePath('/license')} className="hover:text-(--text-primary) hover:underline">
            {t('license')}
          </Link>
        </nav>
        <p className="text-center text-sm mb-2 text-(--text-tertiary)">
          {t('footerCredits')}{' '}
          <Link
            to={localePath('/built-with')}
            className="text-(--accent-primary) underline decoration-1 underline-offset-2 hover:decoration-2"
          >
            {t('footerBuiltWith')}
          </Link>
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-(--text-tertiary)">
          <p className="m-0">Context by SoundBlueMusic</p>
          <a
            href="https://github.com/soundbluemusic/public-monorepo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-(--accent-primary) hover:underline"
          >
            <Github size={16} aria-hidden="true" />
            {t('footerGitHub')}
          </a>
        </div>
      </div>
    </footer>
  );
}
