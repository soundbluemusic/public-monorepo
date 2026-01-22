import { headFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import {
  BuiltWithSection,
  HeroSection,
  HomeSearch,
  MainCards,
  QuickCategories,
  TrendingSection,
} from '../../components/home';
import DocsLayout from '../../components/layout/DocsLayout';

const localizedMeta = {
  ko: {
    title: 'Permissive - 무료 웹개발 도구 모음',
    description: '웹표준 API와 MIT 라이센스 라이브러리를 한눈에 보세요',
    keywords: [
      '웹개발 도구',
      '오픈소스 라이브러리',
      'MIT 라이선스',
      'Web API',
      '무료 라이브러리',
      'JavaScript 라이브러리',
      'permissive',
    ],
  },
  en: {
    title: 'Permissive - Free Web Dev Tools',
    description: 'Web Standard APIs and MIT licensed libraries at a glance',
    keywords: [
      'web development tools',
      'open source libraries',
      'MIT license',
      'Web API',
      'free libraries',
      'JavaScript libraries',
      'permissive',
    ],
  },
};

export const Route = createFileRoute('/ko/_index')({
  head: headFactoryKo(localizedMeta, 'https://permissive.soundbluemusic.com'),
  component: HomePageKo,
});

function HomePageKo() {
  const locale = 'ko';
  const localePath = (path: string) => `/ko${path}`;

  return (
    <DocsLayout>
      <HeroSection locale={locale}>
        <HomeSearch locale={locale} localePath={localePath} />
      </HeroSection>

      <TrendingSection locale={locale} localePath={localePath} />

      <MainCards locale={locale} localePath={localePath} />

      <QuickCategories locale={locale} localePath={localePath} />

      <BuiltWithSection locale={locale} />
    </DocsLayout>
  );
}
