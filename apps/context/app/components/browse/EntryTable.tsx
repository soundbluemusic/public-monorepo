/**
 * EntryTable 컴포넌트
 *
 * TanStack Table을 사용한 엔트리 테이블 뷰입니다.
 */

'use client';

import { DataTable, TableFilter } from '@soundblue/ui/table';
import { cn } from '@soundblue/ui/utils';
import { Link } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { Bookmark, CheckCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { categories } from '@/data/categories';
import type { LightEntry } from '@/data/entries';

interface EntryTableProps {
  locale: 'en' | 'ko';
  localePath: (path: string) => string;
  entries: LightEntry[];
  categories: typeof categories;
  studiedIds: Set<string>;
  favoriteIds: Set<string>;
  bookmarkedLabel?: string;
}

export function EntryTable({
  locale,
  localePath,
  entries,
  categories: cats,
  studiedIds,
  favoriteIds,
  bookmarkedLabel,
}: EntryTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');

  // O(n) Map 생성으로 O(n*m) find() 반복 제거
  const categoryMap = useMemo(() => new Map(cats.map((c) => [c.id, c])), [cats]);

  const columns: ColumnDef<LightEntry>[] = useMemo(
    () => [
      {
        accessorKey: 'korean',
        header: locale === 'ko' ? '한글' : 'Korean',
        cell: ({ row }) => {
          const entry = row.original;
          const isStudied = studiedIds.has(entry.id);
          const isFavorite = favoriteIds.has(entry.id);
          return (
            <div className="flex items-center gap-2">
              <Link
                to={localePath(`/entry/${entry.id}`)}
                className="font-medium text-(--accent-primary) hover:underline"
              >
                {entry.korean}
              </Link>
              {isStudied && <CheckCircle size={14} className="text-(--difficulty-1) shrink-0" />}
              {isFavorite && (
                <Bookmark size={14} className="text-(--accent-secondary) fill-current shrink-0" />
              )}
            </div>
          );
        },
        sortingFn: (rowA, rowB) => rowA.original.korean.localeCompare(rowB.original.korean, 'ko'),
      },
      {
        accessorKey: 'romanization',
        header: locale === 'ko' ? '발음' : 'Romanization',
        cell: ({ row }) => (
          <span className="text-sm text-(--text-tertiary) italic">{row.original.romanization}</span>
        ),
      },
      {
        accessorKey: 'word',
        header: locale === 'ko' ? '뜻' : 'Meaning',
        cell: ({ row }) => {
          const translation = row.original.word[locale];
          return (
            <span className="text-sm text-(--text-secondary) line-clamp-1">{translation}</span>
          );
        },
        sortingFn: (rowA, rowB) => {
          const aWord = rowA.original.word[locale];
          const bWord = rowB.original.word[locale];
          return aWord.localeCompare(bWord, locale);
        },
      },
      {
        accessorKey: 'categoryId',
        header: locale === 'ko' ? '카테고리' : 'Category',
        cell: ({ row }) => {
          const category = categoryMap.get(row.original.categoryId);
          if (!category) return null;
          return (
            <div className="flex items-center gap-1.5">
              <span>{category.icon}</span>
              <span className="text-sm text-(--text-secondary)">
                {category.name[locale] || category.name.en}
              </span>
            </div>
          );
        },
        filterFn: 'equals',
      },
    ],
    [locale, localePath, studiedIds, favoriteIds, categoryMap],
  );

  return (
    <div className="space-y-4">
      <TableFilter
        value={globalFilter}
        onChange={setGlobalFilter}
        placeholder={locale === 'ko' ? '단어 검색...' : 'Search words...'}
        className="max-w-sm"
      />
      <DataTable
        data={entries}
        columns={columns}
        enablePagination
        pageSize={20}
        enableSorting
        enableFiltering
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        emptyMessage={locale === 'ko' ? '결과 없음' : 'No results found'}
        onRowClick={(entry) => {
          window.location.href = localePath(`/entry/${entry.id}`);
        }}
      />
    </div>
  );
}
