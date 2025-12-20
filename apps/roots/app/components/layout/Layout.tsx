import { type Language, useI18n } from '@/i18n';
import { DarkModeToggle, LanguageToggle } from '@soundblue/shared-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

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

  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('roots-dark-mode');
    if (stored !== null) {
      const isDark = stored === 'true';
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('roots-dark-mode', String(newValue));
    document.documentElement.classList.toggle('dark', newValue);
  };

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
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--text-tertiary)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
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
            <DarkModeToggle isDark={darkMode} onToggle={toggleDarkMode} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">{children}</main>

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
          <p className="text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Roots by SoundBlueMusic
          </p>
        </div>
      </footer>
    </div>
  );
}
