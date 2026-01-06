import { useAutoAnimate } from '@soundblue/ui/hooks';
import { memo } from 'react';
import { StatsCard } from '@/components/StatsCard';
import type { MessageKey } from '@/i18n';

interface BrowseStatsProps {
  overallProgress: { percentage: number; studied: number; total: number };
  todayStudied: number;
  bookmarkCount: number;
  /** i18n translation function (타입 안전) */
  t: (key: MessageKey) => string;
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
