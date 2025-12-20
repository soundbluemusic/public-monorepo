/**
 * @fileoverview 개념 상세 페이지
 */
import { RelationLinks } from '@/components/concept/RelationLinks';
import { Layout } from '@/components/layout/Layout';
import { ExampleList } from '@/components/math/Example';
import { FormulaList } from '@/components/math/Formula';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { getFieldById } from '@/data/fields';
import { getSubfieldById } from '@/data/subfields';
import type { MathConcept } from '@/data/types';
import { useI18n } from '@/i18n';
import { getConceptById } from '@/lib/concepts';
import { favorites } from '@/lib/db';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

export default function ConceptPage() {
  const params = useParams<{ conceptId: string }>();
  const { locale, t, localePath } = useI18n();

  const [concept, setConcept] = useState<MathConcept | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // 개념 데이터 비동기 로드
  useEffect(() => {
    if (params.conceptId) {
      setIsLoading(true);
      setError(null);

      getConceptById(params.conceptId)
        .then((data) => {
          setConcept(data || null);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error loading concept:', err);
          setError(err.message || 'Failed to load concept data');
          setIsLoading(false);
        });

      // 즐겨찾기 상태 확인
      favorites.isFavorite(params.conceptId).then(setIsFavorite);
    }
  }, [params.conceptId]);

  const toggleFavorite = async () => {
    const conceptId = params.conceptId;
    if (!conceptId) return;

    if (isFavorite) {
      await favorites.remove(conceptId);
      setIsFavorite(false);
    } else {
      await favorites.add(conceptId);
      setIsFavorite(true);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-48 rounded bg-bg-secondary" />
          <div className="h-12 w-64 rounded bg-bg-secondary" />
          <div className="h-32 w-full rounded bg-bg-secondary" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4 text-text-primary">
            {locale === 'ko' ? '데이터를 불러올 수 없습니다' : 'Failed to load data'}
          </h1>
          <p className="text-text-secondary mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-accent-primary text-white hover:bg-accent-hover transition-colors"
            >
              {locale === 'ko' ? '다시 시도' : 'Retry'}
            </button>
            <Link
              to={localePath('/browse')}
              className="px-4 py-2 rounded-lg border border-border-primary hover:bg-bg-secondary transition-colors"
            >
              {t('backToList')}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!concept) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4 text-text-primary">
            {locale === 'ko' ? '개념을 찾을 수 없습니다' : 'Concept not found'}
          </h1>
          <Link to={localePath('/browse')} className="btn btn-primary">
            {t('backToList')}
          </Link>
        </div>
      </Layout>
    );
  }

  const field = getFieldById(concept.field);
  const subfield = getSubfieldById(concept.subfield);
  const name = concept.name[locale] || concept.name.en;
  const rawContent = concept.content[locale] || concept.content.en;
  const content =
    typeof rawContent === 'string' ? { definition: rawContent, examples: [] } : rawContent;

  return (
    <Layout>
      {/* Breadcrumb */}
      <nav className="text-sm mb-6 text-text-tertiary">
        <Link to={localePath('/')} className="hover:underline">
          {t('home')}
        </Link>
        <span className="mx-2">/</span>
        <Link to={localePath(`/field/${concept.field}`)} className="hover:underline">
          {field?.name[locale] || field?.name.en}
        </Link>
        {subfield && (
          <>
            <span className="mx-2">/</span>
            <span>{subfield.name[locale] || subfield.name.en}</span>
          </>
        )}
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{field?.icon}</span>
            <h1 className="text-3xl font-bold text-text-primary">{name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFavorite}
              className="p-2 rounded-lg transition-all hover:scale-110 bg-bg-secondary border border-border-primary"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              title={
                locale === 'ko'
                  ? isFavorite
                    ? '즐겨찾기 해제'
                    : '즐겨찾기 추가'
                  : isFavorite
                    ? 'Remove from favorites'
                    : 'Add to favorites'
              }
            >
              <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
            </button>
            <DifficultyBadge level={concept.difficulty} size="md" />
          </div>
        </div>

        {/* English name if viewing in Korean */}
        {locale !== 'en' && concept.name.en !== name && (
          <p className="text-lg mb-2 text-text-tertiary">{concept.name.en}</p>
        )}
      </header>

      <div className="space-y-8">
        {/* 정의 Definition */}
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-text-primary">
            <span>📖</span>
            {t('definition')}
          </h2>
          <p className="text-lg leading-relaxed text-text-secondary">{content.definition}</p>
        </section>

        {/* 공식 Formulas */}
        {(content.formulas?.length ?? 0) > 0 && (
          <section>
            <FormulaList formulas={content.formulas ?? []} title={t('formulas')} />
          </section>
        )}

        {/* 예제 Examples */}
        {(content.examples?.length ?? 0) > 0 && (
          <section>
            <ExampleList examples={content.examples} title={t('examples')} />
          </section>
        )}

        {/* 역사 History */}
        {content.history && (
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-text-primary">
              <span>📜</span>
              {t('history')}
            </h2>
            <div className="rounded-lg p-4 bg-bg-secondary border border-border-primary">
              {content.history.discoveredBy && (
                <p className="text-text-secondary">
                  <strong className="text-text-primary">
                    {locale === 'ko' ? '발견자' : 'Discovered by'}:
                  </strong>{' '}
                  {content.history.discoveredBy}
                  {content.history.year && ` (${content.history.year})`}
                </p>
              )}
              {content.history.background && (
                <p className="mt-2 text-text-tertiary">{content.history.background}</p>
              )}
            </div>
          </section>
        )}

        {/* 응용 분야 Applications */}
        {(content.applications?.length ?? 0) > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-text-primary">
              <span>⚡</span>
              {t('applications')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.applications?.map((app) => (
                <div
                  key={typeof app === 'string' ? app : app.field}
                  className="rounded-lg p-3 bg-bg-secondary border border-border-primary"
                >
                  {typeof app === 'string' ? (
                    <p className="text-text-primary">{app}</p>
                  ) : (
                    <>
                      <h4 className="font-medium mb-1 text-text-primary">{app.field}</h4>
                      <p className="text-sm text-text-tertiary">{app.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 연관 문서 Relations */}
        <section>
          <RelationLinks relations={concept.relations} />
        </section>

        {/* 태그 Tags */}
        {concept.tags.length > 0 && (
          <section>
            <div className="flex flex-wrap gap-2">
              {concept.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-bg-tertiary text-text-tertiary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
