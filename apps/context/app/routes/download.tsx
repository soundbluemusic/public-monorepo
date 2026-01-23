/**
 * @fileoverview 다운로드 페이지 - 영어 버전 (TanStack Start)
 */

import { toast } from '@soundblue/features/toast';
import type { DownloadProgress } from '@soundblue/platform/sqlite/types';
import { headFactory } from '@soundblue/seo/meta';
import { cn } from '@soundblue/ui/utils';
import { createFileRoute } from '@tanstack/react-router';
import {
  Archive,
  BookOpen,
  Check,
  CheckCircle,
  Code,
  Copy,
  Download,
  ExternalLink,
  FileJson,
  MessageSquare,
  RefreshCw,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Layout } from '@/components/layout';
import { OfflineDownloadDialog } from '@/components/OfflineDownloadDialog';
import { APP_CONFIG } from '@/config';
import { categories } from '@/data/categories';
import { conversations } from '@/data/conversations';
import { jsonEntriesCount } from '@/data/entries';
import { useI18n } from '@/i18n';
import {
  checkOfflineDBUpdate,
  clearOfflineDB,
  downloadOfflineDB,
  getOfflineDBMeta,
  getOfflineDBStatus,
} from '@/services/offline-db';

interface LoaderData {
  stats: {
    totalEntries: number;
    totalCategories: number;
    totalConversations: number;
  };
}

const GITHUB_RAW_BASE =
  'https://raw.githubusercontent.com/soundbluemusic/public-monorepo/main/data/context';
const GITHUB_BROWSER_BASE =
  'https://github.com/soundbluemusic/public-monorepo/tree/main/data/context';
const ZIP_DOWNLOAD_URL = `${GITHUB_RAW_BASE}/context-data.zip`;

type DownloadType = 'entries' | 'conversations' | 'meta';

interface DownloadItem {
  type: DownloadType;
  icon: typeof FileJson;
  labelKey: 'downloadEntries' | 'downloadConversations' | 'downloadMeta';
  descKey: 'downloadEntriesDesc' | 'downloadConversationsDesc' | 'downloadMetaDesc';
  getUrl: () => string;
  isExternal?: boolean;
}

export const Route = createFileRoute('/download')({
  loader: async (): Promise<LoaderData> => {
    return {
      stats: {
        totalEntries: jsonEntriesCount,
        totalCategories: categories.length,
        totalConversations: conversations.length,
      },
    };
  },
  // @ts-expect-error - TanStack Start head function type incompatibility
  head: headFactory(
    {
      ko: {
        title: '어휘 다운로드 - Context',
        description: '모든 한국어 어휘 매핑을 다운로드하세요',
      },
      en: {
        title: 'Download Vocabulary - Context',
        description: 'Download all Korean vocabulary mappings',
      },
    },
    APP_CONFIG.baseUrl,
  ),
  component: DownloadPage,
});

