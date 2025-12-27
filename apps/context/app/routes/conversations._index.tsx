import { MessageCircle } from 'lucide-react';
import { Link, useLoaderData } from 'react-router';
import { Layout } from '@/components/layout';
import { getCategoryById } from '@/data/categories';
import { getCategoriesWithConversations, getConversationsByCategory } from '@/data/conversations';
import type { Category } from '@/data/types';
import { useI18n } from '@/i18n';

/**
 * Loader: 빌드 시 대화가 있는 카테고리 목록 로드 (SSG용)
 */
export async function loader() {
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

export function meta() {
  return [{ title: 'Conversations - Context' }];
}

export default function ConversationsIndexPage() {
  const { categoriesWithCount } = useLoaderData<{
    categoriesWithCount: { category: Category; count: number }[];
  }>();
  const { locale, localePath } = useI18n();

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-2 flex items-center gap-3">
          <MessageCircle size={28} />
          {locale === 'ko' ? '대화 예시' : 'Conversation Examples'}
        </h1>
        <p className="text-(--text-secondary)">
          {locale === 'ko'
            ? '카테고리별 실생활 대화 예시를 통해 한국어를 배워보세요.'
            : 'Learn Korean through real-life conversation examples by category.'}
        </p>
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
                  {count} {locale === 'ko' ? '개 대화' : 'conversations'}
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
        <p className="text-center py-12 px-4 text-(--text-tertiary)">
          {locale === 'ko' ? '대화 예시가 아직 없습니다.' : 'No conversation examples yet.'}
        </p>
      )}
    </Layout>
  );
}
