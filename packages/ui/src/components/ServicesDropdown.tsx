/**
 * @fileoverview Services Dropdown Component for Header Navigation
 * @environment client-only
 */

import { type AppId, getAllServices, getAllSocialLinks } from '@soundblue/core';
import {
  AtSign,
  BookOpen,
  Check,
  Code,
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
import { useEffect, useRef, useState } from 'react';

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
 * Shows all family services with current app highlighted
 */
export function ServicesDropdown({ currentAppId, locale = 'en' }: ServicesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const services = getAllServices();
  const socialLinks = getAllSocialLinks();
  const isKorean = locale === 'ko';
  const title = isKorean ? '서비스' : 'Our Services';
  const followTitle = isKorean ? '팔로우' : 'Follow Us';
  const buttonLabel = isKorean ? '서비스 메뉴' : 'Services menu';

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)"
        aria-label={buttonLabel}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={title}
      >
        <Grid size={20} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-56 py-2 bg-(--bg-secondary) border border-(--border-primary) rounded-xl shadow-lg z-50"
          role="menu"
          aria-label={title}
        >
          <div className="px-3 py-2 text-xs font-medium text-(--text-tertiary) uppercase tracking-wider border-b border-(--border-primary) mb-1">
            {title}
          </div>
          {services.map((service) => {
            const Icon = getServiceIcon(service.icon);
            const isCurrent = service.id === currentAppId;

            return (
              <a
                key={service.id}
                href={isKorean ? `${service.url}/ko` : service.url}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                className={`
                  flex items-center gap-3 px-3 py-2.5 mx-1 text-sm rounded-lg transition-colors no-underline
                  ${isCurrent ? 'bg-(--bg-tertiary) text-(--text-primary)' : 'text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)'}
                `}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="flex-1 truncate">{isKorean ? service.nameKo : service.name}</span>
                {isCurrent && (
                  <Check className="w-4 h-4 shrink-0 text-(--accent-primary)" aria-hidden="true" />
                )}
              </a>
            );
          })}

          {/* SNS Section */}
          <div className="px-3 py-2 mt-1 text-xs font-medium text-(--text-tertiary) uppercase tracking-wider border-t border-(--border-primary)">
            {followTitle}
          </div>
          {socialLinks.map((social) => {
            const Icon = getSocialIcon(social.icon);

            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                className="flex items-center gap-3 px-3 py-2 mx-1 text-sm rounded-lg transition-colors no-underline text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text-primary)"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{social.name}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
