/**
 * @fileoverview Permissive 앱 사이드바 컴포넌트
 * BaseSidebar를 사용하여 앱별 데이터만 전달
 */

import { stripLocaleFromPath } from '@soundblue/i18n';
import { BaseSidebar, FamilySites, type SidebarNavItem } from '@soundblue/ui/components';
import { Globe, Home, Package, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router';
import { useI18n } from '../../i18n';
import { QuickLinksSection, quickLinks } from './sidebar';

// Use shared utility for locale stripping
const stripLocale = stripLocaleFromPath;

/** 메인 네비게이션 링크 설정 */
const NAV_ITEMS: SidebarNavItem[] = [
  { path: '/', icon: <Home size={20} aria-hidden="true" />, label: 'Home', labelKo: '홈' },
  {
    path: '/web-api',
    icon: <Globe size={20} aria-hidden="true" />,
    label: 'Web API',
    labelKo: 'Web API',
  },
  {
    path: '/libraries',
    icon: <Package size={20} aria-hidden="true" />,
    label: 'Libraries',
    labelKo: 'Libraries',
  },
];

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const { locale, localePath, t } = useI18n();
  const location = useLocation();

  const isActive = (basePath: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === basePath || currentPath.startsWith(`${basePath}/`);
  };

  return (
    <BaseSidebar
      isOpen={isOpen}
      isCollapsed={isCollapsed}
      onClose={onClose}
      onToggleCollapse={onToggleCollapse}
      locale={locale}
      localePath={localePath}
      isActive={isActive}
      logo={
        <>
          <Sparkles size={20} aria-hidden="true" className="text-(--accent-primary)" />
          <span>Permissive</span>
        </>
      }
      ariaLabel={t('aria.sidebar')}
      navItems={NAV_ITEMS}
      closeMenuLabel={t('aria.closeMenu')}
    >
      {/* Quick Links */}
      <QuickLinksSection
        title={locale === 'ko' ? '인기 Web API' : 'Popular Web API'}
        links={quickLinks.webApi}
        locale={locale}
        localePath={localePath}
      />

      <QuickLinksSection
        title={locale === 'ko' ? '인기 Libraries' : 'Popular Libraries'}
        links={quickLinks.libraries}
        locale={locale}
        localePath={localePath}
      />

      {/* More from Us */}
      <div className="mt-6 pt-4 border-t border-(--border-primary)">
        <FamilySites currentAppId="permissive" variant="sidebar" locale={locale} />
      </div>
    </BaseSidebar>
  );
}
