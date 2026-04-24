/**
 * @fileoverview 대화 예문 인덱스 페이지 공유 컴포넌트
 *
 * 영어/한국어 라우트 파일에서 공통으로 사용하는 UI 컴포넌트입니다.
 * useI18n()을 통해 locale에 따라 자동으로 번역된 텍스트를 표시합니다.
 */

import { Link } from '@tanstack/react-router';
import { MessageCircle } from 'lucide-react';
import { Layout } from '@/components/layout';
import type { Category } from '@/data/types';
import { useI18n } from '@/i18n';

export const conversationsIndexMeta = {
  ko: {
    title: '대화 예문 | Context',
    description: '일상 상황별 한국어 대화 예문으로 자연스러운 한국어를 배워보세요',
  },
  en: {
    title: 'Conversations | Context',
    description: 'Learn natural Korean with conversation examples for everyday situations',
  },
};

interface ConversationsIndexContentProps {
  categoriesWithCount: { category: Category; count: number }[];
}

export function ConversationsIndexContent({ categoriesWithCount }: ConversationsIndexContentProps) {
  const { locale, t, localePath } = useI18n();

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-2 flex items-center gap-3">
          <MessageCircle size={28} />
          {t('conversationExamples')}
        </h1>
        <p className="text-(--text-secondary)">{t('conversationDescription')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {categoriesWithCount.map(({ category, count }) => (
          <Link
            key={category.id}
            to={localePath(`/conversations/${category.id}`)}
            className="block p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-(--border-focus)"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{category.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-(--text-primary)">{category.name[locale]}</h3>
                <p className="text-xs text-(--text-tertiary)">
                  {count} {t('conversationCount')}
                </p>
              </div>
            </div>
            <p className="text-sm text-(--text-secondary) line-clamp-2">
              {category.description[locale]}
            </p>
          </Link>
        ))}
      </div>

      {categoriesWithCount.length === 0 && (
        <p className="text-center py-12 px-4 text-(--text-tertiary)">{t('noConversationsYet')}</p>
      )}
    </Layout>
  );
}
