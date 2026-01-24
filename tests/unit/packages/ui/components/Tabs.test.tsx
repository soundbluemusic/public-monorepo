/**
 * @fileoverview Tests for Tabs compound component
 */

import { Tabs } from '@soundblue/ui/components';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('Tabs', () => {
  describe('basic rendering', () => {
    it('should render tabs with triggers and content', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );

      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('should show only active tab content', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });
  });

  describe('tab switching', () => {
    it('should switch tab content on trigger click', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );

      // Initially tab1 is selected
      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Click tab2
      fireEvent.click(screen.getByText('Tab 2'));

      // Content should switch
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should call onValueChange when tab is switched', () => {
      const onValueChange = vi.fn();

      render(
        <Tabs defaultValue="tab1" onValueChange={onValueChange}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );

      fireEvent.click(screen.getByText('Tab 2'));
      expect(onValueChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('controlled mode', () => {
    it('should work in controlled mode', () => {
      const onValueChange = vi.fn();

      const { rerender } = render(
        <Tabs value="tab1" onValueChange={onValueChange}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Click tab2
      fireEvent.click(screen.getByText('Tab 2'));
      expect(onValueChange).toHaveBeenCalledWith('tab2');

      // Content should not change until value prop changes
      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Update value prop
      rerender(
        <Tabs value="tab2" onValueChange={onValueChange}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );

      // Verify Content 2 is shown and Content 1 is hidden
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });
  });

  describe('forceMount', () => {
    it('should keep content in DOM when forceMount is true', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2" forceMount>
            Content 2
          </Tabs.Content>
        </Tabs>,
      );

      // Tab2 content should be in DOM but hidden
      const content2 = screen.getByText('Content 2');
      expect(content2).toBeInTheDocument();
      // The tabpanel with forceMount has hidden attribute
      const tabpanel = content2.closest('[role="tabpanel"]');
      expect(tabpanel).toHaveAttribute('hidden');
    });
  });

  describe('disabled state', () => {
    it('should not switch to disabled tab', () => {
      const onValueChange = vi.fn();

      render(
        <Tabs defaultValue="tab1" onValueChange={onValueChange}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2" disabled>
              Tab 2
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );

      const disabledTrigger = screen.getByText('Tab 2');
      expect(disabledTrigger).toBeDisabled();

      fireEvent.click(disabledTrigger);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should apply disabled styling', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2" disabled>
              Tab 2
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>,
      );

      const disabledTrigger = screen.getByText('Tab 2');
      expect(disabledTrigger).toHaveClass('opacity-50');
      expect(disabledTrigger).toHaveClass('cursor-not-allowed');
    });
  });

  describe('accessibility', () => {
    it('should have correct role attributes', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );

      // Check tablist role
      expect(screen.getByRole('tablist')).toBeInTheDocument();

      // Check tab roles
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);

      // Check tabpanel role
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('should set aria-selected on active tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );

      const tab1 = screen.getByText('Tab 1');
      const tab2 = screen.getByText('Tab 2');

      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');
    });

    it('should set tabIndex correctly', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>,
      );

      const tab1 = screen.getByText('Tab 1');
      const tab2 = screen.getByText('Tab 2');

      expect(tab1).toHaveAttribute('tabindex', '0');
      expect(tab2).toHaveAttribute('tabindex', '-1');
    });

    it('should have aria-controls on trigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>,
      );

      const trigger = screen.getByText('Tab 1');
      const content = screen.getByRole('tabpanel');

      expect(trigger).toHaveAttribute('aria-controls', content.id);
    });

    it('should have aria-labelledby on content', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>,
      );

      const trigger = screen.getByText('Tab 1');
      const content = screen.getByRole('tabpanel');

      expect(content).toHaveAttribute('aria-labelledby', trigger.id);
    });
  });

  describe('error handling', () => {
    it('should throw error when Trigger is used outside Tabs', () => {
      const consoleError = console.error;
      console.error = () => {};

      expect(() => {
        render(<Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>);
      }).toThrow('<Tabs.Trigger> must be used within <Tabs>');

      console.error = consoleError;
    });

    it('should throw error when Content is used outside Tabs', () => {
      const consoleError = console.error;
      console.error = () => {};

      expect(() => {
        render(<Tabs.Content value="tab1">Content 1</Tabs.Content>);
      }).toThrow('<Tabs.Content> must be used within <Tabs>');

      console.error = consoleError;
    });
  });

  describe('styling', () => {
    it('should apply className to root', () => {
      render(
        <Tabs defaultValue="tab1" className="custom-tabs">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>,
      );

      const root = document.querySelector('[data-tabs-root]');
      expect(root).toHaveClass('custom-tabs');
    });

    it('should apply className to List', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List className="custom-list">
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>,
      );

      const list = screen.getByRole('tablist');
      expect(list).toHaveClass('custom-list');
    });

    it('should apply className to Trigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1" className="custom-trigger">
              Tab 1
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>,
      );

      const trigger = screen.getByRole('tab');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should apply className to Content', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1" className="custom-content">
            Content 1
          </Tabs.Content>
        </Tabs>,
      );

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveClass('custom-content');
    });

    it('should apply active styles to selected tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>,
      );

      const activeTab = screen.getByText('Tab 1');
      expect(activeTab).toHaveClass('shadow-sm');
    });
  });

  describe('default value', () => {
    it('should use empty string when no defaultValue is provided', () => {
      render(
        <Tabs>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>,
      );

      // No content should be shown initially
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });
  });
});
