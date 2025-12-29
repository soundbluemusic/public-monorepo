/**
 * Search Web Worker
 *
 * 메인 스레드를 차단하지 않고 검색 수행
 */
import { SearchEngine } from '../core/engine';
import type { SearchConfig, WorkerMessage } from '../core/types';

let engine: SearchEngine<{ id: string; [key: string]: unknown }> | null = null;

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'INIT': {
      const { config, data } = payload as {
        config: SearchConfig;
        data: Array<{ id: string; [key: string]: unknown }>;
      };
      engine = new SearchEngine(config);
      engine.addAll(data);
      self.postMessage({ type: 'READY' } satisfies WorkerMessage);
      break;
    }

    case 'SEARCH': {
      if (!engine) {
        self.postMessage({
          type: 'ERROR',
          error: 'Engine not initialized',
        } satisfies WorkerMessage);
        return;
      }
      const { query, limit } = payload as { query: string; limit?: number };
      const results = engine.search(query, limit);
      self.postMessage({
        type: 'RESULTS',
        payload: results,
      } satisfies WorkerMessage);
      break;
    }

    case 'SUGGEST': {
      if (!engine) {
        self.postMessage({
          type: 'ERROR',
          error: 'Engine not initialized',
        } satisfies WorkerMessage);
        return;
      }
      const { query: suggestQuery, limit: suggestLimit } = payload as {
        query: string;
        limit?: number;
      };
      const suggestions = engine.suggest(suggestQuery, suggestLimit);
      self.postMessage({
        type: 'SUGGESTIONS',
        payload: suggestions,
      } satisfies WorkerMessage);
      break;
    }
  }
};
