import { ExternalLink, FileText, Globe, Home, Package, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { MetaFunction } from 'react-router';
import DocsLayout from '../components/layout/DocsLayout';
import { useI18n } from '../i18n';
import styles from '../styles/app.module.scss';

export const meta: MetaFunction = ({ location }) => {
  const isKorean = location.pathname.startsWith('/ko');
  const title = isKorean ? '사이트맵 - Permissive' : 'Sitemap - Permissive';
  const description = isKorean
    ? 'Permissive 사이트의 모든 페이지 목록'
    : 'Complete list of all pages on Permissive';

  return [{ title }, { name: 'description', content: description }];
};

const pages: { path: string; labelEn: string; labelKo: string; icon: ReactNode }[] = [
  { path: '/', labelEn: 'Home', labelKo: '홈', icon: <Home size={18} aria-hidden="true" /> },
  {
    path: '/web-api',
    labelEn: 'Web API',
    labelKo: 'Web API',
    icon: <Globe size={18} aria-hidden="true" />,
  },
  {
    path: '/libraries',
    labelEn: 'Libraries',
    labelKo: 'Libraries',
    icon: <Package size={18} aria-hidden="true" />,
  },
];

export default function SitemapPage() {
  const { locale, localePath } = useI18n();
  const isKorean = locale === 'ko';

  return (
    <DocsLayout>
      <div className={styles.sitemapContainer}>
        <h1 className={styles.pageTitle}>{isKorean ? '사이트맵' : 'Sitemap'}</h1>
        <p className={`${styles.pageSubtitle} ${styles.mb8}`}>
          {isKorean
            ? 'Permissive 사이트의 모든 페이지를 한눈에 보세요.'
            : 'View all pages on Permissive at a glance.'}
        </p>

        {/* Pages Section */}
        <section className={styles.sitemapSection}>
          <h2 className={styles.sitemapHeading}>
            <FileText size={20} aria-hidden="true" />
            {isKorean ? '모든 페이지' : 'All Pages'}
          </h2>
          <ul className={styles.sitemapList}>
            {pages.map((page) => (
              <li key={page.path}>
                <Link to={localePath(page.path)} className={styles.sitemapLink}>
                  <span className={styles.sitemapLinkEmoji}>{page.icon}</span>
                  <span className={styles.sitemapLinkText}>
                    {isKorean ? page.labelKo : page.labelEn}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* XML Sitemap Section */}
        <section className={styles.sitemapXmlSection}>
          <h2 className={styles.sitemapXmlHeading}>
            <Search size={20} aria-hidden="true" />
            {isKorean ? '검색엔진용 사이트맵' : 'Search Engine Sitemap'}
          </h2>
          <p className={styles.sitemapXmlDescription}>
            {isKorean
              ? 'XML 형식의 사이트맵을 직접 확인할 수 있습니다.'
              : 'View the XML sitemap directly.'}
          </p>
          <div className={styles.flexWrap}>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sitemapXmlLink}
            >
              <ExternalLink size={16} aria-hidden="true" className={styles.sitemapXmlIcon} />
              sitemap.xml
            </a>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
