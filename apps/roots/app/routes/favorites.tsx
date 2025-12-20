import { ConceptCard } from '@/components/concept/ConceptCard';
/**
 * @fileoverview 즐겨찾기 페이지
 */
import { Layout } from '@/components/layout/Layout';
import type { MathConcept } from '@/data/types';
import { useI18n } from '@/i18n';
import { getConceptById } from '@/lib/concepts';
import { favorites } from '@/lib/db';
import { useEffect, useState } from 'react';

export function meta() {
  return [
    { title: 'Favorites - Roots' },
    { name: 'description', content: 'Your favorite math concepts' },
  ];
}

export default function FavoritesPage() {
  const { locale, t } = useI18n();

  const [favoriteConcepts, setFavoriteConcepts] = useState<MathConcept[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 즐겨찾기 로드
  useEffect(() => {
    async function loadFavorites() {
      try {
        const favs = await favorites.getAll();
        const concepts = await Promise.all(favs.map((f) => getConceptById(f.conceptId)));
        setFavoriteConcepts(concepts.filter((c): c is MathConcept => c !== undefined));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadFavorites();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        {t('favorites')}
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl animate-pulse"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            />
          ))}
        </div>
      ) : favoriteConcepts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteConcepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12" style={{ color: 'var(--text-tertiary)' }}>
          <p className="text-xl mb-2">
            {locale === 'ko' ? '아직 즐겨찾기한 개념이 없습니다' : 'No favorite concepts yet'}
          </p>
          <p className="text-sm">
            {locale === 'ko'
              ? '개념 페이지에서 ♡ 버튼을 눌러 추가하세요'
              : 'Click the ♡ button on concept pages to add favorites'}
          </p>
        </div>
      )}
    </Layout>
  );
}
