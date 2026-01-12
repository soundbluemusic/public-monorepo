import {
  Atom,
  Globe,
  HardDrive,
  Home,
  Package,
  Palette,
  Plug,
  Sparkles,
  Wind,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';

export interface NavItem {
  href: string;
  label: string;
  labelKo: string;
  icon: ReactNode;
}

export interface QuickLink {
  name: string;
  desc: string;
  descKo: string;
  href: string;
  icon: ReactNode;
  /** true면 외부 링크 (새 탭에서 열림) */
  external?: boolean;
}

export const navItems: readonly NavItem[] = [
  { href: '/', label: 'Home', labelKo: '홈', icon: <Home size={18} aria-hidden="true" /> },
  {
    href: '/web-api',
    label: 'Web API',
    labelKo: 'Web API',
    icon: <Globe size={18} aria-hidden="true" />,
  },
  {
    href: '/libraries',
    label: 'Libraries',
    labelKo: 'Libraries',
    icon: <Package size={18} aria-hidden="true" />,
  },
];

export const quickLinks = {
  webApi: [
    {
      name: 'Fetch API',
      desc: 'HTTP requests',
      descKo: 'HTTP 요청',
      href: '/web-api/fetch-api',
      icon: <Globe size={16} aria-hidden="true" />,
    },
    {
      name: 'localStorage',
      desc: 'Persistent storage',
      descKo: '영구 저장소',
      href: '/web-api/localstorage',
      icon: <HardDrive size={16} aria-hidden="true" />,
    },
    {
      name: 'WebSocket',
      desc: 'Real-time',
      descKo: '실시간 통신',
      href: '/web-api/websocket',
      icon: <Plug size={16} aria-hidden="true" />,
    },
    {
      name: 'Canvas 2D',
      desc: '2D graphics',
      descKo: '2D 그래픽',
      href: '/web-api/canvas-2d',
      icon: <Palette size={16} aria-hidden="true" />,
    },
  ],
  libraries: [
    {
      name: 'React',
      desc: 'UI library',
      descKo: 'UI 라이브러리',
      href: '/library/react',
      icon: <Atom size={16} aria-hidden="true" />,
    },
    {
      name: 'Vue',
      desc: 'Progressive',
      descKo: '프로그레시브',
      href: '/library/vue',
      icon: <Sparkles size={16} aria-hidden="true" />,
    },
    {
      name: 'Vite',
      desc: 'Build tool',
      descKo: '빌드 도구',
      href: '/library/vite',
      icon: <Zap size={16} aria-hidden="true" />,
    },
    {
      name: 'Tailwind CSS',
      desc: 'Utility CSS',
      descKo: '유틸리티 CSS',
      href: '/library/tailwind-css',
      icon: <Wind size={16} aria-hidden="true" />,
    },
  ],
} as const;
