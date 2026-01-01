import { useSettingsStore } from '@soundblue/features/settings';
import { FamilySites } from '@soundblue/ui/components';
import { cn } from '@soundblue/ui/utils';
import { Github } from 'lucide-react';
import { Link } from 'react-router';
import { useI18n } from '@/i18n';

export function Footer() {
  const { locale, t, localePath } = useI18n();
  const { sidebarCollapsed } = useSettingsStore();

  return (
    <footer
      className={cn(
        'hidden md:block mt-auto py-8 bg-(--bg-secondary) border-t border-(--border-primary)',
        'transition-[padding] duration-200',
        // Desktop: offset for fixed sidebar (same as main content)
        sidebarCollapsed ? 'md:pl-(--sidebar-collapsed-width)' : 'md:pl-(--sidebar-width)',
      )}
    >
      <div className="max-w-4xl mx-auto px-4">
        <nav
          aria-label="Footer links"
          className="flex items-center justify-center gap-6 mb-4 text-sm text-(--text-secondary)"
        >
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

        {/* More from Us */}
        <div className="flex justify-center mb-4">
          <FamilySites currentAppId="context" variant="footer" locale={locale} />
        </div>

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
