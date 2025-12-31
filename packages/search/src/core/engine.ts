/**
 * @fileoverview Full-text Search Engine
 * @environment universal
 *
 * MiniSearch를 래핑한 타입 안전 검색 엔진.
 * 인메모리 전문 검색, 퍼지 매칭, 자동완성을 지원합니다.
 *
 * @example
 * ```typescript
 * import { SearchEngine } from '@soundblue/search';
 *
 * interface Article {
 *   id: string;
 *   title: string;
 *   content: string;
 * }
 *
 * const engine = new SearchEngine<Article>({
 *   fields: ['title', 'content'],
 *   storeFields: ['title'],
 *   searchOptions: {
 *     boost: { title: 2 },
 *     fuzzy: 0.2,
 *   },
 * });
 *
 * engine.addAll(articles);
 * const results = engine.search('react hooks', 10);
 * ```
 */
import MiniSearch from 'minisearch';
import type { SearchableItem, SearchConfig, SearchResult } from './types';

/**
 * 타입 안전 전문 검색 엔진
 *
 * MiniSearch를 래핑하여 TypeScript 제네릭과 통합된 검색 기능을 제공합니다.
 * 인덱스 생성, 검색, 자동완성, 직렬화/역직렬화를 지원합니다.
 *
 * @typeParam T - 검색 가능한 아이템 타입. `SearchableItem`을 확장해야 합니다.
 *
 * @example
 * ```typescript
 * // 기본 사용법
 * const engine = new SearchEngine<Entry>({
 *   fields: ['word', 'definition'],
 *   storeFields: ['word', 'category'],
 * });
 *
 * // 데이터 인덱싱
 * engine.addAll(entries);
 *
 * // 검색 실행
 * const results = engine.search('hello', 5);
 * // results: [{ id: '1', score: 12.5, match: { word: ['hello'] }, item: {...} }]
 *
 * // 자동완성
 * const suggestions = engine.suggest('hel');
 * // suggestions: ['hello', 'help', 'helicopter']
 * ```
 */
export class SearchEngine<T extends SearchableItem> {
  private index: MiniSearch<T>;
  private config: SearchConfig;

  /**
   * SearchEngine 인스턴스를 생성합니다.
   *
   * @param config - 검색 엔진 설정
   * @param config.fields - 검색할 필드 목록
   * @param config.storeFields - 결과에 저장할 필드 목록
   * @param config.searchOptions - 검색 옵션 (boost, fuzzy, prefix)
   *
   * @example
   * ```typescript
   * const engine = new SearchEngine({
   *   fields: ['title', 'content', 'tags'],
   *   storeFields: ['title', 'slug'],
   *   searchOptions: {
   *     boost: { title: 3, tags: 2 },
   *     fuzzy: 0.2,  // 20% 오타 허용
   *     prefix: true, // 접두어 매칭 활성화
   *   },
   * });
   * ```
   */
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
   * 여러 아이템을 한 번에 인덱싱합니다.
   *
   * 초기 데이터 로드 시 사용합니다. 대량의 문서를 효율적으로 인덱싱합니다.
   *
   * @param items - 인덱싱할 아이템 배열
   *
   * @example
   * ```typescript
   * const entries = await fetchEntries();
   * engine.addAll(entries);
   * console.log(`${engine.documentCount}개 문서 인덱싱 완료`);
   * ```
   */
  addAll(items: T[]): void {
    this.index.addAll(items);
  }

  /**
   * 단일 아이템을 인덱스에 추가합니다.
   *
   * 새 문서가 추가될 때 실시간으로 인덱스를 업데이트합니다.
   *
   * @param item - 추가할 아이템
   *
   * @example
   * ```typescript
   * const newEntry = { id: '123', word: 'hello', definition: '인사' };
   * engine.add(newEntry);
   * ```
   */
  add(item: T): void {
    this.index.add(item);
  }

  /**
   * JSON 문자열에서 인덱스를 로드합니다.
   *
   * `exportIndex()`로 직렬화된 인덱스를 복원합니다.
   * 서버 사이드에서 미리 빌드한 인덱스를 클라이언트에서 로드할 때 유용합니다.
   *
   * @param json - 직렬화된 인덱스 JSON 문자열
   *
   * @example
   * ```typescript
   * // 서버에서 생성한 인덱스 로드
   * const indexJson = await fetch('/search-index.json').then(r => r.text());
   * engine.loadIndex(indexJson);
   * ```
   */
  loadIndex(json: string): void {
    this.index = MiniSearch.loadJSON<T>(json, {
      fields: this.config.fields,
      storeFields: this.config.storeFields,
    });
  }

  /**
   * 현재 인덱스를 JSON 문자열로 내보냅니다.
   *
   * 빌드 시점에 인덱스를 생성하여 정적 파일로 저장할 때 사용합니다.
   *
   * @returns 직렬화된 인덱스 JSON 문자열
   *
   * @example
   * ```typescript
   * // 빌드 스크립트에서
   * const indexJson = engine.exportIndex();
   * await fs.writeFile('public/search-index.json', indexJson);
   * ```
   */
  exportIndex(): string {
    return JSON.stringify(this.index);
  }

  /**
   * 검색을 실행하고 결과를 반환합니다.
   *
   * 쿼리와 일치하는 문서를 관련도 점수순으로 반환합니다.
   * 퍼지 매칭과 접두어 매칭이 설정에 따라 적용됩니다.
   *
   * @param query - 검색 쿼리 문자열
   * @param limit - 반환할 최대 결과 수 (선택사항)
   * @returns 검색 결과 배열 (점수순 정렬)
   *
   * @example
   * ```typescript
   * // 상위 5개 결과만 가져오기
   * const results = engine.search('리액트 훅', 5);
   *
   * results.forEach(result => {
   *   console.log(`${result.id}: ${result.score}`);
   *   console.log('매칭된 필드:', Object.keys(result.match));
   * });
   * ```
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
   * 검색어 자동완성 제안을 반환합니다.
   *
   * 사용자가 타이핑하는 동안 실시간으로 검색어를 제안합니다.
   *
   * @param query - 현재 입력 중인 검색어
   * @param limit - 반환할 최대 제안 수 (기본값: 5)
   * @returns 제안 문자열 배열
   *
   * @example
   * ```typescript
   * // 검색창 자동완성
   * const suggestions = engine.suggest('자바', 5);
   * // ['자바스크립트', '자바', '자바 스프링', ...]
   * ```
   */
  suggest(query: string, limit = 5): string[] {
    const suggestions = this.index.autoSuggest(query);
    return suggestions.slice(0, limit).map((s) => s.suggestion);
  }

  /**
   * 인덱스의 모든 문서를 제거합니다.
   *
   * 인덱스를 완전히 초기화합니다. 새 데이터로 재인덱싱 전에 호출합니다.
   *
   * @example
   * ```typescript
   * engine.clear();
   * engine.addAll(newData);
   * ```
   */
  clear(): void {
    this.index.removeAll();
  }

  /**
   * 인덱스에 포함된 문서 수를 반환합니다.
   *
   * @returns 인덱싱된 문서 수
   *
   * @example
   * ```typescript
   * console.log(`총 ${engine.documentCount}개 문서`);
   * ```
   */
  get documentCount(): number {
    return this.index.documentCount;
  }
}
