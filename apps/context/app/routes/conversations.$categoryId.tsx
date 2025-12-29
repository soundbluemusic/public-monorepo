import { cn } from '@soundblue/shared-react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Link, useLoaderData } from 'react-router';
import { LinkedExample } from '@/components/LinkedExample';
import { Layout } from '@/components/layout';
import { getCategoryById } from '@/data/categories';
import { getConversationsByCategory } from '@/data/conversations';
import type { Category, Conversation } from '@/data/types';
import { useI18n } from '@/i18n';

/**
 * Loader: 빌드 시 카테고리별 대화 로드 (SSG용)
 */
export async function loader({ params }: { params: { categoryId: string } }) {
  const category = getCategoryById(params.categoryId);
  const conversations = getConversationsByCategory(params.categoryId);
  return { category: category || null, conversations };
}

export function meta() {
  return [{ title: 'Conversations - Context' }];
}

export default function ConversationsCategoryPage() {
  const { category, conversations } = useLoaderData<{
    category: Category | null;
    conversations: Conversation[];
  }>();
  const { locale, t, localePath } = useI18n();

  if (!category) {
    return (
      <Layout>
        <div className="text-center py-12 px-4 text-(--text-tertiary)">
          <p className="text-(--text-secondary)">{t('categoryNotFoundMsg')}</p>
          <Link
            to={localePath('/conversations')}
            className="text-(--accent-primary) hover:underline mt-4 inline-block"
          >
            {t('backToConversations')}
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
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

      {/* Conversations */}
      <div className="space-y-6">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)"
          >
            {/* Title */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-(--border-primary)">
              <MessageCircle size={18} className="text-(--accent-primary)" />
              <h2 className="font-semibold text-(--text-primary)">{conv.title[locale]}</h2>
            </div>

            {/* Dialogue */}
            <div className="space-y-3">
              {conv.dialogue.map((line, idx) => {
                const isA = line.speaker === 'A';
                const text = locale === 'ko' ? line.ko : line.en;

                return (
                  <div key={idx} className={cn('flex', isA ? 'justify-start' : 'justify-end')}>
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
                        {locale === 'ko' ? <LinkedExample text={text} currentEntryId="" /> : text}
                      </p>
                      {/* Show translation underneath */}
                      <p
                        className={cn(
                          'text-xs mt-1',
                          isA ? 'text-(--text-tertiary)' : 'text-white/70',
                        )}
                      >
                        {locale === 'ko' ? line.en : line.ko}
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
