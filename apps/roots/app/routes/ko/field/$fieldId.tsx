/**
 * @fileoverview 분야 상세 페이지 (한글)
 */

import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import {
  buildFieldRouteHead,
  type FieldLoaderData,
  FieldPage,
  fieldCanonicalPath,
  fieldRouteLoader,
} from '../../../components/pages';
import { APP_CONFIG } from '../../../config';

export const Route = createFileRoute('/ko/field/$fieldId')({
  loader: fieldRouteLoader,
  head: dynamicHeadFactoryKo<FieldLoaderData>(
    buildFieldRouteHead,
    APP_CONFIG.baseUrl,
    fieldCanonicalPath,
    { trailingSlash: true },
  ),
  component: FieldPageWrapper,
});

function FieldPageWrapper() {
  const { concepts } = Route.useLoaderData();
  const { fieldId } = Route.useParams();
  return <FieldPage concepts={concepts} fieldId={fieldId} />;
}
