import { EntryListItem, useAutoAnimate } from '@soundblue/shared-react';
import { VirtualList } from '@soundblue/ui/patterns';
import { ProgressBar } from '@soundblue/ui/primitives';
import { useMemo } from 'react';
import { Link, useLoaderData } from 'react-router';
import { Layout } from '@/components/layout';
import { getCategoryById } from '@/data/categories';
import type { Category, MeaningEntry } from '@/data/types';
import { useStudyData } from '@/hooks';
import { useI18n } from '@/i18n';

/**
 * Loader: 빌드 시 데이터 로드 (SSG용) - O(1) Map 조회
 * 동적 import로 번들 크기 최적화 - 빌드 시에만 데이터 로드
 */
export async function loader({ params }: { params: { categoryId: string } }) {
  const { getEntriesByCategory } = await import('@/data/entries');
  const category = getCategoryById(params.categoryId);
  const entries = getEntriesByCategory(params.categoryId);
  return { category: category || null, entries };
}

export function meta() {
  return [{ title: 'Category - Context' }];
}

export default function CategoryPage() {
  const { category, entries } = useLoaderData<{
    category: Category | null;
    entries: MeaningEntry[];
  }>();
  const { locale, t, localePath } = useI18n();

  // Study data from custom hook
  const { studiedIds } = useStudyData({ totalEntries: entries.length });

  // Auto-animate for header section - must be before early return
  const [headerRef] = useAutoAnimate<HTMLDivElement>();

  // Memoized render function - must be before early return
  const renderItem = useMemo(
    () => (entry: MeaningEntry) => {
      const translation = entry.translations[locale];
      const isStudied = studiedIds.has(entry.id);

      return (
        <EntryListItem
          entryId={entry.id}
          korean={entry.korean}
          romanization={entry.romanization}
          translation={translation.word}
          isStudied={isStudied}
          locale={locale}
          localePath={localePath}
        />
      );
    },
    [locale, studiedIds, localePath],
  );

  // Early return for missing category - after all hooks
  if (!category) {
    return (
      <Layout>
        <div className="text-center py-12 px-4 text-(--text-tertiary)">
          <p className="text-(--text-secondary)">{t('categoryNotFound')}</p>
          <Link
            to={localePath('/browse')}
            className="text-(--accent-primary) hover:underline mt-4 inline-block"
          >
            {t('browse')}
          </Link>
        </div>
      </Layout>
    );
  }

  const studiedCount = entries.filter((e) => studiedIds.has(e.id)).length;

  return (
    <Layout>
      <div ref={headerRef} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{category.icon}</span>
          <h1 className="text-2xl font-semibold text-(--text-primary)">{category.name[locale]}</h1>
        </div>
        <p className="text-(--text-secondary)">
          {studiedCount}/{entries.length} {locale === 'ko' ? '단어 학습함' : 'words studied'}
        </p>

        {/* Progress bar */}
        {studiedCount > 0 && (
          <ProgressBar value={studiedCount} max={entries.length} className="mt-3" />
        )}
      </div>

      {/* VirtualList for category entries */}
      <VirtualList
        items={entries}
        estimateSize={52}
        className="h-150"
        overscan={5}
        renderItem={renderItem}
      />

      {entries.length === 0 && (
        <p className="text-center py-12 px-4 text-(--text-tertiary)">{t('noCategoryWords')}</p>
      )}
    </Layout>
  );
}
