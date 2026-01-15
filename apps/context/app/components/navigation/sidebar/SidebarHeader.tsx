interface SidebarHeaderProps {
  menuLabel: string;
}

/**
 * 사이드바 모바일 헤더
 * 모바일에서만 표시되며 메뉴 제목 포함
 * 닫기 버튼은 하단 SidebarFooter로 이동 (UX 개선: 열기/닫기 버튼 위치 일관성)
 */
export function SidebarHeader({ menuLabel }: SidebarHeaderProps) {
  return (
    <div className="md:hidden h-14 flex items-center px-4 shrink-0 border-b border-(--border-primary)">
      <span className="font-semibold text-(--text-primary)">{menuLabel}</span>
    </div>
  );
}
