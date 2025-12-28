/**
 * Framer Motion Components
 *
 * 선언적 애니메이션 컴포넌트
 * - 진입/퇴장 애니메이션 (AnimatePresence)
 * - 제스처 인터랙션 (drag, tap, hover)
 * - 레이아웃 애니메이션
 *
 * @example
 * ```tsx
 * import { FadeIn, SlideUp, AnimatePresence } from '@soundblue/shared-react/components/ui/motion';
 *
 * // 간단한 fade in
 * <FadeIn>
 *   <Card>Content</Card>
 * </FadeIn>
 *
 * // 리스트 애니메이션 (삭제 시 exit 애니메이션 포함)
 * <AnimatePresence>
 *   {items.map(item => (
 *     <SlideUp key={item.id}>
 *       <ListItem>{item.name}</ListItem>
 *     </SlideUp>
 *   ))}
 * </AnimatePresence>
 * ```
 */
import { AnimatePresence, type MotionProps, motion } from 'framer-motion';
import type * as React from 'react';

import { cn } from '../../utils/cn';

// Re-export core Framer Motion components
export { AnimatePresence, motion };

interface AnimationWrapperProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'article' | 'section';
}

/**
 * FadeIn - 페이드 인 애니메이션
 *
 * @example
 * ```tsx
 * <FadeIn duration={0.3}>
 *   <Content />
 * </FadeIn>
 * ```
 */
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

/**
 * SlideUp - 아래에서 위로 슬라이드 + 페이드
 *
 * @example
 * ```tsx
 * <SlideUp delay={0.1}>
 *   <Card />
 * </SlideUp>
 * ```
 */
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

/**
 * ScaleIn - 스케일 + 페이드 인
 *
 * 모달, 팝오버 등에 적합
 */
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

/**
 * Stagger - 자식 요소들을 순차적으로 애니메이션
 *
 * @example
 * ```tsx
 * <Stagger staggerDelay={0.1}>
 *   <motion.div>Item 1</motion.div>
 *   <motion.div>Item 2</motion.div>
 *   <motion.div>Item 3</motion.div>
 * </Stagger>
 * ```
 */
interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

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

/**
 * StaggerItem - Stagger 내에서 사용할 개별 아이템
 */
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

/**
 * Pressable - 터치/클릭 피드백 애니메이션
 *
 * 버튼, 카드 등 인터랙티브 요소에 사용
 */
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
