/**
 * @fileoverview BaseFooter Component
 * @environment client-only
 *
 * Shared footer component with configurable links and layout.
 */

import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { cn } from '../../utils';
import { Github } from '../brand-icons';
import { FamilySites } from '../FamilySites';

export interface FooterLink {
  /** Translation key or display label */
  label: string;
  /** Route path (will be passed through localePath) */
  path: string;
}

export interface BaseFooterProps {
  /** Current app identifier for FamilySites */
  appId: 'context' | 'roots' | 'permissive';
  /** Current locale */
  locale: 'en' | 'ko';
  /** Function to generate locale-prefixed paths */
  localePath: (path: string) => string;
  /** Footer navigation links */
  links: FooterLink[];
  /** Whether sidebar is collapsed (for padding adjustment) */
  sidebarCollapsed?: boolean;
  /** Responsive breakpoint for showing footer ('md' | 'lg' | 'always') */
  showAt?: 'md' | 'lg' | 'always';
  /** GitHub link label */
  githubLabel?: string;
  /** Additional content before GitHub link */
  creditContent?: ReactNode;
  /** Translation function for links */
  t?: (key: string) => string;
}

/**
 * Base footer component shared across apps.
 *
 * @example
 * ```tsx
 * <BaseFooter
 *   appId="context"
 *   locale={locale}
 *   localePath={localePath}
 *   links={[
 *     { label: t('privacy'), path: '/privacy' },
 *     { label: t('terms'), path: '/terms' },
 *   ]}
 *   sidebarCollapsed={sidebarCollapsed}
 *   showAt="md"
 *   githubLabel={t('footerGitHub')}
 * />
 * ```
 */
export function BaseFooter({
  appId,
  locale,
  localePath,
  links,
  sidebarCollapsed = false,
  showAt = 'lg',
  githubLabel = 'GitHub',
  creditContent,
}: BaseFooterProps) {
  const visibilityClass =
    showAt === 'always' ? '' : showAt === 'md' ? 'hidden md:block' : 'hidden lg:block';

  const sidebarPaddingClass =
    showAt === 'always'
      ? ''
      : sidebarCollapsed
        ? `${showAt}:pl-[calc(var(--sidebar-collapsed-width)+1rem)]`
        : `${showAt}:pl-[calc(var(--sidebar-width)+1rem)]`;

  return (
    <footer
      className={cn(
        'mt-auto py-8 bg-(--bg-secondary) border-t border-(--border-primary)',
        'transition-[padding] duration-200',
        visibilityClass,
        sidebarPaddingClass,
      )}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Footer Links */}
        {links.length > 0 && (
          <nav
            aria-label="Footer links"
            className="flex items-center justify-center gap-6 mb-4 text-sm text-(--text-secondary)"
          >
            {links.map((link) => (
              <Link
                key={link.path}
                to={localePath(link.path)}
                className="no-underline hover:underline text-inherit"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Family Sites */}
        <div className="flex justify-center mb-4">
          <FamilySites currentAppId={appId} variant="footer" locale={locale} />
        </div>

        {/* Credits & GitHub */}
        <div className="flex items-center justify-center gap-4 text-sm text-(--text-tertiary)">
          {creditContent}
          <a
            href="https://github.com/soundbluemusic/public-monorepo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-(--accent-primary) no-underline hover:underline"
          >
            <Github size={16} aria-hidden="true" />
            {githubLabel}
          </a>
        </div>
      </div>
    </footer>
  );
}
