import { useAutoAnimate } from '@soundblue/ui/hooks';
import { memo } from 'react';
import { StatsCard } from '@/components/StatsCard';

interface BrowseStatsProps {
  locale: 'en' | 'ko';
  overallProgress: { percentage: number; studied: number; total: number };
  todayStudied: number;
  bookmarkCount: number;
}

export const BrowseStats = memo(function BrowseStats({
  locale,
  overallProgress,
  todayStudied,
  bookmarkCount,
}: BrowseStatsProps) {
  const [statsRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <div ref={statsRef} className="mb-6 grid gap-4 sm:grid-cols-3">
      <StatsCard
        label={locale === 'ko' ? '전체 진행률' : 'Overall Progress'}
        value={`${overallProgress.percentage.toFixed(0)}%`}
        subtitle={`${overallProgress.studied}/${overallProgress.total} ${locale === 'ko' ? '단어' : 'words'}`}
      />
      <StatsCard
        label={locale === 'ko' ? '오늘 학습' : 'Today Studied'}
        value={todayStudied}
        subtitle={locale === 'ko' ? '단어' : 'words'}
      />
      <StatsCard
        label={locale === 'ko' ? '북마크' : 'Bookmarks'}
        value={bookmarkCount}
        subtitle={locale === 'ko' ? '단어' : 'words'}
      />
    </div>
  );
});
