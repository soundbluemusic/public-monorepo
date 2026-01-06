import { Calendar } from 'lucide-react';
import { Link } from 'react-router';
import type { LightEntry } from '@/data/entries';

interface EntryListProps {
  entries: LightEntry[];
  locale: 'en' | 'ko';
  localePath: (path: string) => string;
  title: string;
  showIcon?: boolean;
}

export function EntryList({
  entries,
  locale,
  localePath,
  title,
  showIcon = false,
}: EntryListProps) {
  if (entries.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
        {showIcon && <Calendar size={20} />}
        {title}
      </h2>
      <div className="space-y-1">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            to={localePath(`/entry/${entry.id}`)}
            className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg border-b border-(--border-primary) transition-colors no-underline hover:bg-(--bg-tertiary)"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium text-(--text-primary)">{entry.korean}</span>
              <span className="text-sm text-(--text-tertiary)">{entry.romanization}</span>
            </div>
            <span className="text-sm text-(--text-secondary)">{entry.word[locale]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
