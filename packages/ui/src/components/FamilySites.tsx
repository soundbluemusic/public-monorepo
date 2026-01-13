/**
 * @fileoverview Family Sites Component for Cross-App Navigation
 * @environment universal
 */

import { type AppId, getOtherApps } from '@soundblue/core';
import {
  BookOpen,
  Code,
  Home,
  type LucideIcon,
  MessageCircle,
  PiSquare,
  Wrench,
} from 'lucide-react';

export type FamilySitesVariant = 'footer' | 'sidebar';

export interface FamilySitesProps {
  currentAppId: AppId;
  variant: FamilySitesVariant;
  locale?: 'en' | 'ko';
}

type IconName = 'home' | 'book-open' | 'pi-square' | 'code' | 'wrench' | 'message-circle';

const ICON_MAP: Record<IconName, LucideIcon> = {
  home: Home,
  'book-open': BookOpen,
  'pi-square': PiSquare,
  code: Code,
  wrench: Wrench,
  'message-circle': MessageCircle,
};

function getIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName as IconName] ?? Home;
}

/**
 * Family Sites component for cross-app navigation
 * Shows links to other apps in the family
 */
export function FamilySites({ currentAppId, variant, locale = 'en' }: FamilySitesProps) {
  const otherApps = getOtherApps(currentAppId);
  const isKorean = locale === 'ko';
  const title = isKorean ? '더 보기' : 'More from Us';

  if (variant === 'footer') {
    return (
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-(--text-tertiary) uppercase tracking-wider">
          {title}
        </span>
        <div className="flex flex-wrap justify-center gap-4">
          {otherApps.map((app) => {
            const Icon = getIcon(app.icon);
            return (
              <a
                key={app.id}
                href={isKorean ? `${app.url}/ko` : app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors no-underline"
                title={isKorean ? app.descriptionKo : app.description}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{isKorean ? app.nameKo : app.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  // Sidebar variant
  return (
    <div className="flex flex-col gap-1">
      <span className="px-3 py-2 text-xs font-medium text-(--text-tertiary) uppercase tracking-wider">
        {title}
      </span>
      {otherApps.map((app) => {
        const Icon = getIcon(app.icon);
        return (
          <a
            key={app.id}
            href={isKorean ? `${app.url}/ko` : app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 text-sm text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-tertiary) rounded-lg transition-colors no-underline"
            title={isKorean ? app.descriptionKo : app.description}
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{isKorean ? app.nameKo : app.name}</span>
          </a>
        );
      })}
    </div>
  );
}
