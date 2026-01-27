import { cn } from '@soundblue/ui/utils';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Languages, Loader2 } from 'lucide-react';
import { getCategoryById, getCategoryColor } from '@/data/categories';
import { useHomonyms } from '@/hooks';
import { useI18n } from '@/i18n';

interface HomonymSectionProps {
  /** 현재 단어의 한글 */
  korean: string;
  /** 현재 엔트리 ID (목록에서 제외) */
  currentId: string;
  className?: string;
}

/**
 * 다의어 섹션 컴포넌트
 *
 * 같은 한글(korean)을 가진 다른 의미의 단어들을 표시합니다.
 * 예: "배" → ship, pear, belly
 *
 * TanStack Query를 사용하여 D1에서 동음이의어를 조회합니다.
 *
 * @example
 * ```tsx
 * <HomonymSection korean="배" currentId="d-foo-bae" />
 * ```
 */
export function HomonymSection({ korean, currentId, className }: HomonymSectionProps) {
  const { locale, localePath, t } = useI18n();

  // TanStack Query를 사용한 다의어 조회 (현재 항목 제외)
  const { data: homonyms = [], isLoading } = useHomonyms(korean, currentId);

  // 로딩 중이면 스켈레톤 표시
  if (isLoading) {
    return (
      <section
        className={cn(
          'rounded-xl bg-(--bg-elevated) border border-(--border-primary) overflow-hidden',
          className,
        )}
      >
        <div className="flex items-center gap-2 p-4">
          <Loader2 size={18} className="text-(--accent-primary) animate-spin" />
          <span className="text-sm text-(--text-tertiary)">{t('loading')}</span>
        </div>
      </section>
    );
  }

  // 다의어가 없으면 렌더링하지 않음
  if (homonyms.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        'rounded-xl bg-(--bg-elevated) border border-(--border-primary) overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-(--border-secondary)">
        <Languages size={18} className="text-(--accent-primary)" />
        <h3 className="text-base font-semibold text-(--text-primary)">{t('homonyms')}</h3>
        <span className="text-xs text-(--text-tertiary) ml-auto">{t('homonymsDescription')}</span>
      </div>

      {/* Homonym list */}
      <div className="divide-y divide-(--border-secondary)">
        {homonyms.map((homonym) => (
          <HomonymItem key={homonym.id} homonym={homonym} locale={locale} localePath={localePath} />
        ))}
      </div>
    </section>
  );
}

/** D1에서 조회된 동음이의어 타입 */
interface HomonymEntry {
  id: string;
  korean: string;
  romanization: string;
  categoryId: string;
  word: { ko: string; en: string };
}

interface HomonymItemProps {
  homonym: HomonymEntry;
  locale: 'ko' | 'en';
  localePath: (path: string) => string;
}

function HomonymItem({ homonym, locale, localePath }: HomonymItemProps) {
  const category = getCategoryById(homonym.categoryId);
  const categoryName = category?.name[locale] ?? homonym.categoryId;
  const categoryColor = category?.color ?? 'blue';

  return (
    <Link
      to={localePath(`/entry/${homonym.id}`)}
      className="flex items-center gap-3 p-4 hover:bg-(--bg-tertiary) transition-colors group"
    >
      {/* Meaning */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-(--text-primary) truncate">{homonym.word[locale]}</p>
        <p className="text-xs text-(--text-tertiary) truncate">
          {locale === 'ko' ? homonym.word.en : homonym.word.ko}
        </p>
      </div>

      {/* Category badge */}
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0',
          getCategoryColor(categoryColor),
        )}
      >
        {categoryName}
      </span>

      {/* Arrow */}
      <ArrowRight
        size={16}
        className="text-(--text-tertiary) group-hover:text-(--accent-primary) transition-colors shrink-0"
      />
    </Link>
  );
}
