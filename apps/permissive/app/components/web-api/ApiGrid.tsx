import { useAutoAnimate } from '@soundblue/ui/hooks';
import type { WebAPI } from '../../data/web-apis';
import { ApiCard } from './ApiCard';

interface ApiGridProps {
  locale: 'en' | 'ko';
  groupedApis: Record<string, WebAPI[]>;
}

export function ApiGrid({ locale, groupedApis }: ApiGridProps) {
  const [apiGridRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <div ref={apiGridRef} className="space-y-8">
      {Object.entries(groupedApis).map(([categoryName, categoryApis]) => (
        <section key={categoryName}>
          <h2 className="text-lg font-semibold text-(--text-primary) mb-4">{categoryName}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryApis.map((api) => (
              <ApiCard key={api.name} api={api} locale={locale} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
