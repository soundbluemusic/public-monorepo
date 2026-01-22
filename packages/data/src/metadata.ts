/**
 * @fileoverview Single Source of Truth for App Metadata
 * @environment universal
 *
 * 모든 앱의 메타데이터를 중앙 관리합니다.
 * README, GitHub Pages, 앱 설정에서 이 파일을 참조합니다.
 *
 * 수정 시: pnpm sync:metadata 실행하여 모든 문서 동기화
 */

export const APP_METADATA = {
  context: {
    name: 'Context',
    subtitle: {
      en: 'Korean Dictionary for Learners',
      ko: '학습자를 위한 한국어 사전',
      ja: '学習者のための韓国語辞書',
    },
    stats: {
      entries: 16394,
      categories: 52,
      conversations: 53,
    },
    url: 'https://context.soundbluemusic.com',
    devPort: 3003,
    mode: 'SSR + D1' as const,
    icon: 'open-book',
  },
  permissive: {
    name: 'Permissive',
    subtitle: {
      en: 'Web Development Resources',
      ko: '웹 개발 리소스',
      ja: 'Web開発リソース',
    },
    stats: {
      libraries: 88,
      webApis: 56,
    },
    url: 'https://permissive.soundbluemusic.com',
    devPort: 3004,
    mode: 'SSR' as const,
    icon: 'setting',
  },
  roots: {
    name: 'Roots',
    subtitle: {
      en: 'Math Documentation for Learners',
      ko: '학습자를 위한 수학 문서',
      ja: '学習者のための数学ドキュメント',
    },
    stats: {
      concepts: 438,
      fields: 18,
    },
    url: 'https://roots.soundbluemusic.com',
    devPort: 3005,
    mode: 'SSR' as const,
    icon: 'document',
  },
} as const;

export const PROJECT_METADATA = {
  techStack: {
    react: '19',
    reactRouter: '7',
    typescript: '5.x',
    tailwind: '4',
    pnpm: '10.11.0',
  },
  totals: {
    apps: 3,
    packages: 10,
  },
} as const;

export type AppName = keyof typeof APP_METADATA;
export type AppMetadata = (typeof APP_METADATA)[AppName];
