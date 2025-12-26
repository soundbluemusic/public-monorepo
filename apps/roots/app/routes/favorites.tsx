/**
 * @fileoverview 즐겨찾기 페이지
 */
import { ConceptCard } from '@/components/concept/ConceptCard';
import { Layout } from '@/components/layout/Layout';
import type { MathConcept } from '@/data/types';
import { useI18n } from '@/i18n';
import { getConceptById } from '@/lib/concepts';
import { favorites } from '@/lib/db';
import { useEffect, useState } from 'react';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ location }) => {
  const locale = location.pathname.startsWith('/ko') ? 'ko' : 'en';
  const title = locale === 'ko' ? '즐겨찾기 - 수리' : 'Favorites - Roots';
  const description = locale === 'ko' ? '즐겨찾는 수학 개념' : 'Your favorite math concepts';
  return [{ title }, { name: 'description', content: description }];
};

export default function FavoritesPage() {
  const { t } = useI18n();

  const [favoriteConcepts, setFavoriteConcepts] = useState<MathConcept[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 즐겨찾기 로드
  useEffect(() => {
    async function loadFavorites() {
      try {
        const favs = await favorites.getAll();
        const concepts = await Promise.all(favs.map((f) => getConceptById(f.conceptId)));
        setFavoriteConcepts(concepts.filter((c): c is MathConcept => c !== undefined));
      } catch (error: unknown) {
        console.error('Failed to load favorites:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadFavorites();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-(--text-primary) mb-8">{t('favorites')}</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)"
            >
              <div className="h-6 w-3/4 rounded bg-(--bg-tertiary) animate-pulse mb-2" />
              <div className="h-4 w-full rounded bg-(--bg-tertiary) animate-pulse" />
            </div>
          ))}
        </div>
      ) : favoriteConcepts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteConcepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">💝</div>
          <p className="text-xl font-medium text-(--text-primary) mb-2">{t('noFavoritesYet')}</p>
          <p className="text-(--text-secondary)">{t('addFavoritesHint')}</p>
        </div>
      )}
    </Layout>
  );
}
