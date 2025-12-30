import { useAutoAnimate } from '@soundblue/ui/hooks';
import type { Library } from '../../data/libraries';
import { LibraryCard } from './LibraryCard';

interface LibraryGridProps {
  locale: 'en' | 'ko';
  groupedLibraries: Record<string, Library[]>;
  selectedTag: string | null;
  onTagClick: (tag: string) => void;
}

export function LibraryGrid({
  locale,
  groupedLibraries,
  selectedTag,
  onTagClick,
}: LibraryGridProps) {
  const [libraryGridRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <div ref={libraryGridRef} className="space-y-8">
      {Object.entries(groupedLibraries).map(([categoryName, categoryLibs]) => (
        <section key={categoryName}>
          <h2 className="text-lg font-semibold text-(--text-primary) mb-4">{categoryName}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryLibs.map((lib) => (
              <LibraryCard
                key={lib.name}
                library={lib}
                locale={locale}
                selectedTag={selectedTag}
                onTagClick={onTagClick}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
