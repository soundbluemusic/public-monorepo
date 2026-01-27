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
export type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';
export { DataTable } from './DataTable';
export { TableFilter } from './TableFilter';
export { TableHeader } from './TableHeader';
export { TablePagination } from './TablePagination';
