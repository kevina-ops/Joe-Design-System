import React from 'react';
import { Coffee, ArrowRight, Trash } from '@phosphor-icons/react';
import { Button } from './button';

export default {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      description: 'Visual style from Joe design tokens',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'Size from spacing/typography tokens',
    },
    disabled: {
      control: 'boolean',
    },
    leftIcon: { table: { disable: true } },
    rightIcon: { table: { disable: true } },
  },
};

export const Default = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Variants = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

export const Sizes = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" leftIcon={<Coffee size={20} />} aria-label="Coffee" />
    </div>
  ),
};

export const WithLeftIcon = {
  args: {
    children: 'Start order',
    variant: 'primary',
    leftIcon: <Coffee size={20} weight="fill" />,
  },
};

export const WithRightIcon = {
  args: {
    children: 'Continue',
    variant: 'primary',
    rightIcon: <ArrowRight size={20} />,
  },
};

export const DestructiveWithIcon = {
  args: {
    children: 'Delete',
    variant: 'destructive',
    leftIcon: <Trash size={20} />,
  },
};

export const Disabled = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    disabled: true,
  },
};

export const IconOnly = {
  args: {
    variant: 'primary',
    size: 'icon',
    leftIcon: <Coffee size={22} weight="fill" />,
    'aria-label': 'Coffee',
  },
};
