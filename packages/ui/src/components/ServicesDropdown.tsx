/**
 * @fileoverview Services Dropdown Component for Header Navigation
 * @environment client-only
 *
 * UX Improvements:
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Apps grouped by category (Learning, Tools)
 * - App descriptions shown
 * - Same tab navigation for monorepo apps
 * - External link indicator for outside apps
 * - Desktop: Button with label, Mobile: Icon only
 */

import {
  type AppCategory,
  type AppId,
  CATEGORY_LABELS,
  getAllSocialLinks,
  getAppsByCategory,
  isSameTabApp,
} from '@soundblue/core';
import {
  AtSign,
  BookOpen,
  Check,
  Code,
  ExternalLink,
  Grid,
  Home,
  Instagram,
  type LucideIcon,
  MessageCircle,
  PiSquare,
  Twitter,
  Wrench,
  Youtube,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface ServicesDropdownProps {
  currentAppId: AppId;
  locale?: 'en' | 'ko';
}

type ServiceIconName = 'home' | 'book-open' | 'pi-square' | 'code' | 'wrench' | 'message-circle';
type SocialIconName = 'youtube' | 'twitter' | 'instagram' | 'at-sign';

const SERVICE_ICON_MAP: Record<ServiceIconName, LucideIcon> = {
  home: Home,
  'book-open': BookOpen,
  'pi-square': PiSquare,
  code: Code,
  wrench: Wrench,
  'message-circle': MessageCircle,
};

const SOCIAL_ICON_MAP: Record<SocialIconName, LucideIcon> = {
  youtube: Youtube,
  twitter: Twitter,
  instagram: Instagram,
  'at-sign': AtSign,
};

function getServiceIcon(iconName: string): LucideIcon {
  return SERVICE_ICON_MAP[iconName as ServiceIconName] ?? Home;
}

function getSocialIcon(iconName: string): LucideIcon {
  return SOCIAL_ICON_MAP[iconName as SocialIconName] ?? AtSign;
}

/**
 * Services dropdown component for header navigation
 * Shows all family services grouped by category with current app highlighted
 */
export function ServicesDropdown({ currentAppId, locale = 'en' }: ServicesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const appsByCategory = getAppsByCategory(currentAppId);
  const socialLinks = getAllSocialLinks();
  const isKorean = locale === 'ko';

  const title = isKorean ? '앱' : 'Apps';
  const followTitle = isKorean ? '팔로우' : 'Follow Us';
  const buttonLabel = isKorean ? '앱 메뉴' : 'Apps menu';
  const currentLabel = isKorean ? '현재' : 'Current';

  // Flatten apps for keyboard navigation (excluding current app)
  const allMenuItems = [
    ...appsByCategory.main,
    ...appsByCategory.learning,
    ...appsByCategory.tools,
    ...socialLinks,
  ];

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev) => (prev < allMenuItems.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : allMenuItems.length - 1));
          break;
        case 'Enter':
          if (focusedIndex >= 0 && menuItemsRef.current[focusedIndex]) {
            menuItemsRef.current[focusedIndex]?.click();
          }
          break;
        case 'Tab':
          // Allow natural tab behavior but close menu
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, allMenuItems.length]);

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && menuItemsRef.current[focusedIndex]) {
      menuItemsRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const handleAppClick = useCallback(
    (appId: string, url: string, e: React.MouseEvent) => {
      const sameTab = isSameTabApp(appId);

      if (sameTab) {
        // Same tab navigation with transition
        e.preventDefault();
        document.body.style.opacity = '0.5';
        document.body.style.transition = 'opacity 150ms ease-out';
        setIsOpen(false);

        setTimeout(() => {
          window.location.href = isKorean ? `${url}/ko` : url;
        }, 100);
      } else {
        // External app - let default behavior happen (new tab)
        setIsOpen(false);
      }
    },
    [isKorean],
  );

  const renderCategorySection = (category: AppCategory, apps: typeof appsByCategory.main) => {
    if (apps.length === 0) return null;

    const categoryLabel = isKorean ? CATEGORY_LABELS[category].ko : CATEGORY_LABELS[category].en;
    const startIndex =
      category === 'main'
        ? 0
        : category === 'learning'
          ? appsByCategory.main.length
          : appsByCategory.main.length + appsByCategory.learning.length;

    return (
      <div key={category}>
        <div className="px-3 py-2 text-xs font-medium text-(--text-tertiary) uppercase tracking-wider">
          {categoryLabel}
        </div>
        {apps.map((app, idx) => {
          const Icon = getServiceIcon(app.icon);
          const isExternal = !isSameTabApp(app.id);
          const menuIndex = startIndex + idx;
          const isFocused = focusedIndex === menuIndex;
          const url = isKorean ? `${app.url}/ko` : app.url;

          return (
            <a
              key={app.id}
              ref={(el) => {
                menuItemsRef.current[menuIndex] = el;
              }}
              href={url}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              role="menuitem"
              tabIndex={isFocused ? 0 : -1}
              className={`
                flex flex-col gap-0.5 px-3 py-2.5 mx-1 rounded-lg transition-colors no-underline
                ${isFocused ? 'bg-(--bg-tertiary)' : 'hover:bg-(--bg-tertiary)'}
                text-(--text-secondary) hover:text-(--text-primary)
              `}
              onClick={(e) => handleAppClick(app.id, app.url, e)}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="flex-1 text-sm font-medium text-(--text-primary)">
                  {isKorean ? app.nameKo : app.name}
                </span>
                {isExternal && (
                  <ExternalLink
                    className="w-3.5 h-3.5 shrink-0 text-(--text-tertiary)"
                    aria-hidden="true"
                  />
                )}
              </div>
              <span className="text-xs text-(--text-tertiary) pl-7">
                {isKorean ? app.descriptionKo : app.description}
              </span>
            </a>
          );
        })}
      </div>
    );
  };

  // Calculate social links start index
  const socialStartIndex =
    appsByCategory.main.length + appsByCategory.learning.length + appsByCategory.tools.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button: Icon + Label on desktop, Icon only on mobile */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setFocusedIndex(-1);
        }}
        className="min-h-11 flex items-center gap-2 px-3 rounded-lg transition-colors text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary) bg-(--bg-secondary)/50"
        aria-label={buttonLabel}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Grid size={18} aria-hidden="true" />
        <span className="hidden sm:inline text-sm font-medium">{title}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-64 py-2 bg-(--bg-secondary) border border-(--border-primary) rounded-xl shadow-lg z-50 max-h-[70vh] overflow-y-auto"
          role="menu"
          aria-label={title}
        >
          {/* Current App Indicator */}
          <div className="px-3 py-2 mb-1 border-b border-(--border-primary)">
            <div className="flex items-center gap-2 text-xs text-(--text-tertiary)">
              <Check className="w-3.5 h-3.5 text-(--accent-primary)" aria-hidden="true" />
              <span>{currentLabel}:</span>
              <span className="font-medium text-(--text-primary)">{currentAppId}</span>
            </div>
          </div>

          {/* App Categories */}
          {renderCategorySection('main', appsByCategory.main)}
          {renderCategorySection('learning', appsByCategory.learning)}
          {renderCategorySection('tools', appsByCategory.tools)}

          {/* SNS Section */}
          <div className="px-3 py-2 mt-1 text-xs font-medium text-(--text-tertiary) uppercase tracking-wider border-t border-(--border-primary)">
            {followTitle}
          </div>
          {socialLinks.map((social, idx) => {
            const Icon = getSocialIcon(social.icon);
            const menuIndex = socialStartIndex + idx;
            const isFocused = focusedIndex === menuIndex;

            return (
              <a
                key={social.id}
                ref={(el) => {
                  menuItemsRef.current[menuIndex] = el;
                }}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                tabIndex={isFocused ? 0 : -1}
                className={`
                  flex items-center gap-3 px-3 py-2 mx-1 text-sm rounded-lg transition-colors no-underline
                  ${isFocused ? 'bg-(--bg-tertiary)' : 'hover:bg-(--bg-tertiary)'}
                  text-(--text-secondary) hover:text-(--text-primary)
                `}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{social.name}</span>
                <ExternalLink
                  className="w-3.5 h-3.5 shrink-0 ml-auto text-(--text-tertiary)"
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
