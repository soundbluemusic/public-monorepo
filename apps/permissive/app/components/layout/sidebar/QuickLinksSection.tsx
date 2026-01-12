import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import type { Language } from '../../../i18n';
import type { QuickLink } from './sidebarData';

interface QuickLinksSectionProps {
  title: string;
  links: readonly QuickLink[];
  locale: Language;
  localePath: (path: string) => string;
}

export function QuickLinksSection({ title, links, locale, localePath }: QuickLinksSectionProps) {
  return (
    <div className="mb-4">
      <h3 className="px-3 py-2 text-xs font-semibold text-(--text-tertiary) uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {links.map((item) =>
          item.external ? (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 min-h-11 px-3 py-2 rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors no-underline group"
            >
              <span className="shrink-0 text-(--text-tertiary)">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-(--text-primary)">{item.name}</div>
                <div className="text-xs text-(--text-tertiary)">
                  {locale === 'ko' ? item.descKo : item.desc}
                </div>
              </div>
              <ExternalLink
                size={14}
                aria-hidden="true"
                className="shrink-0 text-(--text-tertiary) opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
          ) : (
            <Link
              key={item.name}
              to={localePath(item.href)}
              className="flex items-center gap-3 min-h-11 px-3 py-2 rounded-lg text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors no-underline group"
            >
              <span className="shrink-0 text-(--text-tertiary)">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-(--text-primary)">{item.name}</div>
                <div className="text-xs text-(--text-tertiary)">
                  {locale === 'ko' ? item.descKo : item.desc}
                </div>
              </div>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
