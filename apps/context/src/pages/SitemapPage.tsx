import { Layout } from '@/components/Layout';
import { categories, getCategoryColor } from '@/data/categories';
import { meaningEntries } from '@/data/entries';
import { useI18n } from '@/i18n';
import { Meta, Title } from '@solidjs/meta';
import { A } from '@solidjs/router';
import { For } from 'solid-js';

export default function SitemapPage() {
  const { locale, t, localePath } = useI18n();

  const getContent = () => {
    if (locale() === 'ko') {
      return {
        title: '사이트맵',
        description: 'Context의 모든 페이지와 카테고리를 한눈에 확인하세요.',
      };
    }
    return {
      title: 'Sitemap',
      description: 'View all pages and categories of Context at a glance.',
    };
  };

  const content = getContent();

  // Static pages
  const staticPages = [
    { path: '/', label: locale() === 'ko' ? '홈' : 'Home' },
    { path: '/browse', label: locale() === 'ko' ? '찾아보기' : 'Browse' },
    { path: '/about', label: locale() === 'ko' ? '소개' : 'About' },
    { path: '/privacy', label: locale() === 'ko' ? '개인정보' : 'Privacy' },
    { path: '/terms', label: locale() === 'ko' ? '이용약관' : 'Terms' },
    { path: '/license', label: locale() === 'ko' ? '라이선스' : 'License' },
    { path: '/built-with', label: locale() === 'ko' ? '기술 스택' : 'Built With' },
  ];

  // Get entries count per category
  const getCategoryEntryCount = (categoryId: string) => {
    return meaningEntries.filter((e) => e.categoryId === categoryId).length;
  };

  return (
    <Layout>
      <Title>{t('sitemap')} - Context</Title>
      <Meta name="description" content={content.description} />

      <div class="mb-8">
        <h1 class="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {content.title}
        </h1>
        <p class="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {t('sitemapDescription')}
        </p>
      </div>

      {/* All Pages Section */}
      <section class="mb-10">
        <h2
          class="text-lg font-medium mb-4 pb-2"
          style={{
            color: 'var(--text-primary)',
            'border-bottom': '1px solid var(--border-primary)',
          }}
        >
          {t('allPages')}
        </h2>
        <ul class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <For each={staticPages}>
            {(page) => (
              <li>
                <A
                  href={localePath(page.path)}
                  class="block px-3 py-2 rounded-lg text-sm transition-colors hover:bg-(--bg-tertiary)"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {page.label}
                </A>
              </li>
            )}
          </For>
        </ul>
      </section>

      {/* All Categories Section */}
      <section class="mb-10">
        <h2
          class="text-lg font-medium mb-4 pb-2"
          style={{
            color: 'var(--text-primary)',
            'border-bottom': '1px solid var(--border-primary)',
          }}
        >
          {t('allCategories')}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <For each={categories}>
            {(category) => (
              <A
                href={localePath(`/category/${category.id}`)}
                class="flex items-center gap-3 p-4 rounded-xl transition-colors hover:bg-(--bg-tertiary)"
                style={{
                  'background-color': 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <span class="text-2xl">{category.icon}</span>
                <div class="flex-1 min-w-0">
                  <div class="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {category.name[locale()]}
                  </div>
                  <div class="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                    {category.description[locale()]}
                  </div>
                </div>
                <span
                  class={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(category.color)}`}
                >
                  {getCategoryEntryCount(category.id)}
                </span>
              </A>
            )}
          </For>
        </div>
      </section>

      {/* Search Engine Index Section */}
      <section
        class="p-4 rounded-xl"
        style={{
          'background-color': 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <h2 class="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
          {t('searchEngineIndex')}
        </h2>
        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors hover:bg-(--bg-tertiary)"
          style={{
            color: 'var(--accent-primary)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <svg
            aria-hidden="true"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          sitemap.xml
        </a>
      </section>
    </Layout>
  );
}
