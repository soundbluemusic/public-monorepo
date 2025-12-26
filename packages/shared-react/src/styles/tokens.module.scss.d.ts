export type Styles = {
  bottomNavHeight: string;
  bounce: string;
  breakpointLg: string;
  breakpointMd: string;
  breakpointSm: string;
  breakpointXl: string;
  contentMaxWidth: string;
  fadeIn: string;
  fadeInDown: string;
  fadeInUp: string;
  fadeOut: string;
  focusRing: string;
  headerHeight: string;
  pulse: string;
  radiusFull: string;
  radiusLg: string;
  radiusMd: string;
  radiusSm: string;
  radiusXl: string;
  scaleIn: string;
  scaleOut: string;
  sidebarWidth: string;
  skeletonPulse: string;
  skeletonShimmer: string;
  slideInDown: string;
  slideInLeft: string;
  slideInRight: string;
  slideInUp: string;
  spacing1: string;
  spacing2: string;
  spacing3: string;
  spacing4: string;
  spacing6: string;
  spacing8: string;
  spin: string;
  srOnly: string;
  touchTarget: string;
  touchTargetComfortable: string;
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
