import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import {
  type BreadcrumbItem,
  generateBreadcrumbSchema,
  generateTechArticleSchema,
} from '@soundblue/seo/structured-data';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Calendar, CheckCircle, ExternalLink, Globe } from 'lucide-react';
import DocsLayout from '../../../components/layout/DocsLayout';
import { APP_CONFIG } from '../../../config';
import { getWebApiSlug } from '../../../data/web-apis';
import {
  buildWebApiRouteHead,
  type WebApiRouteLoaderData,
  webApiCanonicalPath,
  webApiRouteLoader,
} from '../../../routes-meta';

export const Route = createFileRoute('/ko/web-api/$slug')({
  loader: webApiRouteLoader,
  head: dynamicHeadFactoryKo<WebApiRouteLoaderData>(
    buildWebApiRouteHead,
    APP_CONFIG.baseUrl,
    webApiCanonicalPath,
    { trailingSlash: true },
  ),
  component: WebApiDetailPageKo,
});

function WebApiDetailPageKo() {
  const { api, related } = Route.useLoaderData();
  const locale = 'ko';
  const _localePath = (path: string) => `/ko${path}`;
  const _isKorean = true;

  // 브라우저 지원율을 숫자로 파싱
  const supportPercent = Number.parseInt(api.support.replace('%', ''), 10);
  const supportColor =
    supportPercent >= 90
      ? 'text-green-500'
      : supportPercent >= 70
        ? 'text-yellow-500'
        : 'text-red-500';

  // JSON-LD 구조화 데이터
  const { baseUrl } = APP_CONFIG;
  const localePrefix = '/ko';

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: '홈', url: `${baseUrl}${localePrefix}` },
    { name: 'Web API', url: `${baseUrl}${localePrefix}/web-api` },
    { name: api.name, url: `${baseUrl}${localePrefix}/web-api/${getWebApiSlug(api.name)}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const techArticleSchema = generateTechArticleSchema({
    headline: api.name,
    description: api.descriptionKo,
    url: `${baseUrl}${localePrefix}/web-api/${getWebApiSlug(api.name)}`,
    datePublished: api.yearStable ? `${api.yearStable}-01-01` : '2020-01-01',
    author: {
      name: 'SoundBlue Music',
      url: 'https://soundbluemusic.com',
    },
    inLanguage: locale,
    proficiencyLevel: supportPercent >= 90 ? 'Beginner' : 'Intermediate',
  });

  return (
    <DocsLayout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Schema.org JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />

      <div>
        {/* Back link */}
        <Link
          to="/ko/web-api"
          className="inline-flex items-center gap-2 text-(--text-secondary) hover:text-(--text-primary) transition-colors mb-6"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Web API 목록
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary)">{api.name}</h1>
            <div className={`flex items-center gap-1 font-medium ${supportColor}`}>
              <CheckCircle size={18} aria-hidden="true" />
              <span>{api.support}</span>
            </div>
          </div>
          <p className="text-lg text-(--text-secondary)">{api.descriptionKo}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {api.trending && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-orange-500/10 text-orange-500">
              🔥 트렌딩
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-(--bg-tertiary) text-(--text-secondary)">
            {api.category}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
            <div className="flex items-center gap-2 text-(--text-tertiary) text-sm mb-1">
              <CheckCircle size={16} aria-hidden="true" />
              브라우저 지원
            </div>
            <div className={`font-semibold ${supportColor}`}>{api.support}</div>
          </div>
          {api.yearStable && (
            <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
              <div className="flex items-center gap-2 text-(--text-tertiary) text-sm mb-1">
                <Calendar size={16} aria-hidden="true" />
                안정화 연도
              </div>
              <div className="font-semibold text-(--text-primary)">{api.yearStable}</div>
            </div>
          )}
          <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
            <div className="flex items-center gap-2 text-(--text-tertiary) text-sm mb-1">
              <Globe size={16} aria-hidden="true" />
              카테고리
            </div>
            <div className="font-semibold text-(--text-primary)">{api.category}</div>
          </div>
        </div>

        {/* Links */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-(--text-tertiary) mb-3">참고 자료</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href={api.mdnUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--bg-elevated) border border-(--border-primary) text-(--text-primary) hover:border-(--border-focus) transition-colors"
            >
              <ExternalLink size={18} aria-hidden="true" />
              MDN Documentation
            </a>
          </div>
        </div>

        {/* Related APIs */}
        {related.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-(--text-primary) mb-4">관련 Web API</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relApi) => (
                <Link
                  key={relApi.name}
                  to="/ko/web-api/$slug"
                  params={{ slug: getWebApiSlug(relApi.name) }}
                  className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) hover:border-(--border-focus) transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-medium text-(--text-primary)">{relApi.name}</h3>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        Number.parseInt(relApi.support.replace('%', ''), 10) >= 90
                          ? 'text-green-500'
                          : Number.parseInt(relApi.support.replace('%', ''), 10) >= 70
                            ? 'text-yellow-500'
                            : 'text-red-500'
                      }`}
                    >
                      <CheckCircle size={14} aria-hidden="true" />
                      {relApi.support}
                    </div>
                  </div>
                  <p className="text-sm text-(--text-secondary) line-clamp-2">
                    {relApi.descriptionKo}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DocsLayout>
  );
}
