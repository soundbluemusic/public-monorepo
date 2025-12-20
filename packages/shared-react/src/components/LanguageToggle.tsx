import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { Language } from '../utils/i18n';

export interface LanguageToggleProps {
  locale: Language;
  onLocaleChange: (lang: Language) => void;
}

/**
 * Language toggle dropdown using Radix UI DropdownMenu
 */
export function LanguageToggle({ locale, onLocaleChange }: LanguageToggleProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="px-2 py-1.5 text-sm cursor-pointer rounded-lg transition-colors hover:bg-(--bg-tertiary)"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Select language"
        >
          {locale === 'en' ? 'EN' : 'KR'}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[120px] rounded-lg p-1 shadow-lg z-50"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
          sideOffset={5}
        >
          <DropdownMenu.Item
            className="px-3 py-2 text-sm rounded-md cursor-pointer outline-none transition-colors hover:bg-(--bg-tertiary)"
            style={{ color: locale === 'en' ? 'var(--accent-primary)' : 'var(--text-primary)' }}
            onSelect={() => onLocaleChange('en')}
          >
            English
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="px-3 py-2 text-sm rounded-md cursor-pointer outline-none transition-colors hover:bg-(--bg-tertiary)"
            style={{ color: locale === 'ko' ? 'var(--accent-primary)' : 'var(--text-primary)' }}
            onSelect={() => onLocaleChange('ko')}
          >
            한국어
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
