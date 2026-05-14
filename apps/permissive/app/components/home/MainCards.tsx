import { Link } from '@tanstack/react-router';
import { ChevronRight, Globe, Package } from 'lucide-react';
import { libraries } from '../../data/libraries';
import { webApis } from '../../data/web-apis';

const libraryCount = libraries.length;
const webApiCount = webApis.length;

interface MainCardsProps {
  locale: 'en' | 'ko';
  localePath: (path: string) => string;
}

export function MainCards({ locale, localePath }: MainCardsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 py-8">
      {/* Web API Card */}
      <Link
        to={localePath('/web-api') as string}
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
          <div className="text-2xl font-bold text-(--accent-primary)">{webApiCount}</div>
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
        to={localePath('/libraries') as string}
        className="p-6 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:-translate-y-1 hover:shadow-lg hover:border-(--border-focus) group"
      >
        <div className="text-purple-500 mb-4">
          <Package size={32} aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold text-(--text-primary) mb-2">Libraries</h2>
        <p className="text-sm text-(--text-secondary) mb-4">
          {locale === 'ko'
            ? '라이선스가 명시된 오픈소스 라이브러리'
            : 'Open-source libraries with license details'}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-(--accent-primary)">{libraryCount}</div>
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
