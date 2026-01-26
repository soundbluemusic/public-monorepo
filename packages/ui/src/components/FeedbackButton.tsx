/**
 * @fileoverview 피드백 버튼 컴포넌트
 * "이 페이지가 도움이 되었나요?" 형태의 피드백 수집
 * @environment client-only
 */

import { Check, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { cn } from '../utils/cn';

export type FeedbackType = 'positive' | 'negative' | null;

export interface FeedbackButtonProps {
  /** 페이지/콘텐츠 ID */
  contentId?: string;
  /** 피드백 제출 콜백 */
  onFeedback?: (type: FeedbackType, comment?: string) => void;
  /** 질문 텍스트 */
  question?: string;
  /** 긍정 라벨 */
  positiveLabel?: string;
  /** 부정 라벨 */
  negativeLabel?: string;
  /** 감사 메시지 */
  thankYouMessage?: string;
  /** 코멘트 입력 허용 */
  allowComment?: boolean;
  /** 코멘트 플레이스홀더 */
  commentPlaceholder?: string;
  /** 변형 스타일 */
  variant?: 'default' | 'compact' | 'inline';
  /** 추가 클래스 */
  className?: string;
}

const variantStyles = {
  default: 'p-4 rounded-lg bg-(--bg-secondary) border border-(--border-primary)',
  compact: 'p-3 rounded-lg bg-(--bg-tertiary)',
  inline: 'flex items-center gap-3',
};

/**
 * 피드백 버튼 컴포넌트
 *
 * @example
 * ```tsx
 * <FeedbackButton
 *   contentId="article-123"
 *   onFeedback={(type, comment) => {
 *     analytics.track('feedback', { type, comment });
 *   }}
 * />
 * ```
 */
export const FeedbackButton = memo(function FeedbackButton({
  contentId,
  onFeedback,
  question = 'Was this page helpful?',
  positiveLabel = 'Yes',
  negativeLabel = 'No',
  thankYouMessage = 'Thanks for your feedback!',
  allowComment = true,
  commentPlaceholder = 'Tell us more (optional)...',
  variant = 'default',
  className,
}: FeedbackButtonProps) {
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = useCallback(
    (type: FeedbackType) => {
      setFeedback(type);

      if (type === 'negative' && allowComment) {
        setShowComment(true);
      } else {
        onFeedback?.(type);
        setSubmitted(true);
      }
    },
    [allowComment, onFeedback],
  );

  const handleSubmitComment = useCallback(() => {
    onFeedback?.(feedback, comment || undefined);
    setSubmitted(true);
    setShowComment(false);
  }, [feedback, comment, onFeedback]);

  const handleSkipComment = useCallback(() => {
    onFeedback?.(feedback);
    setSubmitted(true);
    setShowComment(false);
  }, [feedback, onFeedback]);

  // 제출 완료 상태
  if (submitted) {
    return (
      <div
        className={cn(variantStyles[variant], 'text-center', className)}
        data-content-id={contentId}
      >
        <div className="flex items-center justify-center gap-2 text-(--text-secondary)">
          <Check size={18} className="text-green-500" aria-hidden="true" />
          <span className="text-sm">{thankYouMessage}</span>
        </div>
      </div>
    );
  }

  // 코멘트 입력 상태
  if (showComment) {
    return (
      <div className={cn(variantStyles[variant], className)} data-content-id={contentId}>
        <div className="space-y-3">
          <p className="text-sm text-(--text-secondary)">
            {variant === 'inline' ? 'Feedback:' : 'What could be improved?'}
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={commentPlaceholder}
            className={cn(
              'w-full px-3 py-2 rounded-lg text-sm resize-none',
              'bg-(--bg-primary) border border-(--border-primary)',
              'text-(--text-primary) placeholder:text-(--text-tertiary)',
              'focus:outline-none focus:ring-2 focus:ring-(--accent-primary)',
            )}
            rows={3}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmitComment}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                'bg-(--accent-primary) text-white hover:bg-(--accent-primary)/90',
              )}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleSkipComment}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                'text-(--text-secondary) hover:bg-(--bg-tertiary)',
              )}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 기본 상태 (투표 버튼)
  return (
    <div className={cn(variantStyles[variant], className)} data-content-id={contentId}>
      {variant === 'inline' ? (
        <>
          <span className="text-sm text-(--text-secondary)">{question}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleFeedback('positive')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                'text-(--text-tertiary) hover:text-green-500 hover:bg-(--bg-tertiary)',
                feedback === 'positive' && 'text-green-500 bg-(--bg-tertiary)',
              )}
              aria-label={positiveLabel}
              title={positiveLabel}
            >
              <ThumbsUp size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => handleFeedback('negative')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                'text-(--text-tertiary) hover:text-red-500 hover:bg-(--bg-tertiary)',
                feedback === 'negative' && 'text-red-500 bg-(--bg-tertiary)',
              )}
              aria-label={negativeLabel}
              title={negativeLabel}
            >
              <ThumbsDown size={18} aria-hidden="true" />
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium text-(--text-primary)">{question}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleFeedback('positive')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
                'text-sm font-medium transition-colors',
                'border border-(--border-primary)',
                feedback === 'positive'
                  ? 'bg-green-500/10 border-green-500 text-green-600'
                  : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
              )}
            >
              <ThumbsUp size={16} aria-hidden="true" />
              <span>{positiveLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => handleFeedback('negative')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
                'text-sm font-medium transition-colors',
                'border border-(--border-primary)',
                feedback === 'negative'
                  ? 'bg-red-500/10 border-red-500 text-red-600'
                  : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
              )}
            >
              <ThumbsDown size={16} aria-hidden="true" />
              <span>{negativeLabel}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

