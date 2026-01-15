/**
 * @fileoverview Tabs Compound Component
 * @environment universal
 *
 * Compound Component 패턴을 사용한 탭 컴포넌트
 * Radix UI 스타일의 조합 가능한 API 제공
 *
 * @example
 * <Tabs defaultValue="tab1">
 *   <Tabs.List>
 *     <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
 *     <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="tab1">Content 1</Tabs.Content>
 *   <Tabs.Content value="tab2">Content 2</Tabs.Content>
 * </Tabs>
 */
import {
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useState,
} from 'react';

import { cn } from '../utils/cn';

// ========================================
// Context
// ========================================

interface TabsContextValue {
  /** 현재 활성화된 탭 값 */
  value: string;
  /** 탭 변경 핸들러 */
  onValueChange: (value: string) => void;
  /** 고유 ID 접두어 (a11y) */
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(componentName: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(`<${componentName}> must be used within <Tabs>`);
  }
  return context;
}

// ========================================
// Root Component
// ========================================

export interface TabsRootProps {
  /** 기본 활성 탭 (uncontrolled) */
  defaultValue?: string;
  /** 현재 활성 탭 (controlled) */
  value?: string;
  /** 탭 변경 콜백 */
  onValueChange?: (value: string) => void;
  /** 자식 요소 */
  children: ReactNode;
  /** 추가 클래스 */
  className?: string;
}

function TabsRoot({
  defaultValue = '',
  value: controlledValue,
  onValueChange,
  children,
  className,
}: TabsRootProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const baseId = useId();

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange, baseId }}>
      <div className={cn('flex flex-col', className)} data-tabs-root="">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ========================================
// List Component
// ========================================

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 p-1',
        'rounded-lg bg-(--bg-secondary) border border-(--border-primary)',
        className,
      )}
    >
      {children}
    </div>
  );
});
TabsList.displayName = 'Tabs.List';

// ========================================
// Trigger Component
// ========================================

export interface TabsTriggerProps {
  /** 탭 식별자 */
  value: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, disabled = false, children, className }, ref) => {
    const { value: selectedValue, onValueChange, baseId } = useTabsContext('Tabs.Trigger');
    const isSelected = selectedValue === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`${baseId}-trigger-${value}`}
        aria-selected={isSelected}
        aria-controls={`${baseId}-content-${value}`}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        onClick={() => onValueChange(value)}
        className={cn(
          'inline-flex items-center justify-center px-3 py-1.5',
          'text-sm font-medium rounded-md transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2',
          isSelected
            ? 'bg-(--bg-primary) text-(--text-primary) shadow-sm'
            : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-tertiary)',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
      >
        {children}
      </button>
    );
  },
);
TabsTrigger.displayName = 'Tabs.Trigger';

// ========================================
// Content Component
// ========================================

export interface TabsContentProps {
  /** 탭 식별자 */
  value: string;
  /** 비활성 시에도 DOM 유지 */
  forceMount?: boolean;
  children: ReactNode;
  className?: string;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, forceMount = false, children, className }, ref) => {
    const { value: selectedValue, baseId } = useTabsContext('Tabs.Content');
    const isSelected = selectedValue === value;

    if (!isSelected && !forceMount) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${baseId}-content-${value}`}
        aria-labelledby={`${baseId}-trigger-${value}`}
        hidden={!isSelected}
        tabIndex={-1}
        className={cn(
          'mt-2 rounded-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary)',
          className,
        )}
      >
        {children}
      </div>
    );
  },
);
TabsContent.displayName = 'Tabs.Content';

// ========================================
// Compound Component Export
// ========================================

/**
 * Tabs Compound Component
 *
 * @example
 * // Basic usage
 * <Tabs defaultValue="account">
 *   <Tabs.List>
 *     <Tabs.Trigger value="account">Account</Tabs.Trigger>
 *     <Tabs.Trigger value="password">Password</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="account">
 *     <p>Account settings here</p>
 *   </Tabs.Content>
 *   <Tabs.Content value="password">
 *     <p>Password settings here</p>
 *   </Tabs.Content>
 * </Tabs>
 *
 * @example
 * // Controlled mode
 * const [tab, setTab] = useState('account');
 * <Tabs value={tab} onValueChange={setTab}>
 *   ...
 * </Tabs>
 */
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export type { TabsRootProps as TabsProps };
