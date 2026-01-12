import { Flame } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router';
import { getWebApiSlug, type WebAPI } from '../../data/web-apis';
import { useI18n } from '../../i18n';

interface ApiCardProps {
  api: WebAPI;
  locale: 'en' | 'ko';
}

export const ApiCard = memo(function ApiCard({ api, locale }: ApiCardProps) {
  const { localePath } = useI18n();

  return (
    <Link
      to={localePath(`/web-api/${getWebApiSlug(api.name)}`)}
      className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary) no-underline transition-all hover:border-(--border-focus) hover:shadow-sm group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-(--text-primary)">{api.name}</h3>
          {api.trending && (
            <span className="p-1 rounded bg-orange-500/10 text-orange-500">
              <Flame size={14} aria-hidden="true" />
            </span>
          )}
        </div>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-600">
          {api.support}
        </span>
      </div>
      <p className="text-sm text-(--text-secondary) mb-2 line-clamp-2">
        {locale === 'ko' ? api.descriptionKo : api.description}
      </p>
      {api.yearStable && <p className="text-xs text-(--text-tertiary)">Since {api.yearStable}</p>}
    </Link>
  );
});
