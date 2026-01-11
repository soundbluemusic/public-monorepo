import { cn } from '@soundblue/ui/utils';
import { ChevronDown, Loader2, MessageSquare } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { EntryDialogue } from '@/data/types';
import { useI18n } from '@/i18n';

interface EntryDialogueDisplayProps {
  /** entry ID - dialogue 데이터 fetch용 */
  entryId: string;
  /** dialogue 데이터 존재 여부 */
  hasDialogue?: boolean;
  className?: string;
}

/**
 * 어휘별 대화예문 표시 컴포넌트 (Lazy-loading)
 *
 * dialogue 데이터는 사용자가 펼칠 때 lazy-load됩니다.
 * 초기 페이지 로딩 시 ~30% 용량 절감 효과가 있습니다.
 *
 * A/B 화자를 구분하여 채팅 스타일로 렌더링합니다.
 */
export function EntryDialogueDisplay({
  entryId,
  hasDialogue,
  className,
}: EntryDialogueDisplayProps) {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [dialogue, setDialogue] = useState<EntryDialogue | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dialogueFilename = entryId === 'biome' ? 'biome.dialogue.json' : `${entryId}.json`;

  const handleToggle = useCallback(async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    // 이미 로드된 경우 바로 열기
    if (dialogue) {
      setIsOpen(true);
      return;
    }

    // dialogue 데이터 lazy-load
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/data/dialogues/${locale}/${dialogueFilename}`);
      if (!response.ok) {
        throw new Error('Failed to load dialogue');
      }
      const data: EntryDialogue = await response.json();
      setDialogue(data);
      setIsOpen(true);
    } catch {
      setError(locale === 'ko' ? '대화 예문을 불러올 수 없습니다' : 'Failed to load dialogue');
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, dialogue, locale, dialogueFilename]);

  // dialogue가 없으면 렌더링하지 않음
  if (!hasDialogue) {
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
        onClick={handleToggle}
        disabled={isLoading}
        className="w-full flex items-center justify-between gap-2 p-4 hover:bg-(--bg-tertiary) transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-(--accent-primary)" />
          <h3 className="text-base font-semibold text-(--text-primary)">{t('entryDialogue')}</h3>
        </div>
        {isLoading ? (
          <Loader2 size={18} className="text-(--text-tertiary) animate-spin" />
        ) : (
          <ChevronDown
            size={18}
            className={cn('text-(--text-tertiary) transition-transform', isOpen && 'rotate-180')}
          />
        )}
      </button>

      {/* Error state */}
      {error && (
        <div className="px-4 pb-4">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Dialogue content */}
      {isOpen && dialogue && (
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
