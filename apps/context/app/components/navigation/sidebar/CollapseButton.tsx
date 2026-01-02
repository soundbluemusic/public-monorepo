import { cn } from '@soundblue/ui/utils';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface CollapseButtonProps {
  isCollapsed: boolean;
  expandLabel: string;
  collapseLabel: string;
  onToggle: () => void;
}

/**
 * 사이드바 접기/펼치기 버튼
 * 데스크톱에서만 표시
 */
export function CollapseButton({
  isCollapsed,
  expandLabel,
  collapseLabel,
  onToggle,
}: CollapseButtonProps) {
  const label = isCollapsed ? expandLabel : collapseLabel;
  const buttonLabel = isCollapsed ? expandLabel.split(' ')[0] : collapseLabel.split(' ')[0]; // "Expand" or "Collapse"

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'hidden md:flex w-full items-center gap-2 min-h-11 px-3 py-2 rounded-lg',
        'text-(--text-secondary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer',
        // Collapsed: 패딩 제거하고 중앙 정렬 (56px 사이드바에서 아이콘 표시용)
        isCollapsed && 'justify-center px-0',
      )}
      title={label}
      aria-label={label}
    >
      {isCollapsed ? (
        <PanelLeftOpen size={18} aria-hidden="true" />
      ) : (
        <PanelLeftClose size={18} aria-hidden="true" />
      )}
      <span className={cn(isCollapsed && 'md:hidden')}>{buttonLabel}</span>
    </button>
  );
}