/**
 * 고정 위치 피드백 버튼 (화면 모서리)
 */
export interface FloatingFeedbackProps {
  /** 페이지 ID */
  pageId?: string;
  /** 피드백 제출 URL 또는 콜백 */
  onFeedback?: (data: { pageId?: string; rating?: number; comment?: string }) => void;
  /** 위치 */
  position?: 'bottom-right' | 'bottom-left';
  /** 추가 클래스 */
  className?: string;
}

export const FloatingFeedback = memo(function FloatingFeedback({
  pageId,
  onFeedback,
  position = 'bottom-right',
  className,
}: FloatingFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    onFeedback?.({
      pageId,
      rating: rating ?? undefined,
      comment: comment || undefined,
    });
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setRating(null);
      setComment('');
    }, 2000);
  }, [pageId, rating, comment, onFeedback]);

  const positionStyles = {
    'bottom-right': 'bottom-24 lg:bottom-8 right-4',
    'bottom-left': 'bottom-24 lg:bottom-8 left-4',
  };

  return (
    <div className={cn('fixed z-40', positionStyles[position], className)}>
      {/* 펼쳐진 폼 */}
      {isOpen && (
        <div
          className={cn(
            'mb-3 w-72 p-4 rounded-xl shadow-lg',
            'bg-(--bg-elevated) border border-(--border-primary)',
            'animate-in slide-in-from-bottom-2 fade-in duration-200',
          )}
        >
          {submitted ? (
            <div className="flex items-center justify-center gap-2 py-4 text-(--text-secondary)">
              <Check size={20} className="text-green-500" aria-hidden="true" />
              <span>Thanks!</span>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-(--text-primary)">
                How would you rate this page?
              </p>

              {/* 별점 */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={cn(
                      'p-1 transition-colors',
                      rating && rating >= star
                        ? 'text-yellow-500'
                        : 'text-(--text-tertiary) hover:text-yellow-400',
                    )}
                    aria-label={`${star} stars`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill={rating && rating >= star ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      role="img"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                ))}
              </div>

              {/* 코멘트 */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Any suggestions? (optional)"
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm resize-none',
                  'bg-(--bg-primary) border border-(--border-primary)',
                  'text-(--text-primary) placeholder:text-(--text-tertiary)',
                  'focus:outline-none focus:ring-2 focus:ring-(--accent-primary)',
                )}
                rows={2}
              />

              <button
                type="button"
                onClick={handleSubmit}
                disabled={rating === null}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  rating !== null
                    ? 'bg-(--accent-primary) text-white hover:bg-(--accent-primary)/90'
                    : 'bg-(--bg-tertiary) text-(--text-tertiary) cursor-not-allowed',
                )}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}

      {/* 트리거 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-full shadow-lg',
          'bg-(--accent-primary) text-white',
          'hover:bg-(--accent-primary)/90 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-(--accent-primary) focus:ring-offset-2',
        )}
        aria-label="Give feedback"
        aria-expanded={isOpen}
      >
        <MessageSquare size={20} aria-hidden="true" />
      </button>
    </div>
  );
});
