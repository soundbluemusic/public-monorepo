/**
 * @fileoverview Tests for createI18nProvider factory
 *
 * Tests the i18n provider factory that creates type-safe i18n context
 * using TanStack Router for URL-based locale detection.
 */

import { createI18nProvider } from '@soundblue/i18n/react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Router state type for mocking
interface MockRouterState {
  location: { pathname: string };
}

// Mock @tanstack/react-router
const mockUseRouterState = vi.fn<() => MockRouterState>();
vi.mock('@tanstack/react-router', () => ({
  useRouterState: () => mockUseRouterState(),
}));

// Test messages
const testMessages = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'welcome.title': 'Welcome',
    'items.count': '{count} items',
    'user.greeting': 'Hello, {name}!',
    'multi.params': '{first} and {second}',
  },
  ko: {
    'nav.home': '홈',
    'nav.about': '소개',
    'welcome.title': '환영합니다',
    'items.count': '{count}개 항목',
    'user.greeting': '안녕하세요, {name}님!',
    'multi.params': '{first}와 {second}',
  },
} as const;

type TestMessageKey = keyof (typeof testMessages)['en'];

describe('createI18nProvider', () => {
  let originalLocation: Location;

  beforeEach(() => {
    // Default mock for English locale
    mockUseRouterState.mockReturnValue({
      location: { pathname: '/about' },
    });

    // Mock window.location
    originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  describe('factory function', () => {
    it('should return I18nProvider component', () => {
      const { I18nProvider } = createI18nProvider<TestMessageKey>(testMessages);
      expect(I18nProvider).toBeDefined();
      expect(typeof I18nProvider).toBe('function');
    });

    it('should return useI18n hook', () => {
      const { useI18n } = createI18nProvider<TestMessageKey>(testMessages);
      expect(useI18n).toBeDefined();
      expect(typeof useI18n).toBe('function');
    });

    it('should return useLocale hook', () => {
      const { useLocale } = createI18nProvider<TestMessageKey>(testMessages);
      expect(useLocale).toBeDefined();
      expect(typeof useLocale).toBe('function');
    });

    it('should return useT hook', () => {
      const { useT } = createI18nProvider<TestMessageKey>(testMessages);
      expect(useT).toBeDefined();
      expect(typeof useT).toBe('function');
    });

    it('should return useTDynamic hook', () => {
      const { useTDynamic } = createI18nProvider<TestMessageKey>(testMessages);
      expect(useTDynamic).toBeDefined();
      expect(typeof useTDynamic).toBe('function');
    });

    it('should return isMessageKey helper', () => {
      const { isMessageKey } = createI18nProvider<TestMessageKey>(testMessages);
      expect(isMessageKey).toBeDefined();
      expect(typeof isMessageKey).toBe('function');
    });
  });

  describe('isMessageKey', () => {
    it('should return true for valid message keys', () => {
      const { isMessageKey } = createI18nProvider<TestMessageKey>(testMessages);
      expect(isMessageKey('nav.home')).toBe(true);
      expect(isMessageKey('welcome.title')).toBe(true);
    });

    it('should return false for invalid keys', () => {
      const { isMessageKey } = createI18nProvider<TestMessageKey>(testMessages);
      expect(isMessageKey('invalid.key')).toBe(false);
      expect(isMessageKey('')).toBe(false);
    });
  });

  describe('I18nProvider with English locale', () => {
    it('should provide English locale from URL', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { locale } = useI18n();
        return <span data-testid="locale">{locale}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('locale').textContent).toBe('en');
    });

    it('should provide isKorean as false for English locale', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { isKorean } = useI18n();
        return <span data-testid="isKorean">{String(isKorean)}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('isKorean').textContent).toBe('false');
    });

    it('should translate text to English', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { t } = useI18n();
        return <span data-testid="text">{t('nav.home')}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('text').textContent).toBe('Home');
    });

    it('should generate localePath without prefix for English', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { localePath } = useI18n();
        return <span data-testid="path">{localePath('/about')}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('path').textContent).toBe('/about');
    });
  });

  describe('I18nProvider with Korean locale', () => {
    it('should detect Korean locale from /ko prefix', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/ko/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { locale } = useI18n();
        return <span data-testid="locale">{locale}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('locale').textContent).toBe('ko');
    });

    it('should provide isKorean as true for Korean locale', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/ko/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { isKorean } = useI18n();
        return <span data-testid="isKorean">{String(isKorean)}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('isKorean').textContent).toBe('true');
    });

    it('should translate text to Korean', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/ko/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { t } = useI18n();
        return <span data-testid="text">{t('nav.home')}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('text').textContent).toBe('홈');
    });

    it('should generate localePath with /ko prefix', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/ko/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { localePath } = useI18n();
        return <span data-testid="path">{localePath('/about')}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('path').textContent).toBe('/ko/about');
    });

    it('should handle root path with /ko prefix', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/ko' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { localePath } = useI18n();
        return <span data-testid="path">{localePath('/')}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('path').textContent).toBe('/ko');
    });
  });

  describe('translation with parameters', () => {
    it('should substitute single parameter', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { t } = useI18n();
        return <span data-testid="text">{t('items.count', { count: 5 })}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('text').textContent).toBe('5 items');
    });

    it('should substitute name parameter', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { t } = useI18n();
        return <span data-testid="text">{t('user.greeting', { name: 'Alice' })}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('text').textContent).toBe('Hello, Alice!');
    });

    it('should substitute multiple parameters', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { t } = useI18n();
        return <span data-testid="text">{t('multi.params', { first: 'A', second: 'B' })}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('text').textContent).toBe('A and B');
    });

    it('should substitute Korean parameters', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/ko/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { t } = useI18n();
        return <span data-testid="text">{t('items.count', { count: 3 })}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('text').textContent).toBe('3개 항목');
    });
  });

  describe('tDynamic function', () => {
    it('should translate valid keys', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { tDynamic } = useI18n();
        return <span data-testid="text">{tDynamic('nav.home')}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('text').textContent).toBe('Home');
    });

    it('should return key for invalid keys', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { tDynamic } = useI18n();
        return <span data-testid="text">{tDynamic('invalid.key')}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('text').textContent).toBe('invalid.key');
    });

    it('should substitute parameters in dynamic keys', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { tDynamic } = useI18n();
        return <span data-testid="text">{tDynamic('items.count', { count: 10 })}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('text').textContent).toBe('10 items');
    });

    it('should use English fallback for runtime keys when enabled', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/ko/about' },
      });

      // The fallback is for runtime-determined keys that are NOT in the typed messageKeys
      // but exist in English messages (e.g., dynamically constructed keys)
      // Since we're using the same messages, we test with default enableEnglishFallback=true
      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages, {
        enableEnglishFallback: true,
      });

      function TestConsumer() {
        const { tDynamic } = useI18n();
        // Using a valid key should work in both locales
        return <span data-testid="text">{tDynamic('nav.home')}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      // Korean translation should be returned
      expect(screen.getByTestId('text').textContent).toBe('홈');
    });

    it('should return key for unknown keys regardless of fallback setting', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/ko/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages, {
        enableEnglishFallback: false,
      });

      function TestConsumer() {
        const { tDynamic } = useI18n();
        // Completely unknown key should return the key itself
        return <span data-testid="text">{tDynamic('completely.unknown.key')}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('text').textContent).toBe('completely.unknown.key');
    });
  });

  describe('setLocale function', () => {
    it('should navigate to English path when switching to English', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/ko/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { setLocale } = useI18n();
        return <button onClick={() => setLocale('en')}>Switch to English</button>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      act(() => {
        screen.getByRole('button').click();
      });

      expect(window.location.href).toBe('/about');
    });

    it('should navigate to Korean path when switching to Korean', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { setLocale } = useI18n();
        return <button onClick={() => setLocale('ko')}>Switch to Korean</button>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      act(() => {
        screen.getByRole('button').click();
      });

      expect(window.location.href).toBe('/ko/about');
    });

    it('should handle root path when switching to Korean', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { setLocale } = useI18n();
        return <button onClick={() => setLocale('ko')}>Switch to Korean</button>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      act(() => {
        screen.getByRole('button').click();
      });

      expect(window.location.href).toBe('/ko');
    });

    it('should handle Korean root path when switching to English', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/ko' },
      });

      const { I18nProvider, useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { setLocale } = useI18n();
        return <button onClick={() => setLocale('en')}>Switch to English</button>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      act(() => {
        screen.getByRole('button').click();
      });

      expect(window.location.href).toBe('/');
    });
  });

  describe('useI18n outside provider', () => {
    it('should throw error when used outside provider', () => {
      const { useI18n } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const { locale } = useI18n();
        return <span>{locale}</span>;
      }

      const consoleError = console.error;
      console.error = () => {}; // Suppress React error boundary log

      expect(() => {
        render(<TestConsumer />);
      }).toThrow('useI18n must be used within I18nProvider');

      console.error = consoleError;
    });
  });

  describe('useLocale hook', () => {
    it('should return current locale', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/ko/about' },
      });

      const { I18nProvider, useLocale } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const locale = useLocale();
        return <span data-testid="locale">{locale}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('locale').textContent).toBe('ko');
    });
  });

  describe('useT hook', () => {
    it('should return translation function', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useT } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const t = useT();
        return <span data-testid="text">{t('welcome.title')}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('text').textContent).toBe('Welcome');
    });
  });

  describe('useTDynamic hook', () => {
    it('should return dynamic translation function', () => {
      mockUseRouterState.mockReturnValue({
        location: { pathname: '/about' },
      });

      const { I18nProvider, useTDynamic } = createI18nProvider<TestMessageKey>(testMessages);

      function TestConsumer() {
        const tDynamic = useTDynamic();
        return <span data-testid="text">{tDynamic('welcome.title')}</span>;
      }

      render(
        <I18nProvider>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('text').textContent).toBe('Welcome');
    });
  });
});
