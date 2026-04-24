/**
 * @fileoverview 개념 상세 페이지 (영어)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import {
  buildConceptRouteHead,
  type ConceptLoaderData,
  ConceptPage,
  conceptCanonicalPath,
  conceptRouteLoader,
} from '../../components/pages';
import { APP_CONFIG } from '../../config';

export const Route = createFileRoute('/concept/$conceptId')({
  loader: conceptRouteLoader,
  head: dynamicHeadFactoryEn<ConceptLoaderData>(
    buildConceptRouteHead,
    APP_CONFIG.baseUrl,
    conceptCanonicalPath,
    { trailingSlash: true },
  ),
  component: ConceptPageWrapper,
});

function ConceptPageWrapper() {
  const { concept } = Route.useLoaderData();
  const { conceptId } = Route.useParams();
  return <ConceptPage concept={concept} conceptId={conceptId} />;
}
