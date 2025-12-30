interface ActiveTagDisplayProps {
  locale: 'en' | 'ko';
  selectedTag: string;
  onClear: () => void;
}

export function ActiveTagDisplay({ locale, selectedTag, onClear }: ActiveTagDisplayProps) {
  return (
    <div className="mb-4">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--accent-primary)/10 text-(--accent-primary)">
        <span className="text-sm">{locale === 'ko' ? '태그:' : 'Tag:'}</span>
        <span className="text-sm font-medium">{selectedTag}</span>
        <button type="button" onClick={onClear} className="ml-1 hover:opacity-70 cursor-pointer">
          ×
        </button>
      </div>
    </div>
  );
}
