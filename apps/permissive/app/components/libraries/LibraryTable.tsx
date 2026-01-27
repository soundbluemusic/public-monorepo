/**
 * LibraryTable 컴포넌트
 *
 * TanStack Table을 사용한 라이브러리 테이블 뷰입니다.
 */

'use client';

import { DataTable, TableFilter } from '@soundblue/ui/table';
import { cn } from '@soundblue/ui/utils';
import { Link } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { ExternalLink, Github, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getLibrarySlug, type Library } from '../../data/libraries';

interface LibraryTableProps {
  locale: 'en' | 'ko';
  libraries: Library[];
  selectedTag: string | null;
  onTagClick: (tag: string) => void;
}

export function LibraryTable({ locale, libraries, selectedTag, onTagClick }: LibraryTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<Library>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: locale === 'ko' ? '이름' : 'Name',
        cell: ({ row }) => {
          const lib = row.original;
          const slug = getLibrarySlug(lib.name);
          const path = locale === 'ko' ? `/ko/library/${slug}` : `/library/${slug}`;
          return (
            <Link to={path} className="font-medium text-(--accent-primary) hover:underline">
              {lib.name}
            </Link>
          );
        },
      },
      {
        accessorKey: locale === 'ko' ? 'descriptionKo' : 'description',
        header: locale === 'ko' ? '설명' : 'Description',
        cell: ({ row }) => {
          const description =
            locale === 'ko' ? row.original.descriptionKo : row.original.description;
          return (
            <span className="text-sm text-(--text-secondary) line-clamp-2">{description}</span>
          );
        },
      },
      {
        accessorKey: 'category',
        header: locale === 'ko' ? '카테고리' : 'Category',
        cell: ({ row }) => (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-(--bg-tertiary) text-(--text-secondary)">
            {row.original.category}
          </span>
        ),
        filterFn: 'equals',
      },
      {
        accessorKey: 'stars',
        header: () => (
          <div className="flex items-center gap-1">
            <Star size={14} />
            <span>{locale === 'ko' ? '스타' : 'Stars'}</span>
          </div>
        ),
        cell: ({ row }) => (
          <span className="text-sm font-medium text-(--text-secondary)">{row.original.stars}</span>
        ),
        sortingFn: (rowA, rowB) => {
          const aStars = Number.parseInt(rowA.original.stars.replace('k', '000'), 10);
          const bStars = Number.parseInt(rowB.original.stars.replace('k', '000'), 10);
          return aStars - bStars;
        },
      },
      {
        accessorKey: 'tags',
        header: locale === 'ko' ? '태그' : 'Tags',
        cell: ({ row }) => {
          const tags = row.original.tags;
          if (!tags || tags.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick(tag)}
                  className={cn(
                    'px-1.5 py-0.5 text-xs rounded transition-colors',
                    selectedTag === tag
                      ? 'bg-(--accent-primary) text-white'
                      : 'bg-(--bg-elevated) text-(--text-tertiary) hover:bg-(--bg-tertiary)',
                  )}
                >
                  {tag}
                </button>
              ))}
              {tags.length > 3 && (
                <span className="px-1.5 py-0.5 text-xs text-(--text-tertiary)">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        id: 'links',
        header: locale === 'ko' ? '링크' : 'Links',
        cell: ({ row }) => {
          const lib = row.original;
          return (
            <div className="flex items-center gap-2">
              <a
                href={lib.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded hover:bg-(--bg-tertiary) text-(--text-tertiary) hover:text-(--text-primary) transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              {lib.website && (
                <a
                  href={lib.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded hover:bg-(--bg-tertiary) text-(--text-tertiary) hover:text-(--text-primary) transition-colors"
                  aria-label="Website"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    [locale, selectedTag, onTagClick],
  );

  return (
    <div className="space-y-4">
      <TableFilter
        value={globalFilter}
        onChange={setGlobalFilter}
        placeholder={locale === 'ko' ? '라이브러리 검색...' : 'Search libraries...'}
        className="max-w-sm"
      />
      <DataTable
        data={libraries}
        columns={columns}
        enablePagination
        pageSize={15}
        enableSorting
        enableFiltering
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        emptyMessage={locale === 'ko' ? '결과 없음' : 'No results found'}
        onRowClick={(lib) => {
          const slug = getLibrarySlug(lib.name);
          window.location.href = locale === 'ko' ? `/ko/library/${slug}` : `/library/${slug}`;
        }}
      />
    </div>
  );
}
