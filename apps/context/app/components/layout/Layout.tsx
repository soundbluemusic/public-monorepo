import { useI18n } from '@/i18n';
import { cn } from '@soundblue/shared-react';
import { ArrowUp, ChevronRight } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { BottomNav } from '../navigation/BottomNav';
import { Sidebar } from '../navigation/Sidebar';
import { Footer } from './Footer';
import { Header } from './Header';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface LayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function Layout({ children, breadcrumbs }: LayoutProps) {
  const { locale, localePath } = useI18n();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-primary)">
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">
        {locale === 'ko' ? '본문으로 건너뛰기' : 'Skip to content'}
      </a>

      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main
        id="main-content"
        className={cn(
          'flex-1 w-full px-4 py-6 pb-20 md:pb-6',
          'pt-(--header-height)',
          // Desktop: offset for fixed sidebar
          'md:pl-[calc(18rem+1rem)] md:pr-4',
          'max-w-[calc(48rem+18rem+2rem)] mx-auto',
        )}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm flex-wrap list-none p-0 m-0">
              {breadcrumbs.map((item, index) => (
                <li key={item.label} className="flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight size={14} className="text-(--text-tertiary)" aria-hidden="true" />
                  )}
                  {item.path ? (
                    <Link
                      to={localePath(item.path)}
                      className="text-(--text-secondary) no-underline hover:underline"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-(--text-primary)">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="max-w-3xl">{children}</div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />

      {/* Back to Top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-8 right-4 z-20 min-h-11 min-w-11 flex items-center justify-center rounded-full shadow-md bg-(--bg-elevated) border border-(--border-primary) text-(--text-secondary) cursor-pointer transition-all hover:bg-(--bg-tertiary) focus:outline-2 focus:outline-(--accent-primary) focus:outline-offset-2"
          aria-label={locale === 'ko' ? '맨 위로' : 'Back to top'}
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
