/**
 * @fileoverview 분야 상세 페이지 (한글)
 */

import { dynamicHeadFactoryKo } from '@soundblue/seo/meta';
import { createFileRoute } from '@tanstack/react-router';
import { FieldPage } from '../../../components/pages';
import { getConceptsByField as getConceptsByFieldStatic } from '../../../data/concepts/index';
import { getFieldById } from '../../../data/fields';
import type { MathConcept, MathFieldInfo } from '../../../data/types';

type LoaderData = { concepts: MathConcept[]; field: MathFieldInfo | null };

export const Route = createFileRoute('/ko/field/$fieldId')({
  loader: async ({ params }) => {
    if (!params.fieldId) {
      return { concepts: [], field: null };
    }
    const concepts = getConceptsByFieldStatic(params.fieldId);
    const field = getFieldById(params.fieldId);
    return { concepts, field: field || null };
  },
  head: dynamicHeadFactoryKo<LoaderData>(
    (data) => {
      if (!data?.field) {
        return {
          ko: { title: '분야를 찾을 수 없습니다 | Roots' },
          en: { title: 'Field Not Found | Roots' },
        };
      }
      const { field } = data;
      const nameKo = field.name.ko || field.name.en;
      const nameEn = field.name.en;
      const descKo = field.description?.ko || `${nameKo} 분야의 수학 개념`;
      const descEn = field.description?.en || `Math concepts in ${nameEn}`;
      return {
        ko: {
          title: `${nameKo} | Roots`,
          description: descKo,
          keywords: [nameKo, `${nameKo} 수학`, '수학 분야', '수학 개념', '수학 공식'],
        },
        en: {
          title: `${nameEn} | Roots`,
          description: descEn,
          keywords: [nameEn, `${nameEn} math`, 'math field', 'math concepts', 'math formulas'],
        },
      };
    },
    'https://roots.soundbluemusic.com',
    (data) => `/field/${data.field?.id ?? ''}`,
  ),
  component: FieldPageWrapper,
});

function FieldPageWrapper() {
  const { concepts } = Route.useLoaderData();
  const { fieldId } = Route.useParams();
  return <FieldPage concepts={concepts} fieldId={fieldId} />;
}
