import { metaFactory } from '@soundblue/i18n';
import { MessageCircle } from 'lucide-react';
import { Link, useLoaderData } from 'react-router';
import { Layout } from '@/components/layout';
import { getCategoryById } from '@/data/categories';
import { getCategoriesWithConversations, getConversationsByCategory } from '@/data/conversations';
import type { Category } from '@/data/types';
import { useI18n } from '@/i18n';

/**
 * clientLoader: 클라이언트에서 데이터 로드
 * Pages 빌드에서는 loader 대신 clientLoader 사용
 */
export async function clientLoader() {
  const categoryIds = getCategoriesWithConversations();
  const categoriesWithCount = categoryIds
    .map((id) => {
      const category = getCategoryById(id);
      const conversations = getConversationsByCategory(id);
      return category ? { category, count: conversations.length } : null;
    })
    .filter((item): item is { category: Category; count: number } => item !== null)
    .sort((a, b) => a.category.order - b.category.order);

  return { categoriesWithCount };
}

export const meta = metaFactory(
  {
    ko: {
      title: '대화 예문 | Context',
      description: '일상 상황별 한국어 대화 예문으로 자연스러운 한국어를 배워보세요',
    },
    en: {
      title: 'Conversations | Context',
      description: 'Learn natural Korean with conversation examples for everyday situations',
    },
  },
  'https://context.soundbluemusic.com',
);

export default function ConversationsIndexPage() {
  const { categoriesWithCount } = useLoaderData<{
    categoriesWithCount: { category: Category; count: number }[];
  }>();
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
