import { createFileRoute, Link } from '@tanstack/react-router';
import { Layout } from '~/components/Layout';

export const Route = createFileRoute('/apps')({
  head: () => ({
    meta: [
      { title: 'Apps | SoundBlue Docs' },
      { name: 'description', content: 'Overview of Context, Permissive, and Roots applications' },
    ],
  }),
  component: AppsPage,
});

function AppsPage() {
  return (
    <Layout>
      <div className="prose">
        <h1>Apps</h1>
        <p>Three apps for learners, all using SSR for SEO.</p>

        <hr />

        <h2>📖 Context — Korean Dictionary</h2>
        <p>Korean dictionary for learners with 16,394 entries.</p>
        <ul>
          <li>
            <strong>Live:</strong>{' '}
            <a href="https://context.soundbluemusic.com">context.soundbluemusic.com</a>
          </li>
          <li>
            <strong>Database:</strong> Cloudflare D1
          </li>
          <li>
            <strong>Features:</strong> 52 categories, offline support
          </li>
        </ul>

        <hr />

        <h2>🔧 Permissive — Web Dev Resources</h2>
        <p>Free web development resources collection.</p>
        <ul>
          <li>
            <strong>Live:</strong>{' '}
            <a href="https://permissive.soundbluemusic.com">permissive.soundbluemusic.com</a>
          </li>
          <li>
            <strong>Content:</strong> 88 libraries, 56 Web APIs
          </li>
        </ul>

        <hr />

        <h2>📐 Roots — Math Documentation</h2>
        <p>Math documentation for learners.</p>
        <ul>
          <li>
            <strong>Live:</strong>{' '}
            <a href="https://roots.soundbluemusic.com">roots.soundbluemusic.com</a>
          </li>
          <li>
            <strong>Content:</strong> 438 concepts, 18 fields
          </li>
        </ul>

        <hr />

        <p>
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </Layout>
  );
}
