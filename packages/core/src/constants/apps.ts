/**
 * Family Apps Configuration
 * Single source of truth for cross-app linking
 */

export const FAMILY_APPS = [
  {
    id: 'main',
    name: 'SoundBlue',
    nameKo: 'SoundBlue',
    description: 'Main Site',
    descriptionKo: '메인 사이트',
    url: 'https://soundbluemusic.com',
    icon: 'home',
  },
  {
    id: 'context',
    name: 'Context',
    nameKo: 'Context',
    description: 'Korean Dictionary',
    descriptionKo: '한국어 사전',
    url: 'https://context.soundbluemusic.com',
    icon: 'book-open',
  },
  {
    id: 'roots',
    name: 'Roots',
    nameKo: 'Roots',
    description: 'Math Documentation',
    descriptionKo: '수학 문서',
    url: 'https://roots.soundbluemusic.com',
    icon: 'pi-square',
  },
  {
    id: 'permissive',
    name: 'Permissive',
    nameKo: 'Permissive',
    description: 'Free Web Dev Tools',
    descriptionKo: '무료 웹개발 도구',
    url: 'https://permissive.soundbluemusic.com',
    icon: 'code',
  },
  {
    id: 'tools',
    name: 'Tools',
    nameKo: '도구',
    description: 'Developer Tools',
    descriptionKo: '개발자 도구',
    url: 'https://tools.soundbluemusic.com',
    icon: 'wrench',
  },
  {
    id: 'dialogue',
    name: 'Dialogue',
    nameKo: '대화봇',
    description: 'Learning Chatbot',
    descriptionKo: '학습 챗봇',
    url: 'https://dialogue.soundbluemusic.com',
    icon: 'message-circle',
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
