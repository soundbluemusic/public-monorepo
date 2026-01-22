import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';
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

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderData> {
  const slug = params['*'] || '';

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
    throw new Response('Not Found', { status: 404 });
  }

  const frontmatter = foundModule.frontmatter || {};

  return {
    title: frontmatter.title || 'Documentation',
    description: frontmatter.description || '',
    slug,
    locale,
    Content: foundModule.default,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: 'Not Found | SoundBlue Docs' }];
  }

  return [
    { title: `${data.title} | SoundBlue Docs` },
    { name: 'description', content: data.description },
  ];
};

export default function DocsPage() {
  const { title, description, Content } = useLoaderData<typeof loader>();

  return (
    <DocsLayout title={title} description={description}>
      {Content ? <Content /> : <p>Content not found</p>}
    </DocsLayout>
  );
}
