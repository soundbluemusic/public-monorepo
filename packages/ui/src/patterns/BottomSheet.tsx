/**
 * @fileoverview BottomSheet Component
 * @environment client-only
 *
 * 모바일 친화적 바텀 시트 패턴.
 * 반만 올라옴 → 드래그로 풀스크린 → 아래로 드래그하면 닫힘.
 *
 * @example
 * <BottomSheet isOpen={isOpen} onClose={close} title="검색">
 *   <SearchResults />
 * </BottomSheet>
 */
import type * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ isOpen, onClose, title, children, className }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 열기/닫기 애니메이션 관리
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      return;
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return;
  }, [isOpen]);

  // 포커스 트랩: 열릴 때 시트 내부로 포커스 이동
  useEffect(() => {
    if (!isOpen || !sheetRef.current) return;
    const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstFocusable = focusable[0];
    if (firstFocusable) {
      requestAnimationFrame(() => firstFocusable.focus());
    }
    return;
  }, [isOpen]);

  const handleDragStart = useCallback((clientY: number) => {
    dragStartY.current = clientY;
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDragging) return;
      const delta = clientY - dragStartY.current;
      // 아래로만 드래그 가능
      setDragOffset(Math.max(0, delta));
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    // 100px 이상 아래로 드래그하면 닫기
    if (dragOffset > 100) {
      onClose();
    }
    setDragOffset(0);
  }, [dragOffset, onClose]);

  // 터치 이벤트
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch) handleDragStart(touch.clientY);
    },
    [handleDragStart],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch) handleDragMove(touch.clientY);
    },
    [handleDragMove],
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  if (!shouldRender) return null;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Modal overlay click-to-close, role="presentation" + Escape key handler in inner dialog cover keyboard a11y
    <div
      className={cn(
        'fixed inset-0 z-[var(--z-index-modal,60)] transition-colors duration-300',
        isVisible ? 'bg-black/40' : 'bg-black/0',
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={sheetRef}
        className={cn(
          'fixed bottom-0 left-0 right-0 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] flex flex-col bg-(--bg-elevated)',
          isVisible && dragOffset === 0 ? 'translate-y-0' : '',
          !isVisible && 'translate-y-full',
          className,
        )}
        style={{
          transform: isDragging ? `translateY(${dragOffset}px)` : undefined,
          transition: isDragging ? 'none' : undefined,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* 드래그 핸들 */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: Touch-only drag-to-dismiss, keyboard close handled by ARIA dialog Escape key */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onMouseMove={(e) => handleDragMove(e.clientY)}
          onMouseUp={handleDragEnd}
          onMouseLeave={() => {
            if (isDragging) handleDragEnd();
          }}
        >
          <div className="w-10 h-1 rounded-full bg-(--border-primary)" />
        </div>

        {/* 제목 */}
        {title && (
          <div className="px-4 pb-3 border-b border-(--border-primary)">
            <h2 className="text-base font-semibold text-(--text-primary)">{title}</h2>
          </div>
        )}

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>
      </div>
    </div>
  );
}
