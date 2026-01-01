/**
 * @fileoverview Framer Motion Animation Components
 * @environment universal
 *
 * Reusable animation primitives for consistent UI transitions.
 * 선언적 애니메이션 컴포넌트 및 Variants 프리셋
 */
import {
  AnimatePresence,
  type HTMLMotionProps,
  type MotionProps,
  motion,
  type Variants,
} from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../utils/cn';

// ========================================
// Animation Variants (Presets)
// ========================================

/** Fade in/out animation */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/** Slide up with fade */
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/** Slide down with fade */
export const slideDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/** Slide from left */
export const slideLeft: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

/** Slide from right */
export const slideRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/** Scale in/out */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

/** Pop in with spring */
export const popIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.8 },
};

/** Stagger container */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/** Stagger item */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

// ========================================
// Animation Props (Gestures)
// ========================================

/** Tap scale effect for buttons */
export const tapScale = {
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
} as const;

/** Hover lift effect */
export const hoverLift = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
} as const;

/** Combined tap and hover */
export const interactiveScale = {
  whileTap: { scale: 0.98 },
  whileHover: { scale: 1.02 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
} as const;

// ========================================
// Motion Wrapper Components
// ========================================

interface MotionDivProps extends HTMLMotionProps<'div'> {
  children?: ReactNode;
}

interface AnimationWrapperProps extends MotionProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'article' | 'section';
}

// Re-export core Framer Motion
export { AnimatePresence, motion };

/** FadeIn - 페이드 인 애니메이션 */
export const FadeIn = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
FadeIn.displayName = 'FadeIn';

/** SlideUp - 아래에서 위로 슬라이드 + 페이드 */
export const SlideUp = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideUp}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
SlideUp.displayName = 'SlideUp';

/** SlideDown - 위에서 아래로 슬라이드 + 페이드 */
export const SlideDown = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideDown}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
SlideDown.displayName = 'SlideDown';

/** ScaleIn - 스케일 + 페이드 인 */
export const ScaleIn = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={scaleIn}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
ScaleIn.displayName = 'ScaleIn';

/** PopIn - Spring 기반 팝 애니메이션 */
export const PopIn = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={popIn}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
PopIn.displayName = 'PopIn';

interface StaggerContainerProps extends MotionDivProps {
  /** 자식 요소 간 지연 시간 (초) */
  staggerDelay?: number;
}

/** StaggerContainer - 자식 요소들을 순차적으로 애니메이션 */
export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, className, staggerDelay = 0.1, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
StaggerContainer.displayName = 'StaggerContainer';

/** StaggerItem - StaggerContainer 내에서 사용할 개별 아이템 */
export const StaggerItem = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div ref={ref} variants={staggerItem} className={cn(className)} {...props}>
      {children}
    </motion.div>
  ),
);
StaggerItem.displayName = 'StaggerItem';

// ========================================
// Interactive Components
// ========================================

/** Pressable - 터치/클릭 피드백 애니메이션 */
export function Pressable({ children, className, as = 'div', ...props }: AnimationWrapperProps) {
  const Component = motion[as];

  return (
    <Component {...interactiveScale} className={cn(className)} {...props}>
      {children}
    </Component>
  );
}

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children?: ReactNode;
}

/** AnimatedButton - 탭/호버 효과가 있는 버튼 */
export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.button>
  ),
);
AnimatedButton.displayName = 'AnimatedButton';

// ========================================
// Layout Components
// ========================================

interface PageTransitionProps extends MotionDivProps {
  children?: ReactNode;
}

/** PageTransition - 페이지 전환 애니메이션 래퍼 */
export const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
PageTransition.displayName = 'PageTransition';

interface CollapsibleProps extends MotionDivProps {
  /** 펼침 상태 */
  isOpen: boolean;
}

/** Collapsible - 접기/펼치기 애니메이션 패널 */
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ isOpen, children, className, ...props }, ref) => (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ overflow: 'hidden' }}
          className={cn(className)}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  ),
);
Collapsible.displayName = 'Collapsible';

// ========================================
// Legacy Aliases (Backward Compatibility)
// ========================================

/** @deprecated Use StaggerContainer instead */
export const Stagger = StaggerContainer;
