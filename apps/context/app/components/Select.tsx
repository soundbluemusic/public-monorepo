/**
 * @fileoverview 스타일링된 Select 컴포넌트
 *
 * browse.tsx의 필터 컨트롤에서 중복되던 select 스타일을 추출했습니다.
 */

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  /** 고유 ID */
  id: string;
  /** 라벨 텍스트 */
  label: string;
  /** 현재 선택된 값 */
  value: string;
  /** 옵션 목록 */
  options: SelectOption[];
  /** 값 변경 핸들러 */
  onChange: (value: string) => void;
  /** 추가 wrapper 클래스 */
  className?: string;
}

/**
 * Select - 스타일링된 드롭다운 선택 컴포넌트
 *
 * @example
 * ```tsx
 * <Select
 *   id="category-filter"
 *   label="카테고리"
 *   value={filterCategory}
 *   options={[
 *     { value: 'all', label: '전체' },
 *     { value: 'greetings', label: '인사' },
 *   ]}
 *   onChange={setFilterCategory}
 * />
 * ```
 */
export function Select({ id, label, value, options, onChange, className = '' }: SelectProps) {
  // Debug: Log when component renders with React
  console.log(`[SELECT ${id}] React render, value=${value}`);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(`[SELECT ${id}] onChange fired: ${e.target.value}`);
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm mb-1 text-(--text-secondary)">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        className="w-full min-h-10 px-3 rounded-lg border border-(--border-primary) bg-(--bg-elevated) text-(--text-primary)"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