function DownloadPage() {
  const { stats } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [offlineStatus, setOfflineStatus] = useState<'not-downloaded' | 'ready' | 'checking'>(
    'checking',
  );
  const [offlineDate, setOfflineDate] = useState<string | null>(null);
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    async function checkOfflineStatus() {
      try {
        const status = getOfflineDBStatus();
        if (status === 'ready') {
          setOfflineStatus('ready');
          const meta = await getOfflineDBMeta();
          if (meta) {
            const date = new Date(meta.downloadedAt);
            setOfflineDate(date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US'));
          }
          const updateCheck = await checkOfflineDBUpdate();
          setHasUpdate(updateCheck.hasUpdate);
        } else {
          setOfflineStatus('not-downloaded');
        }
      } catch {
        setOfflineStatus('not-downloaded');
      }
    }
    checkOfflineStatus();
  }, [locale]);

  const handleOfflineDownload = useCallback(async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      await downloadOfflineDB((progress) => {
        setDownloadProgress(progress);
      });

      setOfflineStatus('ready');
      setShowOfflineDialog(false);
      setHasUpdate(false);

      const meta = await getOfflineDBMeta();
      if (meta) {
        const date = new Date(meta.downloadedAt);
        setOfflineDate(date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US'));
      }

      toast({
        message: t('offlineDownloadComplete'),
        type: 'success',
      });
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : t('offlineDownloadError'));
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  }, [locale, t]);

  const handleDeleteOffline = useCallback(async () => {
    if (!confirm(t('offlineDeleteConfirm'))) return;

    try {
      await clearOfflineDB();
      setOfflineStatus('not-downloaded');
      setOfflineDate(null);
      setHasUpdate(false);
      toast({
        message: t('toast.offlineDataDeleted'),
        type: 'success',
      });
    } catch {
      toast({
        message: t('toast.deleteFailed'),
        type: 'error',
      });
    }
  }, [t]);

  const downloadItems: DownloadItem[] = [
    {
      type: 'entries',
      icon: BookOpen,
      labelKey: 'downloadEntries',
      descKey: 'downloadEntriesDesc',
      getUrl: () => `${GITHUB_BROWSER_BASE}/entries`,
      isExternal: true,
    },
    {
      type: 'conversations',
      icon: MessageSquare,
      labelKey: 'downloadConversations',
      descKey: 'downloadConversationsDesc',
      getUrl: () => `${GITHUB_RAW_BASE}/conversations.json`,
    },
    {
      type: 'meta',
      icon: FileJson,
      labelKey: 'downloadMeta',
      descKey: 'downloadMetaDesc',
      getUrl: () => `${GITHUB_RAW_BASE}/meta.json`,
    },
  ];

  const handleCopyUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  }, []);

  const handleOpenGitHub = useCallback(() => {
    window.open(
      'https://github.com/soundbluemusic/public-monorepo/tree/main/data/context',
      '_blank',
      'noopener,noreferrer',
    );
  }, []);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-2">
            {t('downloadTitle')}
          </h1>
          <p className="text-(--text-secondary)">{t('downloadDescription')}</p>
        </div>

        <div className="mb-8 p-4 bg-(--bg-secondary) rounded-xl border border-(--border-primary)">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-(--accent-primary)/10 rounded-lg">
              <Download size={24} className="text-(--accent-primary)" />
            </div>
            <div>
              <p className="text-lg font-semibold text-(--text-primary)">
                {t('downloadDataOverview')}
              </p>
              <p className="text-sm text-(--text-tertiary)">{t('downloadAllMappings')}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-(--bg-tertiary) rounded-lg">
              <p className="text-2xl font-bold text-(--accent-primary)">
                {stats.totalEntries.toLocaleString()}
              </p>
              <p className="text-xs text-(--text-tertiary) mt-1">{t('words')}</p>
            </div>
            <div className="text-center p-3 bg-(--bg-tertiary) rounded-lg">
              <p className="text-2xl font-bold text-(--accent-primary)">{stats.totalCategories}</p>
              <p className="text-xs text-(--text-tertiary) mt-1">{t('categories')}</p>
            </div>
            <div className="text-center p-3 bg-(--bg-tertiary) rounded-lg">
              <p className="text-2xl font-bold text-(--accent-primary)">
                {stats.totalConversations}
              </p>
              <p className="text-xs text-(--text-tertiary) mt-1">{t('conversations')}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 p-4 bg-(--bg-secondary) rounded-xl border border-(--border-primary)">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-(--accent-primary)/10 rounded-lg">
              <Smartphone size={24} className="text-(--accent-primary)" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-(--text-primary)">{t('offlineMode')}</p>
              <p className="text-sm text-(--text-tertiary)">{t('offlineModeDesc')}</p>
            </div>
          </div>

          {offlineStatus === 'checking' ? (
            <div className="flex items-center gap-2 text-(--text-tertiary)">
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-sm">{locale === 'ko' ? '확인 중...' : 'Checking...'}</span>
            </div>
          ) : offlineStatus === 'ready' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">{t('offlineReady')}</span>
              </div>
              {offlineDate && (
                <p className="text-xs text-(--text-tertiary)">
                  {t('offlineDownloadedAt')}: {offlineDate}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {hasUpdate && (
                  <button
                    type="button"
                    onClick={() => setShowOfflineDialog(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-(--accent-primary) text-white hover:bg-(--accent-primary)/90 transition-colors"
                  >
                    <RefreshCw size={14} />
                    {t('offlineUpdate')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDeleteOffline}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={14} />
                  {t('offlineDelete')}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowOfflineDialog(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg bg-(--accent-primary) text-white hover:bg-(--accent-primary)/90 transition-colors"
            >
              <Download size={18} />
              {t('offlineDownload')}
            </button>
          )}
        </div>

        <div className="mb-8">
          <a
            href={ZIP_DOWNLOAD_URL}
            download="context-data.zip"
            className={cn(
              'w-full p-4 rounded-xl border transition-all cursor-pointer block',
              'bg-(--accent-primary) border-(--accent-primary) hover:bg-(--accent-primary)/90',
              'flex items-center justify-between gap-4',
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Archive size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">{t('downloadZip')}</p>
                <p className="text-sm text-white/80">{t('downloadZipDesc')}</p>
              </div>
            </div>
            <Download size={20} className="text-white shrink-0" />
          </a>
        </div>

        <div className="mb-8">
          <button
            type="button"
            onClick={handleOpenGitHub}
            className={cn(
              'w-full p-4 rounded-xl border transition-all cursor-pointer',
              'bg-(--bg-primary) border-(--border-primary) hover:border-(--accent-primary)',
              'flex items-center justify-between gap-4',
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-(--bg-tertiary) rounded-lg">
                <Code size={24} className="text-(--text-secondary)" />
              </div>
              <div className="text-left">
                <p className="font-medium text-(--text-primary)">{t('downloadFromGitHub')}</p>
                <p className="text-sm text-(--text-tertiary)">{t('downloadFromGitHubDesc')}</p>
              </div>
            </div>
            <ExternalLink size={20} className="text-(--text-tertiary) shrink-0" />
          </button>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-4">
            {t('downloadDirectLinks')}
          </h2>

          {downloadItems.map(({ type, icon: Icon, labelKey, descKey, getUrl, isExternal }) => {
            const url = getUrl();
            const isCopied = copiedUrl === url;

            return (
              <div
                key={type}
                className="rounded-xl border bg-(--bg-primary) border-(--border-primary) p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-(--bg-tertiary) rounded-lg shrink-0">
                    <Icon size={24} className="text-(--text-secondary)" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-(--text-primary)">{t(labelKey)}</span>
                      <span className="text-xs px-2 py-0.5 bg-(--bg-tertiary) rounded text-(--text-tertiary)">
                        {isExternal ? t('folder') : '.json'}
                      </span>
                    </div>
                    <p className="text-sm text-(--text-secondary) mt-1">{t(descKey)}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <code className="flex-1 text-xs bg-(--bg-tertiary) px-3 py-2 rounded-lg font-mono text-(--text-secondary) overflow-x-auto whitespace-nowrap">
                        {url}
                      </code>
                      {isExternal ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer bg-(--accent-primary) text-white hover:bg-(--accent-primary)/90"
                        >
                          <ExternalLink size={14} />
                          {t('openInGitHub')}
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(url)}
                          className={cn(
                            'shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer',
                            isCopied
                              ? 'bg-green-500 text-white'
                              : 'bg-(--accent-primary) text-white hover:bg-(--accent-primary)/90',
                          )}
                        >
                          {isCopied ? (
                            <>
                              <Check size={14} />
                              {t('apiCopied')}
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              {t('apiCopyUrl')}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-4 flex items-center gap-2">
            <Code size={20} />
            {t('apiSectionTitle')}
          </h2>
          <div className="rounded-xl border border-(--border-primary) bg-(--bg-primary) overflow-hidden">
            <div className="p-4 border-b border-(--border-secondary)">
              <p className="text-sm text-(--text-secondary)">{t('apiSectionDescription')}</p>
            </div>
            <div className="p-4 bg-(--bg-tertiary)">
              <pre className="text-xs font-mono text-(--text-secondary) overflow-x-auto whitespace-pre">
                {`// Fetch all entries
const res = await fetch('${GITHUB_RAW_BASE}/meta.json');
const meta = await res.json();

// Load specific category
const greetings = await fetch(
  '${GITHUB_RAW_BASE}/entries/greetings.json'
).then(r => r.json());`}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-(--bg-tertiary) rounded-xl text-sm text-(--text-secondary)">
          <p>{t('downloadLicenseNote')}</p>
        </div>
      </div>

      <OfflineDownloadDialog
        isOpen={showOfflineDialog}
        onClose={() => setShowOfflineDialog(false)}
        onConfirm={handleOfflineDownload}
        isDownloading={isDownloading}
        progress={downloadProgress}
        error={downloadError}
        entriesCount={stats.totalEntries}
      />
    </Layout>
  );
}
