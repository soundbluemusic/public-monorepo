import { headFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import {
  BuiltWithSection,
  HeroSection,
  HomeSearch,
  MainCards,
  QuickCategories,
  TrendingSection,
} from '../components/home';
import DocsLayout from '../components/layout/DocsLayout';
import { APP_CONFIG } from '../config';
import { homeMeta } from '../routes-meta';

export const Route = createFileRoute('/_index')({
  head: headFactoryEn(homeMeta, APP_CONFIG.baseUrl),
  component: HomePage,
});

function HomePage() {
  const locale = 'en';
  const localePath = (path: string) => path;

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
