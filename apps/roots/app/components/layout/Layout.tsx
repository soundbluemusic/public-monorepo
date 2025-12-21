import { type Language, useI18n } from '@/i18n';
import { DarkModeToggle, LanguageToggle } from '@soundblue/shared-react';
import { Github, Search } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Sidebar } from './Sidebar';

function stripLocale(pathname: string): string {
  if (pathname.startsWith('/ko/')) return pathname.slice(3);
  if (pathname === '/ko') return '/';
  return pathname;
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { locale, setLocale, t, localePath } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(localePath(`/search?q=${encodeURIComponent(searchQuery.trim())}`));
    }
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const isActive = (basePath: string) => {
    const currentPath = stripLocale(location.pathname);
    return currentPath === basePath || currentPath.startsWith(`${basePath}/`);
  };

  const handleLocaleChange = (lang: Language) => {
    setLocale(lang);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-sm"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg-primary) 80%, transparent)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link
            to={localePath('/')}
            className="font-semibold shrink-0 flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <span className="text-xl">π</span>
            <span>Roots</span>
          </Link>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-tertiary)' }}
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
              }}
            />
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Link
              to={localePath('/browse')}
              className="hidden sm:block px-3 py-1.5 text-sm rounded-lg transition-colors"
              style={{
                color: isActive('/browse') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive('/browse') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              {t('browse')}
            </Link>

            <Link
              to={localePath('/favorites')}
              className="hidden sm:block px-3 py-1.5 text-sm rounded-lg transition-colors"
              style={{
                color: isActive('/favorites') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive('/favorites') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              {t('favorites')}
            </Link>

            <Link
              to={localePath('/constants')}
              className="hidden sm:block px-3 py-1.5 text-sm rounded-lg transition-colors"
              style={{
                color: isActive('/constants') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive('/constants') ? 'var(--bg-tertiary)' : 'transparent',
              }}
            >
              {t('constants')}
            </Link>

            <LanguageToggle locale={locale} onLocaleChange={handleLocaleChange} />
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full lg:ml-0">{children}</main>
      </div>

      {/* Footer */}
      <footer
        className="mt-auto py-8"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-primary)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <nav
            className="flex justify-center gap-6 mb-4 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Link to={localePath('/about')} className="hover:underline">
              {t('about')}
            </Link>
          </nav>
          <div
            className="flex items-center justify-center gap-4 text-sm"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <p>{t('footerText')}</p>
            <a
              href="https://github.com/soundbluemusic/public-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              <Github size={16} aria-hidden="true" />
              {t('github')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
