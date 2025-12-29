/**
 * Search Engine
 *
 * MiniSearch를 래핑한 검색 엔진
 */
import MiniSearch from 'minisearch';
import type { SearchableItem, SearchConfig, SearchResult } from './types';

export class SearchEngine<T extends SearchableItem> {
  private index: MiniSearch<T>;
  private config: SearchConfig;

  constructor(config: SearchConfig) {
    this.config = config;
    this.index = new MiniSearch<T>({
      fields: config.fields,
      storeFields: config.storeFields,
      searchOptions: {
        boost: config.searchOptions?.boost ?? {},
        fuzzy: config.searchOptions?.fuzzy ?? 0.2,
        prefix: config.searchOptions?.prefix ?? true,
      },
    });
  }

  /**
   * 아이템 배열로 인덱스 생성
   */
  addAll(items: T[]): void {
    this.index.addAll(items);
  }

  /**
   * 단일 아이템 추가
   */
  add(item: T): void {
    this.index.add(item);
  }

  /**
   * JSON 인덱스 로드 (직렬화된 인덱스)
   */
  loadIndex(json: string): void {
    this.index = MiniSearch.loadJSON<T>(json, {
      fields: this.config.fields,
      storeFields: this.config.storeFields,
    });
  }

  /**
   * 인덱스를 JSON으로 내보내기
   */
  exportIndex(): string {
    return JSON.stringify(this.index);
  }

  /**
   * 검색 실행
   */
  search(query: string, limit?: number): SearchResult<T>[] {
    const results = this.index.search(query, {
      ...this.config.searchOptions,
    });

    const limited = limit ? results.slice(0, limit) : results;

    return limited.map(
      (r: { id: string | number; score: number; match: Record<string, string[]> }) => ({
        id: String(r.id),
        score: r.score,
        match: r.match,
        item: r as unknown as T,
      }),
    );
  }

  /**
   * 자동완성 제안
   */
  suggest(query: string, limit = 5): string[] {
    const suggestions = this.index.autoSuggest(query);
    return suggestions.slice(0, limit).map((s) => s.suggestion);
  }

  /**
   * 인덱스 초기화
   */
  clear(): void {
    this.index.removeAll();
  }

  /**
   * 인덱스된 문서 수
   */
  get documentCount(): number {
    return this.index.documentCount;
  }
}
