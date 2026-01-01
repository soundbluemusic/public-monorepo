import { useAutoAnimate } from '@soundblue/ui/hooks';
import { memo } from 'react';
import { StatsCard } from '@/components/StatsCard';

interface BrowseStatsProps {
  overallProgress: { percentage: number; studied: number; total: number };
  todayStudied: number;
  bookmarkCount: number;
  /** i18n translation function */
  t: (key: string) => string;
}

export const BrowseStats = memo(function BrowseStats({
  overallProgress,
  todayStudied,
  bookmarkCount,
  t,
}: BrowseStatsProps) {
  const [statsRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <div ref={statsRef} className="mb-6 grid gap-4 sm:grid-cols-3">
      <StatsCard
        label={t('overallProgress')}
        value={`${overallProgress.percentage.toFixed(0)}%`}
        subtitle={`${overallProgress.studied}/${overallProgress.total} ${t('words')}`}
      />
      <StatsCard label={t('todayStudied')} value={todayStudied} subtitle={t('words')} />
      <StatsCard label={t('bookmarks')} value={bookmarkCount} subtitle={t('words')} />
    </div>
  );
});
