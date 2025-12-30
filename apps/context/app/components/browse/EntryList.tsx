import { useAutoAnimate } from '@soundblue/ui/hooks';
import { EntryListItem } from '@/components/entry/EntryListItem';
import type { categories } from '@/data/categories';
import type { LightEntry } from '@/data/entries';

interface EntryListProps {
  locale: 'en' | 'ko';
  localePath: (path: string) => string;
  entries: LightEntry[];
  categories: typeof categories;
  studiedIds: Set<string>;
  favoriteIds: Set<string>;
}

export function EntryList({
  locale,
  localePath,
  entries,
  categories: cats,
  studiedIds,
  favoriteIds,
}: EntryListProps) {
  const [listRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <div ref={listRef} className="flex flex-col gap-1">
      {entries.map((entry) => {
        const translation = entry.word[locale];
        const isStudied = studiedIds.has(entry.id);
        const isFavorite = favoriteIds.has(entry.id);
        const category = cats.find((c) => c.id === entry.categoryId);

        return (
          <EntryListItem
            key={entry.id}
            entryId={entry.id}
            korean={entry.korean}
            romanization={entry.romanization}
            translation={translation}
            isStudied={isStudied}
            isFavorite={isFavorite}
            category={category}
            locale={locale}
            localePath={localePath}
          />
        );
      })}
    </div>
  );
}
