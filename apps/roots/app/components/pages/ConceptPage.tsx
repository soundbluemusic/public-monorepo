/**
 * @fileoverview 공유 ConceptPage 컴포넌트
 */

import { toast } from '@soundblue/features/toast';
import {
  type BreadcrumbItem,
  generateArticleSchema,
  generateBreadcrumbSchema,
} from '@soundblue/seo/structured-data';
import { Breadcrumb, FeedbackButton, ShareButton, TagList } from '@soundblue/ui/components';
import { Link } from '@tanstack/react-router';
import { BookOpen, Heart, History, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { APP_CONFIG } from '../../config';
import { getFieldById } from '../../data/fields';
import { getSubfieldById } from '../../data/subfields';
import type { MathConcept } from '../../data/types';
import { useI18n } from '../../i18n';
import { favorites } from '../../lib/db';
import { type ConceptNames, RelationLinks } from '../concept/RelationLinks';
import { Layout } from '../layout/Layout';
import { ExampleList } from '../math/Example';
import { FormulaList } from '../math/Formula';
import { DifficultyBadge } from '../ui/DifficultyBadge';

export interface ConceptPageProps {
  concept: MathConcept;
  conceptId: string;
}

export function ConceptPage({ concept, conceptId }: ConceptPageProps) {
  const [conceptNames, setConceptNames] = useState<ConceptNames>({});
  const { locale, t, localePath } = useI18n();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 하이드레이션 완료 감지
  useEffect(() => {
    setIsClient(true);
  }, []);

  // conceptNames 로드 (클라이언트 전용)
  useEffect(() => {
    if (isClient) {
      fetch('/concept-names.json')
        .then((res) => {
          if (!res.ok) {
            console.error(`[ConceptPage] Failed to load concept-names: ${res.status}`);
            return {};
          }
          return res.json();
        })
        .then(setConceptNames)
        .catch((error) => {
          console.error('[ConceptPage] Failed to load concept-names:', error);
        });
    }
  }, [isClient]);

  // 즐겨찾기 상태 확인 (클라이언트 전용)
  useEffect(() => {
    if (isClient && conceptId) {
      favorites
        .isFavorite(conceptId)
        .then(setIsFavorite)
        .catch((error) => {
          console.error('[ConceptPage] IndexedDB access failed:', error);
        });
    }
  }, [isClient, conceptId]);

  const toggleFavorite = async () => {
    if (!conceptId) return;

    try {
      if (isFavorite) {
        await favorites.remove(conceptId);
        setIsFavorite(false);
        toast({
          message: t('toast.removedFromFavorites'),
          type: 'success',
        });
      } else {
        await favorites.add(conceptId);
        setIsFavorite(true);
        toast({
          message: t('toast.addedToFavorites'),
          type: 'success',
        });
      }
    } catch {
      toast({
        message: t('toast.saveFailed'),
        type: 'error',
      });
    }
  };

  // concept.field may be a subfield ID, so try to get parent field
  const subfield = getSubfieldById(concept.subfield);
  const directField = getFieldById(concept.field);
  const subfieldAsField = getSubfieldById(concept.field);
  const field = directField || (subfieldAsField ? getFieldById(subfieldAsField.parentField) : null);
  const name = concept.name[locale] || concept.name.en;
  const rawContent = concept.content[locale] || concept.content.en;
  const content =
    typeof rawContent === 'string' ? { definition: rawContent, examples: [] } : rawContent;

  // JSON-LD 구조화 데이터
  const { baseUrl } = APP_CONFIG;
  const localePrefix = locale === 'ko' ? '/ko' : '';

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: locale === 'ko' ? '홈' : 'Home', url: `${baseUrl}${localePrefix}` },
  ];
  if (field) {
    breadcrumbItems.push({
      name: field.name[locale] || field.name.en,
      url: `${baseUrl}${localePrefix}/field/${field.id}`,
    });
  }
  breadcrumbItems.push({
    name,
    url: `${baseUrl}${localePrefix}/concept/${concept.id}`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const articleSchema = generateArticleSchema({
    headline: name,
    description: content.definition,
    url: `${baseUrl}${localePrefix}/concept/${concept.id}`,
    datePublished: '2025-01-01',
    author: { name: 'SoundBlue Music', url: 'https://soundbluemusic.com' },
    inLanguage: locale,
  });

  const favoriteLabel =
    locale === 'ko'
      ? isFavorite
        ? '즐겨찾기 해제'
        : '즐겨찾기 추가'
      : isFavorite
        ? 'Remove from favorites'
        : 'Add to favorites';

  return (
    <Layout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          ...(field
            ? [{ label: field.name[locale] || field.name.en, href: `/field/${field.id}` }]
            : []),
          ...(subfield
            ? [{ label: subfield.name[locale] || subfield.name.en }]
            : [{ label: name }]),
        ]}
        showHome
        homeLabel={t('home')}
        homePath={localePath('/')}
        LinkComponent={Link}
        className="mb-6"
      />

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{field?.icon}</span>
            <h1 className="text-3xl font-bold text-(--text-primary)">{name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ShareButton
              url={`${baseUrl}${localePrefix}/concept/${concept.id}`}
              title={name}
              description={content.definition}
              variant="ghost"
              iconOnly
              size="md"
            />
            <button
              type="button"
              onClick={toggleFavorite}
              className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--accent-primary) cursor-pointer"
              aria-label={favoriteLabel}
              title={favoriteLabel}
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
          <RelationLinks relations={concept.relations} names={conceptNames} />
        </section>

        {/* 태그 Tags */}
        {concept.tags.length > 0 && (
          <section>
            <TagList
              tags={concept.tags}
              label={locale === 'ko' ? '태그:' : 'Tags:'}
              getTagHref={(tag) => localePath(`/tag/${encodeURIComponent(tag)}`)}
            />
          </section>
        )}

        {/* Feedback */}
        <section className="pt-8 border-t border-(--border-primary)">
          <FeedbackButton
            contentId={concept.id}
            question={locale === 'ko' ? '이 페이지가 도움이 되었나요?' : 'Was this page helpful?'}
            positiveLabel={locale === 'ko' ? '네' : 'Yes'}
            negativeLabel={locale === 'ko' ? '아니요' : 'No'}
            thankYouMessage={locale === 'ko' ? '피드백 감사합니다!' : 'Thanks for your feedback!'}
            variant="default"
          />
        </section>
      </div>
    </Layout>
  );
}
