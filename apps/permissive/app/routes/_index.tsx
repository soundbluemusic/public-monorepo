import { metaFactory } from '@soundblue/seo/meta';
import {
  BuiltWithSection,
  HeroSection,
  HomeSearch,
  MainCards,
  QuickCategories,
  TrendingSection,
} from '../components/home';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';

export const meta = metaFactory({
  ko: {
    title: 'Permissive - 무료 웹개발 도구 모음',
    description: '웹표준 API와 MIT 라이센스 라이브러리를 한눈에 보세요',
  },
  en: {
    title: 'Permissive - Free Web Dev Tools',
    description: 'Web Standard APIs and MIT licensed libraries at a glance',
  },
});

export default function Home() {
  const { locale, localePath } = useI18n();

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
