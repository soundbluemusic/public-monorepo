import { BookmarkCheck, TrendingUp, Trophy } from 'lucide-react';

interface StatsCardsProps {
  studiedCount: number;
  totalWords: number;
  progressPercentage: number;
  completedCategories: number;
  totalCategories: number;
  favoriteCount: number;
  t: (key: string) => string;
}

export function StatsCards({
  studiedCount,
  totalWords,
  progressPercentage,
  completedCategories,
  totalCategories,
  favoriteCount,
  t,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 mb-8">
      {/* Total Progress */}
      <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={20} className="text-(--accent-primary)" />
          <h3 className="text-sm font-semibold text-(--text-primary)">{t('totalProgress')}</h3>
        </div>
        <p className="text-2xl font-bold text-(--text-primary) mb-1">
          {studiedCount}/{totalWords}
        </p>
        <div className="w-full h-2 rounded-full overflow-hidden bg-(--bg-secondary)">
          <div
            className="h-full bg-(--accent-primary) transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Completed Categories */}
      <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={20} className="text-(--accent-primary)" />
          <h3 className="text-sm font-semibold text-(--text-primary)">
            {t('completedCategories')}
          </h3>
        </div>
        <p className="text-2xl font-bold text-(--text-primary)">
          {completedCategories}/{totalCategories}
        </p>
        <p className="text-xs text-(--text-tertiary)">{t('categoriesLabel')}</p>
      </div>

      {/* Bookmarks */}
      <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
        <div className="flex items-center gap-2 mb-2">
          <BookmarkCheck size={20} className="text-(--accent-primary)" />
          <h3 className="text-sm font-semibold text-(--text-primary)">{t('bookmarks')}</h3>
        </div>
        <p className="text-2xl font-bold text-(--text-primary)">{favoriteCount}</p>
        <p className="text-xs text-(--text-tertiary)">{t('savedWords')}</p>
      </div>
    </div>
  );
}
