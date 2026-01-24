/**
 * @fileoverview 개념 상세 페이지 (영어)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { ConceptPage } from '../../components/pages';
import { getConceptById as getConceptByIdStatic } from '../../data/concepts/index';
import { getFieldById } from '../../data/fields';
import type { MathConcept } from '../../data/types';

type LoaderData = { concept: MathConcept };

export const Route = createFileRoute('/concept/$conceptId')({
  loader: async ({ params }) => {
    if (!params.conceptId) {
      throw notFound();
    }
    const concept = getConceptByIdStatic(params.conceptId);
    if (!concept) {
      throw notFound();
    }
    return { concept };
  },
  head: dynamicHeadFactoryEn<LoaderData>(
    (data) => {
      if (!data?.concept) {
        return {
          ko: { title: 'Not Found | Roots' },
          en: { title: 'Not Found | Roots' },
        };
      }
      const { concept } = data;
      const nameKo = concept.name.ko || concept.name.en;
      const nameEn = concept.name.en;
      const contentKo = concept.content.ko;
      const contentEn = concept.content.en;
      const defKo = typeof contentKo === 'string' ? contentKo : contentKo.definition;
      const defEn = typeof contentEn === 'string' ? contentEn : contentEn.definition;
      const field = getFieldById(concept.field);
      return {
        ko: {
          title: `${nameKo} | Roots`,
          description: defKo,
          keywords: [
            nameKo,
            `${nameKo} 공식`,
            `${nameKo} 정의`,
            field?.name.ko || concept.field,
            '수학 개념',
            '수학 공식',
          ],
        },
        en: {
          title: `${nameEn} | Roots`,
          description: defEn,
          keywords: [
            nameEn,
            `${nameEn} formula`,
            `${nameEn} definition`,
            field?.name.en || concept.field,
            'math concept',
            'math formula',
          ],
        },
      };
    },
    'https://roots.soundbluemusic.com',
    (data) => `/concept/${data.concept.id}`,
  ),
  component: ConceptPageWrapper,
});

function ConceptPageWrapper() {
  const { concept } = Route.useLoaderData();
  const { conceptId } = Route.useParams();
  return <ConceptPage concept={concept} conceptId={conceptId} />;
}
