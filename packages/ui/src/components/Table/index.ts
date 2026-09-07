/**
 * Table 컴포넌트 모듈
 *
 * @example
 * ```tsx
 * import { DataTable, TableFilter } from '@soundblue/ui/table';
 *
 * <DataTable data={entries} columns={columns} />
 * ```
 */

// TanStack Table 타입 re-export
import type { RowData, ColumnDef as TanStackColumnDef } from '@tanstack/react-table';
import type { dataTableFeatures } from './features';

export type ColumnDef<TData extends RowData, TValue = unknown> = TanStackColumnDef<
  typeof dataTableFeatures,
  TData,
  TValue
>;
export type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
export { DataTable } from './DataTable';
export { TableFilter } from './TableFilter';
export { TableHeader } from './TableHeader';
export { TablePagination } from './TablePagination';
