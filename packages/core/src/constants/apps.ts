/**
 * Family Apps Configuration
 * Single source of truth for cross-app linking
 */

export type AppCategory = 'main' | 'learning' | 'tools';

/**
 * Apps that open in the same tab (monorepo apps)
 * External apps open in a new tab
 */
export const SAME_TAB_APPS = ['context', 'roots', 'permissive'] as const;

export const FAMILY_APPS = [
  {
    id: 'main',
    name: 'SoundBlue',
    nameKo: 'SoundBlue',
    description: 'Main Site',
    descriptionKo: '메인 사이트',
    url: 'https://soundbluemusic.com',
    icon: 'home',
    category: 'main' as AppCategory,
  },
  {
    id: 'context',
    name: 'Context',
    nameKo: 'Context',
    description: 'Korean Dictionary',
    descriptionKo: '한국어 사전',
    url: 'https://context.soundbluemusic.com',
    icon: 'book-open',
    category: 'learning' as AppCategory,
  },
  {
    id: 'roots',
    name: 'Roots',
    nameKo: 'Roots',
    description: 'Math Documentation',
    descriptionKo: '수학 문서',
    url: 'https://roots.soundbluemusic.com',
    icon: 'pi-square',
    category: 'learning' as AppCategory,
  },
  {
    id: 'permissive',
    name: 'Permissive',
    nameKo: 'Permissive',
    description: 'Free Web Dev Resources',
    descriptionKo: '무료 웹개발 자료',
    url: 'https://permissive.soundbluemusic.com',
    icon: 'code',
    category: 'tools' as AppCategory,
  },
  {
    id: 'tools',
    name: 'Tools',
    nameKo: '도구',
    description: 'Developer Tools',
    descriptionKo: '개발자 도구',
    url: 'https://tools.soundbluemusic.com',
    icon: 'wrench',
    category: 'tools' as AppCategory,
  },
  {
    id: 'dialogue',
    name: 'Dialogue',
    nameKo: '대화봇',
    description: 'Learning Chatbot',
    descriptionKo: '학습 챗봇',
    url: 'https://dialogue.soundbluemusic.com',
    icon: 'message-circle',
    category: 'learning' as AppCategory,
  },
] as const;

export type FamilyApp = (typeof FAMILY_APPS)[number];
export type AppId = FamilyApp['id'];

/**
 * Get all services
 */
export function getAllServices(): readonly FamilyApp[] {
  return FAMILY_APPS;
}

/**
 * Get other apps excluding the current app
 */
export function getOtherApps(currentAppId: AppId): readonly FamilyApp[] {
  return FAMILY_APPS.filter((app) => app.id !== currentAppId);
}

/**
 * Check if app should open in same tab (monorepo apps)
 */
export function isSameTabApp(appId: string): boolean {
  return (SAME_TAB_APPS as readonly string[]).includes(appId);
}

/**
 * Get apps grouped by category
 */
export function getAppsByCategory(excludeAppId?: AppId): Record<AppCategory, readonly FamilyApp[]> {
  const apps = excludeAppId ? FAMILY_APPS.filter((app) => app.id !== excludeAppId) : FAMILY_APPS;

  return {
    main: apps.filter((app) => app.category === 'main'),
    learning: apps.filter((app) => app.category === 'learning'),
    tools: apps.filter((app) => app.category === 'tools'),
  };
}

/**
 * Category labels for UI
 */
export const CATEGORY_LABELS = {
  main: { en: 'Main', ko: '메인' },
  learning: { en: 'Learning', ko: '학습' },
  tools: { en: 'Tools', ko: '도구' },
} as const;

/**
 * Social Links Configuration
 */
export const SOCIAL_LINKS = [
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/@SoundBlueMusic',
    icon: 'youtube',
  },
  {
    id: 'x',
    name: 'X',
    url: 'https://x.com/SoundBlueMusic',
    icon: 'twitter',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/soundbluemusic/',
    icon: 'instagram',
  },
  {
    id: 'threads',
    name: 'Threads',
    url: 'https://www.threads.com/@soundbluemusic',
    icon: 'at-sign',
  },
] as const;

export type SocialLink = (typeof SOCIAL_LINKS)[number];

/**
 * Get all social links
 */
export function getAllSocialLinks(): readonly SocialLink[] {
  return SOCIAL_LINKS;
}
