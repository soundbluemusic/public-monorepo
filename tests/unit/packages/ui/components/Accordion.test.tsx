/**
 * @fileoverview Tests for Accordion compound component
 */

import { Accordion } from '@soundblue/ui/components';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('Accordion', () => {
  describe('single mode', () => {
    it('should render accordion with items', () => {
      render(
        <Accordion type="single">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Section 2</Accordion.Trigger>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
    });

    it('should open item on click', () => {
      render(
        <Accordion type="single">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      const trigger = screen.getByText('Section 1');
      fireEvent.click(trigger);

      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('should close previous item when opening new item in single mode', () => {
      render(
        <Accordion type="single">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Section 2</Accordion.Trigger>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      // Open first item
      fireEvent.click(screen.getByText('Section 1'));
      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Open second item (first should close)
      fireEvent.click(screen.getByText('Section 2'));
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      // Verify first item is closed
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });

    it('should keep item open when clicking same item without collapsible', () => {
      render(
        <Accordion type="single">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      const trigger = screen.getByText('Section 1');

      // Open item
      fireEvent.click(trigger);
      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Click again - should stay open (no collapsible)
      fireEvent.click(trigger);
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('should collapse item when clicking same item with collapsible', () => {
      render(
        <Accordion type="single" collapsible>
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      const trigger = screen.getByText('Section 1');

      // Open item
      fireEvent.click(trigger);
      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Click again with collapsible - should close
      fireEvent.click(trigger);
      // Verify content is hidden (collapsed)
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });

    it('should respect defaultValue', () => {
      render(
        <Accordion type="single" defaultValue="item-2">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Section 2</Accordion.Trigger>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      // Item 2 should be open by default
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should call onValueChange when item is toggled', () => {
      const onValueChange = vi.fn();

      render(
        <Accordion type="single" onValueChange={onValueChange}>
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      fireEvent.click(screen.getByText('Section 1'));
      expect(onValueChange).toHaveBeenCalledWith('item-1');
    });

    it('should work in controlled mode', () => {
      const onValueChange = vi.fn();

      const { rerender } = render(
        <Accordion type="single" value="item-1" onValueChange={onValueChange}>
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Section 2</Accordion.Trigger>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Click item 2
      fireEvent.click(screen.getByText('Section 2'));
      expect(onValueChange).toHaveBeenCalledWith('item-2');

      // Rerender with new value
      rerender(
        <Accordion type="single" value="item-2" onValueChange={onValueChange}>
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Section 2</Accordion.Trigger>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      // Verify item 2 is now open and item 1 is closed
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });
  });

  describe('multiple mode', () => {
    it('should allow multiple items to be open', () => {
      render(
        <Accordion type="multiple">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Section 2</Accordion.Trigger>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      // Open both items
      fireEvent.click(screen.getByText('Section 1'));
      fireEvent.click(screen.getByText('Section 2'));

      // Both should be visible
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should toggle individual items in multiple mode', () => {
      render(
        <Accordion type="multiple">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Section 2</Accordion.Trigger>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      // Open both
      fireEvent.click(screen.getByText('Section 1'));
      fireEvent.click(screen.getByText('Section 2'));

      // Close first
      fireEvent.click(screen.getByText('Section 1'));

      // Only second should be visible
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should respect defaultValue array', () => {
      render(
        <Accordion type="multiple" defaultValue={['item-1', 'item-2']}>
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Section 2</Accordion.Trigger>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-3">
            <Accordion.Trigger>Section 3</Accordion.Trigger>
            <Accordion.Content>Content 3</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      // Items 1 and 2 should be open
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should call onValueChange with array in multiple mode', () => {
      const onValueChange = vi.fn();

      render(
        <Accordion type="multiple" onValueChange={onValueChange}>
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      fireEvent.click(screen.getByText('Section 1'));
      expect(onValueChange).toHaveBeenCalledWith(['item-1']);
    });

    it('should work in controlled mode with array value', () => {
      const onValueChange = vi.fn();

      render(
        <Accordion type="multiple" value={['item-1']} onValueChange={onValueChange}>
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Section 2</Accordion.Trigger>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      // Content 2 is not open yet (controlled by value prop)
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Section 2'));
      expect(onValueChange).toHaveBeenCalledWith(['item-1', 'item-2']);

      // UI should NOT change until value prop is updated (controlled mode)
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have correct aria attributes', () => {
      render(
        <Accordion type="single" defaultValue="item-1">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      const trigger = screen.getByRole('button', { name: 'Section 1' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveAttribute('aria-controls');
    });

    it('should set aria-expanded to false when closed', () => {
      render(
        <Accordion type="single">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      const trigger = screen.getByRole('button', { name: 'Section 1' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should have data-state attribute on item', () => {
      render(
        <Accordion type="single" defaultValue="item-1">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      const trigger = screen.getByText('Section 1');
      const item = trigger.closest('[data-state]');
      expect(item).toHaveAttribute('data-state', 'open');
    });
  });

  describe('error handling', () => {
    it('should throw error when Item is used outside Accordion', () => {
      const consoleError = console.error;
      console.error = () => {};

      expect(() => {
        render(
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>,
        );
      }).toThrow('<Accordion.Item> must be used within <Accordion>');

      console.error = consoleError;
    });

    it('should throw error when Trigger is used outside Item', () => {
      const consoleError = console.error;
      console.error = () => {};

      expect(() => {
        render(
          <Accordion type="single">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
          </Accordion>,
        );
      }).toThrow('<Accordion.Trigger> must be used within <Accordion.Item>');

      console.error = consoleError;
    });

    it('should throw error when Content is used outside Item', () => {
      const consoleError = console.error;
      console.error = () => {};

      expect(() => {
        render(
          <Accordion type="single">
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion>,
        );
      }).toThrow('<Accordion.Content> must be used within <Accordion.Item>');

      console.error = consoleError;
    });
  });

  describe('styling', () => {
    it('should apply className to root', () => {
      render(
        <Accordion type="single" className="custom-class">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      const root = document.querySelector('[data-accordion-root]');
      expect(root).toHaveClass('custom-class');
    });

    it('should apply className to trigger', () => {
      render(
        <Accordion type="single">
          <Accordion.Item value="item-1">
            <Accordion.Trigger className="trigger-class">Section 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('trigger-class');
    });
  });
});
