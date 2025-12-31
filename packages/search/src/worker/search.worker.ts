/**
 * Search Web Worker
 *
 * 메인 스레드를 차단하지 않고 검색 수행
 */
import { SearchEngine } from '../core/engine';
import type { WorkerMessage } from '../core/types';

let engine: SearchEngine<{ id: string; [key: string]: unknown }> | null = null;

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const message = e.data;

  switch (message.type) {
    case 'INIT': {
      const { config, data } = message.payload;
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
      const { query, limit } = message.payload;
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
      const { query, limit } = message.payload;
      const suggestions = engine.suggest(query, limit);
      self.postMessage({
        type: 'SUGGESTIONS',
        payload: suggestions,
      } satisfies WorkerMessage);
      break;
    }
  }
};
