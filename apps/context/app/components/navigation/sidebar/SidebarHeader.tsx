import { X } from 'lucide-react';

interface SidebarHeaderProps {
  menuLabel: string;
  closeLabel: string;
  onClose: () => void;
}

/**
 * 사이드바 모바일 헤더
 * 모바일에서만 표시되며 메뉴 제목과 닫기 버튼 포함
 */
export function SidebarHeader({ menuLabel, closeLabel, onClose }: SidebarHeaderProps) {
  return (
    <div className="md:hidden h-14 flex items-center justify-between px-4 shrink-0 border-b border-(--border-primary)">
      <span className="font-semibold text-(--text-primary)">{menuLabel}</span>
      <button
        type="button"
        onClick={onClose}
        className="min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors hover:bg-(--bg-tertiary)"
        aria-label={closeLabel}
      >
        <X size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
