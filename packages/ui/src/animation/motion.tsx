/**
 * @fileoverview Framer Motion Components
 * @environment universal
 *
 * 선언적 애니메이션 컴포넌트
 */
import { AnimatePresence, type MotionProps, motion } from 'framer-motion';
import type * as React from 'react';

import { cn } from '../utils/cn';

// Re-export core Framer Motion components
export { AnimatePresence, motion };

interface AnimationWrapperProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'article' | 'section';
}

/** FadeIn - 페이드 인 애니메이션 */
export function FadeIn({ children, className, as = 'div', ...props }: AnimationWrapperProps) {
  const Component = motion[as];

  return (
    <Component
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}

/** SlideUp - 아래에서 위로 슬라이드 + 페이드 */
export function SlideUp({ children, className, as = 'div', ...props }: AnimationWrapperProps) {
  const Component = motion[as];

  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}

/** ScaleIn - 스케일 + 페이드 인 */
export function ScaleIn({ children, className, as = 'div', ...props }: AnimationWrapperProps) {
  const Component = motion[as];

  return (
    <Component
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

/** Stagger - 자식 요소들을 순차적으로 애니메이션 */
export function Stagger({ children, className, staggerDelay = 0.1 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/** StaggerItem - Stagger 내에서 사용할 개별 아이템 */
export function StaggerItem({ children, className, as = 'div' }: AnimationWrapperProps) {
  const Component = motion[as];

  return (
    <Component
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}

/** Pressable - 터치/클릭 피드백 애니메이션 */
export function Pressable({ children, className, as = 'div', ...props }: AnimationWrapperProps) {
  const Component = motion[as];

  return (
    <Component
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.1 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}
