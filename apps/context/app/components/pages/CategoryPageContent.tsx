/**
 * @fileoverview Category 페이지 공유 컴포넌트
 *
 * 영어/한국어 라우트 파일에서 공통으로 사용하는 UI 컴포넌트입니다.
 * useI18n()을 통해 locale에 따라 자동으로 번역된 텍스트를 표시합니다.
 */

import { type BreadcrumbItem, generateBreadcrumbSchema } from '@soundblue/seo/structured-data';
import { useAutoAnimate } from '@soundblue/ui/hooks';
import { Pagination } from '@soundblue/ui/patterns';
import { ProgressBar } from '@soundblue/ui/primitives';
import { useRouterState } from '@tanstack/react-router';
import { useCallback } from 'react';
import { EntryListItem } from '@/components/entry/EntryListItem';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import type { Category, LocaleEntry } from '@/data/types';
import { useStudyData } from '@/hooks';
import { useI18n } from '@/i18n';

interface CategoryPageContentProps {
  category: Category;
  entries: LocaleEntry[];
  currentPage: number;
  totalCount: number;
  totalPages: number;
}

export function CategoryPageContent({
  category,
  entries,
  currentPage,
  totalCount,
  totalPages,
}: CategoryPageContentProps) {
  const { locale, t, localePath } = useI18n();
  const routerState = useRouterState();

  const { studiedIds } = useStudyData({ totalEntries: totalCount });
  const [listRef] = useAutoAnimate<HTMLDivElement>();

  const studiedCount = entries.filter((e) => studiedIds.has(e.id)).length;

  const { baseUrl } = APP_CONFIG;

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: t('home'), url: `${baseUrl}${localePath('/')}` },
    { name: category.name[locale], url: `${baseUrl}${localePath(`/category/${category.id}`)}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(routerState.location.search);
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', String(page));
      }
      const search = params.toString();
      const newUrl = search
        ? `${routerState.location.pathname}?${search}`
        : routerState.location.pathname;
      window.location.href = newUrl;
    },
    [routerState.location.search, routerState.location.pathname],
  );

  return (
    <Layout>
      {/* JSON-LD - content is generated from trusted category metadata */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="pt-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{category.icon}</span>
            <h1 className="text-2xl font-semibold text-(--text-primary)">
              {category.name[locale]}
            </h1>
          </div>
          <p className="text-(--text-secondary)">
            {studiedCount}/{totalCount} {t('wordsStudied')}
          </p>

          {studiedCount > 0 && (
            <ProgressBar value={studiedCount} max={totalCount} className="mt-3" />
          )}
        </div>

        {totalPages > 1 && (
          <p className="mb-4 text-sm text-(--text-tertiary)">
            {t('browsePageOf')
              .replace('{current}', String(currentPage))
              .replace('{total}', String(totalPages))}
          </p>
        )}

        <div ref={listRef} className="space-y-1">
          {entries.map((entry) => {
            const isStudied = studiedIds.has(entry.id);

            return (
              <EntryListItem
                key={entry.id}
                entryId={entry.id}
                korean={entry.korean}
                romanization={entry.romanization}
                translation={entry.translation.word}
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

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            labels={{
              navLabel: t('pageNavigation'),
              previousPage: t('previousPage'),
              nextPage: t('nextPage'),
            }}
          />
        )}
      </div>
    </Layout>
  );
}
