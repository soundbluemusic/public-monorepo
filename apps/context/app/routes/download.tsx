import { metaFactory } from '@soundblue/i18n';
import { cn } from '@soundblue/ui/utils';
import { ChevronDown, ChevronUp, Download, Eye, FileJson, FileText, FileType } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useLoaderData } from 'react-router';
import { Layout } from '@/components/layout';
import type { MeaningEntry } from '@/data/types';
import { useI18n } from '@/i18n';

type ExportFormat = 'json' | 'txt' | 'md' | 'csv';

/** 미리보기용 샘플 개수 */
const PREVIEW_COUNT = 3;

interface LoaderData {
  entries: MeaningEntry[];
  totalCount: number;
}

export async function loader(): Promise<LoaderData> {
  const { meaningEntries } = await import('@/data/entries');
  return {
    entries: meaningEntries,
    totalCount: meaningEntries.length,
  };
}

export const meta = metaFactory({
  ko: { title: '어휘 다운로드 - Context', description: '모든 한국어 어휘 매핑을 다운로드하세요' },
  en: {
    title: 'Download Vocabulary - Context',
    description: 'Download all Korean vocabulary mappings',
  },
});

/**
 * JSON 형식으로 변환
 */
function toJSON(entries: MeaningEntry[]): string {
  return JSON.stringify(entries, null, 2);
}

/**
 * TXT 형식으로 변환 (간단한 탭 구분)
 */
function toTXT(entries: MeaningEntry[], locale: 'en' | 'ko'): string {
  const header =
    locale === 'ko'
      ? '한국어\t로마자\t번역\t설명\t카테고리\t난이도'
      : 'Korean\tRomanization\tTranslation\tExplanation\tCategory\tDifficulty';

  const rows = entries.map((entry) => {
    const translation = entry.translations[locale];
    return [
      entry.korean,
      entry.romanization,
      translation.word,
      translation.explanation.replace(/\n/g, ' '),
      entry.categoryId,
      entry.difficulty,
    ].join('\t');
  });

  return [header, ...rows].join('\n');
}

/**
 * Markdown 형식으로 변환
 */
function toMarkdown(entries: MeaningEntry[], locale: 'en' | 'ko'): string {
  const title = locale === 'ko' ? '# 한국어 어휘 목록\n\n' : '# Korean Vocabulary List\n\n';
  const tableHeader =
    locale === 'ko'
      ? '| 한국어 | 로마자 | 번역 | 설명 | 카테고리 | 난이도 |\n|---|---|---|---|---|---|'
      : '| Korean | Romanization | Translation | Explanation | Category | Difficulty |\n|---|---|---|---|---|---|';

  const rows = entries.map((entry) => {
    const translation = entry.translations[locale];
    return `| ${entry.korean} | ${entry.romanization} | ${translation.word} | ${translation.explanation.replace(/\n/g, ' ').replace(/\|/g, '\\|')} | ${entry.categoryId} | ${entry.difficulty} |`;
  });

  return `${title}${tableHeader}\n${rows.join('\n')}`;
}

/**
 * CSV 형식으로 변환
 */
