/**
 * Migration script: Convert Astro MDX to React Router MDX routes
 *
 * Usage: tsx scripts/migrate-content.ts
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const ASTRO_CONTENT_DIR = '../../../docs/docs-site/src/content/docs';
const ROUTES_DIR = './app/routes';

interface FrontMatter {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

function parseFrontMatter(content: string): { frontMatter: FrontMatter; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontMatter: {}, body: content };
  }

  const frontMatter: FrontMatter = {};
  const yamlContent = match[1];
  const body = match[2];

  // Simple YAML parsing
  for (const line of yamlContent.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      frontMatter[key] = value;
    }
  }

  return { frontMatter, body };
}

function getRoutePathFromFile(filePath: string, locale: string): string {
  // Remove .md/.mdx extension
  let routePath = filePath.replace(/\.(md|mdx)$/, '');

  // Handle index files
  if (routePath.endsWith('/index')) {
    routePath = routePath.replace('/index', '');
  }

  // Add locale prefix for non-English
  if (locale !== 'en' && locale !== 'root') {
    routePath = `${locale}/${routePath}`;
  }

  return routePath || '_index';
}

function generateRouteFile(
  frontMatter: FrontMatter,
  mdxBody: string,
  _routePath: string,
  _locale: string,
): string {
  const title = frontMatter.title || 'Untitled';
  const description = frontMatter.description || '';

  // Escape backticks in MDX content
  const escapedBody = mdxBody.replace(/`/g, '\\`').replace(/\$/g, '\\$');

  return `import type { MetaFunction } from 'react-router';
import { DocsLayout } from '@/components/DocsLayout';

export const meta: MetaFunction = () => [
  { title: '${title.replace(/'/g, "\\'")} | SoundBlue Docs' },
  { name: 'description', content: '${description.replace(/'/g, "\\'")}' },
];

export default function Page() {
  return (
    <DocsLayout title="${title.replace(/"/g, '\\"')}" description="${description.replace(/"/g, '\\"')}">
      <div className="prose">
        {/* MDX content converted to JSX - original content preserved below */}
        <Content />
      </div>
    </DocsLayout>
  );
}

// Original MDX content (needs manual conversion or MDX plugin)
function Content() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${escapedBody.trim()}\` }} />
  );
}
`;
}

function processDirectory(dir: string, locale: string = 'en'): void {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Check if this is a locale directory
      if (['ko', 'ja'].includes(entry.name)) {
        processDirectory(fullPath, entry.name);
      } else {
        processDirectory(fullPath, locale);
      }
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      const content = readFileSync(fullPath, 'utf-8');
      const { frontMatter, body } = parseFrontMatter(content);

      // Calculate relative path from content root
      const contentRoot = join(process.cwd(), ASTRO_CONTENT_DIR);
      let relativePath = relative(contentRoot, fullPath);

      // Remove locale prefix from path if present
      if (locale !== 'en' && relativePath.startsWith(`${locale}/`)) {
        relativePath = relativePath.slice(locale.length + 1);
      }

      const routePath = getRoutePathFromFile(relativePath, locale);
      const routeFilePath = join(
        ROUTES_DIR,
        locale === 'en' ? '' : locale,
        relativePath.replace(/\.(md|mdx)$/, '.tsx'),
      );

      // Create directory if needed
      const routeDir = dirname(routeFilePath);
      if (!existsSync(routeDir)) {
        mkdirSync(routeDir, { recursive: true });
      }

      // Generate and write route file
      const routeContent = generateRouteFile(frontMatter, body, routePath, locale);
      writeFileSync(routeFilePath, routeContent);

      console.log(`✓ ${relativePath} -> ${routeFilePath}`);
    }
  }
}

// Run migration
console.log('Starting content migration...\n');
const contentDir = join(process.cwd(), ASTRO_CONTENT_DIR);
processDirectory(contentDir);
console.log('\nMigration complete!');
