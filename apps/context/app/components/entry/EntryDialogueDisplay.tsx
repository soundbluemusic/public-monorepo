import { cn } from '@soundblue/ui/utils';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import type { EntryDialogue } from '@/data/types';
import { useI18n } from '@/i18n';

interface EntryDialogueDisplayProps {
  /** dialogue 데이터 (D1에서 로드됨) */
  dialogue?: EntryDialogue;
  className?: string;
}

/**
 * 어휘별 대화예문 표시 컴포넌트
 *
 * D1에서 로드된 dialogue 데이터를 props로 받아 표시합니다.
 * A/B 화자를 구분하여 채팅 스타일로 렌더링합니다.
 */
export function EntryDialogueDisplay({ dialogue, className }: EntryDialogueDisplayProps) {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  // dialogue가 없으면 렌더링하지 않음
  if (!dialogue) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-xl bg-(--bg-elevated) border border-(--border-primary) overflow-hidden',
        className,
      )}
    >
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 p-4 hover:bg-(--bg-tertiary) transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-(--accent-primary)" />
          <h3 className="text-base font-semibold text-(--text-primary)">{t('entryDialogue')}</h3>
        </div>
        <ChevronDown
          size={18}
          className={cn('text-(--text-tertiary) transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {/* Dialogue content */}
      {isOpen && (
        <div className="px-4 pb-4">
          {/* Context */}
          <div className="mb-4 px-3 py-2 rounded-lg bg-(--bg-tertiary) border border-(--border-secondary)">
            <span className="text-xs font-medium text-(--text-tertiary) uppercase tracking-wider">
              {t('entryDialogueContext')}
            </span>
            <p className="text-sm text-(--text-secondary) mt-1">{dialogue.context}</p>
          </div>

          {/* Dialogue lines */}
          <div className="space-y-3">
            {dialogue.dialogue.map((line, index) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: Dialogue lines are static and strictly ordered
                key={index}
                className={cn(
                  'flex flex-col gap-1',
                  line.speaker === 'A' ? 'items-start' : 'items-end',
                )}
              >
                {/* Speaker badge */}
                <span
                  className={cn(
                    'text-xs font-bold px-2 py-0.5 rounded-full',
                    line.speaker === 'A'
                      ? 'bg-(--accent-primary) text-white'
                      : 'bg-(--bg-tertiary) text-(--text-secondary) border border-(--border-primary)',
                  )}
                >
                  {line.speaker}
                </span>

                {/* Message bubble */}
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5',
                    line.speaker === 'A'
                      ? 'bg-(--accent-primary)/10 border border-(--accent-primary)/20 rounded-tl-sm'
                      : 'bg-(--bg-tertiary) border border-(--border-primary) rounded-tr-sm',
                  )}
                >
                  {/* Main text */}
                  <p className="text-sm font-medium text-(--text-primary)">{line.text}</p>

                  {/* Romanization (only for Korean locale showing Korean text) */}
                  {locale === 'ko' && line.romanization && (
                    <p className="text-xs text-(--text-tertiary) mt-1 italic">
                      {line.romanization}
                    </p>
                  )}

                  {/* Translation */}
                  <p className="text-xs text-(--text-secondary) mt-1.5 pt-1.5 border-t border-(--border-secondary)">
                    {line.translation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
