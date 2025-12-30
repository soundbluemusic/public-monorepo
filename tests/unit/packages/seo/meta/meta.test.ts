/**
 * @fileoverview Unit tests for metaFactory utility
 */

import { dynamicMetaFactory, metaFactory } from '@soundblue/seo/meta';
import { describe, expect, it } from 'vitest';

describe('metaFactory', () => {
  it('should generate meta function for static content', () => {
    const meta = metaFactory({
      ko: { title: '한국어 제목', description: '한국어 설명' },
      en: { title: 'English Title', description: 'English description' },
    });

    expect(typeof meta).toBe('function');
  });

  it('should return Korean meta for /ko path', () => {
    const meta = metaFactory({
      ko: { title: '한국어 제목', description: '한국어 설명' },
      en: { title: 'English Title', description: 'English description' },
    });

    const result = meta({ location: { pathname: '/ko/page' } } as Parameters<typeof meta>[0]);

    expect(result).toContainEqual({ title: '한국어 제목' });
    expect(result).toContainEqual({ name: 'description', content: '한국어 설명' });
  });

  it('should return English meta for non-ko path', () => {
    const meta = metaFactory({
      ko: { title: '한국어 제목', description: '한국어 설명' },
      en: { title: 'English Title', description: 'English description' },
    });

    const result = meta({ location: { pathname: '/page' } } as Parameters<typeof meta>[0]);

    expect(result).toContainEqual({ title: 'English Title' });
    expect(result).toContainEqual({ name: 'description', content: 'English description' });
  });

  it('should handle title-only meta (no description)', () => {
    const meta = metaFactory({
      ko: { title: '제목만' },
      en: { title: 'Title Only' },
    });

    const result = meta({ location: { pathname: '/' } } as Parameters<typeof meta>[0]);

    expect(result).toContainEqual({ title: 'Title Only' });
    expect(result).toHaveLength(1); // Only title, no description
  });
});

describe('dynamicMetaFactory', () => {
  it('should generate meta from loader data', () => {
    const meta = dynamicMetaFactory<{ item: { name: string; desc: string } }>((data) => ({
      ko: { title: `${data.item.name} - 앱`, description: data.item.desc },
      en: { title: `${data.item.name} - App`, description: data.item.desc },
    }));

    const result = meta({
      location: { pathname: '/item/1' },
      data: { item: { name: 'Test', desc: 'Test description' } },
    });

    expect(result).toContainEqual({ title: 'Test - App' });
    expect(result).toContainEqual({ name: 'description', content: 'Test description' });
  });

  it('should handle missing data gracefully', () => {
    const meta = dynamicMetaFactory<{ item?: { name: string } }>((data) => ({
      ko: { title: data?.item?.name ?? 'Default', description: 'Default description' },
      en: { title: data?.item?.name ?? 'Default', description: 'Default description' },
    }));

    const result = meta({
      location: { pathname: '/' },
      data: {},
    });

    expect(result).toContainEqual({ title: 'Default' });
  });

  it('should detect Korean locale from path', () => {
    const meta = dynamicMetaFactory<{ name: string }>((_data) => ({
      ko: { title: '한국어', description: 'desc' },
      en: { title: 'English', description: 'desc' },
    }));

    const koResult = meta({
      location: { pathname: '/ko/page' },
      data: { name: 'test' },
    });

    const enResult = meta({
      location: { pathname: '/page' },
      data: { name: 'test' },
    });

    expect(koResult).toContainEqual({ title: '한국어' });
    expect(enResult).toContainEqual({ title: 'English' });
  });
});
