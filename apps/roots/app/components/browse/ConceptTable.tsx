/**
 * ConceptTable 컴포넌트
 *
 * TanStack Table을 사용한 개념 테이블 뷰입니다.
 */

'use client';

import { DataTable, TableFilter } from '@soundblue/ui/table';
import { Link } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import type { LightConcept } from '@/data/concepts';
import { getFieldById } from '@/data/fields';
import { useI18n } from '@/i18n';

interface ConceptTableProps {
  concepts: LightConcept[];
}

export function ConceptTable({ concepts }: ConceptTableProps) {
  const { locale, localePath } = useI18n();
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<LightConcept>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: locale === 'ko' ? '이름' : 'Name',
        cell: ({ row }) => {
          const concept = row.original;
          const name = concept.name[locale] || concept.name.en;
          return (
            <Link
              to={localePath(`/concept/${concept.id}`)}
              className="font-medium text-(--accent-primary) hover:underline"
            >
              {name}
            </Link>
          );
        },
        sortingFn: (rowA, rowB) => {
          const aName = rowA.original.name[locale] || rowA.original.name.en;
          const bName = rowB.original.name[locale] || rowB.original.name.en;
          return aName.localeCompare(bName, locale);
        },
      },
      {
        accessorKey: 'def',
        header: locale === 'ko' ? '정의' : 'Definition',
        cell: ({ row }) => {
          const def = row.original.def[locale] || row.original.def.en;
          return <span className="text-sm text-(--text-secondary) line-clamp-2">{def}</span>;
        },
        enableSorting: false,
      },
      {
        accessorKey: 'difficulty',
        header: locale === 'ko' ? '난이도' : 'Difficulty',
        cell: ({ row }) => (
          <DifficultyBadge level={row.original.difficulty} showLabel={false} size="sm" />
        ),
        sortingFn: (rowA, rowB) => rowA.original.difficulty - rowB.original.difficulty,
      },
      {
        accessorKey: 'field',
        header: locale === 'ko' ? '분야' : 'Field',
        cell: ({ row }) => {
          const field = getFieldById(row.original.field);
          if (!field) return null;
          return (
            <div className="flex items-center gap-1.5">
              <span>{field.icon}</span>
              <span className="text-sm text-(--text-secondary)">
                {field.name[locale] || field.name.en}
              </span>
            </div>
          );
        },
        filterFn: 'equals',
      },
      {
        accessorKey: 'subfield',
        header: locale === 'ko' ? '세부 분야' : 'Subfield',
        cell: ({ row }) => (
          <span className="px-2 py-1 text-xs rounded-full bg-(--bg-tertiary) text-(--text-secondary)">
            {row.original.subfield}
          </span>
        ),
      },
      {
        accessorKey: 'tags',
        header: locale === 'ko' ? '태그' : 'Tags',
        cell: ({ row }) => {
          const tags = row.original.tags;
          if (!tags || tags.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-xs rounded bg-(--bg-elevated) text-(--text-tertiary)"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="px-1.5 py-0.5 text-xs text-(--text-tertiary)">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    [locale, localePath],
  );

  return (
    <div className="space-y-4">
      <TableFilter
        value={globalFilter}
        onChange={setGlobalFilter}
        placeholder={locale === 'ko' ? '개념 검색...' : 'Search concepts...'}
        className="max-w-sm"
      />
      <DataTable
        data={concepts}
        columns={columns}
        enablePagination
        pageSize={15}
        enableSorting
        enableFiltering
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        emptyMessage={locale === 'ko' ? '결과 없음' : 'No results found'}
        onRowClick={(concept) => {
          window.location.href = localePath(`/concept/${concept.id}`);
        }}
      />
    </div>
  );
}
