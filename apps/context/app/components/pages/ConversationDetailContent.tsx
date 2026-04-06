/**
 * @fileoverview 대화 예문 카테고리 상세 페이지 공유 컴포넌트
 *
 * 영어/한국어 라우트 파일에서 공통으로 사용하는 UI 컴포넌트입니다.
 * useI18n()을 통해 locale에 따라 자동으로 번역된 텍스트를 표시합니다.
 */

import { cn } from '@soundblue/ui/utils';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { LinkedExample } from '@/components/entry';
import { Layout } from '@/components/layout';
import type { Category, Conversation } from '@/data/types';
import { useI18n } from '@/i18n';

interface ConversationDetailContentProps {
  category: Category;
  conversations: Conversation[];
}

export function ConversationDetailContent({
  category,
  conversations,
}: ConversationDetailContentProps) {
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
