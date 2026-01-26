import { createFileRoute, Link } from '@tanstack/react-router';
import { Layout } from '~/components/Layout';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'SoundBlue Docs' },
      {
        name: 'description',
        content: 'Documentation for Context, Permissive, and Roots applications',
      },
    ],
  }),
  component: Home,
});

const apps = [
  {
    id: 'context',
    icon: '📖',
    title: 'Context',
    description: 'Korean dictionary for learners',
    url: 'https://context.soundbluemusic.com',
  },
  {
    id: 'permissive',
    icon: '🔧',
    title: 'Permissive',
    description: 'Web development resources',
    url: 'https://permissive.soundbluemusic.com',
  },
  {
    id: 'roots',
    icon: '📐',
    title: 'Roots',
    description: 'Math documentation',
    url: 'https://roots.soundbluemusic.com',
  },
];

function Home() {
  return (
    <Layout>
      <div className="prose">
        <div className="mb-8 pb-8 border-b border-[var(--color-border)]">
          <h1 className="text-4xl font-bold mb-4">SoundBlue Documentation</h1>
          <p className="text-xl text-[var(--color-text-secondary)] mb-6">
            Complete documentation for Context, Permissive, and Roots applications.
          </p>
          <Link
            to="/apps"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors no-underline"
          >
            View Apps →
          </Link>
        </div>

        <h2>Apps</h2>
        <div className="grid gap-4 not-prose">
          {apps.map((app) => (
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors no-underline"
            >
              <span className="text-3xl">{app.icon}</span>
              <div>
                <h3 className="font-semibold text-[var(--color-text)]">{app.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{app.description}</p>
              </div>
            </a>
          ))}
        </div>

        <hr />

        <h2>About</h2>
        <ul>
          <li>
            <strong>Free</strong> — No sign-up, no ads
          </li>
          <li>
            <strong>Open source</strong> — Code on GitHub
          </li>
          <li>
            <strong>SSR</strong> — All apps use server-side rendering
          </li>
        </ul>

        <hr />

        <h2>Links</h2>
        <table>
          <thead>
            <tr>
              <th>Resource</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GitHub</td>
              <td>
                <a href="https://github.com/soundbluemusic/public-monorepo">
                  soundbluemusic/public-monorepo
                </a>
              </td>
            </tr>
            <tr>
              <td>Website</td>
              <td>
                <a href="https://soundbluemusic.com">soundbluemusic.com</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