function toCSV(entries: MeaningEntry[], locale: 'en' | 'ko'): string {
  const header =
    locale === 'ko'
      ? 'ID,한국어,로마자,번역,설명,카테고리,난이도,품사,태그'
      : 'ID,Korean,Romanization,Translation,Explanation,Category,Difficulty,Part of Speech,Tags';

  const escapeCSV = (str: string) => {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = entries.map((entry) => {
    const translation = entry.translations[locale];
    return [
      entry.id,
      entry.korean,
      entry.romanization,
      escapeCSV(translation.word),
      escapeCSV(translation.explanation),
      entry.categoryId,
      entry.difficulty,
      entry.partOfSpeech,
      entry.tags.join(';'),
    ].join(',');
  });

  return [header, ...rows].join('\n');
}

const FORMAT_INFO: Record<
  ExportFormat,
  { icon: typeof FileJson; extension: string; mimeType: string }
> = {
  json: { icon: FileJson, extension: 'json', mimeType: 'application/json' },
  txt: { icon: FileText, extension: 'txt', mimeType: 'text/plain' },
  md: { icon: FileType, extension: 'md', mimeType: 'text/markdown' },
  csv: { icon: FileText, extension: 'csv', mimeType: 'text/csv' },
};

/**
 * 미리보기 컴포넌트
 */
function FormatPreview({
  format,
  entries,
  locale,
}: {
  format: ExportFormat;
  entries: MeaningEntry[];
  locale: 'en' | 'ko';
}) {
  const sampleEntries = entries.slice(0, PREVIEW_COUNT);

  const previewContent = useMemo(() => {
    switch (format) {
      case 'json':
        return JSON.stringify(sampleEntries, null, 2);
      case 'txt':
        return toTXT(sampleEntries, locale);
      case 'md':
        return toMarkdown(sampleEntries, locale);
      case 'csv':
        return toCSV(sampleEntries, locale);
    }
  }, [format, sampleEntries, locale]);

  return (
    <div className="mt-3 rounded-lg bg-(--bg-tertiary) border border-(--border-secondary) overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-(--border-secondary) bg-(--bg-secondary)">
        <Eye size={14} className="text-(--text-tertiary)" />
        <span className="text-xs font-medium text-(--text-tertiary)">
          {locale === 'ko'
            ? `미리보기 (${PREVIEW_COUNT}개 샘플)`
            : `Preview (${PREVIEW_COUNT} samples)`}
        </span>
      </div>
      <pre className="p-3 text-xs overflow-x-auto max-h-64 overflow-y-auto text-(--text-secondary) font-mono whitespace-pre">
        {previewContent}
      </pre>
      <div className="px-3 py-2 border-t border-(--border-secondary) bg-(--bg-secondary)">
        <p className="text-xs text-(--text-tertiary)">
          {locale === 'ko'
            ? `... 외 ${entries.length - PREVIEW_COUNT}개 더`
            : `... and ${entries.length - PREVIEW_COUNT} more`}
        </p>
      </div>
    </div>
  );
}

export default function DownloadPage() {
  const { entries, totalCount } = useLoaderData<LoaderData>();
  const { locale, t } = useI18n();
  const [downloading, setDownloading] = useState<ExportFormat | null>(null);
  const [expandedFormat, setExpandedFormat] = useState<ExportFormat | null>(null);

  const togglePreview = useCallback((format: ExportFormat) => {
    setExpandedFormat((prev) => (prev === format ? null : format));
  }, []);

  const handleDownload = useCallback(
    (format: ExportFormat) => {
      setDownloading(format);

      try {
        let content: string;
        switch (format) {
          case 'json':
            content = toJSON(entries);
            break;
          case 'txt':
            content = toTXT(entries, locale);
            break;
          case 'md':
            content = toMarkdown(entries, locale);
            break;
          case 'csv':
            content = toCSV(entries, locale);
            break;
        }

        const { extension, mimeType } = FORMAT_INFO[format];
        const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `context-vocabulary-${locale}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } finally {
        setDownloading(null);
      }
    },
    [entries, locale],
  );

  const formats: { format: ExportFormat; label: string; description: string }[] = [
    {
      format: 'json',
      label: 'JSON',
      description:
        locale === 'ko'
          ? '개발자용. 전체 데이터 포함 (예문, 관련어 등)'
          : 'For developers. Full data including examples and related words',
    },
    {
      format: 'csv',
      label: 'CSV',
      description:
        locale === 'ko'
          ? '엑셀/스프레드시트용. 표 형식으로 열기'
          : 'For Excel/Spreadsheet. Opens as table format',
    },
    {
      format: 'txt',
      label: 'TXT',
      description:
        locale === 'ko'
          ? '텍스트 파일. 탭으로 구분된 간단한 형식'
          : 'Text file. Simple tab-separated format',
    },
    {
      format: 'md',
      label: 'Markdown',
      description:
        locale === 'ko'
          ? '마크다운 테이블. 문서나 노트 앱에서 사용'
          : 'Markdown table. Use in docs or note apps',
    },
  ];

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

        {/* Stats */}
        <div className="mb-8 p-4 bg-(--bg-secondary) rounded-xl border border-(--border-primary)">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-(--accent-primary)/10 rounded-lg">
              <Download size={24} className="text-(--accent-primary)" />
            </div>
            <div>
              <p className="text-lg font-semibold text-(--text-primary)">
                {totalCount.toLocaleString()} {locale === 'ko' ? '개 단어' : 'words'}
              </p>
              <p className="text-sm text-(--text-tertiary)">
                {locale === 'ko' ? '모든 어휘 매핑 포함' : 'All vocabulary mappings included'}
              </p>
            </div>
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-4">
            {locale === 'ko' ? '다운로드 형식 선택' : 'Select Download Format'}
          </h2>

          {formats.map(({ format, label, description }) => {
            const { icon: Icon } = FORMAT_INFO[format];
            const isDownloading = downloading === format;
            const isExpanded = expandedFormat === format;

            return (
              <div
                key={format}
                className={cn(
                  'rounded-xl border transition-all',
                  'bg-(--bg-primary) border-(--border-primary)',
                  isExpanded && 'border-(--accent-primary)',
                )}
              >
                {/* 카드 헤더 */}
                <div className="p-4 flex items-start gap-4">
                  <div className="p-2 bg-(--bg-tertiary) rounded-lg shrink-0">
                    <Icon size={24} className="text-(--text-secondary)" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-(--text-primary)">{label}</span>
                      <span className="text-xs px-2 py-0.5 bg-(--bg-tertiary) rounded text-(--text-tertiary)">
                        .{FORMAT_INFO[format].extension}
                      </span>
                    </div>
                    <p className="text-sm text-(--text-secondary) mt-1">{description}</p>

                    {/* 액션 버튼들 */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => togglePreview(format)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                          'border border-(--border-primary)',
                          isExpanded
                            ? 'bg-(--accent-primary)/10 text-(--accent-primary) border-(--accent-primary)'
                            : 'text-(--text-secondary) hover:bg-(--bg-tertiary)',
                        )}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp size={14} />
                            {locale === 'ko' ? '미리보기 닫기' : 'Hide Preview'}
                          </>
                        ) : (
                          <>
                            <Eye size={14} />
                            {locale === 'ko' ? '미리보기' : 'Preview'}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(format)}
                        disabled={isDownloading}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                          'bg-(--accent-primary) text-white hover:bg-(--accent-primary)/90',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                      >
                        {isDownloading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {locale === 'ko' ? '다운로드 중...' : 'Downloading...'}
                          </>
                        ) : (
                          <>
                            <Download size={14} />
                            {locale === 'ko' ? '다운로드' : 'Download'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 미리보기 패널 */}
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <FormatPreview format={format} entries={entries} locale={locale} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* License Note */}
        <div className="mt-8 p-4 bg-(--bg-tertiary) rounded-xl text-sm text-(--text-secondary)">
          <p>
            {locale === 'ko'
              ? '📜 모든 데이터는 Apache License 2.0 하에 제공됩니다. 상업적 사용 가능.'
              : '📜 All data is provided under Apache License 2.0. Commercial use allowed.'}
          </p>
        </div>
      </div>
    </Layout>
  );
}
