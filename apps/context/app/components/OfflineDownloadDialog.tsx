/**
 * 오프라인 다운로드 확인 다이얼로그
 *
 * 사용자가 오프라인 모드를 활성화할 때 표시되는 확인 팝업입니다.
 */

import type { DownloadProgress } from '@soundblue/platform/sqlite/types';
import { cn } from '@soundblue/ui/utils';
import { AlertTriangle, Download, Wifi, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n';

interface OfflineDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entriesCount: number;
  isDownloading: boolean;
  progress: DownloadProgress | null;
  error: string | null;
}

export function OfflineDownloadDialog({
  isOpen,
  onClose,
  onConfirm,
  entriesCount,
  isDownloading,
  progress,
  error,
}: OfflineDownloadDialogProps) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // 다이얼로그 열기/닫기
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (isOpen) {
      dialog.showModal();
      setIsClosing(false);
      return undefined;
    }

    if (dialog.open) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        dialog.close();
        setIsClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isOpen]);

  // ESC 키로 닫기 방지 (다운로드 중일 때)
  const handleCancel = useCallback(
    (e: Event) => {
      if (isDownloading) {
        e.preventDefault();
      }
    },
    [isDownloading],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [handleCancel]);

  // 배경 클릭으로 닫기
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === dialogRef.current && !isDownloading) {
        onClose();
      }
    },
    [isDownloading, onClose],
  );

  const progressPercent = progress?.percent ?? 0;

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'fixed inset-0 m-auto p-0 bg-transparent backdrop:bg-black/50',
        'max-w-md w-[calc(100%-2rem)]',
        isClosing ? 'animate-fade-out' : 'animate-fade-in',
      )}
      onClick={handleBackdropClick}
    >
      <div className="bg-(--bg-primary) rounded-2xl border border-(--border-primary) shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-(--border-secondary)">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-(--accent-primary)/10 rounded-xl">
              <Download size={24} className="text-(--accent-primary)" />
            </div>
            <h2 className="text-lg font-semibold text-(--text-primary)">
              {t('offlineDownloadTitle')}
            </h2>
          </div>
          {!isDownloading && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-(--bg-tertiary) transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-(--text-tertiary)" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {error ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
              <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : isDownloading ? (
            <div className="space-y-4">
              <p className="text-(--text-secondary)">{t('offlineDownloading')}</p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-3 bg-(--bg-tertiary) rounded-full overflow-hidden">
                  <div
                    className="h-full bg-(--accent-primary) transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-(--text-tertiary)">
                  <span>
                    {progress?.phase === 'fetching' && 'Downloading...'}
                    {progress?.phase === 'parsing' && 'Processing...'}
                    {progress?.phase === 'storing' && 'Saving...'}
                    {progress?.phase === 'complete' && 'Complete!'}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-(--text-secondary) mb-6">{t('offlineDownloadMessage')}</p>

              {/* Info Cards */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-(--bg-tertiary)">
                  <Download size={18} className="text-(--accent-primary)" />
                  <span className="text-sm text-(--text-primary)">
                    {t('offlineDownloadDetails', { count: entriesCount.toLocaleString() })}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-(--bg-tertiary)">
                  <Wifi size={18} className="text-(--accent-primary)" />
                  <span className="text-sm text-(--text-primary)">{t('offlineDownloadWifi')}</span>
                </div>

                <p className="text-xs text-(--text-tertiary) text-center mt-4">
                  {t('offlineDownloadSize')}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-(--border-secondary)">
          {error ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl font-medium transition-colors bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)"
              >
                {t('offlineDownloadCancel')}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 px-4 py-3 rounded-xl font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110"
              >
                {t('offlineDownloadConfirm')}
              </button>
            </>
          ) : isDownloading ? (
            <div className="flex-1 text-center text-sm text-(--text-tertiary)">
              {t('offlineDownloading')}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl font-medium transition-colors bg-(--bg-tertiary) text-(--text-secondary) hover:bg-(--bg-elevated)"
              >
                {t('offlineDownloadCancel')}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 px-4 py-3 rounded-xl font-medium transition-colors bg-(--accent-primary) text-white hover:brightness-110"
              >
                {t('offlineDownloadConfirm')}
              </button>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
