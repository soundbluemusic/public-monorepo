/**
 * @fileoverview 사이드바 섹션 컴포넌트
 * 카테고리, Quick Links 등의 섹션을 렌더링
 */

import type { ReactNode } from 'react';

export interface SidebarSectionProps {
  /** 섹션 제목 */
  title: string;
  /** 섹션 내용 */
  children: ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="mt-6 pt-4 border-t border-(--border-primary)">
      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-(--text-tertiary) m-0 px-3">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}
