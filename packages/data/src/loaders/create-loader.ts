/**
 * React Router 데이터 로더 팩토리
 *
 * 빌드타임/런타임 데이터 로딩을 위한 로더 생성 유틸리티
 */

/**
 * 로더 설정
 */
export interface LoaderConfig<T> {
  /** 데이터 가져오기 함수 */
  getData: (id: string, lang: string) => Promise<T | null> | T | null;
  /** 정적 경로 생성 (선택) */
  getStaticPaths?: () => Promise<string[]> | string[];
  /** 404 시 리다이렉트 경로 (선택) */
  notFoundRedirect?: string;
}

/**
 * 로더 결과 타입
 */
export interface LoaderResult<T> {
  data: T;
  lang: string;
}

/**
 * 데이터 로더 생성
 *
 * React Router의 loader 함수와 함께 사용할 수 있는 팩토리
 *
 * @example
 * ```ts
 * const { loader, getStaticPaths } = createDataLoader({
 *   getData: (id, lang) => getEntryById(id),
 *   getStaticPaths: () => getAllEntryIds(),
 * });
 *
 * export { loader };
 * ```
 */
export function createDataLoader<T>(config: LoaderConfig<T>) {
  const loader = async ({
    params,
  }: {
    params: { lang?: string; id?: string; [key: string]: string | undefined };
  }): Promise<LoaderResult<T>> => {
    const lang = params.lang || 'en';
    const id = params.id;

    if (!id) {
      throw new Response('Not Found', { status: 404 });
    }

    const data = await config.getData(id, lang);

    if (!data) {
      if (config.notFoundRedirect) {
        // React Router의 redirect 사용
        throw new Response(null, {
          status: 302,
          headers: { Location: config.notFoundRedirect },
        });
      }
      throw new Response('Not Found', { status: 404 });
    }

    return { data, lang };
  };

  return {
    loader,
    getStaticPaths: config.getStaticPaths,
  };
}
