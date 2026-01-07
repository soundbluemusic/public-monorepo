/**
 * @fileoverview Tests for i18n meta factory
 */

import { dynamicMetaFactory, metaFactory } from '@soundblue/i18n/meta';
import { describe, expect, it } from 'vitest';

describe('metaFactory', () => {
  const baseUrl = 'https://example.com';
  const localizedMeta = {
    ko: { title: '소개 - 앱', description: '앱에 대한 소개입니다.' },
    en: { title: 'About - App', description: 'About the application.' },
  };

  it('should return Korean meta for Korean paths', () => {
    const meta = metaFactory(localizedMeta, baseUrl);
    const result = meta({ location: { pathname: '/ko/about' } });

    expect(result).toContainEqual({ title: '소개 - 앱' });
    expect(result).toContainEqual({ name: 'description', content: '앱에 대한 소개입니다.' });
  });

  it('should return English meta for English paths', () => {
    const meta = metaFactory(localizedMeta, baseUrl);
    const result = meta({ location: { pathname: '/about' } });

    expect(result).toContainEqual({ title: 'About - App' });
    expect(result).toContainEqual({ name: 'description', content: 'About the application.' });
  });

  it('should return English meta for root path', () => {
    const meta = metaFactory(localizedMeta, baseUrl);
    const result = meta({ location: { pathname: '/' } });

    expect(result).toContainEqual({ title: 'About - App' });
  });

  it('should return Korean meta for /ko path', () => {
    const meta = metaFactory(localizedMeta, baseUrl);
    const result = meta({ location: { pathname: '/ko' } });

    expect(result).toContainEqual({ title: '소개 - 앱' });
  });

  it('should handle meta without description', () => {
    const metaWithoutDesc = {
      ko: { title: '404 - 앱' },
      en: { title: '404 - App' },
    };
    const meta = metaFactory(metaWithoutDesc, baseUrl);
    const result = meta({ location: { pathname: '/' } });

    // title + 4 link tags (canonical, en, ko, x-default)
    expect(result).toHaveLength(5);
    expect(result).toContainEqual({ title: '404 - App' });
  });

  it('should detect Korean for /ko/ prefix', () => {
    const meta = metaFactory(localizedMeta, baseUrl);
    const result = meta({ location: { pathname: '/ko/entry/hello' } });

    expect(result).toContainEqual({ title: '소개 - 앱' });
  });
});

describe('dynamicMetaFactory', () => {
  const baseUrl = 'https://example.com';

  interface Entry {
    korean: string;
    english: string;
  }

  const getLocalizedMeta = (data: { entry: Entry }) => ({
    ko: {
      title: `${data.entry.korean} - 앱`,
      description: `${data.entry.korean}의 뜻과 예문`,
    },
    en: {
      title: `${data.entry.english} - App`,
      description: `Meaning and examples of ${data.entry.english}`,
    },
  });

  it('should return Korean meta for Korean paths', () => {
    const meta = dynamicMetaFactory(getLocalizedMeta, baseUrl);
    const result = meta({
      location: { pathname: '/ko/entry/hello' },
      data: { entry: { korean: '안녕하세요', english: 'Hello' } },
    });

    expect(result).toContainEqual({ title: '안녕하세요 - 앱' });
    expect(result).toContainEqual({ name: 'description', content: '안녕하세요의 뜻과 예문' });
  });

  it('should return English meta for English paths', () => {
    const meta = dynamicMetaFactory(getLocalizedMeta, baseUrl);
    const result = meta({
      location: { pathname: '/entry/hello' },
      data: { entry: { korean: '안녕하세요', english: 'Hello' } },
    });

    expect(result).toContainEqual({ title: 'Hello - App' });
    expect(result).toContainEqual({
      name: 'description',
      content: 'Meaning and examples of Hello',
    });
  });

  it('should handle meta without description', () => {
    const getMetaWithoutDesc = (data: { title: string }) => ({
      ko: { title: `${data.title} - 앱` },
      en: { title: `${data.title} - App` },
    });

    const meta = dynamicMetaFactory(getMetaWithoutDesc, baseUrl);
    const result = meta({
      location: { pathname: '/' },
      data: { title: 'Test' },
    });

    // title + 4 link tags (canonical, en, ko, x-default)
    expect(result).toHaveLength(5);
    expect(result).toContainEqual({ title: 'Test - App' });
  });

  it('should work with complex nested data', () => {
    const getComplexMeta = (data: { nested: { deep: { value: string } } }) => ({
      ko: { title: data.nested.deep.value },
      en: { title: data.nested.deep.value },
    });

    const meta = dynamicMetaFactory(getComplexMeta, baseUrl);
    const result = meta({
      location: { pathname: '/' },
      data: { nested: { deep: { value: 'Deep Value' } } },
    });

    expect(result).toContainEqual({ title: 'Deep Value' });
  });
});
