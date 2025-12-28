import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { koreanExpressions } from '@/data/generated/korean-expressions';
import { useI18n } from '@/i18n';

interface LinkedExampleProps {
  text: string;
  currentEntryId: string;
}

/**
 * Renders example text with deep links to other Korean expressions
 * Excludes links to the current entry being viewed
 */
export function LinkedExample({ text, currentEntryId }: LinkedExampleProps) {
  const { localePath } = useI18n();

  // Build linked parts
  const parts: ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    let matched = false;

    // Try to match any expression (longest first due to sorting)
    for (const expr of koreanExpressions) {
      // Skip current entry to avoid self-links
      if (expr.id === currentEntryId) continue;

      const index = remaining.indexOf(expr.korean);
      if (index === 0) {
        // Found at the start - add as link
        parts.push(
          <Link
            key={`link-${keyIndex++}`}
            to={localePath(`/entry/${expr.id}`)}
            className="text-(--accent-primary) underline decoration-dotted underline-offset-4 hover:decoration-solid"
          >
            {expr.korean}
          </Link>,
        );
        remaining = remaining.slice(expr.korean.length);
        matched = true;
        break;
      }
      if (index > 0) {
        // Found later - add text before it, then continue
        parts.push(<span key={`text-${keyIndex++}`}>{remaining.slice(0, index)}</span>);
        remaining = remaining.slice(index);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // No more matches - add remaining text
      parts.push(<span key={`text-${keyIndex++}`}>{remaining}</span>);
      break;
    }
  }

  return <>{parts}</>;
}
