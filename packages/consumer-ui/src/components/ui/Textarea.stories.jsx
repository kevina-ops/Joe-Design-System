import React from 'react';
import { Textarea } from './textarea';

export default {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export const Default = {
  args: {
    placeholder: 'Type your message here...',
  },
};

export const Disabled = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
  },
};
