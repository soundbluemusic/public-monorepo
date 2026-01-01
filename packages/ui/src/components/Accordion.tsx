/**
 * @fileoverview Accordion Compound Component
 * @environment universal
 *
 * Compound Component 패턴을 사용한 아코디언 컴포넌트
 * 단일/다중 선택 모드 지원
 *
 * @example
 * <Accordion type="single" defaultValue="item-1">
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>Section 1</Accordion.Trigger>
 *     <Accordion.Content>Content 1</Accordion.Content>
 *   </Accordion.Item>
 *   <Accordion.Item value="item-2">
 *     <Accordion.Trigger>Section 2</Accordion.Trigger>
 *     <Accordion.Content>Content 2</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 */
import { ChevronDown } from 'lucide-react';
import {
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useState,
} from 'react';

import { Collapsible } from '../animation/motion';
import { cn } from '../utils/cn';

// ========================================
// Context
// ========================================

interface AccordionContextValue {
  /** 열린 아이템들 (multiple) 또는 단일 값 (single) */
  value: string[];
  /** 아이템 토글 핸들러 */
  onToggle: (itemValue: string) => void;
  /** 타입: single (하나만) / multiple (여러 개) */
  type: 'single' | 'multiple';
  /** 고유 ID 접두어 (a11y) */
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(componentName: string): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(`<${componentName}> must be used within <Accordion>`);
  }
  return context;
}

// Item context for nested components
interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext(componentName: string): AccordionItemContextValue {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error(`<${componentName}> must be used within <Accordion.Item>`);
  }
  return context;
}

// ========================================
// Root Component
// ========================================

interface AccordionSingleProps {
  type: 'single';
  /** 기본 열린 아이템 (uncontrolled) */
  defaultValue?: string;
  /** 현재 열린 아이템 (controlled) */
  value?: string;
  /** 변경 콜백 */
  onValueChange?: (value: string) => void;
  /** 모두 닫기 허용 */
  collapsible?: boolean;
}

interface AccordionMultipleProps {
  type: 'multiple';
  /** 기본 열린 아이템들 (uncontrolled) */
  defaultValue?: string[];
  /** 현재 열린 아이템들 (controlled) */
  value?: string[];
  /** 변경 콜백 */
  onValueChange?: (value: string[]) => void;
}

export type AccordionRootProps = (AccordionSingleProps | AccordionMultipleProps) & {
  children: ReactNode;
  className?: string;
};

function AccordionRoot(props: AccordionRootProps) {
  const { type, children, className } = props;
  const baseId = useId();

  // Single mode
  const [singleValue, setSingleValue] = useState<string>(
    type === 'single' ? (props.defaultValue ?? '') : '',
  );

  // Multiple mode
  const [multipleValue, setMultipleValue] = useState<string[]>(
    type === 'multiple' ? (props.defaultValue ?? []) : [],
  );

  const handleToggle = useCallback(
    (itemValue: string) => {
      if (type === 'single') {
        const singleProps = props as AccordionSingleProps;
        const isControlled = singleProps.value !== undefined;
        const currentValue = isControlled ? singleProps.value : singleValue;

        let newValue: string;
        if (currentValue === itemValue) {
          newValue = singleProps.collapsible ? '' : itemValue;
        } else {
          newValue = itemValue;
        }

        if (!isControlled) {
          setSingleValue(newValue);
        }
        singleProps.onValueChange?.(newValue);
      } else {
        const multipleProps = props as AccordionMultipleProps;
        const isControlled = multipleProps.value !== undefined;
        const currentValue = isControlled ? multipleProps.value : multipleValue;

        const newValue = currentValue?.includes(itemValue)
          ? currentValue.filter((v) => v !== itemValue)
          : [...(currentValue ?? []), itemValue];

        if (!isControlled) {
          setMultipleValue(newValue);
        }
        multipleProps.onValueChange?.(newValue);
      }
    },
    [type, props, singleValue, multipleValue],
  );

  const value =
    type === 'single'
      ? [(props as AccordionSingleProps).value ?? singleValue].filter(Boolean)
      : ((props as AccordionMultipleProps).value ?? multipleValue);

  return (
    <AccordionContext.Provider value={{ value, onToggle: handleToggle, type, baseId }}>
      <div className={cn('divide-y divide-(--border-primary)', className)} data-accordion-root="">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// ========================================
// Item Component
// ========================================

export interface AccordionItemProps {
  /** 아이템 식별자 */
  value: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, children, className }, ref) => {
    const { value: openValues } = useAccordionContext('Accordion.Item');
    const isOpen = openValues.includes(value);

    return (
      <AccordionItemContext.Provider value={{ value, isOpen }}>
        <div
          ref={ref}
          data-state={isOpen ? 'open' : 'closed'}
          data-disabled={disabled || undefined}
          className={cn('border-0', className)}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);
AccordionItem.displayName = 'Accordion.Item';

// ========================================
// Trigger Component
// ========================================

export interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className }, ref) => {
    const { onToggle, baseId } = useAccordionContext('Accordion.Trigger');
    const { value, isOpen } = useAccordionItemContext('Accordion.Trigger');

    return (
      <h3 className="flex">
        <button
          ref={ref}
          type="button"
          id={`${baseId}-trigger-${value}`}
          aria-expanded={isOpen}
          aria-controls={`${baseId}-content-${value}`}
          onClick={() => onToggle(value)}
          className={cn(
            'flex flex-1 items-center justify-between py-4 text-left',
            'font-medium text-(--text-primary) transition-all',
            'hover:underline focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2',
            className,
          )}
        >
          {children}
          <ChevronDown
            size={16}
            className={cn(
              'shrink-0 text-(--text-tertiary) transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          />
        </button>
      </h3>
    );
  },
);
AccordionTrigger.displayName = 'Accordion.Trigger';

// ========================================
// Content Component
// ========================================

export interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className }, ref) => {
    const { baseId } = useAccordionContext('Accordion.Content');
    const { value, isOpen } = useAccordionItemContext('Accordion.Content');

    return (
      <Collapsible
        isOpen={isOpen}
        ref={ref}
        id={`${baseId}-content-${value}`}
        aria-labelledby={`${baseId}-trigger-${value}`}
        className={cn('overflow-hidden', className)}
      >
        <div className="pb-4 pt-0 text-(--text-secondary)">{children}</div>
      </Collapsible>
    );
  },
);
AccordionContent.displayName = 'Accordion.Content';

// ========================================
// Compound Component Export
// ========================================

/**
 * Accordion Compound Component
 *
 * @example
 * // Single mode (only one open at a time)
 * <Accordion type="single" defaultValue="item-1" collapsible>
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
 *     <Accordion.Content>Yes. It follows WAI-ARIA guidelines.</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 *
 * @example
 * // Multiple mode (multiple items can be open)
 * <Accordion type="multiple" defaultValue={['item-1', 'item-2']}>
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>First Section</Accordion.Trigger>
 *     <Accordion.Content>First content</Accordion.Content>
 *   </Accordion.Item>
 *   <Accordion.Item value="item-2">
 *     <Accordion.Trigger>Second Section</Accordion.Trigger>
 *     <Accordion.Content>Second content</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 */
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

export type { AccordionRootProps as AccordionProps };
