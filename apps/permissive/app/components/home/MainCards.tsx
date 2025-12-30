import { ChevronRight, Globe, Package } from 'lucide-react';
import { Link } from 'react-router';

interface MainCardsProps {
  locale: 'en' | 'ko';
  localePath: (path: string) => string;
}

export function MainCards({ locale, localePath }: MainCardsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 py-8">
      {/* Web API Card */}
      <Link
        to={localePath('/web-api')}
        className="p-6 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:-translate-y-1 hover:shadow-lg hover:border-(--border-focus) group"
      >
        <div className="text-blue-500 mb-4">
          <Globe size={32} aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold text-(--text-primary) mb-2">Web API</h2>
        <p className="text-sm text-(--text-secondary) mb-4">
          {locale === 'ko'
            ? '브라우저 내장 API. 설치 없이 무료로 사용'
            : 'Browser built-in APIs. Free to use, no installation'}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-(--accent-primary)">58</div>
          <div className="flex items-center gap-1 text-sm text-(--accent-primary) font-medium">
            {locale === 'ko' ? '둘러보기' : 'Browse'}
            <ChevronRight
              size={16}
              aria-hidden="true"
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </Link>

      {/* Libraries Card */}
      <Link
        to={localePath('/libraries')}
        className="p-6 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:-translate-y-1 hover:shadow-lg hover:border-(--border-focus) group"
      >
        <div className="text-purple-500 mb-4">
          <Package size={32} aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold text-(--text-primary) mb-2">Libraries</h2>
        <p className="text-sm text-(--text-secondary) mb-4">
          {locale === 'ko'
            ? 'MIT 라이센스 오픈소스. 상업적 사용 가능'
            : 'MIT licensed open source. Free for commercial use'}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-(--accent-primary)">100+</div>
          <div className="flex items-center gap-1 text-sm text-(--accent-primary) font-medium">
            {locale === 'ko' ? '둘러보기' : 'Browse'}
            <ChevronRight
              size={16}
              aria-hidden="true"
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
