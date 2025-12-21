import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  return [{ title: isKorean ? '사용된 기술 - Context' : 'Built With - Context' }];
};

export default function BuiltWithPage() {
  const { t } = useI18n();

  const tools = [
    { name: 'React', url: 'https://react.dev' },
    { name: 'React Router', url: 'https://reactrouter.com' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
    { name: 'Zustand', url: 'https://zustand-demo.pmnd.rs' },
    { name: 'Radix UI', url: 'https://radix-ui.com' },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
        {t('builtWithTitle')}
      </h1>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
        {t('builtWithDescription')}
      </p>
      <ul className="space-y-3">
        {tools.map((tool) => (
          <li key={tool.name}>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              {tool.name}
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
