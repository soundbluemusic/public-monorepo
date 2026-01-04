/**
 * @fileoverview UI Animation Components with LazyMotion optimization
 * @environment universal
 *
 * 번들 사이즈 최적화: LazyMotion + m 컴포넌트 사용 (32KB → 4.6KB)
 */

// LazyMotion Provider (앱 루트에서 사용)
// Core Framer Motion (m = optimized, motion = backward compat alias)
// Animation Variants (Presets)
// Gesture Props
// Motion Components
// Interactive Components
// Layout Components
export {
  AnimatedButton,
  AnimatePresence,
  Collapsible,
  FadeIn,
  fadeIn,
  hoverLift,
  interactiveScale,
  MotionProvider,
  m,
  motion,
  PageTransition,
  PopIn,
  Pressable,
  popIn,
  ScaleIn,
  SlideDown,
  SlideUp,
  Stagger, // Legacy alias
  StaggerContainer,
  StaggerItem,
  scaleIn,
  slideDown,
  slideLeft,
  slideRight,
  slideUp,
  staggerContainer,
  staggerItem,
  tapScale,
} from './motion';
