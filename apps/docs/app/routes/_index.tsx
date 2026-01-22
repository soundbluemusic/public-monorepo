import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import { DocsLayout } from '@/components/DocsLayout';

export const meta: MetaFunction = () => [
  { title: 'SoundBlue Docs' },
  {
    name: 'description',
    content: 'Complete documentation for Context, Permissive, and Roots applications',
  },
];

export default function HomePage() {
  const basePath = '/public-monorepo';

  return (
    <DocsLayout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">SoundBlue Documentation</h1>
        <p className="text-xl text-(--text-secondary) mb-8">
          Complete documentation for Context, Permissive, and Roots applications.
        </p>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card
              title="Introduction"
              description="Learn about the monorepo structure and architecture"
              href={`${basePath}/guides/introduction`}
              icon="📖"
            />
            <Card
              title="Quick Start"
              description="Get up and running in minutes"
              href={`${basePath}/guides/quickstart`}
              icon="🚀"
            />
          </div>
        </section>

        {/* Apps */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Apps</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card
              title="Context"
              description="Korean dictionary for learners"
              href={`${basePath}/apps/context/overview`}
              icon="📖"
            />
            <Card
              title="Permissive"
              description="Web development resources"
              href={`${basePath}/apps/permissive/overview`}
              icon="🔧"
            />
            <Card
              title="Roots"
              description="Math documentation"
              href={`${basePath}/apps/roots/overview`}
              icon="📐"
            />
          </div>
        </section>

        {/* Packages */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Packages</h2>
          <p className="text-(--text-secondary) mb-4">
            The monorepo contains 10 shared packages organized in layers.
          </p>
          <Link
            to={`${basePath}/packages`}
            className="inline-flex items-center gap-2 text-(--accent) hover:underline"
          >
            View all packages →
          </Link>
        </section>

        {/* Links */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Resources</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/soundbluemusic/public-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-(--bg-secondary) hover:bg-(--bg-tertiary) rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                />
              </svg>
              GitHub
            </a>
            <Link
              to={`${basePath}/contributing`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-(--bg-secondary) hover:bg-(--bg-tertiary) rounded-lg transition-colors"
            >
              Contributing
            </Link>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}

function Card({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      to={href}
      className="block p-4 bg-(--bg-secondary) hover:bg-(--bg-tertiary) rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-(--text-secondary)">{description}</p>
    </Link>
  );
}
