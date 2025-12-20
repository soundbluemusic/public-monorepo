/**
 * @fileoverview 홈페이지 컴포넌트 - 미니멀 디자인
 */
import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';
import { preloadSearchIndex } from '@/lib/search';
import type { SearchIndexItem } from '@/lib/search';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export function meta() {
  return [
    { title: 'Roots - Math Documentation' },
    { name: 'description', content: 'Learn math concepts easily' },
  ];
}

export default function HomePage() {
  const { locale, t, localePath } = useI18n();
  const [concepts, setConcepts] = useState<SearchIndexItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 경량 데이터 로드 (search-index.json 중 12개만)
  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data: SearchIndexItem[]) => {
        setConcepts(data.slice(0, 12));
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    // 검색 인덱스 프리로드
    preloadSearchIndex();
  }, []);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2 text-text-primary">{t('heroTitle')}</h1>
        <p className="text-text-secondary">{t('heroSubtitle')}</p>
      </div>

      {/* Concept List */}
      {!isLoading && concepts.length > 0 && (
        <div className="space-y-1">
          {concepts.map((concept) => (
            <Link
              key={concept.id}
              to={localePath(`/concept/${concept.id}`)}
              className="flex items-baseline justify-between py-3 -mx-2 px-2 rounded transition-colors border-b border-border-primary"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-lg font-medium text-text-primary">
                  {concept.name[locale] || concept.name.en}
                </span>
              </div>
              <span className="text-sm text-text-secondary">{concept.field}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded animate-pulse bg-bg-secondary" />
          ))}
        </div>
      )}

      {/* View All Link */}
      <div className="mt-8 text-center">
        <Link to={localePath('/browse')} className="text-sm transition-colors text-accent-primary">
          {t('viewAll')} →
        </Link>
      </div>
    </Layout>
  );
}
