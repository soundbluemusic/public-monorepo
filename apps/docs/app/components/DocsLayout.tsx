import { Link, useLocation } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TableOfContents } from './TableOfContents';

interface DocsLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  headings?: Array<{ id: string; text: string; level: number }>;
}

export function DocsLayout({ children, title, description, headings = [] }: DocsLayoutProps) {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);

  return (
    <div className="min-h-screen">
      <Header locale={locale} />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block fixed left-0 top-[var(--header-height)] bottom-0 w-[var(--sidebar-width)] border-r border-(--border-primary) overflow-y-auto">
          <Sidebar locale={locale} />
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-[var(--sidebar-width)] lg:mr-[var(--toc-width)]">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {title && (
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-(--text-primary)">{title}</h1>
                {description && (
                  <p className="mt-2 text-lg text-(--text-secondary)">{description}</p>
                )}
              </header>
            )}

            <article className="prose">{children}</article>

            {/* Navigation */}
            <nav className="mt-12 pt-8 border-t border-(--border-primary)">
              <div className="flex justify-between">
                <PrevNextLinks locale={locale} currentPath={location.pathname} />
              </div>
            </nav>
          </div>
        </main>

        {/* Table of Contents */}
        {headings.length > 0 && (
          <aside className="hidden xl:block fixed right-0 top-[var(--header-height)] bottom-0 w-[var(--toc-width)] border-l border-(--border-primary) overflow-y-auto">
            <TableOfContents headings={headings} />
          </aside>
        )}
      </div>
    </div>
  );
}

function getLocaleFromPath(pathname: string): 'en' | 'ko' | 'ja' {
  if (pathname.startsWith('/public-monorepo/ko/') || pathname.startsWith('/ko/')) return 'ko';
  if (pathname.startsWith('/public-monorepo/ja/') || pathname.startsWith('/ja/')) return 'ja';
  return 'en';
}

function PrevNextLinks({ locale }: { locale: 'en' | 'ko' | 'ja'; currentPath: string }) {
  const homePath = locale === 'en' ? '/' : `/${locale}/`;
  // Simplified - would need proper navigation structure
  return (
    <div className="flex justify-between w-full">
      <Link to={homePath as '/'} className="text-(--accent) hover:underline">
        ← Home
      </Link>
    </div>
  );
}
