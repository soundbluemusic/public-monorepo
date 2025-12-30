import { Link } from 'react-router';

interface QuickCategoriesProps {
  locale: 'en' | 'ko';
  localePath: (path: string) => string;
}

const categories = [
  'Meta-frameworks',
  'Build Tools',
  'State Management',
  'UI Components',
  'Testing',
  'Animation',
];

export function QuickCategories({ locale, localePath }: QuickCategoriesProps) {
  return (
    <div className="py-8 text-center">
      <h3 className="text-sm font-medium text-(--text-tertiary) uppercase tracking-wider mb-4">
        {locale === 'ko' ? '카테고리로 탐색' : 'Browse by Category'}
      </h3>
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`${localePath('/libraries')}?category=${encodeURIComponent(cat)}`}
            className="px-4 py-2 rounded-full bg-(--bg-tertiary) text-(--text-secondary) text-sm font-medium no-underline transition-colors hover:bg-(--accent-primary)/10 hover:text-(--accent-primary)"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
}
