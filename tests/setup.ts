/**
 * Vitest global setup file
 * Runs before all tests
 */

import { cleanup } from '@testing-library/react';
import 'fake-indexeddb/auto';
import { afterEach } from 'vitest';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage
const storageData: Record<string, string> = {};

const localStorageMock: Storage = {
  getItem: (key: string) => storageData[key] || null,
  setItem: (key: string, value: string) => {
    storageData[key] = value;
  },
  removeItem: (key: string) => {
    delete storageData[key];
  },
  clear: () => {
    for (const key of Object.keys(storageData)) {
      delete storageData[key];
    }
  },
  key: (index: number) => {
    const keys = Object.keys(storageData);
    return keys[index] || null;
  },
  get length() {
    return Object.keys(storageData).length;
  },
};

global.localStorage = localStorageMock;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});
