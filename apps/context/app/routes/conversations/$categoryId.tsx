/**
 * @fileoverview 대화 예문 카테고리 페이지 - 영어 버전 (TanStack Start)
 */

import { dynamicHeadFactoryEn } from '@soundblue/seo/meta';
import { cn } from '@soundblue/ui/utils';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { LinkedExample } from '@/components/entry';
import { Layout } from '@/components/layout';
import { APP_CONFIG } from '@/config';
import { getCategoryById } from '@/data/categories';
import { getConversationsByCategory } from '@/data/conversations';
import type { Category, Conversation } from '@/data/types';
import { useI18n } from '@/i18n';

interface LoaderData {
  category: Category;
  conversations: Conversation[];
}

export const Route = createFileRoute('/conversations/$categoryId')({
  loader: async ({ params }): Promise<LoaderData> => {
    const category = getCategoryById(params.categoryId);

    if (!category) {
      throw notFound();
    }

    const conversations = getConversationsByCategory(params.categoryId);
    return { category, conversations };
  },
  head: dynamicHeadFactoryEn<LoaderData>(
    (data) => {
      if (!data?.category) {
        return {
          ko: { title: 'Not Found | Context' },
          en: { title: 'Not Found | Context' },
        };
      }
      const { category, conversations } = data;
      return {
        ko: {
          title: `${category.name.ko} 대화 | Context`,
          description: `${category.name.ko} 상황의 ${conversations.length}개 한국어 대화 예문`,
        },
        en: {
          title: `${category.name.en} Conversations | Context`,
          description: `${conversations.length} Korean conversation examples for ${category.name.en} situations`,
        },
      };
    },
    APP_CONFIG.baseUrl,
    (data) => `/conversations/${data.category.id}`,
  ),
  component: ConversationsCategoryPage,
});

function ConversationsCategoryPage() {
  const { category, conversations } = Route.useLoaderData();
  const { locale, t, localePath } = useI18n();

  return (
    <Layout>
      <div className="mb-8">
        <Link
          to={localePath('/conversations')}
          className="inline-flex items-center gap-1 text-sm text-(--text-tertiary) hover:text-(--text-secondary) mb-4"
        >
          <ArrowLeft size={16} />
          {t('allConversations')}
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{category.icon}</span>
          <h1 className="text-2xl font-semibold text-(--text-primary)">{category.name[locale]}</h1>
        </div>
        <p className="text-(--text-secondary)">
          {conversations.length} {t('conversationCount')}
        </p>
      </div>

      <div className="space-y-6">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)"
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-(--border-primary)">
              <MessageCircle size={18} className="text-(--accent-primary)" />
              <h2 className="font-semibold text-(--text-primary)">{conv.title[locale]}</h2>
            </div>

            <div className="space-y-3">
              {conv.dialogue.map((line) => {
                const isA = line.speaker === 'A';
                const lineKey = `${line.speaker}-${line.ko.slice(0, 20)}`;

                return (
                  <div key={lineKey} className={cn('flex', isA ? 'justify-start' : 'justify-end')}>
                    <div
                      className={cn(
                        'max-w-[80%] px-4 py-2.5 rounded-2xl',
                        isA
                          ? 'bg-(--bg-secondary) rounded-bl-sm'
                          : 'bg-(--accent-primary) text-white rounded-br-sm',
                      )}
                    >
                      <span className="text-xs font-medium opacity-70 block mb-1">
                        {line.speaker}
                      </span>
                      <p className={cn('text-sm', isA ? 'text-(--text-primary)' : 'text-white')}>
                        <LinkedExample
                          text={line.ko}
                          currentEntryId=""
                          linkClassName={
                            isA
                              ? 'text-(--accent-primary) underline decoration-dotted underline-offset-4 hover:decoration-solid'
                              : 'text-white underline decoration-dotted underline-offset-4 hover:decoration-solid'
                          }
                        />
                      </p>
                      <p
                        className={cn(
                          'text-xs mt-1',
                          isA ? 'text-(--text-tertiary)' : 'text-white/70',
                        )}
                      >
                        {line.en}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {conversations.length === 0 && (
        <p className="text-center py-12 px-4 text-(--text-tertiary)">
          {t('noCategoryConversations')}
        </p>
      )}
    </Layout>
  );
}
