import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-[var(--color-text)] no-underline">
            SoundBlue Docs
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/apps"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] no-underline"
            >
              Apps
            </Link>
            <a
              href="https://github.com/soundbluemusic/public-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] no-underline"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-[var(--color-text-secondary)]">
          <p>
            Made by{' '}
            <a href="https://soundbluemusic.com" className="text-[var(--color-brand)]">
              SoundBlue
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
