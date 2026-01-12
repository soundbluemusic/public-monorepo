import { metaFactory } from '@soundblue/i18n';
import { cn } from '@soundblue/ui/utils';
import {
  Archive,
  BookOpen,
  Check,
  Code,
  Copy,
  Download,
  ExternalLink,
  FileJson,
  MessageSquare,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { useLoaderData } from 'react-router';
import { Layout } from '@/components/layout';
import { useI18n } from '@/i18n';

/**
 * 통계 데이터 (GitHub Raw URL에서 직접 다운로드하므로 데이터 임베드 불필요)
 */
interface LoaderData {
  stats: {
    /** 총 어휘 수 (auto-generated from load-entries.ts) */
    totalEntries: number;
    /** 총 카테고리 수 */
    totalCategories: number;
    /** 총 대화 예문 수 */
    totalConversations: number;
  };
}

/**
 * SSG loader: 통계 정보만 반환 (데이터는 GitHub Raw URL에서 직접 다운로드)
 *
 * 데이터 동기화:
 * - jsonEntriesCount는 load-entries.ts가 JSON 파일에서 자동 생성
 * - conversations.ts 파일에서 대화 수 계산
 * - 새 데이터 추가 시 pnpm build로 자동 반영됨
 */
export async function loader(): Promise<LoaderData> {
  const { jsonEntriesCount } = await import('@/data/entries');
  const { conversations } = await import('@/data/conversations');
  const { categories } = await import('@/data/categories');

  return {
    stats: {
      totalEntries: jsonEntriesCount,
      totalCategories: categories.length,
      totalConversations: conversations.length,
    },
  };
}

/**
 * clientLoader: 클라이언트 네비게이션 시에도 동일한 통계 반환
 */
export async function clientLoader(): Promise<LoaderData> {
  const { jsonEntriesCount } = await import('@/data/entries');
  const { conversations } = await import('@/data/conversations');
  const { categories } = await import('@/data/categories');

  return {
    stats: {
      totalEntries: jsonEntriesCount,
      totalCategories: categories.length,
      totalConversations: conversations.length,
    },
  };
}

export const meta = metaFactory(
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
  'https://context.soundbluemusic.com',
);

/** GitHub Raw URL base (public repository) */
const GITHUB_RAW_BASE =
  'https://raw.githubusercontent.com/soundbluemusic/public-monorepo/main/data/context';

/** ZIP 다운로드 URL */
const ZIP_DOWNLOAD_URL = `${GITHUB_RAW_BASE}/context-data.zip`;

/** 다운로드 가능한 데이터 유형 */
type DownloadType = 'entries' | 'conversations' | 'meta';

/** 다운로드 항목 정보 */
interface DownloadItem {
  type: DownloadType;
  icon: typeof FileJson;
  labelKey: 'downloadEntries' | 'downloadConversations' | 'downloadMeta';
  descKey: 'downloadEntriesDesc' | 'downloadConversationsDesc' | 'downloadMetaDesc';
  getUrl: () => string;
}

export default function DownloadPage() {
  const { stats } = useLoaderData<LoaderData>();
  const { t } = useI18n();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  /** 다운로드 항목 목록 */
  const downloadItems: DownloadItem[] = [
    {
      type: 'entries',
      icon: BookOpen,
      labelKey: 'downloadEntries',
      descKey: 'downloadEntriesDesc',
      getUrl: () => `${GITHUB_RAW_BASE}/entries/`,
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-2">
            {t('downloadTitle')}
          </h1>
          <p className="text-(--text-secondary)">{t('downloadDescription')}</p>
        </div>

        {/* Stats Overview */}
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

          {/* Stats Grid */}
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

        {/* ZIP Download - Primary CTA */}
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

        {/* GitHub Repository Link */}
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

        {/* Download Items */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-4">
            {t('downloadDirectLinks')}
          </h2>

          {downloadItems.map(({ type, icon: Icon, labelKey, descKey, getUrl }) => {
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
                        .json
                      </span>
                    </div>
                    <p className="text-sm text-(--text-secondary) mt-1">{t(descKey)}</p>

                    {/* URL Display */}
                    <div className="mt-3 flex items-center gap-2">
                      <code className="flex-1 text-xs bg-(--bg-tertiary) px-3 py-2 rounded-lg font-mono text-(--text-secondary) overflow-x-auto whitespace-nowrap">
                        {url}
                      </code>
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
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* API Usage Example */}
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

        {/* License Note */}
        <div className="mt-8 p-4 bg-(--bg-tertiary) rounded-xl text-sm text-(--text-secondary)">
          <p>{t('downloadLicenseNote')}</p>
        </div>
      </div>
    </Layout>
  );
}
