// 어휘 항목의 기본 타입
export interface VocabEntry {
  id: string;
  term: string;
  pronunciation?: string;
  definition: string;
  examples: string[];
  relatedTerms?: string[];
  tags: string[];
  categoryId: string;
  subcategoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 카테고리 타입
export interface Category {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  subcategories: Subcategory[];
}

// 하위 카테고리 타입
export interface Subcategory {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  parentId: string;
  order: number;
}

// 검색 결과 타입
export interface SearchResult {
  entry: VocabEntry;
  category: Category;
  subcategory?: Subcategory;
  score: number;
}

// 네비게이션 아이템
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

// 페이지 메타데이터
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}
