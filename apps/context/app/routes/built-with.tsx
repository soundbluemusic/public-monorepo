import { Layout } from '@/components/Layout';
import { useI18n } from '@/i18n';
import styles from '@/styles/app.module.scss';
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
    { name: 'SCSS Modules', url: 'https://sass-lang.com' },
    { name: 'Zustand', url: 'https://zustand-demo.pmnd.rs' },
    { name: 'Radix UI', url: 'https://radix-ui.com' },
  ];

  return (
    <Layout>
      <h1 className={`${styles.pageTitle} ${styles.mb6}`}>{t('builtWithTitle')}</h1>
      <p className={`${styles.textSecondary} ${styles.mb6}`}>{t('builtWithDescription')}</p>
      <ul className={styles.spaceY3}>
        {tools.map((tool) => (
          <li key={tool.name}>
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {tool.name}
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
