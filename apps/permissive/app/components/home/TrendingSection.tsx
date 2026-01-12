import {
  ChevronRight,
  Compass,
  Flame,
  Gamepad2,
  MessageSquare,
  Palette,
  Radio,
  Rocket,
  Shield,
  Sparkles,
  TestTube,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { getLibrarySlug } from '../../data/libraries';
import { getWebApiSlug } from '../../data/web-apis';

interface TrendingItem {
  name: string;
  slug: string;
  category?: string;
  icon: ReactNode;
}

const trendingLibraries: TrendingItem[] = [
  {
    name: 'Bun',
    slug: getLibrarySlug('Bun'),
    category: 'Runtime',
    icon: <Zap size={18} aria-hidden="true" />,
  },
  {
    name: 'Astro',
    slug: getLibrarySlug('Astro'),
    category: 'Meta-framework',
    icon: <Rocket size={18} aria-hidden="true" />,
  },
  {
    name: 'shadcn/ui',
    slug: getLibrarySlug('shadcn/ui'),
    category: 'UI',
    icon: <Palette size={18} aria-hidden="true" />,
  },
  {
    name: 'TanStack Query',
    slug: getLibrarySlug('TanStack Query'),
    category: 'Data Fetching',
    icon: <Radio size={18} aria-hidden="true" />,
  },
  {
    name: 'Vitest',
    slug: getLibrarySlug('Vitest'),
    category: 'Testing',
    icon: <TestTube size={18} aria-hidden="true" />,
  },
  {
    name: 'Zod',
    slug: getLibrarySlug('Zod'),
    category: 'Type Safety',
    icon: <Shield size={18} aria-hidden="true" />,
  },
];

const trendingApis: TrendingItem[] = [
  {
    name: 'View Transitions API',
    slug: getWebApiSlug('View Transitions API'),
    icon: <Sparkles size={18} aria-hidden="true" />,
  },
  {
    name: 'WebGPU',
    slug: getWebApiSlug('WebGPU'),
    icon: <Gamepad2 size={18} aria-hidden="true" />,
  },
  {
    name: 'Navigation API',
    slug: getWebApiSlug('Navigation API'),
    icon: <Compass size={18} aria-hidden="true" />,
  },
  {
    name: 'Popover API',
    slug: getWebApiSlug('Popover API'),
    icon: <MessageSquare size={18} aria-hidden="true" />,
  },
];

interface TrendingSectionProps {
  locale: 'en' | 'ko';
  localePath: (path: string) => string;
}

export function TrendingSection({ locale, localePath }: TrendingSectionProps) {
  return (
    <div className="py-8">
      <h2 className="text-xl font-semibold text-(--text-primary) mb-6 flex items-center gap-2">
        <Flame size={20} aria-hidden="true" className="text-orange-500" />
        {locale === 'ko' ? '2025년 트렌딩' : 'Trending 2025'}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Trending Libraries */}
        <div>
          <h3 className="text-sm font-medium text-(--text-tertiary) uppercase tracking-wider mb-3">
            Libraries
          </h3>
          <div className="space-y-2">
            {trendingLibraries.map((lib) => (
              <Link
                key={lib.name}
                to={localePath(`/library/${lib.slug}`)}
                className="flex items-center gap-3 p-3 rounded-lg bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:border-(--border-focus) hover:shadow-sm group"
              >
                <span className="text-(--accent-primary)">{lib.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-(--text-primary)">{lib.name}</div>
                  <div className="text-xs text-(--text-tertiary)">{lib.category}</div>
                </div>
                <ChevronRight
                  size={16}
                  aria-hidden="true"
                  className="text-(--text-tertiary) opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Web APIs */}
        <div>
          <h3 className="text-sm font-medium text-(--text-tertiary) uppercase tracking-wider mb-3">
            Web APIs
          </h3>
          <div className="space-y-2">
            {trendingApis.map((api) => (
              <Link
                key={api.name}
                to={localePath(`/web-api/${api.slug}`)}
                className="flex items-center gap-3 p-3 rounded-lg bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:border-(--border-focus) hover:shadow-sm group"
              >
                <span className="text-(--accent-primary)">{api.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-(--text-primary) truncate">{api.name}</div>
                </div>
                <ChevronRight
                  size={16}
                  aria-hidden="true"
                  className="text-(--text-tertiary) opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
