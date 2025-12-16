// 웹 표준 API 타입 정의

export interface WebAPI {
  id: string;
  name: string;
  description: string;
  category: string;

  // 문서 링크
  mdnUrl?: string;
  whatwgUrl?: string;
  w3cUrl?: string;
  canIUseUrl?: string;

  // 브라우저 지원
  support: BrowserSupport;

  // 상태
  status: APIStatus;

  // 관련 API
  related?: string[];

  // 이 사이트에서 사용 중인지
  usedInSite?: boolean;
}

export interface BrowserSupport {
  chrome: BrowserVersion;
  firefox: BrowserVersion;
  safari: BrowserVersion;
  edge: BrowserVersion;
}

export interface BrowserVersion {
  supported: boolean;
  version?: string;
  partial?: boolean;
}

export type APIStatus = "stable" | "experimental" | "deprecated";

export interface WebAPICategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: WebAPI[];
}
