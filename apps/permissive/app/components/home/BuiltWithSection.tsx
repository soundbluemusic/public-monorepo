interface BuiltWithSectionProps {
  locale: 'en' | 'ko';
}

const tools = ['React Router v7', 'React', 'Tailwind CSS', 'TypeScript', 'Vite'];

export function BuiltWithSection({ locale }: BuiltWithSectionProps) {
  return (
    <div className="py-8 text-center border-t border-(--border-primary)">
      <p className="text-sm text-(--text-tertiary) mb-3">
        {locale === 'ko'
          ? '이 사이트도 여기 있는 도구로 만들었어요'
          : 'This site is built with tools listed here'}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {tools.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full bg-(--bg-tertiary) text-(--text-secondary) text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
