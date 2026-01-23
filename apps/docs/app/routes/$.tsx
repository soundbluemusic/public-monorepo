import { createFileRoute } from '@tanstack/react-router';
import { DocsLayout } from '@/components/DocsLayout';

// Import all MDX files at build time
const mdxModules = import.meta.glob<{
  default: React.ComponentType;
  frontmatter?: { title?: string; description?: string };
}>('/content/**/*.{md,mdx}', { eager: true });

interface LoaderData {
  title: string;
  description: string;
  slug: string;
  locale: 'en' | 'ko' | 'ja';
  Content: React.ComponentType | null;
}

export const Route = createFileRoute('/$')({
  loader: ({ params }): LoaderData => {
    const slug = params['_splat'] || '';

    // Determine locale
    let locale: 'en' | 'ko' | 'ja' = 'en';
    let contentPath = slug;

    if (slug.startsWith('ko/')) {
      locale = 'ko';
      contentPath = slug.slice(3);
    } else if (slug.startsWith('ja/')) {
      locale = 'ja';
      contentPath = slug.slice(3);
    }

    // Try to find the MDX file
    const possiblePaths = [
      `/content/${locale === 'en' ? '' : `${locale}/`}${contentPath}.mdx`,
      `/content/${locale === 'en' ? '' : `${locale}/`}${contentPath}.md`,
      `/content/${locale === 'en' ? '' : `${locale}/`}${contentPath}/index.mdx`,
      `/content/${locale === 'en' ? '' : `${locale}/`}${contentPath}/index.md`,
    ];

    let foundModule = null;
    for (const path of possiblePaths) {
      if (mdxModules[path]) {
        foundModule = mdxModules[path];
        break;
      }
    }

    if (!foundModule) {
      throw new Error('Not Found');
    }

    const frontmatter = foundModule.frontmatter || {};

    return {
      title: frontmatter.title || 'Documentation',
      description: frontmatter.description || '',
      slug,
      locale,
      Content: foundModule.default,
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title || 'Not Found'} | SoundBlue Docs` },
      { name: 'description', content: loaderData?.description || '' },
    ],
  }),
  component: DocsPage,
  errorComponent: NotFound,
});

function DocsPage() {
  const { title, description, Content } = Route.useLoaderData();

  return (
    <DocsLayout title={title} description={description}>
      {Content ? <Content /> : <p>Content not found</p>}
    </DocsLayout>
  );
}

function NotFound() {
  return (
    <DocsLayout title="Not Found">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-(--text-secondary)">Page not found</p>
      </div>
    </DocsLayout>
  );
}
