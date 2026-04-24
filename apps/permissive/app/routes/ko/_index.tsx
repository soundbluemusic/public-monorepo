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
import { APP_CONFIG } from '../../config';
import { homeMeta } from '../../routes-meta';

export const Route = createFileRoute('/ko/_index')({
  head: headFactoryKo(homeMeta, APP_CONFIG.baseUrl),
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
