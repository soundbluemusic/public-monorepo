import { Link, useLocation } from 'react-router';

interface SidebarProps {
  locale: 'en' | 'ko' | 'ja';
}

interface SidebarSection {
  title: string;
  items: Array<{ label: string; href: string }>;
}

export function Sidebar({ locale }: SidebarProps) {
  const location = useLocation();
  const basePath = locale === 'en' ? '/public-monorepo' : `/public-monorepo/${locale}`;

  const sections: SidebarSection[] = getSidebarSections(locale, basePath);

  return (
    <nav className="p-4 space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-(--text-tertiary)">
            {section.title}
          </h3>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isActive =
                location.pathname === item.href ||
                location.pathname === `${item.href}/` ||
                location.pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link to={item.href} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function getSidebarSections(locale: 'en' | 'ko' | 'ja', basePath: string): SidebarSection[] {
  const t = translations[locale];

  return [
    {
      title: t.gettingStarted,
      items: [
        { label: t.introduction, href: `${basePath}/guides/introduction` },
        { label: t.quickstart, href: `${basePath}/guides/quickstart` },
        { label: t.architecture, href: `${basePath}/guides/architecture` },
        { label: t.ssgDeepDive, href: `${basePath}/guides/ssg-deep-dive` },
        { label: t.hydrationWorkaround, href: `${basePath}/guides/hydration-workaround` },
        { label: t.troubleshooting, href: `${basePath}/guides/troubleshooting` },
      ],
    },
    {
      title: t.apps,
      items: [
        { label: 'Context — Korean Dictionary', href: `${basePath}/apps/context/overview` },
        { label: 'Permissive — Web Dev Resources', href: `${basePath}/apps/permissive/overview` },
        { label: 'Roots — Math Documentation', href: `${basePath}/apps/roots/overview` },
      ],
    },
    {
      title: t.packages,
      items: [
        { label: t.overview, href: `${basePath}/packages` },
        { label: '@soundblue/core', href: `${basePath}/packages/core` },
        { label: '@soundblue/config', href: `${basePath}/packages/config` },
        { label: '@soundblue/data', href: `${basePath}/packages/data` },
        { label: '@soundblue/platform', href: `${basePath}/packages/platform` },
        { label: '@soundblue/i18n', href: `${basePath}/packages/i18n` },
        { label: '@soundblue/search', href: `${basePath}/packages/search` },
        { label: '@soundblue/seo', href: `${basePath}/packages/seo` },
        { label: '@soundblue/pwa', href: `${basePath}/packages/pwa` },
        { label: '@soundblue/features', href: `${basePath}/packages/features` },
        { label: '@soundblue/ui', href: `${basePath}/packages/ui` },
      ],
    },
    {
      title: t.contributing,
      items: [
        { label: t.overview, href: `${basePath}/contributing` },
        { label: t.codeStyle, href: `${basePath}/contributing/code-style` },
        { label: t.pullRequests, href: `${basePath}/contributing/pull-requests` },
      ],
    },
    {
      title: t.aiGuidelines,
      items: [
        { label: t.overview, href: `${basePath}/ai-guidelines` },
        { label: t.rules, href: `${basePath}/ai-guidelines/rules` },
        { label: t.layerSystem, href: `${basePath}/ai-guidelines/layer-system` },
      ],
    },
    {
      title: t.reference,
      items: [
        { label: 'CLI', href: `${basePath}/reference/cli` },
        { label: 'API', href: `${basePath}/reference/api` },
      ],
    },
    {
      title: t.other,
      items: [{ label: t.openSource, href: `${basePath}/open-source` }],
    },
  ];
}

const translations = {
  en: {
    gettingStarted: 'Getting Started',
    introduction: 'Introduction',
    quickstart: 'Quick Start',
    architecture: 'Architecture',
    ssgDeepDive: 'SSG Deep Dive',
    hydrationWorkaround: 'Hydration Workaround',
    troubleshooting: 'Troubleshooting',
    apps: 'Apps',
    packages: 'Packages',
    overview: 'Overview',
    contributing: 'Contributing',
    codeStyle: 'Code Style',
    pullRequests: 'Pull Requests',
    aiGuidelines: 'AI Guidelines',
    rules: 'Rules',
    layerSystem: 'Layer System',
    reference: 'Reference',
    other: 'Other',
    openSource: 'Open Source',
  },
  ko: {
    gettingStarted: '시작하기',
    introduction: '소개',
    quickstart: '빠른 시작',
    architecture: '아키텍처',
    ssgDeepDive: 'SSG 심층 분석',
    hydrationWorkaround: 'Hydration 워크어라운드',
    troubleshooting: '문제 해결',
    apps: '앱',
    packages: '패키지',
    overview: '개요',
    contributing: '기여하기',
    codeStyle: '코드 스타일',
    pullRequests: '풀 리퀘스트',
    aiGuidelines: 'AI 가이드라인',
    rules: '규칙',
    layerSystem: '레이어 시스템',
    reference: '참조',
    other: '기타',
    openSource: '오픈소스',
  },
  ja: {
    gettingStarted: 'はじめに',
    introduction: '紹介',
    quickstart: 'クイックスタート',
    architecture: 'アーキテクチャ',
    ssgDeepDive: 'SSG 詳細',
    hydrationWorkaround: 'Hydration 回避策',
    troubleshooting: 'トラブルシューティング',
    apps: 'アプリ',
    packages: 'パッケージ',
    overview: '概要',
    contributing: '貢献',
    codeStyle: 'コードスタイル',
    pullRequests: 'プルリクエスト',
    aiGuidelines: 'AI ガイドライン',
    rules: 'ルール',
    layerSystem: 'レイヤーシステム',
    reference: 'リファレンス',
    other: 'その他',
    openSource: 'オープンソース',
  },
};
