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
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
      icon: <Globe size={16} aria-hidden="true" />,
    },
    {
      name: 'localStorage',
      desc: 'Persistent storage',
      descKo: '영구 저장소',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
      icon: <HardDrive size={16} aria-hidden="true" />,
    },
    {
      name: 'WebSocket',
      desc: 'Real-time',
      descKo: '실시간 통신',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket',
      icon: <Plug size={16} aria-hidden="true" />,
    },
    {
      name: 'Canvas',
      desc: '2D graphics',
      descKo: '2D 그래픽',
      href: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
      icon: <Palette size={16} aria-hidden="true" />,
    },
  ],
  libraries: [
    {
      name: 'React',
      desc: 'UI library',
      descKo: 'UI 라이브러리',
      href: 'https://github.com/facebook/react',
      icon: <Atom size={16} aria-hidden="true" />,
    },
    {
      name: 'Vue',
      desc: 'Progressive',
      descKo: '프로그레시브',
      href: 'https://github.com/vuejs/core',
      icon: <Sparkles size={16} aria-hidden="true" />,
    },
    {
      name: 'Vite',
      desc: 'Build tool',
      descKo: '빌드 도구',
      href: 'https://github.com/vitejs/vite',
      icon: <Zap size={16} aria-hidden="true" />,
    },
    {
      name: 'Tailwind',
      desc: 'Utility CSS',
      descKo: '유틸리티 CSS',
      href: 'https://github.com/tailwindlabs/tailwindcss',
      icon: <Wind size={16} aria-hidden="true" />,
    },
  ],
} as const;
