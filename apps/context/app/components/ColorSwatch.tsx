/**
 * @fileoverview 색상 미리보기 컴포넌트
 *
 * colors 카테고리의 엔트리에 대해 실제 색상을 시각적으로 표시합니다.
 * hex 코드 복사 기능을 포함합니다.
 */

import { toast } from '@soundblue/features/toast';
import { cn } from '@soundblue/ui/utils';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/i18n';

interface ColorSwatchProps {
  /** hex 색상 코드 (예: "#FF0000") */
  colorCode: string;
  /** 색상 이름 (영어) */
  colorName?: string;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 색상의 밝기를 계산하여 텍스트 색상 결정
 * @param hex - hex 색상 코드
 * @returns true이면 어두운 색 (밝은 텍스트 필요)
 */
function isDarkColor(hex: string): boolean {
  // hex를 RGB로 변환
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);

  // 밝기 계산 (YIQ 공식)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
}

export function ColorSwatch({ colorCode, colorName, className }: ColorSwatchProps) {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);
  const isDark = isDarkColor(colorCode);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(colorCode);
      setCopied(true);
      toast({
        message: locale === 'ko' ? '색상 코드가 복사되었습니다' : 'Color code copied',
        type: 'success',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        message: locale === 'ko' ? '복사에 실패했습니다' : 'Failed to copy',
        type: 'error',
      });
    }
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* 색상 박스 */}
      <div
        className="w-16 h-16 rounded-xl shadow-md border border-(--border-primary) flex items-center justify-center transition-transform hover:scale-105"
        style={{ backgroundColor: colorCode }}
        title={colorName || colorCode}
      >
        {/* 체커보드 패턴 (투명색 표시용) */}
        {colorCode.toLowerCase() === '#ffffff' && (
          <div className="w-full h-full rounded-xl border-2 border-dashed border-gray-300" />
        )}
      </div>

      {/* 색상 정보 */}
      <div className="flex flex-col gap-1">
        {colorName && (
          <span className="text-sm font-medium text-(--text-secondary)">{colorName}</span>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono transition-colors',
            'bg-(--bg-elevated) border border-(--border-primary) hover:bg-(--bg-tertiary)',
            'text-(--text-primary)',
          )}
          title={locale === 'ko' ? '클릭하여 복사' : 'Click to copy'}
        >
          <span>{colorCode}</span>
          {copied ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <Copy size={14} className="text-(--text-tertiary)" />
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * 색상 카테고리 여부 확인
 */
export function isColorEntry(categoryId: string): boolean {
  return categoryId === 'colors';
}
