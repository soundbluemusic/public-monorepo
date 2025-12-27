/**
 * @fileoverview 개념 상세 페이지
 */

import { BookOpen, Heart, History, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLoaderData, useParams } from 'react-router';
import { RelationLinks } from '@/components/concept/RelationLinks';
import { Layout } from '@/components/layout/Layout';
import { ExampleList } from '@/components/math/Example';
import { FormulaList } from '@/components/math/Formula';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { getConceptById as getConceptByIdStatic } from '@/data/concepts/index';
import { getFieldById } from '@/data/fields';
import { getSubfieldById } from '@/data/subfields';
import { useI18n } from '@/i18n';
import { favorites } from '@/lib/db';

/**
 * Loader: 빌드 시 데이터 로드 (SSG용)
 * 빌드 시에는 TypeScript에서 직접 import
 */
export async function loader({ params }: { params: { conceptId: string } }) {
  if (!params.conceptId) {
    return { concept: null };
  }
  const concept = getConceptByIdStatic(params.conceptId);
  return { concept: concept || null };
}

export default function ConceptPage() {
  const loaderData = useLoaderData<typeof loader>();
  const concept = loaderData?.concept || null;
  const params = useParams<{ conceptId: string }>();
  const { locale, t, localePath } = useI18n();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 하이드레이션 완료 감지
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 즐겨찾기 상태 확인 (클라이언트 전용)
  useEffect(() => {
    if (isClient && params.conceptId) {
      favorites
        .isFavorite(params.conceptId)
        .then(setIsFavorite)
        .catch(() => {
          // IndexedDB 접근 실패 시 기본값 유지
        });
    }
  }, [isClient, params.conceptId]);

  const toggleFavorite = async () => {
    const conceptId = params.conceptId;
    if (!conceptId) return;

    try {
      if (isFavorite) {
        await favorites.remove(conceptId);
        setIsFavorite(false);
      } else {
        await favorites.add(conceptId);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  if (!concept) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-(--text-primary) mb-4">{t('conceptNotFound')}</h1>
          <Link
            to={localePath('/browse')}
            className="min-h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110 active:scale-[0.98]"
          >
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
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link
          to={localePath('/')}
          className="text-(--text-secondary) no-underline hover:text-(--text-primary)"
        >
          {t('home')}
        </Link>
        <span className="text-(--text-tertiary)">/</span>
        <Link
          to={localePath(`/field/${concept.field}`)}
          className="text-(--text-secondary) no-underline hover:text-(--text-primary)"
        >
          {field?.name[locale] || field?.name.en}
        </Link>
        {subfield && (
          <>
            <span className="text-(--text-tertiary)">/</span>
            <span className="text-(--text-primary)">
              {subfield.name[locale] || subfield.name.en}
            </span>
          </>
        )}
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{field?.icon}</span>
            <h1 className="text-3xl font-bold text-(--text-primary)">{name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFavorite}
              className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--accent-primary) cursor-pointer"
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
              <Heart
                size={20}
                aria-hidden="true"
                className={isFavorite ? 'text-(--accent-primary)' : ''}
                fill={isFavorite ? 'currentColor' : 'none'}
              />
            </button>
            <DifficultyBadge level={concept.difficulty} size="md" />
          </div>
        </div>

        {/* English name if viewing in Korean */}
        {locale !== 'en' && concept.name.en !== name && (
          <p className="text-lg text-(--text-secondary) mt-2">{concept.name.en}</p>
        )}
      </header>

      <div className="space-y-8">
        {/* 정의 Definition */}
        <section>
          <h2 className="text-xl font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
            <BookOpen size={20} aria-hidden="true" />
            {t('definition')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">{content.definition}</p>
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
            <h2 className="text-xl font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
              <History size={20} aria-hidden="true" />
              {t('history')}
            </h2>
            <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
              {content.history.discoveredBy && (
                <p className="text-(--text-secondary)">
                  <strong className="text-(--text-primary)">{t('discoveredBy')}:</strong>{' '}
                  {content.history.discoveredBy}
                  {content.history.year && ` (${content.history.year})`}
                </p>
              )}
              {content.history.background && (
                <p className="text-(--text-secondary) mt-2">{content.history.background}</p>
              )}
            </div>
          </section>
        )}

        {/* 응용 분야 Applications */}
        {(content.applications?.length ?? 0) > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
              <Zap size={20} aria-hidden="true" />
              {t('applications')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.applications?.map((app) => (
                <div
                  key={typeof app === 'string' ? app : app.field}
                  className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)"
                >
                  {typeof app === 'string' ? (
                    <p className="text-(--text-primary)">{app}</p>
                  ) : (
                    <>
                      <h4 className="font-medium text-(--text-primary) mb-1">{app.field}</h4>
                      <p className="text-sm text-(--text-secondary)">{app.description}</p>
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
                  className="px-3 py-1 rounded-full text-sm bg-(--bg-tertiary) text-(--text-secondary)"
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
