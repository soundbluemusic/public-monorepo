/**
 * @soundblue/i18n - I18nProvider Tests
 *
 * I18n React Context Provider 테스트
 */

import type { Messages } from '@soundblue/i18n';
import { I18nProvider, useI18n } from '@soundblue/i18n/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const enMessages: Messages = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'welcome.title': 'Welcome',
  'items.count': '{count} items',
  'user.greeting': 'Hello, {name}!',
};

const koMessages: Messages = {
  'nav.home': '홈',
  'nav.about': '소개',
  'welcome.title': '환영합니다',
  'items.count': '{count}개 항목',
  'user.greeting': '안녕하세요, {name}님!',
};

function TestConsumer() {
  const { t, lang, isKorean, localePath } = useI18n();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="isKorean">{String(isKorean)}</span>
      <span data-testid="home">{t('nav.home')}</span>
      <span data-testid="about">{t('nav.about')}</span>
      <span data-testid="welcome">{t('welcome.title')}</span>
      <span data-testid="items">{t('items.count', { count: '5' })}</span>
      <span data-testid="greeting">{t('user.greeting', { name: 'Alice' })}</span>
      <span data-testid="missing">{t('nonexistent.key')}</span>
      <span data-testid="localePath">{localePath('/about')}</span>
    </div>
  );
}

describe('@soundblue/i18n/react - I18nProvider', () => {
  describe('English locale', () => {
    it('should provide lang="en"', () => {
      render(
        <I18nProvider lang="en" messages={enMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('lang').textContent).toBe('en');
    });

    it('should provide isKorean=false', () => {
      render(
        <I18nProvider lang="en" messages={enMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('isKorean').textContent).toBe('false');
    });

    it('should translate nav.home to English', () => {
      render(
        <I18nProvider lang="en" messages={enMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('home').textContent).toBe('Home');
    });

    it('should translate nav.about to English', () => {
      render(
        <I18nProvider lang="en" messages={enMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('about').textContent).toBe('About');
    });

    it('should generate localePath without prefix for English', () => {
      render(
        <I18nProvider lang="en" messages={enMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('localePath').textContent).toBe('/about');
    });
  });

  describe('Korean locale', () => {
    it('should provide lang="ko"', () => {
      render(
        <I18nProvider lang="ko" messages={koMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('lang').textContent).toBe('ko');
    });

    it('should provide isKorean=true', () => {
      render(
        <I18nProvider lang="ko" messages={koMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('isKorean').textContent).toBe('true');
    });

    it('should translate nav.home to Korean', () => {
      render(
        <I18nProvider lang="ko" messages={koMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('home').textContent).toBe('홈');
    });

    it('should generate localePath with /ko prefix', () => {
      render(
        <I18nProvider lang="ko" messages={koMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('localePath').textContent).toBe('/ko/about');
    });
  });

  describe('translation parameters', () => {
    it('should substitute single parameter', () => {
      render(
        <I18nProvider lang="en" messages={enMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('items').textContent).toBe('5 items');
    });

    it('should substitute name parameter', () => {
      render(
        <I18nProvider lang="en" messages={enMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('greeting').textContent).toBe('Hello, Alice!');
    });

    it('should substitute Korean parameters', () => {
      render(
        <I18nProvider lang="ko" messages={koMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('items').textContent).toBe('5개 항목');
    });

    it('should substitute Korean greeting', () => {
      render(
        <I18nProvider lang="ko" messages={koMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('greeting').textContent).toBe('안녕하세요, Alice님!');
    });
  });

  describe('missing translations', () => {
    it('should return key for missing translation', () => {
      render(
        <I18nProvider lang="en" messages={enMessages}>
          <TestConsumer />
        </I18nProvider>,
      );

      expect(screen.getByTestId('missing').textContent).toBe('nonexistent.key');
    });
  });

  describe('useI18n hook outside provider', () => {
    it('should throw error when used outside provider', () => {
      const consoleError = console.error;
      console.error = () => {}; // Suppress React error boundary log

      expect(() => {
        render(<TestConsumer />);
      }).toThrow('useI18n must be used within I18nProvider');

      console.error = consoleError;
    });
  });
});
