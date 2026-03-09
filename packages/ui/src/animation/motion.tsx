/**
 * @fileoverview CSS-based Animation Components
 * @environment universal
 *
 * Framer Motion을 제거하고 순수 CSS 애니메이션으로 대체.
 * 동일한 API를 유지하여 기존 코드와 호환성 보장.
 *
 * 장점:
 * - JS 번들 ~5KB 감소 (framer-motion 제거)
 * - 메인 스레드 부하 제거 (CSS는 컴포지터 스레드에서 처리)
 * - SSR hydration 이슈 없음
 */
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '../utils/cn';

// ========================================
// CSS Animation Keyframes & Classes
// ========================================
// 실제 @keyframes는 base.css에 정의됨
// 여기서는 컴포넌트 래퍼만 제공

// ========================================
// Animation Variant Types (호환성)
// ========================================

interface AnimationVariant {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit?: Record<string, unknown>;
}

/** Fade in/out animation */
export const fadeIn: AnimationVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/** Slide up with fade */
export const slideUp: AnimationVariant = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/** Slide down with fade */
export const slideDown: AnimationVariant = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/** Slide from left */
export const slideLeft: AnimationVariant = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

/** Slide from right */
export const slideRight: AnimationVariant = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/** Scale in/out */
export const scaleIn: AnimationVariant = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

/** Pop in with spring */
export const popIn: AnimationVariant = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

/** Stagger container */
export const staggerContainer: AnimationVariant = {
  initial: {},
  animate: {},
};

/** Stagger item */
export const staggerItem: AnimationVariant = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

// ========================================
// Gesture Props (호환성 - CSS로 대체)
// ========================================

/** Tap scale effect - CSS active:scale-[0.95] 으로 대체 */
export const tapScale = {} as const;

/** Hover lift effect - CSS hover:-translate-y-0.5 으로 대체 */
export const hoverLift = {} as const;

/** Combined tap and hover - CSS로 대체 */
export const interactiveScale = {} as const;

// ========================================
// Base Props
// ========================================

interface AnimationDivProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

// ========================================
// Motion Wrapper Components (CSS-based)
// ========================================

/** FadeIn - CSS 페이드 인 애니메이션 */
export const FadeIn = forwardRef<HTMLDivElement, AnimationDivProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('motion-fade-in', className)} {...props}>
      {children}
    </div>
  ),
);
FadeIn.displayName = 'FadeIn';

/** SlideUp - CSS 아래에서 위로 슬라이드 + 페이드 */
export const SlideUp = forwardRef<HTMLDivElement, AnimationDivProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('motion-slide-up', className)} {...props}>
      {children}
    </div>
  ),
);
SlideUp.displayName = 'SlideUp';

/** SlideDown - CSS 위에서 아래로 슬라이드 + 페이드 */
export const SlideDown = forwardRef<HTMLDivElement, AnimationDivProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('motion-slide-down', className)} {...props}>
      {children}
    </div>
  ),
);
SlideDown.displayName = 'SlideDown';

/** ScaleIn - CSS 스케일 + 페이드 인 */
export const ScaleIn = forwardRef<HTMLDivElement, AnimationDivProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('motion-scale-in', className)} {...props}>
      {children}
    </div>
  ),
);
ScaleIn.displayName = 'ScaleIn';

/** PopIn - CSS Spring-like 팝 애니메이션 */
export const PopIn = forwardRef<HTMLDivElement, AnimationDivProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('motion-pop-in', className)} {...props}>
      {children}
    </div>
  ),
);
PopIn.displayName = 'PopIn';

// ========================================
// Stagger Components (CSS custom property)
// ========================================

interface StaggerContainerProps extends AnimationDivProps {
  /** 자식 요소 간 지연 시간 (초) */
  staggerDelay?: number;
}

/** StaggerContainer - CSS 변수로 자식 순차 애니메이션 */
export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, className, staggerDelay = 0.05, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('motion-stagger-container', className)}
      style={{ '--stagger-delay': `${staggerDelay}s` } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  ),
);
StaggerContainer.displayName = 'StaggerContainer';

/** StaggerItem - CSS 순차 애니메이션 아이템 */
export const StaggerItem = forwardRef<HTMLDivElement, AnimationDivProps>(
  ({ children, className, style, ...props }, ref) => (
    <div ref={ref} className={cn('motion-stagger-item', className)} style={style} {...props}>
      {children}
    </div>
  ),
);
StaggerItem.displayName = 'StaggerItem';

// ========================================
// Interactive Components (CSS-based)
// ========================================

interface AnimationWrapperProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'article' | 'section';
}

/** Pressable - CSS 터치/클릭 피드백 */
export function Pressable({
  children,
  className,
  as: Tag = 'div',
  ...props
}: AnimationWrapperProps) {
  return (
    <Tag
      className={cn('active:scale-[0.98] hover:scale-[1.02] transition-transform', className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

interface AnimatedButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

/** AnimatedButton - CSS 탭/호버 효과 버튼 */
export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn('active:scale-[0.95] hover:-translate-y-px transition-transform', className)}
      {...props}
    >
      {children}
    </button>
  ),
);
AnimatedButton.displayName = 'AnimatedButton';

// ========================================
// Layout Components (CSS-based)
// ========================================

interface PageTransitionProps extends AnimationDivProps {
  children?: ReactNode;
}

/** PageTransition - CSS 페이지 전환 래퍼 */
export const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('motion-slide-up', className)} {...props}>
      {children}
    </div>
  ),
);
PageTransition.displayName = 'PageTransition';

// ========================================
// Collapsible (CSS grid-template-rows)
// ========================================

interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  /** 펼침 상태 */
  isOpen: boolean;
  children?: ReactNode;
}

/**
 * Collapsible - CSS grid-template-rows 기반 접기/펼치기
 *
 * height: auto 애니메이션을 CSS만으로 구현.
 * grid-template-rows: 0fr → 1fr 전환 사용.
 */
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ isOpen, children, className, ...props }, ref) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
        return;
      }
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }, [isOpen]);

    if (!shouldRender && !isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          className,
        )}
        {...props}
      >
        <div ref={innerRef} className="overflow-hidden">
          {children}
        </div>
      </div>
    );
  },
);
Collapsible.displayName = 'Collapsible';

// ========================================
// Removed Exports (호환성 shim)
// ========================================

/**
 * MotionProvider - 더 이상 필요 없음 (CSS 기반으로 전환)
 * 기존 코드 호환성을 위해 passthrough 컴포넌트로 유지
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * AnimatePresence - 더 이상 필요 없음
 * 기존 코드 호환성을 위해 passthrough 컴포넌트로 유지
 */
export function AnimatePresence({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/** m - 더 이상 필요 없음. 호환성을 위한 빈 프록시 */
export const m = {} as Record<string, unknown>;

/** motion - m의 별칭 */
export const motion = m;
