/**
 * @fileoverview Unit tests for Search Adapters
 *
 * 각 앱별 검색 설정 어댑터(context, roots, permissive)를 테스트합니다.
 * 검색 필드, 저장 필드, 부스트 설정 등이 올바르게 구성되었는지 확인합니다.
 */

import { contextSearchConfig } from '@soundblue/search/adapters/context';
import { rootsSearchConfig } from '@soundblue/search/adapters/roots';
import { librarySearchConfig, webApiSearchConfig } from '@soundblue/search/adapters/permissive';
import type { SearchConfig } from '@soundblue/search/core/types';
import { describe, expect, it } from 'vitest';

describe('Search Adapters', () => {
  describe('contextSearchConfig (한국어 사전)', () => {
    it('should have required fields for Korean dictionary search', () => {
      expect(contextSearchConfig.fields).toBeDefined();
      expect(Array.isArray(contextSearchConfig.fields)).toBe(true);
      expect(contextSearchConfig.fields.length).toBeGreaterThan(0);
    });

    it('should include korean field for Hangul search', () => {
      expect(contextSearchConfig.fields).toContain('korean');
    });

    it('should include romanization field', () => {
      expect(contextSearchConfig.fields).toContain('romanization');
    });

    it('should include translation fields', () => {
      expect(contextSearchConfig.fields).toContain('translations.en.word');
      expect(contextSearchConfig.fields).toContain('translations.ko.word');
    });

    it('should have storeFields for result display', () => {
      expect(contextSearchConfig.storeFields).toBeDefined();
      expect(contextSearchConfig.storeFields).toContain('id');
      expect(contextSearchConfig.storeFields).toContain('korean');
      expect(contextSearchConfig.storeFields).toContain('romanization');
      expect(contextSearchConfig.storeFields).toContain('categoryId');
      expect(contextSearchConfig.storeFields).toContain('difficulty');
    });

    it('should have search options with boost settings', () => {
      expect(contextSearchConfig.searchOptions).toBeDefined();
      expect(contextSearchConfig.searchOptions?.boost).toBeDefined();
    });

    it('should boost Korean field highest', () => {
      const boost = contextSearchConfig.searchOptions?.boost;
      expect(boost?.korean).toBe(3);
      expect(boost?.['translations.en.word']).toBe(2);
      expect(boost?.romanization).toBe(1.5);
    });

    it('should enable fuzzy matching', () => {
      expect(contextSearchConfig.searchOptions?.fuzzy).toBe(0.2);
    });

    it('should enable prefix matching', () => {
      expect(contextSearchConfig.searchOptions?.prefix).toBe(true);
    });

    it('should be a valid SearchConfig', () => {
      const config: SearchConfig = contextSearchConfig;
      expect(config).toBeDefined();
    });
  });

  describe('rootsSearchConfig (수학 개념)', () => {
    it('should have required fields for math concept search', () => {
      expect(rootsSearchConfig.fields).toBeDefined();
      expect(Array.isArray(rootsSearchConfig.fields)).toBe(true);
      expect(rootsSearchConfig.fields.length).toBeGreaterThan(0);
    });

    it('should include multilingual name fields', () => {
      expect(rootsSearchConfig.fields).toContain('name.ko');
      expect(rootsSearchConfig.fields).toContain('name.en');
    });

    it('should include categorization fields', () => {
      expect(rootsSearchConfig.fields).toContain('tags');
      expect(rootsSearchConfig.fields).toContain('field');
      expect(rootsSearchConfig.fields).toContain('subfield');
    });

    it('should have storeFields for result display', () => {
      expect(rootsSearchConfig.storeFields).toBeDefined();
      expect(rootsSearchConfig.storeFields).toContain('id');
      expect(rootsSearchConfig.storeFields).toContain('name');
      expect(rootsSearchConfig.storeFields).toContain('field');
      expect(rootsSearchConfig.storeFields).toContain('subfield');
      expect(rootsSearchConfig.storeFields).toContain('difficulty');
    });

    it('should boost name fields highest', () => {
      const boost = rootsSearchConfig.searchOptions?.boost;
      expect(boost?.['name.ko']).toBe(3);
      expect(boost?.['name.en']).toBe(3);
      expect(boost?.tags).toBe(1.5);
      expect(boost?.field).toBe(1);
    });

    it('should enable fuzzy and prefix matching', () => {
      expect(rootsSearchConfig.searchOptions?.fuzzy).toBe(0.2);
      expect(rootsSearchConfig.searchOptions?.prefix).toBe(true);
    });

    it('should be a valid SearchConfig', () => {
      const config: SearchConfig = rootsSearchConfig;
      expect(config).toBeDefined();
    });
  });

  describe('librarySearchConfig (라이브러리 검색)', () => {
    it('should have required fields for library search', () => {
      expect(librarySearchConfig.fields).toBeDefined();
      expect(Array.isArray(librarySearchConfig.fields)).toBe(true);
    });

    it('should include name and description fields', () => {
      expect(librarySearchConfig.fields).toContain('name');
      expect(librarySearchConfig.fields).toContain('description');
      expect(librarySearchConfig.fields).toContain('descriptionKo');
    });

    it('should include categorization fields', () => {
      expect(librarySearchConfig.fields).toContain('category');
      expect(librarySearchConfig.fields).toContain('tags');
    });

    it('should have storeFields including github and license', () => {
      expect(librarySearchConfig.storeFields).toContain('name');
      expect(librarySearchConfig.storeFields).toContain('description');
      expect(librarySearchConfig.storeFields).toContain('descriptionKo');
      expect(librarySearchConfig.storeFields).toContain('category');
      expect(librarySearchConfig.storeFields).toContain('license');
      expect(librarySearchConfig.storeFields).toContain('github');
    });

    it('should boost name field highest', () => {
      const boost = librarySearchConfig.searchOptions?.boost;
      expect(boost?.name).toBe(3);
      expect(boost?.description).toBe(1.5);
      expect(boost?.descriptionKo).toBe(1.5);
      expect(boost?.category).toBe(1);
    });

    it('should enable fuzzy and prefix matching', () => {
      expect(librarySearchConfig.searchOptions?.fuzzy).toBe(0.2);
      expect(librarySearchConfig.searchOptions?.prefix).toBe(true);
    });
  });

  describe('webApiSearchConfig (Web API 검색)', () => {
    it('should have required fields for Web API search', () => {
      expect(webApiSearchConfig.fields).toBeDefined();
      expect(Array.isArray(webApiSearchConfig.fields)).toBe(true);
    });

    it('should include name and description fields', () => {
      expect(webApiSearchConfig.fields).toContain('name');
      expect(webApiSearchConfig.fields).toContain('description');
      expect(webApiSearchConfig.fields).toContain('descriptionKo');
      expect(webApiSearchConfig.fields).toContain('category');
    });

    it('should have storeFields including support and mdnUrl', () => {
      expect(webApiSearchConfig.storeFields).toContain('name');
      expect(webApiSearchConfig.storeFields).toContain('description');
      expect(webApiSearchConfig.storeFields).toContain('descriptionKo');
      expect(webApiSearchConfig.storeFields).toContain('category');
      expect(webApiSearchConfig.storeFields).toContain('support');
      expect(webApiSearchConfig.storeFields).toContain('mdnUrl');
    });

    it('should boost name field highest', () => {
      const boost = webApiSearchConfig.searchOptions?.boost;
      expect(boost?.name).toBe(3);
      expect(boost?.description).toBe(1.5);
      expect(boost?.descriptionKo).toBe(1.5);
    });

    it('should enable fuzzy and prefix matching', () => {
      expect(webApiSearchConfig.searchOptions?.fuzzy).toBe(0.2);
      expect(webApiSearchConfig.searchOptions?.prefix).toBe(true);
    });

    it('should not include tags field (unlike librarySearchConfig)', () => {
      expect(webApiSearchConfig.fields).not.toContain('tags');
    });
  });

  describe('Config Consistency', () => {
    const allConfigs = [
      { name: 'context', config: contextSearchConfig },
      { name: 'roots', config: rootsSearchConfig },
      { name: 'library', config: librarySearchConfig },
      { name: 'webApi', config: webApiSearchConfig },
    ];

    it('all configs should have fields array', () => {
      for (const { name, config } of allConfigs) {
        expect(config.fields, `${name} should have fields`).toBeDefined();
        expect(Array.isArray(config.fields), `${name}.fields should be array`).toBe(true);
      }
    });

    it('all configs should have storeFields array', () => {
      for (const { name, config } of allConfigs) {
        expect(config.storeFields, `${name} should have storeFields`).toBeDefined();
        expect(Array.isArray(config.storeFields), `${name}.storeFields should be array`).toBe(true);
      }
    });

    it('all configs should have searchOptions', () => {
      for (const { name, config } of allConfigs) {
        expect(config.searchOptions, `${name} should have searchOptions`).toBeDefined();
      }
    });

    it('all configs should have consistent fuzzy value', () => {
      for (const { name, config } of allConfigs) {
        expect(config.searchOptions?.fuzzy, `${name} should have fuzzy: 0.2`).toBe(0.2);
      }
    });

    it('all configs should enable prefix matching', () => {
      for (const { name, config } of allConfigs) {
        expect(config.searchOptions?.prefix, `${name} should have prefix: true`).toBe(true);
      }
    });

    it('all configs should have boost settings', () => {
      for (const { name, config } of allConfigs) {
        expect(config.searchOptions?.boost, `${name} should have boost`).toBeDefined();
        expect(typeof config.searchOptions?.boost, `${name}.boost should be object`).toBe('object');
      }
    });
  });

  describe('Search Config Type Safety', () => {
    it('contextSearchConfig should satisfy SearchConfig interface', () => {
      const config: SearchConfig = contextSearchConfig;
      expect(config.fields).toBeDefined();
    });

    it('rootsSearchConfig should satisfy SearchConfig interface', () => {
      const config: SearchConfig = rootsSearchConfig;
      expect(config.fields).toBeDefined();
    });

    it('librarySearchConfig should satisfy SearchConfig interface', () => {
      const config: SearchConfig = librarySearchConfig;
      expect(config.fields).toBeDefined();
    });

    it('webApiSearchConfig should satisfy SearchConfig interface', () => {
      const config: SearchConfig = webApiSearchConfig;
      expect(config.fields).toBeDefined();
    });
  });
});
