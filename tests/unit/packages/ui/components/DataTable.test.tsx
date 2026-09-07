import { type ColumnDef, DataTable } from '@soundblue/ui/components/Table';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

type Entry = { name: string; score: number };
const data: Entry[] = [
  { name: 'Charlie', score: 3 },
  { name: 'Alice', score: 1 },
  { name: 'Bob', score: 2 },
];
const columns: ColumnDef<Entry>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'score', header: 'Score' },
];

function names() {
  return screen.getAllByRole('row').slice(1).map((row) => within(row).getAllByRole('cell')[0]?.textContent);
}

describe('DataTable', () => {
  it('정렬 상태를 바꾸면 행 순서가 갱신된다', async () => {
    const user = userEvent.setup();
    render(<DataTable data={data} columns={columns} />);
    await user.click(screen.getByRole('columnheader', { name: 'Name' }));
    expect(names()).toEqual(['Alice', 'Bob', 'Charlie']);
    await user.click(screen.getByRole('columnheader', { name: 'Name' }));
    expect(names()).toEqual(['Charlie', 'Bob', 'Alice']);
  });

  it('페이지 이동 시 행과 페이지 번호가 함께 갱신된다', async () => {
    const user = userEvent.setup();
    render(<DataTable data={data} columns={columns} pageSize={2} />);
    expect(names()).toEqual(['Charlie', 'Alice']);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(names()).toEqual(['Bob']);
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'First page' }));
    expect(names()).toEqual(['Charlie', 'Alice']);
  });

  it('외부 필터 변경과 필터 비활성화를 반영한다', () => {
    const { rerender } = render(<DataTable data={data} columns={columns} globalFilter="ali" />);
    expect(names()).toEqual(['Alice']);
    rerender(<DataTable data={data} columns={columns} globalFilter="bob" />);
    expect(names()).toEqual(['Bob']);
    rerender(<DataTable data={data} columns={columns} globalFilter="bob" enableFiltering={false} />);
    expect(names()).toEqual(['Charlie', 'Alice', 'Bob']);
  });

  it('페이지와 정렬 비활성화 시 전체 원본 순서를 유지한다', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<DataTable data={data} columns={columns} pageSize={1} enablePagination={false} enableSorting={false} onRowClick={onRowClick} />);
    await user.click(screen.getByRole('columnheader', { name: 'Name' }));
    expect(names()).toEqual(['Charlie', 'Alice', 'Bob']);
    expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('cell', { name: 'Alice' }));
    expect(onRowClick).toHaveBeenCalledWith(data[1]);
  });

  it('결과가 없거나 로딩 중이면 해당 상태를 표시한다', () => {
    const { rerender } = render(<DataTable data={data} columns={columns} globalFilter="missing" />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
    rerender(<DataTable data={data} columns={columns} isLoading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
