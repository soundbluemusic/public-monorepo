/**
 * @fileoverview 개념 상세 페이지
 */
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
import { BookOpen, Heart, History, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLoaderData, useParams } from 'react-router';
import styles from '../styles/app.module.scss';

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
        <div className={styles.notFoundContainer}>
          <h1 className={styles.notFoundTitle}>{t('conceptNotFound')}</h1>
          <Link to={localePath('/browse')} className={styles.btnPrimary}>
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
      <nav className={styles.breadcrumb}>
        <Link to={localePath('/')} className={styles.breadcrumbLink}>
          {t('home')}
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link to={localePath(`/field/${concept.field}`)} className={styles.breadcrumbLink}>
          {field?.name[locale] || field?.name.en}
        </Link>
        {subfield && (
          <>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span>{subfield.name[locale] || subfield.name.en}</span>
          </>
        )}
      </nav>

      {/* Header */}
      <header className={styles.conceptHeader}>
        <div className={styles.conceptHeaderRow}>
          <div className={styles.conceptTitleRow}>
            <span className={styles.conceptTitleIcon}>{field?.icon}</span>
            <h1 className={styles.conceptTitleText}>{name}</h1>
          </div>
          <div className={styles.conceptActions}>
            <button
              type="button"
              onClick={toggleFavorite}
              className={styles.favoriteBtn}
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
                className={styles.favoriteBtnIcon}
                fill={isFavorite ? 'currentColor' : 'none'}
              />
            </button>
            <DifficultyBadge level={concept.difficulty} size="md" />
          </div>
        </div>

        {/* English name if viewing in Korean */}
        {locale !== 'en' && concept.name.en !== name && (
          <p className={styles.conceptEnName}>{concept.name.en}</p>
        )}
      </header>

      <div className={styles.conceptContent}>
        {/* 정의 Definition */}
        <section>
          <h2 className={styles.sectionTitle}>
            <BookOpen size={20} aria-hidden="true" />
            {t('definition')}
          </h2>
          <p className={styles.conceptDefinition}>{content.definition}</p>
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
            <h2 className={styles.sectionTitle}>
              <History size={20} aria-hidden="true" />
              {t('history')}
            </h2>
            <div className={styles.historyCard}>
              {content.history.discoveredBy && (
                <p className={styles.historyText}>
                  <strong className={styles.historyStrong}>{t('discoveredBy')}:</strong>{' '}
                  {content.history.discoveredBy}
                  {content.history.year && ` (${content.history.year})`}
                </p>
              )}
              {content.history.background && (
                <p className={styles.historyBackground}>{content.history.background}</p>
              )}
            </div>
          </section>
        )}

        {/* 응용 분야 Applications */}
        {(content.applications?.length ?? 0) > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>
              <Zap size={20} aria-hidden="true" />
              {t('applications')}
            </h2>
            <div className={styles.applicationsGrid}>
              {content.applications?.map((app) => (
                <div
                  key={typeof app === 'string' ? app : app.field}
                  className={styles.applicationCard}
                >
                  {typeof app === 'string' ? (
                    <p className={styles.textPrimary}>{app}</p>
                  ) : (
                    <>
                      <h4 className={styles.applicationField}>{app.field}</h4>
                      <p className={styles.applicationDesc}>{app.description}</p>
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
            <div className={styles.tagsContainer}>
              {concept.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
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
