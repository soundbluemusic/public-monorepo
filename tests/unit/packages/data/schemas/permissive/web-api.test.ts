/**
 * @fileoverview Unit tests for Permissive web-api schema
 */

import { WebAPISchema } from '@soundblue/data/schemas/permissive';
import { describe, expect, it } from 'vitest';

describe('WebAPISchema', () => {
  it('should validate valid web API', () => {
    const valid = {
      name: 'Fetch API',
      description: 'Interface for fetching resources',
      descriptionKo: '리소스를 가져오기 위한 인터페이스',
      category: 'Network',
      support: 'All modern browsers',
      mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
    };
    expect(WebAPISchema.safeParse(valid).success).toBe(true);
  });

  it('should validate web API with optional fields', () => {
    const valid = {
      name: 'Web Storage API',
      description: 'Mechanisms for storing key-value pairs',
      descriptionKo: '키-값 쌍을 저장하기 위한 메커니즘',
      category: 'Storage',
      support: 'All browsers',
      mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API',
      trending: true,
      yearStable: 2015,
    };
    expect(WebAPISchema.safeParse(valid).success).toBe(true);
  });

  it('should reject empty name', () => {
    const invalid = {
      name: '',
      description: 'Description',
      descriptionKo: '설명',
      category: 'Category',
      support: 'All browsers',
      mdnUrl: 'https://developer.mozilla.org/test',
    };
    expect(WebAPISchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject invalid mdnUrl', () => {
    const invalid = {
      name: 'Test API',
      description: 'Description',
      descriptionKo: '설명',
      category: 'Category',
      support: 'All browsers',
      mdnUrl: 'not-a-url',
    };
    expect(WebAPISchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject yearStable before 1990', () => {
    const invalid = {
      name: 'Test API',
      description: 'Description',
      descriptionKo: '설명',
      category: 'Category',
      support: 'All browsers',
      mdnUrl: 'https://developer.mozilla.org/test',
      yearStable: 1989,
    };
    expect(WebAPISchema.safeParse(invalid).success).toBe(false);
  });

  it('should accept yearStable 1990 or later', () => {
    const valid = {
      name: 'Test API',
      description: 'Description',
      descriptionKo: '설명',
      category: 'Category',
      support: 'All browsers',
      mdnUrl: 'https://developer.mozilla.org/test',
      yearStable: 2020,
    };
    expect(WebAPISchema.safeParse(valid).success).toBe(true);
  });

  it('should reject non-integer yearStable', () => {
    const invalid = {
      name: 'Test API',
      description: 'Description',
      descriptionKo: '설명',
      category: 'Category',
      support: 'All browsers',
      mdnUrl: 'https://developer.mozilla.org/test',
      yearStable: 2020.5,
    };
    expect(WebAPISchema.safeParse(invalid).success).toBe(false);
  });

  it('should reject missing support field', () => {
    const invalid = {
      name: 'Test API',
      description: 'Description',
      descriptionKo: '설명',
      category: 'Category',
      mdnUrl: 'https://developer.mozilla.org/test',
    };
    expect(WebAPISchema.safeParse(invalid).success).toBe(false);
  });
});
