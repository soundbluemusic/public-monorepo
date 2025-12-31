/**
 * Family Apps Configuration
 * Single source of truth for cross-app linking
 */

export const FAMILY_APPS = [
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
] as const;

export type FamilyApp = (typeof FAMILY_APPS)[number];
export type AppId = FamilyApp['id'];

/**
 * Get other apps excluding the current app
 */
export function getOtherApps(currentAppId: AppId): readonly FamilyApp[] {
  return FAMILY_APPS.filter((app) => app.id !== currentAppId);
}
