import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  AnimatePresence,
  FadeIn,
  Pressable,
  ScaleIn,
  SlideUp,
  Stagger,
  StaggerItem,
} from './motion';

const meta = {
  title: 'Animation/Motion',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const FadeInDemo: StoryObj = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setShow(!show)} className="btn-primary px-4 py-2">
          Toggle
        </button>
        <AnimatePresence>
          {show && (
            <FadeIn className="p-4 bg-(--bg-elevated) border border-(--border-primary) rounded-lg">
              <p className="text-(--text-primary)">This content fades in and out</p>
            </FadeIn>
          )}
        </AnimatePresence>
      </div>
    );
  },
};

export const SlideUpDemo: StoryObj = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setShow(!show)} className="btn-primary px-4 py-2">
          Toggle
        </button>
        <AnimatePresence>
          {show && (
            <SlideUp className="p-4 bg-(--bg-elevated) border border-(--border-primary) rounded-lg">
              <p className="text-(--text-primary)">This content slides up from below</p>
            </SlideUp>
          )}
        </AnimatePresence>
      </div>
    );
  },
};

export const ScaleInDemo: StoryObj = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setShow(!show)} className="btn-primary px-4 py-2">
          Toggle
        </button>
        <AnimatePresence>
          {show && (
            <ScaleIn className="p-4 bg-(--bg-elevated) border border-(--border-primary) rounded-lg">
              <p className="text-(--text-primary)">This content scales in</p>
            </ScaleIn>
          )}
        </AnimatePresence>
      </div>
    );
  },
};

export const StaggerDemo: StoryObj = {
  render: () => {
    const items = ['First item', 'Second item', 'Third item', 'Fourth item'];
    return (
      <Stagger className="space-y-2" staggerDelay={0.1}>
        {items.map((item) => (
          <StaggerItem
            key={item}
            className="p-3 bg-(--bg-elevated) border border-(--border-primary) rounded-lg"
          >
            <p className="text-(--text-primary)">{item}</p>
          </StaggerItem>
        ))}
      </Stagger>
    );
  },
};

export const PressableDemo: StoryObj = {
  render: () => (
    <div className="flex gap-4">
      <Pressable className="p-4 bg-(--bg-elevated) border border-(--border-primary) rounded-lg cursor-pointer">
        <p className="text-(--text-primary)">Click or hover me!</p>
      </Pressable>
      <Pressable className="p-4 bg-(--accent-primary) text-white rounded-lg cursor-pointer">
        <p>Primary button style</p>
      </Pressable>
    </div>
  ),
};
