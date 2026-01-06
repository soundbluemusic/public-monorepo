import { dynamicMetaFactory } from '@soundblue/i18n';
import { useAutoAnimate } from '@soundblue/ui/hooks';
import { ProgressBar } from '@soundblue/ui/primitives';
import { Link, useLoaderData } from 'react-router';
import { EntryListItem } from '@/components/entry/EntryListItem';
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
  const entries = await getEntriesByCategory(params.categoryId);
  return { category: category || null, entries };
}

export const meta = dynamicMetaFactory(
  (data: { category: Category | null; entries: MeaningEntry[] }) => {
    if (!data?.category) {
      return {
        ko: { title: '카테고리를 찾을 수 없습니다 | Context' },
        en: { title: 'Category Not Found | Context' },
      };
    }
    const { category, entries } = data;
    return {
      ko: {
        title: `${category.name.ko} | Context`,
        description: `${category.name.ko} 카테고리의 ${entries.length}개 한국어 단어 학습`,
      },
      en: {
        title: `${category.name.en} | Context`,
        description: `Learn ${entries.length} Korean words in the ${category.name.en} category`,
      },
    };
  },
  'https://context.soundbluemusic.com',
);

export default function CategoryPage() {
  const { category, entries } = useLoaderData<{
    category: Category | null;
    entries: MeaningEntry[];
  }>();
  const { locale, t, localePath } = useI18n();

  // Study data from custom hook
  const { studiedIds } = useStudyData({ totalEntries: entries.length });

  // Auto-animate for list section
  const [listRef] = useAutoAnimate<HTMLDivElement>();

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
      <div className="pt-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{category.icon}</span>
            <h1 className="text-2xl font-semibold text-(--text-primary)">
              {category.name[locale]}
            </h1>
          </div>
          <p className="text-(--text-secondary)">
            {studiedCount}/{entries.length} {locale === 'ko' ? '단어 학습함' : 'words studied'}
          </p>

          {/* Progress bar */}
          {studiedCount > 0 && (
            <ProgressBar value={studiedCount} max={entries.length} className="mt-3" />
          )}
        </div>

        {/* Entry list - SSG compatible (no virtualization needed for ~50 items) */}
        <div ref={listRef} className="space-y-1">
          {entries.map((entry) => {
            const translation = entry.translations[locale];
            const isStudied = studiedIds.has(entry.id);

            return (
              <EntryListItem
                key={entry.id}
                entryId={entry.id}
                korean={entry.korean}
                romanization={entry.romanization}
                translation={translation.word}
                isStudied={isStudied}
                locale={locale}
                localePath={localePath}
              />
            );
          })}
        </div>

        {entries.length === 0 && (
          <p className="text-center py-12 px-4 text-(--text-tertiary)">{t('noCategoryWords')}</p>
        )}
      </div>
    </Layout>
  );
}
