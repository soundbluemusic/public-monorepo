import { Flame } from 'lucide-react';

interface HeroSectionProps {
  locale: 'en' | 'ko';
  children: React.ReactNode; // Search component
}

export function HeroSection({ locale, children }: HeroSectionProps) {
  return (
    <div className="text-center py-12 md:py-16">
      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 text-xs sm:text-sm font-medium mb-6 max-w-full">
        <Flame size={16} aria-hidden="true" className="shrink-0" />
        <span className="truncate">
          {locale === 'ko'
            ? `${new Date().getFullYear()}년 최신 기술 업데이트`
            : `${new Date().getFullYear()} Latest Tech Updated`}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-(--text-primary) mb-4">
        {locale === 'ko' ? '무료 웹개발 도구 모음' : 'Free Web Dev Tools'}
      </h1>

      <p className="text-lg text-(--text-secondary) mb-8 max-w-xl mx-auto">
        {locale === 'ko'
          ? '100개 이상의 MIT 라이브러리와 58개 웹표준 API를 한눈에'
          : '100+ MIT licensed libraries and 58 Web Standard APIs at a glance'}
      </p>

      {/* Stats */}
      <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 mb-8">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-(--accent-primary)">100+</div>
          <div className="text-sm text-(--text-tertiary)">
            {locale === 'ko' ? 'OSS 라이브러리' : 'OSS Libraries'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-(--accent-primary)">58</div>
          <div className="text-sm text-(--text-tertiary)">
            {locale === 'ko' ? '웹 표준 API' : 'Web APIs'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-(--accent-primary)">13</div>
          <div className="text-sm text-(--text-tertiary)">
            {locale === 'ko' ? '카테고리' : 'Categories'}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
