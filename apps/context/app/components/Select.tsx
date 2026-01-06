/**
 * @fileoverview 스타일링된 Select 컴포넌트
 *
 * browse.tsx의 필터 컨트롤에서 중복되던 select 스타일을 추출했습니다.
 */

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string = string> {
  /** 고유 ID */
  id: string;
  /** 라벨 텍스트 */
  label: string;
  /** 현재 선택된 값 */
  value: T;
  /** 옵션 목록 */
  options: SelectOption<T>[];
  /** 값 변경 핸들러 - 타입 안전한 콜백 */
  onChange: (value: T) => void;
  /** 추가 wrapper 클래스 */
  className?: string;
}

/**
 * Select - 타입 안전한 드롭다운 선택 컴포넌트
 *
 * 제네릭 타입 T를 사용하여 options의 value 타입과 onChange 콜백 타입이 일치하도록 보장합니다.
 *
 * @example
 * ```tsx
 * // 타입 안전: FilterCategory 타입이 자동 추론됨
 * <Select
 *   id="category-filter"
 *   label="카테고리"
 *   value={filterCategory}
 *   options={[
 *     { value: 'all', label: '전체' },
 *     { value: 'greetings', label: '인사' },
 *   ] as const}
 *   onChange={setFilterCategory}
 * />
 * ```
 */
export function Select<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  className = '',
}: SelectProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // options에서 제공된 값만 선택 가능하므로 타입 단언이 안전함
    onChange(e.target.value as T);
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
