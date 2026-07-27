export interface SearchIndexItem {
  id: string;
  type: 'concept' | 'entry' | 'library' | 'api';
  name: { en: string; ko: string };
  description?: { en: string; ko: string };
  field?: string;
  tags?: string[];
}

export interface SearchResult {
  item: SearchIndexItem;
  score?: number;
}

export interface LoadedSearchIndex {
  items: SearchIndexItem[];
  itemsById: Map<string, SearchIndexItem>;
}
