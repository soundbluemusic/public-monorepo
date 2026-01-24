/**
 * @fileoverview Unit tests for Permissive library schema
 */

import { LibrarySchema } from '@soundblue/data/schemas/permissive';
import { describe, expect, it } from 'vitest';

describe('LibrarySchema', () => {
  it('should validate valid library', () => {
    const valid = {
      name: 'React',
      description: 'A JavaScript library for building user interfaces',
      descriptionKo: '사용자 인터페이스를 구축하기 위한 자바스크립트 라이브러리',
      category: 'UI Framework',
      license: 'MIT',
      github: 'https://github.com/facebook/react',
      stars: '220k+',
    };
    expect(LibrarySchema.safeParse(valid).success).toBe(true);
  });

  it('should validate library with all optional fields', () => {
    const valid = {
      name: 'Vue',
      description: 'Progressive JavaScript framework',
      descriptionKo: '진보적인 자바스크립트 프레임워크',
      category: 'UI Framework',
      license: 'MIT',
      github: 'https://github.com/vuejs/core',
      website: 'https://vuejs.org',
      npm: 'vue',
      stars: '45k+',
      usedHere: true,
      trending: true,
      yearReleased: 2014,
      tags: ['frontend', 'reactive', 'typescript'],
    };
    expect(LibrarySchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty name', () => {
    const invalid = {
      name: '',
      description: 'Description',
      descriptionKo: '설명',
      category: 'Category',
      license: 'MIT',
      github: 'https://github.com/test/test',
      stars: '1k+',
    };
    expect(LibrarySchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject invalid github URL', () => {
    const invalid = {
      name: 'Test',
      description: 'Description',
      descriptionKo: '설명',
      category: 'Category',
      license: 'MIT',
      github: 'not-a-url',
      stars: '1k+',
    };
    expect(LibrarySchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject invalid website URL when provided', () => {
    const invalid = {
      name: 'Test',
      description: 'Description',
      descriptionKo: '설명',
      category: 'Category',
      license: 'MIT',
      github: 'https://github.com/test/test',
      website: 'not-a-url',
      stars: '1k+',
    };
    expect(LibrarySchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject yearReleased before 1990', () => {
    const invalid = {
      name: 'Test',
      description: 'Description',
      descriptionKo: '설명',
      category: 'Category',
      license: 'MIT',
      github: 'https://github.com/test/test',
      stars: '1k+',
      yearReleased: 1989,
    };
    expect(LibrarySchema.safeParse(invalid).success).toBe(false);
  });

  it('should accept yearReleased 1990 or later', () => {
    const valid = {
      name: 'Test',
      description: 'Description',
      descriptionKo: '설명',
      category: 'Category',
      license: 'MIT',
      github: 'https://github.com/test/test',
      stars: '1k+',
      yearReleased: 1990,
    };
    expect(LibrarySchema.safeParse(valid).success).toBe(true);
  });

  it('should reject non-integer yearReleased', () => {
    const invalid = {
      name: 'Test',
      description: 'Description',
      descriptionKo: '설명',
      category: 'Category',
      license: 'MIT',
      github: 'https://github.com/test/test',
      stars: '1k+',
      yearReleased: 2020.5,
    };
    expect(LibrarySchema.safeParse(invalid).success).toBe(false);
  });
});
