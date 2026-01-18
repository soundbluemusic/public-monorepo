import { dynamicMetaFactory } from '@soundblue/i18n';
import { useAutoAnimate } from '@soundblue/ui/hooks';
import { ProgressBar } from '@soundblue/ui/primitives';
import { useLoaderData } from 'react-router';
import { EntryListItem } from '@/components/entry/EntryListItem';
import { Layout } from '@/components/layout';
import { getCategoryById } from '@/data/categories';
import type { Category, MeaningEntry } from '@/data/types';
import { useStudyData } from '@/hooks';
import { useI18n } from '@/i18n';

interface LoaderData {
  category: Category;
  entries: MeaningEntry[];
}

/**
 * loader: SSR 런타임에서 실행
 * 카테고리 데이터를 조회합니다.
 */
export async function loader({ params }: { params: { categoryId: string } }): Promise<LoaderData> {
  const { getEntriesByCategory } = await import('@/data/entries');
  const category = getCategoryById(params.categoryId);

  // Category가 없으면 HTTP 404 반환 (Soft 404 방지)
  if (!category) {
    throw new Response('Category not found', { status: 404 });
  }

  const entries = await getEntriesByCategory(params.categoryId);
  return { category, entries };
}

/**
 * clientLoader: 클라이언트 네비게이션 시 실행
 * SSR 데이터가 있으면 사용, 없으면 직접 로드
 */
export async function clientLoader({
  params,
  serverLoader,
}: {
  params: { categoryId: string };
  serverLoader: () => Promise<LoaderData>;
}): Promise<LoaderData> {
  try {
    return await serverLoader();
  } catch {
    // SSR 데이터가 없는 경우 직접 로드
    const { getEntriesByCategory } = await import('@/data/entries');
    const category = getCategoryById(params.categoryId);

    // Category가 없으면 HTTP 404 반환
    if (!category) {
      throw new Response('Category not found', { status: 404 });
    }

    const entries = await getEntriesByCategory(params.categoryId);
    return { category, entries };
  }
}

export const meta = dynamicMetaFactory((data: { category: Category; entries: MeaningEntry[] }) => {
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
}, 'https://context.soundbluemusic.com');

export default function CategoryPage() {
  const { category, entries } = useLoaderData<{
    category: Category;
    entries: MeaningEntry[];
  }>();
  const { locale, t, localePath } = useI18n();

  // Study data from custom hook
  const { studiedIds } = useStudyData({ totalEntries: entries.length });

  // Auto-animate for list section
  const [listRef] = useAutoAnimate<HTMLDivElement>();

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
