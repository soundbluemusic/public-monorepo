import { useEffect } from 'react';

interface UseSidebarEffectsOptions {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 사이드바 부수 효과 관리 훅
 * - Escape 키로 닫기
 * - 모바일에서 열릴 때 body 스크롤 방지
 */
export function useSidebarEffects({ isOpen, onClose }: UseSidebarEffectsOptions) {
  // Escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open (mobile)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
}
