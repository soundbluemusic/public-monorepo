/**
 * @fileoverview CSS-based Animation Components
 * @environment universal
 *
 * Framer Motion → 순수 CSS 애니메이션으로 전환.
 * 동일한 export API를 유지하여 하위 호환성 보장.
 */

// Provider (no-op passthrough)
// Core (호환성 shim)
// Animation Variants (Presets)
// Gesture Props (CSS로 대체)
// Motion Components (CSS-based)
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
